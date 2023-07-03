<!-- 系统配置编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="800" :visible="visible" title="修改系统配置" @close="updateVisible(false)" v-if="isUpdate">
      <sysconfig-form v-model:form="form" :rules="rules" ref="form"></sysconfig-form>
      <template #extra>
        <a-button type="primary" @click="save" :loading="loading">确定</a-button>
      </template>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="800"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="添加系统配置"
      v-else
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      @close="updateVisible(false)"
    >
      <sysconfig-form v-model:form="form" :rules="rules" ref="form"></sysconfig-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import SysconfigForm from './sysconfig-form.vue';
import { SysConfigApi } from '@/api/system/basedata/SysConfigApi';

export default {
  name: 'SysConfigEdit',
  components: { SysconfigForm },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 字典id
    dictId: Number,
    // 配置分类编码
    groupCode: String
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        configName: [{ required: true, message: '请输入配置名称', type: 'string', trigger: 'blur' }],
        configCode: [{ required: true, message: '请输入配置编码', type: 'string', trigger: 'blur' }],
        configValue: [{ required: true, message: '请输入配置值', type: 'string', trigger: 'blur' }]
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
     * 保存编辑
     *
     * @author fengshuonan
     * @date 2021/4/9 16:08
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(valid => {
        if (valid) {
          if (this.form.sysFlagChecked === true) {
            this.form.sysFlag = 'Y';
          } else {
            this.form.sysFlag = 'N';
          }
          this.form.groupCode = this.groupCode;

          // 修改加载框为正在加载
          this.loading = true;

          let result;

          // 执行编辑或修改方法
          if (this.isUpdate) {
            result = SysConfigApi.editSysConfig(this.form);
          } else {
            result = SysConfigApi.addSysConfig(this.form);
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
     * 更新弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/4/9 16:03
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
