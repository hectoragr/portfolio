output "s3_bucket_name" {
  description = "S3 bucket holding the built React files"
  value       = aws_s3_bucket.portfolio.bucket
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain (e.g. d1abc123.cloudfront.net)"
  value       = aws_cloudfront_distribution.portfolio.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — needed for cache invalidations"
  value       = aws_cloudfront_distribution.portfolio.id
}

output "github_actions_role_arn" {
  description = "IAM role ARN to set as AWS_ROLE_ARN secret in GitHub Actions"
  value       = aws_iam_role.github_actions_deploy.arn
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN (us-east-1)"
  value       = aws_acm_certificate.portfolio.arn
}

output "canary_name" {
  description = "Synthetics canary checking the site every 4 h — inspect runs with: aws synthetics get-canary-runs --name <this>"
  value       = aws_synthetics_canary.uptime.name
}

output "alerts_sns_topic_arn" {
  description = "SNS topic that fans uptime alarms out to email"
  value       = aws_sns_topic.alerts.arn
}
