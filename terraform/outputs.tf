output "cloudfront_domain_name" {
  description = "CloudFront domain for the website"
  value       = module.static_website.cloudfront_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.static_website.cloudfront_distribution_id
}

output "s3_bucket_id" {
  description = "S3 bucket name for website content"
  value       = module.static_website.s3_bucket_id
}

output "acm_certificate_id" {
  description = "ACM certificate ID used by CloudFront"
  value       = module.static_website.acm_certificate_id
}