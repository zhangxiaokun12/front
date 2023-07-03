import Request from '@/utils/request-util';

/**
 * 表单列表api
 *
 * @author fengshuonan
 * @date 2021/6/28 15:10
 */
export class FormResourceApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/flowableFormResource/page', params);
  }

  /**
   * 表单列表
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formResourceList(params) {
    return Request.getAndLoadData('/flowableFormResource/list', params);
  }

  /**
   * 表单新增
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static add(params) {
    return Request.post('/flowableFormResource/add', params);
  }

  /**
   * 表单编辑
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static edit(params) {
    return Request.post('/flowableFormResource/edit', params);
  }

  /**
   * 表单删除
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static del(params) {
    return Request.post('/flowableFormResource/delete', params);
  }

  /**
   * 表单设计保存
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formResourceDesign(params) {
    return Request.post('/flowableFormResource/design', params);
  }

  /**
   * 表单查看
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formResourceDetail(params) {
    return Request.getAndLoadData('/flowableFormResource/detail', params);
  }

  /**
   * 表单元数据获取
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static globalFormData(params) {
    return Request.getAndLoadData('/flowableForm/globalFormData', params);
  }

  /**
   * 表单的数据
   *
   * @author stylefeng
   * @date 2021/06/25 22:17
   */
  static formData(params) {
    return Request.getAndLoadData('/flowableInstance/formData', params);
  }
}
