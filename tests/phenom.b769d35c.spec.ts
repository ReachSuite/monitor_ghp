import { test } from '@playwright/test';

import { phenomTextMessage, phenomWebsiteApp } from '@reachsuite/test-suite';

test.describe('Customer experience test suite for @phenom', () => {
  test.slow();
  test('Selected option: Customer experience Through Text Messages', async ({ page }) => {
    test.skip(!!process.env.PLAYWRIGHT_BASE_URL);
    return phenomTextMessage.e2e({ page });
  });

  test('Selected option: Customer experience Through Our Website / App', async ({ page }) => {
    test.skip(!!process.env.PLAYWRIGHT_BASE_URL);
    return phenomWebsiteApp.e2e({
      page,
    });
  });
});
