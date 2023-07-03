<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="应用名称:">
              <a-input v-model:value.trim="where.apiClientName" placeholder="请输入应用名称" allow-clear />
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

    <div>
      <a-card :bordered="false" class="table-height">
        <ele-pro-table
          ref="table"
          row-key="apiClientId"
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
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <!-- table列表状态栏 -->
            <!-- 1是激活，2是禁用 -->
            <template v-if="column.key === 'apiClientStatus'">
              <a-switch :checked="record.apiClientStatus === 1" @change="checked => editState(checked, record)" />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此职务吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 新建 编辑 弹窗  -->
    <management-edit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import ManagementEdit from './management-edit.vue';
import { ApiAppApi } from '@/api/auth/ApiAppApi';

export default {
  name: 'Management',
  components: {
    PlusOutlined,
    ManagementEdit
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          title: 'API应用名称',
          dataIndex: 'apiClientName',
          width: 160
        },
        {
          title: 'API应用编号',
          dataIndex: 'apiClientCode',
          width: 160
        },

        {
          title: 'token过期',
          dataIndex: 'apiClientTokenExpiration',
          width: 160
        },
        {
          title: '是否开启',
          key: 'apiClientStatus',
          dataIndex: 'apiClientStatus',
          width: 160
        },
        {
          title: '排序',
          dataIndex: 'apiClientSort',
          width: 160
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
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2022/4/16 16:16
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
      this.where.apiClientName = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2022/4/16 16:16
     */
    async remove(row) {
      const result = await ApiAppApi.del({ apiClientId: row.apiClientId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2022/4/16 16:16
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 修改职位状态
     *
     * @author fengshuonan
     * @date 2022/4/16 16:16
     */
    async editState(checked, row) {
      const apiClientId = row.apiClientId;
      // 职位状态：1-启用，2-禁用
      const apiClientStatus = checked ? 1 : 2;
      const result = await ApiAppApi.updateStatus({ apiClientId, apiClientStatus });
      message.success(result.message);
      row.apiClientStatus = apiClientStatus;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return ApiAppApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
