/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 */

import * as AWS from 'aws-sdk';
import { Context, type APIGatewayProxyEvent } from 'aws-lambda';
import { type TestSuite } from '@reachsuite/test-suite';

import { getTestSettings, getTestsToRun, invokeTestLambda, withRetry } from './utils';
import saveGoldenScreenshotFile from './saveGoldenScreenshotFile';
import runTest from './runTest';

const sns = new AWS.SNS();

exports.handler = async (event: APIGatewayProxyEvent, context: Context) => {
  if (!((event as any).hasOwnProperty('test') || (event as any).hasOwnProperty('action'))) {
    const tests = getTestsToRun();
    if (!tests.length) {
      console.error('Missing tests to run');
      return;
    }
    const lambda = new AWS.Lambda();
    for await (const test of tests) {
      console.log(`Calling lambda test for ${test}`);
      await invokeTestLambda(test, lambda, context);
    }
    return;
  }

  const suite = { test: (event as any).test, action: (event as any).action } as TestSuite;
  if (suite.action === 'golden-screenshots') {
    console.log('Saving golden screenshot');
    await saveGoldenScreenshotFile(suite);
    console.log('Done!');
    return;
  }

  await withRetry(() => runTest(suite), {
    maxAttempts: 3,
    onFailedAttempt: async (attempt: number) => {
      console.log(`Test suite failed at attempt ${attempt}`);
    },
    onFinalFailure: async (error: string) => {
      const tests = await import('@reachsuite/test-suite');
      const testSuite = tests[suite.test];
      const { snsTopicArn } = getTestSettings();
      await sns
        .publish({
          Message: `Test suite failed for: ${suite.test}, scenario: ${testSuite.label}.
          Details: ${error}`,
          Subject: `\u2614 Test suite failed for ${suite.test}`,
          TopicArn: snsTopicArn,
        })
        .promise();
      console.error(`Test suite failed for ${suite.test}, ${error}`);
    },
  });
};
