<template>
  <a-form
    layout="horizontal"
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
    :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
  >
    <a-form-item label="职位名称:" name="positionName">
      <a-input v-model:value="form.positionName" placeholder="请输入职位名称" allow-clear autocomplete="off" />
    </a-form-item>

    <a-form-item label="职位编码:" name="positionCode">
      <a-input v-model:value="form.positionCode" placeholder="请输入职位编码" allow-clear autocomplete="off" />
    </a-form-item>

    <a-form-item label="职位排序:" name="positionSort">
      <a-input-number v-model:value="form.positionSort" placeholder="请输入职位排序" allow-clear autocomplete="off" style="width: 100%" />
    </a-form-item>

    <a-form-item label="备注信息:" name="positionRemark">
      <a-input v-model:value="form.positionRemark" placeholder="请输入备注信息" allow-clear autocomplete="off" />
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  props: {
    form: {
      type: Object,
      default: {}
    },
    rules: Object
  }
});
</script>

<style></style>
