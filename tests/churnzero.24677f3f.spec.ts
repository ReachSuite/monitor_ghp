import { test } from '@playwright/test';

import {
  navigateToExperience,
  expectHeaders,
  expectHeading,
  clickButton,
  expectModalDialog,
  expectText,
  expectStepDialog,
  expectClosedModalDialog,
} from './utils';

test('Customer experience test suite for @churnzero', async ({ page }) => {
  const response = await navigateToExperience({
    page,
    experienceId: '24677f3f',
    url: '**/#/app/renewalReports/7/report',
  });
  expectHeaders(response);
  await expectModalDialog(page);
  await expectHeading(page, "Welcome to ChurnZero's Renewal and Forecast Hub!");

  await expectText(
    page,
    `ChurnZero’s Renewal and Forecast Hub is purpose-built to help your CS teams
  confidently predict retention and growth, quantify its direct influence on revenue, and ensure an
  accurate pipeline and strong results.`,
  );

  await expectText(
    page,
    `Before we let you loose to explore, we'll give you a quick tour of the top
  Renewal Hub features.`,
  );

  await clickButton(page, 'Get Started');

  await expectStepDialog(
    page,
    `With the Renewal and Forecast Hub, you can track the forecast and actuals
  of key CS metrics to help mitigate risk, fine-tune growth strategies, and gain predictability.`,
  );

  await expectStepDialog(
    page,
    `Apply filters to view the renewal and forecasting data by team member,
  timeframe, or segment. The calculations are instant, so you can pull real-time leadership and board
  metrics with confidence.`,
  );

  await expectStepDialog(
    page,
    `Test different forecasting approaches. Easily switch between the
  standard Manual forecast model and the ChurnScore forecast, which integrates your predictive
  health score data to improve forecast accuracy.`,
  );

  await expectStepDialog(
    page,
    `And finally, manage the metrics that matter all in one place.
  Quickly view top metrics like NRR, GRR, renewal rate, and revenue churn. ChurnZero\'s Renewal
  and Forecast Hub gives your financial projections and analysis greater predictability with
  purpose-built tools to deliver higher retention.`,
  );

  await expectModalDialog(page);
  await expectHeading(page, 'Ready to take it for a spin?');
  await expectText(
    page,
    `Now it's time for you to give the Renewal and Forecast Hub a try. 
  You'll have full access to the Renewal Hub for the next few minutes. Need more time? Just
  refresh the page. Have fun!`,
  );
  await clickButton(page, 'Get Started');
  await expectClosedModalDialog(page);
});
