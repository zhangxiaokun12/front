<template>
  <a-card :bordered="false" :body-style="{ padding: '2px 2px' }">
    <a-form layout="inline" :model="where">
      <a-row>
        <a-form-item label="配置名称">
          <a-input v-model:value.trim="where.configName" placeholder="请输入名称" allow-clear />
        </a-form-item>
        <a-form-item label="配置编码">
          <a-input v-model:value.trim="where.configCode" placeholder="请输入编码" allow-clear />
        </a-form-item>
        <a-form-item class="ele-text-center">
          <a-space>
            <a-button type="primary" @click="reload">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-row>
    </a-form>

    <div style="margin-top: 10px" class="table">
      <ele-pro-table
        ref="table"
        row-key="configId"
        :datasource="datasource"
        :columns="columns"
        :where="where"
        v-model:selection="selection"
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
          <template v-if="column.dataIndex == 'configName'">
              <a @click="openEdit(record)">{{ record.configName }}</a>
          </template>

          <template v-if="column.key === 'sysFlag'">
            <a-tag color="blue" v-if="record.sysFlag === 'Y'">是</a-tag>
            <a-tag color="default" v-else>否</a-tag>
          </template>

          <template v-if="column.dataIndex == 'configCode'">
            <a @click="openEdit(record)">{{ record.configCode }}</a>
          </template>

          <!-- table操作栏按钮 -->
          <template v-else-if="column.key === 'action'">
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
  <sys-config-edit v-model:visible="showEdit" :group-code="groupCode" :data="current" @done="reload" v-if="showEdit"/>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import SysConfigEdit from './sysconfig-edit.vue';
import { SysConfigApi } from '@/api/system/basedata/SysConfigApi';

export default {
  name: 'SysConfigTable',
  components: {
    PlusOutlined,
    SysConfigEdit
  },
  props: {
    // 配置组编码
    groupCode: String
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
          title: '配置名称',
          dataIndex: 'configName',
          width: 200
        },
        {
          title: '配置编码',
          dataIndex: 'configCode',
          width: 230
        },
        {
          title: '属性值',
          dataIndex: 'configValue',
          width: 360,
          ellipsis: true
        },
        {
          title: '系统类型',
          key: 'sysFlag',
          dataIndex: 'sysFlag',
          width: 100
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 100
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
        groupCode: this.groupCode
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
    groupCode() {
      this.where.groupCode = this.groupCode;
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
      this.where.configName = '';
      this.where.configCode = '';
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
      const result = await SysConfigApi.deleteSysConfig({ configId: row.configId });
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
      if (row && row.sysFlag) {
        this.current.sysFlagChecked = row.sysFlag === 'Y';
      }
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysConfigApi.findConfigPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>

<style scoped lang="less">
</style>
