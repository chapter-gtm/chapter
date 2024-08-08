# tf/modules/jumpbox/variables.tf

variable "app_name" {
  description = "App name"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_id" {
  description = "Public subnet ID for the jumpbox"
  type        = string
}

variable "security_group_ids" {
  description = "Security group IDs for the jumpbox"
  type        = list(string)
}

variable "ec2_key_pair_name" {
  description = "SSH key name for the EC2 instance"
  type        = string
}
