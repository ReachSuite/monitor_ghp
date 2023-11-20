import { TestSuite } from '@reachsuite/test-suite';
import { Context } from 'aws-lambda';

const REQUIRED_ENVS = ['baseUrl', 'testTimeout', 'threshold', 'width', 'height', 'runGoldenScreenshotTest'];

/**
 * Executes a function with a retry mechanism
 */
export async function withRetry(
  callback: () => any,
  {
    maxAttempts,
    onFailedAttempt,
    onFinalFailure,
  }: {
    maxAttempts: number;
    onFailedAttempt?: (attempt: number) => Promise<any>;
    onFinalFailure?: (error: string) => Promise<any>;
  },
) {
  for (let attempts = 1; attempts <= maxAttempts; attempts++) {
    try {
      await callback();
      attempts = maxAttempts + 1;
    } catch (error) {
      if (onFailedAttempt) {
        await onFailedAttempt(attempts);
      }
      if (attempts === maxAttempts && onFinalFailure) {
        await onFinalFailure((error as any).message);
      }
    }
  }
}

function getEnvironmentSetting<T>({
  setting,
  type = 'string',
  defaultValue,
}: {
  setting: string;
  type?: string;
  required?: boolean;
  defaultValue?: number | boolean | string | undefined;
}): T {
  if (REQUIRED_ENVS.includes(setting) && !defaultValue && !process.env[setting]) {
    throw new Error(`Missing required value: ${setting}`);
  }
  switch (type) {
    case 'number':
      return Number(process.env[setting] || defaultValue) as T;
    case 'boolean':
      return Boolean(process.env[setting] || defaultValue) as T;
    case 'try-boolean':
      return (process.env[setting] === 'true' || defaultValue) as T;
    default:
      return (process.env[setting] || defaultValue) as T;
  }
}

export async function resolveSuiteFile(suite: TestSuite) {
  const tests = await import('@reachsuite/test-suite');
  return tests[suite.test];
}

export function getTestSettings() {
  const snsTopicArn = process.env.snsTopic;
  const snsTopicScreenshotArn = process.env.snsTopicScreenshot;
  const s3BucketName = process.env.s3BucketName;
  const baseUrl = getEnvironmentSetting<string>({
    setting: 'baseUrl',
  });
  const testTimeout = getEnvironmentSetting<number>({
    setting: 'testTimeout',
    defaultValue: 60000,
    type: 'number',
  });
  const threshold = getEnvironmentSetting<number>({
    setting: 'threshold',
    type: 'number',
    defaultValue: 0.3,
  });
  const width = getEnvironmentSetting<number>({
    setting: 'width',
    type: 'number',
    defaultValue: 1280,
  });
  const height = getEnvironmentSetting<number>({
    setting: 'height',
    type: 'number',
    defaultValue: 720,
  });

  const runGoldenScreenshotTest = getEnvironmentSetting<boolean>({
    setting: 'runGoldenScreenshotTest',
    type: 'try-boolean',
    defaultValue: false,
  });

  return {
    snsTopicArn,
    snsTopicScreenshotArn,
    s3BucketName,
    testTimeout,
    threshold,
    baseUrl,
    width,
    height,
    runGoldenScreenshotTest,
  };
}

export async function invokeTestLambda(test: string, lambda: AWS.Lambda, context: Context) {
  try {
    const params = {
      FunctionName: context.functionName,
      InvocationType: 'Event', // Ensure asynchronous invocation
      Payload: JSON.stringify({ test }),
    };
    await lambda.invoke(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(`Lambda ${test} invoked asynchronously.`),
    };
  } catch (error) {
    console.error('Error invoking Lambda function asynchronously:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error invoking Lambda function asynchronously.'),
    };
  }
}
