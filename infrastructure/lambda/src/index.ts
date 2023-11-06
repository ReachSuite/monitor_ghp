import { writeFileSync, createReadStream } from 'node:fs';

import { chromium as playwright } from 'playwright-core';
/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 */
import chromium from '@sparticuz/chromium';
import * as AWS from 'aws-sdk';
import { type APIGatewayProxyEvent } from 'aws-lambda';
import { type Page } from '@reachsuite/test-suite';
import pngjs from 'pngjs';

import { type TestSuite } from './types';

const sns = new AWS.SNS();
const s3 = new AWS.S3();

exports.handler = async (event: APIGatewayProxyEvent) => {
  const snsTopicArn = process.env.snsTopic;
  const snsTopicScreenshotArn = process.env.snsTopicScreenshot;
  const s3BucketName = process.env.s3BucketName || '';
  console.log('snsTopicArn', snsTopicArn);
  console.log('snsTopicScreenshotArn', snsTopicScreenshotArn);
  console.log('s3Bs3BucketNameucket', s3BucketName);

  if (!snsTopicArn || !snsTopicScreenshotArn || !s3BucketName) {
    console.error('Missing a valid snsTopic/snsTopicScreenshot/s3BucketName to publish test results');
    return;
  }

  // if (!event.body) {
  //   console.log('event', event);
  //   console.error('Missing function to test', event.body);
  //   return;
  // }

  // if (event.body) {
  //const suite = JSON.parse(event.body) as TestSuite;
  const suite = { test: (event as any).test } as TestSuite;
  console.log(`starting test suite for ${suite.test}`);
  try {
    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const context = await browser.newContext({
      baseURL: process.env.baseUrl,
      viewport: {
        width: 1280,
        height: 720,
      },
    });
    const page = (await context.newPage()) as Page;
    const tests = await import('@reachsuite/test-suite');
    const testSuite = tests[suite.test];
    await testSuite.e2e({ page });
    // Inform test suite succeded.
    await sns
      .publish({
        Message: `Test suite succeded for ${suite.test}`,
        Subject: `\u2600 Test suite succeded for ${suite.test}`,
        TopicArn: snsTopicArn,
      })
      .promise();
    console.log(`Test suite finished for ${suite.test}`);

    // Run golden screenshot test
    try {
      const { mismatchedPixels, diff, screenshot } = await testSuite.goldenScreenshot({
        page,
        threshold: 0.5,
      });

      if (screenshot) {
        await s3
          .putObject({
            Bucket: s3BucketName,
            Key: `screenshots/${suite.test}-diff.png`,
            Body: screenshot,
          })
          .promise();
        console.log('Screenshot saved in S3');
        throw new Error('Found screenshot with different dimension from golden image, is not safe to compare');
      }

      if (mismatchedPixels !== 0) {
        writeFileSync('/tmp/diff.png', pngjs.PNG.sync.write(diff));
        await s3
          .putObject({
            Bucket: s3BucketName,
            Key: `screenshots/${suite.test}-diff.png`,
            Body: createReadStream('/tmp/diff.png'),
          })
          .promise();
        console.log('Screenshot saved in S3');
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
      console.log(`Test suite screenshot finished for ${suite.test}`);
    } catch (e) {
      await sns
        .publish({
          Message: `Test screenshot failed for ${suite.test}, details: ${(e as any).message}`,
          Subject: `\u2614 Test screenshot failed for ${suite.test}`,
          TopicArn: snsTopicScreenshotArn,
        })
        .promise();
      console.error('Tests screenshot failed', (e as any).message);
    }
  } catch (e) {
    await sns
      .publish({
        Message: `\u2614 Test suite failed for ${suite.test}, details: ${(e as any).message}`,
        Subject: `Test suite failed for ${suite.test}`,
        TopicArn: snsTopicArn,
      })
      .promise();
    console.error('Tests failed', (e as any).message);
  }
  //}
};
