<!-- 通知新建/编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer :width="1000" :visible="visible" title="修改通知" @close="updateVisible(false)" v-if="isUpdate">
      <publish-form
        v-model:form="form"
        ref="formData"
        :isUpdate="isUpdate"
        v-model:targetKeys="targetKeys"
        :userList="userList"
        @handleChange="handleChange"
      ></publish-form>
      <template #extra>
        <a-button type="primary" @click="save" :loading="loading">确定</a-button>
      </template>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="1000"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建通知"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <publish-form
        v-model:form="form"
        ref="formData"
        :isUpdate="isUpdate"
        v-model:targetKeys="targetKeys"
        :userList="userList"
        @handleChange="handleChange"
      ></publish-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import PublishApi from '@/api/system/notice/PublishApi';
import { UserApi } from '@/api/system/user/UserApi';
import PublishForm from './publish-form.vue';

export default {
  name: 'PublishEdit',
  components: { PublishForm },
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
      form: Object.assign(
        {
          // all 或者是 用户id的集合逗号分割
          noticeScope: '',
          noticeTitle: '',
          noticeSummary: '',
          priorityLevel: '',
          noticeBeginTime: '',
          noticeEndTime: '',
          noticeContent: ''
        },
        this.data
      ),
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // // 通知人数的类型，全部还是部分
      // noticeScopeType: 'all',
      // 选中的人
      targetKeys: [],
      // 用户列表
      userList: []
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

      // 如果是新增，则置空输入项
      if (!this.isUpdate) {
        this.form.noticeContent = '';
        this.form.noticeScopeType = 'all';
        this.targetKeys = [];
      }

      // 初始化选项和通知的人范围
      if (this.isUpdate) {
        if (this.data.noticeScope === 'all') {
          this.form.noticeScopeType = 'all';
        } else if (!this.data.noticeScope.includes(',')) {
          this.form.noticeScopeType = 'part';
          this.targetKeys = [this.data.noticeScope];
        } else if (this.data.noticeScope.includes(',')) {
          this.form.noticeScopeType = 'part';
          this.targetKeys = this.data.noticeScope.split(',');
        }
      }
    }
  },
  mounted() {
    // 查询用户列表
    this.getUserList();
  },
  methods: {
    /**
     * 获取通知的用户列表
     *
     * @author fengshuonan
     * @date 2021/6/14 20:23
     */
    getUserList() {
      UserApi.getUserList({}).then(res => {
        this.userList = res.data.rows;
        this.userList = this.userList.map(item => ({
          key: item.userId,
          title: item.nickName,
          description: item.account,
          disabled: false
        }));
      });
    },

    /**
     * 选中人员时的监听
     *
     * @author fengshuonan
     * @date 2021/6/14 20:23
     */
    handleChange(targetKeys) {
      this.targetKeys = targetKeys;
    },

    /**
     * 发布通知
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    async save() {
      this.loading = true;

      // 如果noticeScopeType是all，则noticeScope参数填写all
      if (this.form.noticeScopeType === 'all') {
        this.form.noticeScope = 'all';
      } else {
        // 如果noticeScopeType是part，则用逗号分割每个人的id
        this.form.noticeScope = this.targetKeys.join(',');
      }

      try {
        let res;
        if (this.isUpdate) {
          res = await PublishApi.editPublish(this.form);
        } else {
          res = await PublishApi.addPublish(this.form);
        }

        this.loading = false;
        message.success(res.message);
        if (!this.isUpdate) {
          this.form = {};
        }
        this.updateVisible(false);
        this.$emit('done');
      } catch (error) {
        this.loading = false;
      }
    },

    /**
     * 更新编辑界面弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/6/14 20:24
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
