import { expect, test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectDialog,
  expectText,
  expectModalDialog,
  expectUrl,
} from './utils';

test('Customer experience test suite for @revsure', async ({ page }) => {
  test.slow();
  const response = await navigateToExperience({
    page,
    experienceId: 'a49d0ba5',
    url: '**/app/sales-pipeline-readiness/unified-funnel-and-pipeline?savedview=DEFAULT&tab=funnel',
  });
  expectHeaders(response);
  await expectModalDialog(page);
  await expectHeading(page, 'Welcome to RevSure!');
  await expectText(
    page,
    `In this demo, you will see how RevSure connects the marketing funnel and sales pipeline for end-to-end funnel
    visibility and intelligence. 
    \nYou will learn which stages in the funnel have a slowdown or leakage, the segments which are
    \nconverting faster, how the lead and pipeline generation efforts are trending and more.`
  );
  await clickButton(page, "Let's Go!");

  await expectDialog({
    page,
    text: `This is the 'Funnel' view - here you see the active leads and opportunities in the funnel,
    stage to stage conversions and velocities along with leakage from every stage.
    \nExplore the view and click into the 'Pipeline' drilldown from the below table
    (it's under here and glowing yellow)`,
  });

  await page.locator('#funnel-table').getByText('Pipeline', { exact: true }).click();

  await expectDialog({
    page,
    text: `Here you see the details of the opportunities in the pipeline stage.
    \nHead over to 'Breakdown' to the right when you are ready.`,
  });

  await page
    .locator('div')
    .filter({ hasText: /^Breakdown$/ })
    .first()
    .click();

  await expectDialog({
    page,
    text: `In breakdown, you get a better understanding of how much early stage vs mid stage vs late stage
      pipeline you have - in terms of both volume and $value.
      \nHead over to the \'Composition\' tab when you are ready.`,
  });

  await page
    .locator('div')
    .filter({ hasText: /^Composition$/ })
    .first()
    .click();

  await expectDialog({
    page,
    text: `In the composition tab, you see what makes up your open pipeline and what each segment\'s
    projected win rate is.
    \nHead over to \'Recommendations\' when you are ready.`,
  });

  await page
    .locator('div')
    .filter({ hasText: /^Recommendations$/ })
    .first()
    .click();

  await expectDialog({
    page,
    text: 'Here you get opportunity recommendations with the highest propensities to convert into bookings.',
  });

  await expectDialog({
    page,
    text: "Let's exit out of the panel and head to 'Addition' view to continue with the demo.",
  });

  await page.getByLabel('close', { exact: true }).locator('svg').click();

  await expectDialog({
    page,
    text: 'Head over here to the Addition tab',
  });

  await page
    .locator('div')
    .filter({ hasText: /^Addition$/ })
    .first()
    .click();

  await expect(
    page.getByText(`Here you see how your lead and pipeline generation efforts across the funnel are trending over time.
  \nHead over to \'Progression\' when you are ready.`)
  ).toBeVisible();

  await page
    .getByText(
      `Here you see how your lead and pipeline generation efforts across the funnel are trending over time.
  \nHead over to \'Progression\' when you are ready.`
    )
    .click();

  await page
    .locator('div')
    .filter({ hasText: /^Progression$/ })
    .first()
    .click();

  await expectDialog({
    page,
    text: `Similarly, in this view you see how lead and pipeline conversion efforts are trending over time.
      \nFinally, head over to the leakage tab to the right`,
  });

  await page
    .locator('div')
    .filter({ hasText: /^Leakage$/ })
    .first()
    .click();

  await expectDialog({
    page,
    text: 'And in this view you see how the leakage from every stage is trending over time',
  });

  await expectModalDialog(page);
  await expectHeading(page, "Thanks for exploring the 'Unified Funnel & Pipeline' module within our platform!");
  await expectText(page, 'Click on the below button to get a full demo.');
  await clickButton(page, 'I Want a Full RevSure Demo');
  await expectUrl(page, 'https://www.revsure.ai/book-demo');
});
