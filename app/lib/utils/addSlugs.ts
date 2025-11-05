import { generateUniqueSlug } from './slugGenerator'

export type EntityWithSlug = {
  id: string
  slug?: string
  name: string
}

export const addSlugs = <T extends EntityWithSlug>(entities: T[]): T[] => {
  const existingSlugs = entities.filter((e): e is T & { slug: string } => !!e.slug).map((e) => e.slug)

  return entities.map((entity) => {
    if (entity.slug) return entity

    const newSlug = generateUniqueSlug(entity.name, existingSlugs)
    existingSlugs.push(newSlug)

    return {
      ...entity,
      slug: newSlug,
    }
  })
}
