import { chromium as playwright } from 'playwright-core';
/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 */
import chromium from '@sparticuz/chromium';
import { type APIGatewayProxyEvent } from 'aws-lambda';
import { type Page } from '@reachsuite/test-suite';

import { type TestSuite } from './types';

exports.handler = async (event: APIGatewayProxyEvent) => {
  try {
    if (event.body) {
      const suite = JSON.parse(event.body) as TestSuite;
      console.log('starting test for atrium', suite.test);
      const browser = await playwright.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });

      const c = await browser.newContext({
        baseURL: process.env.baseUrl,
        viewport: {
          width: 1920,
          height: 1080,
        },
      });
      const page = (await c.newPage()) as Page;
      console.log('Running test suite', suite.test);
      const tests = await import('@reachsuite/test-suite');
      await tests[suite.test]({
        page,
      });
      console.log('Test suite worked!', suite.test);
    } else {
      console.log('No test suite found');
    }
  } catch (e) {
    console.error('Tests failed', (e as any).message);
  }
};
