import { lodash } from "@/apis";

export default {
  install: (app, options) => {
    //重置表单
    app.config.globalProperties.$resetForm = (from) => {
      if (!from) return;
      from.resetFields();
    }
    //重置查询
    app.config.globalProperties.$resetSearch = (from) => {
      if (!from) return;
      from.search();
    }
    //控制按钮权限
    app.directive('hasAuth', {
      mounted(el, binding, vnode, oldVnode) {
        var obj = lodash.find(JSON.parse(dingfei.getStorage("routes")), { 'title': binding.value,'type':'res' })
        if (lodash.isUndefined(obj)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}