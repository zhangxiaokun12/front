<template>
  <div class="ele-body">
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="密钥名称:">
              <a-input v-model:value.trim="where.secretKeyName" placeholder="请输入密钥名称" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center">
              <a-space>
                <a-button type="primary" @click="reload">搜索</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </a-card>
    </div>

    <div>
      <a-card :bordered="false" class="table-height">
        <ele-pro-table
          ref="table"
          row-key="userSecretKeyId"
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
            <!-- table列表状态栏 -->
            <!-- 字段类型：Y-是一次性，N-非一次性 -->
            <template v-if="column.key === 'onceFlag'">
              <a-tag v-if="record.secretOnceFlag === 'Y'" color="orange">是</a-tag>
              <a-tag v-else color="green">否</a-tag>
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-popconfirm title="确定要删除此秘钥吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>

    <!--新建和编辑-->
    <secret-key-edit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import SecretKeyEdit from './secret-key-edit.vue';
import { SecretKeyApi } from '@/api/auth/SecretKey';

export default {
  name: 'SecretKey',
  components: {
    SecretKeyEdit
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          title: '密钥名称',
          dataIndex: 'secretKeyName',
          width: 160
        },
        {
          title: '所属人',
          dataIndex: 'createUserName',
          width: 160
        },
        {
          title: '所属人账号',
          dataIndex: 'account',
          width: 160
        },
        {
          title: '过期时间',
          dataIndex: 'secretExpirationTime',
          width: 160
        },
        {
          title: '是否是一次性秘钥',
          key: 'onceFlag',
          dataIndex: 'secretOnceFlag',
          width: 160
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          width: 160,
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 是否显示编辑弹窗
      showEdit: false,
      // 当前编辑数据
      current: null
    };
  },

  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2022/5/13 10:19
     */
    reload() {
      this.selection = [];
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2022/5/13 10:19
     */
    reset() {
      this.where.secretKeyName = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2022/5/13 10:19
     */
    async remove(row) {
      const result = await SecretKeyApi.del({ userSecretKeyId: row.userSecretKeyId });
      message.success(result.message);
      this.reload();
    },

    /**
     * 打开编辑弹窗
     *
     * @author fengshuonan
     * @date 2022/5/13 10:20
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
      return SecretKeyApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
