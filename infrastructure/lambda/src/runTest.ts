import { chromium as playwright } from 'playwright-core';
/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 */
import chromium from '@sparticuz/chromium';
import * as AWS from 'aws-sdk';
import { type Page } from '@reachsuite/test-suite';
import { type TestSuite } from '@reachsuite/test-suite';

import { getTestSettings, resolveSuiteFile } from './utils';
import runScreenshotTest from './runScreenshotTest';

const sns = new AWS.SNS();
const s3 = new AWS.S3();

export default async function runTest(suite: TestSuite) {
  const {
    snsTopicArn,
    snsTopicScreenshotArn,
    s3BucketName,
    testTimeout,
    threshold,
    width,
    height,
    runGoldenScreenshotTest,
  } = getTestSettings();

  console.log(`Running test suite for ${suite.test} with threshold: ${threshold} and timeout of ${testTimeout}`);

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    timeout: testTimeout,
  });
  const context = await browser.newContext({
    baseURL: process.env.baseUrl,
    viewport: {
      width,
      height,
    },
  });
  const page = (await context.newPage()) as Page;
  const testSuite = await resolveSuiteFile(suite);
  await testSuite.e2e({ page });
  // Inform test suite succeded.
  await sns
    .publish({
      Message: `Test suite succeded: ${suite.test}, tested scenario: ${testSuite.label}`,
      Subject: `\u2600 Test suite succeded: ${suite.test}`,
      TopicArn: snsTopicArn,
    })
    .promise();
  console.log(`Test suite succeded: ${suite.test}`);
  if (!runGoldenScreenshotTest) {
    console.log('Golden screenshot test skipped');
    return;
  }
  // Run golden screenshot test
  await runScreenshotTest({
    suite,
    page,
    s3,
    sns,
    s3BucketName: s3BucketName!,
    threshold,
    snsTopicScreenshotArn: snsTopicScreenshotArn!,
  });
}
