<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="开始时间:">
              <a-date-picker v-model:value="where.beginDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item label="结束时间:">
              <a-date-picker v-model:value="where.endDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item label="服务名称:">
              <a-select v-model:value="where.appName" style="width: 205px">
                <a-select-option value="guns">guns</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="日志名称:">
              <a-input v-model:value="where.logName" />
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
          row-key="logId"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-button danger @click="removeBatch()">
                <template #icon>
                  <delete-outlined />
                </template>
                <span>清空日志</span>
              </a-button>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'logName'">
              <a @click="openDetail(record)">{{ record.logName }}</a>
            </template>

            <!-- table操作栏按钮 -->
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="openDetail(record)">详情</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!-- 操作日志详情 -->
    <operate-log-detail v-model:visible="showDetail" :detail="current" />
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { OperateLogApi } from '@/api/system/log/OperateLogApi';
import OperateLogDetail from '@/views/system/log/operatelog/operatelog-detail.vue';

export default {
  name: 'Position',
  components: {
    OperateLogDetail,
    DeleteOutlined
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
          title: '日志分类',
          dataIndex: 'logName'
        },
        {
          title: '执行接口',
          dataIndex: 'requestUrl'
        },
        {
          title: '具体消息',
          dataIndex: 'logContent'
        },
        {
          title: '操作用户',
          dataIndex: 'userIdWrapper'
        },
        {
          title: '服务名称',
          dataIndex: 'appName'
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前编辑数据
      current: null,
      // 是否显示详情弹窗
      showDetail: false
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
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where.beginDate = '';
      this.where.endDate = '';
      this.where.appName = '';
      this.where.logName = '';
      this.reload();
    },

    /**
     * 批量删除
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    removeBatch() {
      if (!this.where.beginDate || !this.where.endDate || !this.where.appName) {
        message.error('清空日志需要填写开始时间，结束时间以及app名称');
        return;
      }
      Modal.confirm({
        title: '提示',
        content: '确定要清空指定日期的操作日志吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          const result = await OperateLogApi.delete(this.where);
          message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 打开详情窗口
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async openDetail(row) {
      this.current = await OperateLogApi.detail({ logId: row.logId });
      this.showDetail = true;
    },

    /**
     * 获取操作日志列表
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return OperateLogApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
