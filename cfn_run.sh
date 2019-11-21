#!/usr/bin/env bash

# bucket_name=cc-ops-13860
stack_name=aws-challenge

# aws cloudformation package --template-file template.yaml --output-template-file serverless-output.yaml --s3-bucket $bucket_name
# aws cloudformation deploy --template-file serverless-output.yaml --stack-name $stack_name --capabilities CAPABILITY_NAMED_IAM
aws cloudformation deploy --template-file template.yaml --stack-name $stack_name --capabilities CAPABILITY_NAMED_IAM
