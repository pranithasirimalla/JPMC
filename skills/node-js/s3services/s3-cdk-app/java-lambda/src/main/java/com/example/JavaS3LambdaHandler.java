package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import java.util.UUID;

public class JavaS3LambdaHandler implements RequestHandler<Object, String> {
    @Override
    public String handleRequest(Object input, Context context) {
        AmazonS3 s3 = AmazonS3ClientBuilder.defaultClient();
        String bucketName = "java-sdk-sample-" + UUID.randomUUID();
        String keyName = "hello_world.txt";
        try {
            s3.createBucket(bucketName);
            s3.putObject(bucketName, keyName, "Hello World!");
            return String.format("Successfully uploaded data to %s/%s", bucketName, keyName);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
