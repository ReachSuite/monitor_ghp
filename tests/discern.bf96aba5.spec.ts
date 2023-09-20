import { test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectStepDialog,
  expectDialog,
  expectText,
  expectUrl,
} from './utils';

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
  await clickButton(page, "Let's Go!");
  await expectDialog(
    page,
    `Let’s assume we are preparing for a Q2 2023 Board meeting.
    \nClick the box and let's take a deeper dive.`
  );
  await page.getByText('Q2-2023 Summary').click();
  await expectStepDialog(
    page,
    "Here you'll see performance data and trends for a specific group of metrics you present to your board."
  );
  await expectDialog(page, 'Let’s take a look at NDR to understand what our lowest performing segments are');
  await page.locator('div:nth-child(6) > div > .ag-cell-wrapper > .ag-group-contracted').click();
  await expectDialog(page, 'Looks like performance is way down for Japan');
  await expectDialog(
    page,
    `Notice a KPI is missing from the table for the upcoming board meeting?
    \nHere's where you can add any KPI you want or customize the view`
  );
  await expectDialog(
    page,
    `Now that you have all your metrics for your board deck,
    you can export the information to Google Slides, Excel, or PDF!`,
    true
  );

  await page.getByRole('button', { name: 'Export' }).click();
  await page.locator('.MuiBackdrop-root').click();
  await expectDialog(page, 'Now click out here to close this drop down so we can keep exploring', true);
  await expectDialog(page, 'Looks like your bookings total is also trending poorly.', true);

  await page
    .getByLabel(
      `Bookings is a forward-looking metric that refers to the value of contracts signed with customers.
      \nIn a nutshell, bookings represent your customers' commitment to pay your business for your services`,
      { exact: true }
    )
    .getByText('Bookings - Total')
    .click();

  await expectDialog(page, 'Here you can break bookings down by any segment.', false);
  await expectDialog(
    page,
    `You can also see which metrics are impacting bookings peformance with coloring noting
    \nwhich ones are trending well or poorly.`,
    false
  );
  await expectDialog(page, 'You can also view a full "impact tree" and get to the root cause of performance.');
  // The callout dialog takes a long time to appear, by design?
  await page.waitForTimeout(6000);
  await expectHeading(
    page,
    'Ready to get to the "so what" of your performance faster when prepping for board meetings?'
  );
  await clickButton(page, "Let's Talk");
  await expectUrl(page, 'https://www.discern.io/schedule-a-demo/');
});
