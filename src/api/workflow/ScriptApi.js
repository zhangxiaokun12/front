import Request from '@/utils/request-util';

/**
 * 脚本管理api
 *
 * @author fengshuonan
 * @date 2021/6/28 15:10
 */
export class ScriptApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/flowableScript/page', params);
  }

  /**
   * 查询流程脚本列表
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static flowableScriptList(params) {
    return Request.getAndLoadData('/flowableScript/list', params);
  }

  /**
   * 新增加脚本
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static add(params) {
    return Request.post('/flowableScript/add', params);
  }

  /**
   * 删除脚本
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static del(params) {
    return Request.post('/flowableScript/delete', params);
  }

  /**
   * 编辑脚本
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static edit(params) {
    return Request.post('/flowableScript/edit', params);
  }
}
