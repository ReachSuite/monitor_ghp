import { Page } from '@playwright/test';

import Test from '../test';
import { SelfClosable, clickButton, expectDialog, expectHeading, expectModalDialog } from '../utils';
import { CompareScreenshotResult, DialogType } from '../types';

import expectLetsTalk from './expectLetsTalk';
import beforeEach from './beforeEach';

export default class PhenomWebsiteAppTestSuite extends Test {
  constructor() {
    super('Selected option: Customer experience Through Our Website / App');
  }

  async e2e({ page }: { page: Page }): Promise<void> {
    await beforeEach({
      page,
    });
    await clickButton(page, 'Through Our Website / App');
    await page.waitForTimeout(5000);
    await expectDialog({
      page,
      text: `Welcome to Phenom High Volume Hiring! Now, job seekers can easily acquaint themselves
      with your organization and explore available positions without burdening hiring decision makers.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `With just a couple of taps, they can narrow down their job search to identify relevant
      positions and titles. Choose Material handling`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'Nice! Now Phenom will automatically narrow down jobs related to this job type',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `Using location-based job matching, the Phenom chatbot effortlessly guides candidates
      to discover nearby job opportunities.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'Perfect, now we can use your home address in our automated search',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `Job seekers then see a list of relevant job opportunities, prioritized
      by those that are situated closest to home.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `After they\'ve expressed interest in a particular job, the Phenom chatbot
      promptly collects necessary details to facilitate next steps.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `First name, last name, and email are a few examples of the data Phenom can
      auto-collect from the candidate`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `High-Volume Hiring automates the screening process, posing knockout questions
      that delve deeper into the candidate\'s eligibility.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'In seconds, qualified candidates can receive tentative offers.',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `The process of scheduling the meeting with the hiring manager is also
      automated to move the hiring process forward faster.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'Candidates quickly recieve a confirmation notice that specifies when the call is taking place.',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `At the same time, the hiring manager is notified that they have an interview scheduled with a
      potential hire. And the hiring manager has yet to spend even 1 minute in this process.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `With a tremendous amount of time saved, the hiring manager can quickly review the info gathered by
      the chatbot and get ready for the meeting.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectModalDialog(page);
    await expectHeading(
      page,
      `Ready to see how Phenom can help you fast track the hiring process for your managers?
    Request a personalized demo of High-Volume Hiring today.`,
    );
    await clickButton(page, "Let's Talk");
    await expectLetsTalk({ page });
  }

  async navigateToGoldenScreenshotScenario({ page }: { page: Page }): Promise<void> {
    await beforeEach({
      page,
    });
    await clickButton(page, 'Through Our Website / App');
    await page.waitForTimeout(5000);
    await expectDialog({
      page,
      text: `Welcome to Phenom High Volume Hiring! Now, job seekers can easily acquaint themselves
        with your organization and explore available positions without burdening hiring decision makers.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });
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
      goldenFile: './screenshots/website-app.png',
    });
  }
}
