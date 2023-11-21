import { test } from '@playwright/test';

import { revsure } from '@reachsuite/test-suite';

test('Customer experience test suite for @revsure', async ({ page }) => {
  test.slow();
  return revsure.e2e({
    page,
  });
});
