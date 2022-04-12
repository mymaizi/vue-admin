import { createRouter, createWebHistory } from 'vue-router'
import lodash from 'lodash'
import App from "./App.vue"

const routes = [
  { name: "login", path: '/', component: () => import('./Login.vue') },
  { name: "host", path: '/host', component: () => import('./Host.vue') },
  { name: "main", path: '/main', component: () => import('./Main.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let newRouter = lodash.filter(JSON.parse(dingfei.getStorage("routes")), o => o.component != "" && o.path != "")
function addRouter(data, pid) {
  return data.filter(item => {
    return item.pid == pid
  }).map(item => {
    if(item.pid==null){
      item.path=`/${item.path}`
    }
    if(item.component=="#"){
      item.component=App;
    }else{
      let component=`./views/${item.component}.vue`;
      item.component=()=>import(component);
    }
    item.children=addRouter(data, item.id);
    return item;
  })
}
addRouter(newRouter).forEach(item => {
  router.addRoute(item)
});

router.beforeEach((to, from, next) => {
  let routes = dingfei.getStorage("routes")
  if (routes) {
    next();
  } else {
    if (to.path === '/') {
      next()
    } else {
      next('/');
    }
  }
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