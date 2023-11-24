import { Page } from '@playwright/test';

import Test from './test';
import { CompareScreenshotResult, DialogType } from './types';
import {
  SelfClosable,
  clickButton,
  expectDialog,
  expectHeaders,
  expectModalDialog,
  navigateToExperience,
} from './utils';

// This test suite is for verifying the functionality of a callout with a waitForClick
// that causes the waitForClick to be automatically closed after a callout is closed.
export default class AutoClickTestSuite extends Test {
  async e2e({ page }: { page: Page }): Promise<void> {
    const response = await navigateToExperience({
      page,
      experienceId: this.settings.experienceId,
      url: this.settings.url,
    });
    expectHeaders(response);

    await expectDialog({
      page,
      text: 'Show Backdrop',
      type: DialogType.Tooltip,
      hasBackdrop: true,
    });

    await expectDialog({
      page,
      text: 'Show Next Widget Button',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'Hightlight + Wait For Click',
      type: DialogType.Tooltip,
    });

    await expectDialog({
      page,
      text: 'Show Next Widget Button + Highlight + Wait For Click',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await clickButton(page, 'B');

    await expectDialog({
      page,
      text: 'Show Backdrop + Highlight + Wait For Click',
      type: DialogType.Tooltip,
      hasBackdrop: true,
    });

    await clickButton(page, '3');

    await expectModalDialog(page);
  }

  async navigateToGoldenScreenshotScenario({ page }: { page: Page }): Promise<void> {
    const response = await navigateToExperience({
      page,
      experienceId: this.settings.experienceId,
      url: this.settings.url,
    });
    expectHeaders(response);
  }

  goldenScreenshot({
    page,
    threshold,
  }: {
    page: Page;
    threshold: number;
    goldenFile: string;
  }): Promise<CompareScreenshotResult> {
    return super.goldenScreenshot({
      page,
      threshold,
      goldenFile: this.settings.goldenFile,
    });
  }
}
