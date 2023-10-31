import { test } from '@playwright/test';

import { suite } from '@reachsuite/test-suite';

test('Customer experience test suite for @atrium', async ({ page }) => {
  test.slow();
  return suite({
    page,
  });
});
