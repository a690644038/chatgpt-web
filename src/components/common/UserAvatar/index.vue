<script setup lang='ts'>
import { ref } from 'vue'
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)


const dialogVisible = ref(false)

function showLoginDialog() {
  dialogVisible.value = true
}
</script>

<template>
  <div class="flex items-center overflow-hidden">
  	<login-dialog v-model="dialogVisible" />
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
 	
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar
          size="large"
          round
          :src="userInfo.avatar"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap" v-if="userInfo.loginToken">
        {{ userInfo.name ?? 'ChenZhaoYu' }}
      </h2>
         <h2 class="font-bold text-md cus_p" v-else @click="showLoginDialog">
        Î´µÇÂ¼
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userInfo.description) && userInfo.description !== ''"
          v-html="userInfo.description"
        />
      </p>
    </div>
  </div>
</template>
