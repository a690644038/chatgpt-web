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
import type { UserInfo } from '@/store/modules/user/helper'
import { ElMessage } from 'element-plus'
let visible = ref(false);

const emits = defineEmits(['close']);

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


// const submitForm = async (ruleFormRef: FormInstance | undefined) => {
//   if (!ruleFormRef) return;
//   await ruleFormRef.validate((valid, fields) => {
//     if (valid) {
//       const { data } = fetchLogin<LoginResponse>({
//         email: "690644038@qq.com",
//         password: "a123456",
//       });
//       console.log(data);
//     } else {
//       console.log("error submit!", fields);
//     }
//   });
// };

// const submitForm = async (ruleFormRef: FormInstance | undefined) => {
//   if (!ruleFormRef) return;
//    ruleFormRef.validate(async (valid, fields) => {
//     if (valid) {
//       // try {
//       //   const data = await fetchLogin<any>(ruleForm.value);
//       //   console.log(data);
//       //   const avatar = data?.data?.code; // 使用可选链操作符访问响应数据
//       //   const loginToken = data?.data?.msg;
//       //   const name = data?.data?.username;

//       //   updateUserInfo({avatar})
//       //   updateUserInfo({loginToken})
//       //   updateUserInfo({name})

//       //   // 在这里处理响应数据
//       // } catch (error) {
//       //   console.error(error);
//       //   // 在这里处理错误
//       // }


//     } else {
//       console.log("error submit!", fields);
//     }
//   });
// };


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
      const loginToken = data?.data?.token;
      const name = data?.data?.username;
      const avatar = data?.data?.avatar; // 使用可选链操作符访问响应数据

      // const code = response?.code; // 使用可选链操作符访问响应数据
      // const msg = response?.msg;
      // const avatar = response?.data?.avatar; // 使用可选链操作符访问响应数据
      // const loginToken = response?.data?.token;
      // const name = response?.data?.username;
      updateUserInfo({ avatar })
      updateUserInfo({ loginToken })
      updateUserInfo({ name })

      const userInfo = computed(() => userStore.userInfo)

      const avatar2 = ref(userInfo.value.avatar ?? '')

      const name2 = ref(userInfo.value.name ?? '')

      console.log(avatar2,name2,'xcxc');
      
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
</style>
