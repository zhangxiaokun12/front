<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="1000" :visible="visible" title="修改属性" @close="updateVisible(false)" v-if="isUpdate">
      <field-form v-model:form="form" :rules="rules" ref="form" :isUpdate="isUpdate"></field-form>
      <template #extra>
        <a-button type="primary" @click="save" :loading="loading">确定</a-button>
      </template>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="1000"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建属性"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <field-form v-model:form="form" :rules="rules" ref="form" :isUpdate="isUpdate"></field-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import FieldForm from './field-form.vue';
import { ThemeTemplateFieldApi } from '@/api/system/theme/ThemeTemplateFieldApi';

export default {
  name: 'ThemeTemplateFieldEdit',
  components: { FieldForm },
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
        fieldName: [{ required: true, message: '请输入属性名称', type: 'string', trigger: 'blur' }],
        fieldCode: [{ required: true, message: '请输入属性编码', type: 'string', trigger: 'blur' }],
        fieldType: [{ required: true, message: '请输入属性类型', type: 'string', trigger: 'blur' }],
        fieldRequired: [{ required: true, message: '请选择是否必填', type: 'string', trigger: 'blur' }],
        fieldLength: [{ message: '请输入属性长度', type: 'number', trigger: 'blur' }],
        fieldDescription: [{ message: '请输入属性描述', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form && this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    /**
     * 保存和修改属性
     *
     * @author fengshuonan
     * @date 2021/12/27 11:43:02
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(valid => {
        if (valid) {
          // 修改加载框为正在加载
          this.loading = true;

          let result = null;

          // 执行编辑或修改
          if (this.isUpdate) {
            result = ThemeTemplateFieldApi.edit(this.form);
          } else {
            result = ThemeTemplateFieldApi.add(this.form);
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
        }
      });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/12/27 11:43:44
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
