provider "aws" {
  region = var.region
}

variable "region" {
  default = "us-east-1"
}

resource "aws_s3_bucket" "app" {
  bucket = "vite-react-app-bucket"
}
