# tf/modules/jumpbox/outputs.tf

output "jumpbox_id" {
  description = "ID of the Jumpbox EC2 instance"
  value       = aws_instance.ec2_jumpbox.id
}
