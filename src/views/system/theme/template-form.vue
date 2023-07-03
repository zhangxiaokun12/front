<template>
  <a-form
    layout="horizontal"
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
    :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
  >
    <a-form-item label="模板名称:" name="templateName">
      <a-input v-model:value="form.templateName" placeholder="请输入模板名称" allow-clear autocomplete="off" />
    </a-form-item>

    <a-form-item label="模板编码:" name="templateCode">
      <a-input v-model:value="form.templateCode" placeholder="请输入模板编码" allow-clear autocomplete="off" />
    </a-form-item>

    <a-form-item label="模板类型:" name="templateType">
      <a-select v-model:value="form.templateType" placeholder="请选择模板类型" allow-clear autocomplete="off">
        <a-select-option :value="1">系统类型</a-select-option>
        <a-select-option :value="2">业务类型</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    form: Object,
    rules: Object
  }
});
</script>

<style></style>
