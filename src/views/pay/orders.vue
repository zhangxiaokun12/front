<template>
  <div class="ele-body">
    <div>
      <a-card :bordered="false" class="table-height">
        <a-table :columns="columns" :data-source="orderList" :pagination="false" ref="tableRef" row-key="orderId">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              <a>{{ index + 1 }}</a>
            </template>

            <template v-else-if="column.key === 'price'">
              <span style="color: #fa8929"> ￥{{ record.payPrice }} </span>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag color="orange" v-if="record.state === 1">待支付</a-tag>
              <a-tag color="green" v-else-if="record.state === 2">已完成</a-tag>
              <a-tag color="pink" v-else-if="record.state === 3">已取消</a-tag>
              <a-tag color="red" v-else>已退款</a-tag>
            </template>

            <template v-else-if="column.key === 'action'">
              <!--待支付状态-->
              <div v-if="record.state === 1">
                <a-space>
                  <a-button type="primary" @click="continuePay(record)">
                    <template #icon>
                      <PayCircleOutlined />
                    </template>
                    支付
                  </a-button>
                  <a-button @click="cancelOrder(record)"> 取消订单</a-button>
                </a-space>
              </div>
              <!--已完成支付状态-->
              <div v-else-if="record.state === 2">
                <div>
                  <a-button type="primary" @click="orderDetail">
                    <template #icon>
                      <CodeOutlined />
                    </template>
                    查看详情
                  </a-button>
                </div>
              </div>
              <!--已取消或其他状态-->
              <div v-else>
                <a-button type="primary" @click="deleteOrder(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  删除
                </a-button>
              </div>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { CodeOutlined, DeleteOutlined, PayCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { OrderApi } from '@/api/pay/OrderApi';
import { RedirectUtil } from '@/utils/redirect-util';
import router from '@/router';

export default defineComponent({
  name: 'OrderList',
  components: {
    PayCircleOutlined,
    CodeOutlined,
    DeleteOutlined
  },
  setup() {
    // 表格的引用
    let tableRef = ref(null);

    // 个人订单列表
    let orderList = ref([]);

    // 是否显示下载提示
    let modalInfo = reactive({
      show: false,
      title: '',
      content: ''
    });

    // 列的属性
    const columns = [
      {
        key: 'index',
        title: '序号',
        width: 60,
        align: 'center'
      },
      {
        title: '名称',
        align: 'center',
        dataIndex: 'goodsName'
      },
      {
        title: '付款金额',
        align: 'center',
        key: 'price',
        dataIndex: 'payPrice'
      },
      {
        title: '状态',
        align: 'center',
        key: 'status',
        dataIndex: 'state'
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        key: 'action',
        dataIndex: 'duration'
      }
    ];

    /**
     * 获取订单列表
     *
     * @author fengshuonan
     * @date 2022/1/26 17:46
     */
    onMounted(async () => {
      orderList.value = await OrderApi.orderList({});
    });

    /**
     * 取消订单
     *
     * @author fengshuonan
     * @date 2022/1/30 16:19
     */
    const cancelOrder = async record => {
      await OrderApi.cancelOrder({ orderId: record.orderId });
      message.success('取消成功');
      orderList.value = await OrderApi.orderList({});
    };

    /**
     * 继续支付
     *
     * @author fengshuonan
     * @date 2022/1/30 16:21
     */
    const continuePay = record => {
      router.push(`/pay/goods?orderId=${record.orderId}`);
    };

    /**
     * 删除订单
     *
     * @author fengshuonan
     * @date 2022/1/30 16:21
     */
    const deleteOrder = async record => {
      await OrderApi.deleteOrder({ orderId: record.orderId });
      message.success('删除成功');
      orderList.value = await OrderApi.orderList({});
    };

    /**
     * 查看订单详情
     *
     * @author fengshuonan
     * @date 2022/4/20 14:53
     */
    const orderDetail = () => {
      RedirectUtil.redirect('https://www.jd.com');
    };

    return {
      tableRef,
      columns,
      orderList,
      modalInfo,
      cancelOrder,
      continuePay,
      deleteOrder,
      orderDetail
    };
  }
});
</script>

<style>
.text-wrapper {
  white-space: pre-wrap;
}
</style>
