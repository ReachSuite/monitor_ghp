import { chromium as playwright } from 'playwright-core';
/**
 * This package is included as Lambda layer, added only via dev dependency
 * for development purposes only.
 */
import chromium from '@sparticuz/chromium';
import { type APIGatewayProxyEvent } from 'aws-lambda';
import { suite, type Page } from '@reachsuite/test-suite';

exports.handler = async (event: APIGatewayProxyEvent) => {
  try {
    console.log('starting test for atrium', event);
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
    await suite({
      page,
    });
    console.log('Test suite worked!');
  } catch (e) {
    console.error('Tests failed', (e as any).message);
  }
};
