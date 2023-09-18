import { test, expect, Page, chromium } from '@playwright/test';


const disposeDialog = async (page: Page) => {
    await page.waitForSelector('.RS-MuiDialog-container')
    return page.locator('.RS-MuiDialog-container').click()
}



test('Customer experience test suite for @biglittle', async ({ page }) => {
    await chromium.launch({ headless: false, slowMo: 100 });
    const response = await page.goto('https://dev.rswt.dev/go/exp-1113e2ae');
    await page.waitForURL('**/features/revenue-leaks/reports/dashboard')
    const headers = response?.headers()
    expect(headers).toHaveProperty('reachsuite-status')
    expect(headers).toHaveProperty('reachsuite-requestid')
    await expect(page.getByRole('heading')).toHaveText('Welcome to BigLittle\'s Revenup!👋')
    const bookNow = page.getByRole('button', {
        name: 'Begin',
    })
    if (bookNow) {
        await page.waitForTimeout(1000)
        await bookNow.click()
    }
    await expect(page.getByText('We start our journey at the Revenue Engine.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByText('In this module, we help you detect and plug all the leaks across your entire customer lifecycle from marketing, sales and customer success - including renewals and expansions.')).toBeVisible()

    await page.getByLabel('upload picture').click()
    await expect(page.getByText('Revenue leaders can directly see the total revenue at risk across the revenue cycle.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByText('Here you can see the list of all the potential leaks quantified.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByText('You can also see a trend line for the history of leaks.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByText('You can sort by the different stages to look at the leaks at a particular stage.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByText('Please click here to sort by stage.')).toBeVisible()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.locator('div').filter({ hasText: /^Stage$/ }).nth(2).click();
    await expect(page.getByText('Select and apply sort by "Sales Pipeline" stage.')).toBeVisible()
    await page.keyboard.press('Escape')
    await page.locator('div').filter({ hasText: /^Stage$/ }).nth(2).click();
    await page.getByText('Sales Pipeline').click();
    await expect(page.getByText('You can assign a leak to a particular GTM leader or a member from your RevOps team.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByText('Click here to assign this leak to a user.')).toBeVisible()
    await page.waitForTimeout(1000)
    await page.keyboard.press('Escape')
    await page.locator('datatable-body-row').filter({ hasText: 'Deals Stuck in Pipeline' }).getByRole('button').click();
    await expect(page.getByText('Select this user.')).toBeVisible()
    await disposeDialog(page)
    await page.getByRole('option', { name: 'hamad@biglittle.ai' }).locator('div').first().click();
    await expect(page.getByText('The leaks gets assigned to the user and they receive a notification.')).toBeVisible()
    await page.getByLabel('upload picture').click()
    await expect(page.getByRole('heading')).toHaveText('Book a free POC!🚀')
    await expect(page.getByText('To learn more about Revenup, click on the button below for a tailored demo and free POC.')).toBeVisible()
    await expect(page.getByRole('dialog').locator('div').first()).toBeVisible()
    const button = page.getByRole('button', {
        name: 'Book Now!',
    })
    if (button) {
        await page.waitForTimeout(1000)
        await button.click()
    }
    const meetingUrl = 'https://meetings-eu1.hubspot.com/ashok1'
    await page.waitForURL(meetingUrl)
    expect(page.url()).toBe(meetingUrl)
});