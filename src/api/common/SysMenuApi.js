/*
 * @Author: nxy
 * @Date: 2022-09-16 17:41:17
 */
import Request from '@/utils/request-util';

/**
 * 菜单管理api
 *
 * @author chenjinlong
 * @date 2021/4/7 11:47
 */
export class SysMenuApi {
  /**
   * 获取菜单列表
   *
   * @author chenjinlong
   * @date 2021/4/7 11:47
   */
  static async getMenuList(params) {
    return await Request.getAndLoadData('/sysMenu/menuAndButtonTreeChildrenV2', params);
  }

  /**
   * 获取左侧菜单（根据应用code）
   *
   * @param {String} params.appCode - 应用编码
   * @param {Boolean} params.totalMenus - 全部应用（true-全部，false-非全部）
   * @author fengshuonan
   * @date 2021/4/21 16:35
   */
  static getLeftMenuList(params) {
    return Request.getAndLoadData('/sysMenu/getLeftMenusAntdv', params);
  }

  /**
   * 获取角色分配菜单界面，绑定情况列表
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
   static async roleBindMenuList(params) {
    return await Request.getAndLoadData('/sysMenu/roleBindMenuList', params);
  }

  /**
   * 获取角色分配操作权限，绑定情况列表
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
   static async roleBindOperateList(params) {
    return await Request.getAndLoadData('/sysMenu/roleBindOperateList', params);
  }

  /**
   * 角色绑定菜单
   *
   * @author chenjinlong
   * @date 2021/4/1 16:07
   */
   static grantRoleMenus(params) {
    return Request.post('/sysRole/grantRoleMenus', params);
  }

   /**
    * 角色绑定按钮
    * @author: nxy
    * @Date: 2022-09-29 09:26:01
    */  
   static grantButton(params) {
    return Request.post('/sysRole/grantButton', params);
  }

  /**
    * 角色绑定菜单的全选
    * @author: nxy
    * @Date: 2022-09-29 09:26:01
    */  
   static grantAll(params) {
    return Request.post('/sysRole/grantRoleMenus/grantAll', params);
  }

  /**
    * 角色绑定操作权限的全选
    * @author: nxy
    * @Date: 2022-09-29 09:26:01
    */  
   static grantButtonAll(params) {
    return Request.post('/sysRole/grantButton/grantAll', params);
  }

  /**
    * 角色绑定分配接口的全选
    * @author: nxy
    * @Date: 2022-09-29 09:26:01
    */  
   static grantResourceV2All(params) {
    return Request.post('/sysRole/grantResourceV2/grantAll', params);
  }
  
}
