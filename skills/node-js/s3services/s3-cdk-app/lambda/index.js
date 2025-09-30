// Lambda function to create an S3 bucket and upload an object
const AWS = require('aws-sdk');
const uuid = require('uuid');

exports.handler = async (event) => {
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const bucketName = 'node-sdk-sample-' + uuid.v4();
  const keyName = 'hello_world-${uuid.v4()}.txt';
  try {
    // Create the bucket
    await s3.createBucket({ Bucket: bucketName }).promise();
    // Upload the object
    await s3.putObject({
      Bucket: bucketName,
      Key: keyName,
      Body: 'Hello World!',
    }).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully uploaded data to ${bucketName}/${keyName}`,
        bucketName,
        keyName,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
