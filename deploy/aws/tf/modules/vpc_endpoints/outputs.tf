# tf/modules/vpc_endpoints/outputs.tf

output "vpc_endpoint_ids" {
  description = "IDs of the VPC endpoints"
  value       = [
    aws_vpc_endpoint.s3.id,
    aws_vpc_endpoint.cw_logs.id,
    aws_vpc_endpoint.ssm.id,
    aws_vpc_endpoint.secretsmanager.id,
    aws_vpc_endpoint.rds.id,
    aws_vpc_endpoint.redis.id
  ]
}
