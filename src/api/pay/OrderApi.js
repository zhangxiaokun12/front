import Request from '@/utils/request-util';

/**
 * 订单操作Api
 *
 * @author fengshuonan
 * @date 2021/4/1 14:34
 */
export class OrderApi {
  /**
   * 下单接口
   *
   * @author fengshuonan
   * @date 2022/1/30 16:27
   */
  static buy(params) {
    return Request.getAndLoadData('/order/buy', params);
  }

  /**
   * 获取订单列表
   *
   * @author fengshuonan
   * @date 2022/1/25 23:34
   */
  static orderList(params) {
    return Request.getAndLoadData('/order/list', params);
  }

  /**
   * 取消订单
   *
   * @author fengshuonan
   * @date 2022/1/30 16:18
   */
  static cancelOrder(params) {
    return Request.post('/order/cancelOrder', params);
  }

  /**
   * 删除订单
   *
   * @author fengshuonan
   * @date 2022/1/30 16:27
   */
  static deleteOrder(params) {
    return Request.post('/order/deleteOrder', params);
  }

  /**
   * 获取支付二维码
   *
   * @author fengshuonan
   * @date 2022/2/2 16:54
   */
  static payQr(params) {
    return Request.getAndLoadData('/order/pay', params);
  }
}
