# tf/variables.tf

variable "region" {
  description = "AWS Region"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
  default     = "prod"
}

variable "app_name" {
  description = "App name"
  type        = string
  default     = "chapter-app"
}

variable "domain_name" {
  description = "App domain name, used to reference the right certificate"
  type        = string
  default     = "*.chapter.show"
}

variable "ec2_key_pair_name" {
  description = "EC2 key-pair name for the jumpbox"
  type        = string
  default     = "nectar-shri"
}

variable "github_repo" {
  description = "GitHub repository in the format 'owner/repo'"
  type        = string
  default     = "nectar-run/chapter"
}

variable "github_branch" {
  description = "GitHub branch to allow access"
  type        = string
  default     = "main"
}
