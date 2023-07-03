import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import permission from './utils/permission';
import i18n from './i18n';
import './styles/index.less';
import * as antIcons from '@ant-design/icons-vue';
import CommonDrawer from '@/components/CommonDrawer/index.vue'

const app = createApp(App);

app.use(router);
app.use(store);
app.use(permission);
app.use(i18n);
// 全局注册抽屉
app.component('common-drawer', CommonDrawer);

app.mount('#app');

// 注册图标组件到全局
Object.keys(antIcons).forEach(key => {
  app.component(key, antIcons[key]);
});
app.config.globalProperties.$antIcons = antIcons;
