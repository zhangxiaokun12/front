<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="资源名称:">
              <a-input v-model:value.trim="where.resourceName" placeholder="请输入资源名称" allow-clear />
            </a-form-item>
            <a-form-item label="资源url">
              <a-input v-model:value.trim="where.url" placeholder="请输入资源url" allow-clear />
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
          row-key="resourceId"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'resourceName'">
              <a @click="openEdit(record)">{{ record.resourceName }}</a>
            </template>
            <!-- table列表是否是视图栏 -->
            <!-- Y是视图，N是不是视图 -->
            <template v-if="column.key === 'view'">
              <a-tag color="green" v-if="record.viewFlag === 'Y'">是</a-tag>
              <a-tag v-else> 否</a-tag>
            </template>

            <!-- table列表是需要登录栏 -->
            <!-- Y是需要登录，N是不需要登录 -->
            <template v-else-if="column.key === 'requiredLogin'">
              <a-tag color="green" v-if="record.requiredLoginFlag === 'Y'">是</a-tag>
              <a-tag v-else> 否</a-tag>
            </template>

            <!-- table列表是需要权限验证栏 -->
            <!-- Y是需要权限验证，N是不需要权限验证 -->
            <template v-else-if="column.key === 'requiredPermission'">
              <a-tag color="green" v-if="record.requiredPermissionFlag === 'Y'">是</a-tag>
              <a-tag v-else> 否</a-tag>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">详情</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <resource-edit v-model:visible="showEdit" :data="current" @done="reload" v-if="showEdit"/>
  </div>
</template>

<script>
import ResourceEdit from './resource-edit.vue';
import { ResourceApi } from '@/api/system/resource/ResourceApi';

export default {
  name: 'SystemResource',
  components: {
    ResourceEdit
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
          title: '资源名称',
          dataIndex: 'resourceName',
          width: 260
        },
        {
          title: '资源编码',
          dataIndex: 'resourceCode',
          width: 260
        },
        {
          title: '模块名称',
          dataIndex: 'methodName',
          width: 170
        },
        {
          title: '是否视图',
          key: 'view',
          dataIndex: 'phone',
          width: 80,
          align: 'center'
        },
        {
          title: '请求url',
          dataIndex: 'url',
          width: 260
        },
        {
          title: 'http方法',
          dataIndex: 'httpMethod',
          width: 80
        },
        {
          title: '需要登录',
          key: 'requiredLogin',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          width: 80
        },
        {
          title: '需要权限验证',
          key: 'requiredPermission',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          width: 110
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 80,
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
     * @author jiawei
     * @date 2021/4/8 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author jiawei
     * @date 2021/4/8 17:03
     */
    reset() {
      this.where.resourceName = '';
      this.where.url = '';
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author jiawei
     * @date 2021/4/8 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return ResourceApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
