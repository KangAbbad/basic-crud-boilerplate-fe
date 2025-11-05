import { observable } from '@legendapp/state'
import { useSelector } from '@legendapp/state/react'

import type { CreateDataFormDTO, DataDTO, DataStatusDTO, UpdateDataFormDTO } from '../types/crud-template.types'

import { createIndexedDbStorage } from '~/lib/utils/indexedDbStorage'
import { generateOrderSlug } from '~/lib/utils/slugGenerator'
import { useSelectedOrganization } from '~/routes/_root.organizations._index/stores/organizations.store'
import { filterByOrganization } from '~/routes/_root.organizations._index/utils/organizationFiltering'

// ===== DATA STORAGE =====

export type SortField = 'createdAt' | 'name'
export type SortDirection = 'asc' | 'desc'
export type FilterStatus = 'all' | 'draft' | 'completed' | 'cancelled'

type DataStoreType = {
  dataList: DataDTO[]
  selectedData: DataDTO | null
  searchQuery: string
  filterStatus: FilterStatus
  sortBy: SortField
  sortDirection: SortDirection
  isInitialized: boolean
}

const dataIndexedDbStorage = createIndexedDbStorage<Omit<DataStoreType, 'isInitialized'>>({
  dbName: 'boilerplate-data-db',
  storeName: 'data',
  storeKey: 'data',
  version: 1,
})

const getInitialState = (): DataStoreType => ({
  dataList: [],
  selectedData: null,
  searchQuery: '',
  filterStatus: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  isInitialized: false,
})

export const dataStore$ = observable<DataStoreType>(getInitialState())

const saveToIndexedDb = async (): Promise<void> => {
  try {
    const { isInitialized, ...persistedData } = dataStore$.get()
    await dataIndexedDbStorage.save(persistedData)
  } catch (error) {
    console.error('Failed to save data to IndexedDB:', error)
  }
}

export const initializeDataStorage = async (): Promise<void> => {
  try {
    const dbData = await dataIndexedDbStorage.load()
    if (dbData) {
      // Auto-migrate data to add organizationId if missing (NOTE: This is a placeholder migration)
      // In real scenario, data without outlet should be handled according to business rules
      const migratedDataList = (dbData.dataList ?? []).map((data) => ({
        ...data,
        organizationId: data.organizationId ?? 'MIGRATION_NEEDED', // Mark for manual assignment
      }))

      dataStore$.set({
        ...dbData,
        dataList: migratedDataList,
        isInitialized: true,
      })
    } else {
      dataStore$.isInitialized.set(true)
    }
  } catch (error) {
    console.error('Failed to initialize data storage:', error)
    dataStore$.isInitialized.set(true)
  }
}

export const dataActions = {
  createData: ({ formData, organizationName }: { formData: CreateDataFormDTO; organizationName: string }): DataDTO => {
    const id = crypto.randomUUID()
    const slug = generateOrderSlug(organizationName)

    const newData: DataDTO = {
      id,
      slug,
      organizationId: formData.organizationId,
      name: formData.name,
      phone: formData.phone,
      price: formData.price,
      quantity: formData.quantity,
      weight: formData.weight,
      date: formData.date,
      notes: formData.notes,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dataStore$.dataList.push(newData)
    saveToIndexedDb()
    return newData
  },

  getDataList: (): DataDTO[] => {
    return dataStore$.dataList.get()
  },

  getDataByID: (id: string): DataDTO | undefined => {
    return dataStore$.dataList.get().find((c) => c.id === id)
  },

  getDataBySlug: (slug: string): DataDTO | undefined => {
    return dataStore$.dataList.get().find((c) => c.slug === slug)
  },

  updateData: (slug: string, updates: UpdateDataFormDTO): void => {
    const list = dataStore$.dataList.get()
    const index = list.findIndex((c) => c.slug === slug)
    if (index >= 0) {
      const updatedAt = new Date().toISOString()
      const data = dataStore$.dataList[index]

      Object.entries(updates).forEach(([key, val]) => {
        const dataKey = key as keyof UpdateDataFormDTO
        if (dataKey === 'status') {
          data.status.set(val as DataStatusDTO)
        } else {
          data[dataKey].set(val)
        }
      })

      data.updatedAt.set(updatedAt)
      saveToIndexedDb()
    }
  },

  deleteData: (slug: string): void => {
    const list = dataStore$.dataList.get()
    const index = list.findIndex((c) => c.slug === slug)
    if (index >= 0) {
      dataStore$.dataList.splice(index, 1)
      saveToIndexedDb()
    }
  },

  markAsCompleted: (slug: string): void => {
    const list = dataStore$.dataList.get()
    const index = list.findIndex((c) => c.slug === slug)
    if (index >= 0) {
      dataStore$.dataList[index].status.set('completed')
      dataStore$.dataList[index].updatedAt.set(new Date().toISOString())
      saveToIndexedDb()
    }
  },

  setSortBy: (field: SortField): void => {
    dataStore$.sortBy.set(field)
  },

  setSortDirection: (direction: SortDirection): void => {
    dataStore$.sortDirection.set(direction)
  },

  setFilterStatus: (status: FilterStatus): void => {
    dataStore$.filterStatus.set(status)
  },

  setSearchQuery: (query: string): void => {
    dataStore$.searchQuery.set(query)
  },

  setSelectedData: (data: DataDTO | null): void => {
    dataStore$.selectedData.set(data)
  },

  getSortedAndFilteredDataList: (): DataDTO[] => {
    const list = dataStore$.dataList.get()
    return dataActions.getSortedAndFilteredDataListFromList(list)
  },

  getSortedAndFilteredDataListFromList: (list: DataDTO[]): DataDTO[] => {
    const searchQuery = dataStore$.searchQuery.get().toLowerCase()
    const filterStatus = dataStore$.filterStatus.get()
    const sortBy = dataStore$.sortBy.get()
    const sortDirection = dataStore$.sortDirection.get()

    const filtered = list.filter((c) => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false
      if (!searchQuery) return true
      return c.name.toLowerCase().includes(searchQuery) || c.slug.toLowerCase().includes(searchQuery)
    })

    filtered.sort((a, b) => {
      let aValue
      let bValue

      if (sortBy === 'name') {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      } else {
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      }

      return aValue < bValue ? 1 : -1
    })

    return filtered
  },
}

// ===== TYPED SELECTOR HOOKS =====

export const useDataList = (): DataDTO[] => {
  const list = useSelector(dataStore$.dataList)
  return (Array.isArray(list) ? list : []) as DataDTO[]
}

export const useIsInitialized = (): boolean => {
  return useSelector(dataStore$.isInitialized) ?? false
}

export const useSearchQuery = (): string => {
  return useSelector(dataStore$.searchQuery) ?? ''
}

export const useSortBy = (): SortField => {
  return useSelector(dataStore$.sortBy) ?? 'createdAt'
}

export const useSortDirection = (): SortDirection => {
  return useSelector(dataStore$.sortDirection) ?? 'desc'
}

export const useFilterStatus = (): FilterStatus => {
  return useSelector(dataStore$.filterStatus) ?? 'all'
}

export const useSelectedData = (): DataDTO | null => {
  return useSelector(dataStore$.selectedData) ?? null
}

export const useFilteredDataList = (): DataDTO[] => {
  const selectedOrganization = useSelectedOrganization()
  const dataList = useDataList()
  const organizationFiltered = filterByOrganization(dataList, selectedOrganization?.id ?? null)
  return dataActions.getSortedAndFilteredDataListFromList(organizationFiltered)
}
