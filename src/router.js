import { createRouter, createWebHistory } from 'vue-router'
import lodash from 'lodash'

const routes = [
  { name: "login", path: '/', component: () => import('./Login.vue') },
  { name: "host", path: '/host', component: () => import('./Host.vue') },
  { name: "main", path: '/main', component: () => import('./Main.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//获取全局变量
const env = import.meta.env

//扩展router=>info函数用于获取指定路由信息（配合iframe弹窗使用）
router.info = (routeName, data, callback) => {
  let findRoute = null
  if (routeName) {
    findRoute = lodash.find(router.getRoutes(), { name: routeName });
    if (!findRoute) {
      window.msg.pop("没有找到指定页面!");
      return
    }
  } else {
    window.msg.pop(`[routeName]无效!`);
    return
  }
  let args = { scroll: 'yes' };
  args.url = `${env.BASE_URL}${findRoute.path.substring(1, findRoute.path.length)}`;
  args.title = findRoute.meta.title;
  args.width = findRoute.meta.width;
  args.height = findRoute.meta.height;
  args.data = data;
  args.callback = callback;
  return args;
}

export default router