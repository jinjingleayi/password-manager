<template>
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
      <h2 style="margin:0;">密码管理器</h2>
      <div style="display:flex;gap:8px;">
        <el-button type="primary" @click="onGenerate">生成密码</el-button>
        <el-button @click="onAdd">新增条目</el-button>
      </div>
    </div>

    <el-row :gutter="12">
      <el-col :span="24" v-if="items.length === 0">
        <el-empty description="暂无数据" />
      </el-col>
      <el-col :span="24" v-for="item in items" :key="item.id" style="margin-bottom:12px;">
        <PasswordItem :item="item" @remove="remove(item.id)" @edit="openEdit(item)" />
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" title="新增密码" width="420px">
      <el-form :model="form" label-position="top">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="如：Github" />
        </el-form-item>
        <el-form-item label="网址">
          <el-input v-model="form.url" placeholder="https://github.com" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="用户名/邮箱" />
        </el-form-item>
        <el-form-item label="密码">
          <div style="display:flex; gap:8px; align-items:center;">
            <el-input v-model="form.password" placeholder="密码" type="password" show-password />
            <el-button size="small" @click="generateIntoAdd" type="primary" plain>生成</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>

  <!-- Edit Dialog -->
  <el-dialog v-model="editVisible" title="编辑密码" width="420px">
    <el-form :model="editForm" label-position="top">
      <el-form-item label="标题">
        <el-input v-model="editForm.title" placeholder="如：Github" />
      </el-form-item>
      <el-form-item label="网址">
        <el-input v-model="editForm.url" placeholder="https://github.com" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" placeholder="用户名/邮箱" />
      </el-form-item>
      <el-form-item label="密码">
        <div style="display:flex; gap:8px; align-items:center;">
          <el-input v-model="editForm.password" placeholder="密码" type="password" show-password />
          <el-button size="small" @click="generateIntoEdit" type="primary" plain>生成</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">保存</el-button>
      </div>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { usePasswordsStore } from '../store/passwords'
import PasswordItem from '../components/PasswordItem.vue'
import { generatePassword } from '../utils/crypto'
import { copyText } from '../utils/clipboard'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const passwords = usePasswordsStore()

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.replace('/login')
  } else {
    passwords.load()
  }
})

const items = computed(() => passwords.items)
const dialogVisible = ref(false)
const form = reactive({ title: '', url: '', username: '', password: '' })
const editVisible = ref(false)
const editForm = reactive({ id: '', title: '', url: '', username: '', password: '' })

function onAdd() {
  dialogVisible.value = true
}

function confirmAdd() {
  if (!form.url) {
    ElMessage.warning('请填写网址')
    return
  }
  if (!form.username || !form.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }
  // Auto-fill title if empty: prefer hostname from URL, else username
  if (!form.title) {
    if (form.url) {
      try {
        const u = new URL(form.url)
        form.title = u.hostname
      } catch (e) {
        form.title = 'unknown'
      }
    } else {
      form.title = 'unknown'
    }
  }
  passwords.add({ ...form })
  form.title = ''
  form.url = ''
  form.username = ''
  form.password = ''
  dialogVisible.value = false
  ElMessage.success('已添加')
}

function remove(id) {
  passwords.remove(id)
}

function openEdit(item) {
  editForm.id = item.id
  editForm.title = item.title || ''
  editForm.url = item.url || ''
  editForm.username = item.username || ''
  editForm.password = item.password || ''
  editVisible.value = true
}

function confirmEdit() {
  if (!editForm.url) {
    ElMessage.warning('请填写网址')
    return
  }
  if (!editForm.username || !editForm.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }
  passwords.update(editForm.id, {
    title: editForm.title,
    url: editForm.url,
    username: editForm.username,
    password: editForm.password
  })
  editVisible.value = false
  ElMessage.success('已保存')
}

async function onGenerate() {
  const generatedPassword = generatePassword({ length: 16, symbols: true })
  const ok = await copyText(generatedPassword)
  if (ok) {
    ElMessage.success('密码已生成并复制到剪贴板')
  } else {
    ElMessage.error('复制失败，请手动复制密码')
    alert(`生成的密码: ${generatedPassword}`)
  }
}

function generateIntoAdd() {
  const pwd = generatePassword({ length: 16, symbols: true })
  form.password = pwd
  copyText(pwd).then(ok => {
    if (ok) ElMessage.success('已生成并复制到剪贴板')
  })
}

function generateIntoEdit() {
  const pwd = generatePassword({ length: 16, symbols: true })
  editForm.password = pwd
  copyText(pwd).then(ok => {
    if (ok) ElMessage.success('已生成并复制到剪贴板')
  })
}
</script>

<style scoped>
</style>
