const Layout = () => import('@/layout/index.vue')

export default {
  path: '/manage-user',
  component: Layout,
  name: 'manage-user',
  redirect: '/manage-user/account',
  meta: {
    title: 'menu.manageUser',
    roles: ['101'],
  },
  icon: 'Location',
  children: [
    {
      path: 'account',
      name: 'account',
      component: () => import('@/views/manage-user/account/index.vue'),
      meta: {
        title: 'menu.manageAccount',
        roles: ['1000'],
      },
      icon: 'Location',
    },
    {
      path: 'account-group',
      name: 'account-group',
      component: () => import('@/views/manage-user/account-group/index.vue'),
      meta: {
        title: 'menu.accountGroup',
        roles: ['1000'],
      },
      icon: 'Location',
    },
  ]
}