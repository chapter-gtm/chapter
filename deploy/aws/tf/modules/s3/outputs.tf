# tf/modules/s3/outputs.tf

output "app_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.app_bucket.bucket
}
