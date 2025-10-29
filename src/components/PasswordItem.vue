<template>
  <el-card shadow="never" :body-style="{ padding: '12px' }">
    <div class="pw-row" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;">
        <div style="font-weight:600;">
          <el-button @click="$emit('edit')" link style="padding:0;">
            {{ displayTitle }}
          </el-button>
        </div>
        <div style="color:#666;word-break:break-all;margin-top:4px;display:flex;align-items:center;gap:8px;">
          <span>{{ usernameVisible ? item.username : maskedUsername }}</span>
          <el-button @click="toggleUsername" link size="small">{{ usernameVisible ? '隐藏用户名' : '显示用户名' }}</el-button>
          <el-button @click="copyUsername" link size="small">复制用户名</el-button>
        </div>
        <div v-if="item.url" style="margin-top:4px;">
          <el-button
            @click="openUrl"
            type="primary"
            link
            size="small"
            style="padding:0;font-size:12px;"
          >
            {{ displayUrl }}
          </el-button>
        </div>
      </div>
      <div class="pw-actions" style="display:flex;gap:8px;">
        <el-input v-model="masked" readonly class="pw-mask" />
        <el-button @click="copy" type="primary" link>复制</el-button>
        <el-popconfirm title="确认删除？" @confirm="$emit('remove', item.id)">
          <template #reference>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { copyText } from '../utils/clipboard'
const props = defineProps({ item: { type: Object, required: true } })

const masked = computed(() => '•'.repeat(10))

const displayUrl = computed(() => {
  if (!props.item.url) return ''
  try {
    const url = new URL(props.item.url)
    return url.hostname
  } catch (e) {
    return props.item.url
  }
})

const displayTitle = computed(() => {
  // Prefer hostname from URL; fallback to explicit title
  if (props.item?.url) {
    try {
      const u = new URL(props.item.url)
      return u.hostname || props.item.title || 'unknown'
    } catch (e) {
      return props.item.title || props.item.url || 'unknown'
    }
  }
  return props.item.title || 'unknown'
})

const usernameVisible = ref(false)
const maskedUsername = computed(() => '•'.repeat(Math.max(6, (props.item?.username || '').length)))

async function copy() {
  if (!props.item?.password) return
  const ok = await copyText(props.item.password)
  if (ok) ElMessage.success('已复制密码')
}

function openUrl() {
  if (props.item.url) {
    window.open(props.item.url, '_blank')
  }
}

async function copyUsername() {
  if (!props.item?.username) return
  const ok = await copyText(props.item.username)
  if (ok) ElMessage.success('已复制用户名')
}

function toggleUsername() {
  usernameVisible.value = !usernameVisible.value
}
</script>

<style scoped>
.pw-mask {
  width: 200px;
}

@media (max-width: 600px) {
  .pw-row {
    flex-direction: column;
    align-items: stretch;
  }
  .pw-actions {
    width: 100%;
  }
  .pw-mask {
    width: 100%;
  }
}
</style>
