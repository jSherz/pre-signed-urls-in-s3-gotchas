import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

setInterval(async () => {
  try {
    const currentCredentials = await s3Client.config.credentials();

    const now = new Date();

    if (currentCredentials.expiration) {
      const remainingSeconds =
        (currentCredentials.expiration.getTime() - now.getTime()) / 1000;

      console.log(`Your session has ${remainingSeconds} seconds left.`);
    } else {
      console.log("Could not detect how many seconds left in your session.");
    }
  } catch (err) {
    console.error("Failed to check credential expiry", err);
    process.exit(1);
  }
}, 60 * 1000);
