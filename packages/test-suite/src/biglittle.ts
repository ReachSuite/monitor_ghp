import { Page } from '@playwright/test';

import Test from './test';
import { CompareScreenshotResult } from './types';
import {
  SelfClosable,
  clickButton,
  expectDialog,
  expectHeaders,
  expectHeading,
  expectModalDialog,
  expectStepDialog,
  expectText,
  expectUrl,
  navigateToExperience,
} from './utils';

export default class BiglittleTestSuite extends Test {
  async e2e({ page }: { page: Page }): Promise<void> {
    const response = await navigateToExperience({
      page,
      experienceId: this.settings.experienceId,
      url: this.settings.url,
    });
    expectHeaders(response);
    await expectHeading(page, "Welcome to BigLittle's Revenup!👋");
    await clickButton(page, 'Begin');
    await expectStepDialog(page, 'We start our journey at the Revenue Engine.');
    await expectStepDialog(
      page,
      `In this module, we help you detect and plug all the leaks across your entire customer lifecycle
                from marketing, sales and customer success - including renewals and expansions.`,
    );
    await expectStepDialog(
      page,
      'Revenue leaders can directly see the total revenue at risk across the revenue cycle.',
    );
    await expectStepDialog(page, 'Here you can see the list of all the potential leaks quantified.');
    await expectStepDialog(page, 'You can also see a trend line for the history of leaks.');
    await expectStepDialog(page, 'You can sort by the different stages to look at the leaks at a particular stage.');
    await expectDialog({
      page,
      text: 'Please click here to sort by stage.',
      closeMethod: new SelfClosable(),
    });
    await page
      .locator('div')
      .filter({ hasText: /^Stage$/ })
      .nth(2)
      .click();
    await expectDialog({
      page,
      text: 'Select and apply sort by "Sales Pipeline" stage.',
    });
    await page.getByRole('option', { name: 'Sales Pipeline' }).click();
    await expectStepDialog(page, 'You can assign a leak to a particular GTM leader or a member from your RevOps team.');
    await expectDialog({
      page,
      text: 'Click here to assign this leak to a user.',
    });
    await page.locator('datatable-body-row').filter({ hasText: 'Deals Stuck in Pipeline' }).getByRole('button').click();
    await expectDialog({
      page,
      text: 'Select this user.',
    });
    await page.getByRole('option', { name: 'hamad@biglittle.ai' }).locator('div').first().click();
    await expectStepDialog(page, 'The leaks gets assigned to the user and they receive a notification.');
    await expectHeading(page, 'Book a free POC!🚀');
    await expectText(page, 'To learn more about Revenup, click on the button below for a tailored demo and free POC.');
    await expectModalDialog(page);
    await clickButton(page, 'Book Now!');
    await expectUrl(page, 'https://meetings-eu1.hubspot.com/ashok1');
  }
  goldenScreenshot({ page, threshold }: { page: Page; threshold: number }): Promise<CompareScreenshotResult> {
    return super.goldenScreenshot({ page, threshold, goldenFile: this.settings.goldenFile });
  }

  async navigateToGoldenScreenshotScenario({ page }: { page: Page }): Promise<void> {
    const response = await navigateToExperience({
      page,
      experienceId: this.settings.experienceId,
      url: this.settings.url,
    });
    expectHeaders(response);
    await expectHeading(page, "Welcome to BigLittle's Revenup!👋");
  }
}
