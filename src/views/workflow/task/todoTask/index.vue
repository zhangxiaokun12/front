<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="流程名称:">
              <a-input v-model:value.trim="where.processName" placeholder="请输入流程名称" allow-clear />
            </a-form-item>
            <a-form-item label="任务名称" />
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
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'dueDate'">
              <div v-if="text === ''">无</div>
              <div v-else>{{ text }}</div>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="processTask(record)">办理</a>
                <a-divider type="vertical" />
                <a @click="track(record)">追踪</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 办理任务弹框 -->
    <form-process-task v-model:visible="showProcess" :data="current" @done="reload" />

    <!--追踪界面-->
    <common-tracking ref="tracking" />
  </div>
</template>

<script>
import CommonTracking from '@/views/workflow/tracking/common-tracking.vue';
import FormProcessTask from '@/views/workflow/task/todoTask/form-process-task.vue';
import { HandleTaskApi } from '@/api/workflow/HandleTaskApi';

export default {
  name: 'SysApp',
  components: { FormProcessTask, CommonTracking },
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
          dataIndex: 'procIns.name',
          customRender: ({ record }) => record.procIns.name
        },
        {
          title: '发起人',
          dataIndex: 'procIns.startUserName',
          customRender: ({ record }) => record.procIns.startUserName
        },
        {
          title: '发起时间',
          dataIndex: 'procIns.formatStartTime',
          customRender: ({ record }) => record.procIns.formatStartTime
        },
        {
          title: '接收时间',
          dataIndex: 'formatCreateTime'
        },
        {
          title: '当前节点',
          dataIndex: 'name'
        },
        {
          title: '当前操作人',
          dataIndex: 'assigneeInfo'
        },
        {
          title: '优先级',
          dataIndex: 'priority'
        },
        {
          title: '任务期限',
          dataIndex: 'dueDate',
          key: 'dueDate'
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
      // 是否显示办理窗口
      showProcess: false
    };
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
      this.where.processName = '';
      this.reload();
    },

    /**
     * 办理任务
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    processTask(row) {
      this.showProcess = true;
      this.current = row;
    },

    /**
     * 打开追踪界面
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    track(row) {
      this.$refs.tracking.tracking(row.procIns.id);
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return HandleTaskApi.todoTaskPage({ ...where, ...orders, pageNo: page, pageSize: limit });
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
