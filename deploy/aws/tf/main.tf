# tf/main.tf
# 
data "aws_caller_identity" "current" {}

locals {
  ecs_task_definition_json = file("../ecs-task-definition-${var.environment}.json")
}

terraform {
  backend "s3" {
    bucket         = "${var.app_name}-tf-backend"     # Replace with your S3 bucket name
    key            = "${var.environment}/state/terraform.tfstate" # Replace with your desired state file path
    region         = var.region                       # Replace with your AWS region
    dynamodb_table = "${var.app_name}-tf-lock-table-${var.environment}"  # Optional: for state locking
    encrypt        = true                             # Encrypt the state file at rest
  }
}

provider "aws" {
  region = var.region
}

module "vpc" {
  source      = "./modules/vpc"
  app_name    = var.app_name
  environment = var.environment
}

module "vpc_endpoints" {
  source             = "./modules/vpc_endpoints"
  app_name           = var.app_name
  environment        = var.environment
  region             = var.region
  vpc_id             = module.vpc.vpc_id
  private_subnets    = module.vpc.private_subnets
  security_group_ids = [module.vpc.rds_security_group_id]
  public_route_table_ids = module.vpc.public_route_table_ids
}

module "alb" {
  source          = "./modules/alb"
  app_name        = var.app_name
  environment     = var.environment
  domain_name     = var.domain_name
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnets
  security_groups = [module.vpc.alb_security_group_id]
}

module "ecr" {
  source                   = "./modules/ecr"
  app_name                 = var.app_name
  environment              = var.environment
} 

module "ecs" {
  source                   = "./modules/ecs"
  app_name                 = var.app_name
  environment              = var.environment
  vpc_id                   = module.vpc.vpc_id
  private_subnets          = module.vpc.private_subnets
  ecs_task_execution_role  = module.iam.ecs_execution_role_arn
  ecs_task_role            = module.iam.ecs_task_role_arn
  alb_target_group_arn     = module.alb.target_group_arn
  security_groups          = [module.vpc.ecs_security_group_id]
  ecs_task_definition_json = local.ecs_task_definition_json
}

module "rds" {
  source             = "./modules/rds"
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnets    = module.vpc.private_subnets
  security_group_ids = [module.vpc.rds_security_group_id]
  app_db_user        = "app_user"
  app_db_name        = "${var.app_name}-db"
}

module "jumpbox" {
  source             = "./modules/jumpbox"
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnet_id   = module.vpc.public_subnets[0]
  security_group_ids = [module.vpc.ec2_jumpbox_security_group_id]
  ec2_key_pair_name  = var.ec2_key_pair_name
}

module "s3" {
  source   = "./modules/s3"
  app_name = var.app_name
  environment = var.environment
}

module "redis" {
  source             = "./modules/redis"
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnets    = module.vpc.private_subnets
  security_group_ids = [module.vpc.redis_security_group_id]
}

module "cloudwatch" {
  source      = "./modules/cloudwatch"
  app_name    = var.app_name
  environment = var.environment
}

module "iam" {
  source                    = "./modules/iam"
  app_name                  = var.app_name
  environment               = var.environment
  region                    = var.region
  aws_account_id            = data.aws_caller_identity.current.account_id
  app_bucket_name           = module.s3.app_bucket_name
  rds_db_id                 = module.rds.rds_db_id
  cloudwatch_log_group_name = module.cloudwatch.cloudwatch_log_group_name
  github_repo               = var.github_repo
  github_branch             = var.github_branch
}
