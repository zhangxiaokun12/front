<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="角色名称:">
              <a-input v-model:value.trim="where.roleName" placeholder="请输入角色名称" allow-clear />
            </a-form-item>
            <a-form-item label="角色编码:">
              <a-input v-model:value.trim="where.roleCode" placeholder="请输入角色编码" allow-clear />
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
          row-key="roleId"
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
            <template v-if="column.dataIndex == 'roleName'">
              <a @click="openEdit(record)">{{ record.roleName }}</a>
            </template>

            <!-- table操作栏按钮 -->
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此角色吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <sys-role-edit v-model:visible="showEdit" :data="current" @done="reload" v-if="showEdit"/>

  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { SysRoleApi } from '@/api/system/role/SysRoleApi';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import SysRoleEdit from './role-edit.vue';

export default {
  name: 'SysRole',
  components: {
    PlusOutlined,
    SysRoleEdit
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
          title: '角色名称',
          dataIndex: 'roleName'
        },
        {
          title: '角色编码',
          dataIndex: 'roleCode'
        },
        {
          title: '数据范围',
          dataIndex: 'dataScopeType'
        },
        {
          title: '排序',
          dataIndex: 'roleSort'
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
      showEdit: false,
      // 是否显示数据授权
      showData: false
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
      this.where.roleName = '';
      this.where.roleCode = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await SysRoleApi.del({ roleId: row.roleId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 批量删除
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    removeBatch() {
      if (!this.selection.length) {
        message.error('请至少选择一条数据');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要删除选中的角色吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          message.error('暂无接口');
        }
      });
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
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysRoleApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
