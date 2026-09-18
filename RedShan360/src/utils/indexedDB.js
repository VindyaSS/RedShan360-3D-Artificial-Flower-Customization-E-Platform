/**
 * indexedDB.js
 * Utility helper for managing temporary custom bouquet WebGL image Blobs
 * stored in browser IndexedDB before checkout completion.
 */

const DB_NAME = 'RedShan360_BouquetDB';
const DB_VERSION = 1;
const STORE_NAME = 'bouquet_images';

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Saves a WebGL PNG Blob in IndexedDB keyed by customizationId.
 */
export const saveBouquetImage = async (customizationId, blob) => {
  if (!customizationId || !blob) return false;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, String(customizationId));
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save bouquet image to IndexedDB:', err);
    return false;
  }
};

/**
 * Retrieves a WebGL PNG Blob from IndexedDB by customizationId.
 */
export const getBouquetImage = async (customizationId) => {
  if (!customizationId) return null;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(String(customizationId));
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to get bouquet image from IndexedDB:', err);
    return null;
  }
};

/**
 * Deletes a specific WebGL PNG Blob from IndexedDB by customizationId.
 */
export const deleteBouquetImage = async (customizationId) => {
  if (!customizationId) return false;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(String(customizationId));
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to delete bouquet image from IndexedDB:', err);
    return false;
  }
};
