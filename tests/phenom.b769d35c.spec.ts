import { Page, expect, test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectDialog,
  expectModalDialog,
  expectButton,
  SelfClosable,
} from './utils';
import { DialogType } from './types';

test.describe('Customer experience test suite for @phenom', () => {
  test.slow();
  test.beforeEach(async ({ page }) => {
    const response = await navigateToExperience({
      page,
      experienceId: 'b769d35c',
      url: '**/request-high-volume-hiring-demo',
    });
    expectHeaders(response);
    await expectModalDialog(page);
    await expectHeading(page, '👋 How do You Prefer Candidates Apply for Open Roles?');
    await expectButton(page, 'Through Text Messages');
    await expectButton(page, 'Through Our Website / App');
  });

  const _expectLetsTalkSection = async (page: Page) => {
    await expect(page.getByText('See Phenom High-Volume Hiring in Action')).toBeVisible();
    await expect(page.frameLocator('iframe[title="Form 0"]').getByText('Email*')).toBeVisible();
    await expect(
      page
        .frameLocator('iframe[title="Form 0"]')
        .locator('div')
        .filter({ hasText: /^How did you hear about Phenom\?$/ })
    ).toBeVisible();

    await expect(
      page
        .frameLocator('iframe[title="Form 0"]')
        .locator('label')
        .filter({ hasText: 'I agree to receive communications from Phenom.' })
    ).toBeVisible();

    await expect(page.frameLocator('iframe[title="Form 0"]').getByRole('button', { name: 'Submit' })).toBeVisible();
  };

  test('Selected option: Customer experience Through Text Messages', async ({ page }) => {
    test.skip(!!process.env.PLAYWRIGHT_BASE_URL);
    await clickButton(page, 'Through Text Messages');
    await page.waitForTimeout(5000);
    await expectDialog({
      page,
      text: `Welcome to Phenom High Volume Hiring! Now, job seekers can easily acquaint themselves with 
      your organization and explore available positions without burdening hiring decision makers.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `With just a couple of taps, they can narrow down their job search to identify relevant
      positions and titles.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `Using location-based job matching, the chatbot effortlessly guides candidates to discover
      nearby job opportunities.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `Job seekers then see a list of relevant job opportunities, prioritized by those that are 
      situated closest to home.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: `After they've expressed interest in a particular job, the chatbot promptly
      \ncollects necessary details to facilitate next steps.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
      locator: 'div',
    });

    await expectDialog({
      page,
      text: `High-Volume Hiring automates the screening process, posing knockout questions that delve deeper
      into the candidate's eligibility.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'And you get to customize what those knock out questions look like based on your criteria!',
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
      text: `The process of scheduling the meeting with the hiring manager is also automated to move the
      hiring process forward faster.`,
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectDialog({
      page,
      text: 'Candidates quickly recieve a confirmation notice that specifies when the call is taking place.',
      type: DialogType.Tooltip,
      closeMethod: new SelfClosable(),
    });

    await expectHeading(
      page,
      `Ready to see how Phenom can help you fast track the hiring process for 
      your managers? Request a personalized demo of High-Volume Hiring today.`
    );
    await clickButton(page, "Let's Talk");
    await _expectLetsTalkSection(page);
  });

  test('Selected option: Customer experience Through Our Website / App', async ({ page }) => {
    test.skip(!!process.env.PLAYWRIGHT_BASE_URL);
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
    Request a personalized demo of High-Volume Hiring today.`
    );
    await clickButton(page, "Let's Talk");
    await _expectLetsTalkSection(page);
  });
});
