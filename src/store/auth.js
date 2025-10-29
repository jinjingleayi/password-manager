import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: ''
  }),
  actions: {
    login(username, password) {
      // Simple demo: accept any non-empty credentials
      if (username && password) {
        this.username = username
        this.isAuthenticated = true
        return true
      }
      return false
    },
    logout() {
      this.username = ''
      this.isAuthenticated = false
    }
  }
})
