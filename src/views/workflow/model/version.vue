<template>
  <div>
    <a-spin :spinning="loading">
      <ele-pro-table
        ref="table"
        row-key="id"
        :datasource="loadData"
        :columns="columns"
        :scroll="{ x: 'max-content' }"
        :needPage="false"
        :response="{
          dataName: 'data'
        }"
      >
        <!-- table上边工具栏 -->
        <template #toolbar>
          <a-button type="dashed" @click="returnPage">
            <RollbackOutlined />
            返回
          </a-button>
        </template>

        <template #bodyCell="{ column, record }">
          <!-- table操作栏按钮 -->
          <template v-if="column.key === 'action'">
            <a-space>
              <a-popconfirm placement="topRight" title="确定将此设为新版？" @confirm="() => handleSetAsNew(record)">
                <a>设为新版</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </a-spin>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { RollbackOutlined } from '@ant-design/icons-vue';
import { ModelApi } from '@/api/workflow/ModelApi';

export default {
  name: 'ModelVersion',
  components: {
    RollbackOutlined
  },
  emits: ['done'],
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
          title: '模型名称',
          dataIndex: 'name'
        },
        {
          title: '唯一编码',
          dataIndex: 'key'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '创建时间',
          dataIndex: 'created'
        },
        {
          title: '创建人',
          dataIndex: 'createdBy'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '操作',
          key: 'action'
        }
      ],
      // 表格搜索条件
      where: {},
      // 加载的数据
      loadData: [],
      // 模型信息
      modelInfo: {},
      // 是否显示编辑弹窗
      showEdit: false,
      // 加载中
      loading: false
    };
  },
  methods: {
    /**
     * 打开此页面
     */
    async openVersion(record) {
      this.modelInfo = record;
      this.loading = true;
      this.loadData = await ModelApi.modelVersion({ id: record.id });
      this.loading = false;
    },

    /**
     * 设为新版
     *
     * @author fengshuonan
     * @date 2021/6/26 12:19
     */
    handleSetAsNew(record) {
      this.loading = true;
      ModelApi.setAsNew({ id: record.id, modelId: this.modelInfo.id }).then(res => {
        this.loading = false;
        if (res.success) {
          message.success('设为新版成功');
        } else {
          message.error('设为新版失败：' + res.message);
        }
      });
    },

    /**
     * 返回界面
     *
     * @author fengshuonan
     * @date 2021/6/26 12:19
     */
    returnPage() {
      this.$emit('done');
    }
  }
};
</script>
