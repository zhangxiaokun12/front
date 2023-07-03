import Request from '@/utils/request-util';

/**
 * 业务拓展-具体数据api
 *
 * @author fengshuonan
 * @date 2022/03/30 09:53
 */
export class SysExpandDataApi {
  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static delete(params) {
    return Request.post('/sysExpandData/delete', params);
  }

  /**
   * 详情
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static detail(params) {
    return Request.getAndLoadData('/sysExpandData/detail', params);
  }

  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/sysExpandData/page', params);
  }
}
