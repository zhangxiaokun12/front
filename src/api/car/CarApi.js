import Request from '@/utils/request-util';

/**
 * 车辆api
 *
 * @author fengshuonan
 * @date 2021/4/17 20:21
 */
export class CarApi {
  /**
   * 新增车辆
   *
   * @author fengshuonan
   * @date 2021/4/17 20:21
   */
  static add(params) {
    return Request.post('/car/add', params);
  }

  /**
   * 修改车辆
   *
   * @author fengshuonan
   * @date 2021/4/17 20:21
   */
  static edit(params) {
    return Request.post('/car/edit', params);
  }

  /**
   * 删除车辆
   *
   * @author fengshuonan
   * @date 2021/4/17 20:21
   */
  static delete(params) {
    return Request.post('/car/delete', params);
  }

  /**
   * 车辆详情
   *
   * @author fengshuonan
   * @date 2021/4/17 20:21
   */
  static detail(params) {
    return Request.getAndLoadData('/car/detail', params);
  }

  /**
   * 获取车辆分页数据
   * @param params
   * @returns {*}
   */
  static async findPage(params) {
    let result = await Request.get('/car/findPage', params);
    return result.data;
  }
}
