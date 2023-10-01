import { test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectDialog,
  expectModalDialog,
  SelfClosable,
} from './utils';
import { DialogType } from './types';

test('Customer experience test suite for @mixmax', async ({ page }) => {
  const response = await navigateToExperience({
    page,
    experienceId: 'aca54cdc',
    url: '**/dashboard/sequences/v2/64ea175d0a52572c546d8875/stages',
  });
  expectHeaders(response);
  await expectModalDialog(page);
  await expectHeading(
    page,
    `Here is how we will help your team automate their outreach
  to prospects and customers to build more pipeline.`
  );
  await clickButton(page, "Let's See!");

  await expectDialog({
    page,
    text: 'Here you can select stages to add to your multi-channel outreach sequence.',
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });

  await expectDialog({
    page,
    text: "Let's start by adding a Call task 📞",
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });

  await page.getByTestId('add-stage-icon').getByTestId('CL_Button').click();
  await page.getByTestId('addStage-call').click();
  await expectDialog({
    page,
    text: `From here you can add or modify the call script you for your reps will follow while
  making the call or leaving a voice mail! After you personalize the message, head back to the (+)
  sign to create a new task for sending a Linkedin InMail message to your prospect.`,
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });

  await page.getByTestId('add-stage-icon').getByTestId('CL_Button').click();
  await page.getByTestId('addStage-InMail').click();

  await expectDialog({
    page,
    text: `This is where you can quickly personalize the LinkedIn Inmail by adding more information or
    by indicating something more personally relevant for the prospect. Now let\'s head over to settings
    glowing at the top so you can see how MixMax helps you configure the perfect sequence`,
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });

  await page.locator('a').filter({ hasText: '2settings' }).click();

  await expectDialog({
    page,
    text: 'All of your tracking can be done right here in MixMax',
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });

  await expectDialog({
    page,
    text: "Let's add some recipients to the sequence!",
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });

  await page.locator('a').filter({ hasText: '3recipients' }).click();

  await expectDialog({
    page,
    text: `Finalize your Sequence with the settings you need and simply add your contacts from a CSV or
    from a Salesforce report.`,
    type: DialogType.Tooltip,
    closeMethod: new SelfClosable(),
  });
});
