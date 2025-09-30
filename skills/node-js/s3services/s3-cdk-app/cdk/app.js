const cdk = require('aws-cdk-lib');
const { S3LambdaStack } = require('./s3-lambda-stack');

const app = new cdk.App();
new S3LambdaStack(app, 'S3LambdaStack');
