import Request from '@/utils/request-util';

/**
 * 业务拓展-字段信息api
 *
 * @author fengshuonan
 * @date 2022/03/30 09:53
 */
export class SysExpandFieldApi {
  /**
   * 获取所有字段列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/sysExpandField/page', params);
  }

  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static add(params) {
    return Request.post('/sysExpandField/add', params);
  }

  /**
   * 修改
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static edit(params) {
    return Request.post('/sysExpandField/edit', params);
  }

  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static delete(params) {
    return Request.post('/sysExpandField/delete', params);
  }

  /**
   * 详情
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static detail(params) {
    return Request.getAndLoadData('/sysExpandField/detail', params);
  }
}
