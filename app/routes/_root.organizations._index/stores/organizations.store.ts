import { observable } from '@legendapp/state'
import { useSelector } from '@legendapp/state/react'

import type { OrganizationDTO, OrganizationFormDTO } from '../types/organization.types'

import { addSlugs } from '~/lib/utils/addSlugs'
import { createIndexedDbStorage } from '~/lib/utils/indexedDbStorage'
import { generateUniqueSlug } from '~/lib/utils/slugGenerator'

type SortField = 'name' | 'city' | 'createdAt'
type SortDirection = 'asc' | 'desc'

type OrganizationStoreType = {
  organizationList: OrganizationDTO[]
  selectedOrganization: OrganizationDTO | null
  searchQuery: string
  sortBy: SortField
  sortDirection: SortDirection
  isInitialized: boolean
}

// Initialize with empty store (IndexedDB will load on app mount)
const getInitialState = (): OrganizationStoreType => ({
  organizationList: [],
  selectedOrganization: null,
  searchQuery: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  isInitialized: false,
})

export const organizationStore$ = observable<OrganizationStoreType>(getInitialState())

const indexedDbStorage = createIndexedDbStorage<Omit<OrganizationStoreType, 'isInitialized'>>({
  dbName: 'boilerplate-organizations-db',
  storeName: 'organizations',
  storeKey: 'data',
  version: 1,
})

// Manual save to IndexedDB
const saveToIndexedDb = async (): Promise<void> => {
  try {
    const { isInitialized, ...persistedData } = organizationStore$.get()
    await indexedDbStorage.save(persistedData)
  } catch (error) {
    console.error('Failed to save organizations to IndexedDB:', error)
  }
}

// Load from IndexedDB on app initialization
export const initializeOrganizationsStorage = async (): Promise<void> => {
  try {
    const dbData = await indexedDbStorage.load()
    if (dbData) {
      // Auto-migrate organizations to add slugs if missing
      const organizationList = addSlugs(dbData.organizationList ?? [])
      const selectedOrganization =
        dbData.selectedOrganization ?? (organizationList.length > 0 ? organizationList[0] : null)

      const migratedData: OrganizationStoreType = {
        ...dbData,
        organizationList,
        selectedOrganization,
        isInitialized: true,
      }
      organizationStore$.set(migratedData)
    } else {
      organizationStore$.isInitialized.set(true)
    }
  } catch (error) {
    console.error('Failed to initialize IndexedDB storage:', error)
    organizationStore$.isInitialized.set(true)
  }
}

export const organizationActions = {
  createOrganization: (organization: OrganizationFormDTO): OrganizationDTO => {
    const id = crypto.randomUUID()
    const existingSlugs = organizationStore$.organizationList.get().map((o: OrganizationDTO) => o.slug)
    const newOrganization: OrganizationDTO = {
      ...organization,
      id,
      slug: generateUniqueSlug(organization.name, existingSlugs),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    organizationStore$.organizationList.push(newOrganization)
    saveToIndexedDb()
    return newOrganization
  },

  getOrganizationList: (): OrganizationDTO[] => {
    return organizationStore$.organizationList.get()
  },

  getOrganizationByID: (id: string): OrganizationDTO | undefined => {
    return organizationStore$.organizationList.get().find((o: OrganizationDTO) => o.id === id)
  },

  getOrganizationBySlug: (slug: string): OrganizationDTO | undefined => {
    return organizationStore$.organizationList.get().find((o: OrganizationDTO) => o.slug === slug)
  },

  updateOrganization: (id: string, updates: Partial<Omit<OrganizationDTO, 'id' | 'createdAt'>>): void => {
    const list = organizationStore$.organizationList.get()
    const index = list.findIndex((o: OrganizationDTO) => o.id === id)
    if (index >= 0) {
      const updatedOrganization: OrganizationDTO = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      organizationStore$.organizationList[index].set(updatedOrganization)
      saveToIndexedDb()
    }
  },

  deleteOrganization: (id: string): void => {
    const currentList = organizationStore$.organizationList.get()
    const filteredList = currentList.filter((o: OrganizationDTO) => o.id !== id)
    organizationStore$.organizationList.set(filteredList)
    saveToIndexedDb()
  },

  selectOrganization: (organization: OrganizationDTO | null): void => {
    organizationStore$.selectedOrganization.set(organization)
    saveToIndexedDb()
  },

  setSearchQuery: (query: string): void => {
    organizationStore$.searchQuery.set(query)
  },

  getFilteredOrganizationList: (): OrganizationDTO[] => {
    const list = organizationStore$.organizationList.get()
    const query = (organizationStore$.searchQuery.get() ?? '').toLowerCase()

    if (!query) return list

    return list.filter((organization: OrganizationDTO) => {
      const name = (organization.name ?? '').toLowerCase()
      const city = (organization.city ?? '').toLowerCase()
      const address = (organization.address ?? '').toLowerCase()

      return name.includes(query) || city.includes(query) || address.includes(query)
    })
  },

  setSortBy: (field: SortField): void => {
    organizationStore$.sortBy.set(field)
  },

  setSortDirection: (direction: SortDirection): void => {
    organizationStore$.sortDirection.set(direction)
  },

  getSortedAndFilteredOrganizationList: (): OrganizationDTO[] => {
    const filtered = organizationActions.getFilteredOrganizationList()
    const sortBy = organizationStore$.sortBy.get()
    const direction = organizationStore$.sortDirection.get()

    const sorted = [...filtered].sort((a: OrganizationDTO, b: OrganizationDTO) => {
      let aValue: string | number
      let bValue: string | number

      if (sortBy === 'name') {
        aValue = (a.name ?? '').toLowerCase()
        bValue = (b.name ?? '').toLowerCase()
      } else if (sortBy === 'city') {
        aValue = (a.city ?? '').toLowerCase()
        bValue = (b.city ?? '').toLowerCase()
      } else {
        // createdAt - compare as strings (ISO format)
        aValue = a.createdAt ?? ''
        bValue = b.createdAt ?? ''
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  },
}

// ===== TYPED SELECTOR HOOKS =====

export const useOrganizationList = (): OrganizationDTO[] => {
  const list = useSelector(organizationStore$.organizationList)
  return (Array.isArray(list) ? list : []) as OrganizationDTO[]
}

export const useIsInitialized = (): boolean => {
  return useSelector(organizationStore$.isInitialized) ?? false
}

export const useSearchQuery = (): string => {
  return useSelector(organizationStore$.searchQuery) ?? ''
}

export const useSortBy = (): SortField => {
  return useSelector(organizationStore$.sortBy) ?? 'createdAt'
}

export const useSortDirection = (): SortDirection => {
  return useSelector(organizationStore$.sortDirection) ?? 'desc'
}

export const useSelectedOrganization = (): OrganizationDTO | null => {
  const selected = useSelector(organizationStore$.selectedOrganization)
  return selected ?? null
}
