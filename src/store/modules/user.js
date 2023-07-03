/*
 * @Author: nxy
 * @Date: 2022-10-26 11:16:44
 */
/**
 * 登录用户 store
 */
import { defineStore } from 'pinia';
import { formatMenus, formatTreeData } from 'ele-admin-pro';
import { getUserInfo } from '@/api/layout';
import { SESSION_KEY_MENU_TYPE } from '@/config/setting';
import { useSystemStore } from '@/store/modules/system';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    // 当前登录用户的信息
    info: null,
    // 当前登录用户的菜单
    menus: null,
    // 当前登录用户的权限
    authorities: [],
    // 当前登录用户的角色
    roles: []
  }),
  getters: {},
  actions: {
    /**
     * 请求用户信息、权限、角色、菜单
     */
    async fetchUserInfo() {
      // 获取加载的菜单类型，默认加载前台菜单
      let antdvMenuFrontType = 1;
      let menuType = localStorage.getItem('menuType');
      if (menuType) {
        menuType = parseInt(menuType);
        if (menuType == 1) {
          antdvMenuFrontType = 1;
        } else if (menuType == 2) {
          antdvMenuFrontType = 2;
        } else if (menuType == 3) {
          let sessionFrontType = sessionStorage.getItem(SESSION_KEY_MENU_TYPE);
          if (sessionFrontType) {
            antdvMenuFrontType = parseInt(sessionFrontType);
          }
        }
      }

      // 设置当前store值为session中的值
      let systemStore = useSystemStore();
      systemStore.setMenuFrontType(antdvMenuFrontType);

      // 调用获取用户信息接口
      const result = await getUserInfo(antdvMenuFrontType).catch(() => undefined);
      if (!result) {
        return {};
      }
      // 用户信息
      this.info = result;
      // 用户权限编码集合
      this.authorities = result.authCodes ?? [];
      // 用户角色
      this.roles = result.roles?.map(d => d.roleCode) ?? [];
      // 用户菜单, 过滤掉按钮类型并转为children形式
      const { menus, homePath } = formatMenus(result.authorities ?? []);
      this.menus = menus;
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setInfo(value) {
      this.info = value;
    },
    /**
     * 更新菜单的 badge
     */
    setMenuBadge(path, value, color) {
      this.menus = formatTreeData(this.menus, m => {
        if (path === m.path) {
          return Object.assign({}, m, {
            meta: Object.assign({}, m.meta, {
              badge: value,
              badgeColor: color
            })
          });
        }
        return m;
      });
    }
  }
});
