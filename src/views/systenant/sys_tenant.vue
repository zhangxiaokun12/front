<template>
  <div class="ele-body">
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="公司名称:">
              <a-input v-model:value.trim="where.companyName" placeholder="请输入公司名称" allow-clear />
            </a-form-item>
            <a-form-item label="注册邮箱:">
              <a-input v-model:value.trim="where.email" placeholder="请输入注册邮箱" allow-clear />
            </a-form-item>
            <a-form-item label="安全手机:">
              <a-input v-model:value.trim="where.safePhone" placeholder="请输入安全手机" allow-clear />
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
      <a-card :bordered="false">
        <ele-pro-table
          ref="table"
          row-key="tenantId"
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
            <template v-if="column.key === 'status'">
              <a-tag color="green" v-if="record.statusFlag === 1">正常</a-tag>
              <a-tag color="red" v-else> 禁用</a-tag>
            </template>

            <!-- logo的预览展示 -->
            <template v-else-if="column.key === 'logo'">
              <img :src="handleSrc(record)" style="width: 40px" />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此记录吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <sysTenant-edit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import SysTenantEdit from './sys_tenant_edit.vue';
import { SysTenantApi } from '@/api/tenant/SysTenantApi';
import { getToken } from '@/utils/token-util';
import { FilePreviewUrl } from '@/api/system/operation/FileApi';
import { API_BASE_PREFIX } from '@/config/setting';

export default {
  name: 'SysTenant',
  components: {
    PlusOutlined,
    SysTenantEdit
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
          title: '租户名称',
          dataIndex: 'companyName'
        },
        {
          title: '注册邮箱',
          dataIndex: 'email'
        },
        {
          title: '手机',
          dataIndex: 'safePhone'
        },
        {
          title: '状态',
          key: 'status',
          dataIndex: 'statusFlag'
        },
        {
          title: '公司logo',
          key: 'logo',
          dataIndex: 'companyLogo'
        },
        {
          title: '公司地址',
          dataIndex: 'companyAddress'
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'licenceNumber'
        },
        {
          title: '租户编码',
          dataIndex: 'tenantCode'
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/05/27 18:10
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/05/27 18:10
     */
    reset() {
      this.where.companyName = '';
      this.where.email = '';
      this.where.safePhone = '';
      this.reload();
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2021/05/27 18:10
     */
    async remove(row) {
      const result = await SysTenantApi.delete({ tenantId: row.tenantId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增或编辑弹窗
     *
     * @author fengshuonan
     * @date 2021/05/27 18:10
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 处理image的src属性
     *
     * @author fengshuonan
     * @date 2021/5/28 15:19
     */
    handleSrc(record) {
      return `${API_BASE_PREFIX}${FilePreviewUrl}?fileId=${record.companyLogo}&token=${getToken()}`;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysTenantApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
