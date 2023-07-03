<template>
  <a-card :bordered="false" :body-style="{ padding: '2px 2px' }">
    <a-form layout="inline" :model="where">
      <a-row>
        <a-form-item label="名称">
          <a-input v-model:value.trim="where.dictName" placeholder="请输入名称" allow-clear />
        </a-form-item>
        <a-form-item label="编码">
          <a-input v-model:value.trim="where.dictCode" placeholder="请输入编码" allow-clear />
        </a-form-item>
        <a-form-item class="ele-text-center">
          <a-space>
            <a-button type="primary" @click="reload">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-row>
    </a-form>

    <div style="margin-top: 10px">
      <ele-pro-table
        ref="table"
        row-key="dictId"
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
          <template v-if="column.dataIndex == 'dictName'">
              <a @click="openEdit(record)">{{ record.dictName }}</a>
          </template>

          <!-- table操作栏按钮 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除吗？" @confirm="remove(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </div>
  </a-card>

  <!-- 编辑弹窗 -->
  <dict-data-edit v-model:visible="showEdit" :dict-type-code="dictTypeCode" :data="current" @done="reload" v-if="showEdit"/>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import DictDataEdit from './dict-data-edit.vue';
import { SysDictDataApi } from '@/api/system/basedata/SysDictDataApi';

export default {
  name: 'SysDictData',
  components: {
    PlusOutlined,
    DictDataEdit
  },
  props: {
    // 配置组编码
    dictTypeCode: String
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
          title: '名称',
          dataIndex: 'dictName'
        },
        {
          title: '编码',
          dataIndex: 'dictCode'
        },
        {
          title: '排序',
          dataIndex: 'dictSort'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {
        dictTypeCode: this.dictTypeCode
      },
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  watch: {
    // 监听配置分类变化
    dictTypeCode() {
      this.where.dictTypeCode = this.dictTypeCode;
      this.reload();
    }
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
      this.where.dictName = '';
      this.where.dictCode = '';
      this.where.dictTypeCode = this.dictTypeCode;
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await SysDictDataApi.del({ dictId: row.dictId });
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
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysDictDataApi.findDictPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>

<style scoped></style>
