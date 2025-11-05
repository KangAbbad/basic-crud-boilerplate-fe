/**
 * Debounce utility to delay function execution
 * Useful for expensive operations like IndexedDB saves
 */

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number
): (...args: TArgs) => void {
  let timeoutID: ReturnType<typeof setTimeout> | null = null

  return (...args: TArgs) => {
    if (timeoutID !== null) {
      clearTimeout(timeoutID)
    }

    timeoutID = setTimeout(() => {
      fn(...args)
      timeoutID = null
    }, delayMs)
  }
}
