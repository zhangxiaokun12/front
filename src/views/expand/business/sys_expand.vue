<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="业务名称:">
              <a-input v-model:value.trim="where.expandName" placeholder="请输入拓展业务名称" allow-clear />
            </a-form-item>
            <a-form-item label="业务编码:">
              <a-input v-model:value.trim="where.expandCode" placeholder="请输入拓展业务唯一编码" allow-clear />
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
          row-key="expandId"
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
            <template v-if="column.key === 'expandStatus'">
              <a-switch :checked="record.expandStatus === 1" @change="checked => editState(checked, record)" />
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
    <sysExpand-edit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { SysExpandApi } from '@/api/expand/SysExpandApi';
import SysExpandEdit from './sys_expand_edit.vue';

export default {
  name: 'SysExpand',
  components: {
    PlusOutlined,
    SysExpandEdit
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
          title: '业务名称',
          dataIndex: 'expandName'
        },
        {
          title: '业务唯一编码',
          dataIndex: 'expandCode'
        },
        {
          title: '业务主键字段名',
          dataIndex: 'primaryFieldName'
        },
        {
          title: '状态',
          key: 'expandStatus',
          dataIndex: 'expandStatus'
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
  async mounted() {},
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    reset() {
      this.where.expandName = '';
      this.where.expandCode = '';
      this.reload();
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    async remove(row) {
      const result = await SysExpandApi.delete({ expandId: row.expandId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增或编辑弹窗
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 修改业务状态
     *
     * @author fengshuonan
     * @date 2022/3/30 10:35
     */
    async editState(checked, row) {
      const expandId = row.expandId;
      // 状态：1-启用，2-禁用
      const expandStatus = checked ? 1 : 2;
      const result = await SysExpandApi.updateStatus({ expandId, expandStatus });
      message.success(result.message);
      row.expandStatus = expandStatus;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysExpandApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
