<template>
  <div class="ele-body">
    <a-row>
      <!-- 左侧业务类型列表 -->
      <a-col :lg="3" :md="4" :sm="24" :xs="24" class="left-menu-height left-menu-background">
        <a-menu mode="inline" class="zero-border" v-model:selectedKeys="selectedBusiness">
          <a-menu-item v-for="item in businessList" :key="item.expandId" @click="clickMenu(item)">
            {{ item.expandName }}
          </a-menu-item>
        </a-menu>
      </a-col>

      <!-- 右侧字段管理table -->
      <a-col :lg="21" :md="20" :sm="24" :xs="24">
        <!-- 表格 -->
        <div>
          <a-card :bordered="false" class="left-menu-height">
            <ele-pro-table
              ref="table"
              :initLoad="false"
              row-key="fieldId"
              :datasource="datasource"
              :columns="columns"
              :where="where"
              :scroll="{ x: 'max-content' }"
            >
              <!-- table上边工具栏 -->
              <template #toolbar>
                <a-space>
                  <a-button type="primary" @click="openAdd()">
                    <template #icon>
                      <plus-outlined />
                    </template>
                    <span>新建</span>
                  </a-button>
                </a-space>
              </template>

              <template #bodyCell="{ column, record }">
                <!-- table列表状态栏 -->
                <!-- 字段类型：1-字符串类型，2-数字类型，3-字典类型 -->
                <template v-if="column.key === 'fieldType'">
                  <a-tag v-if="record.fieldType === 1" color="green">字符串</a-tag>
                  <a-tag v-if="record.fieldType === 2" color="blue">数字</a-tag>
                  <a-tag v-if="record.fieldType === 3" color="orange">字典类型</a-tag>
                </template>

                <!-- 是否必填 -->
                <template v-else-if="column.key === 'fieldRequired'">
                  <a-tag v-if="record.fieldRequired === 'Y'" color="cyan">必填</a-tag>
                  <a-tag v-else>非必填</a-tag>
                </template>

                <!-- 是否在列表展示 -->
                <template v-else-if="column.key === 'listShowFlag'">
                  <a-tag color="purple" v-if="record.listShowFlag === 'Y'">列表显示</a-tag>
                  <a-tag v-else>列表不显示</a-tag>
                </template>

                <!-- table操作栏按钮 -->
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a @click="openEdit(record)">修改</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定要删除此记录吗？" @confirm="remove(record)">
                      <a class="ele-text-danger">删除</a>
                    </a-popconfirm>
                  </a-space>
                </template>
              </template>
            </ele-pro-table>
          </a-card>
        </div>
      </a-col>
    </a-row>

    <!-- 编辑弹窗 -->
    <sysExpandField-edit ref="sysExpandFieldEdit" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { SysExpandFieldApi } from '@/api/expand/SysExpandFieldApi';
import SysExpandFieldEdit from './sys_expand_field_edit.vue';
import { SysExpandApi } from '@/api/expand/SysExpandApi';

export default {
  name: 'SysExpandField',
  components: {
    PlusOutlined,
    SysExpandFieldEdit
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          key: 'index',
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '字段中文名称',
          dataIndex: 'fieldName'
        },
        {
          title: '字段英文名称',
          dataIndex: 'fieldCode'
        },
        {
          title: '字段类型',
          key: 'fieldType',
          dataIndex: 'fieldType'
        },
        {
          title: '属性值长度',
          dataIndex: 'fieldLength'
        },
        {
          title: '是否必填',
          key: 'fieldRequired',
          dataIndex: 'fieldRequired'
        },
        {
          title: '列表是否显示',
          key: 'listShowFlag',
          dataIndex: 'listShowFlag'
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
      // 是否显示编辑弹窗
      showEdit: false,
      // 左侧业务列表
      businessList: [],
      // 当前选中的左侧应用
      selectedBusiness: [],
      // 字段数据集合，查询结果
      fieldList: []
    };
  },
  mounted() {
    // 获取左侧业务列表
    this.loadData();
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    reload() {
      this.$refs.table.reload({ page: 1, where: { expandId: this.selectedBusiness[0] } });
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    async remove(row) {
      const result = await SysExpandFieldApi.delete({ fieldId: row.fieldId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增弹窗
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    openAdd() {
      this.$refs.sysExpandFieldEdit.openDialog(this.selectedBusiness[0], false);
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    openEdit(row) {
      this.$refs.sysExpandFieldEdit.openDialog(this.selectedBusiness[0], true, row);
    },

    /**
     * 获取左侧业务列表
     *
     * @author fengshuonan
     * @date 2022/03/30 09:53
     */
    async loadData() {
      this.businessList = await SysExpandApi.list();
      let firstExpandId = this.businessList[0].expandId;
      this.selectedBusiness.push(firstExpandId);

      // 查询第一个业务的字段列表，刷新table
      this.$refs.table.reload({ page: 1, where: { expandId: firstExpandId } });
    },

    /**
     * 点击左侧菜单，加载业务对应的数据
     *
     * @author fengshuonan
     * @date 2022/3/30 13:46
     */
    clickMenu(item) {
      this.$refs.table.reload({ page: 1, where: { expandId: item.expandId } });
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysExpandFieldApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>

<style>
.left-menu-background {
  background-color: white;
  border-right: 1px solid var(--border-color-split);
}

.zero-border {
  border-right: 0;
}
</style>
