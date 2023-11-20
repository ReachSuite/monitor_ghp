import { TestSuite } from '@reachsuite/test-suite';
import { type Page } from '@reachsuite/test-suite';
import AWS from 'aws-sdk';
import pngjs from 'pngjs';

export default async function runScreenshotTest({
  suite,
  page,
  s3,
  sns,
  s3BucketName,
  threshold,
  snsTopicScreenshotArn,
}: {
  suite: TestSuite;
  page: Page;
  s3: AWS.S3;
  sns: AWS.SNS;
  s3BucketName: string;
  threshold: number;
  snsTopicScreenshotArn: string;
}) {
  const tests = await import('@reachsuite/test-suite');
  const testSuite = tests[suite.test];
  const diffBucketKey = `screenshots/${suite.test}-diff.png`;
  const newScreenshotBucketKey = `screenshots/${suite.test}-new-screenshot.png`;

  try {
    const { mismatchedPixels, diff, screenshot } = await testSuite.goldenScreenshot({
      page,
      threshold,
      goldenFile: '', // The golden file is calculated dynamically based on the specific test suite.
    });

    if (mismatchedPixels !== 0) {
      await s3
        .putObject({
          Bucket: s3BucketName!,
          Key: diffBucketKey,
          Body: pngjs.PNG.sync.write(diff!),
        })
        .promise();
      // Save new screenshot
      await s3
        .putObject({
          Bucket: s3BucketName!,
          Key: newScreenshotBucketKey,
          Body: screenshot,
        })
        .promise();
      throw new Error(`Found screenshot diff, mismatched pixels ${mismatchedPixels}`);
    }
    // Inform test suite succeded.
    await sns
      .publish({
        Message: `Test suite screenshot succeded for ${suite.test}`,
        Subject: `\u2600 Test suite screenshot succeded for ${suite.test}`,
        TopicArn: snsTopicScreenshotArn,
      })
      .promise();
    console.log(`Screenshot test suite finished for ${suite.test}`);
  } catch (e) {
    const oneDayInSeconds = 24 * 60 * 60;
    const diffSignedUrl = s3.getSignedUrl('getObject', {
      Bucket: s3BucketName,
      Key: diffBucketKey,
      Expires: oneDayInSeconds,
    });
    const screenshotSignedUrl = s3.getSignedUrl('getObject', {
      Bucket: s3BucketName,
      Key: newScreenshotBucketKey,
      Expires: oneDayInSeconds,
    });
    await sns
      .publish({
        Message: `Test screenshot failed for: ${suite.test}, scenario: ${testSuite.settings.label}.
            Details: ${(e as any).message} \n
            Diff: ${diffSignedUrl}
            New screenshot: ${screenshotSignedUrl}
            `,
        Subject: `\u2614 Test screenshot failed for ${suite.test}`,
        TopicArn: snsTopicScreenshotArn,
      })
      .promise();
    console.error(`Screenshot test suite failed for ${suite.test}`, (e as any).message);
  }
}
