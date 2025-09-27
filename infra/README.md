# Infra (AWS CDK - Java)

This module defines AWS infrastructure using CDK (Java). It creates an S3 bucket and outputs its name for use by the service module.

Prereqs:
- AWS account & credentials
- CDK bootstrap: `cdk bootstrap aws://ACCOUNT/REGION`

Commands:
- Build: `mvn -q -DskipTests package`
- Synth: `cdk synth`
- Deploy: `cdk deploy`

After deploy, capture the `BucketName` output and set it for the service app: `export BUCKET=<value>`.
