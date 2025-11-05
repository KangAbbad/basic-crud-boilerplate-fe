import { getOrganizationInitial } from '~/routes/_root.organizations._index/utils/getOrganizationInitial'

function generateRandomCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateOrderSlug(outletName: string): string {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear()).slice(-2)
  const outletInitial = getOrganizationInitial(outletName)
  const randomCode = generateRandomCode(5)

  return `ORD-${day}${month}${year}-${outletInitial}-${randomCode}`
}

export function generateUniqueSlug(name: string, existingSlugs: string[] = []): string {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  let slug = baseSlug
  let counter = 1

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
