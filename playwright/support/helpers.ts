import { Page } from '@playwright/test';

export function generateOrderCode() {
    const prefix = 'VL0';
    
    const chars ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomValue = ''
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      randomValue += chars[randomIndex]
    }
    
    return `${prefix}-${randomValue}`
  }

  export async function fillOrderNumber(page: Page, orderNumber: string) {
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderNumber)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()
  }