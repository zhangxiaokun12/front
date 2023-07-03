<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
    :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
  >
    <a-form-item label="角色名称:" name="roleName">
      <a-input v-model:value="form.roleName" placeholder="请输入角色名称" allow-clear />
    </a-form-item>
    <a-form-item label="角色编码:" name="roleCode">
      <a-input v-model:value="form.roleCode" placeholder="请输入角色编码" allow-clear />
    </a-form-item>
    <a-form-item label="排序号:" name="roleSort">
      <a-input-number v-model:value="form.roleSort" placeholder="请输入排序号" :min="0" class="ele-fluid" />
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent } from 'vue';
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
