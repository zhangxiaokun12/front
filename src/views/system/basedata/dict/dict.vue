<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :lg="5" :md="10" :sm="24" :xs="24">
        <a-card :bordered="false" :body-style="{ padding: '24px 24px' }">
          <!-- 界面左侧系统配置类型表格 -->
          <ele-pro-table
            ref="table"
            row-key="dictTypeId"
            :datasource="datasource"
            :columns="columns"
            v-model:current="current"
            :need-page="true"
            :toolkit="[]"
            @done="done"
            :row-selection="{ columnWidth: 40 }"
            :custom-row="customRow"
          >
            <template #toolbar>
              <a-space size="middle">
                <a-button type="primary" @click="openEdit()">
                  <plus-outlined />
                  <span>新建</span>
                </a-button>
                <a-button danger @click="remove" :disabled="!current">
                  <delete-outlined />
                  <span>删除</span>
                </a-button>
              </a-space>
            </template>
          </ele-pro-table>
        </a-card>
      </a-col>
      <a-col :lg="19" :md="14" :sm="24" :xs="24">
        <a-card :bordered="false">
          <!-- 具体的系统配置table -->
          <dict-data v-if="current" :dictTypeCode="current.dictTypeCode" ref="dictDataRef"/>
        </a-card>
      </a-col>
    </a-row>

    <!-- 编辑系统配置分类的弹框 -->
    <dict-edit v-model:visible="showEdit" :data="editData" @done="reload" v-if="showEdit"/>
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import DictData from './dict-data.vue';
import DictEdit from './dict-edit.vue';
import { SysDictTypeApi } from '@/api/system/basedata/SysDictTypeApi';

export default {
  name: 'SysDict',
  components: {
    DictData,
    DictEdit,
    PlusOutlined,
    DeleteOutlined
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          title: '类型',
          dataIndex: 'dictTypeName'
        },
        {
          title: '编码',
          dataIndex: 'dictTypeCode'
        }
      ],
      // 表格选中数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null
    };
  },
  methods: {
    /**
     * 系统配置分类 表格渲染完成
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    done(res) {
      if (res.data.length > 0) {
        this.current = res.data[0];
      }
    },

    /**
     * 刷新系统配置分类表格
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    reload() {
      this.$refs.table.reload();
    },

    /**
     * 打开编辑系统配置分类
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    openEdit(row) {
      this.editData = row;
      this.showEdit = true;
    },

    /**
     * 删除系统配置分类
     *
     * @author fengshuonan
     * @date 2021/4/9 11:49
     */
    remove() {
      this.$nextTick(() => {
        this.$refs.dictDataRef.showEdit = false;
        this.showEdit = false;
      })
      Modal.confirm({
        title: '提示',
        content: '确定要删除选中的类型吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: async () => {
          let result = await SysDictTypeApi.del({ dictTypeId: this.current.dictTypeId });
          message.success(result.message);
          this.reload();
        }
      });
    },

    /**
     * 点击行的事件监听
     *
     * @author fengshuonan
     * @date 2021/4/9 23:35
     */
    customRow(record) {
      return {
        onClick: () => {
          this.current = record;
        }
      };
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return SysDictTypeApi.findDictTypePage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .ant-card {
    min-height: calc(100vh - 122px);
  }
}
</style>
