import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/layout/index.vue')
import error from './modules/error'
import manageUser from './modules/manage-user'
/* 菜单栏的路由 */
// 固定菜单
export const fixedRoutes = [
  {
    path: '/home',
    component: Layout,
    name: 'Dashboard',
    meta: {
      title: 'menu.dashboard',
    },
    icon: 'icon-home',
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'menu.homepage',
          affix: true,
        },
      },
    ],
  },
]
// 动态菜单
export const asyncRoutes = [manageUser]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/redirect/:path(.*)',
      component: Layout,
      children: [
        {
          path: '',
          component: () => import('@/views/redirect/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/lock',
      name: 'lock',
      component: () => import('@/views/lock/index.vue'),
      meta: {
        title: '屏幕已锁定',
      },
    },
    ...fixedRoutes,
    ...error,
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

export default router
