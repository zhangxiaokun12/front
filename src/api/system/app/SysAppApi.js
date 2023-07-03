import Request from '@/utils/request-util';

/**
 * 应用api
 *
 * @author chenjinlong
 * @date 2021/4/1 16:06
 */
export class SysAppApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/sysApp/page', params);
  }

  /**
   * 新增
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static add(params) {
    return Request.post('/sysApp/add', params);
  }

  /**
   * 删除
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static del(params) {
    return Request.post('/sysApp/delete', params);
  }

  /**
   * 批量删除
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static batchDel(params) {
    return Request.post('/sysApp/batchDelete', params);
  }

  /**
   * 修改
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static edit(params) {
    return Request.post('/sysApp/edit', params);
  }

  /**
   * 激活默认应用
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static active(params) {
    return Request.post('/sysApp/updateActiveFlag', params);
  }

  /**
   * 获取系统顶部导航的应用列表
   *
   * @author fengshuonan
   * @date 2021/4/21 16:20
   */
  static getAppList() {
    return Request.getAndLoadData('/sysMenu/getTopAppList');
  }

  /**
   * 更新应用状态
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
  static updateStatus(params) {
    return Request.post('/sysApp/updateStatus', params);
  }
}
