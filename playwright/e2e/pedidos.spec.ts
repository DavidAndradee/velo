import { OrderDetails } from '../support/actions/orderLookupActions';
import { test, expect } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers';

test.describe('Consulta de Pedidos', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLookup.open()
  })

  test('Deve realizar a consulta de pedido APROVADO', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-ZIOQEP',
      status: 'APROVADO',
      color: 'Glacier Blue',
      interiorColor: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'test A Araujo',
        email: 'bob@marley.com'
      },
      payment: 'À Vista'
    }

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  });
  test('Deve realizar a consulta de pedido REPROVADO', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-RO66A4',
      status: 'REPROVADO',
      color: 'Midnight Black',
      interiorColor: 'cream',
      wheels: 'sport Wheels',
      customer: {
        name: 'Andra o cara',
        email: 'test@gmail.com'
      },
      payment: 'À Vista'
    }

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)


  });
  test('Deve realizar a consulta de pedido EM ANALISE', async ({ app }) => {

    const order: OrderDetails = {
      number: 'VLO-CYUGFZ',
      status: 'EM_ANALISE',
      color: 'Midnight Black',
      interiorColor: 'cream',
      wheels: 'sport Wheels',
      customer: {
        name: 'andra de araujo',
        email: 'testando@gmail.com'
      },
      payment: 'À Vista'
    }

    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  });
  test('Deve exibir alerta de pedido não encontrado', async ({ app }) => {
    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)
    await app.orderLookup.validateOrderNotFound()

  })
  test('Deve exibir mensagem de quando a entrada é de qualquer formato', async ({ app }) => {
    const orderCode = 'XYZ-999-INVALID'

    await app.orderLookup.searchOrder(orderCode)
    await app.orderLookup.validateOrderNotFound()

  })
  test('Deve manter o botao de buscar pedido desabilitado quando o campo estiver vazio', async ({ app, page }) => {
    const button = app.orderLookup.elements.searchButton
    await expect(button).toBeDisabled()
    await app.orderLookup.elements.orderInput.fill('      ')
    await expect(button).toBeDisabled()

  })

})