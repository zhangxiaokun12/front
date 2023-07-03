<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="应用选择:">
              <a-select show-search v-model:value="where.appCode" placeholder="请选择所属应用" style="width: 205px" allow-clear>
                <a-select-option v-for="item in appList" :key="item.appCode">
                  {{ item.appName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="菜单名称:">
              <a-input v-model:value.trim="where.menuName" placeholder="请输入菜单名称" allow-clear />
            </a-form-item>
            <a-form-item label="菜单编码">
              <a-input v-model:value.trim="where.menuCode" placeholder="请输入菜单编码" allow-clear />
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
          row-key="menuId"
          :datasource="datasource"
          :response="menuResponse"
          :columns="columns"
          :where="where"
          :need-page="false"
          :parse-data="parseData"
          :expand-icon-column-index="2"
          :expanded-row-keys="expandedRowKeys"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
          @expandedRowsChange="onExpandedRowsChange"
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
              <a-button danger @click="removeBatch">
                <template #icon>
                  <delete-outlined />
                </template>
                <span>删除</span>
              </a-button>

              <a-button @click="expandAll">展开全部</a-button>
              <a-button @click="foldAll">折叠全部</a-button>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <!-- table列表是否可见栏 -->
            <!-- Y是可见，N是不可见 -->
            <template v-if="column.key === 'visible'">
              <a-tag color="green" v-if="record.antdvVisible === 'Y'">可见</a-tag>
              <a-tag v-else> 不可见</a-tag>
            </template>

            <!-- 图标渲染 -->
            <template v-else-if="column.key === 'icon'">
              <component style="fontsize: 20px" :is="$antIcons[record.antdvIcon]" />
              <a @click="openEdit(record)">{{ record.menuName }}</a>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此菜单吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
                <a-divider v-if="record.leafFlag" type="vertical" />
                <a v-if="record.leafFlag" @click="openBtnManageDialog(record)">按钮管理</a>
                <a-divider v-if="record.leafFlag" type="vertical" />
                <a v-if="record.leafFlag" @click="openResourceBind(record)">绑定接口</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <menu-edit v-model:visible="showEdit" :data="current" @done="reload" :defaultKey="defaultKey" v-if="showEdit" />
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import MenuEdit from './menu-edit.vue';
import { MenuApi } from '@/api/system/menu/MenuApi';
import { eachTreeData, toTreeData } from 'ele-admin-pro';
import { deleteEmptyChild } from '@/utils/common-util';

export default {
  name: 'SystemMenu',
  components: {
    PlusOutlined,
    DeleteOutlined,
    MenuEdit
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'appIcon',
          key: 'icon',
          minWidth: 160,
          align: 'left'
        },
        {
          title: '菜单编号',
          dataIndex: 'menuCode',
          align: 'center',
          width: 160
        },
        {
          title: '应用名称',
          dataIndex: 'appName',
          align: 'center',
          width: 160
        },
        {
          title: '路由地址',
          dataIndex: 'antdvRouter',
          align: 'center',
          width: 160
        },
        {
          title: '组件地址',
          dataIndex: 'antdvComponent',
          align: 'center',
          width: 160
        },
        {
          title: '是否可见',
          key: 'visible',
          dataIndex: 'visible',
          align: 'center',
          width: 160
        },
        {
          title: '排序',
          dataIndex: 'menuSort',
          align: 'center',
          width: 68,
          sorter: true
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 280,
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
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 表格展开的行
      expandedRowKeys: [],
      // 全部菜单数据
      menuList: [],
      //应用列表
      appList: [],
      // 默认选中
      defaultKey: '1'
    };
  },
  async mounted() {
    // 查询应用
    this.appList = await MenuApi.getAppDropList();
  },
  methods: {
    /**
     * 解析接口返回数据
     *
     * @author jiawei
     * @date 2021/4/11 12:06
     */
    parseData(res) {
      res = toTreeData({
        data: res.map(d => {
          d.key = d.menuId;
          d.value = d.menuId;
          d.children = deleteEmptyChild(d.children);
          return d;
        }),
        // id字段名，默认id，非必须
        idField: 'menuId',
        // parentId字段名，默认parentId，非必须
        parentIdField: 'menuParentId'
      });

      if (!Object.keys(this.where).length) {
        this.menuList = res;
      }
      if (!this.expandedRowKeys.length) {
        this.expandAll();
      }
      return res;
    },

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
      this.where.appCode = '';
      this.where.menuName = '';
      this.where.menuCode = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author jiawei
     * @date 2021/4/8 10:06
     */
    async remove(row) {
      const result = await MenuApi.deleteMenu({ menuId: row.menuId });
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
      this.showEdit = false;
      if (!this.selection.length) {
        message.error('请至少选择一条数据');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要删除选中的菜单吗?',
        icon: createVNode(ExclamationCircle2Outlined),
        maskClosable: true,
        onOk: async () => {
          let params = this.selection.map(d => d.menuId);
          const result = await MenuApi.deleteMenu({ menuIds: params });
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
      this.defaultKey = '1';
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 展开全部
     *
     * @author jiawei
     * @date 2021/4/11 12:06
     */
    expandAll() {
      let keys = [];
      eachTreeData(this.menuList, d => {
        if (d.children && d.children.length) {
          keys.push(d.menuId);
        }
      });
      this.expandedRowKeys = keys;
    },

    /**
     * 折叠全部
     *
     * @author jiawei
     * @date 2021/4/11 12:06
     */
    foldAll() {
      this.expandedRowKeys = [];
    },

    /**
     * 展开的行变化
     *
     * @author jiawei
     * @date 2021/4/11 12:06
     */

    onExpandedRowsChange(expandedRows) {
      this.expandedRowKeys = expandedRows;
    },

    /**
     * 打开按钮管理的对话框
     *
     * @author jiawei
     * @date 2021/4/7 16:45
     */
    openBtnManageDialog(row) {
      this.current = row;
      this.defaultKey = '2';
      this.showEdit = true;
    },

    /**
     * 打开接口资源绑定的窗口
     *
     * @author fengshuonan
     * @date 2021/8/8 15:40
     */
    openResourceBind(row) {
      this.defaultKey = '3';
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ where, orders }) {
      return MenuApi.findTableMenus({ ...where, ...orders });
    }
  }
};
</script>
