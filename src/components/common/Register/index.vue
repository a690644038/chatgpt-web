<template>
  <el-dialog v-model="visible" center width="400px" title="注册">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      status-icon
      label-width="100px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          size="large"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          size="large"
          placeholder="请输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱验证码" size="large" prop="verificationCode">
        <div class="flex">
          <el-input
            v-model="form.verificationCode"
            placeholder="请输入验证码"
            class="flex-1"
          ></el-input>
          <el-button
            type="primary"
            class="ml-10"
            :disabled="state.disableGetCode"
            dark
            color="#303133"
            @click="handleSendCode"
            >{{ state.getCodeButtonText }}</el-button
          >
        </div>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          size="large"
          v-model="form.password"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          type="password"
          size="large"
          v-model="form.confirmPassword"
          placeholder="请再次输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <div class="tc_c">
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          dark
          color="#303133"
          >注册2</el-button
        >
      </div>
    </el-form>
  </el-dialog>
</template>
  
  <script setup lang="ts">
import { ref, defineEmits, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { fetchRegister, sendEmail } from "@/api";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";
import type { UserInfo } from "@/store/modules/user/helper";
import { useAuthStore } from '@/store'

const authStore = useAuthStore()

const userStore = useUserStore();

let visible = ref(false);
function updateUserInfo(options: Partial<UserInfo>) {
  userStore.updateUserInfo(options);
}

const ruleFormRef = ref<FormInstance>();
interface Form {
  username: string;
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

const emits = defineEmits(["close"]);

const form = ref<Form>({
  username: "",
  email: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
});

type Rule = Partial<{
  required: boolean;
  message: string;
  trigger: string | string[];
  type: string;
}>;

interface ValidatorRule {
  validator: (rule: any, value: any, callback: any) => void;
  trigger: string;
}

interface Rules {
  [key: string]: Rule[] | ValidatorRule[];
}

const rules: Rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      required: true,
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度必须为6到20个字符", trigger: "blur" },
  ] as Rule[],
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ] as ValidatorRule[],
};

const state = reactive({
  getCodeButtonText: "获取验证码",
  disableGetCode: false,
});
let countdown = 60;

function handleSendCode() {
  if (state.disableGetCode) return;
  // TODO: send verification code to user's phone number
  // 发送成功后开始倒计时

  sendEmail<any>({ email: form.value.email })
    .then((response) => {
      state.disableGetCode = true;
      state.getCodeButtonText = `${countdown}s 后重发`;

      const timer = setInterval(() => {
        countdown--;

        if (countdown === 0) {
          clearInterval(timer);
          state.getCodeButtonText = "重新发送";
          state.disableGetCode = false;
          countdown = 60;
        } else {
          state.getCodeButtonText = `${countdown}s 后重发`;
        }
      }, 1000);
    })
    .catch((error) => {});
}
// function pays(){
//   pay({}).then((response)=>{
//     const data = response as {result?: string };
//     window.open(data?.result)
//   })
// }
// const submitForm = async (ruleFormRef: FormInstance | undefined) => {
//   if (!ruleFormRef) return;
//   await ruleFormRef.validate(async (valid, fields) => {
//     if (valid) {
//       const { data } = await fetchRegister<any>(form.value);
//       console.log(data);
//       if (data.code == 1) {
//         ElMessage({
//           message: "注册成功",
//           type: "success",
//         });
//       }else{
//         ElMessage.error(data.msg)
//       }
//     } else {
//       console.log("error submit!", fields);
//     }
//   });
// };

const submitForm = (ruleFormRef: FormInstance | undefined) => {
  if (!ruleFormRef) return;
  ruleFormRef
    .validate()
    .then(() => {
      return fetchRegister<any>(form.value);
    })
    .then((response) => {
      // let data = response;
      const data = response as { code?: number; msg?: string; data?: { token?: string; username?: string } };
      const code = data?.code;
      const msg = data?.msg;
      const loginToken = data?.data?.token||'';
      const name = data?.data?.username;
      authStore.setToken(loginToken)
      updateUserInfo({ name });


      if (code == 1) {
        ElMessage({
          message: "注册成功",
          type: "success",
        });
        // visible.value = false
        emits("close");
      } else {
        ElMessage.error(msg);
        // emits('close');
      }
    })
    .catch((error) => {
      console.log("error submit!", error);
    });
};
</script>

<style scoped>
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.ml-10 {
  margin-left: 10px;
}
.tc_c {
  text-align: center;
  margin-top: 20px;
}
</style>