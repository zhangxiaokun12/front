<!-- 顶栏右侧区域 -->
<template>
  <div class="ele-admin-header-tool">
    <div class="ele-admin-header-tool-item" @click="jumpGuns">
      <img src="@/assets/images/guns.png" alt="" class="guns-img" />
      <span class="guns-title">Guns-DevOps</span>
    </div>
    <!-- 全屏切换 -->
    <div class="ele-admin-header-tool-item hidden-sm-and-down" @click="toggleFullscreen">
      <fullscreen-exit-outlined v-if="fullscreen" />
      <fullscreen-outlined v-else />
    </div>
    <!-- 语言切换 -->
    <div class="ele-admin-header-tool-item">
      <i18n-icon />
    </div>
    <!-- 消息通知 -->
    <div class="ele-admin-header-tool-item">
      <header-notice />
    </div>
    <!-- 用户信息 -->
    <div class="ele-admin-header-tool-item">
      <a-dropdown placement="bottom" :overlay-style="{ minWidth: '120px' }">
        <div class="ele-admin-header-avatar">
          <a-avatar :src="loginUser.avatar">
            <template v-if="!loginUser.avatar" #icon>
              <user-outlined />
            </template>
          </a-avatar>
          <span class="hidden-sm-and-down">{{ loginUser.nickname }}</span>
          <down-outlined style="margin-left: 6px" />
        </div>
        <template #overlay>
          <a-menu :selectable="false" @click="onUserDropClick">
            <a-menu-item key="profile">
              <div class="ele-cell">
                <user-outlined />
                <div class="ele-cell-content">
                  {{ t('layout.header.profile') }}
                </div>
              </div>
            </a-menu-item>
            <a-menu-item key="password">
              <div class="ele-cell">
                <key-outlined />
                <div class="ele-cell-content">
                  {{ t('layout.header.password') }}
                </div>
              </div>
            </a-menu-item>
            <a-menu-item key="backend" v-if="antdvFrontType === 1 && menuType == 3">
              <div class="ele-cell">
                <SettingOutlined />
                <div class="ele-cell-content">后台管理</div>
              </div>
            </a-menu-item>
            <a-menu-item key="frontend" v-if="antdvFrontType === 2 && menuType == 3">
              <div class="ele-cell">
                <AppstoreAddOutlined />
                <div class="ele-cell-content">前台系统</div>
              </div>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout">
              <div class="ele-cell">
                <logout-outlined />
                <div class="ele-cell-content">
                  {{ t('layout.header.logout') }}
                </div>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <!-- 主题设置 -->
    <div class="ele-admin-header-tool-item" @click="openSetting">
      <more-outlined />
    </div>
  </div>
  <!-- 修改密码弹窗 -->
  <password-modal v-model:visible="passwordVisible" />
  <!-- 主题设置抽屉 -->
  <setting-drawer v-model:visible="settingVisible" />
</template>

<script setup>
import { computed, createVNode, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Modal } from 'ant-design-vue';
import {
  DownOutlined,
  MoreOutlined,
  UserOutlined,
  KeyOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SettingOutlined,
  AppstoreAddOutlined
} from '@ant-design/icons-vue';
import HeaderNotice from './header-notice.vue';
import PasswordModal from './password-modal.vue';
import SettingDrawer from './setting-drawer.vue';
import I18nIcon from './i18n-icon.vue';
import { useUserStore } from '@/store/modules/user';
import { logout } from '@/utils/page-tab-util';
import { LoginApi } from '@/api/login/LoginApi';
import { BASE_URL, SESSION_KEY_MENU_TYPE, SSO_FLAG, GUNS_DEVOPS_URL } from '@/config/setting';
import { SsoUtil } from '@/utils/sso-util';
import { removeToken, getToken } from '@/utils/token-util';
import { useSystemStore } from '@/store/modules/system';

const emit = defineEmits(['fullscreen']);

defineProps({
  // 是否是全屏
  fullscreen: Boolean
});

const { push } = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const systemStore = useSystemStore();

// 是否显示修改密码弹窗
const passwordVisible = ref(false);

// 是否显示主题设置抽屉
const settingVisible = ref(false);

// 当前用户信息
const loginUser = computed(() => userStore.info ?? {});

// 显示的前后台类型
const menuType = computed(() => {
  return Number(localStorage.getItem('menuType'));
});

// 当前系统加载的前后台菜单类型
const antdvFrontType = computed(() => systemStore.antdvFrontType);

/* 用户信息下拉点击 */
const onUserDropClick = ({ key }) => {
  if (key === 'password') {
    passwordVisible.value = true;
  } else if (key === 'profile') {
    push('/personal/info');
  } else if (key === 'logout') {
    // 退出登录
    Modal.confirm({
      title: t('layout.logout.title'),
      content: t('layout.logout.message'),
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: async () => {
        // 清除本地菜单类型缓存
        if (localStorage.getItem('menuType')) {
          localStorage.removeItem('menuType');
        }

        // 如果开启了单点登录，跳转到单点的退出
        if (SSO_FLAG) {
          // 清除token
          removeToken();
          // 调用sso退出接口
          SsoUtil.ssoLogoutRedirect();
        } else {
          // 调用退出接口
          await LoginApi.logout();
          // 清除缓存token并退出
          logout();
        }
      }
    });
  } else if (key === 'frontend') {
    // 设置session值为前台菜单
    sessionStorage.setItem(SESSION_KEY_MENU_TYPE, '1');

    // 从新加载系统界面，跳转到首页
    window.location.replace(BASE_URL);
  } else if (key === 'backend') {
    // 设置session值为后台菜单
    sessionStorage.setItem(SESSION_KEY_MENU_TYPE, '2');

    // 从新加载系统界面，跳转到首页
    window.location.replace(BASE_URL);
  }
};

/* 切换全屏 */
const toggleFullscreen = () => {
  emit('fullscreen');
};

/* 打开主题设置抽屉 */
const openSetting = () => {
  settingVisible.value = true;
};

// 跳转到guns
const jumpGuns = () => {
  window.open(GUNS_DEVOPS_URL + getToken());
};
</script>

<style scoped>
.guns-img {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.guns-title {
  font-size: 14px;
}
</style>
