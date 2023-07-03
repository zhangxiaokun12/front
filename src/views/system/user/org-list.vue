<template>
  <div>
    <!-- 表格 -->
    <a-card :bordered="false" class="left-menu-height">
      <a-space size="middle">
        <a-tooltip placement="top">
          <template #title>
            <span>新建组织机构</span>
          </template>
          <a-button type="primary" @click="openAdd()">
            <template #icon>
              <plus-outlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span>修改组织机构</span>
          </template>
          <a-button type="primary" @click="openEdit()">
            <template #icon>
              <EditOutlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span>删除组织机构</span>
          </template>
          <a-button danger @click="deleteOrg()">
            <template #icon>
              <delete-outlined />
            </template>
          </a-button>
        </a-tooltip>
      </a-space>

      <a-tree
        v-model:selectedKeys="currentSelectKeys"
        @select="selectNode"
        v-if="orgList.length"
        :tree-data="orgList"
        :fieldNames="{ children: 'children', title: 'name', key: 'id' }"
        style="margin-top: 15px"
        :default-expand-all="true"
      />
    </a-card>

    <!-- 编辑弹窗 -->
    <org-edit v-model:visible="showEdit" :isUpdate="updateOrg" v-if="showEdit" :data="currentOrgInfo" @done="reload" :org-list="orgList" defaultKey="1"/>
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { UserApi } from '@/api/system/user/UserApi';
import OrgEdit from '../organization/org-edit.vue';
import { createVNode, nextTick } from 'vue';

export default {
  name: 'OrgList',
  components: {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    OrgEdit
  },
  props: {
    orgList: Array,
    currentSelectOrgId: String
  },
  emits: ['update:currentSelectOrgId', 'changeNodeSelect', 'updateOrgList', 'closeCompanyEdit'],
  data() {
    return {
      // 是否显示编辑弹窗
      showEdit: false,
      // 选中的节点
      currentSelectKeys: [],
      // 是否是更新组织机构
      updateOrg: false,
      // 组织机构信息详情
      currentOrgInfo: null
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.orgList.length > 0) {
        this.currentSelectKeys = [this.orgList[0].id];
        UserApi.getOrgDetail({ orgId: this.currentSelectKeys[0] }).then(res => {
          nextTick(() => {
            this.currentOrgInfo = res;
          });
        });
      }
    }, 200);
  },
  methods: {
    /**
     * 重新加载树形结构列表（用在新增和修改完组织机构）
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reload() {
      this.$emit('updateOrgList');
    },

    /**
     * 删除组织机构
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await UserApi.deleteUser({ userId: row.userId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增弹窗
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    openAdd() {
      this.currentOrgInfo = {};
      this.showEdit = true;
      this.updateOrg = false;
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonane
     * @date 2021/4/2 17:03
     */
    openEdit() {
      if (this.currentSelectKeys.length == 0) return message.error('请选择一个公司或部门');
      this.showEdit = true;
      this.updateOrg = true;
      this.$emit('closeCompanyEdit');
    },

    /**
     * 删除组织机构
     *
     * @author fengshuonan
     * @date 2021/4/12 14:22
     */
    async deleteOrg() {
      this.showEdit = false;
      this.$emit('closeCompanyEdit');
      if (this.currentSelectKeys.length <= 0) {
        message.warn('请选择一个公司');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要删除选中的组织机构吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          message.success('删除公司成功');
          await UserApi.deleteOrg({ orgId: this.currentSelectKeys[0] });
          this.reload();
        }
      });
    },

    /**
     * 选择节点时候触发的事件
     *
     * @author fengshuonan
     * @date 2021/4/11 19:43
     */
    selectNode(selectedKeys) {
      this.$emit('update:currentSelectOrgId', selectedKeys[0]);
      this.$emit('changeNodeSelect');
      if (this.currentSelectKeys && this.currentSelectKeys.length > 0) {
        UserApi.getOrgDetail({ orgId: this.currentSelectKeys[0] }).then(res => {
          nextTick(() => {
            this.currentOrgInfo = res;
          });
        });
      }
    }
  }
};
</script>

<style scoped></style>
