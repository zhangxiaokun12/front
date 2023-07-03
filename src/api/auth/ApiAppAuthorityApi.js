import Request from '@/utils/request-util';

/**
 * api应用授权
 *
 * @author fengshuonan
 * @date 2022/4/16 18:29
 */
export class ApiAppAuthorityApi {
  /**
   * 获取列表
   *
   * @author fengshuonan
   * @date 2022/4/16 18:33
   */
  static getList(params) {
    return Request.getAndLoadData('/caApiClient/list', params);
  }

  /**
   * 获取客户对应资源
   *
   * @author fengshuonan
   * @date 2022/4/16 18:33
   */
  static getResourceBoard(params) {
    return Request.getAndLoadData('/caApiClient/getResourceBoard', params);
  }

  /**
   * 客户绑定资源
   *
   * @author fengshuonan
   * @date 2022/4/16 18:33
   */
  static grantResource(params) {
    return Request.post('/caApiClient/grantResource', params);
  }
}
