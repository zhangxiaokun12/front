<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirm-loading="loading"
    :title="isUpdate ? '修改' : '新建'"
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
      <a-form-item label="业务名称:" name="expandName">
        <a-input v-model:value="form.expandName" placeholder="请输入拓展业务名称，例如：用户信息拓展" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="业务编码:" name="expandCode">
        <a-input v-model:value="form.expandCode" placeholder="请输入拓展业务唯一编码，例如：user_expand" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="主业务表名" name="primaryTableName">
        <a-input v-model:value="form.primaryTableName" placeholder="主业务表，例如：sys_user" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="主键字段名" name="primaryFieldName">
        <a-input v-model:value="form.primaryFieldName" placeholder="请输入业务主键id字段名，例如：user_id" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="主键驼峰命名" name="primaryFieldCamel">
        <a-input v-model:value="form.primaryFieldCamel" placeholder="业务主键id字段名驼峰法，例如：userId" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { SysExpandApi } from '@/api/expand/SysExpandApi';

export default {
  name: 'SysExpandEdit',
  components: {},
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        expandName: [{ required: true, message: '请输入拓展业务名称', type: 'string', trigger: 'blur' }],
        expandCode: [{ required: true, message: '请输入拓展业务唯一编码', type: 'string', trigger: 'blur' }],
        primaryTableName: [{ required: true, message: '表名不能为空', type: 'string', trigger: 'blur' }],
        primaryFieldName: [{ required: true, message: '主键字段名称不能为空', type: 'string', trigger: 'blur' }],
        primaryFieldCamel: [{ required: true, message: '主键字段驼峰命名不能为空', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    'form.primaryFieldName'() {
      this.form.primaryFieldCamel = this.toCamel(this.form.primaryFieldName);
    },
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改
      if (this.isUpdate) {
        result = SysExpandApi.edit(this.form);
      } else {
        result = SysExpandApi.add(this.form);
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
     * @param value true-显示，false-隐藏
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 下划线转换驼峰
     *
     * @author fengshuonan
     * @date 2022/3/30 11:15
     */
    toCamel(name) {
      if (name) {
        return name.replace(/_(\w)/g, function(all, letter) {
          return letter.toUpperCase();
        });
      } else {
        return name;
      }
    }
  }
};
</script>
