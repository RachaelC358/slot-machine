
provider "aws" {
  region  = "us-east-1"
  profile = "default"
}

resource "aws_ecr_repository" "slot-machine-repo" {
  name = "slot-machine-repo"
}
s