import Request from '@/utils/request-util';

/**
 * 已办任务api
 *
 * @author fengshuonan
 * @date 2022/5/15 17:10
 */
export class AppliedApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/flowableInstance/my', params);
  }
}
