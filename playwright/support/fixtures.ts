import { test as base } from '@playwright/test'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createCheckoutActions } from './actions/checkoutActions'
import { mockCreditAnalysis } from './mock.api'
import { createHeroActions } from './actions/heroActions'

type App = {
  orderLookup: ReturnType<typeof createOrderLookupActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  checkout: ReturnType<typeof createCheckoutActions>
  mock: {
    creditAnalysis: (score: number) => Promise<void>
  }
  hero: ReturnType<typeof createHeroActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      orderLookup: createOrderLookupActions(page),
      configurator: createConfiguratorActions(page),
      checkout: createCheckoutActions(page),
      mock: {
        creditAnalysis: async (score: number) => await mockCreditAnalysis(page, score),
      },
      hero: createHeroActions(page),
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'