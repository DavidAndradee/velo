import type { CheckoutData } from '../support/actions/configuratorActions'
import { test } from '../support/fixtures'

const checkoutDataCt04: CheckoutData = {
  name: 'João',
  surname: 'Silva',
  email: 'joao.silva@email.com',
  phone: '11987654321',
  cpf: '52998224725',
  pickupStoreOption: /Velô Paulista/,
}

test.describe('CT02 Configurador — precificação dinâmica', () => {
  test('Deve atualizar preço e pré-visualização conforme cor, rodas e opcionais', async ({ app }) => {
    await app.configurator.openConfiguratorPage()
    await app.configurator.configureAeroWheelsWithoutOptionals()
    await app.configurator.runCt02PricingDynamicFlow()
  })



  test('Deve criar pedido à vista com status APROVADO e redirecionar para confirmação', async ({ app }) => {

    await app.configurator.open()
    await app.configurator.configureAeroWheelsWithoutOptionals()
    await app.configurator.proceedToCheckout()
    await app.configurator.validateCheckoutPageVisible()
    await app.configurator.fillCheckoutForm(checkoutDataCt04)
    await app.configurator.selectPayAtSightAndAssertBaseTotal()
    await app.configurator.acceptTerms()
    await app.configurator.confirmOrder()
    await app.configurator.validateSuccessApproved()
  })
})
