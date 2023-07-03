import Request from '@/utils/request-util';

/**
 * 系统临时秘钥
 *
 * @author fengshuonan
 * @date 2022/4/16 18:34
 */
export class SecretKeyApi {
  /**
   * 分页获取列表
   *
   * @author fengshuonan
   * @date 2022/5/8 20:36
   */
  static findPage(params) {
    return Request.getAndLoadData('/sysUserSecretKey/page', params);
  }

  /**
   * 新增
   *
   * @author fengshuonan
   * @date 2022/4/16 18:34
   */
  static add(params) {
    return Request.post('/sysUserSecretKey/add', params);
  }

  /**
   * 编辑临时秘钥
   *
   * @author fengshuonan
   * @date 2022/4/16 18:34
   */
  static edit(params) {
    return Request.post('/sysUserSecretKey/edit', params);
  }

  /**
   * 删除临时秘钥
   *
   * @author fengshuonan
   * @date 2022/4/16 18:34
   */
  static del(params) {
    return Request.post('/sysUserSecretKey/delete', params);
  }
}
