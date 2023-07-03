<template>
  <div :class="['login-wrapper', ['', 'login-form-right', 'login-form-left'][direction]]" ref="loginPage">
    <a-form class="login-form ele-bg-white">
      <h4>{{ t('login.title') }}</h4>
      <a-form-item v-if="saasFlag">
        <a-select allow-clear size="large" v-model:value="form.tenantCode" :placeholder="t('login.tenantName')">
          <a-select-option v-for="item in saasList" :key="item.tenantCode" :value="item.tenantCode">
            {{ item.companyName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-bind="validateInfos.account">
        <a-input allow-clear size="large" v-model:value="form.account" :placeholder="t('login.username')">
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item v-bind="validateInfos.password">
        <a-input-password size="large" v-model:value="form.password" :placeholder="t('login.password')">
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item v-bind="validateInfos.verCode" v-if="captchaFlag">
        <div class="login-input-group">
          <a-input allow-clear size="large" v-model:value="form.verCode" :placeholder="t('login.code')">
            <template #prefix>
              <safety-certificate-outlined />
            </template>
          </a-input>
          <a-button class="login-captcha" @click="changeCaptcha">
            <img v-if="captcha" :src="captcha" alt="" />
          </a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="form.rememberMe"> 7天免登陆 </a-checkbox>
        <router-link to="/forget" class="ele-pull-right" style="line-height: 22px">
          {{ t('login.forget') }}
        </router-link>
      </a-form-item>
      <a-form-item>
        <a-button block size="large" type="primary" :loading="loading" @click="submit">
          {{ loading ? t('login.loading') : t('login.login') }}
        </a-button>
      </a-form-item>
      <div class="ele-text-center" style="padding-bottom: 32px">
        <qq-outlined class="login-oauth-icon" style="background: #3492ed" @click="oauth2Login('qq')" />
        <wechat-outlined class="login-oauth-icon" style="background: #4daf29" @click="oauth2Login('wechat')" />
        <span class="anticon login-oauth-icon" style="padding: 0">
          <img src="@/assets/gitee.png" style="width: 28px; margin-top: -8px" @click="oauth2Login('gitee')" />
        </span>
      </div>
    </a-form>
    <div class="login-copyright">copyright © 2022 javaguns.com all rights reserved.</div>
    <!-- 多语言切换 -->
    <div style="position: absolute; right: 30px; top: 20px; z-index: 999">
      <i18n-icon placement="bottomLeft" :style="{ fontSize: '18px', color: '#fff' }" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { Form, message } from 'ant-design-vue';
import { LockOutlined, QqOutlined, SafetyCertificateOutlined, UserOutlined, WechatOutlined } from '@ant-design/icons-vue';
import I18nIcon from '@/layout/components/i18n-icon.vue';
import { getToken, setToken } from '@/utils/token-util';
import { cleanPageTabs, goHomeRoute } from '@/utils/page-tab-util';
import { LoginApi } from '@/api/login/LoginApi';
import { BACKEND_HOST, CAPTCHA_FLAG, SAAS_FLAG, SESSION_KEY_MENU_TYPE, SSO_CLIENT_ID, SSO_FLAG, IS_NEED_RSA } from '@/config/setting';
import { SysTenantApi } from '@/api/tenant/SysTenantApi';
import { useSystemStore } from '@/store/modules/system';
import { SsoUtil } from '@/utils/sso-util';
import { RsaEncry } from '@/utils/util';

const useForm = Form.useForm;

const { currentRoute } = useRouter();
const { query } = useRoute();
const { t } = useI18n();

// 先清空缓存的前后台标识
sessionStorage.removeItem(SESSION_KEY_MENU_TYPE);

// 获取url传参的相关单点参数
const ssoClientId = query?.clientId;
const ssoCallback = query?.ssoCallback;

// guns添加的自定义配置
// 是否开启多租户
const saasFlag = ref(SAAS_FLAG);
const saasList = ref([]);
// 主题信息
let themeInfo = ref({
  gunsMgrLoginBackgroundImg: '',
  gunsMgrFooterText: '',
  gunsMgrBeiUrl: '',
  gunsMgrBeiNo: ''
});
// 登录页面引用
const loginPage = ref(null);
// 验证码校验
const captchaFlag = ref(CAPTCHA_FLAG);

// 登录框方向, 0 居中, 1 居右, 2 居左
const direction = ref(0);
// 加载状态
const loading = ref(false);
// 表单数据
const form = reactive({
  account: '',
  password: '',
  verKey: '',
  verCode: '',
  rememberMe: false
});
// 验证码 base64 数据
const captcha = ref('');
// 验证码key标识
const verKey = ref('');

// 表单验证规则
let ruleLists = ref({
  account: [
    {
      required: true,
      message: t('login.username'),
      type: 'string',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('login.password'),
      type: 'string',
      trigger: 'blur'
    }
  ]
});
// 如果开启了验证码开关，则同时需要校验验证码是否填写
if (captchaFlag.value) {
  ruleLists.value.verCode = [
    {
      required: true,
      message: t('login.code'),
      type: 'string',
      trigger: 'blur'
    }
  ];
}
const { clearValidate, validate, validateInfos } = useForm(
  form,
  computed(() => ruleLists.value)
);

// 从store获取主题数据
let systemStore = useSystemStore();

/* 页面加载完成 */
onMounted(async () => {
  // 加载租户列表
  if (saasFlag.value) {
    saasList.value = await SysTenantApi.dropDownList();
  }
  let result = await systemStore.loadThemeInfo();
  themeInfo.value = result;
  // 动态设置登录页面的背景
  loginPage.value.style.setProperty('--customBackground', `url(${result.gunsMgrLoginBackgroundImg})`);
});

/* 跳转到首页 */
const goHome = () => {
  const { query } = unref(currentRoute);
  goHomeRoute(query.from);
};

/* 提交 */
const submit = () => {
  if (SSO_FLAG && SAAS_FLAG) {
    message.warn('租户开关和单点开关不能同时开启');
    return;
  }
  validate().then(() => {
    loading.value = true;
    let formData = JSON.parse(JSON.stringify(form));
    // 是否需要加密
    if (IS_NEED_RSA) {
      // rsa加密密码
      formData.password = RsaEncry(formData.password);
    }
    LoginApi.login(formData)
      .then(response => {
        // 没开启单点登录
        if (!SSO_FLAG) {
          message.success('登录成功');
          if (response?.data?.loginUser?.menuType) {
            localStorage.setItem('menuType', response?.data?.loginUser?.menuType);
          }
          setToken(response?.data?.token, form.rememberMe);
          cleanPageTabs();
          goHome();
        } else {
          // 开启了单点登录
          SsoUtil.activateByLoginCode(ssoClientId ?? SSO_CLIENT_ID, ssoCallback ?? '', response?.data?.ssoLoginCode);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

/* 获取图形验证码 */
const changeCaptcha = () => {
  // 这里演示的验证码是后端返回base64格式的形式, 如果后端地址直接是图片请参考忘记密码页面
  LoginApi.getCaptcha()
    .then(response => {
      captcha.value = response.data.verImage;
      verKey.value = response.data.verKey;
      form.verKey = response.data.verKey;
      clearValidate();
    })
    .catch(e => {
      message.error(e.message);
    });
};

/* oauth2第三方登录 */
const oauth2Login = type => {
  if (type === 'qq') {
    window.location.href = BACKEND_HOST + '/oauth2/detection/qq';
  } else if (type === 'wechat') {
    window.location.href = BACKEND_HOST + '/oauth2/detection/wechat';
  } else if (type === 'gitee') {
    window.location.href = BACKEND_HOST + '/oauth2/detection/gitee';
  }
};

if (getToken()) {
  goHome();
} else {
  changeCaptcha();
}
</script>

<style lang="less" scoped>
body {
  /*自定义背景图片*/
  --customBackground: url('@/assets/bg-login.jpg');
}

/* 背景 */
.login-wrapper {
  padding: 48px 16px 0 16px;
  position: relative;
  box-sizing: border-box;
  background-image: var(--customBackground);
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }
}

/* 卡片 */
.login-form {
  width: 360px;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 28px;
  box-sizing: border-box;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  position: relative;
  z-index: 2;

  h4 {
    padding: 22px 0;
    text-align: center;
  }
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;

  :deep(.ant-input-affix-wrapper) {
    flex: 1;
  }

  .login-captcha {
    width: 102px;
    height: 40px;
    margin-left: 10px;
    padding: 0;

    & > img {
      width: 100%;
      height: 100%;
    }
  }
}

/* 第三方登录图标 */
.login-oauth-icon {
  color: #fff;
  padding: 5px;
  margin: 0 12px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  text-align: center;
  padding: 48px 0 22px 0;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media screen and (min-height: 640px) {
  .login-wrapper {
    padding-top: 0;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -230px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -230px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

@media screen and (max-width: 768px) {
  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    margin-left: 0;
    margin-right: auto;
    transform: translateX(-50%);
  }
}
</style>
