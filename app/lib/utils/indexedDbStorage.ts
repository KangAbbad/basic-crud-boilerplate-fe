/**
 * Generic IndexedDB storage utility
 * Reusable across features with configurable database/store names
 */

export type SortField = string
export type SortDirection = 'asc' | 'desc'

export interface IndexedDbConfig {
  dbName: string
  storeName: string
  storeKey: string
  version?: number
}

const dbInstances: Record<string, IDBDatabase> = {}

export function createIndexedDbStorage<T>(config: IndexedDbConfig) {
  const { dbName, storeName, storeKey, version = 1 } = config
  const instanceKey = `${dbName}:${storeName}`

  return {
    async initialize(): Promise<void> {
      if (dbInstances[instanceKey]) {
        return
      }

      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(dbName, version)

        request.onerror = () => {
          reject(request.error)
        }
        request.onsuccess = () => {
          dbInstances[instanceKey] = request.result
          resolve()
        }

        request.onupgradeneeded = (event) => {
          const target = event.target as IDBOpenDBRequest
          const database = target.result
          if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName)
          }
        }
      })
    },

    async save(data: T): Promise<void> {
      await this.initialize()

      const db = dbInstances[instanceKey]
      if (!db) {
        throw new Error('Database not initialized')
      }

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put(data, storeKey)

        request.onerror = () => {
          reject(request.error)
        }
        request.onsuccess = () => {
          resolve()
        }
      })
    },

    async load(): Promise<T | null> {
      await this.initialize()

      const db = dbInstances[instanceKey]
      if (!db) {
        throw new Error('Database not initialized')
      }

      return await new Promise<T | null>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(storeKey)

        request.onerror = () => {
          reject(request.error)
        }
        request.onsuccess = () => {
          resolve(request.result ?? null)
        }
      })
    },

    async delete(): Promise<void> {
      await this.initialize()

      const db = dbInstances[instanceKey]
      if (!db) {
        throw new Error('Database not initialized')
      }

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(storeKey)

        request.onerror = () => {
          reject(request.error)
        }
        request.onsuccess = () => {
          resolve()
        }
      })
    },

    async clear(): Promise<void> {
      await this.initialize()

      const db = dbInstances[instanceKey]
      if (!db) {
        throw new Error('Database not initialized')
      }

      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onerror = () => {
          reject(request.error)
        }
        request.onsuccess = () => {
          resolve()
        }
      })
    },
  }
}
