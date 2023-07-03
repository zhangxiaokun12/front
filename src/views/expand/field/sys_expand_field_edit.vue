<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改' : '新建'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    :maskClosable="false"
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
      <a-form-item label="字段名称" name="fieldName">
        <a-input v-model:value="form.fieldName" placeholder="请输入字段中文名称，例如：身份证号" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="字段英文名" name="fieldCode">
        <a-input v-model:value="form.fieldCode" placeholder="请输入字段英文名称，例如：idCard" allow-clear autocomplete="off" />
      </a-form-item>
      <a-form-item label="字段类型" name="fieldType">
        <a-select v-model:value="form.fieldType" placeholder="请选择字段类型" style="width: 100%">
          <a-select-option :value="1">字符串类型</a-select-option>
          <a-select-option :value="2">数字类型</a-select-option>
          <a-select-option :value="3">字典类型</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="属性值长度" name="fieldLength" v-if="form.fieldType === 2">
        <a-input-number
          v-model:value="form.fieldLength"
          placeholder="请输入属性值长度，用于数字类型"
          allow-clear
          autocomplete="off"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item label="字典类型" name="fieldDictTypeCode" v-if="form.fieldType === 3">
        <dict-type-select value-type="dictTypeCode" v-model:value="form.fieldDictTypeCode" />
      </a-form-item>
      <a-form-item label="是否必填" name="fieldRequired">
        <a-radio-group name="fieldRequired" v-model:value="form.fieldRequired">
          <a-radio value="Y">必填</a-radio>
          <a-radio value="N">非必填</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="列表是否显示" name="listShowFlag">
        <a-radio-group name="listShowFlag" v-model:value="form.listShowFlag">
          <a-radio value="Y">显示</a-radio>
          <a-radio value="N">不显示</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { SysExpandFieldApi } from '@/api/expand/SysExpandFieldApi';
import DictTypeSelect from '@/components/DictSelect/DictTypeSelect.vue';

export default {
  name: 'SysExpandFieldEdit',
  components: { DictTypeSelect },
  emits: ['done'],
  data() {
    return {
      // 当前表单的数据
      form: {},
      // 表单验证规则
      rules: {
        fieldName: [{ required: true, message: '请输入字段中文名称', type: 'string', trigger: 'blur' }],
        fieldCode: [{ required: true, message: '请输入字段英文名称', type: 'string', trigger: 'blur' }],
        fieldType: [{ required: true, message: '请输入字段类型', type: 'number', trigger: 'blur' }],
        fieldLength: null,
        fieldDictTypeCode: null,
        fieldRequired: [{ required: true, message: '请输入是否必填', type: 'string', trigger: 'blur' }],
        listShowFlag: [{ required: true, message: '请输入列表是否显示', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 是否显示弹框
      visible: false,
      // 业务的id
      expandId: null
    };
  },
  watch: {
    'form.fieldType'(newVal) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
      if (newVal === 2) {
        this.rules.fieldLength = [{ required: true, message: '请输入字段长度', type: 'number', trigger: 'blur' }];
        this.rules.fieldDictTypeCode = null;
      } else if (newVal === 3) {
        this.rules.fieldLength = null;
        this.rules.fieldDictTypeCode = [{ required: true, message: '请选择字典类型', type: 'string', trigger: 'blur' }];
      } else if (newVal === 1) {
        this.rules.fieldLength = null;
        this.rules.fieldDictTypeCode = null;
      }
    }
  },
  methods: {
    /**
     * 打开新增或编辑窗口
     *
     * @author fengshuonan
     * @date 2022/3/30 21:17
     */
    openDialog(expandId, isUpdate, data) {
      this.expandId = expandId;
      this.visible = true;
      this.isUpdate = isUpdate;

      if (isUpdate && data) {
        this.form = data;
      } else {
        this.form = {};
      }

      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },

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

      // 设置业务id
      this.form.expandId = this.expandId;

      let result = null;

      // 执行编辑或修改
      if (this.isUpdate) {
        result = SysExpandFieldApi.edit(this.form);
      } else {
        result = SysExpandFieldApi.add(this.form);
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
      this.visible = value;
    }
  }
};
</script>
