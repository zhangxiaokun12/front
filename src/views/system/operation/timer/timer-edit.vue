<!-- 定时任务编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="800" :visible="visible" title="修改定时任务" @close="updateVisible(false)" v-if="isUpdate">
      <timer-form
        v-model:form="form"
        :rules="rules"
        ref="formData"
        @save="save"
        :actionClassList="actionClassList"
        :actionClassListLoading="actionClassListLoading"
      ></timer-form>
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
      title="新建定时任务"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <timer-form
        v-model:form="form"
        :rules="rules"
        ref="formData"
        @save="save"
        :actionClassList="actionClassList"
        :actionClassListLoading="actionClassListLoading"
      ></timer-form>
    </a-modal>
  </div>
</template>

<script>
import { ref, toRefs, reactive, watch, nextTick, onMounted } from 'vue';
import TimerForm from './timer-form.vue';
import { SysTimerApi } from '@/api/system/operation/SysTimerApi';
import { message } from 'ant-design-vue';

export default {
  name: 'SysTimerEdit',
  components: { TimerForm },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  setup(props, context) {
    let formData = ref(null);

    const data = reactive({
      // 表单数据
      form: Object.assign({}, props.data),
      // 表单验证规则
      rules: {
        timerName: [{ required: true, message: '请输入任务名称', type: 'string', trigger: 'blur' }],
        cron: [{ required: true, message: '请输入cron任务表达式', type: 'string', trigger: 'blur' }],
        actionClass: [{ required: true, message: '请选择任务job', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 任务job Class列表
      actionClassList: [],
      // 任务job 下拉加载状态
      actionClassListLoading: true
    });

    onMounted(() => {
      init();
      // 获取定时任务执行class
      SysTimerApi.getActionClasses().then(res => {
        data.actionClassList = res;
        data.actionClassListLoading = false;
      });
    });

    /**
     * 监听数据
     */
    watch(() => props.data, newProp => {
      init();
    });

    // 初始化数据
    const init = () => {
      if (props.data) {
        data.form = Object.assign({}, props.data);
        data.isUpdate = true;
      } else {
        data.form = {};
        data.isUpdate = false;
      }

      if (formData.value && formData.value.formRef) {
        formData.value.formRef.clearValidate();
      }
    };

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    const updateVisible = value => {
      context.emit('update:visible', value);
    };

    /**
     * 保存和编辑
     *
     * @author luojie
     * @date 2021/4/13 11:25
     */
    const save = () => {
      // 校验表单
      formData.value.formRef.validate().then(valid => {
        if (valid) {
          // 修改加载框为正在加载
          data.loading = true;

          let result = null;

          // 执行编辑或修改方法
          if (data.isUpdate) {
            result = SysTimerApi.edit(data.form);
          } else {
            result = SysTimerApi.add(data.form);
          }
          result
            .then(result => {
              // 移除加载框
              data.loading = false;

              // 提示添加成功
              message.success(result.message);

              // 如果是新增，则form表单置空
              if (!data.isUpdate) {
                data.form = {};
              }
              // 关闭弹框，通过控制visible的值，传递给父组件
              updateVisible(false);
              // 触发父组件done事件
              context.emit('done');
            })
            .catch(() => {
              data.loading = false;
            });
        }
      });
    };

    return {
      ...toRefs(data),
      formData,
      save,
      init,
      updateVisible
    };
  }
};
</script>

<style scoped></style>
