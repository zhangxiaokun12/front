import Request from '@/utils/request-util';

/**
 * 主备切换接口
 *
 * @author nxy
 * @date 2022/5/9 22:34
 */
export class StandbyApi {
  /**
   * 目前是主还是备
   *
   * @author nxy
   * @date 2021/4/12 22:25
   */
  static getMasterSlaveStatus(params) {
    return Request.get('/dbSwitch/getMasterSlaveStatus', params);
  }

  /**
   * 切换状态
   *
   * @author nxy
   * @date 2021/4/12 22:25
   */
  static switchDB(params) {
    return Request.post('/dbSwitch/switchDB', params);
  }
}
