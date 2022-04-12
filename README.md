#### nginx 部署
#```
server {
    listen       8080;
    server_name  localhost;
    location / {
        root  C:\Users\Administrator\Desktop\vue-admin\dist;
        try_files $uri $uri/ /index.html;
    }	
    location ^~ /xxx {
        alias C:\Users\Administrator\Desktop\vue-admin\dist\xxx;
        try_files $uri $uri/ /index.html;
    }
}
#```
#### appsettings.json
#```
{
  "LayoutModules": [
    {
      "name": "host",
      "navmod": "admin" //"app or admin 二选一"
    },
    {
      "name": "app",
      "navmod": "inject" //inject or tabpage or newpage 三选一
    },
    {
      "name": "admin",
      "navmod": "inject" //inject or tabpage 二选一
    }
  ],
  "DefaultLayout": "host"
}
#```
#### routes.json
#```
{
	"id": "",//编号
	"title": "",//标题
	"pid": 0,//父编号
	"path": "",//访问地址
    "component":"#"//组件地址
	"type": "cat nav res",//页面类型 【目录（cat）>菜单（nav）>资源（res）】
	"level": 1,//级别
	"idx": 0,//排序
    "default":true/false,//是否默认页
    "ids":""//编号集合(','号分割)
    "meta":{
      "requiresAuth": true/false,//是否启用授权验证
      "title":""//弹窗标题
      "width":0,//弹窗宽度
      "height":0//弹窗高度
    }
}
#```