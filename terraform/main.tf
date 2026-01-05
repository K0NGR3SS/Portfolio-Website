#joshuamkite module.
#S3 bucket (+ policy, public access block, versioning)
#CloudFront distribution (+ origin access control)
#ACM certificate + validation in us-east-1
#Route53 records (A/AAAA for apex + www) [web:5]

module "static_website" {
  source  = "joshuamkite/static-website-s3-cloudfront-acm/aws"
  version = "2.4.0"

  providers = {
    aws           = aws           #eu-west-1
    aws.us-east-1 = aws.us-east-1 #us-east-1 for ACM/CloudFront
  }

  # CHANGE THIS to your real domain; must already have a public hosted zone
  # in Route53 in this AWS account, e.g. example.com. [web:5]
  domain_name = "cybernazar.com"

  # Sensible defaults; tweak if you want
  deploy_sample_content          = false
  s3_bucket_versioning           = true
  s3_bucket_public_access_block  = true
  cloudfront_price_class         = "PriceClass_100"
  cloudfront_default_root_object = "index.html"
}
