<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '编辑API应用' : '新建API应用'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      layout="horizontal"
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
    >
      <a-form-item label="API应用名称:" name="apiClientName">
        <a-input v-model:value="form.apiClientName" placeholder="请输入API应用名称" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="API应用编号:" name="apiClientCode">
        <a-input v-model:value="form.apiClientCode" placeholder="请输入API应用编号，例如client-app-001" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="API应用密钥:" name="apiClientSecret">
        <div style="width: 100%">
          <a-input
            v-model:value="form.apiClientSecret"
            placeholder="请生成API应用的秘钥"
            allow-clear
            autocomplete="off"
            style="width: 85%"
          />
          <a-button type="primary" style="width: 15%" @click="createTokenSecret">生成</a-button>
        </div>
      </a-form-item>
      <a-form-item label="token过期时间:" name="apiClientTokenExpiration">
        <a-input-number
          v-model:value="form.apiClientTokenExpiration"
          placeholder="单位:秒"
          allow-clear
          autocomplete="off"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="排序:" name="apiClientSort">
        <a-input v-model:value="form.apiClientSort" allow-clear autocomplete="off" />
      </a-form-item>

      <a-form-item label="公钥:" name="apiPublicKey">
        <div style="width: 100%">
          <a-input v-model:value="form.apiPublicKey" placeholder="请生成数据加密公钥" allow-clear autocomplete="off" style="width: 85%" />
          <a-button type="primary" style="width: 15%" @click="createRSASecretPair">生成秘钥对</a-button>
        </div>
      </a-form-item>

      <a-form-item label="私钥:" name="apiPrivateKey">
        <a-input v-model:value="form.apiPrivateKey" placeholder="请生成数据加密私钥" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { ApiAppApi } from '@/api/auth/ApiAppApi';
import { uuid } from 'ele-admin-pro';

export default {
  name: 'ManagementEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        apiClientName: [{ required: true, message: '请输入应用名称', type: 'string', trigger: 'blur' }],
        apiClientCode: [{ required: true, message: '请输入应用编码', type: 'string', trigger: 'blur' }],
        apiClientSecret: [{ required: true, message: '请生成token秘钥', type: 'string', trigger: 'blur' }],
        apiClientTokenExpiration: [{ required: true, message: '请输入token过期时间', type: 'number', trigger: 'blur' }],
        apiPublicKey: [{ required: true, message: '请生成数据加密公钥', type: 'string', trigger: 'blur' }],
        apiPrivateKey: [{ required: true, message: '请生成数据加密私钥', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      managementData: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        if (this.data) {
          this.form = Object.assign({}, this.data);
          this.isUpdate = true;
        } else {
          this.createRSASecretPair();
          this.createTokenSecret();
          this.isUpdate = false;
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      } else {
        this.form = {};
      }
    }
  },
  methods: {
    /**
     * 保存和编辑API应用
     *
     * @author fengshuonan
     * @date 2022/4/16 15:14
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改
      if (this.isUpdate) {
        result = ApiAppApi.edit(this.form);
      } else {
        result = ApiAppApi.add(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          message.success(result.message);

          // 如果是新增，则form表单置空
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
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2022/4/16 15:14
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 生成RSA秘钥对，用来加密和解密数据用
     *
     * @author fengshuonan
     * @date 2022/4/16 15:14
     */
    async createRSASecretPair() {
      let resultData = await ApiAppApi.rsaKeyPair();
      this.form.apiPublicKey = resultData.apiPublicKey;
      this.form.apiPrivateKey = resultData.apiPrivateKey;
    },

    /**
     * 创建token的秘钥
     *
     * @author fengshuonan
     * @date 2022/4/16 15:13
     */
    createTokenSecret() {
      this.form.apiClientSecret = uuid();
    }
  }
};
</script>
