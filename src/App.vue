<script setup lang="ts">
// import { ref } from 'vue';
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
const { isMobile } = useBasicLayout()

// const dialogVisible = ref(false);
// const registerVisible = ref(false);


// function openDialog() {
//   dialogVisible.value = true;
//   (loginDialogRef as any)?.open();
// }
// const loginDialogRef = null as any;

</script>

<template>
  <!-- <login-dialog v-model="dialogVisible" ref="loginDialogRef" />
  <register-dialog v-model="registerVisible" ref="registerDialogRef" /> -->
  <Head></Head>
  <NConfigProvider
    class="h-full"
    :style="[isMobile?'padding-top: 52px':'padding-top: 100px']"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
