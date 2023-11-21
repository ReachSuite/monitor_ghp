import { test } from '@playwright/test';

import { atrium } from '@reachsuite/test-suite';

test('Customer experience test suite for @atrium', async ({ page }) => {
  test.slow();
  return atrium.e2e({
    page,
  });
});
