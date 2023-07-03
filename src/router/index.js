/**
 * 路由配置
 */
import NProgress from 'nprogress';
import { createRouter, createWebHistory } from 'vue-router';
import { WHITE_LIST, REDIRECT_PATH, SSO_FLAG, BASE_URL } from '@/config/setting';
import { useUserStore } from '@/store/modules/user';
import { getToken } from '@/utils/token-util';
import { routes, getMenuRoutes } from './routes';
import { SsoUtil } from '@/utils/sso-util';
import { useSystemStore } from '@/store/modules/system';
import { SysConfigApi } from '@/api/system/basedata/SysConfigApi';

NProgress.configure({
  speed: 200,
  minimum: 0.02,
  trickleSpeed: 200,
  showSpinner: false
});

const router = createRouter({
  routes,
  history: createWebHistory(BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  }
});

/**
 * 路由守卫
 */
router.beforeEach(async (to, from) => {
  // 网站顶部小进度条开启
  if (!from.path.includes(REDIRECT_PATH)) {
    NProgress.start();
  }

  // 当前用户没有登录，没有token
  if (!getToken()) {
    // 当前路径不存在白名单内
    if (!WHITE_LIST.includes(to.path)) {
      // 当前路径不在白名单，如果开启了sso，并且未携带有errorCode（单点返回来的），跳转到单点detection
      if (SSO_FLAG && !to.query.errorCode && !to.query.token) {
        SsoUtil.redirectDetection();
      } else {
        // 没开启sso，直接跳转到登录界面
        return {
          path: '/login',
          query: to.path === '/' ? {} : { from: to.path }
        };
      }
    }
  }

  // 可以获取到token，代表用户已经登录了
  else {
    // 校验系统是否初始化过，如果没有初始化过，则进入初始化界面初始化一些后台需要的参数
    const systemStore = useSystemStore();

    if (systemStore.alreadyInitConfig === null || !systemStore.alreadyInitConfig) {
      // 获取是否系统初始化过配置
      let alreadyInit = await SysConfigApi.getInitConfigFlag();

      // 更新store中存储的标识
      systemStore.updateInitFlag(alreadyInit);

      // 如果没有初始化系统配置，并且当前跳转的界面不是init界面，则跳转到init界面
      if (!alreadyInit && to.path !== '/init') {
        return { path: '/init' };
      }
    }

    // 注册动态路由
    const userStore = useUserStore();
    if (!userStore.menus) {
      const { menus, homePath } = await userStore.fetchUserInfo();
      if (menus) {
        router.addRoute(getMenuRoutes(menus, homePath));
        return { ...to, replace: true };
      }
    }
  }
});

router.afterEach(to => {
  if (!to.path.includes(REDIRECT_PATH) && NProgress.isStarted()) {
    setTimeout(() => {
      NProgress.done(true);
    }, 200);
  }
});

export default router;
