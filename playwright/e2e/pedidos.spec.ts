import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:5173');
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible();
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()

  })

  test('Deve realizar a consulta de pedido APROVADO', async ({ page }) => {

    const order = 'VLO-ZIOQEP'

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    const textPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..')
    await expect(page.getByTestId('order-result-VLO-ZIOQEP')).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order}
        - img
        - text: APROVADO
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: Glacier Blue
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: aero Wheels
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
    await expect(textPedido).toContainText(order, { timeout: 10_000 })

    await expect(page.getByText('APROVADO')).toBeVisible()
    await expect(page.getByText('APROVADO')).toContainText('APROVADO')

  });
  test('Deve realizar a consulta de pedido REPROVADO', async ({ page }) => {

    const order = {
      number: 'VLO-RO66A4',
      color: 'Midnight Black',
      status: 'REPROVADO'
    }


    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    const textPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..')
    await expect(page.getByTestId('order-result-VLO-RO66A4')).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.number}
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

    await expect(page.getByText(order.status)).toBeVisible()
    await expect(page.getByText(order.status)).toContainText(order.status)

  });

  test('Deve exibir alerta de pedido não encontrado', async ({ page }) => {
    const order = generateOrderCode()

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);

  })

})