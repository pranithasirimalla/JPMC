
const cdk = require('aws-cdk-lib');
const path = require('path');
const lambdaNodejs = require('aws-cdk-lib/aws-lambda-nodejs');
const lambda = require('aws-cdk-lib/aws-lambda');

class S3LambdaStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Lambda function definition using NodejsFunction for bundling
    const s3Lambda = new lambdaNodejs.NodejsFunction(this, 'S3LambdaHandler', {
      entry: path.join(__dirname, '../lambda/index.js'),
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        externalModules: [], // bundle everything
      },
    });

    // Grant S3 permissions to the Lambda function
    s3Lambda.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      actions: ['s3:*'],
      resources: ['*'],
    }));

    // Java Lambda function definition
    const javaLambda = new lambda.Function(this, 'JavaS3LambdaHandler', {
      functionName: 'JavaS3LambdaHandler',
      runtime: cdk.aws_lambda.Runtime.JAVA_11,
      handler: 'com.example.JavaS3LambdaHandler::handleRequest',
      code: lambda.Code.fromAsset(path.join(__dirname, '../java-lambda/target/java-s3-lambda-1.0-SNAPSHOT.jar')),
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    // Grant S3 permissions to the Java Lambda function
    javaLambda.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      actions: ['s3:*'],
      resources: ['*'],
    }));
  }
}

module.exports = { S3LambdaStack };
