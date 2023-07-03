<template>
  <div>
    <!--商品界面-->
    <div class="ele-body ele-bg-white bg-padding" v-if="!showQrPay">
      <a-row :gutter="16">
        <a-col :lg="6" :md="6" :sm="24" :xs="24">
          <a-card hoverable style="width: 240px">
            <template #cover>
              <img alt="example" src="~@/assets/demo.jpg" />
            </template>
            <a-card-meta title="可口可乐" description="￥3.5元 500ML">
              <a-button>点击购买</a-button>
            </a-card-meta>
            <template #actions>
              <a-button @click="openDetail">查看详情</a-button>
              <a-button @click="buy">点击购买</a-button>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!--二维码支付界面-->
    <div v-if="showQrPay">
      <section class="pay-content white-section column-flex index-padding-x bg-padding">
        <div>
          <img alt="example" src="~@/assets/demo2.png" />
        </div>
        <div class="row-flex">
          <div style="margin-top: 4px">
            <svg class="icon" aria-hidden="true" style="width: 40px; height: 40px">
              <use xlink:href="#icon-weixinzhifu" />
            </svg>
          </div>
          <svg class="icon" aria-hidden="true" style="width: 49px; height: 49px">
            <use xlink:href="#icon-zhifupingtai-zhifubao" />
          </svg>
        </div>
        <div>支付完成后请在 <a @click="goToOrderList">我的订单</a> 查看支付结果，如有支付问题联系客服：13011112222</div>
        <div><a @click="goBack">返回</a></div>
      </section>
    </div>
  </div>
</template>

<script>
import '@/styles/iconfont/iconfont.js';
import { message } from 'ant-design-vue';
import router from '@/router';
// import { OrderApi } from '@/api/pay/OrderApi';
import { RedirectUtil } from '@/utils/redirect-util';
import { getToken } from '@/utils/token-util';

export default {
  name: 'ShopGoods',
  components: {},
  data() {
    return {
      // 是否显示支付二维码
      showQrPay: false,
      // 支付二维码图片的src地址
      qrSrc: ''
    };
  },
  mounted() {
    // 路由接收参数
    if (this.$route.query?.orderId) {
      this.showQrPay = true;
    }
  },
  methods: {
    /**
     * 下单接口，购买商品
     *
     * @author fengshuonan
     * @date 2022/4/20 13:27
     */
    async buy() {
      // 获取当前用户是否登录了，没登录跳转到登录
      if (!getToken()) {
        message.info('请登录后进行购买');
        return;
      }

      // 调用下单接口
      // let result = await OrderApi.buy({ goodsId: '1407955534573977728' });

      // 渲染二维码
      // let orderId = result.orderId;
      // this.qrSrc = await OrderApi.payQr({ orderId });

      // 显示二维码图片
      this.showQrPay = true;
    },

    /**
     * 下单接口，购买商品
     *
     * @author fengshuonan
     * @date 2022/4/20 13:27
     */
    openDetail() {
      RedirectUtil.redirect('https://www.jd.com');
    },

    /**
     * 跳转到订单列表界面
     *
     * @author fengshuonan
     * @date 2022/4/20 14:10
     */
    goToOrderList() {
      router.push('/pay/orders');
    },

    /**
     * 返回商品列表界面
     *
     * @author fengshuonan
     * @date 2022/4/20 14:17
     */
    goBack() {
      this.showQrPay = false;
    }
  }
};
</script>

<style scoped>
/*iconfont引用*/
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

/*支付二维码*/
.qrCode {
  width: 20em;
}

/*支付界面*/
.pay-content {
  padding: 2em;
}

.pay-content > * + * {
  margin-top: 1em;
}

.white-section {
  background-color: #ffffff;
}

.column-flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.index-padding-x {
  padding: 0 2em;
}

.row-flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.bg-padding {
  padding: 2em;
}
</style>
