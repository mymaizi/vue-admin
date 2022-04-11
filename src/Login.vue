<template>
  <el-container>
    <el-main class="mz-el-main">
      <el-form
        ref="loginFormRef"
        status-icon
        label-width="120px"
        style="width: 500px"
        :rules="loginFormRules"
        :model="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(loginFormRef)">登陆</el-button>
          <el-button @click="resetForm(loginFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive, useRouter, http,getCurrentInstance } from "@/apis";
const {appContext: {config: {globalProperties: global}}} = getCurrentInstance();
const router = useRouter()
const loginFormRef = ref()
const loginForm = reactive({
  username: "",
  password: ""
});
const loginFormRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const submitForm = (from) => {
  if (!from) return;
  from.validate((valid) => {
    if (valid) {
      dingfei.setStorage("userinfo", JSON.stringify(loginForm));
      http.get("/js/routes.json").then(res => {
        dingfei.setStorage("routes", JSON.stringify(res.data));
      });
      http.get("/js/appsettings.json").then(res => {
        dingfei.setStorage("appsettings", JSON.stringify(res.data));
        if (res.data.defaultLayout == "host") {
          router.push("host");
        } else {
          router.push("main");
        }
      });
    }
  });
};
const resetForm = (from) => {
  global.$resetForm(from);
};
</script>
<style scoped>
.mz-el-main {
  position: absolute;
  top: 30%;
  left: 50%;
  margin-left: -300px;
}
</style>
