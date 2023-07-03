import Request from '@/utils/request-util';

/**
 * 单点登录客户端管理
 *
 * @author fengshuonan
 * @date 2022/4/16 17:56
 */
export class SsoClientApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/caClient/page', params);
  }

  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2022/4/16 17:57
   */
  static add(params) {
    return Request.post('/caClient/add', params);
  }

  /**
   * 编辑
   *
   * @author fengshuonan
   * @date 2022/4/16 17:57
   */
  static edit(params) {
    return Request.post('/caClient/edit', params);
  }

  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2022/4/16 17:57
   */
  static del(params) {
    return Request.post('/caClient/delete', params);
  }

  /**
   * 是否退出更新状态
   *
   * @author fengshuonan
   * @date 2022/4/16 17:57
   */
  static updateConsistentLogout(params) {
    return Request.post('/caClient/updateConsistentLogout', params);
  }

  /**
   * 更新状态
   *
   * @author fengshuonan
   * @date 2022/4/16 17:57
   */
  static updateStatus(params) {
    return Request.post('/caClient/updateStatus', params);
  }

  /**
   * 审批通过
   *
   * @author fengshuonan
   * @date 2022/4/16 17:57
   */
  static approval(params) {
    return Request.post('/caClient/approveCaClient', params);
  }
}
