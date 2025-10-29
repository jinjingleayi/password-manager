<template>
  <div class="container" style="display:flex;justify-content:center;align-items:center;min-height:100vh;">
    <el-card style="width:100%;max-width:420px;">
      <h2 style="margin:0 0 16px 0;">登录</h2>
      <el-form :model="form" @submit.prevent="onSubmit" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password />
        </el-form-item>
        <el-button type="primary" style="width:100%" @click="onSubmit">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ username: '', password: '' })

function onSubmit() {
  if (auth.login(form.username, form.password)) {
    router.push('/passwords')
  }
}
</script>
