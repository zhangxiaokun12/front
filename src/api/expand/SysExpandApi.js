import Request from '@/utils/request-util';

/**
 * 业务拓展api
 *
 * @author fengshuonan
 * @date 2022/03/30 09:53
 */
export class SysExpandApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/sysExpand/page', params);
  }

  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static add(params) {
    return Request.post('/sysExpand/add', params);
  }

  /**
   * 修改
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static edit(params) {
    return Request.post('/sysExpand/edit', params);
  }

  /**
   * 删除
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static delete(params) {
    return Request.post('/sysExpand/delete', params);
  }

  /**
   * 详情
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static detail(params) {
    return Request.getAndLoadData('/sysExpand/detail', params);
  }

  /**
   * 更新状态
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static updateStatus(params) {
    return Request.post('/sysExpand/updateStatus', params);
  }

  /**
   * 查询拓展业务列表
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static list(params) {
    return Request.getAndLoadData('/sysExpand/list', params);
  }

  /**
   * 根据拓展业务编码，获取业务的元数据信息
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static getByExpandCode(params) {
    return Request.getAndLoadData('/sysExpand/getByExpandCode', params);
  }

  /**
   * 获取用在列表显示的字段信息
   *
   * @author fengshuonan
   * @date 2022/03/30 09:53
   */
  static getListFields(params) {
    return Request.getAndLoadData('/sysExpand/getListFields', params);
  }
}
