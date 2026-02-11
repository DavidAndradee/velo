import { Page } from "@playwright/test"

export class OrderLockupPage {
    constructor(private page: Page) {}

    async fillOrderNumber(orderNumber: string) {
        await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber)
        await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
    }
}