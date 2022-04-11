<template>
  <component :is="layout"></component>
</template>

<script setup>
import { ref, onMounted } from '@/apis'
import admin from '@/components/layouts/admin.vue'
import app from '@/components/layouts/app.vue'
const userinfo = JSON.parse(my.getStorage("userinfo"));
const layout = ref()
onMounted(() => {
  let settings = JSON.parse(my.getStorage("appsettings"));
  if (settings.defaultLayout == "host") {
    if (settings.layoutModules[0].navmod == "app") {
      layout.value = app
    }
    else if (settings.layoutModules[0].navmod == "admin") {
      layout.value = admin
    }
  } else if (settings.defaultLayout == "app") {
    layout.value = app
  }
  else if (settings.defaultLayout == "admin") {
    layout.value = admin
  }
})
</script>