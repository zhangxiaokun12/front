<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '编辑秘钥' : '新建秘钥'"
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
      <a-form-item label="密钥名称:" name="secretKeyName">
        <a-input v-model:value="form.secretKeyName" placeholder="请输入密钥名称" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="密钥所属人:" name="userId">
        <a-select
          v-model:value="form.userId"
          show-search
          :filter-option="false"
          placeholder="可输入用户账号进行搜索"
          :options="userSelectList"
          @search="handleSearch"
          @change="handleChange"
        />
      </a-form-item>
      <a-form-item label="密钥值:" name="secretKey">
        <div style="width: 100%">
          <a-input v-model:value="form.secretKey" placeholder="请生成用户秘钥" allow-clear autocomplete="off" style="width: 85%" />
          <a-button type="primary" style="width: 15%" @click="createUserSecret">生成</a-button>
        </div>
      </a-form-item>
      <a-form-item label="密钥过期时间:" name="secretExpirationTime">
        <a-date-picker
          v-model:value="form.secretExpirationTime"
          value-format="YYYY-MM-DD HH:mm"
          placeholder="请选择过期时间"
          class="ele-fluid"
        />
      </a-form-item>
      <a-form-item label="一次性秘钥:" name="secretOnceFlag">
        <a-switch v-model:checked="form.secretOnceFlag" />
      </a-form-item>
      <a-form-item label="特殊说明:" style="color: grey"> 秘钥生成后会加密存储到数据库，无法修改和查看，请记录好秘钥 </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { SecretKeyApi } from '@/api/auth/SecretKey';
import { UserApi } from '@/api/system/user/UserApi';
import { uuid } from 'ele-admin-pro';

export default {
  name: 'SecretKeyEdit',
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
        secretKeyName: [{ required: true, message: '请输入密钥名称', type: 'string', trigger: 'blur' }],
        userId: [{ required: true, message: '请输入密钥所属人', type: 'string', trigger: 'blur' }],
        secretKey: [{ required: true, message: '请输入密钥值', type: 'string', trigger: 'blur' }],
        secretExpirationTime: [{ required: true, message: '请输入秘钥过期时间', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 查询用户列表
      userSelectList: []
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.form = {};

        this.isUpdate = false;

        // 生成一个秘钥值
        this.createUserSecret();

        // 获取用户下拉列表
        this.findUserList();
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 保存和编辑职务
     *
     * @author fengshuonan
     * @date 2021/4/8 13:33
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 设置是否为一次性秘钥
      if (!this.form.secretOnceFlag) {
        this.form.secretOnceFlag = 'N';
      } else {
        this.form.secretOnceFlag = this.form.secretOnceFlag ? 'Y' : 'N';
      }

      // 执行编辑或修改
      if (this.isUpdate) {
        result = SecretKeyApi.edit(this.form);
      } else {
        result = SecretKeyApi.add(this.form);
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

          return '';
        })
        .catch(() => {
          this.loading = false;
          return '';
        });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 根据关键字获取用户列表
     *
     * @author fengshuonan
     * @date 2022/3/26 17:51
     */
    async findUserList(condition) {
      if (condition === undefined) {
        condition = '';
      }
      let users = await UserApi.selectUserList({ account: condition });
      this.userSelectList = [];
      users.forEach(item => {
        this.userSelectList.push({
          label: item.name,
          value: item.id
        });
      });
    },

    /**
     * 用户查询下拉搜索
     *
     * @author fengshuonan
     * @date 2022/3/26 17:54
     */
    handleSearch(value) {
      this.findUserList(value);
    },

    /**
     * 设置选中的数据
     *
     * @author fengshuonan
     * @date 2022/3/26 17:59
     */
    handleChange(value) {
      this.form.userId = value;
    },

    /**
     * 创建用户秘钥
     *
     * @author fengshuonan
     * @date 2022/4/14 21:19
     */
    createUserSecret() {
      this.form.secretKey = uuid();
    }
  }
};
</script>
