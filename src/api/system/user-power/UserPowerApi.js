import Request from '@/utils/request-util';

/**
 * 用户管理api
 *
 * @author fengshuonan
 * @date 2021/4/1 16:06
 */
export class UserPowerApi {
  /**
   * 获取用户角色列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
  static getRoleSelectList(params) {
    return Request.getAndLoadData('/sysRole/getRoleSelectList', params);
  }

  /**
   * 获取管理员列表
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
     static getAdminList(params) {
      return Request.getAndLoadData('/sysUser/backAuth/getAdminList', params);
  }

  /**
   * 添加管理员
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
   static addAdmin(params) {
    return Request.post('/sysUser/backAuth/addAdmin', params);
}

/**
   * 删除管理员
   *
   * @author fengshuonan
   * @date 2021/4/1 16:07
   */
 static delAdmin(params) {
  return Request.post('/sysUser/backAuth/delAdmin', params);
}
}