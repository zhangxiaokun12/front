<!-- 我的消息详情 -->
<template>
  <common-drawer
    :width="800"
    :visible="visible"
    title="通知详情"
    @close="updateVisible(false)"
  >
    <a-form
      ref="form"
      :model="form"
      :label-col="{ md: { span: 4 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 20 }, sm: { span: 24 } }"
    >
      <a-form-item label="通知标题">
        <a-input placeholder="请输入通知标题" v-model:value="form.messageTitle" />
      </a-form-item>

      <a-form-item label="内容">
        <tinymce v-model:value="form.messageContent" :disabled="true" />
      </a-form-item>
    </a-form>
  </common-drawer>
</template>

<script>
import Tinymce from '@/components/TinymceEditor/index.vue';
import { NoticeApi } from '@/api/system/notice/NoticeApi';

export default {
  name: 'MyNoticeDetail',
  components: { Tinymce },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 上级组件传来的数据
    data: Object
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign(
        {
          noticeTitle: '',
          noticeContent: ''
        },
        this.data
      )
    };
  },
  watch: {
    async data() {
      if (this.data) {
        let messageId = this.data.messageId;
        let result = await NoticeApi.messageDetail({ messageId });
        this.form = Object.assign({}, result);
      } else {
        this.form = {};
        this.isUpdate = false;
      }
    }
  },
  methods: {
    /**
     * 点击确定
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    async save() {
      this.updateVisible(false);
    },

    /**
     * 更新编辑界面弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
      this.$emit('done');
    }
  }
};
</script>

<style scoped></style>
