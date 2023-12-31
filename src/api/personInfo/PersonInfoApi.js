import Request from '@/utils/request-util';

/**
 * 个人信息api
 *
 * @author fengshuonan
 * @date 2021/4/1 15:03
 */
export class PersonInfoApi {
  /**
   * 获取当前用户信息
   *
   * @author fengshuonan
   * @date 2021/4/1 15:04
   */
  static getCurrentLoginUserInfo() {
    return Request.getAndLoadData('/sysUser/currentUserInfo');
  }

  /**
   * 更新当前用户信息
   *
   * @param {String} params.account   账号
   * @param {String} params.birthday  生日
   * @param {String} params.email     邮箱
   * @param {String} params.phone     电话
   * @param {String} params.realName  真实姓名
   * @param {String} params.sex       性别
   * @param {String} params.userId    用户id
   * @author fengshuonan
   * @date 2021/4/13 16:16
   */
  static updateUserInfo(params) {
    return Request.post('/sysUser/updateInfo', params);
  }

  /**
   * 修改密码
   *
   * @param {String} password      旧密码
   * @param {String} newPassword   新密码
   * @author fengshuonan
   * @date 2021/4/1 15:09
   */
  static updatePassword(password, newPassword) {
    return Request.post('/sysUser/updatePassword', { password, newPassword });
  }

  /**
   * 修改头像
   *
   * @param {String} avatar    头像id
   * @author fengshuonan
   * @date 2021/4/1 15:09
   */
  static updateAvatar(avatar) {
    return Request.post('/sysUser/updateAvatar', { avatar });
  }
}
