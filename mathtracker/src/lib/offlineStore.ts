/**
 * offlineStore.ts
 * IndexedDB-based offline queue for attendance, behavior, etc.
 * Syncs automatically when connection is restored
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface PendingAction {
  id?: number
  type: 'attendance' | 'behavior' | 'notebook' | 'homework_check'
  payload: Record<string, unknown>
  createdAt: number
  synced: number // 0 = false, 1 = true (for IDB Indexing)
}

interface MathTrackerDB extends DBSchema {
  pending_actions: {
    key: number
    value: PendingAction
    indexes: { by_synced: number }
  }
  cached_classes: {
    key: string
    value: { id: string; name: string; students: unknown[] }
  }
}

let dbPromise: Promise<IDBPDatabase<MathTrackerDB>> | null = null

function getDB(): Promise<IDBPDatabase<MathTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MathTrackerDB>('mathtracker', 1, {
      upgrade(database) {
        const store = database.createObjectStore('pending_actions', {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('by_synced', 'synced')
        database.createObjectStore('cached_classes', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export async function queueAction(
  type: PendingAction['type'],
  payload: Record<string, unknown>
): Promise<void> {
  const database = await getDB()
  await database.add('pending_actions', {
    type,
    payload,
    createdAt: Date.now(),
    synced: 0,
  })
}

export async function getPendingActions(): Promise<PendingAction[]> {
  const database = await getDB()
  return database.getAllFromIndex('pending_actions', 'by_synced', 0)
}

export async function markSynced(id: number): Promise<void> {
  const database = await getDB()
  const tx = database.transaction('pending_actions', 'readwrite')
  const item = await tx.store.get(id)
  if (item) {
    item.synced = 1
    await tx.store.put(item)
  }
  await tx.done
}

export async function getPendingCount(): Promise<number> {
  const actions = await getPendingActions()
  return actions.length
}

export async function cacheClass(classData: { id: string; name: string; students: unknown[] }): Promise<void> {
  const database = await getDB()
  await database.put('cached_classes', classData)
}

export async function getCachedClass(id: string) {
  const database = await getDB()
  return database.get('cached_classes', id)
}

