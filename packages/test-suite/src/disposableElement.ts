import { Locator, Page } from '@playwright/test';

export interface DisposableElement<T> {
  dispose(page?: Page, locator?: Locator): Promise<T>;
}
