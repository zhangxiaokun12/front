<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="应用名称:">
              <a-input v-model:value.trim="where.appName" placeholder="请输入应用名称" allow-clear />
            </a-form-item>
            <a-form-item label="应用编码">
              <a-input v-model:value.trim="where.appCode" placeholder="请输入应用编码" allow-clear />
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
          row-key="appId"
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
            <template v-if="column.dataIndex == 'appName'">
              <a @click="openEdit(record)">{{ record.appName }}</a>
            </template>
            <!-- table列表状态栏 -->
            <!-- 1是激活，2是禁用 -->
            <template v-if="column.key === 'state'">
              <a-switch :checked="record.statusFlag === 1" @change="checked => editStatus(checked, record)" />
            </template>

            <!-- 图标渲染 -->
            <template v-else-if="column.key === 'icon'">
              <component style="fontsize: 20px" :is="$antIcons[record.appIcon]" />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
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

    <!-- 编辑弹窗 -->
    <sys-app-edit v-model:visible="showEdit" :data="current" @done="reload" v-if="showEdit"/>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import SysAppEdit from './app-edit.vue';
import { SysAppApi } from '@/api/system/app/SysAppApi';

export default {
  name: 'SysApp',
  components: {
    PlusOutlined,
    SysAppEdit
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
          title: '应用名称',
          dataIndex: 'appName'
        },
        {
          title: '应用编码',
          dataIndex: 'appCode'
        },
        {
          title: '应用图标',
          key: 'icon',
          dataIndex: 'appIcon'
        },
        {
          title: '是否显示',
          key: 'state',
          dataIndex: 'statusFlag'
        },
        {
          title: '排序',
          dataIndex: 'appSort'
        },
        {
          title: '操作',
          key: 'action'
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
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where.appName = '';
      this.where.appCode = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await SysAppApi.del({ appId: row.appId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 更新应用状态
     *
     * @author chenjinlong
     * @date 2021/4/2 17:04
     */
    async editStatus(checked, row) {
      const appId = row.appId;
      // 激活状态：1-启用，2-禁用
      const statusFlag = checked ? 1 : 2;
      const result = await SysAppApi.updateStatus({ appId, statusFlag });
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
      return SysAppApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
