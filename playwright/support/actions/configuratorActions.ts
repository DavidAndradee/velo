import { Page, expect } from '@playwright/test'

/** Dados do formulário de checkout (CT04 e cenários similares). */
export type CheckoutData = {
  name: string
  surname: string
  email: string
  phone: string
  cpf: string
  /** Texto ou regex passado a `getByRole('option', { name })` para a loja de retirada. */
  pickupStoreOption: string | RegExp
}

/** Regex para valor formatado em pt-BR (aceita espaço comum ou estreito entre R$ e dígitos). */
const pricePattern = (digits: string) => new RegExp(`R\\$\\s*${digits.replace(/\./g, '\\.')}`)

export function createConfiguratorActions(page: Page) {
  /** Reutilizado em `open` e `openConfiguratorPage`. */
  const landingHeading = page.getByRole('heading', { name: 'Velô Sprint', level: 1 })

  /** Reutilizado em `configureAeroWheelsWithoutOptionals` e `runCt02PricingDynamicFlow`. */
  const totalPrice = page.getByTestId('total-price')
  const fluxCheckbox = page.getByRole('checkbox', { name: /Flux Capacitor/ })
  const precisionCheckbox = page.getByRole('checkbox', { name: /Precision Park/ })

  return {
    /** Somente locators compartilhados por mais de uma ação. */
    elements: {
      landingHeading,
      totalPrice,
      fluxCheckbox,
      precisionCheckbox,
    },

    async open() {
      await page.goto('/', { timeout: 50_000 })
      await expect(landingHeading).toBeVisible()

      await page.getByRole('link', { name: 'Configure Agora' }).click()
      await expect(page).toHaveURL(/\/configure/)
      await expect(landingHeading).toBeVisible()
    },

    /** Abre diretamente `/configure` (estado pode vir do persist; use `configureAeroWheelsWithoutOptionals` em seguida). */
    async openConfiguratorPage() {
      await page.goto('/configure', { timeout: 50_000 })
      await expect(page).toHaveURL(/\/configure/)
      await expect(landingHeading).toBeVisible()
    },

    /**
     * CT02 — normaliza Aero + sem opcionais e valida preço base no resumo oficial (`total-price`).
     */
    async configureAeroWheelsWithoutOptionals() {
      await page.getByRole('button', { name: /Aero Wheels/ }).click()

      if (await fluxCheckbox.isChecked()) {
        await fluxCheckbox.click()
      }
      if (await precisionCheckbox.isChecked()) {
        await precisionCheckbox.click()
      }
      await expect(totalPrice).toHaveText(pricePattern('40.000,00'))
    },

    /**
     * CT02 — Precificação dinâmica, rodas, opcionais e cor sem alteração de preço.
     * Pré-requisito: app em `/configure` (chamar `openConfiguratorPage` + `configureAeroWheelsWithoutOptionals` antes).
     */
    async runCt02PricingDynamicFlow() {
      const carExteriorImage = page.getByTestId('car-exterior-image')

      await expect(totalPrice).toHaveText(pricePattern('40.000,00'))

      await page.getByRole('button', { name: 'Glacier Blue' }).click()
      await expect(totalPrice).toHaveText(pricePattern('40.000,00'))
      await expect(carExteriorImage).toHaveAttribute('alt', /glacier-blue/i)
      await expect(carExteriorImage).toHaveAttribute('alt', /aero wheels/i)

      await page.getByRole('button', { name: 'Midnight Black' }).click()
      await expect(totalPrice).toHaveText(pricePattern('40.000,00'))
      await expect(carExteriorImage).toHaveAttribute('alt', /midnight-black/i)

      await page.getByRole('button', { name: 'Lunar White' }).click()
      await expect(totalPrice).toHaveText(pricePattern('40.000,00'))
      await expect(carExteriorImage).toHaveAttribute('alt', /lunar-white/i)

      await page.getByRole('button', { name: /Sport Wheels/ }).click()
      await expect(totalPrice).toHaveText(pricePattern('42.000,00'))
      await expect(carExteriorImage).toHaveAttribute('alt', /sport wheels/i)

      await precisionCheckbox.check()
      await expect(totalPrice).toHaveText(pricePattern('47.500,00'))

      await fluxCheckbox.check()
      await expect(totalPrice).toHaveText(pricePattern('52.500,00'))

      await precisionCheckbox.uncheck()
      await expect(totalPrice).toHaveText(pricePattern('47.000,00'))
    },

    async proceedToCheckout() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click()
      await expect(page).toHaveURL(/\/order/)
    },

    async validateCheckoutPageVisible() {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido', level: 1 })).toBeVisible()
    },

    async fillCheckoutForm(data: CheckoutData) {
      await page.getByTestId('checkout-name').fill(data.name)
      await page.getByTestId('checkout-surname').fill(data.surname)
      await page.getByTestId('checkout-email').fill(data.email)
      await page.getByTestId('checkout-phone').fill(data.phone)
      await page.getByTestId('checkout-cpf').fill(data.cpf)

      await page.getByRole('combobox', { name: 'Loja para Retirada' }).click()
      await page.getByRole('option', { name: data.pickupStoreOption }).click()
    },

    /** À Vista + assert valor R$ 40.000 na última ocorrência (parcela única). */
    async selectPayAtSightAndAssertBaseTotal() {
      await page.getByRole('button', { name: /À Vista/ }).click()
      await expect(page.getByText('R$ 40.000,00').last()).toBeVisible()
    },

    async acceptTerms() {
      await page.getByRole('checkbox', { name: /Li e aceito os Termos de Uso/ }).check()
    },

    async confirmOrder() {
      await page.getByRole('button', { name: 'Confirmar Pedido' }).click()
    },

    async validateSuccessApproved() {
      await expect(page).toHaveURL(/\/success/)
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
      await expect(page.getByText(/VLO-[A-Z0-9]+/)).toBeVisible()
    },
  }
}
