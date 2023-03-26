<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.png" style="height: 60px" alt="Logo" />
      <span class="logoText">BotMind</span>
    </div>
    <!-- <div class="menu">
      <el-button type="text" class="PrimaryTextColor">首页</el-button>
      <el-button type="text" class="PrimaryTextColor">产品中心</el-button>
      <el-button type="text" class="PrimaryTextColor">关于我们</el-button>
    </div> -->
    <div class="actions">
      <span v-if="!userInfo.loginToken">
        <el-button type="text" @click="showLoginDialog">登录</el-button>
        <el-button type="primary" @click="showRegisterDialog">注册</el-button>
      </span>
      <el-button v-else type="text" @click="logout">退出</el-button>
    </div>
    <login-dialog v-model="loginDialogVisible" @close="loginClose" />
    <register-dialog v-model="registerDialogVisible" @close="registerClose" />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, computed } from "vue";
//   import LoginDialog from "@/components/LoginDialog.vue";
//   import RegisterDialog from "@/components/RegisterDialog.vue";
// import { computed, onMounted,ref } from 'vue'
import { useUserStore } from "@/store";
const userStore = useUserStore();
// const userInfo = computed(() => userStore.userInfo)
// console.log(userInfo.value.token,'x1x1---x1x');

export default defineComponent({
  name: "Header",
  setup() {
    const loginDialogVisible = ref(false);
    const registerDialogVisible = ref(false);
    const userInfo = computed(() => userStore.userInfo);

    function showLoginDialog() {
      loginDialogVisible.value = true;
    }

    function showRegisterDialog() {
      registerDialogVisible.value = true;
    }
    function registerClose() {
      registerDialogVisible.value = false;
    }
    function loginClose() {
      loginDialogVisible.value = false;
    }
    function logout() {
      userStore.resetUserInfo();
      window.location.reload();
    }
    return {
      loginDialogVisible,
      registerDialogVisible,
      showLoginDialog,
      loginClose,
      showRegisterDialog,
      logout,
      registerClose,
      userInfo
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
  z-index: 99;
  width: 100%;
  background: #fff;
  top: 0;
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
  font-size: 26px;
  margin-left: 20px;
  font-weight: 600;
  color: #333;
}
</style>