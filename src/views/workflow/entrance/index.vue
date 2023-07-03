<template>
  <div class="ele-body">
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="申请名称:">
              <a-input v-model:value.trim="where.shortcutName" placeholder="请输入申请名称" allow-clear />
            </a-form-item>
            <a-form-item label="流程分类">
              <a-select v-model:value.trim="where.category" style="width: 210px" placeholder="请选择流程分类" allow-clear>
                <a-select-option v-for="(item, index) in flowableCategoryListData" :key="index" :value="item.categoryCode"
                >{{ item.categoryName }}
                </a-select-option>
              </a-select>
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
      <a-card :bordered="false">
        <ele-pro-table
          ref="table"
          row-key="shortcutId"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table上边工具栏 -->
          <template #toolbar></template>

          <template #bodyCell="{ column, record }">
            <!-- 图标渲染 -->
            <template v-if="column.key === 'icon'">
              <component style="fontsize: 20px" :is="$antIcons[record.icon]" />
            </template>

            <!-- 状态 -->
            <template v-else-if="column.key === 'status'">
              <a-tag color="blue" v-if="record.status === 1">启用</a-tag>
              <a-tag color="red" v-else-if="record.status === 2"> 禁用</a-tag>
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
    <entrance-edit v-model:visible="showEdit" :data="current" :selectList="flowableCategoryListData" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import EntranceEdit from '@/views/workflow/entrance/entrance-edit.vue';
import { CategoryApi } from '@/api/workflow/CategoryApi';
import { ShortCutApi } from '@/api/workflow/ShortCutApi';
import { EntranceApi } from '@/api/workflow/EntranceApi';

export default {
  name: 'EntranceIndex',
  components: {
    EntranceEdit
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
          title: '入口名称',
          dataIndex: 'shortcutName'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          key: 'icon'
        },
        {
          title: '分类名称',
          dataIndex: 'categoryName'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status'
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
      // 是否显示编辑弹窗
      showEdit: false,
      // 流程分类
      flowableCategoryListData: []
    };
  },
  async mounted() {
    this.flowableCategoryListData = await CategoryApi.categoryList();
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
      this.where.shortcutName = '';
      this.where.category = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await ShortCutApi.del({ shortcutId: row.shortcutId });
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
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return EntranceApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
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
