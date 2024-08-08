# tf/modules/redis/outputs.tf

output "redis_endpoint" {
  description = "Endpoint of the Redis cluster"
  value       = aws_elasticache_cluster.redis_cluster.cache_nodes.0.address
}
