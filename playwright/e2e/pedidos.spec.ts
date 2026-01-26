import { test, expect } from '@playwright/test';

test('app deve estar online', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-ZIOQEP')
  await page.getByTestId('search-order-button').click();

  await expect(page.getByRole('paragraph', { name: 'VLO-ZIOQEP' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('paragraph', { name: 'VLO-ZIOQEP' })).toHaveText('VLO-ZIOQEP');
  await expect(page.getByText('APROVADO')).toBeVisible();

});
