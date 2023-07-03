<!-- 组织机构编辑弹窗 -->
<template>
  <div>
    <!-- 编辑 -->
    <common-drawer
      :width="1100"
      :visible="visible"
      title="编辑机构"
      @close="updateVisible(false)"
      v-if="isUpdate"
      :isShowTab="true"
      :activeKey="activeKey"
      :tabList="tabList"
      @tabChange="tabChange"
    >
      <template #extra>
        <div style="height: 32px">
          <a-button type="primary" @click="save" :loading="loading" v-show="activeKey == '1'">确定</a-button>
        </div>
      </template>
      <!-- 基本信息 -->
      <org-form v-model:form="form" ref="form" :rules="rules" v-model:orgList="orgList" v-if="activeKey == '1'">
        <field-expand-form ref="fieldExpandForm" expand-code="org_expand" />
      </org-form>

      <!-- 设置审批人 -->
      <set-approver v-else ref="setApproverRef" :data="data"></set-approver>
    </common-drawer>

    <!-- 新增 -->
    <a-modal
      :width="1100"
      :visible="visible"
      :confirm-loading="loading"
      :forceRender="true"
      :maskClosable="false"
      title="新建机构"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
      @ok="save"
      v-else
      @close="updateVisible(false)"
    >
      <org-form v-model:form="form" ref="form" :rules="rules" v-model:orgList="orgList">
        <field-expand-form ref="fieldExpandForm" expand-code="org_expand" />
      </org-form>
    </a-modal>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { UserApi } from '@/api/system/user/UserApi';
import FieldExpandForm from '@/components/FieldExpand/FieldExpandForm.vue';
import SetApprover from './set-approver.vue';
import OrgForm from './org-form.vue';
import { nextTick } from 'vue';

export default {
  name: 'OrgEdit',
  components: { OrgForm, FieldExpandForm, SetApprover },
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 接收上级传过来的组织机构信息
    data: Object,
    // 组织机构列表
    orgList: Array,
    // 是否是编辑界面
    isUpdate: Boolean,
    // 默认选中
    defaultKey: String
  },
  emits: ['done', 'update:visible'],
  data() {
    return {
      // 表单数据
      form: Object.assign({}),
      // 表单验证规则
      rules: {
        orgName: [{ required: true, message: '请输入组织机构名称', type: 'string', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入组织机构编码', type: 'string', trigger: 'blur' }],
        orgType: [{ required: true, message: '请选择机构类型', type: 'number', trigger: 'blur' }],
        orgSort: [{ required: true, message: '请输入组织机构排序', type: 'number', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      activeKey: '1',
      tabList: [
        {
          key: '1',
          name: '基本信息'
        },
        {
          key: '2',
          name: '设置审批人'
        }
      ]
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    // 编辑时监听data是否变化
    data() {
      this.init();
    }
  },
  methods: {
    // tab切换
    tabChange(key) {
      this.activeKey = key;
      nextTick(() => {
        if (key == '1') {
          // 加载表单数据
          this.$refs.fieldExpandForm.loadForm(this.data.orgId);
          this.form = Object.assign({}, this.data);
        } else {
          this.$refs.setApproverRef.getListData();
        }
      });
    },
    // 初始化数据
    init() {
      if (this.data) {
        this.tabChange(this.defaultKey);
      } else {
        this.form = {};
        // 加载表单数据
        nextTick(() => {
          this.$refs.fieldExpandForm.loadForm();
        });
      }
      if (this.$refs.form && this.$refs.form.$refs.formRef) {
        this.$refs.form.$refs.formRef.clearValidate();
      }
    },
    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    save() {
      // 校验表单
      this.$refs.form.$refs.formRef.validate().then(async valid => {
        if (valid) {
          // 校验拓展表单并获取数据
          await this.$refs.fieldExpandForm.validate();

          // 采集动态表单数据
          this.form.expandDataInfo = this.$refs.fieldExpandForm.getData();

          // 修改加载框为正在加载
          this.loading = true;

          // 如果父级公司没有选，则就是顶级公司，设置位父级id为-1
          if (!this.form.orgParentId) {
            this.form.orgParentId = -1;
          }

          let result;

          // 执行编辑或修改用户方法
          if (this.isUpdate) {
            result = UserApi.editOrg(this.form);
          } else {
            result = UserApi.addOrg(this.form);
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
