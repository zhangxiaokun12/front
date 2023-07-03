<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="数据源名称:">
              <a-input v-model:value.trim="where.dbName" placeholder="请输入数据源名称" allow-clear />
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
        <ele-pro-table ref="table" row-key="dbId" :datasource="datasource" :columns="columns" :where="where" :scroll="{ x: 'max-content' }">
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
            <!-- table列表状态标识 -->
            <template v-if="column.key === 'statusFlag'">
              <a-tag color="success" v-if="record.statusFlag === 1">正常</a-tag>
              <a-tag color="error" v-else>
                <a-tooltip>
                  <template #title>{{ record.errorDescription }}</template>
                  连接错误
                </a-tooltip>
              </a-tag>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-popconfirm title="确定要删除此数据源吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <data-source-add v-model:visible="showAdd" :data="current" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { DataSourceApi } from '@/api/system/operation/DataSourceApi';
import DataSourceAdd from '@/views/system/operation/datasource/datasource-add.vue';

export default {
  name: 'Datasource',
  components: {
    DataSourceAdd,
    PlusOutlined
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
          title: '数据库名称',
          dataIndex: 'dbName'
        },
        {
          title: '驱动类型',
          dataIndex: 'jdbcDriver'
        },
        {
          title: '账号',
          dataIndex: 'username'
        },
        {
          title: 'jdbc的url',
          dataIndex: 'jdbcUrl',
          width: 400
        },
        {
          title: '状态',
          key: 'statusFlag',
          dataIndex: 'statusFlag'
        },
        {
          title: '备注',
          dataIndex: 'remarks'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 是否显示编辑弹窗
      showAdd: false,
      // 当前选择的数据
      current: {}
    };
  },
  methods: {
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
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where.dbName = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await DataSourceApi.delete({ dbId: row.dbId });
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
      this.current = {};
      this.showAdd = true;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return DataSourceApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
