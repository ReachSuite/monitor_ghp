/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 */

import * as AWS from 'aws-sdk';
import { Context } from 'aws-lambda';
import { type TestSuite } from '@reachsuite/test-suite';

import { getTestSettings, invokeTestLambda, withRetry } from './utils';
import saveGoldenScreenshotFile from './saveGoldenScreenshotFile';
import runTest from './runTest';

const sns = new AWS.SNS();

exports.handler = async (event: TestSuite, context: Context) => {
  if (!(event.test || event.action)) {
    const tests = (process.env.testsToRun || '').split(',');
    if (!tests.length) {
      console.error('Missing tests to run');
      return;
    }
    const lambda = new AWS.Lambda();
    for await (const test of tests) {
      console.log(`Calling lambda test for ${test}`);
      await invokeTestLambda(test, lambda, context);
    }
    // Nothing more to do here after calling each test Lambda.
    return;
  }

  if (event.action === 'golden-screenshots') {
    console.log('Saving golden screenshot');
    await saveGoldenScreenshotFile(event);
    console.log('Done!');
    return;
  }

  await withRetry(() => runTest(event), {
    maxAttempts: 3,
    onFailedAttempt: async (attempt: number) => {
      console.log(`Test suite failed at attempt ${attempt}`);
    },
    onFinalFailure: async (error: string) => {
      const tests = await import('@reachsuite/test-suite');
      const testSuite = tests[event.test];
      const { snsTopicArn } = getTestSettings();
      await sns
        .publish({
          Message: `Test suite failed for: ${event.test}, scenario: ${testSuite.settings.label}.
          Details: ${error}`,
          Subject: `\u2614 Test suite failed for ${event.test}`,
          TopicArn: snsTopicArn,
        })
        .promise();
      console.error(`Test suite failed for ${event.test}, ${error}`);
    },
  });
};
