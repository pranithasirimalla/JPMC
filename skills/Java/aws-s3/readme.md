## Project Requirements: Java AWS CDK S3 Lambda

1. **Initialize an AWS CDK Project (Java):**
	- Set up a new AWS CDK project using Java as the primary language.
	- Ensure all required dependencies for Lambda and S3 are included in the Maven build file.

2. **Implement a Lambda Function (Java):**
	- Write a Java Lambda handler that creates a new S3 bucket (optionally, upload a test object).
	- Package the Lambda with all dependencies (using Maven Shade plugin or similar).

3. **CDK Deployment (Java):**
	- Define the Lambda function as an AWS CDK construct in Java.
	- Grant the Lambda function permissions to create S3 buckets.
	- Deploy the stack using AWS CDK CLI.

4. **Test the Lambda:**
	- Invoke the Lambda function (via AWS Console or CLI) and verify the S3 bucket is created.