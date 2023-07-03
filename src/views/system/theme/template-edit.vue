<template>
  <div>
    <!-- 编辑 -->
    <common-drawer
      :width="900"
      :visible="visible"
      title="修改模板"
      @close="updateVisible(false)"
      v-if="isUpdate"
      :isShowTab="true"
      :activeKey="activeKey"
      :tabList="tabList"
      @tabChange="tabChange"
    >
      <!-- 基本信息 -->
      <template-form v-model:form="form" ref="form" :rules="rules" v-if="activeKey == '1'"></template-form>
      <!-- 配置弹窗 -->
      <template-config ref="TemplateConfig" v-else />

      <template #extra>
        <div style="height: 32px">
          <a-button type="primary" @click="save" :loading="loading" v-show="activeKey == '1'">确定</a-button>
        </div>
      </template>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="900"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建模板"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <template-form v-model:form="form" ref="form" :rules="rules"></template-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import TemplateForm from './template-form.vue';
import { ThemeTemplateApi } from '@/api/system/theme/ThemeTemplateApi';
import TemplateConfig from './template-config.vue';
import { nextTick } from 'vue-demi';

export default {
  name: 'TemplateEdit',
  components: { TemplateForm, TemplateConfig },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 默认选中
    defaultKey: String
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      rules: {
        templateName: [{ required: true, message: '请输入模板名称', type: 'string', trigger: 'blur' }],
        templateCode: [{ required: true, message: '请输入模板编码', type: 'string', trigger: 'blur ' }],
        templateType: [{ required: true, message: '请输入模板类型', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // tab默认选中
      activeKey: '1',
      // tab栏列表
      tabList: [
        {
          key: '1',
          name: '基本信息'
        },
        {
          key: '2',
          name: '属性配置'
        }
      ]
    };
  },
  mounted() {
    this.setData();
  },
  watch: {
    data() {
      this.setData();
    }
  },
  methods: {
    // 设置初始化数据
    setData() {
      if (this.data) {
        this.isUpdate = true;
        this.tabChange(this.defaultKey);
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.activeKey == '1' && this.$refs.form && this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    // tab栏切换
    tabChange(key) {
      this.activeKey = key;
      if (key == '1') {
        this.form = Object.assign({}, this.data);
      } else {
        nextTick(() => {
          this.$refs.TemplateConfig.openConfig(this.data.templateId);
        });
      }
    },
    /**
     * 保存和修改模板
     *
     * @author fengshuonan
     * @date 2021/12/21 14:07:08
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
            result = ThemeTemplateApi.edit(this.form);
          } else {
            result = ThemeTemplateApi.add(this.form);
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
     * 更新修改界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/12/21 14:07:33
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
