import { defineStore } from 'pinia'
import { encryptText, decryptText } from '../utils/crypto'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage'

const STORAGE_KEY = 'pm_passwords'
const DEFAULT_SECRET = 'pm_local_secret'

export const usePasswordsStore = defineStore('passwords', {
  state: () => ({
    items: []
  }),
  actions: {
    load() {
      const encrypted = loadFromLocalStorage(STORAGE_KEY)
      if (encrypted) {
        try {
          const json = decryptText(encrypted, DEFAULT_SECRET)
          this.items = JSON.parse(json)
        } catch (e) {
          this.items = []
        }
      }
    },
    add(entry) {
      this.items.push({ ...entry, id: crypto.randomUUID() })
      this.persist()
    },
    update(id, updated) {
      const idx = this.items.findIndex(i => i.id === id)
      if (idx !== -1) {
        this.items[idx] = { ...this.items[idx], ...updated }
        this.persist()
      }
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id)
      this.persist()
    },
    persist() {
      const json = JSON.stringify(this.items)
      const encrypted = encryptText(json, DEFAULT_SECRET)
      saveToLocalStorage(STORAGE_KEY, encrypted)
    }
  }
})
