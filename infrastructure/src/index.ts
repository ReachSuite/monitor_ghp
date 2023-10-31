import { createChromeBucketFile, createTestsMonitorBucket } from './s3';
import { createChromeLambdaLayer, createTestsLambda } from './lambda';
import { defineLambdaPolicies } from './iam';

/**
 * Define all required permissions (e.g lambda invoke, s3 put files, etc)
 */
const role = defineLambdaPolicies();

/**
 *  Bucket to store all the resources related to the tests monitoring.
 */
const bucket = createTestsMonitorBucket(role);
/**
 * Store chromium in S3
 */
const chromiumFile = createChromeBucketFile(bucket);
/**
 * Create a lambda layer for chromium and playwright-core
 */
const chromeLambdaLayer = createChromeLambdaLayer(bucket, {
  s3Key: chromiumFile.key,
  etag: chromiumFile.etag,
});

/**
 * Create lambda function that executes the test suite
 */
createTestsLambda({
  role,
  layers: [chromeLambdaLayer.arn],
});
