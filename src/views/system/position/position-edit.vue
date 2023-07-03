<!-- 新增和编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="800" :visible="visible" title="修改职位" @close="updateVisible(false)" v-if="isUpdate">
      <position-form v-model:form="form" ref="form" :rules="rules"></position-form>
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
      title="新建职位"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <position-form v-model:form="form" ref="form" :rules="rules"></position-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import PositionForm from './position-form.vue';
import { PositionApi } from '@/api/system/position/PositionApi';

export default {
  name: 'PositionEdit',
  components: { PositionForm },
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
        positionName: [{ required: true, message: '请输入职位名称', type: 'string', trigger: 'blur' }],
        positionCode: [{ required: true, message: '请输入职位编码', type: 'string', trigger: 'blur' }],
        positionSort: [{ required: true, message: '请输入数字顺序', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
      // 组织机构树列表
      orgList: [],
      // 职位列表
      positionList: []
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    visible() {
      if (!this.visible) {
        this.form = {};
        if (this.$refs.form.$refs.formRef) {
          this.$refs.form.$refs.formRef.clearValidate();
        }
      }
    }
  },
  methods: {
    /**
     * 保存和编辑职务
     *
     * @author fengshuonan
     * @date 2021/4/8 13:33
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(valid => {
        if (valid) {
          // 修改加载框为正在加载
          this.loading = true;

          let result = null;

          // 执行编辑或修改
          if (this.isUpdate) {
            result = PositionApi.edit(this.form);
          } else {
            result = PositionApi.add(this.form);
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
              this.$emit('done');
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
