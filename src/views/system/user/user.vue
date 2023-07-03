<template>
  <div class="ele-body">
    <a-row :gutter="16">
      <!-- 左侧组织机构列表 -->
      <a-col :lg="5" :md="10" :sm="24" :xs="24" class="left-menu-height">
        <org-list
          :orgList="orgList"
          v-model:currentSelectOrgId="where.orgId"
          @changeNodeSelect="reload"
          @updateOrgList="updateOrgList"
          ref="orgList"
          @closeCompanyEdit="closeCompanyEdit"
        />
      </a-col>

      <!-- 右侧用户管理表格 -->
      <a-col :lg="19" :md="14" :sm="24" :xs="24">
        <!-- 搜索表单 -->
        <div class="block-interval">
          <a-card :bordered="false">
            <a-form layout="inline" :model="where">
              <a-row>
                <a-form-item label="账号:">
                  <a-input v-model:value.trim="where.account" placeholder="请输入账号" allow-clear />
                </a-form-item>
                <a-form-item label="姓名">
                  <a-input v-model:value.trim="where.realName" placeholder="请输入姓名" allow-clear />
                </a-form-item>
                <a-form-item class="ele-text-center">
                  <a-space>
                    <a-button type="primary" @click="reload">查询</a-button>
                    <a-button @click="reset">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-row>
            </a-form>
          </a-card>
        </div>

        <!-- 表格 -->
        <div>
          <a-card :bordered="false" class="table-height">
            <ele-pro-table
              ref="table"
              row-key="userId"
              :datasource="datasource"
              :columns="columns"
              :where="where"
              v-model:selection="selection"
              :scroll="{ x: 'max-content' }"
            >
              <!-- table上边工具栏 -->
              <template #toolbar>
                <a-space>
                  <a-button type="primary" @click="openEdit()">
                    <template #icon>
                      <plus-outlined />
                    </template>
                    <span>新建</span>
                  </a-button>
                  <a-button danger @click="removeBatch">
                    <template #icon>
                      <delete-outlined />
                    </template>
                    <span>删除</span>
                  </a-button>
                </a-space>
              </template>

              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex == 'realName'">
                  <a @click="openEdit(record)">{{ record.realName }}</a>
                </template>

                <!-- table列表状态栏 -->
                <!-- 1是激活，2是禁用 -->
                <template v-if="column.key === 'status'">
                  <a-switch :checked="record.statusFlag === 1" @change="checked => editState(checked, record)" />
                </template>

                <!-- 是否冻结，冻结的用户是因为登录重试次数过多 -->
                <template v-else-if="column.key === 'loginErrorCountFlag'">
                  <a-popconfirm
                    title="该用户密码重试次数过多，已被冻结，是否解除冻结该用户？"
                    @confirm="unFreezeUser(record)"
                    v-if="record.loginErrorCountFlag == true"
                  >
                    <a class="ele-text-danger">解除冻结</a>
                  </a-popconfirm>
                  <a-tag color="green" v-else>正常</a-tag>
                </template>

                <!-- table操作栏按钮 -->
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a @click="openEdit(record)">修改</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定要删除此用户吗？" @confirm="remove(record)">
                      <a class="ele-text-danger">删除</a>
                    </a-popconfirm>
                    <a-divider type="vertical" />
                    <a @click="openRoleDialog(record)">分配角色</a>
                    <a-divider type="vertical" />
                    <a @click="resetPsw(record)">重置密码</a>
                  </a-space>
                </template>
              </template>
            </ele-pro-table>
          </a-card>
        </div>
      </a-col>
    </a-row>

    <!-- 编辑弹窗 -->
    <user-edit
      v-model:visible="showEdit"
      :data="current"
      @done="reload"
      :org-list="orgList"
      :defaultKey="defaultKey"
      v-if="showEdit"
      ref="userEdit"
    />

    <!-- 导入弹窗 -->
    <user-import v-model:visible="showImport" @done="reload" />
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { createVNode, nextTick } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import UserEdit from './user-edit.vue';
import UserImport from './user-import.vue';
import { UserApi } from '@/api/system/user/UserApi';
import OrgList from '@/views/system/user/org-list.vue';
import { SysExpandApi } from '@/api/expand/SysExpandApi';

export default {
  name: 'SystemUser',
  components: {
    OrgList,
    PlusOutlined,
    DeleteOutlined,
    UserImport,
    UserEdit
    // UserRole
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          align: 'center',
          fixed: 'left',
          hideInSetting: true,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '账号',
          dataIndex: 'account'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '职务',
          dataIndex: 'positionName'
        },
        {
          title: '电话',
          dataIndex: 'phone'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          customRender: function ({ text }) {
            if ('F' === text) {
              return '女';
            } else {
              return '男';
            }
          }
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          align: 'center'
        },
        {
          title: '冻结状态',
          key: 'loginErrorCountFlag',
          dataIndex: 'loginErrorCountFlag',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 300,
          hideInSetting: true
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示用户导入弹窗
      showImport: false,
      // 左侧组织机构列表的数据
      orgList: [],
      // 判断是基本信息还是角色分配
      defaultKey: '1'
    };
  },
  async created() {
    this.orgList = await UserApi.getOrgTeeList();

    // 获取拓展字段
    let listFields = await SysExpandApi.getListFields({ expandCode: 'user_expand' });
    if (listFields && listFields.length > 0) {
      for (const listField of listFields) {
        let length = this.columns.length - 1;
        let obj = { title: listField.fieldName, dataIndex: listField.fieldCode };
        this.columns.splice(length, 0, obj);
      }
    }

    // 加载数据
    this.reload();
  },
  methods: {
    // 打开公司部门抽屉时，关闭表格的抽屉
    closeCompanyEdit() {
      this.showEdit = false;
    },
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 更新组织机构列表数据
     *
     * @author fengshuonan
     * @date 2021/4/12 14:18
     */
    async updateOrgList() {
      this.orgList = await UserApi.getOrgTeeList();
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where.account = '';
      this.where.realName = '';
      this.reload();
    },

    /**
     * 删除单个
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
     * 批量删除
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    removeBatch() {
      this.$refs.orgList.showEdit = false;
      this.showEdit = false;
      if (!this.selection.length) {
        message.error('请至少选择一条数据');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要删除选中的用户吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let params = this.selection.map(d => d.userId);
          const result = await UserApi.batchDeleteUser({ userIds: params });
          message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    openEdit(row) {
      this.$refs.orgList.showEdit = false;
      this.defaultKey = '1';
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 打开角色分配的对话框
     *
     * @author fengshuonan
     * @date 2021/4/7 16:45
     */
    openRoleDialog(row) {
      this.$refs.orgList.showEdit = false;
      this.defaultKey = '2';
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 重置用户密码
     *
     * @author fengshuonan
     * @date 2021/4/2 17:04
     */
    resetPsw(row) {
      Modal.confirm({
        title: '提示',
        content: '确定要重置此用户的密码为"123456"吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let result = await UserApi.resetPwd({ userId: row.userId });
          message.success(result.message);
        }
      });
    },

    /**
     * 修改用户状态
     *
     * @author fengshuonan
     * @date 2021/4/2 17:04
     */
    async editState(checked, row) {
      const userId = row.userId;
      // 用户状态：1-启用，2-禁用
      const statusFlag = checked ? 1 : 2;
      const result = await UserApi.changeStatus({ userId, statusFlag });
      message.success(result.message);
      row.statusFlag = statusFlag;
    },

    /**
     * 解除冻结用户
     *
     * @author fengshuonan
     * @date 2022/5/31 14:17
     */
    async unFreezeUser(record) {
      const result = await UserApi.unFreezeUser({ account: record.account });
      message.success(result.message);
      this.reload();
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return UserApi.getUserPages({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
