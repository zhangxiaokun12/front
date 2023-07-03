<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="车辆名称:">
              <a-input v-model:value.trim="where.carName" placeholder="请输入车辆名称" allow-clear />
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
          row-key="carId"
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

          <!-- table操作栏按钮 -->
          <template #action="{ record }">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除此记录吗？" @confirm="remove(record)">
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </div>

  <!-- 编辑弹窗 -->
  <car-edit v-model:visible="showEdit" :data="current" @done="reload" />
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import CarEdit from './car-edit.vue';
import { CarApi } from '@/api/car/CarApi';
import moment from 'moment'

export default {
  name: 'Car',
  components: {
    PlusOutlined,
    CarEdit
  },
  data() {
    return {
      // 表格数据接口
      url: '/car/findPage',
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '车辆名称',
          dataIndex: 'carName'
        },
        {
          title: '车辆类型',
          dataIndex: 'carType',
          customRender: function ({ text }) {
            if (1 === text) {
              return '轿车';
            } else if (2 === text) {
              return '货车';
            } else {
              return '未知';
            }
          }
        },
        {
          title: '车辆颜色',
          dataIndex: 'carColor'
        },
        {
          title: '车辆价格',
          dataIndex: 'carPrice'
        },
        {
          title: '制造商',
          dataIndex: 'manufacturer'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          customRender: text => {
            if (text !== null) {
              return moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          customRender: text => {
            if (text !== null) {
              return moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            }
            return ''
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
          align: 'center',
          slots: { customRender: 'action' }
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
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
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },

    /**
     * 删除
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await CarApi.delete({ carId: row.carId });
      this.$message.success(result.message);
      this.reload();
    },

    /**
     * 打开新增或编辑弹窗
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
     * @param page
     * @param limit
     * @param where
     * @param orders
     * @returns {Promise<*>}
     */
    datasource({ page, limit, where, orders }) {
      return CarApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
