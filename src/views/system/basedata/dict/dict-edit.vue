<!-- 编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="800" :visible="visible" title="修改字典类型" @close="updateVisible(false)" v-if="isUpdate">
      <dict-form v-model:form="form" :rules="rules" ref="form" :isUpdate="isUpdate"></dict-form>
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
      title="新建字典类型"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <dict-form v-model:form="form" :rules="rules" ref="form" :isUpdate="isUpdate"></dict-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import DictForm from './dict-form.vue';
import { SysDictTypeApi } from '@/api/system/basedata/SysDictTypeApi';

export default {
  name: 'SysDictEdit',
  components: { DictForm },
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
        dictTypeName: [{ required: true, message: '请输入字典名称', type: 'string', trigger: 'blur' }],
        dictTypeCode: [{ required: true, message: '请输入字典编码', type: 'string', trigger: 'blur' }],
        dictTypeClass: [{ required: true, message: '请选择业务类型', type: 'number', trigger: 'blur' }],
        dictTypeSort: [{ required: true, message: '请输入字典顺序', type: 'number', trigger: 'blur' }]
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
     * 保存和编辑
     *
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.$refs.formRef.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = SysDictTypeApi.edit(this.form);
      } else {
        result = SysDictTypeApi.add(this.form);
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
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
