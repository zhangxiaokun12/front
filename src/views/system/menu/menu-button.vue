<template>
  <div>
    <div>
      <!-- 搜索表单 -->
      <div class="block-interval">
        <a-card :bordered="false">
          <a-form layout="inline" :model="where">
            <a-row>
              <a-form-item label="按钮名称:">
                <a-input v-model:value.trim="where.buttonName" placeholder="请输入按钮名称" allow-clear />
              </a-form-item>
              <a-form-item label="按钮编码">
                <a-input v-model:value.trim="where.buttonCode" placeholder="请输入按钮编码" allow-clear />
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
        <a-card :bordered="false">
          <ele-pro-table
            ref="table"
            row-key="buttonId"
            :datasource="datasource"
            :initLoad="false"
            :columns="columns"
            :where="where"
            v-model:selection="selection"
            :scroll="{ x: 'max-content' }"
          >
            <!-- table上边工具栏 -->
            <template #toolbar>
              <a-space>
                <a-button type="primary" @click="addDefaultButton()">
                  <template #icon>
                    <plus-circle-outlined />
                  </template>
                  <span>一建添加默认按钮</span>
                </a-button>
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
              <!-- table操作栏按钮 -->
              <template v-if="column.key === 'action'">
                <a-space>
                  <a @click="openEdit(record)">修改</a>
                  <a-divider type="vertical" />
                  <a @click="openBindResource(record)">绑定接口</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确定要删除此按钮吗？" @confirm="remove(record)">
                    <a class="ele-text-danger">删除</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </ele-pro-table>
        </a-card>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <menu-button-edit v-model:visible="showEdit" :data="current" :menuId="menuId" @done="reload" />
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import MenuButtonEdit from './menu-button-edit.vue';
import { MenuButtonApi } from '@/api/system/menu/MenuButtonApi';

export default {
  name: 'SystemMenuButton',
  components: {
    PlusCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    MenuButtonEdit
  },
  props: {
    // 菜单数据
    data: Object
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 55,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '按钮名称',
          dataIndex: 'buttonName',
          width: 160
        },
        {
          title: '按钮编码',
          dataIndex: 'buttonCode',
          width: 320
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
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
      // 菜单id
      menuId: null
    };
  },
  created() {
    if (this.data) {
      this.menuId = this.data.menuId;
      this.where.menuId = this.data.menuId;
      this.$nextTick(() => {
        this.reload();
      });
    }
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload();
    },

    /**
     * 重置搜索
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    reset() {
      this.where.buttonName = '';
      this.where.buttonCode = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    async remove(row) {
      const result = await MenuButtonApi.deleteMenuButton({ buttonId: row.buttonId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 批量删除
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    removeBatch() {
      if (!this.selection.length) {
        message.error('请至少选择一条数据');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要删除选中的按钮吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let params = this.selection.map(d => d.buttonId);
          const result = await MenuButtonApi.batchDeleteMenuButton({ buttonIds: params });
          message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 一建添加默认按钮
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    async addDefaultButton() {
      Modal.confirm({
        title: '提示',
        content: '是否一键添加系统默认CRUD操作按钮?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          const result = await MenuButtonApi.addDefaultMenuButton({ menuId: this.data.menuId });
          message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 打开编辑弹窗
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    openEdit(row) {
      this.current = row;
      this.menuId = this.data.menuId;
      this.showEdit = true;
    },

    /**
     * 打开绑定资源
     *
     * @author fengshuonan
     * @date 2021/8/10 17:44
     */
    openBindResource(row) {
      this.$emit('openBindResource', row);
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, orders }) {
      return MenuButtonApi.findPage({ ...this.where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
