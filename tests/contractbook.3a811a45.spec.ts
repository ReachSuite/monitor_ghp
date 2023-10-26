import { expect, test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectModalDialog,
  expectDialog,
  SelfClosable,
} from './utils';
import { DialogType } from './types';

test('Customer experience test suite for @contractbook', async ({ page }) => {
  test.slow();
  const response = await navigateToExperience({
    page,
    experienceId: '3a811a45',
    url: '**/templates?language=all&sortBy=%21createdAt',
  });
  expectHeaders(response);
  await expectModalDialog(page);
  await expectHeading(
    page,
    `😩 Wasting hours on manual contract input? Unlock bandwidth
  with Contractbook\'s Smart Templates`
  );

  await expect(page).toHaveScreenshot();

  await clickButton(page, "Let's See It");

  await expectDialog({
    page,
    text: `Working with internal and external contract teams, like outside lawyers? Manage
    all contracts - in house and out - with Contractbook`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: '😎 Alright, ready to access smart templates, jump into this Articles of Assoc doc',
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await page.getByRole('link', { name: 'Articles of Association' }).click();

  await expectDialog({
    page,
    text: `💎 The power of Smart Templates lies in our auto-generated dynamic fields which
    unlock cross-functional data to complete templates in seconds`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: `Smart fields gives you the control to identify which parts of the contract can be
    edited and which are locked 🔒`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: `✍🏻 Each contract needs parties to sign it, of course. Manage all of that here and add
    signatories in a single click`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: `Here you can define what signature type you want on the contract. Let\'s change this one
    from a boring, old drawn sig to a SMS verification 📲`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await page.getByTestId('template-change-signature-type').click();
  await page.locator('label').filter({ hasText: 'SMS Verification' }).first().click();
  await page.getByTestId('save-signature-methods-button').click();
});
