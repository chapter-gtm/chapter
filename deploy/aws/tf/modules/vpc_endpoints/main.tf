# tf/modules/vpc_endpoints/main.tf

resource "aws_vpc_endpoint" "s3" {
  vpc_id             = var.vpc_id
  service_name       = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type  = "Gateway"
  route_table_ids    = var.public_route_table_ids

  tags = {
    Name        = "s3-vpc-endpoint"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}

resource "aws_vpc_endpoint" "cw_logs" {
  vpc_id             = var.vpc_id
  service_name       = "com.amazonaws.${var.region}.logs"
  vpc_endpoint_type  = "Interface"
  subnet_ids         = var.private_subnets
  security_group_ids = var.security_group_ids

  tags = {
    Name        = "cw-logs-vpc-endpoint"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}

resource "aws_vpc_endpoint" "ssm" {
  vpc_id             = var.vpc_id
  service_name       = "com.amazonaws.${var.region}.ssm"
  vpc_endpoint_type  = "Interface"
  subnet_ids         = var.private_subnets
  security_group_ids = var.security_group_ids

  tags = {
    Name        = "ssm-vpc-endpoint"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}

resource "aws_vpc_endpoint" "secretsmanager" {
  vpc_id             = var.vpc_id
  service_name       = "com.amazonaws.${var.region}.secretsmanager"
  vpc_endpoint_type  = "Interface"
  subnet_ids         = var.private_subnets
  security_group_ids = var.security_group_ids

  tags = {
    Name        = "secretsmanager-vpc-endpoint"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}

resource "aws_vpc_endpoint" "rds" {
  vpc_id             = var.vpc_id
  service_name       = "com.amazonaws.${var.region}.rds"
  vpc_endpoint_type  = "Interface"
  subnet_ids         = var.private_subnets
  security_group_ids = var.security_group_ids

  tags = {
    Name        = "rds-vpc-endpoint"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}

resource "aws_vpc_endpoint" "redis" {
  vpc_id             = var.vpc_id
  service_name       = "com.amazonaws.${var.region}.elasticache"
  vpc_endpoint_type  = "Interface"
  subnet_ids         = var.private_subnets
  security_group_ids = var.security_group_ids

  tags = {
    Name        = "redis-vpc-endpoint"
    Environment = var.environment
  }

  depends_on = [var.vpc_id]
}
