import { readFileSync } from 'node:fs';

import { Page, expect, Response, Locator } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import pngjs from 'pngjs';

import { DialogOptions, DialogType, Keyboard } from './types';
import { DisposableElement } from './disposableElement';

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
  return expect(page.getByRole('heading', { name: text })).toBeInViewport();
};

export const disposeDialog = async (page: Page, selector?: string | undefined) => {
  const containerSelector = selector || '.RS-MuiBackdrop-root';
  await page.waitForSelector(containerSelector);
  // Don't click directly in the center of the page; if it overlaps with the popup, things are inconsistent.
  return page.locator(containerSelector).click({ position: { x: 5, y: 5 } });
};

export const clickButton = async (page: Page, name: string, timeout: number = 1000) => {
  const button = page
    .getByRole('button', {
      name,
    })
    .first();
  await page.waitForTimeout(timeout);
  return button.click();
};

export const expectStepDialog = async (page: Page, text: string | RegExp, label = 'upload picture') => {
  await expect(
    page.getByText(text, {
      exact: false,
    }),
  ).toBeVisible();
  return page.getByLabel(label).click();
};

export const expectDialog = async <T>({ page, text, closeMethod, type, locator }: DialogOptions<T>) => {
  const elementReference =
    type === DialogType.Default
      ? page.getByText(text)
      : locator
      ? page
          .getByRole('tooltip', {
            name: text,
          })
          .locator(locator)
          .first()
      : page
          .getByRole('tooltip', {
            name: text,
          })
          .getByRole('paragraph');

  await expect(elementReference).toBeVisible();
  if (!closeMethod) {
    return new BackdropClosable().dispose(page);
  }
  return closeMethod.dispose(page, elementReference);
};

export const expectText = async (page: Page, text: string) => {
  return expect(page.getByText(text)).toBeVisible();
};

export const expectButton = async (page: Page, text: string) => {
  return expect(page.getByRole('button', { name: text })).toBeVisible();
};

export const expectModalDialog = async (page: Page) => {
  return expect(page.getByRole('dialog').locator('div').first()).toBeVisible();
};

export const expectClosedModalDialog = async (page: Page) => {
  return expect(page.getByRole('dialog').locator('div').first()).toBeHidden();
};

export const expectUrl = async (page: Page, url: string) => {
  await page.waitForURL(url);
  expect(page.url()).toBe(url);
};

export class BackdropClosable implements DisposableElement<void> {
  constructor(private elementSelector?: string | undefined) {}
  dispose(page: Page): Promise<void> {
    return disposeDialog(page, this.elementSelector);
  }
}

export class KeyboardClosable implements DisposableElement<void> {
  dispose(page: Page): Promise<void> {
    return page.keyboard.press(Keyboard.ESCAPE);
  }
}

export class SelfClosable implements DisposableElement<void | Error> {
  dispose(page?: Page | undefined, locator?: Locator | undefined): Promise<void | Error> {
    if (!locator) {
      throw new Error('Missing locator');
    }
    return locator.click();
  }
}

export const buildUrl = (basePath: string, params: string[]) => {
  return `${basePath}/?${params.join('&')}`;
};

export function compareSnapshots({
  goldenFile,
  currentFile,
  threshold,
}: {
  goldenFile: string;
  currentFile: string;
  threshold: number | undefined;
}) {
  const goldenImage = pngjs.PNG.sync.read(readFileSync(goldenFile));
  const currentImage = pngjs.PNG.sync.read(readFileSync(currentFile));
  if (goldenImage.width !== currentImage.width || goldenImage.height !== currentImage.height) {
    throw new Error('Images must have the same dimensions');
  }
  const diff = new pngjs.PNG({
    width: goldenImage.width,
    height: goldenImage.height,
  });

  // Compare the images using pixelmatch
  const mismatchedPixels = pixelmatch(
    goldenImage.data,
    currentImage.data,
    diff.data,
    goldenImage.width,
    goldenImage.height,
    { threshold },
  );

  return mismatchedPixels;
}
