import { test } from '@playwright/test';

import { clickAnchorChurnzero } from '@reachsuite/test-suite';

test('Autockick experience test suite', async ({ page }) => {
  return clickAnchorChurnzero.e2e({
    page,
  });
});
