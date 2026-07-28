terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    # Builds the Synthetics canary zip (monitoring.tf)
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  # Uncomment after creating the state bucket manually:
  # aws s3 mb s3://hectoragomez-terraform-state --region us-east-1
  #
  # backend "s3" {
  #   bucket = "hectoragomez-terraform-state"
  #   key    = "portfolio/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# ACM certificates used by CloudFront must be created in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
