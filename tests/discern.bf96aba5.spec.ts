import { test } from '@playwright/test';

import { discern } from '@reachsuite/test-suite';

test('Customer experience test suite for @discern', async ({ page, browserName }) => {
  // Skip for Webkit for now
  test.skip(browserName === 'webkit');
  test.slow();
  return discern.e2e({
    page,
  });
});
