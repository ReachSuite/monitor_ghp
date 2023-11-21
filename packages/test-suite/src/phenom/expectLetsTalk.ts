import { Page, expect } from '@playwright/test';

export default async function expectLetsTalk({ page }: { page: Page }) {
  await expect(page.getByText('See Phenom High-Volume Hiring in Action')).toBeVisible();
  await expect(page.frameLocator('iframe[title="Form 0"]').getByText('Email*')).toBeVisible();
  await expect(
    page
      .frameLocator('iframe[title="Form 0"]')
      .locator('div')
      .filter({ hasText: /^How did you hear about Phenom\?$/ }),
  ).toBeVisible();

  await expect(
    page
      .frameLocator('iframe[title="Form 0"]')
      .locator('label')
      .filter({ hasText: 'I agree to receive communications from Phenom.' }),
  ).toBeVisible();

  await expect(page.frameLocator('iframe[title="Form 0"]').getByRole('button', { name: 'Submit' })).toBeVisible();
}
