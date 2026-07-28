# Uptime monitoring: a CloudWatch Synthetics canary loads the live site in
# headless Chromium every 4 hours. A failed (or missing) run trips a CloudWatch
# alarm that emails var.alert_email via SNS — one email on failure, one on
# recovery. Screenshots and HAR files from every run land in the artifacts
# bucket and expire after 30 days.

# --- Artifacts bucket ---------------------------------------------------------

resource "aws_s3_bucket" "canary_artifacts" {
  bucket = "hectoragomez-canary-artifacts"

  tags = {
    Project = "portfolio"
  }
}

resource "aws_s3_bucket_public_access_block" "canary_artifacts" {
  bucket = aws_s3_bucket.canary_artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "canary_artifacts" {
  bucket = aws_s3_bucket.canary_artifacts.id

  rule {
    id     = "expire-canary-artifacts"
    status = "Enabled"

    filter {}

    expiration {
      days = 30
    }
  }
}

# --- Canary execution role ----------------------------------------------------
# Minimal version of the managed CloudWatchSyntheticsRole: write artifacts to
# the bucket above, publish SuccessPercent metrics, write Lambda logs.

resource "aws_iam_role" "canary" {
  name = "portfolio-uptime-canary"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project = "portfolio"
  }
}

resource "aws_iam_role_policy" "canary" {
  name = "canary-execution"
  role = aws_iam_role.canary.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "WriteArtifacts"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject"]
        Resource = "${aws_s3_bucket.canary_artifacts.arn}/*"
      },
      {
        Sid      = "GetBucketLocation"
        Effect   = "Allow"
        Action   = "s3:GetBucketLocation"
        Resource = aws_s3_bucket.canary_artifacts.arn
      },
      {
        # The Synthetics runtime calls this at startup to resolve the bucket
        Sid      = "ListBuckets"
        Effect   = "Allow"
        Action   = "s3:ListAllMyBuckets"
        Resource = "*"
      },
      {
        Sid      = "PublishMetrics"
        Effect   = "Allow"
        Action   = "cloudwatch:PutMetricData"
        Resource = "*"
        Condition = {
          StringEquals = {
            "cloudwatch:namespace" = "CloudWatchSynthetics"
          }
        }
      },
      {
        Sid      = "WriteLogs"
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/cwsyn-*"
      }
    ]
  })
}

# --- The canary ---------------------------------------------------------------
# Synthetics requires the script at nodejs/node_modules/<file>.js inside the
# zip. The zip lands in infrastructure/canary.zip (gitignored).

data "archive_file" "canary" {
  type        = "zip"
  output_path = "${path.module}/canary.zip"

  source {
    content  = templatefile("${path.module}/canary/canary.js.tftpl", { domain_name = var.domain_name })
    filename = "nodejs/node_modules/canary.js"
  }
}

resource "aws_synthetics_canary" "uptime" {
  name                 = "portfolio-uptime" # canary names max 21 chars
  artifact_s3_location = "s3://${aws_s3_bucket.canary_artifacts.bucket}/"
  execution_role_arn   = aws_iam_role.canary.arn
  handler              = "canary.handler"
  zip_file             = data.archive_file.canary.output_path
  runtime_version      = "syn-nodejs-puppeteer-16.1" # latest as of 2026-07-27; list: aws synthetics describe-runtime-versions
  start_canary         = true
  delete_lambda        = true # destroy the underlying Lambda with the canary

  success_retention_period = 31 # days
  failure_retention_period = 31

  schedule {
    expression = "rate(4 hours)"
  }

  run_config {
    timeout_in_seconds = 60
  }

  tags = {
    Project = "portfolio"
  }
}

# --- Alerting: alarm → SNS → email -------------------------------------------

resource "aws_sns_topic" "alerts" {
  name = "portfolio-alerts"

  tags = {
    Project = "portfolio"
  }
}

# ⚠️ Stays "pending confirmation" until the link in the email SNS sends to the
# endpoint is clicked. No email arrives from the alarm until then.
resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# treat_missing_data = "breaching" doubles as a watchdog: if the canary stops
# running entirely, the missing datapoint fires the alarm too.
resource "aws_cloudwatch_metric_alarm" "uptime" {
  alarm_name          = "portfolio-uptime-alarm"
  alarm_description   = "hectoragomez.com failed the last canary run (or the canary stopped running)"
  namespace           = "CloudWatchSynthetics"
  metric_name         = "SuccessPercent"
  statistic           = "Average"
  period              = 14400 # 4 h, matches the canary schedule
  evaluation_periods  = 1
  threshold           = 100
  comparison_operator = "LessThanThreshold"
  treat_missing_data  = "breaching"

  dimensions = {
    CanaryName = aws_synthetics_canary.uptime.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn] # site down
  ok_actions    = [aws_sns_topic.alerts.arn] # site recovered

  tags = {
    Project = "portfolio"
  }
}
