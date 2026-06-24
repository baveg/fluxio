import { glb } from "../glb";


/**
 * Nettoie complètement le stockage du navigateur
 * - localStorage
 * - sessionStorage
 * - cookies
 * - IndexedDB
 */
export const clearBrowser = () => {
  const { localStorage, sessionStorage, document, indexedDB } = glb;
  // Nettoyer tout le stockage local
  localStorage?.clear?.();
  sessionStorage?.clear?.();

  // Nettoyer les cookies
  document?.cookie?.split(';').forEach(cookie => {
    const name = cookie.split('=')[0]?.trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });

  // Nettoyer IndexedDB (si utilisé par Pinia)
  indexedDB?.databases?.().then(databases => {
    databases.forEach(db => {
      if (db.name) indexedDB.deleteDatabase(db.name);
    });
  });
};

export const reloadBrowser = () => {
  const { location } = glb;
  location?.reload?.();
}