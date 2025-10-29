export function loadFromLocalStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // ignore
  }
}
