import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

import { ChromeLambdaLayer } from './types';
import {
  s3_CHROME_BUCKET_NAME,
  LAMBDA_MEMORY_SIZE,
  LAMBDA_EXECUTION_TIME_OUT,
  LAMBDA_TEST_SUITE_HANDLER_NAME,
  LAMBDA_RUNTIME,
  LAMBDA_FUNCTION_NAME,
  LAMBDA_CHROME_LAMBDA_LAYER_NAME,
} from './config';

export function createChromeLambdaLayer(
  bucket: aws.s3.Bucket,
  chromeBucketFile: ChromeLambdaLayer,
): aws.lambda.LayerVersion {
  return new aws.lambda.LayerVersion(LAMBDA_CHROME_LAMBDA_LAYER_NAME, {
    compatibleRuntimes: ['nodejs18.x'],
    sourceCodeHash: chromeBucketFile.etag,
    s3Bucket: bucket.bucket,
    s3Key: chromeBucketFile.s3Key,
    description: `${s3_CHROME_BUCKET_NAME} layer`,
    layerName: s3_CHROME_BUCKET_NAME,
  });
}

export function createTestsLambda({
  role,
  layers,
}: {
  role: aws.iam.Role;
  layers: pulumi.Input<pulumi.Input<string>[]>;
}) {
  new aws.lambda.Function(LAMBDA_FUNCTION_NAME, {
    code: new pulumi.asset.FileArchive('./lambda/package'),
    role: role.arn,
    memorySize: LAMBDA_MEMORY_SIZE,
    timeout: LAMBDA_EXECUTION_TIME_OUT,
    handler: LAMBDA_TEST_SUITE_HANDLER_NAME,
    runtime: LAMBDA_RUNTIME,
    layers: layers,
    environment: {
      variables: {
        baseUrl: 'https://dev.rswt.dev',
      },
    },
  });
}
