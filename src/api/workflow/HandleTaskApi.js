import Request from '@/utils/request-util';

/**
 * 表单管理api
 *
 * @author fengshuonan
 * @date 2021/7/5 21:14
 */
export class HandleTaskApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static todoTaskPage(params) {
    return Request.getAndLoadData('/flowableTodoTask/page', params);
  }

  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static doneTaskPage(params) {
    return Request.getAndLoadData('/flowableDoneTask/page', params);
  }

  /**
   * 任务办理_启动
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static handleTaskStart(params) {
    return Request.post('/flowableHandleTask/start', params);
  }

  /**
   * 任务办理的表单内容数据
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static taskData(params) {
    return Request.getAndLoadData('/flowableHandleTask/taskData', params);
  }
}
