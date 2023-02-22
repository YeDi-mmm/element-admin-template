import { defineStore } from 'pinia';
import { fixedRoutes, asyncRoutes } from '@/router';
import router from '@/router';
import { ref } from 'vue';

export const useMenus = defineStore('menu', () => {
  const generateUrl = (path, parentPath) => {
    return path.startsWith('/') ? path : path ? `${parentPath}/${path}` : parentPath;
  };

  const getFilterRoutes = (targetRoutes, ajaxRoutes) => {
    const filterRoutes = [];
    ajaxRoutes.forEach((item) => {
      const target = targetRoutes.find((target) => {
        return target.name === item.name;
      });
      if (target) {
        const { children: targetChildren, ...rest } = target;
        const route = {
          ...rest,
        };

        if (item.children) {
          route.children = getFilterRoutes(targetChildren, item.children);
        }

        filterRoutes.push(route);
      }
    });
    return filterRoutes;
  };

  const getFilterMenus = (arr, parentPath = '') => {
    const menus = [];

    arr.forEach((item) => {
      if (!item.hidden) {
        const menu = {
          url: generateUrl(item.path, parentPath),
          title: item.meta.title,
          icon: item.icon,
        };
        if (item.children) {
          if (item.children.filter((child) => !child.hidden).length <= 1) {
            menu.url = generateUrl(item.children[0].path, menu.url);
          } else {
            menu.children = getFilterMenus(item.children, menu.url);
          }
        }
        menus.push(menu);
      }
    });
    return menus;
  };

  const menus = ref([]);
  const setMenus = (data) => {
    menus.value = data;
  };
  const generateMenus = async (roles) => {
    // // 方式一：只有固定菜单
    // const menus = getFilterMenus(fixedRoutes)
    // commit('SET_MENUS', menus)

    // 方式二：有动态菜单
    // 从后台获取菜单
    const dataRuotes = await generateRoutes(roles);

    // 添加路由之前先删除所有动态路由
    // asyncRoutes.forEach((item) => {
    //   router.removeRoute(item.name);
    // });

    // 过滤出需要添加的动态路由
    const filterRoutes = getFilterRoutes(asyncRoutes, dataRuotes);
    filterRoutes.forEach((route) => router.addRoute(route));
    // 生成菜单
    const menus = getFilterMenus([...fixedRoutes, ...filterRoutes]);
    setMenus(menus);
  };

  /**
   * 使用 meta.role 确定当前用户是否具有权限
   * @param roles
   * @param route
   */
  const hasPermission = (roles, route) => {
    if (route.meta && route.meta.roles) {
      return roles.some((role) => route.meta.roles.includes(String(role)));
    } else {
      return true;
    }
  };

  /**
   * 通过递归过滤异步路由表
   * @param routes asyncRoutes
   * @param roles
   */
  const filterAsyncRoutes = (routes, roles) => {
    const res = [];
    routes.forEach((route) => {
      const tmp = { ...route };
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles);
        }
        res.push(tmp);
      }
    });
    return res;
  };

  const generateRoutes = (roles) => {
    return new Promise((resolve) => {
      let accessedRoutes;
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      resolve(accessedRoutes);
    });
  };

  return {
    menus,
    setMenus,
    generateMenus,
  };
});
