# tf/modules/ecr/variables.tf

variable "app_name" {
  description = "App name"
  type        = string
}

variable "environment" {
  description = "The environment name (e.g., dev, staging, prod)"
  type        = string
}
