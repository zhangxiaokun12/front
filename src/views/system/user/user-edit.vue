<!-- 用户编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer
      :width="800"
      :visible="visible"
      title="修改用户"
      @close="updateVisible(false)"
      v-if="isUpdate"
      :isShowTab="true"
      :activeKey="activeKey"
      :tabList="tabList"
      @tabChange="tabChange"
    >
      <template #extra>
        <div style="height: 32px">
          <a-button type="primary" @click="save" :loading="loading" v-show="activeKey == '1'">确定</a-button>
        </div>
      </template>
      <!-- 基本信息 -->
      <user-form v-model:form="form" ref="form" :rules="rules" :orgList="orgList" :isUpdate="isUpdate" v-show="activeKey == '1'">
        <field-expand-form ref="fieldExpandForm" expand-code="user_expand" />
      </user-form>

      <!-- 角色分配 -->
      <user-role v-if="activeKey == '2'" :data="data" ref="userRole"></user-role>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="800"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建用户"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <user-form v-model:form="form" ref="form" :rules="rules" :orgList="orgList" :isUpdate="isUpdate">
        <field-expand-form ref="fieldExpandForm" expand-code="user_expand" />
      </user-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { UserApi } from '@/api/system/user/UserApi';
import FieldExpandForm from '@/components/FieldExpand/FieldExpandForm.vue';
import UserForm from './user-form.vue';
import UserRole from './user-role.vue';
import { phoneReg, emailReg } from 'ele-admin-pro';
import { nextTick } from 'vue';

export default {
  name: 'UserEdit',
  components: { FieldExpandForm, UserForm, UserRole },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 组织机构列表
    orgList: Array,
    // 默认选中tab
    defaultKey: String
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        account: [{ required: true, message: '请输入用户账号', type: 'string', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', type: 'string', trigger: 'blur' }],
        repeatPassword: [
          { required: true, message: '请输入重复密码', type: 'string', trigger: 'blur' },
          {
            type: 'string',
            trigger: 'blur',
            // eslint-disable-next-line no-unused-vars
            validator: async (rule, value, callback) => {
              const password = this.form.password;
              if (value && password !== value) {
                return Promise.reject('两次密码输入不一致');
              } else {
                return Promise.resolve();
              }
            }
          }
        ],
        email: [{ pattern: emailReg, message: '邮箱格式不正确', type: 'string', trigger: 'blur' }],
        phone: [{ pattern: phoneReg, message: '手机号格式不正确', type: 'string', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择组织机构', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
      // tab栏列表
      tabList: [
        {
          key: '1',
          name: '基本信息'
        },
        {
          key: '2',
          name: '分配角色'
        }
      ],
      // 默认选中
      activeKey: '1'
    };
  },
  mounted() {
    this.setData();
  },
  watch: {
    data() {
      this.setData();
    }
  },
  methods: {
    // 初始化赋值
    setData() {
      if (this.visible) {
        if (this.data) {
          this.isUpdate = true;
          this.tabChange(this.defaultKey);
        } else {
          this.form = {};
          this.isUpdate = false;
          // 加载表单数据
          nextTick(() => {
            this.$refs.fieldExpandForm.loadForm();
          });
        }

        // 清空校验
        if (this.defaultKey == '1' && this.$refs.form.$refs.formRef) {
          this.$refs.form.$refs.formRef.clearValidate();
        }
      }
    },
    // tab切换
    tabChange(key) {
      this.activeKey = key;
      if (key == '1') {
        this.form = Object.assign({}, this.data);
        // 加载表单数据
        nextTick(() => {
          this.$refs.fieldExpandForm.loadForm(this.form.userId);
        });
      }
    },
    /**
     * 点击保存
     *
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(async valid => {
        if (valid) {
          // 校验拓展表单并获取数据
          await this.$refs.fieldExpandForm.validate();

          // 采集动态表单数据
          this.form.expandDataInfo = this.$refs.fieldExpandForm.getData();

          // 修改加载框为正在加载
          this.loading = true;

          let result;

          // 执行编辑或修改用户方法
          if (this.isUpdate) {
            result = UserApi.editUser(this.form);
          } else {
            result = UserApi.addUser(this.form);
          }
          result
            .then(result => {
              // 移除加载框
              this.loading = false;

              // 提示添加成功
              message.success(result.message);

              // 如果是新增用户，则form表单置空
              if (!this.isUpdate) {
                this.form = {};
              }
              // 关闭弹框，通过控制visible的值，传递给父组件
              this.updateVisible(false);

              this.$emit('done');
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },

    /**
     * 更新编辑用户界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style lang="less" scoped>
:deep(.ant-drawer-body) {
  padding: 10px 24px 24px 24px;
}
</style>
