const DATABASE = 'autoforge-admin-catalog'
function openDatabase() {
 return new Promise((resolve, reject) => {
  const request = indexedDB.open(DATABASE, 1)
  request.onupgradeneeded = () => request.result.createObjectStore('catalog')
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(new Error('Browser storage is unavailable. Allow site storage and try again.'))
 })
}
export async function readCatalog() {
 const database = await openDatabase()
 return new Promise((resolve, reject) => {
  const transaction = database.transaction('catalog', 'readonly')
  const request = transaction.objectStore('catalog').get('products')
  transaction.oncomplete = () => { database.close(); resolve(request.result) }
  transaction.onerror = () => { database.close(); reject(new Error('Could not load the saved catalog.')) }
 })
}
export async function writeCatalog(products) {
 const database = await openDatabase()
 return new Promise((resolve, reject) => {
  const transaction = database.transaction('catalog', 'readwrite')
  transaction.objectStore('catalog').put(products, 'products')
  transaction.oncomplete = () => { database.close(); resolve() }
  transaction.onabort = transaction.onerror = () => { database.close(); reject(new Error('Could not save changes. Your browser storage may be full.')) }
 })
}
