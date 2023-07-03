import Request from '@/utils/request-util';

/**
 * 流程选人api
 *
 * @author nxy
 * @date 2022/9/26
 */
export class FlowPickApi {
   /**
   * 获取左侧组织机构列表
   *
   * @author nxy
   * @date 2022/5/8 20:36
   */
  static getOrgTreeList(params) {
    return Request.post('/hrOrganization/post/getOrgTreeList', params);
  }

  /**
   * 用户组添加
   *
   * @author nxy
   * @date 2022/5/8 20:36
   */
   static add(params) {
    return Request.post('/sysUserGroup/add', params);
  }

  /**
   * 用户组详情
   *
   * @author nxy
   * @date 2022/5/8 20:36
   */
   static detail(params) {
    return Request.get('/sysUserGroup/detail', params);
  }
}