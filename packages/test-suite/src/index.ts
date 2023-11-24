import AtriumSuite from './atrium';
import BiglittleTestSuite from './biglittle';
import ChurnzeroTestSuite from './churnzero';
import AutoClickTestSuite from './autoclick';
import ContractbookTestSuite from './contractbook';
import DiscernTestsuite from './discern';
import MixmaxTestSuite from './mixmax';
import PhenomTextMessageTestSuite from './phenom/textMessage';
import PhenomWebsiteAppTestSuite from './phenom/websiteApp';
import RevsureTestSuite from './revsure';

/** Test suite exports  */
/**
 * Types
 */
export { type Page, type BrowserContext } from '@playwright/test';
export { type TestSuite } from './types';

/**
 * E2E Tests
 */
export const atrium = new AtriumSuite({
  label: 'Atrium',
  experienceId: 'e066d44c',
  goldenFile: './screenshots/atrium.png',
  url: '**/app',
});
export const biglittle = new BiglittleTestSuite({
  label: 'BigLittle',
  experienceId: '1113e2ae',
  goldenFile: './screenshots/biglittle.png',
  url: '**/features/revenue-leaks/reports/dashboard',
});
export const churnzero = new ChurnzeroTestSuite({
  label: 'ChurnZero',
  experienceId: '24677f3f',
  goldenFile: './screenshots/churnzero.png',
  url: '**/#/app/renewalReports/7/report',
});
export const contractbook = new ContractbookTestSuite({
  label: 'ContractBook',
  experienceId: '3a811a45',
  goldenFile: './screenshots/contractbook.png',
  url: '**/templates?language=all&sortBy=%21createdAt',
});
export const discern = new DiscernTestsuite({
  label: 'Discern',
  experienceId: 'bf96aba5',
  goldenFile: './screenshots/discern.png',
  url: '**/kpi-retrospectives',
});
export const mixmax = new MixmaxTestSuite({
  label: 'MixMax',
  experienceId: 'aca54cdc',
  goldenFile: './screenshots/mixmax.png',
  url: '**/dashboard/sequences/v2/64ea175d0a52572c546d8875/stages',
});
export const phenomTextMessage = new PhenomTextMessageTestSuite({
  label: 'Selected option: Customer experience Through Text Messages',
  experienceId: '6672c380',
  goldenFile: './screenshots/textMessage.png',
  url: '**/request-high-volume-hiring-demo',
});
export const phenomWebsiteApp = new PhenomWebsiteAppTestSuite({
  label: 'Selected option: Customer experience Through Our Website / App',
  experienceId: '6672c380',
  goldenFile: './screenshots/website-app.png',
  url: '**/request-high-volume-hiring-demo',
});
export const revsure = new RevsureTestSuite({
  label: 'Revsure',
  experienceId: 'a49d0ba5',
  goldenFile: './screenshots/revsure.png',
  url: '**/app/sales-pipeline-readiness/unified-funnel-and-pipeline?savedview=DEFAULT&tab=funnel',
});
export const clickAnchorChurnzero = new AutoClickTestSuite({
  label: 'Autoclick',
  experienceId: '570df7f2',
  goldenFile: './screenshots/autoclick.png',
  url: '**/v1/debug/fs/placement.html',
});
