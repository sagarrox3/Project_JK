provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "frontend" {
  name = "react-frontend"
}

resource "aws_ecr_repository" "backend" {
  name = "nestjs-backend"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.33.1" # Check the latest version
  cluster_name    = "ferocious-electro-party"
  cluster_version = "1.27"
  
  vpc_id  = "your-vpc-id"
  subnet_ids = ["subnet-1", "subnet-2", "subnet-3"] # ✅ Correct field name

  eks_managed_node_groups = {  # ✅ Correct field name
    eks_nodes = {
      desired_size = 2
      max_size     = 3
      min_size     = 1
      instance_types = ["t3.medium"]
    }
  }
}