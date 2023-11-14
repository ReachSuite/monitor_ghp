import AtriumSuite from './atrium';
import BiglittleTestSuite from './biglittle';
import ChurnzeroTestSuite from './churnzero';
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
export const atrium = new AtriumSuite();
export const biglittle = new BiglittleTestSuite();
export const churnzero = new ChurnzeroTestSuite();
export const contractbook = new ContractbookTestSuite();
export const discern = new DiscernTestsuite();
export const mixmax = new MixmaxTestSuite();
export const phenomTextMessage = new PhenomTextMessageTestSuite();
export const phenomWebsiteApp = new PhenomWebsiteAppTestSuite();
export const revsure = new RevsureTestSuite();
