import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import {
  LAMBDA_POLICY_ATTACHMENT_NAME,
  S3_PUT_OBJECTS_POLICY_NAME,
  s3_BUCKET_NAME,
  s3_CHROME_BUCKET_NAME,
} from './config';

export function createTestsMonitorBucket(role: aws.iam.Role): aws.s3.Bucket {
  const bucket = new aws.s3.Bucket(s3_BUCKET_NAME);
  /**
   * Allow to store files in S3 BUCKET (used for storing diff screenshots)
   */

  const s3Policy = new aws.iam.Policy(S3_PUT_OBJECTS_POLICY_NAME, {
    policy: pulumi.interpolate`{
      "Version": "2012-10-17",
      "Statement": [
          {
              "Action": [
                  "s3:PutObject",
                  "s3:GetObject"
              ],
              "Effect": "Allow",
              "Resource": "${bucket.arn}/*"
          }
      ]
  }`,
  });

  /**
   * Attach the policy to the lambda role
   */

  new aws.iam.RolePolicyAttachment(LAMBDA_POLICY_ATTACHMENT_NAME, {
    policyArn: s3Policy.arn,
    role: role,
  });

  return bucket;
}

/**
 * Store the serverless chrome binary and playwright-core in a layer stored in a bucket.
 * This optimizes tha lambda size with the tests.
 */
export function createChromeBucketFile(bucket: aws.s3.Bucket) {
  return new aws.s3.BucketObject(s3_CHROME_BUCKET_NAME, {
    bucket: bucket,
    source: new pulumi.asset.AssetArchive({
      '.': new pulumi.asset.FileArchive('./layers/chrome'),
    }),
  });
}
