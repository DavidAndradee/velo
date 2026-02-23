import { Page, expect } from "@playwright/test"

type OrderStatus = 'APROVADO' | 'EM_ANALISE' | 'REPROVADO'

export class OrderLockupPage {

    constructor(private page: Page) { }

    async fillOrderNumber(orderNumber: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }

    async validateStatusBadge(status: OrderStatus) {
        const statusClasses = {
            APROVADO: {
                background: 'bg-green-100',
                text: 'text-green-700',
                icon: 'lucide-circle-check-big'
            },
            EM_ANALISE: {
                background: 'bg-amber-100',
                text: 'text-amber-700',
                icon: 'lucide-clock'
            },
            REPROVADO: {
                background: 'bg-red-100',
                text: 'text-red-700',
                icon: 'lucide-circle-x'
            }
        } as const

        const classes = statusClasses[status]
        const cssValidation = this.page.getByRole('status').filter({ hasText: status })

        await expect(cssValidation).toHaveClass(new RegExp(classes.background))
        await expect(cssValidation).toHaveClass(new RegExp(classes.text))
        const cssIcon = cssValidation.locator('svg')
        await expect(cssIcon).toHaveClass(new RegExp(classes.icon))
    }
}