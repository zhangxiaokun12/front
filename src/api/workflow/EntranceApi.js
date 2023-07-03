import Request from '@/utils/request-util';

/**
 * 入口管理的api
 *
 * @author fengshuonan
 * @date 2022/5/15 16:00
 */
export class EntranceApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/flowableShortcut/page', params);
  }
}
