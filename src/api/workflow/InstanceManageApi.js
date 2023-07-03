import Request from '@/utils/request-util';

/**
 * 流程实例管理api
 *
 * @author fengshuonan
 * @date 2021/7/4 21:54
 */
export class InstanceManageApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/flowableInstance/page', params);
  }

  /**
   * 流程实例终止
   *
   * @author fengshuonan
   * @date 2021/7/4 21:54
   */
  static end(params) {
    return Request.post('/flowableInstance/end', params);
  }

  /**
   * 流程实例的审批记录
   *
   * @author fengshuonan
   * @date 2021/7/4 21:54
   */
  static flowableInstanceCommentHistory(params) {
    return Request.getAndLoadData('/flowableInstance/commentHistory', params);
  }

  /**
   * 流程实例的流程图，显示当前节点和走过的节点
   *
   * @author fengshuonan
   * @date 2021/7/4 21:54
   */
  static flowableInstanceTrace(params) {
    return Request.getAndLoadData('/flowableInstance/trace', params);
  }
}
