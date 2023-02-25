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

      /*
        Many credential providers default to credentials valid for one hour, so
        purposely refresh this early to watch it happen.
       */
      if (remainingSeconds < 3570) {
        console.log("Forcing credential refresh.");
        const updatedCredentials = await s3Client.config.credentials({
          forceRefresh: true,
        });

        const updatedNow = new Date();

        const updatedRemainingSeconds =
          (updatedCredentials.expiration!.getTime() - updatedNow.getTime()) /
          1000;

        console.log(
          `Your refreshed session has ${updatedRemainingSeconds} seconds left.`,
        );
      }
    } else {
      throw new Error("This example must be run with AWS Identity Centre.");
    }
  } catch (err) {
    console.error("Failed to check credential expiry", err);
    process.exit(1);
  }
}, 1000);
