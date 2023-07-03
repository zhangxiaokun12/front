<template>
  <ele-pro-table
    ref="table"
    row-key="formId"
    :datasource="datasource"
    :columns="columns"
    :where="where"
    v-model:selection="selection"
    :scroll="{ x: 'max-content' }"
    :initLoad="false"
    :needPage="false"
    :response="{
      dataName: 'data'
    }"
  >
    <!-- table上边工具栏 -->
    <template #toolbar>
      <a-space>
        <a-button type="primary" @click="openEdit()">
          <template #icon>
            <plus-outlined />
          </template>
          <span>新增表单</span>
        </a-button>
      </a-space>
    </template>

    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'nodeType'">
        <a-tag color="blue"> {{ nodeTypeFilter(text) }}</a-tag>
      </template>

      <!-- table操作栏按钮 -->
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a @click="openPreview(record)">预览</a>
          <a-divider type="vertical" />
          <a @click="openEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定要删除此表单吗？" @confirm="remove(record)">
            <a class="ele-text-danger">删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </ele-pro-table>

  <!-- 编辑弹窗 -->
  <form-edit v-model:visible="showEdit" :data="current" :definition-id="where.processDefinitionId" @done="reload" />

  <!-- 预览弹窗 -->
  <form-preview v-model:visible="showPreview" :data="current" :definition-id="where.processDefinitionId" />
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import FormEdit from '@/views/workflow/definition/configs/form/form-edit.vue';
import FormPreview from '@/views/workflow/definition/configs/form/form-preview.vue';
import { FormApi } from '@/api/workflow/FormApi';

export default {
  name: 'FormIndex',
  components: {
    FormEdit,
    PlusOutlined,
    FormPreview
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
          title: '表单名称',
          dataIndex: 'formResourceName',
          customRender: ({ record }) => record?.flowableFormResource?.formResourceName
        },
        {
          title: '事件节点类型',
          dataIndex: 'nodeType',
          key: 'nodeType'
        },
        {
          title: '备注',
          customRender: ({ record }) => record?.flowableFormResource?.remark,
          dataIndex: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示预览弹窗
      showPreview: false,
      // 是否显示编辑弹窗
      showEdit: false,
      // 节点类型
      nodeTypeData: [
        { code: 1, value: '启动' },
        { code: 2, value: '全局' },
        { code: 3, value: '节点' }
      ]
    };
  },
  methods: {
    /**
     * 初始化显示
     *
     * @author fengshuonan
     * @date 2021/6/27 16:01
     */
    formIndex(record) {
      this.where.processDefinitionId = record.id;
      this.reload();
    },

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
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await FormApi.formDelete(row);
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 打开预览弹窗（iframe）
     *
     * @author wangyh
     * @date 2021/7/14 17:18
     */
    openPreview(row) {
      this.current = row;
      this.showPreview = true;
    },

    /**
     * 事件节点类型翻译
     *
     * @author fengshuonan
     * @date 2021/6/28 22:20
     */
    nodeTypeFilter(text) {
      const values = this.nodeTypeData.filter(item => item.code === text);
      if (values.length > 0) {
        return values[0].value;
      }
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return FormApi.findPage({ ...where, ...orders, processDefinitionId: this.where.processDefinitionId, pageNo: page, pageSize: limit });
    }
  }
};
</script>

<style scoped>
/*搜索框与表格之间的间隙*/
.block-interval {
  margin-bottom: 10px;
}
</style>
