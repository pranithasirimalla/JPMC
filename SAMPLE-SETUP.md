# Sample Multi-Module Project: Infra (CDK) + Service (AWS SDK v2)

Steps:
1. Bootstrap CDK (once per account/region):
   ```bash
   export AWS_REGION=us-east-1
   cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION
   ```
2. Deploy infra:
   ```bash
   cd infra
   mvn -q -DskipTests package
   cdk synth
   cdk deploy
   ```
3. Get bucket name and run service:
   ```bash
   export BUCKET=$(aws cloudformation describe-stacks --stack-name SampleInfraStack \
     --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
   cd ../service-api
   mvn -q -DskipTests package
   java -jar target/service-api-1.0-SNAPSHOT.jar
   ```
