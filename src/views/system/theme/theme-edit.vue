<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="900" :visible="visible" title="修改主题" @close="updateVisible(false)" v-if="isUpdate">
      <theme-form
        v-model:form="form"
        :rules="rules"
        ref="form"
        :disabledChangeTemplate="disabledChangeTemplate"
        v-model:tempFileList="tempFileList"
        @getThemeAttributes="getThemeAttributes"
        :templateFields="templateFields"
      ></theme-form>
      <template #extra>
        <a-button type="primary" @click="save" :loading="loading">确定</a-button>
      </template>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="900"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建主题"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <theme-form
        v-model:form="form"
        :rules="rules"
        ref="form"
        :disabledChangeTemplate="disabledChangeTemplate"
        v-model:tempFileList="tempFileList"
        @getThemeAttributes="getThemeAttributes"
        :templateFields="templateFields"
      ></theme-form>
    </a-modal>
  </div>
</template>

<script>
import { ThemeApi } from '@/api/system/theme/ThemeApi';
import { message } from 'ant-design-vue';
import { ThemeTemplateApi } from '@/api/system/theme/ThemeTemplateApi';
import ThemeForm from './theme-form.vue';

export default {
  mame: 'ThemeEdit',
  components: { ThemeForm },
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
      form: {},
      // 表单验证规则
      rules: {
        templateId: [{ required: true, message: '请输入用户账号', type: 'string', trigger: 'blur' }],
        themeName: [{ required: true, message: '请输入主题名称', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改页面
      isUpdate: false,
      // 模板属性
      templateFields: [],

      disabledChangeTemplate: false,
      // 临时存放文件列表（用来限制上传数量）
      tempFileList: {}
    };
  },
  watch: {
    data() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      // 有数据，则是编辑界面
      if (this.data) {
        this.isUpdate = true;
        this.disabledChangeTemplate = true;
        // 获取动态表单所有属性，组装元数据
        this.getThemeAttributes(this.data.templateId).then(() => {
          // 加载动态表单的具体值
          this.loadFormValues(this.data);
        });
      } else {
        // 无数据，则是新增界面
        this.form = {};
        this.isUpdate = false;
        this.disabledChangeTemplate = false;
        this.templateFields = [];
      }
      if (this.$refs.form && this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    /**
     * 保存和修改主题
     *
     * @author fengshuonan
     * @date 2021/12/23 14:10:13
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(async valid => {
        if (valid) {
          // 修改加载框为正在加载
          this.loading = true;

          let result = null;

          // 执行编辑或修改
          if (this.isUpdate) {
            this.formPreProcess();
            result = await ThemeApi.edit(this.form);
          } else {
            this.formPreProcess();
            result = await ThemeApi.add(this.form);
          }

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
        }
      });
    },

    /**
     * 更新修改界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/12/23 14:10:54
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },

    /**
     * 点击选择模板时，查询系统模板详情
     *
     * @param value 模板id
     * @author fengshuonan
     * @date 2021/12/29 10:33:06
     */
    async getThemeAttributes(value) {
      this.templateFields = await ThemeTemplateApi.detail({ templateId: value });
      this.calcRules();
      this.calcTemplateAttr();
    },

    /**
     * 处理编辑表单数据
     *
     * @author fengshuonan
     * @date 2021/12/31 16:31:22
     */
    formPreProcess() {
      // 获取被删除的字段
      let themeName = this.form.themeName;
      let templateId = this.form.templateId;
      let themeId = this.form.themeId;

      // 剩余内容转为JSON串
      let jsonStr = JSON.stringify(this.form);

      // 将form置空
      this.form = {};

      if (themeId) {
        this.form['themeId'] = themeId;
      }
      this.form['themeName'] = themeName;
      this.form['templateId'] = templateId;
      this.form['themeValue'] = jsonStr;
    },

    /**
     * 计算必填校验规则
     *
     * @author fengshuonan
     * @date 2022/1/1 19:53
     */
    calcRules() {
      // 默认的规则
      let defaultRules = {
        templateId: [{ required: true, message: '请输入用户账号', type: 'string', trigger: 'blur' }],
        themeName: [{ required: true, message: '请输入主题名称', type: 'string', trigger: 'blur' }]
      };
      // 动态表单的规则
      for (let number in this.templateFields) {
        const thisObj = this.templateFields[number];
        if (thisObj.fieldRequired === 'Y') {
          defaultRules[thisObj.fieldCode] = [
            { required: true, message: `请输入${thisObj.fieldDescription}`, type: 'string', trigger: 'blur' }
          ];
        }
      }
      this.rules = defaultRules;
    },

    /**
     * 设置临时文件数组赋空
     *
     * @author fengshuonan
     * @date 2022/1/1 21:28
     */
    calcTemplateAttr() {
      // 动态表单的规则
      for (let number in this.templateFields) {
        const thisObj = this.templateFields[number];
        if (thisObj.fieldType === 'file') {
          this.tempFileList[thisObj.fieldCode] = [];
        }
      }
    },

    /**
     * 加载动态表单的值
     *
     * @param data 当前主题的详情记录
     * @author fengshuonan
     * @date 2022/1/1 21:28
     */
    async loadFormValues(data) {
      // 从新组装form表单的值
      this.form.themeId = data.themeId;
      this.form.themeName = data.themeName;
      this.form.templateId = data.templateId;

      // 获取表单的动态表单信息
      let themeDetail = await ThemeApi.detail({ themeId: this.form.themeId });

      // 组装动态表单的值
      this.form = Object.assign(this.form, themeDetail.dynamicForm);

      // 加载图片预览
      this.tempFileList = themeDetail.tempFileList;
    }
  }
};
</script>

<style scoped></style>
