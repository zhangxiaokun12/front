<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
    :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
  >
    <a-form-item label="名称:" name="dictName">
      <a-input v-model:value="form.dictName" placeholder="请输入字典名称" allow-clear />
    </a-form-item>
    <a-form-item label="编码:" name="dictCode">
      <a-input v-model:value="form.dictCode" placeholder="请输入字典编码" allow-clear :disabled="isUpdate" />
    </a-form-item>
    <a-form-item label="简称:" name="dictShortName">
      <a-input v-model:value="form.dictShortName" placeholder="请输入字典简称" allow-clear />
    </a-form-item>
    <a-form-item label="简码:" name="dictShortCode">
      <a-input v-model:value="form.dictShortCode" placeholder="请输入字典简码" allow-clear />
    </a-form-item>
    <a-form-item label="排序:" name="dictSort">
      <a-input-number style="width: 100%" v-model:value="form.dictSort" placeholder="请输入字典排序" allow-clear autocomplete="off" />
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    form: Object,
    rules: Object,
    isUpdate: Boolean
  }
});
</script>

<style></style>
