import { test, expect } from "@playwright/test";

test('App deve estar online', async ({ page }) => {
    await page.goto('http://localhost:5173/', {timeout: 50000});
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
})