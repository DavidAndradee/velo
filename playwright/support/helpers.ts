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