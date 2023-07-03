<template>
  <div class="ele-body">
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="单点应用:">
              <a-input v-model:value.trim="where.clientName" placeholder="请输入应用名称" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center">
              <a-space>
                <a-button type="primary" @click="reload">搜索</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </a-card>
    </div>

    <!-- 单点应用table -->
    <div>
      <a-card :bordered="false" class="table-height">
        <ele-pro-table
          ref="table"
          row-key="clientId"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-button type="primary" @click="openAdd()">
                <template #icon>
                  <plus-outlined />
                </template>
                <span>新建</span>
              </a-button>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <!-- table列表状态栏 -->
            <!-- 1是激活，2是禁用 -->
            <template v-if="column.key === 'state'">
              <a-switch
                checked-children="启用"
                un-checked-children="禁止"
                :checked="record.clientStatus === 1"
                @change="checked => editState(checked, record)"
              />
            </template>

            <!-- table 是否统一退出 列表状态栏 -->
            <!-- Y是激活，N是禁用 -->
            <template v-else-if="column.key === 'statd'">
              <a-switch
                checked-children="是"
                un-checked-children="否"
                :checked="record.ssoConsistentLogoutFlag === 'Y'"
                @change="checked => editOut(checked, record)"
              />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">编辑</a>
                <a-divider type="vertical" v-if="record.clientApprovalFlag !== 'Y'" />
                <a @click="approve(record)" v-if="record.clientApprovalFlag !== 'Y'">审批</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此应用吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 新建和编辑弹窗  -->
    <sso-manage-edit ref="ssoManageEdit" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { SsoClientApi } from '@/api/auth/SsoClientApi';
import SsoManageEdit from '@/views/auth/sso/sso-manage-edit.vue';

export default {
  name: 'SsoManage',
  components: {
    SsoManageEdit
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          title: '应用ID标识',
          dataIndex: 'clientId',
          align: 'center',
          width: 160
        },
        {
          title: '应用名称',
          dataIndex: 'clientName',
          align: 'center',
          width: 160
        },
        {
          title: '应用域名',
          dataIndex: 'clientConfig',
          width: 260,
          align: 'center'
        },
        {
          title: '是否统一退出',
          key: 'statd',
          dataIndex: 'ssoConsistentLogoutFlag',
          align: 'center',
          width: 160
        },

        {
          title: '状态',
          key: 'state',
          dataIndex: 'clientStatus',
          align: 'center',
          width: 160
        },
        {
          title: '审批',
          dataIndex: 'clientApprovalFlag',
          align: 'center',
          width: 160,
          customRender: function ({ text }) {
            if ('Y' === text) {
              return '通过';
            } else {
              return '未通过';
            }
          }
        },
        {
          title: '有效期',
          align: 'center',
          dataIndex: 'clientExpireTime',
          width: 160,
          customRender: function ({ text }) {
            if (text) {
              return text;
            } else {
              return '长期有效';
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 是否显示编辑弹窗
      showEdit: false,
      // 当前编辑数据
      current: null
    };
  },

  methods: {
    /**
     * 搜索
     *
     * @author fengshuonan
     * @date 2022/3/27 15:48
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2022/5/13 10:19
     */
    reset() {
      this.where.clientName = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2022/3/27 15:48
     */
    async remove(row) {
      const result = await SsoClientApi.del({ clientId: row.clientId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑
     *
     * @author fengshuonan
     * @date 2022/3/27 15:48
     */
    openAdd() {
      this.$refs.ssoManageEdit.openDialog(false);
    },

    /**
     * 打开编辑
     *
     * @author fengshuonan
     * @date 2022/3/27 15:48
     */
    openEdit(row) {
      this.$refs.ssoManageEdit.openDialog(true, row);
    },

    /**
     * 修改状态
     *
     * @author fengshuonan
     * @date 2022/3/27 15:48
     */
    async editState(checked, row) {
      const clientId = row.clientId;
      // 状态：1-启用，2-禁用
      const clientStatus = checked ? 1 : 2;
      const result = await SsoClientApi.updateStatus({ clientId, clientStatus });
      message.success(result.message);
      row.clientStatus = clientStatus;
    },

    /**
     * 修改是否统一退出标识
     *
     * @author fengshuonan
     * @date 2022/3/27 15:48
     */
    async editOut(checked, row) {
      const clientId = row.clientId;
      // 统一退出标识：Y-启用，N-禁用
      const ssoConsistentLogoutFlag = checked ? 'Y' : 'N';
      const result = await SsoClientApi.updateConsistentLogout({ clientId, ssoConsistentLogoutFlag });
      message.success(result.message);
      row.ssoConsistentLogoutFlag = ssoConsistentLogoutFlag;
    },

    /**
     * 审批通过
     *
     * @author fengshuonan
     * @date 2022/3/27 15:28
     */
    async approve(row) {
      await SsoClientApi.approval({ clientId: row.clientId });
      message.success('审批成功');
      this.reload();
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SsoClientApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
