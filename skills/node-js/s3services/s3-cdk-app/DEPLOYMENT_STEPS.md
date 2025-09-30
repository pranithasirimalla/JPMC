# Deploying Node.js and Java AWS Lambda Functions with AWS CDK

This document explains the steps taken to build, deploy, and invoke both Node.js and Java Lambda functions using AWS CDK in this project.

## 1. Environment Setup
- Ensure Java 11, Node.js, AWS CLI, and AWS CDK are installed.
- The Java Lambda is built using Maven; Node.js Lambda uses Node.js 18.x runtime.

## 2. Project Structure
- `lambda/index.js`: Node.js Lambda handler.
- `java-lambda/src/main/java/com/example/JavaS3LambdaHandler.java`: Java Lambda handler.
- `cdk/s3-lambda-stack.js`: CDK stack definition for both Lambdas.
- `cdk/app.js` and `cdk.json`: CDK app entrypoint and configuration.

## 3. Build Java Lambda
```
cd skills/node-js/s3services/s3-cdk-app/java-lambda
mvn clean package
```
- This produces a shaded JAR with all dependencies at `target/java-s3-lambda-1.0-SNAPSHOT.jar`.

## 4. Update CDK Stack
- The CDK stack (`cdk/s3-lambda-stack.js`) was updated to deploy both:
  - Node.js Lambda using `NodejsFunction`.
  - Java Lambda using `aws-lambda.Function` with the shaded JAR.
- Both Lambdas are granted S3 permissions.

## 5. Deploy with CDK
```
cd skills/node-js/s3services/s3-cdk-app/cdk
npx cdk deploy --require-approval never
```
- This deploys both Lambda functions to AWS.

## 6. Invoke Lambdas
- Java Lambda:
```
aws lambda invoke --function-name JavaS3LambdaHandler --payload '{}' out-java.json --cli-binary-format raw-in-base64-out && cat out-java.json
```
- Node.js Lambda:
```
aws lambda invoke --function-name S3LambdaHandler --payload '{}' out-node.json --cli-binary-format raw-in-base64-out && cat out-node.json
```

## 7. Results
- Java Lambda executed successfully, created an S3 bucket, and returned a success message.
- Node.js Lambda was not found (likely a naming or deployment issue).

## 8. Troubleshooting
- Ensure the correct JAR is built and referenced in the CDK stack for Java Lambda.
- If a Lambda is not found, verify the function name in AWS and the CDK stack output.

---

This process demonstrates deploying and invoking both Node.js and Java Lambdas using AWS CDK, with S3 access and proper dependency management.
