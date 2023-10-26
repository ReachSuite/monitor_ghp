import { expect, test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectStepDialog,
  expectDialog,
  expectText,
  expectUrl,
  SelfClosable,
  buildUrl,
} from './utils';
import { DialogType } from './types';

test('Customer experience test suite for @discern', async ({ page, browserName }) => {
  // Skip for Webkit for now
  test.skip(browserName === 'webkit');
  test.slow();
  const response = await navigateToExperience({
    page,
    experienceId: 'bf96aba5',
    url: '**/kpi-retrospectives',
  });
  expectHeaders(response);
  await expectHeading(page, 'Welcome to Discern Operational KPIs!');
  await expectText(
    page,
    `Today, we're going to take you through how to utilize Discern's
    \nRetrospectives to prepare for a quarterly board meeting.`
  );
  await expect(page).toHaveScreenshot();
  await clickButton(page, "Let's Go!");
  await expectDialog({
    page,
    text: "Let’s assume we are preparing for a Q2-2023 Board meeting. Click the box and let's take a deeper dive.",
    type: DialogType.Tooltip,
  });
  await page.getByText('Q2-2023 Summary').click();
  await expectStepDialog(
    page,
    "Here you'll see performance data and trends for a specific group of metrics you present to your board."
  );
  await expectDialog({
    page,
    text: 'Let’s take a look at NDR to understand what our lowest performing segments are',
    type: DialogType.Tooltip,
  });
  await page.locator('div:nth-child(6) > div > .ag-cell-wrapper > .ag-group-contracted').click();
  await expectDialog({
    page,
    text: 'Looks like performance is way down for Japan',
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: `Notice a KPI is missing from the table for the upcoming board meeting?
      \nHere's where you can add any KPI you want or customize the view`,
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: `Now that you have all your metrics for your board deck,
    you can export the information to Google Slides, Excel, or PDF!`,
    type: DialogType.Tooltip,
  });

  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await expectDialog({
    page,
    text: `Looks like your bookings total is also trending poorly.
    Let\'s click into the Bookings - Total KPI to understand why.`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await page
    .getByLabel(
      `Bookings is a forward-looking metric that refers to the value of contracts signed with customers.
      \nIn a nutshell, bookings represent your customers' commitment to pay your business for your services`,
      { exact: true }
    )
    .getByText('Bookings - Total')
    .click();

  await expectDialog({
    page,
    text: 'Here you can break bookings down by any segment.',
    type: DialogType.Tooltip,
  });
  await expectDialog({
    page,
    text: `You can also see which metrics are impacting bookings peformance with coloring noting
    which ones are trending well or poorly.`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });

  await expectDialog({
    page,
    text: `You can also view a full "impact tree" and get to the root cause of performance. 
    Explore this page then click Let\'s Talk to see the full platform.`,
    closeMethod: new SelfClosable(),
    type: DialogType.Tooltip,
  });
  // The callout dialog takes a long time to appear, by design?
  await page.waitForTimeout(6000);
  await expectHeading(
    page,
    'Ready to get to the "so what" of your performance faster when prepping for board meetings?'
  );
  await clickButton(page, "Let's Talk");
  await expectUrl(
    page,
    buildUrl('https://www.discern.io/schedule-a-demo', [
      'utm_campaign=Reach%20Suite%20-%20KPIs',
      'utm_source=reachsuite',
      'utm_medium=tutorial',
      'utm_term=kpi',
    ])
  );
});
