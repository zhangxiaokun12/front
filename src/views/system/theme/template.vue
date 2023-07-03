<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="主题模板名称:">
              <a-input v-model:value.trim="where.templateName" placeholder="请输入主题模板名称" allow-clear />
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
          row-key="templateId"
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
            <template v-if="column.dataIndex == 'templateName'">
              <a @click="openEdit(record)">{{ record.templateName }}</a>
            </template>

            <!-- table列表状态栏 -->
            <!-- Y是激活，N是禁用 -->
            <template v-if="column.key === 'state'">
              <a-switch :checked="record.statusFlag === 'Y'" @change="checked => editStatus(checked, record)" />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此主题模板吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
                <a @click="openConfig(record)">配置</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <template-edit v-model:visible="showEdit" :data="current" @done="reload" :defaultKey="defaultKey" v-if="showEdit"/>

  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ThemeTemplateApi } from '@/api/system/theme/ThemeTemplateApi';
import TemplateEdit from './template-edit.vue';

export default {
  name: 'ThemeTemplate',
  components: {
    TemplateEdit,
  },
  data() {
    return {
      columns: [
        {
          key: 'index',
          width: 45,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '模板名称',
          dataIndex: 'templateName',
          width: 160,
          sorter: true
        },
        {
          title: '模板编码',
          dataIndex: 'templateCode',
          width: 160
        },
        {
          title: '模板类型',
          dataIndex: 'templateType',
          width: 160,
          customRender: function ({ text }) {
            return 1 === text ? '系统类型' : '业务类型';
          }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160,
          sorter: true
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
      showEdit: false,
      // 默认选中
      defaultKey: '1',
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/12/21 11:26:07
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/12/21 11:26:25
     */
    reset() {
      this.where.templateName = '';
      this.reload();
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2021/12/21 11:28:42
     */
    async remove(row) {
      const result = await ThemeTemplateApi.del({ templateId: row.templateId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑
     *
     * @author fengshuonan
     * @date 2021/12/21 11:29:04
     */
    openEdit(row) {
      this.defaultKey = '1';
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 修改模板启用状态
     *
     * @author fengshuonan
     * @date 2021/12/21 11:30:07
     */
    async editStatus(checked, row) {
      const templateId = row.templateId;
      // 职位状态：Y-启用，N-禁用
      const statusFlag = checked ? 'Y' : 'N';
      const result = await ThemeTemplateApi.updateTemplateStatus({ templateId });
      message.success(result.message);
      row.statusFlag = statusFlag;
      this.reload();
    },

    /**
     * 打开配置
     *
     * @author fengshuonan
     * @date 2021/12/27 14:19:12
     */
    openConfig(row) {
      this.defaultKey = '2';
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
      return ThemeTemplateApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
