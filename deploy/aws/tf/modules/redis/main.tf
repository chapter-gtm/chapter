# tf/modules/redis/main.tf

resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "${var.app_name}-redis-subnet-group-${var.environment}"
  subnet_ids = var.private_subnets

  tags = {
    Name = "${var.app_name}-redis-subnet-group-${var.environment}"
  }

  depends_on = [var.vpc_id]
}

resource "aws_elasticache_cluster" "redis_cluster" {
  cluster_id           = "${var.app_name}-redis-cluster-${var.environment}"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids = var.security_group_ids

  tags = {
    Name = "${var.app_name}-redis-cluster-${var.environment}"
    Environment = var.environment
  }

  depends_on = [var.vpc_id, aws_elasticache_subnet_group.redis_subnet_group]
}
