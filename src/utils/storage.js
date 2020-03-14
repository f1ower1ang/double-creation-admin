export function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    localStorage.setItem(key, value)
  }
}

export function getLocalStorage(key) {
  if (localStorage.key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {
      return localStorage.getItem(key)
    }
  } else {
    return null
  }
}

export function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}

export function setSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    sessionStorage.setItem(key, value)
  }
}

export function getSessionStorage(key) {
  if (sessionStorage.key) {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch (e) {
      return sessionStorage.getItem(key)
    }
  } else {
    return null
  }
}

export function removeSessionStorage(key) {
  try {
    sessionStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}
