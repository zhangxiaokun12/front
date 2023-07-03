<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="主题属性名称:">
              <a-input v-model:value.trim="where.fieldName" placeholder="请输入主题属性名称" allow-clear />
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
          row-key="fieldId"
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
            <template v-if="column.dataIndex == 'fieldName'">
              <a @click="openEdit(record)">{{ record.fieldName }}</a>
            </template>

            <!-- table操作栏按钮 -->
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此属性吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <field-edit v-model:visible="showEdit" :data="current" @done="reload" v-if="showEdit"/>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ThemeTemplateFieldApi } from '@/api/system/theme/ThemeTemplateFieldApi';
import FieldEdit from './field-edit.vue';

export default {
  name: 'ThemeTemplateField',
  components: {
    FieldEdit
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
          title: '属性名称',
          dataIndex: 'fieldName',
          width: 140
        },
        {
          title: '属性编码',
          dataIndex: 'fieldCode',
          width: 140
        },
        {
          title: '属性类型',
          dataIndex: 'fieldType',
          width: 60
        },
        {
          title: '是否必填',
          dataIndex: 'fieldRequired',
          width: 60
        },
        {
          title: '属性长度',
          dataIndex: 'fieldLength',
          width: 60
        },
        {
          title: '属性描述',
          dataIndex: 'fieldDescription',
          width: 120
        },
        {
          title: '操作',
          key: 'action',
          width: 190,
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示弹窗
      showEdit: false
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/12/27 10:50:21
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/12/27 10:51:41
     */
    reset() {
      this.where.fieldName = '';
      this.reload();
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2021/12/27 10:53:33
     */
    async remove(row) {
      const result = await ThemeTemplateFieldApi.del({ fieldId: row.fieldId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑
     *
     * @author fengshuonan
     * @date 2021/12/27 10:56:44
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
      return ThemeTemplateFieldApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
