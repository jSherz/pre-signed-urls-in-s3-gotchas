# pre-signed-urls

This project is an accompaniment to [a blog post on jSherz.com] that describes
common gotchas and pitfalls with using pre-signed URLs in AWS S3, including
workarounds.

[a blog post on jSherz.com]: https://jsherz.com/aws/s3/simple%20storage%20service/2023/02/25/presigned-urls-in-aws-s3-gotchas.html

## Usage

Deploy the project:

```bash
# Choose any method of setting AWS credentials
export AWS_PROFILE=...

# Install dependencies
nvm use 18
corepack enable # if not already run
yarn install

# Deploy it!
npx --no cdk deploy
```
