import { Page } from '@playwright/test';
import pngjs from 'pngjs';

import { DisposableElement } from './disposableElement';

export enum Keyboard {
  ESCAPE = 'Escape',
}

export enum DialogType {
  Tooltip,
  Default,
}

export interface DialogOptions<T> {
  page: Page;
  text: string | RegExp;
  closeMethod?: DisposableElement<T>;
  timeout?: number;
  type?: DialogType;
  locator?: string;
}

export interface OnScreenshot {
  (screenshot: Buffer): void;
}

export interface CompareScreenshotResult {
  mismatchedPixels: number;
  diff: pngjs.PNG;
  screenshot: Buffer;
}

const availableTests = {
  atrium: 'atrium',
  churnzero: 'churnzero',
  mixmax: 'mixmax',
  contractbook: 'contractbook',
  discern: 'discern',
  revsure: 'revsure',
};

export interface TestSuite {
  test: keyof typeof availableTests;
  action?: string;
}

export interface TestSettings {
  experienceId: string;
  url: string;
  goldenFile: string;
  label: string;
}
