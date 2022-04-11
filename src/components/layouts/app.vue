<template>
  <el-container>
    <el-header>
      <el-menu mode="horizontal">
        <template v-for="(item, i) in headMenus" :key="i">
          <treemenu :item="item" :index="item.id" @clickMenu="handleMenu" />
        </template>
      </el-menu>
    </el-header>
    <el-container>
      <el-main>
        <template v-if="navmod == 'tabpage'">
          <el-tabs v-model="currentTabValue" type="card" @tab-remove="handleTabs">
            <el-tab-pane
              v-for="item in iframeTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable="item.closable"
            >
              <iframe
                :id="item.name"
                width="100%"
                scrolling="auto"
                frameborder="0"
                :src="item.src"
              />
            </el-tab-pane>
          </el-tabs>
        </template>
        <template v-else>
          <iframe id="mainiframe" width="100%" scrolling="auto" frameborder="0" />
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref, onMounted, lodash } from '@/apis'
import treemenu from './treemenu.vue'
const headMenus = ref()
const navmod = ref()
const currentTabValue = ref()
const iframeTabs = ref([])
const handleMenu = (item) => {
  let iframeId = "mainiframe";
  if (navmod.value == "newpage") {
    //弹新窗体
    window.open(item.path);
    return
  } else if (navmod.value == "inject") {
    //iframe
    document.getElementById('mainiframe').src = item.path
  } else if (navmod.value == "tabpage") {
    //tab-iframe
    handleTabs(item, "add")
    iframeId = item.id
  }
  dingfei.resetiframeHeight(iframeId, 250);
}
const handleTabs = (menu, action) => {
  const tabs = iframeTabs.value
  if (action === 'add') {
    let flag = tabs.find((tab) => tab.name === menu.id) === undefined
    if (flag) {
      iframeTabs.value.push({
        title: menu.title,
        name: menu.id,
        src: menu.path,
        closable: tabs.length > 0
      })
    }
    currentTabValue.value = menu.id
  } else {
    let activeMenu = currentTabValue.value
    if (activeMenu.id === menu) {
      tabs.forEach((tab, index) => {
        if (tab.name === menu) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeMenu = nextTab
          }
        }
      })
    }
    currentTabValue.value = activeMenu
    iframeTabs.value = tabs.filter((tab) => tab.name !== menu)
  }
}
onMounted(() => {
  let routes = lodash.filter(JSON.parse(dingfei.getStorage("routes")),o=>o.type!="res");
  let appsettings = JSON.parse(dingfei.getStorage("appsettings"));
  //设置菜单
  let menus = dingfei.getTree(routes, appsettings.defaultLayout == "host" ? 1 : null)
  headMenus.value = menus
  //获取主题显示状态（tab(iframe),iframe,open）
  navmod.value = appsettings.layoutModules[appsettings.layoutModules[0].navmod == "app" ? 1 : 2].navmod;
  //控制iframe高度
  window.onresize = function () {
    dingfei.resetiframeHeight((currentTabValue.value != null ? currentTabValue.value.id : "mainiframe"), 250);
  }
  //设置默认显示页面
  let defaultRoute = lodash.find(routes, { "default": true });
  handleMenu(defaultRoute);
})
</script>