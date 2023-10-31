import { Page } from '@playwright/test';

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
