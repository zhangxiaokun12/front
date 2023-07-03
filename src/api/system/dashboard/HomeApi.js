import Request from '@/utils/request-util';

/**
 * 首页统计信息
 *
 * @author fengshuonan
 * @date 2022/2/11 10:18
 */
export class HomeApi {
  /**
   * 首页企业概况统计
   *
   * @author fengshuonan
   * @date 2022/2/11 10:18
   */
  static orgInfoStat(params) {
    return Request.getAndLoadData('/homePage/getHomeCompanyInfo', params);
  }

  /**
   * 获取在线人数统计
   *
   * @author fengshuonan
   * @date 2022/2/11 10:18
   */
  static getOnlineUserStat(params) {
    return Request.getAndLoadData('/homePage/getOnlineUserList', params);
  }

  /**
   * 获取最近操作记录
   *
   * @author fengshuonan
   * @date 2022/2/11 10:18
   */
  static getRecentLogs(params) {
    return Request.getAndLoadData('/homePage/getRecentLogs', params);
  }

  /**
   * 获取常用功能列表
   *
   * @author fengshuonan
   * @date 2022/2/11 10:18
   */
  static getCommonFunctions(params) {
    return Request.getAndLoadData('/homePage/getCommonFunctions', params);
  }
}
