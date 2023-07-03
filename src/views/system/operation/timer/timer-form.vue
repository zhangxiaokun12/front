<template>
  <a-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
    :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
  >
    <a-form-item label="任务名称:" name="timerName">
      <a-input @keydown.enter="save" v-model:value="form.timerName" placeholder="请输入任务名称" allow-clear />
    </a-form-item>
    <a-form-item label="任务job:" name="actionClass">
      <a-select :loading="actionClassListLoading" showSearch placeholder="请选择任务job" v-model:value="form.actionClass" allow-clear>
        <a-select-option v-for="item in actionClassList" :key="item" :value="item">
          {{ item }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="cron:" name="cron">
      <a-input @keydown.enter="save" v-model:value="form.cron" placeholder="请输入任务cron表达式" allow-clear />
    </a-form-item>
    <a-form-item label="任务参数:" name="params">
      <a-input @keydown.enter="save" v-model:value="form.params" placeholder="请输入任务参数" allow-clear />
    </a-form-item>
    <a-form-item label="备注:" name="remark">
      <a-input @keydown.enter="save" v-model:value="form.remark" placeholder="请输入备注" allow-clear />
    </a-form-item>
  </a-form>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    form: Object,
    rules: Object,
    actionClassList: Array,
    actionClassListLoading: Boolean
  },
  setup(props, { emit }) {
    const formRef = ref(null);
    // 保存
    const save = () => {
      emit('save');
    };
    return {
      formRef,
      save
    };
  }
});
</script>

<style></style>
