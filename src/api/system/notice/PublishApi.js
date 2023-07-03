import Request from '@/utils/request-util';

/**
 * 系统通知管理api
 *
 * @author laihongliang
 * @date 2021/04/04 00:29
 */
export default class PublishApi {
  /**
   * 获取通知列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static findPage(params) {
    return Request.getAndLoadData('/sysNotice/page', params);
  }

  /**
   * 新建系统通知
   *
   * @author laihongliang
   * @date 2021/04/04 00:29
   */
  static addPublish(params) {
    return Request.post('/sysNotice/add', params);
  }

  /**
   * 编辑系统消息
   * @author laihongliang
   * @date 2021/04/07 23:03
   */
  static editPublish(params) {
    return Request.post('/sysNotice/edit', params);
  }
}
