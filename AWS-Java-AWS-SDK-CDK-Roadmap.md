# Roadmap: Become Proficient in AWS Services, AWS SDK for Java, and AWS CDK (Java + Maven)

Audience: Java engineers aiming to design, build, deploy, and operate production-grade systems on AWS using the AWS SDK for Java (v2) and AWS CDK with Maven.

Outcome: In 12–16 weeks, build strong proficiency in core AWS services, programmatic access via SDK v2 (sync/async), and infrastructure-as-code with CDK (Java), culminating in deployable, observable, secure applications and reproducible infrastructure.

-------------------------------------------------------------------------------

0) Prerequisites and Setup (Week 0)
- Java and Build:
  - JDK 17+ (21+ recommended), Maven 3.9+, IntelliJ IDEA.
  - Docker Desktop for local emulation (LocalStack/Testcontainers).
- AWS:
  - AWS account with IAM Identity Center or IAM user for programmatic access.
  - Install AWS CLI v2, configure profiles: `aws configure sso` or `aws configure`.
- Tools:
  - AWS CDK v2 CLI: `npm i -g aws-cdk`
  - Observability: CloudWatch Logs Insights basics; JFR/async-profiler locally for performance.
- Git + CI:
  - GitHub Actions or Jenkins for CI/CD.
  - Optional: Terraform familiarity (for contrast), but primary focus on CDK.

Checklist:
- Can assume roles and switch profiles.
- CDK “bootstrap” completed in target accounts/regions: `cdk bootstrap aws://ACCOUNT/REGION`.

-------------------------------------------------------------------------------

1) AWS Foundations for Java Developers (Weeks 1–3)
- Identity, Networking, Core Storage/Compute
  - IAM: roles, policies, permission boundaries, least privilege, IAM Access Analyzer.
  - VPC: subnets, route tables, NAT, security groups, endpoints (S3, DynamoDB), PrivateLink.
  - S3: buckets, prefixes, encryption (SSE-S3/KMS), lifecycle, presigned URLs.
  - EC2: instance types, AMIs, autoscaling, ALB/NLB, user data.
  - RDS & Aurora: engine differences, parameter groups, HA/backup, read replicas.
  - DynamoDB: partition/sort keys, GSIs/LSIs, capacity (on-demand vs provisioned), DAX basics.
- Serverless and Integration
  - Lambda: runtimes (Java 17), cold start strategies, provisioned concurrency, SnapStart.
  - API Gateway: REST vs HTTP APIs, authorizers, throttling, WAF.
  - Messaging: SQS (standard vs FIFO, DLQ), SNS (pub/sub), EventBridge (buses, rules).
  - State and Orchestration: Step Functions basics.
- Observability and Ops
  - CloudWatch: metrics, logs, alarms; Logs Insights queries.
  - CloudTrail & Config: auditing and compliance.
  - KMS & Secrets Manager & SSM Parameter Store: key and secret management.

Hands-on Labs:
- Create a private VPC with public/private subnets, NAT, and VPC endpoints (S3/DynamoDB).
- Deploy a simple Java REST service on EC2 behind an ALB; push logs to CloudWatch.
- Build a serverless pipeline: API Gateway -> Lambda (Java) -> DynamoDB; alarms on errors.

-------------------------------------------------------------------------------

2) AWS SDK for Java v2 Mastery (Weeks 4–6)
- Dependency and Project Structure (Maven)
  - Use AWS SDK v2 BOM to align versions; module-per-service where helpful.

  Example Maven snippet:
  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>bom</artifactId>
        <version>2.25.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>software.amazon.awssdk</groupId>
      <artifactId>s3</artifactId>
    </dependency>
    <dependency>
      <groupId>software.amazon.awssdk</groupId>
      <artifactId>dynamodb</artifactId>
    </dependency>
    <dependency>
      <groupId>software.amazon.awssdk</groupId>
      <artifactId>sts</artifactId>
    </dependency>
  </dependencies>
  ```

- Core Concepts and Best Practices
  - Clients: region, credentials provider chain, connection/timeouts, retries.
  - Sync vs Async: Netty NIO async clients; backpressure; thread pools.
  - Patterns: pagination, waiters, presigned URLs, streaming uploads/downloads.
  - Resilience: exponential backoff, retries, circuit breaker (Resilience4j), idempotency.
  - Auth: STS AssumeRole, SSO credential provider, IAM Roles for Service Accounts (IRSA on EKS).
  - Data modeling: Enhanced DynamoDB Client, AttributeConverters.

  S3 example (sync):
  ```java
  S3Client s3 = S3Client.builder()
      .region(Region.US_EAST_1)
      .credentialsProvider(DefaultCredentialsProvider.create())
      .build();

  s3.putObject(b -> b.bucket("my-bucket").key("hello.txt"),
               RequestBody.fromString("hello world"));

  ResponseBytes<GetObjectResponse> bytes = s3.getObjectAsBytes(b -> b.bucket("my-bucket").key("hello.txt"));
  System.out.println(bytes.asUtf8String());
  ```

  Async example (S3):
  ```java
  S3AsyncClient s3a = S3AsyncClient.builder()
      .region(Region.US_EAST_1)
      .build();

  CompletableFuture<PutObjectResponse> fut = s3a.putObject(
      b -> b.bucket("my-bucket").key("big.dat"),
      AsyncRequestBody.fromFile(Paths.get("big.dat")));

  fut.join();
  ```

- Testing Strategies
  - Unit: mock SDK clients (e.g., using Mockito) or use SDK v2’s test utilities.
  - Local Integration: Testcontainers + LocalStack to emulate S3/SQS/DynamoDB.
  - Contract tests in a sandbox AWS account; use tags and teardown.

  Testcontainers + LocalStack example:
  ```java
  @Testcontainers
  class S3IntegrationTest {
    @Container
    static LocalStackContainer localstack = new LocalStackContainer(DockerImageName.parse("localstack/localstack:2.3"))
        .withServices(LocalStackContainer.Service.S3);

    @Test
    void putAndGetObject() {
      S3Client s3 = S3Client.builder()
          .endpointOverride(localstack.getEndpointOverride(LocalStackContainer.Service.S3))
          .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("test","test")))
          .region(Region.US_EAST_1)
          .build();
      s3.createBucket(b -> b.bucket("t"));
      s3.putObject(b -> b.bucket("t").key("k"), RequestBody.fromString("v"));
      String v = s3.getObjectAsBytes(b -> b.bucket("t").key("k")).asUtf8String();
      assertEquals("v", v);
    }
  }
  ```

-------------------------------------------------------------------------------

3) AWS CDK (Java) Deep Dive (Weeks 7–9)
- CDK Core Concepts
  - App, Stack, Construct tree; L1 (CFN), L2, L3 constructs.
  - Environment (account/region), context, parameters; assets and bundling.
  - Synthesize, diff, deploy, destroy; CDK Aspects; Tags; Permissions boundaries.
  - Bootstrapping and trust model for cross-account deployments.

- Initializing and Building
  - Initialize: `cdk init app --language java`
  - Maven dependencies:
    ```xml
    <dependencies>
      <dependency>
        <groupId>software.amazon.awscdk</groupId>
        <artifactId>aws-cdk-lib</artifactId>
        <version>2.151.0</version>
      </dependency>
      <dependency>
        <groupId>software.constructs</groupId>
        <artifactId>constructs</artifactId>
        <version>10.3.0</version>
      </dependency>
    </dependencies>
    ```

- Example: Serverless Stack (Bucket + Lambda + API)
  ```java
  public class ServerlessStack extends Stack {
    public ServerlessStack(final Construct scope, final String id, final StackProps props) {
      super(scope, id, props);

      Bucket bucket = Bucket.Builder.create(this, "DataBucket")
          .versioned(true)
          .encryption(BucketEncryption.S3_MANAGED)
          .blockPublicAccess(BlockPublicAccess.BLOCK_ALL)
          .build();

      Function fn = Function.Builder.create(this, "ApiFn")
          .runtime(Runtime.JAVA_17)
          .handler("com.example.Handler::handleRequest")
          .memorySize(1024)
          .timeout(Duration.seconds(10))
          .code(Code.fromAsset("../app/target/app.jar"))
          .environment(Map.of("BUCKET", bucket.getBucketName()))
          .build();

      bucket.grantReadWrite(fn);

      RestApi api = RestApi.Builder.create(this, "Api")
          .deployOptions(StageOptions.builder().tracingEnabled(true).build())
          .build();
      api.getRoot().addMethod("GET", new LambdaIntegration(fn));
    }
  }
  ```

- CDK Pipelines and Multi-Account
  - Use CDK Pipelines for CI/CD: synth -> test -> deploy to dev/stage/prod.
  - Cross-account roles and permissions.
  - Store configs in context or SSM Parameter Store.

- Best Practices
  - Keep infra code DRY with custom constructs.
  - Use feature flags/context for environment differences.
  - Tag resources for cost and ownership; use Aspects for org-wide policy.

-------------------------------------------------------------------------------

4) Bringing It Together: Build, Package, Deploy (Weeks 10–11)
- Project Layout (recommended)
  - Multi-module Maven:
    - infra/ (CDK app + stacks)
    - service-api/ (Spring Boot or lightweight JAX-RS)
    - libs/ (shared: SDK clients, DTOs)
  - Use Maven profiles per env: `-Pdev -Pprod` for props and CDK context.

- Build and Image
  - Use Jib or Buildpacks to containerize without Dockerfiles.
  - For Lambda, use shaded JAR and reduce cold start (optimize dependencies).

- Deploy Flows
  - Serverless: `mvn -pl infra cdk:deploy` or `cdk deploy` after `cdk synth`.
  - Containers:
    - ECS Fargate: ECR repo + TaskDef + Service + ALB/Service Connect. Define in CDK.
    - EKS: IRSA for SDK access; deploy manifests via CDK or Helm.
  - Database migrations: Flyway/Liquibase in pipelines.

- Security and Compliance
  - IAM least privilege; scoped KMS CMKs; VPC endpoints; WAF on public APIs.
  - Secrets in Secrets Manager/SSM; never in env vars or code.
  - AWS Config rules and GuardDuty; periodic IAM access analysis.

- Observability
  - Structured logging (JSON); correlation IDs.
  - Metrics (EMF), alarms on SQS DLQ growth, Lambda errors, 5xx on ALB/API.
  - Tracing with X-Ray or OpenTelemetry; ServiceLens dashboards.

-------------------------------------------------------------------------------

5) Advanced Patterns and Services (Week 12+)
- Event-driven: EventBridge routing, fanout with SNS, SQS DLQs, exactly-once with DynamoDB idempotency patterns.
- Orchestration: Step Functions with SDK integrations; callbacks; map states for parallelism.
- Data streaming: Kinesis (producers/consumers, enhanced fan-out), managed Flink.
- Data processing: Glue jobs (Spark); Athena over S3; Lake Formation permissions.
- Multi-region: Route 53 failover, DynamoDB global tables, S3 CRR, Aurora Global.
- Cost: Tagging strategy, Budgets, Trusted Advisor, Savings Plans/RIs.

-------------------------------------------------------------------------------

6) Capstone Projects (2–4 weeks each)
- A) Serverless URL Shortener
  - CDK: API Gateway + Lambda (Java) + DynamoDB; WAF; CloudFront for static site.
  - SDK: presigned URLs for S3 backups; CloudWatch alarms; canary tests.
  - CI/CD: CDK Pipelines to dev -> prod; integration tests on deploy.

- B) Order Processing Microservice (ECS Fargate)
  - CDK: VPC, ECS service, ALB, RDS Aurora, Secrets, SSM parameters.
  - SDK: SQS for order queue, DLQ, idempotent consumers; EventBridge for events.
  - Observability: X-Ray tracing, Logs Insights dashboards; autoscaling policies.

- C) Data Ingestion Pipeline
  - CDK: S3 ingestion bucket, Lambda transforms, DynamoDB store, EventBridge schedules.
  - SDK: S3 multipart upload, DynamoDB Enhanced Client, retries/backoff.
  - Governance: KMS encryption, least-privilege IAM, cost alarms.

-------------------------------------------------------------------------------

7) Weekly Study Plan (Example: 14 Weeks)
- W1: IAM, VPC fundamentals; S3 hands-on.
- W2: EC2, ALB, Auto Scaling; CloudWatch.
- W3: DynamoDB, RDS/Aurora; backup/DR basics.
- W4: Lambda and API Gateway; serverless patterns.
- W5: SDK v2: clients, credentials, retries, pagination.
- W6: SDK v2 async; LocalStack/Testcontainers testing; resilience.
- W7: CDK basics; init app, stacks, constructs; S3/Lambda/API stack.
- W8: CDK advanced: aspects, context, assets, permissions; cross-account.
- W9: CDK Pipelines; multi-env deployment; policy controls.
- W10: CI/CD with Maven + GitHub Actions/Jenkins; packaging; security.
- W11: Observability deep dive; X-Ray, Logs Insights; alarms.
- W12: Project A build-out.
- W13: Project B build-out.
- W14: Hardening, cost optimization, game days.

-------------------------------------------------------------------------------

8) Checklists

Design & Security
- [ ] Explicit regions and credentials providers in SDK clients.
- [ ] IAM least privilege; scoped KMS keys; VPC endpoints for data planes.
- [ ] All data encrypted at rest/in transit; TLS enforced.
- [ ] Secrets in Secrets Manager/SSM; rotation policies.

Reliability & Performance
- [ ] Timeouts, retries, backoff configured; idempotency tokens where applicable.
- [ ] Bounded thread pools; async when IO-bound; avoid blocking in lambdas.
- [ ] DLQs for SQS/Lambda; alarms on failure signals; dashboards.
- [ ] Load/soak tests before production.

CDK & Ops
- [ ] CDK app tagged; aspects for org-wide rules; synth/diff in CI.
- [ ] `cdk bootstrap` per account/region; environment-aware stacks.
- [ ] Automated rollbacks; blue/green or canary deploys.
- [ ] Cost tags and Budgets; cleanup automation for ephemeral stacks.

-------------------------------------------------------------------------------

9) GitHub Actions (Example CI snippets)

- Maven + CDK synth:
  ```yaml
  name: build
  on: [push]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-java@v4
          with: { distribution: temurin, java-version: '21' }
        - run: mvn -B -DskipTests package
        - run: npm i -g aws-cdk
        - run: cdk synth
  ```

- Deploy with OIDC to AWS (recommended):
  ```yaml
  permissions:
    id-token: write
    contents: read
  steps:
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: arn:aws:iam::123456789012:role/GitHubOIDCDeployRole
        aws-region: us-east-1
    - run: cdk deploy --require-approval never
  ```

-------------------------------------------------------------------------------

10) Recommended Resources
- Documentation:
  - AWS SDK for Java v2 Developer Guide
  - AWS CDK Developer Guide (v2), API reference for Java
  - AWS Well-Architected Framework
- Books/Talks:
  - “Cloud Native Patterns” (Richardson), “Release It!” (Nygard)
  - AWS re:Invent talks on serverless, CDK, and observability
- Tools:
  - cdk-nag (CDK aspects for compliance)
  - Prowler/Security Hub for security scanning
  - Smithy (for modeling APIs used by AWS SDKs)

-------------------------------------------------------------------------------

Appendix: Useful Commands
- Configure profile: `aws configure sso` or `aws configure`
- Verify identity: `aws sts get-caller-identity --profile myprof`
- CDK init/synth/deploy:
  - `cdk init app --language java`
  - `cdk bootstrap aws://ACCOUNT/REGION`
  - `cdk synth` / `cdk diff` / `cdk deploy --require-approval never`

Appendix: Common SDK Settings
```java
SdkHttpClient http = ApacheHttpClient.builder()
  .maxConnections(200)
  .connectionTimeout(Duration.ofSeconds(2))
  .build();

S3Client client = S3Client.builder()
  .httpClient(http)
  .overrideConfiguration(c -> c
      .retryPolicy(RetryPolicy.defaultRetryPolicy())
      .apiCallTimeout(Duration.ofSeconds(10)))
  .build();
```

With this roadmap, prioritize building small, end-to-end slices that use both CDK and SDK: define the infra with CDK, deploy via CI, and use SDK v2 from Java code to interact with that infra, all under observability and least-privilege IAM.