<!-- 菜单编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer
      :width="1100"
      :visible="visible"
      title="修改菜单"
      v-if="isUpdate"
      @close="updateVisible(false)"
      :isShowTab="isShowTab"
      :activeKey="activeKey"
      :tabList="tabList"
      @tabChange="tabChange"
    >
      <!-- 基本信息 -->
      <menu-form v-model:form="form" :rules="rules" :menuList="menuList" ref="form" :appList="appList" v-if="activeKey == '1'"></menu-form>
      <!-- 按钮管理 -->
      <menu-button v-if="activeKey == '2'" :data="data" @openBindResource="openBindResource"></menu-button>
      <!-- 权限管理 -->
      <menu-resource ref="resourceBind" v-if="activeKey == '3'" />
      <template #extra>
        <div style="height: 32px">
          <a-button type="primary" @click="save" :loading="loading" v-show="activeKey == '1'">确定</a-button>
        </div>
      </template>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="800"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建菜单"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <menu-form v-model:form="form" :rules="rules" :menuList="menuList" ref="form" :appList="appList"></menu-form>
    </a-modal>

    <!-- 按钮管理权限弹窗 -->
    <menu-resource ref="buttonResourceBind" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { MenuApi } from '@/api/system/menu/MenuApi';
import MenuForm from './menu-form.vue';
import MenuButton from './menu-button.vue';
import MenuResource from '@/views/system/menu/menu-resource.vue';
import { nextTick } from 'vue-demi';

export default {
  name: 'MenuEdit',
  components: { QuestionCircleOutlined, MenuForm, MenuButton, MenuResource },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 默认选中
    defaultKey: String
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        menuParentId: [{ required: true, type: 'string', message: '请选择上级菜单', trigger: 'blur' }],
        appCode: [{ required: true, type: 'string', message: '请选择所属应用', trigger: 'blur' }],
        menuCode: [{ required: true, type: 'string', message: '请输入菜单编码', trigger: 'blur' }],
        menuName: [{ required: true, type: 'string', message: '请输入菜单名', trigger: 'blur' }],
        menuSort: [{ required: true, type: 'number', message: '请输入排序号', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 菜单树
      menuList: [],
      // 应用列表
      appList: [],
      // tab默认选中
      activeKey: '1',
      // tab栏列表
      tabList: [
        {
          key: '1',
          name: '基本信息'
        },
        {
          key: '2',
          name: '按钮管理'
        },
        {
          key: '3',
          name: '绑定接口'
        }
      ],
      // 是否显示tab栏
      isShowTab: false
    };
  },
  created() {
    this.isUpdate = this.data ? true : false;
  },
  watch: {
    data() {
      this.isUpdate = this.data ? true : false;
      this.setData();
    }
  },
  async mounted() {
    // 查询菜单节点
    this.menuList = await MenuApi.getMenuTree();

    // 查询应用
    this.appList = await MenuApi.getAppDropList();
    this.setData();
  },
  methods: {
    // 设置基础数据
    setData() {
      if (this.data) {
        // 是否显示tab栏
        if (this.data.leafFlag) {
          this.isShowTab = true;
        } else {
          this.isShowTab = false;
        }
        this.tabChange(this.defaultKey);
      } else {
        this.form = {
          antdvLinkOpenType: 0,
          antdvFrontType: 1,
          isShow: true
        };
      }
      if (this.activeKey == '1' && this.$refs.form && this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    // 打开按钮资源抽屉
    openBindResource(row) {
      this.$refs.buttonResourceBind.openWindow('按钮名称：' + row.buttonName, 2, row.buttonId, true);
    },
    // tab切换
    tabChange(key) {
      this.activeKey = key;
      if (key == '1') {
        this.form = Object.assign(this.data, {
          menuParentId: this.data.menuParentId === 0 ? null : this.data.menuParentId,
          antdvLinkOpenType: this.data.antdvLinkOpenType === null ? 0 : this.data.antdvLinkOpenType,
          isShow: this.data.antdvVisible === 'Y' ? true : false
        });
      } else if (key == '2') {
      } else if (key == '3') {
        nextTick(() => {
          this.$refs.resourceBind.openWindow('绑定接口资源：' + this.data.appName + '-' + this.data.menuName, 1, this.data.menuId, false);
        });
      }
    },
    /**
     * 保存和编辑菜单
     *
     * @author jiawei
     * @date 2021/4/8 12:00
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(valid => {
        if (valid) {
          // 校验内链/外链格式
          if (this.form.antdvLinkOpenType === 0) {
            if (!(this.form.antdvRouter && this.form.antdvRouter.startsWith('/'))) {
              message.error('路由地址格式错误');
              return;
            }
          } else if (this.form.antdvLinkOpenType === 1) {
            if (!(this.form.antdvRouter && this.form.antdvRouter.startsWith('/'))) {
              message.error('路由地址格式错误');
              return;
            }
            if (!this.isUrl(this.form.antdvComponent)) {
              message.error('内链格式错误');
              return;
            }
          } else if (this.form.antdvLinkOpenType === 2) {
            if (!this.isUrl(this.form.antdvRouter)) {
              message.error('外链格式错误');
              return;
            }
            this.form.antdvComponent = '';
          }

          // 是否可见
          this.form.visible = this.form.isShow ? 'Y' : 'N';

          // 修改加载框为正在加载
          this.loading = true;

          let result = null;

          // 执行编辑或修改菜单方法
          if (this.isUpdate) {
            //
            result = MenuApi.editMenu(this.form);
          } else {
            result = MenuApi.addMenu(this.form);
          }
          result
            .then(result => {
              // 移除加载框
              this.loading = false;

              // 提示添加成功
              message.success(result.message);

              // 如果是新增菜单，则form表单置空
              if (!this.isUpdate) {
                this.form = {};
              }
              // 关闭弹框，通过控制visible的值，传递给父组件
              this.updateVisible(false);
              // 触发父组件done事件
              this.$emit('done');
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },

    /**
     * 更新编辑菜单界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author jiawei
     * @date 2021/4/7 12:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 判断是否是网址
     *
     * @author fengshuonan
     * @date 2022/5/31 11:21
     */
    isUrl(url) {
      return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('://'));
    }
  }
};
</script>

<style scoped lang="less">
:deep(.ant-drawer-body) {
  padding: 10px 24px 24px 24px;
}
</style>
