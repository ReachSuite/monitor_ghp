import { chromium as playwright } from 'playwright-core';
/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 * This function should be executed only when a new golden screenshot is needed.
 * It generates a new golden screenshot file, stored in AWS S3 bucket.
 * IMPORTANT!: There is a manual process to save the file in the screenshots folder of this lambda function.
 */
import chromium from '@sparticuz/chromium';
import * as AWS from 'aws-sdk';
import { TestSuite, type Page } from '@reachsuite/test-suite';

import { getTestSettings, resolveSuiteFile } from './utils';

const s3 = new AWS.S3();

export default async function saveGoldenScreenshotFile(suite: TestSuite) {
  try {
    const { s3BucketName, testTimeout, width, height } = getTestSettings();
    if (!s3BucketName) {
      throw new Error('Missing a valid s3BucketName to generate golden screenshot');
    }
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
    const screenshot = await testSuite.takeInitialGoldenScreenshot({ page });
    if (screenshot) {
      const fileName = `${suite.test}.png`;
      try {
        await s3
          .headObject({
            Bucket: s3BucketName,
            Key: `screenshots/${fileName}`,
          })
          .promise();
        console.log(`Checking screenshot ${fileName} at bucket: ${s3BucketName}`);
      } catch (err) {
        // Try to save the screenshot
        console.log(`Screenshot not found for ${fileName} at bucket: ${s3BucketName}, trying to create one`);
        await s3
          .putObject({
            Bucket: s3BucketName,
            Key: `screenshots/${fileName}`,
            Body: screenshot,
          })
          .promise();
        console.log('Screenshot saved in S3');
      }
    } else {
      console.log(`No golden screenshot generated for ${suite.test}`);
    }
  } catch (e) {
    console.error('Golden screenshot failed.', (e as any).message);
  }
}
