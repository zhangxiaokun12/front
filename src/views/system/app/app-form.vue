<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
    :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
  >
    <a-form-item label="应用名称:" name="appName">
      <a-input v-model:value="form.appName" placeholder="请输入应用名称" allow-clear />
    </a-form-item>
    <a-form-item label="应用编码:" name="appCode">
      <a-input v-model:value="form.appCode" placeholder="请输入应用编码" allow-clear :disabled="isUpdate" />
    </a-form-item>
    <a-form-item label="应用图标:">
      <ele-icon-picker :data="myIcons" v-model:value="form.appIcon" placeholder="请选择应用图标">
        <template #icon="{ icon }">
          <component :is="icon" />
        </template>
      </ele-icon-picker>
    </a-form-item>
    <a-form-item label="应用排序:" name="appSort">
      <a-input-number v-model:value="form.appSort" placeholder="请填写应用排序" style="width: 100%" />
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import iconData from 'ele-admin-pro/es/ele-icon-picker/icons';
export default defineComponent({
  props: {
    form: {
      type: Object,
      default: {}
    },
    rules: Object,
    isUpdate: Boolean,
  },
  setup() {
    const state = reactive({
      // 自定义图标
      myIcons: iconData
    });

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style></style>
