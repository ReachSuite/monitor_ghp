import { createChromeBucketFile, createTestsMonitorBucket } from './s3';
import { createChromeLambdaLayer, createTestsLambda } from './lambda';
import { defineLambdaPolicies } from './iam';
import { createScheduler } from './eventBridge';
import { createSnsTopicForEmail } from './sns';
import { SNS_TOPIC_DISPLAY_NAME, SNS_TOPIC_EMAIL_SUBSCRIPTIONS, SNS_TOPIC_NAME } from './config';

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

const topic = createSnsTopicForEmail({
  topicName: SNS_TOPIC_NAME,
  displayName: SNS_TOPIC_DISPLAY_NAME,
  subscriptions: SNS_TOPIC_EMAIL_SUBSCRIPTIONS,
});

const screenshotTopic = createSnsTopicForEmail({
  topicName: `${SNS_TOPIC_NAME}-screenshot`,
  displayName: `${SNS_TOPIC_DISPLAY_NAME} Screenshots`,
  subscriptions: SNS_TOPIC_EMAIL_SUBSCRIPTIONS,
});

/**
 * Create lambda function that executes the test suite
 */
const testLambda = createTestsLambda({
  role,
  layers: [chromeLambdaLayer.arn],
  snsTopicArn: topic.arn,
  snsTopicScreenshotArn: screenshotTopic.arn,
  s3BucketName: bucket.bucket,
});

createScheduler(testLambda.arn, role.arn);
