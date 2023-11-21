import { Page } from '@playwright/test';

import { expectButton, expectHeaders, expectHeading, expectModalDialog, navigateToExperience } from '../utils';

export default async function beforeEach({ page }: { page: Page }) {
  const response = await navigateToExperience({
    page,
    experienceId: '6672c380',
    url: '**/request-high-volume-hiring-demo',
  });
  expectHeaders(response);
  await expectModalDialog(page);
  await expectHeading(page, '👋 How do You Prefer Candidates Apply for Open Roles?');
  await expectButton(page, 'Through Text Messages');
  await expectButton(page, 'Through Our Website / App');
}
