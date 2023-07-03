import Request from '@/utils/request-util';
import { SAAS_FLAG } from '@/config/setting';

/**
 * 登录退出接口
 *
 * @author fengshuonan
 * @date 2021/4/1 14:34
 */
export class LoginApi {
  /**
   * 登录接口
   *
   * @param {string} params.account 账号
   * @param {string} params.password 密码
   * @param {string} params.rememberMe 记住密码，true-记住，false-不记住
   * @param {string} params.tenantCode 租户编码
   * @author fengshuonan
   * @date 2021/4/1 14:34
   */
  static login(params) {
    if (SAAS_FLAG && params.tenantCode) {
      return Request.post('/sysTenant/tenantCodeLogin', params);
    } else {
      return Request.post('/loginApi', params);
    }
  }

  /**
   * 获取图片验证码以及验证信息接口
   *
   */
  static getVerifyInfo() {
    return Request.get('/dragCaptcha');
  }

  /**
   * 退出接口
   *
   * @author fengshuonan
   * @date 2021/4/1 14:45
   */
  static logout() {
    return Request.get('/logoutAction');
  }

  /**
   * 获取api基础路径
   *
   * @author fengshuonan
   * @date 2021/4/1 14:45
   */
  static getBackendDeployUrl(params) {
    return Request.get('/sysConfig/getBackendDeployUrl', params);
  }

  /**
   * 获取图形验证码
   *
   * @author fengshuonan
   * @date 2021/4/1 14:45
   */
  static async getCaptcha(params) {
    return await Request.get('/captcha', params);
  }
}
