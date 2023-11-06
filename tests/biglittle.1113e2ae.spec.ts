import { test } from '@playwright/test';

import { biglittle } from '@reachsuite/test-suite';

test('Customer experience test suite for @biglittle', async ({ page }) => {
  return biglittle({ page });
});
