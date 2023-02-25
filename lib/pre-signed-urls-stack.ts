import * as cdk from "aws-cdk-lib";
import {
  Aws,
  aws_iam,
  aws_s3,
  aws_s3_deployment,
  CfnOutput,
  Duration,
} from "aws-cdk-lib";
import { AccountRootPrincipal, Effect } from "aws-cdk-lib/aws-iam";
import {
  BlockPublicAccess,
  BucketEncryption,
  IBucket,
} from "aws-cdk-lib/aws-s3";
import { Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PreSignedUrlsStackProps extends cdk.StackProps {}

export class PreSignedUrlsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PreSignedUrlsStackProps) {
    super(scope, id, props);

    const bucket = this.createBucket();
    this.createExpiryTimeCliTestingRole(bucket);
  }

  private createBucket() {
    const bucket = new aws_s3.Bucket(this, "bucket", {
      bucketName: `pre-signed-urls-examples-${Aws.ACCOUNT_ID}-${Aws.REGION}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
    });

    new aws_s3_deployment.BucketDeployment(this, "bucket-files", {
      destinationBucket: bucket,
      sources: [
        Source.data("example1.txt", "Hello, world!"),
        Source.data("example2.txt", "This is a test file."),
        Source.data("example3.txt", "One further file."),
      ],
    });

    new CfnOutput(this, "bucket-output", {
      description: "Used in examples of the pre-signed-urls article.",
      value: bucket.bucketName,
    });

    return bucket;
  }

  private createExpiryTimeCliTestingRole(bucket: IBucket) {
    const role = new aws_iam.Role(this, "expiry-time-cli-testing-role", {
      roleName: "pre-signed-urls-expiry-time-cli-testing",
      assumedBy: new AccountRootPrincipal(),
      description: "Used in the first example of the pre-signed-urls article.",
      maxSessionDuration: Duration.hours(12),
    });

    new CfnOutput(this, "expiry-time-cli-testing-role-output", {
      description: "Used in the first example of the pre-signed-urls article.",
      value: role.roleArn,
    });

    role.addToPolicy(
      new aws_iam.PolicyStatement({
        sid: "AllowUseOfCloudFormationToLookupBucketName",
        effect: Effect.ALLOW,
        actions: ["cloudformation:DescribeStacks"],
        resources: ["*"],
      }),
    );

    role.addToPolicy(
      new aws_iam.PolicyStatement({
        sid: "AllowGettingExampleObjects",
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${bucket.bucketArn}/*`],
      }),
    );
  }
}
