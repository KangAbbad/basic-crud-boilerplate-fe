/**
 * Allows only numeric input on key events
 */
export function allowOnlyNumbers(e: React.KeyboardEvent<HTMLInputElement>): void {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
  const isNumberKey = /^\d$/.test(e.key)

  if (!isNumberKey && !allowedKeys.includes(e.key)) {
    e.preventDefault()
  }
}

/**
 * Allows numeric input with decimal point on key events
 */
export function allowNumbersWithDecimal(e: React.KeyboardEvent<HTMLInputElement>): void {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
  const isNumberKey = /^\d$/.test(e.key)
  const isDecimalPoint = e.key === '.'

  if (!isNumberKey && !isDecimalPoint && !allowedKeys.includes(e.key)) {
    e.preventDefault()
  }
}

/**
 * Sanitizes input to contain only numeric characters
 */
export function sanitizeNumberInput(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Sanitizes input to contain only numeric characters and decimal point
 */
export function sanitizeDecimalInput(value: string): string {
  return value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
}

/**
 * Filters phone input to allow only valid phone number characters
 * Keeps digits, plus sign, hyphens, spaces, and parentheses
 */
export function filterPhoneInput(value: string): string {
  return value.replace(/[^\d+\-\s()]/g, '')
}
