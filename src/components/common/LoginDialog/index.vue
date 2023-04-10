<template>
  <el-dialog v-model="visible" center width="400px" title="登录">
    <!-- <el-form ref="ruleFormRef" :rules="rules" v-model="ruleForm"   label-width="120px">
      <h3>用户登录</h3>
      <el-form-item label="手机/邮箱" prop="account">
        <el-input v-model="ruleForm.account" placeholder="请输入手机号或邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <div class="tc_c">
        <el-button type="primary" @click="submitForm">登录</el-button>
      </div>
    </el-form> -->

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm" :size="formSize"
      status-icon>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" :prefix-icon="User" size="large" placeholder="请输入手机号或邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" size="large" :prefix-icon="Lock"
          placeholder="请输入密码"></el-input>
      </el-form-item>
      <div class="tc_c">
        <el-button style="width: 200px;"  type="primary" size="large" dark color="#303133"
          @click="submitForm(ruleFormRef)">
          登录
        </el-button>
        <div class="mar-t10">没有账号？<span class="regsty" @click="regNow()">立即注册</span></div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup lang='ts'>

import { reactive, computed, ref,defineEmits } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { fetchLogin } from '@/api'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/store'
import { useAuthStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { ElMessage } from 'element-plus'
let visible = ref(false);

const emits = defineEmits(['close','register']);
const authStore = useAuthStore()

const userStore = useUserStore()
// const userInfo = computed(() => userStore.userInfo)

// const avatar = ref(userInfo.value.avatar ?? '')

// const name = ref(userInfo.value.name ?? '')

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
interface Form {
  email: string;
  password: string;
}

const ruleForm = ref<Form>({
  email: "",
  password: "",
});

function updateUserInfo(options: Partial<UserInfo>) {
  userStore.updateUserInfo(options)
}

const rules = reactive<FormRules>({
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
  email: [
    {
      required: true,
      message: "请输入账号",
      trigger: "change",
    },
  ],
});

function regNow(){
  emits('register');
  emits('close');
}

const submitForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return;
  ruleFormRef.validate()
    .then(() => {
      return fetchLogin<any>(ruleForm.value)
    })
    .then(response => {
      // let data = response;

      const data = response as { code?: number; msg?: string; data?: { token?: string; username?: string;avatar?: string } };
      const code = data?.code;
      const msg = data?.msg;
      const loginToken = data?.data?.token||'';
      const name = data?.data?.username;
      const avatar = data?.data?.avatar;

      updateUserInfo({ avatar })
      updateUserInfo({ name })
      
      authStore.setToken(loginToken)
      if (code == 1) {
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        emits('close');
      } else {
        ElMessage.error(msg)
      }

      return
    })
    .catch(error => {
      console.log("error submit!", error);
    })
};
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
.regsty{
  cursor: pointer;
  color: #409EFF;
}
</style>
