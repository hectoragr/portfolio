# Reference the existing hosted zone instead of creating a new one.
# Run once to import it into Terraform state:
#   terraform import aws_route53_zone.portfolio <ZONE_ID>
# Get the zone ID with: aws route53 list-hosted-zones
resource "aws_route53_zone" "portfolio" {
  name = var.domain_name

  tags = {
    Project = "portfolio"
  }
}

# Root domain → CloudFront
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.portfolio.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}

# www → CloudFront
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.portfolio.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portfolio.domain_name
    zone_id                = aws_cloudfront_distribution.portfolio.hosted_zone_id
    evaluate_target_health = false
  }
}
