<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="机构名称:">
              <a-input v-model:value.trim="where.orgName" placeholder="请输入机构名称" allow-clear />
            </a-form-item>
            <a-form-item label="机构编码">
              <a-input v-model:value.trim="where.orgCode" placeholder="请输入机构编码" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center" :wrapper-col="{ span: 24 }">
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
          row-key="id"
          :datasource="datasource"
          :response="menuResponse"
          :columns="columns"
          :where="where"
          :need-page="false"
          :parse-data="parseOrgList"
          :expand-icon-column-index="2"
          :expanded-row-keys="expandedRowKeys"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
          @expandedRowsChange="onExpandedRowsChange"
        >
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-button type="primary" @click="openAdd">
                <template #icon>
                  <plus-outlined />
                </template>
                <span>新建</span>
              </a-button>
              <a-button @click="expandAll">展开全部</a-button>
              <a-button @click="foldAll">折叠全部</a-button>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'orgName'">
              <a @click="openEdit(record, '1')">{{ record.orgName }}</a>
            </template>
            <!-- 1-启用，2-禁用 -->
            <template v-if="column.key === 'statusFlag'">
              <a-tag color="green" v-if="record.statusFlag === 1">启用</a-tag>
              <a-tag color="red" v-else> 禁用</a-tag>
            </template>

            <!-- 组织机构类型 -->
            <template v-else-if="column.key === 'orgType'">
              <a-tag color="orange" v-if="record.orgType === 1">公司</a-tag>
              <a-tag color="blue" v-else-if="record.orgType === 2">部门</a-tag>
              <a-tag v-else> 其他</a-tag>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record, '2')">设置审批人</a>
                <a-divider type="vertical" />
                <a @click="openEdit(record, '1')">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此机构吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <org-edit
      v-model:visible="showEdit"
      :isUpdate="updateOrg"
      :data="currentOrgInfo"
      @done="reload"
      :org-list="orgList"
      :defaultKey="defaultKey"
    />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { eachTreeData } from 'ele-admin-pro';
import { OrganizationApi } from '@/api/system/organization/OrganizationApi';
import { UserApi } from '@/api/system/user/UserApi';
import OrgEdit from '@/views/system/organization/org-edit.vue';
import { deleteEmptyChild } from '@/utils/common-util';

export default {
  name: 'Organization',
  components: {
    OrgEdit,
    PlusOutlined,
  },
  data() {
    return {
      columns: [
        {
          title: '机构名称',
          dataIndex: 'orgName',
          align: 'left'
        },
        {
          title: '机构编码',
          dataIndex: 'orgCode',
          align: 'center'
        },
        {
          title: '机构状态',
          key: 'statusFlag',
          dataIndex: 'statusFlag',
          align: 'center'
        },
        {
          title: '机构类型',
          dataIndex: 'orgType',
          key: 'orgType',
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'orgSort',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center'
        }
      ],
      menuResponse: {
        statusName: 'code', // 数据状态的字段名称，支持嵌套写法(xxx.xxx)/sys/role
        statusCode: '00000', // 成功的状态码，例如改成200
        msgName: 'message', // 信息的字段名称，支持嵌套
        dataName: 'data' // 数据列表的字段名称，支持嵌套，例如：result.list
      },
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 是否显示编辑弹窗
      showEdit: false,
      // 表格展开的行
      expandedRowKeys: [],
      // 全部机构数据
      orgList: [],
      // 是否是更新组织机构
      updateOrg: false,
      // 组织机构信息详情
      currentOrgInfo: null,
      // 默认选中
      defaultKey: '',
    };
  },
  methods: {
    /**
     * 解析组织机构的数据
     *
     * @author fengshuonan
     * @date 2022/5/20 18:39
     */
    parseOrgList(res) {
      for (let orgListElement of res.data) {
        if (orgListElement.children) {
          orgListElement.children = deleteEmptyChild(orgListElement.children);
        }
      }

      this.orgList = res.data;

      if (!this.expandedRowKeys.length) {
        this.expandAll();
      }

      return res;
    },

    /**
     * 重新加载数据
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload();
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    reset() {
      this.where.orgName = '';
      this.where.orgCode = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    async remove(row) {
      const result = await OrganizationApi.del({ orgId: row.id });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    openAdd() {
      this.defaultKey = '1';
      this.currentOrgInfo = {};
      this.showEdit = true;
      this.updateOrg = false;
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    async openEdit(row, flag) {
      this.currentOrgInfo = await UserApi.getOrgDetail({ orgId: row.nodeId });
      this.defaultKey = flag;
      this.showEdit = true;
      this.updateOrg = true;
    },

    /**
     * 展开全部
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    expandAll() {
      let keys = [];
      eachTreeData(this.orgList, d => {
        if (d.children && d.children.length) {
          keys.push(d.nodeId);
        }
      });
      this.expandedRowKeys = keys;
    },

    /**
     * 折叠全部
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    foldAll() {
      this.expandedRowKeys = [];
    },

    /**
     * 展开的行变化
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    onExpandedRowsChange(expandedRows) {
      this.expandedRowKeys = expandedRows;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/20 17:54
     */
    async datasource({ where, orders }) {
      return await OrganizationApi.organizationTreeList({ ...where, ...orders });
    }
  }
};
</script>
