import { test } from '@playwright/test';

import { churnzero } from '@reachsuite/test-suite';

test('Customer experience test suite for @churnzero', async ({ page }) => {
  return churnzero.e2e({
    page,
  });
});
