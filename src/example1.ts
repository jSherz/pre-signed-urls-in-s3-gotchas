import {
  CloudFormationClient,
  DescribeStacksCommand,
} from "@aws-sdk/client-cloudformation";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

(async () => {
  const s3Client = new S3Client({});

  const cfnClient = new CloudFormationClient({});

  const stacks = await cfnClient.send(
    new DescribeStacksCommand({
      StackName: "pre-signed-urls",
    }),
  );

  if (!stacks.Stacks || !stacks.Stacks[0] || !stacks.Stacks[0].Outputs) {
    throw new Error("Could not find stack - have you deployed this project?");
  }

  const command = new GetObjectCommand({
    Bucket: stacks.Stacks[0].Outputs.find(
      (output) => output.OutputKey === "bucketoutput",
    )!.OutputValue!,
    Key: "example1.txt",
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // one hour
  });

  console.log("Here is your URL:", url);
})().catch(console.error);
