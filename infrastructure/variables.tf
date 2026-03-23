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

variable "github_repo" {
  description = "GitHub repository in org/repo format (used for OIDC trust policy)"
  type        = string
  default     = "hectoragr/portfolio"
}
