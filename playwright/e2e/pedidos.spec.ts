import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';
import { OrderLockupPage } from '../support/pages/OrderLockupPage';

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:5173', { timeout: 50_000 });
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()

  })

  test('Deve realizar a consulta de pedido APROVADO', async ({ page }) => {

    const order = {
      number: 'VLO-ZIOQEP',
      color: 'Glacier Blue',
      interiorColor: 'cream',
      wheelType: 'aero Wheels',
      status: 'APROVADO'
    }
   //actions
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.fillOrderNumber(order.number)
   //assertions
    await expect(page.getByTestId('order-result-VLO-ZIOQEP')).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: ${order.interiorColor}
        - paragraph: Rodas
        - paragraph: ${order.wheelType}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: test A Araujo
        - paragraph: Email
        - paragraph: bob@marley.com
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: À Vista
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        `);
//
    const cssValidation = page.getByRole('status').filter({ hasText: order.status })
    await expect(cssValidation).toHaveClass(/bg-green-100 text-green-700/)
    await expect(cssValidation).toHaveClass(/text-green-700/)
    const cssIcon = cssValidation.locator('svg')
    await expect(cssIcon).toHaveClass(/lucide lucide-circle-check-big/)

  });
  test('Deve realizar a consulta de pedido REPROVADO', async ({ page }) => {

    const order = {
      number: 'VLO-RO66A4',
      color: 'Midnight Black',
      status: 'REPROVADO'
    }

  //actions
  const orderLockupPage = new OrderLockupPage(page)
  await orderLockupPage.fillOrderNumber(order.number)
//assertions
    const textPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..')
    await expect(page.getByTestId('order-result-VLO-RO66A4')).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
        - status:
          - img
          - text: REPROVADO
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: sport Wheels
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: Andra o cara
        - paragraph: Email
        - paragraph: test@gmail.com
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: À Vista
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        `);
    await expect(textPedido).toContainText(order.number, { timeout: 10_000 })
//assertions
    await expect(page.getByText(order.status)).toBeVisible()
    await expect(page.getByText(order.status)).toContainText(order.status)
    const cssValidation = page.getByRole('status').filter({ hasText: order.status })
    await expect(cssValidation).toHaveClass(/bg-red-100 text-red-700/)
    const cssIcon = cssValidation.locator('svg')
    await expect(cssIcon).toHaveClass(/lucide-circle-x/)

  });
  test('Deve realizar a consulta de pedido EM ANALISE', async ({ page }) => {

    const order = {
      number: 'VLO-CYUGFZ',
      color: 'Midnight Black',
      status: 'EM_ANALISE'
    }

//actions
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.fillOrderNumber(order.number)
//assertions
    const textPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..')
    await expect(page.getByTestId('order-result-VLO-CYUGFZ')).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: sport Wheels
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: andra de araujo
        - paragraph: Email
        - paragraph: testando@gmail.com
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: À Vista
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        `);
    await expect(textPedido).toContainText(order.number, { timeout: 10_000 })
//assertions
    await expect(page.getByText(order.status)).toBeVisible()
    await expect(page.getByText(order.status)).toContainText(order.status)
    const cssValidation = page.getByRole('status').filter({ hasText: order.status })
    await expect(cssValidation).toHaveClass(/bg-amber-100/)
    await expect(cssValidation).toHaveClass(/text-amber-700/)
    const cssIcon = cssValidation.locator('svg')
    await expect(cssIcon).toHaveClass(/lucide-clock/)

  });
  test('Deve exibir alerta de pedido não encontrado', async ({ page }) => {
    const order = generateOrderCode()
//actions
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.fillOrderNumber(order)
//assertions  
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);

  })

})