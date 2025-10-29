import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Passwords from '../views/Passwords.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/passwords', name: 'Passwords', component: Passwords }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
