import { Page } from '@playwright/test';

import { CompareScreenshotResult } from './types';
import { compareScreenshots } from './utils';

export default abstract class Test {
  constructor(public label: string = '') {}
  abstract e2e({ page }: { page: Page }): Promise<void>;
  async takeInitialGoldenScreenshot({ page }: { page: Page }): Promise<Buffer> {
    await this.navigateToGoldenScreenshotScenario({
      page,
    });
    return page.screenshot();
  }
  abstract navigateToGoldenScreenshotScenario({ page }: { page: Page }): Promise<void>;
  async goldenScreenshot({
    page,
    threshold,
    goldenFile,
  }: {
    page: Page;
    threshold: number;
    goldenFile: string;
  }): Promise<CompareScreenshotResult> {
    await this.navigateToGoldenScreenshotScenario({
      page,
    });
    return compareScreenshots({
      page,
      goldenFile,
      threshold,
    });
  }
}
