<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width="1200"
    :visible="visible"
    :confirm-loading="loading"
    title="查看详情"
    :maskClosable="false"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    :footer="null"
    @ok="save"
  >
    <div>
      <div class="card-title card-title-background">基础信息</div>
      <a-form
        layout="horizontal"
        ref="form"
        :model="form"
        :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
        :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
      >
        <a-form-item label="业务表:" name="primaryTableName">
          <a-input v-model:value="form.expandInfo.primaryTableName" allow-clear autocomplete="off" />
        </a-form-item>
        <a-form-item label="主键字段：" name="primaryFieldName">
          <a-input v-model:value="form.expandInfo.primaryFieldName" allow-clear autocomplete="off" />
        </a-form-item>
        <a-form-item label="主键ID值:" name="primaryFieldValue">
          <a-input v-model:value="form.primaryFieldValue" allow-clear autocomplete="off" />
        </a-form-item>
      </a-form>
      <div class="card-title card-title-background">拓展信息</div>
      <a-form
        layout="horizontal"
        ref="form"
        :model="form"
        :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
        :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
      >
        <a-form-item :label="item.fieldName" :name="item.fieldCode" v-for="item in form.fieldInfoList" :key="item.fieldId">
          <!--如果是字符串类型的字段-->
          <a-input v-model:value="dynamicFormData[item.fieldCode]" allow-clear autocomplete="off" v-if="item.fieldType === 1" />

          <!--如果是数字类型的字段-->
          <a-input-number
            v-model:value="dynamicFormData[item.fieldCode]"
            allow-clear
            autocomplete="off"
            v-if="item.fieldType === 2"
            style="width: 100%"
          />

          <!--如果是字符串类型的字段-->
          <dict-select
            v-model:value="dynamicFormData[item.fieldCode]"
            v-if="item.fieldType === 3"
            value-type="dictCode"
            :dict-type-code="item.fieldDictTypeCode"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { SysExpandDataApi } from '@/api/expand/SysExpandDataApi';
import DictSelect from '@/components/DictSelect/DictSelect.vue';

export default {
  name: 'SysExpandDataDetail',
  components: { DictSelect },
  emits: ['done'],
  data() {
    return {
      // 表单数据
      form: {
        expandInfo: {},
        fieldInfoList: []
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 是否显示弹框
      visible: false,
      // 数据主键id
      expandDataId: null,
      // 动态表单数据
      dynamicFormData: {}
    };
  },
  methods: {
    /**
     * 显示弹框
     *
     * @author fengshuonan
     * @date 2022/3/31 10:51
     */
    showDialog(expandDataId) {
      this.visible = true;
      this.expandDataId = expandDataId;
      // 加载数据详情
      this.loadDetail(expandDataId);
    },

    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    async save() {
      this.visible = false;
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
    },

    /**
     * 加载详情
     *
     * @author fengshuonan
     * @date 2022/3/31 11:52
     */
    async loadDetail(expandDataId) {
      let result = await SysExpandDataApi.detail({ expandDataId });
      this.form = Object.assign(this.form, result);
      this.dynamicFormData = JSON.parse(this.form.expandData);
    }
  }
};
</script>
<style lang="less" scoped>
.card-title {
  border-left: 5px solid;
  border-color: var(--primary-color);
  padding-left: 10px;
}
.card-title-background {
  background-color: #f5f5f5;
  height: 2em;
  line-height: 2em;
  margin-bottom: 2em;
}
</style>
