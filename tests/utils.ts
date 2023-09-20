import { Page, expect, Response } from '@playwright/test';

import { Keyboard } from './types';

export const navigateToExperience = async ({
  page,
  experienceId,
  url,
}: {
  page: Page;
  experienceId: string;
  url: string | RegExp;
}): Promise<Response | null> => {
  const response = await page.goto(`/go/exp-${experienceId}`);
  await page.waitForURL(url);
  return response;
};

export const expectHeaders = (response: Response | null) => {
  const headers = response?.headers();
  expect(headers).toHaveProperty('reachsuite-status');
  expect(headers).toHaveProperty('reachsuite-requestid');
};

export const expectHeading = async (page: Page, text: string) => {
  return expect(page.getByRole('heading')).toHaveText(text);
};

export const disposeDialog = async (page: Page) => {
  await page.waitForSelector('.RS-MuiDialog-container');
  return page.locator('.RS-MuiDialog-container').click();
};

export const clickButton = async (page: Page, name: string, timeout: number = 1000) => {
  const button = page.getByRole('button', {
    name,
  });
  await page.waitForTimeout(timeout);
  return button.click();
};

export const expectStepDialog = async (page: Page, text: string | RegExp, label = 'upload picture') => {
  await expect(
    page.getByText(text, {
      exact: false,
    })
  ).toBeVisible();
  return page.getByLabel(label).click();
};

export const expectDialog = async (page: Page, text: string | RegExp, useDispose = false, timeout: number = 1000) => {
  await expect(page.getByText(text)).toBeVisible();
  await page.waitForTimeout(timeout);
  if (useDispose) {
    return disposeDialog(page);
  }
  return page.keyboard.press(Keyboard.ESCAPE);
};

export const expectText = async (page: Page, text: string) => {
  return expect(page.getByText(text)).toBeVisible();
};

export const expectModalDialog = async (page: Page) => {
  return expect(page.getByRole('dialog').locator('div').first()).toBeVisible();
};

export const expectUrl = async (page: Page, url: string) => {
  await page.waitForURL(url);
  expect(page.url()).toBe(url);
};
