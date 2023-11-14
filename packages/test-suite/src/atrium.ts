import { expect, type Page } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectModalDialog,
  expectDialog,
  SelfClosable,
  expectStepDialog,
  expectText,
} from './utils';
import { CompareScreenshotResult, DialogType } from './types';
import Test from './test';

export default class AtriumSuite extends Test {
  constructor() {
    super('atrium');
  }
  getLabel(): string {
    return this.label;
  }

  async e2e({ page }: { page: Page }): Promise<void> {
    const response = await navigateToExperience({
      page,
      experienceId: 'e066d44c',
      url: '**/app',
    });
    expectHeaders(response);
    await expectModalDialog(page);
    await expectHeading(
      page,
      "It's the middle of the quarter and you're worried your team isn't pacing toward their bookings goal ...",
    );

    await clickButton(page, "UhOh .. let's see how Atrium helps!");

    await expectDialog({
      page,
      text: 'These reps seem to have the most red flags. But, you know Dr. Jacques is struggling the most.',
      closeMethod: new SelfClosable(),
      type: DialogType.Tooltip,
    });

    await page.locator('.action-items-item').first().click();

    await expectStepDialog(
      page,
      `Dr. Jacques is significantly behind where he should be pacing to hit his
    bookings goal for the quarter.`,
    );

    await expectDialog({
      page,
      text: "Launch ✨ Sales Coach ✨: Atrium's AI sales management solution.",
      closeMethod: new SelfClosable(),
      type: DialogType.Tooltip,
    });

    await page.locator('.anomaly-action > .sales-coach-button').first().click();
    await expectText(page, 'High Priority Insights');
    await expect(page.locator('div').filter({ hasText: /^Generating your coaching plan\.\.\.$/ })).toBeVisible();
  }
  async goldenScreenshot({ page, threshold }: { page: Page; threshold: number }): Promise<CompareScreenshotResult> {
    return super.goldenScreenshot({ page, threshold, goldenFile: './screenshots/atrium.png' });
  }
  async navigateToGoldenScreenshotScenario({ page }: { page: Page }): Promise<void> {
    await navigateToExperience({
      page,
      experienceId: 'e066d44c',
      url: '**/app',
    });
    await expectModalDialog(page);
    await expectHeading(
      page,
      "It's the middle of the quarter and you're worried your team isn't pacing toward their bookings goal ...",
    );
  }
}
