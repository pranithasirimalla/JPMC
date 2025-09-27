package com.example.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.core.ResponseBytes;

public class Main {
    public static void main(String[] args) {
        String bucket = Optional.ofNullable(System.getenv("BUCKET"))
                        .filter(s -> !s.isBlank())
                        .orElseGet(() -> args.length > 0 ? args[0] : null);
        if (bucket == null || bucket.isBlank()) {
            System.err.println("Usage: export BUCKET=<bucketName> or pass as first argument");
            System.exit(1);
        }
        String regionEnv = Optional.ofNullable(System.getenv("AWS_REGION")).orElse("us-east-1");
        Region region = Region.of(regionEnv);

        S3Client s3 = S3Client.builder()
                .region(region)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        String key = "sample-" + UUID.randomUUID() + ".txt";
        String payload = "Hello from service-api at " + Instant.now();
        s3.putObject(b -> b.bucket(bucket).key(key), RequestBody.fromString(payload, StandardCharsets.UTF_8));
        ResponseBytes<GetObjectResponse> bytes = s3.getObjectAsBytes(b -> b.bucket(bucket).key(key));
        System.out.println("Read back: " + bytes.asUtf8String());
        System.out.println("S3 object key: " + key);
    }
}