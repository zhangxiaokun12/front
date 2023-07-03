import Request from '@/utils/request-util';

/**
 * Api应用管理
 *
 * @author fengshuonan
 * @date 2022/4/16 17:59
 */
export class ApiAppApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/caApiClient/page', params);
  }

  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2022/4/16 18:00
   */
  static add(params) {
    return Request.post('/caApiClient/add', params);
  }

  /**
   * 编辑
   *
   * @author fengshuonan
   * @date 2022/4/16 18:00
   */
  static edit(params) {
    return Request.post('/caApiClient/edit', params);
  }

  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2022/4/16 18:00
   */
  static del(params) {
    return Request.post('/caApiClient/delete', params);
  }

  /**
   * 更新状态
   *
   * @author fengshuonan
   * @date 2022/4/16 18:00
   */
  static updateStatus(params) {
    return Request.post('/caApiClient/changeStatus', params);
  }

  /**
   * 生成公钥和私钥
   *
   * @author fengshuonan
   * @date 2022/4/16 18:00
   */
  static rsaKeyPair(params) {
    return Request.getAndLoadData('/caApiClient/generateSecret', params);
  }
}
