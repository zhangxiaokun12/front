import Request from '@/utils/request-util';

/**
 * 申请草稿
 *
 * @author fengshuonan
 * @date 2021/7/5 21:14
 */
export class FormManageApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/flowableDraft/page', params);
  }

  /**
   * 添加/编辑申请草稿
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static draftAdd(params) {
    return Request.post('/flowableDraft/addOrUpdate', params);
  }

  /**
   * 申请草稿删除，提交成功删除，和主动删除
   *
   * @author fengshuonan
   * @date 2021/7/5 21:14
   */
  static draftDelete(params) {
    return Request.post('/flowableDraft/delete', params);
  }
}
