<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="主题名称:">
              <a-input v-model:value.trim="where.themeName" placeholder="请输入主题名称" allow-clear />
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
          row-key="themeId"
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
            <template v-if="column.dataIndex == 'themeName'">
              <a @click="openEdit(record)">{{ record.themeName }}</a>
            </template>

            <!-- table列表状态栏 -->
            <!-- 1是激活，2是禁用 -->
            <template v-if="column.key === 'state'">
              <a-switch :checked="record.statusFlag === 'Y'" @change="checked => editStatus(checked, record)" />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此主题吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>

      <!-- 编辑弹窗 -->
      <theme-edit v-model:visible="showEdit" :data="current" @done="reload" v-if="showEdit"/>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ThemeApi } from '@/api/system/theme/ThemeApi';
import ThemeEdit from './theme-edit.vue';

export default {
  name: 'Theme',
  components: {
    ThemeEdit
  },
  data() {
    return {
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
          title: '主题名称',
          dataIndex: 'themeName',
          width: 160
        },
        {
          title: '主题模板',
          dataIndex: 'templateName',
          width: 160
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160
        },
        {
          title: '启用状态',
          key: 'state',
          dataIndex: 'statusFlag',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 260,
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
     * @date 2021/12/20 15:41:47
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/12/20 15:42:54
     */
    reset() {
      this.where.themeName = '';
      this.reload();
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2021/12/20 15:44:23
     */
    async remove(row) {
      const result = await ThemeApi.del({ themeId: row.themeId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2021/12/20 15:47:12
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 修改主题状态
     *
     * @author fengshuonan
     * @date 2021/12/20 15:48:14
     */
    async editStatus(checked, row) {
      const themeId = row.themeId;
      // 职位状态：Y-启用，N-禁用
      const statusFlag = checked ? 'Y' : 'N';
      const result = await ThemeApi.updateThemeStatus({ themeId });
      message.success(result.message);
      row.statusFlag = statusFlag;
      this.reload();
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return ThemeApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
