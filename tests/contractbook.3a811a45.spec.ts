import { test } from '@playwright/test';

import { contractbook } from '@reachsuite/test-suite';

test('Customer experience test suite for @contractbook', async ({ page }) => {
  test.slow();
  return contractbook.e2e({
    page,
  });
});
