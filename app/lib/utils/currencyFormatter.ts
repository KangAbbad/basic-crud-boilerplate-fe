export function formatCurrency(value: string): string {
  const numericValue = value.replace(/\D/g, '')
  if (!numericValue) return ''

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseInt(numericValue, 10))
}

export function parseCurrencyInput(value: string): number {
  const numericValue = value.replace(/\D/g, '')
  return numericValue ? parseInt(numericValue, 10) : 0
}
