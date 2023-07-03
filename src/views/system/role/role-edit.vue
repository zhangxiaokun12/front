<!-- 编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="800" :visible="visible" title="修改角色" @close="updateVisible(false)" v-if="isUpdate">
      <role-form v-model:form="form" :rules="rules" ref="form"></role-form>
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
      title="新建角色"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <role-form v-model:form="form" :rules="rules" ref="form"></role-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import RoleForm from './role-form.vue';
import { SysRoleApi } from '@/api/system/role/SysRoleApi';

export default {
  name: 'SysRoleEdit',
  components: { RoleForm },
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
        roleName: [{ required: true, message: '请输入角色名称', type: 'string', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色编码', type: 'string', trigger: 'blur' }],
        roleSort: [{ required: true, message: '请输入排序号', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    data() {
      this.init();
    }
  },
  methods: {
    // 初始化数据
    init() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form && this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    /**
     * 保存和编辑
     *
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(valid => {
        if (valid) {
          // 修改加载框为正在加载
          this.loading = true;

          let result = null;

          // 设置数据范围为空，不能在这里修改数据范围
          this.form.dataScopeType = null;

          // 执行编辑或修改方法
          if (this.isUpdate) {
            result = SysRoleApi.edit(this.form);
          } else {
            result = SysRoleApi.add(this.form);
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
        }
      });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author chenjinlong
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>
