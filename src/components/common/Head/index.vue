<template>
  <div :class="[isMobile ? 'header-xs' : 'header']">
    <div class="logo">
      <img src="@/assets/logo.png" class="h-logo" alt="Logo" />
      <n-gradient-text type="info">
        <!-- <span class="logoText">BotMind</span> -->
        <n-gradient-text
          :gradient="{
            from: 'rgb(85, 85, 85)',
            to: 'rgb(170, 170, 170)',
          }"
        >
          <span class="logoText">BotMind</span>
        </n-gradient-text>
      </n-gradient-text>
    </div>
    <div class="menu">
      <!-- <el-button type="text" class="PrimaryTextColor">购买会员</el-button> -->
    </div>
    <div class="actions">
      <el-button type="text" @click="showLevelDialog">
        <img src="@/assets/vip.png" class="vipimg" alt="" srcset="" />
        升级会员</el-button
      >
      <span v-if="!loginToken">
        <el-button type="text" @click="showLoginDialog">登录</el-button>
        <el-button type="primary" @click="showRegisterDialog">注册</el-button>
      </span>
      <el-button v-else type="text" @click="logout">退出</el-button>
    </div>
    <login-dialog
      v-model="loginDialogVisible"
      @close="loginClose"
      @register="showRegisterDialog"
    />
    <register-dialog v-model="registerDialogVisible" @close="registerClose" />
    <level-dialog v-model="levelDialogVisible" @close="levelClose" />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, computed } from "vue";
//   import LoginDialog from "@/components/LoginDialog.vue";
//   import RegisterDialog from "@/components/RegisterDialog.vue";
// import { computed, onMounted,ref } from 'vue'
import { useUserStore } from "@/store";
import { useAuthStore } from "@/store";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { NGradientText } from "naive-ui";
const userStore = useUserStore();
const authStore = useAuthStore();

// const userInfo = computed(() => userStore.userInfo)
// console.log(userInfo.value.token,'x1x1---x1x');

export default defineComponent({
  name: "Header",
  components: {
    NGradientText,
  },
  setup() {
    const loginDialogVisible = ref(false);
    const registerDialogVisible = ref(false);
    const levelDialogVisible = ref(false);
    const userInfo = computed(() => userStore.userInfo);
    const loginToken = computed(() => authStore.token);
    const { isMobile } = useBasicLayout();
    function showLoginDialog() {
      loginDialogVisible.value = true;
    }
    function showLevelDialog() {
      levelDialogVisible.value = true;
    }

    function showRegisterDialog() {
      registerDialogVisible.value = true;
    }
    function registerClose() {
      registerDialogVisible.value = false;
    }
    function levelClose() {
      levelDialogVisible.value = false;
    }
    function loginClose() {
      loginDialogVisible.value = false;
    }
    function logout() {
      authStore.removeToken();
      userStore.resetUserInfo();

      window.location.reload();
    }
    return {
      loginDialogVisible,
      registerDialogVisible,
      levelDialogVisible,
      showLoginDialog,
      loginClose,
      showRegisterDialog,
      logout,
      registerClose,
      userInfo,
      showLevelDialog,
      NGradientText,
      loginToken,
      isMobile,
      levelClose,
    };
  },
});
</script>
  
  <style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  /* box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25); */
  box-shadow: 0 2px 12px 0 rgba(15, 97, 227, 0.08);
  position: fixed;
  z-index: 50;
  width: 100%;
  background: #fff;
  top: 0;
}
.h-logo {
  height: 60px;
}
.header-xs {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25); */
  box-shadow: 0 2px 12px 0 rgba(15, 97, 227, 0.08);
  position: fixed;
  z-index: 50;
  width: 100%;
  background: #fff;
  top: 0;
}
.header-xs .h-logo {
  height: 30px;
}
.vipimg {
  width: 20px;
  margin-right: 5px;
}
.menu {
  display: flex;
  gap: 20px;
}

.actions {
  display: flex;
  gap: 20px;
}
.logo {
  display: flex;
  align-items: center;
}
.logoText {
  font-size: 28px;
  margin-left: 20px;
  font-weight: 600;
  /* color: #333; */
}
</style>