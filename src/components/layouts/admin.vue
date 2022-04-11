<template>
  <el-container>
    <el-header>
      <el-menu mode="horizontal" :default-active="activeIndex.head">
        <template v-for="(item, i) in headMenus" :key="i">
          <el-menu-item @click="handleHeadMenu(item)" :index="item.id + ''">{{ item.title }}</el-menu-item>
        </template>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="activeIndex.left">
          <template v-for="(item, i) in leftMenus" :key="i">
            <treemenu :item="item" @clickMenu="handleMenu" />
          </template>
        </el-menu>
      </el-aside>
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

<script  setup>
import { ref, onMounted, lodash, reactive } from '@/apis'
import treemenu from './treemenu.vue'
const routes = JSON.parse(dingfei.getStorage("routes"));
const headMenus = ref()
const leftMenus = ref()
const navmod = ref()
const activeIndex = reactive({
  head: "",
  left: ""
})
const currentTabValue = ref()
const iframeTabs = ref([])
const handleHeadMenu = (menu) => {
  let menus = dingfei.getTree(routes, menu.id)
  leftMenus.value = menus
}
const handleMenu = (item) => {
  let iframeId = "mainiframe";
  if (navmod.value == "inject") {
    //iframe
    document.getElementById(iframeId).src = item.path
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
  let appsettings = JSON.parse(dingfei.getStorage("appsettings"));
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
  //设置左边默认导航菜单
  let idx = appsettings.defaultLayout == "host" ? 1 : 0
  let menuId = defaultRoute.ids.split(",")[idx];
  let defaultMenu = lodash.find(routes, { id: parseInt(menuId) })
  handleHeadMenu(defaultMenu)
  activeIndex.head = menuId //默认顶部选择效果
  activeIndex.left = defaultRoute.ids //默认左边选择效果
})
</script>