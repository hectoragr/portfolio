variable "domain_name" {
  description = "Root domain for the portfolio"
  type        = string
  default     = "hectoragomez.com"
}

variable "aws_region" {
  description = "Primary AWS region"
  type        = string
  default     = "us-east-1"
}

variable "alert_email" {
  description = "Email that receives uptime alarm notifications. The SNS subscription must be confirmed by clicking the link in the first email it sends."
  type        = string
  default     = "hector.agr@gmail.com" # already public in src/config/personal.ts
}

variable "github_repo" {
  description = "GitHub repository in org/repo format (used for OIDC trust policy)"
  type        = string
  default     = "hectoragr/portfolio"
}
