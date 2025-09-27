# Service API (AWS SDK v2 - Java)

Small Java app using AWS SDK v2 (S3) with Maven.

Usage:
1. Build: `mvn -q -DskipTests package -pl service-api`
2. Set bucket env var from CDK output: `export BUCKET=$(aws cloudformation describe-stacks --stack-name SampleInfraStack --query 'Stacks[0].Outputs[?OutputKey==
`BucketName"].OutputValue' --output text)`
3. Run: `java -jar service-api/target/service-api-1.0-SNAPSHOT.jar` (or pass bucket as first arg)

Credentials/Region:
- Uses default credentials provider chain and `AWS_REGION` (default `us-east-1`).
