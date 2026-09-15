import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface FLMSDB extends DBSchema {
  'gn-divisions': { key: number; value: any; indexes: { 'name': string } };
  'firearm-types': { key: number; value: any };
  'custom-sections': { key: number; value: any; indexes: { 'order': number } };
  'custom-fields': { key: number; value: any; indexes: { 'section': number } };
  'renewal-years': { key: number; value: any; indexes: { 'year': number } };
  'records': { key: number; value: any; indexes: { 'nic': string, 'gn_division': number } };
  'license-holders': { key: number; value: any; indexes: { 'nic': string } };
  'firearms': { key: number; value: any; indexes: { 'license_holder': number } };
  'renewals': { key: number; value: any; indexes: { 'license_holder': number } };
}

const DB_NAME = 'flms-database';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<FLMSDB>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<FLMSDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('gn-divisions')) {
          const store = db.createObjectStore('gn-divisions', { keyPath: 'id', autoIncrement: true });
          store.createIndex('name', 'name');
        }
        if (!db.objectStoreNames.contains('firearm-types')) {
          db.createObjectStore('firearm-types', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('custom-sections')) {
          const store = db.createObjectStore('custom-sections', { keyPath: 'id', autoIncrement: true });
          store.createIndex('order', 'order');
        }
        if (!db.objectStoreNames.contains('custom-fields')) {
          const store = db.createObjectStore('custom-fields', { keyPath: 'id', autoIncrement: true });
          store.createIndex('section', 'section');
        }
        if (!db.objectStoreNames.contains('renewal-years')) {
          const store = db.createObjectStore('renewal-years', { keyPath: 'id', autoIncrement: true });
          store.createIndex('year', 'year');
        }
        if (!db.objectStoreNames.contains('records')) {
          const store = db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
          store.createIndex('nic', 'nic');
          store.createIndex('gn_division', 'gn_division');
        }
        if (!db.objectStoreNames.contains('license-holders')) {
          const store = db.createObjectStore('license-holders', { keyPath: 'id', autoIncrement: true });
          store.createIndex('nic', 'nic');
        }
        if (!db.objectStoreNames.contains('firearms')) {
          const store = db.createObjectStore('firearms', { keyPath: 'id', autoIncrement: true });
          store.createIndex('license_holder', 'license_holder');
        }
        if (!db.objectStoreNames.contains('renewals')) {
          const store = db.createObjectStore('renewals', { keyPath: 'id', autoIncrement: true });
          store.createIndex('license_holder', 'license_holder');
        }
      },
    });
  }
  return dbPromise;
};

// Generic CRUD Operations
export const getAll = async (storeName: keyof FLMSDB) => {
  const db = await initDB();
  return await db.getAll(storeName);
};

export const getById = async (storeName: keyof FLMSDB, id: number) => {
  const db = await initDB();
  return await db.get(storeName, id);
};

export const add = async (storeName: keyof FLMSDB, data: any) => {
  const db = await initDB();
  // Ensure dates are strings to mimic JSON backend
  data.created_at = new Date().toISOString();
  const id = await db.add(storeName, data);
  return { ...data, id };
};

export const update = async (storeName: keyof FLMSDB, id: number, data: any) => {
  const db = await initDB();
  const existing = await db.get(storeName, id);
  if (!existing) throw new Error(`Item ${id} not found in ${storeName}`);
  const updatedData = { ...existing, ...data, id, updated_at: new Date().toISOString() };
  await db.put(storeName, updatedData);
  return updatedData;
};

export const remove = async (storeName: keyof FLMSDB, id: number) => {
  const db = await initDB();
  await db.delete(storeName, id);
};
