<template>
  <a-spin :spinning="loading">
    <a-row class="myTransfer">
      <a-col :span="20" :offset="4">
        <a-transfer
          :data-source="sourceField"
          :titles="['未选', '已选']"
          :target-keys="targetField"
          :render="item => item.title"
          @change="handleChange"
          @selectChange="handleSelectChange"
        />
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
import { ThemeTemplateFieldApi } from '@/api/system/theme/ThemeTemplateFieldApi';
import { ThemeTemplateRelApi } from '@/api/system/theme/ThemeTemplateRelApi';

export default {
  name: 'TemplateConfig',
  data() {
    return {
      // 页面标题
      title: '主题属性绑定',
      // 模板ID
      templateId: '',
      // 页面是否加载中，用在获取数据时
      loading: false,
      // 未选数据
      sourceField: [],
      // 已选数据
      targetField: [],
      // 弹窗显示
      visible: false
    };
  },
  methods: {
    /**
     * 打开配置
     *
     * @author fengshuonan
     * @date 2021/12/28 09:13:28
     */
    openConfig(templateId) {
      this.visible = true;
      this.templateId = templateId;

      // 获取属性数据
      this.loadFieldResource();
    },

    /**
     * 加载数据
     *
     * @author fengshuonan
     * @date 2021/12/28 09:19:59
     */
    async loadFieldResource() {
      // 开启加载
      this.loading = true;

      // 获取数据
      let sourceData = await ThemeTemplateFieldApi.findNotRelList({ templateId: this.templateId });
      let targetData = await ThemeTemplateFieldApi.findRelList({ templateId: this.templateId });

      this.sourceField = [];
      this.targetField = [];
      // 只获取属性编码
      if (sourceData != null) {
        for (const item of sourceData) {
          this.sourceField.push({
            key: item.fieldCode,
            title: item.fieldName
          });
        }
      }

      if (targetData != null) {
        for (const item of targetData) {
          this.sourceField.push({
            key: item.fieldCode,
            title: item.fieldName
          });
          this.targetField.push(item.fieldCode);
        }
      }

      // 关闭加载
      this.loading = false;
    },

    /**
     * 更新按钮管理界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/12/28 09:30:22
     */
    updateVisible(value) {
      this.visible = value;
    },

    /**
     * 处理两栏之间的移动
     *
     * @author fengshuonan
     * @date 2021/12/28 15:59:01
     */
    async handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetData = nextTargetKeys;
      if (direction === 'left') {
        await ThemeTemplateRelApi.del({ templateId: this.templateId, fieldCodes: moveKeys });
      } else {
        await ThemeTemplateRelApi.add({ templateId: this.templateId, fieldCodes: moveKeys });
      }

      this.loadFieldResource();
    },

    /**
     * 处理选中项发生改变时的回调函数
     *
     * @author fengshuonan
     * @date 2021/12/28 15:59:16
     */
    handleSelectChange(sourceField, targetField) {
      this.selectedKeys = [...sourceField, ...targetField];
    }
  }
};
</script>
<style lang="less" scoped>
::v-deep .myTransfer {
  .ant-transfer-list {
    width: 240px;
    height: 400px;
  }
}
</style>
