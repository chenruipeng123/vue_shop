import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue';
import Right from '../components/power/Rights.vue';
import Roles from '../components/power/Roles.vue';
import Cate from '../components/goods/Cate.vue';
import Params from '../components/goods/Params.vue';
import List from '../components/goods/List.vue';
import Add from '../components/goods/Add.vue';
import Order from '../components/order/Order.vue';

Vue.use(VueRouter)

const routers = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path:'/welcome',
      component:Welcome
    },
    {
      path:'/rights',
      component:Right
    },
    {
      path:'/users',
      component:Users
    },
    {
      path:'/roles',
      component:Roles
    },
    {
      path:'/categories',
      component:Cate
    },
    {
      path:'/params',
      component:Params
    },
    {
      path:'/goods',
      component:List
    },
    {
      path:'/goods/add',
      component:Add
    },
    {
      path:'/orders',
      component:Order
    },
    ]
  }
]

const router = new VueRouter({
  routes: routers
})
//挂载路由导航守卫
//to将要访问的路径
//from从那个路径跳转而来
//next() 放行
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next('/login');
  return next();
})
export default router
