terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" 
}

resource "aws_ecs_cluster" "slot_machine_cluster" {     #resource type and name in terraform
  name = "slot-machine-cluster"                         #actual name of the cluster in aws 
}

