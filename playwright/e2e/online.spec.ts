import { test, expect } from "@playwright/test";

test('App deve estar online', async ({ page }) => {
    await page.goto('https://velo-andra-test.vercel.app/', {timeout: 50000});
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
})