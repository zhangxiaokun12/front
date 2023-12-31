<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="流程分类">
              <a-select v-model:value.trim="where.category" style="width: 210px" placeholder="请选择流程分类" allow-clear>
                <a-select-option v-for="(item, index) in flowableCategoryListData" :key="index" :value="item.categoryCode"
                >{{ item.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否结束">
              <a-select v-model:value="where.ended" style="width: 210px" placeholder="是否结束" allow-clear>
                <a-select-option value="true">是</a-select-option>
                <a-select-option value="false">否</a-select-option>
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
          row-key="id"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          v-model:selection="selection"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
            <!-- 是否结束 -->
            <template v-if="column.key === 'ended'">
              <a-tag color="red" v-if="record.ended === true">是</a-tag>
              <a-tag color="blue" v-else> 否</a-tag>
            </template>

            <!-- 是否挂起 -->
            <template v-else-if="column.key === 'suspended'">
              <a-tag color="red" v-if="record.suspended === true">是</a-tag>
              <a-tag color="blue" v-else> 否</a-tag>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="track(record)">追踪</a>
                <a-divider type="vertical" />
                <a @click="openForm(record)">表单</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>

        <!--任务追踪界面-->
        <common-tracking ref="tracking" />

        <!-- 表单弹窗 -->
        <form-com-data v-model:visible="showForm" :data="current" @done="reload" />
      </a-card>
    </div>
  </div>
</template>

<script>
import { CategoryApi } from '@/api/workflow/CategoryApi';
import CommonTracking from '@/views/workflow/tracking/common-tracking.vue';
import FormComData from '@/views/workflow/instance/form-com-data.vue';
import { AppliedApi } from '@/api/workflow/AppliedApi';

export default {
  name: 'Applied',
  components: { CommonTracking, FormComData },
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
          title: '流程名称',
          dataIndex: 'name'
        },
        {
          title: '发起人',
          dataIndex: 'startUserName'
        },
        {
          title: '发起时间',
          dataIndex: 'formatStartTime'
        },
        {
          title: '结束时间',
          dataIndex: 'formatEndTime'
        },
        {
          title: '是否结束',
          dataIndex: 'ended',
          key: 'ended'
        },
        {
          title: '是否挂起',
          dataIndex: 'suspended'
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
      showForm: false,
      // 流程分类列表
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
      this.where.category = '';
      this.where.ended = '';
      this.reload();
    },

    /**
     * 打开已办列表的追踪界面
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    track(row) {
      this.$refs.tracking.tracking(row.id);
    },

    /**
     * 打开编辑弹窗
     *
     * @author chenjinlong
     * @date 2021/4/2 17:03
     */
    openForm(row) {
      this.current = row;
      this.showForm = true;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return AppliedApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
