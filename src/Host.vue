<template>
  <el-container>
    <el-main>
      <div class="mz-layout-head">
        <el-image :src="settings.appLogo" />
        <h1>{{ settings.appTitle }}</h1>
      </div>
      <template v-for="(item, i) in menus" :key="i">
        <el-button type="primary" @click="handleRoute(item)">{{ item.title }}</el-button>
      </template>
    </el-main>
  </el-container>
</template>

<script setup>
import { lodash, useRouter } from "@/apis";
const router = useRouter()
const menus = lodash.filter(JSON.parse(dingfei.getStorage("routes")), { 'type': 'cat', 'level': 1, 'pid': null });
const settings = JSON.parse(dingfei.getStorage("appsettings"));
const handleRoute = (route) => {
  router.push("main");
}
</script>
<style scoped>
.mz-layout-head {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>