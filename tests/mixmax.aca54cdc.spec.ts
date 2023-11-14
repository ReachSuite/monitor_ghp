import { test } from '@playwright/test';

import { mixmax } from '@reachsuite/test-suite';

test('Customer experience test suite for @mixmax', async ({ page }) => {
  return mixmax.e2e({
    page,
  });
});
