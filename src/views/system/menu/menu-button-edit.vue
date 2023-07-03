<!-- 菜单按钮编辑弹窗 -->
<template>
  <a-modal
    :width="500"
    :visible="visible"
    :confirm-loading="loading"
    :forceRender="true"
    :maskClosable="false"
    :title="isUpdate ? '修改菜单按钮' : '新建菜单按钮'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
    @close="updateVisible(false)"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 6 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 18 }, sm: { span: 24 } }"
    >
      <a-form-item label="菜单按钮名称:" name="buttonName">
        <a-input v-model:value="form.buttonName" placeholder="请输入菜单按钮名称" allow-clear />
      </a-form-item>
      <a-form-item label="菜单按钮编码:" name="buttonCode">
        <a-input v-model:value="form.buttonCode" placeholder="请输入菜单按钮编码" allow-clear :disabled="isUpdate" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { message } from 'ant-design-vue';
import { MenuButtonApi } from '@/api/system/menu/MenuButtonApi';

export default {
  name: 'SysMenuButtonEdit',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    //菜单Id
    menuId: String
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        buttonName: [{ required: true, message: '请输入菜单按钮名称', type: 'string', trigger: 'blur' }],
        buttonCode: [{ required: true, message: '请输入菜单按钮编码', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        // 加载数据
        if (this.data) {
          this.form = Object.assign({}, this.data);
          this.isUpdate = true;
        } else {
          this.form = { menuId: this.menuId };
          this.isUpdate = false;
        }
      }
    },
    data() {}
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author jiawei
     * @date ji2021/4/14 11:00
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改方法
      if (this.isUpdate) {
        result = MenuButtonApi.editMenuButton(this.form);
      } else {
        result = MenuButtonApi.addMenuButton(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          message.success(result.message);

          // 如果是新增，则form表单置空
          if (!this.isUpdate) {
            this.form = { menuId: this.menuId };
          }

          // 关闭弹框，通过控制visible的值，传递给父组件
          this.updateVisible(false);

          // 触发父组件done事件
          this.$emit('done');
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author jiawei
     * @date ji2021/4/14 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>
