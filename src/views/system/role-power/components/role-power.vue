<template>
  <a-row style="width: 100%">
    <!-- 角色权限 -->
    <a-card :bordered="false" class="table-height" style="width: 100%">
      <a-tabs v-model:activeKey="activeKey" tab-position="left" animated @change="leftChange" class="left-tab">
        <a-tab-pane :key="item.roleId" :tab="item.roleName" v-for="item in userList">
          <div v-if="activeKey" class="right">
            <a-spin :spinning="authLoading" :delay="100">
              <div class="right-top">
                <a-tabs v-model:activeKey="rightActiveKey" animated @change="rightChange" class="right-tab">
                  <a-tab-pane key="menu" tab="菜单权限"></a-tab-pane>
                  <a-tab-pane key="button" tab="操作权限"></a-tab-pane>
                  <a-tab-pane key="api" tab="分配接口"></a-tab-pane>
                  <a-tab-pane key="data" tab="数据权限"></a-tab-pane>
                </a-tabs>
              </div>
              <div class="right-bottom">
                <div v-if="rightActiveKey == 'menu'">
                  <a-table
                    v-if="authData && authData.length"
                    :dataSource="authData"
                    :columns="menuColumns"
                    :pagination="false"
                    rowKey="id"
                    childrenColumnName="other"
                  >
                    <!-- 头部 -->
                    <template #headerCell="{ column }">
                      <template v-if="column.dataIndex == 'menu'">
                        <a-checkbox v-model:checked="checkedAll" @change="val => selectAll(val, 'menu')"></a-checkbox> 一级菜单
                      </template>
                    </template>

                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'menu'">
                        <a-checkbox v-model:checked="record.checked" @change="menuCheckedGroup($event, record)">
                          {{ record.name }}
                        </a-checkbox>
                      </template>
                      <template v-else-if="column.key === 'menus'">
                        <span v-for="chilItem in record.children" :key="chilItem.id">
                          <a-checkbox v-model:checked="chilItem.checked" @change="menuCheckedItem($event, record, chilItem)">
                            {{ chilItem.name }}
                          </a-checkbox>
                        </span>
                      </template>
                    </template>
                  </a-table>
                </div>
                <div v-if="rightActiveKey == 'button'">
                  <a-table
                    v-if="buttonData && buttonData.length"
                    :dataSource="buttonData"
                    :columns="buttonColumns"
                    :pagination="false"
                    rowKey="id"
                    childrenColumnName="other"
                  >
                    <!-- 头部 -->
                    <template #headerCell="{ column }">
                      <template v-if="column.dataIndex == 'menu'">
                        <a-checkbox v-model:checked="checkedButtonAll" @change="val => selectAll(val, 'buttons')"></a-checkbox> 菜单
                      </template>
                    </template>

                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'menu'">
                        <a-checkbox
                          v-model:checked="record.checked"
                          @change="buttonCheckedGroup($event, record)"
                          v-if="record.buttons && record.buttons.length > 0"
                        >
                          {{ record.name }}
                        </a-checkbox>
                        <span v-else>{{ record.name }}</span>
                      </template>
                      <template v-else-if="column.key === 'buttons'">
                        <a-checkbox-group
                          :options="record.totalNodes"
                          v-model:value="record.selectedNodes"
                          @change="buttonCheckedItem($event, record)"
                        />
                      </template>
                    </template>
                  </a-table>
                </div>
                <div v-if="rightActiveKey == 'api'">
                  <a-table :dataSource="dataSource" :columns="apiColumns" :pagination="false" rowKey="code" childrenColumnName="other">
                    <!-- 头部 -->
                    <template #headerCell="{ column }">
                      <template v-if="column.key == 'controller'">
                        <a-checkbox v-model:checked="checkedApiAll" @change="val => selectAll(val, 'api')"></a-checkbox> 接口分类
                      </template>
                    </template>

                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'controller'">
                        <a-checkbox
                          v-model:checked="record.checked"
                          :indeterminate="record.indeterminate"
                          @change="apiCheckedGroup($event, record)"
                        >
                          {{ record.nodeName }}
                        </a-checkbox>
                      </template>
                      <template v-else-if="column.key === 'apis'">
                        <a-checkbox-group
                          :options="record.totalNodes"
                          v-model:value="record.selectedNodes"
                          @change="apiCheckedItem($event, record)"
                        />
                      </template>
                    </template>
                  </a-table>
                </div>
                <div v-if="rightActiveKey == 'data'">
                  <a-form
                    ref="formRef"
                    :model="form"
                    :rules="rules"
                    style="width: 50%"
                    :label-col="{ md: { span: 3 }, sm: { span: 24 } }"
                    :wrapper-col="{ md: { span: 21 }, sm: { span: 24 } }"
                  >
                    <a-form-item label="数据范围:" name="dataScopeType">
                      <a-select show-search v-model:value="form.dataScopeType" placeholder="请选择数据范围" allow-clear>
                        <a-select-option v-for="item in scopeData" :key="item.code">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="机构范围:" v-show="form.dataScopeType === 40">
                      <a-tree
                        checkable
                        :checkStrictly="true"
                        :tree-data="orgData"
                        :v-show="form.dataScopeType === 1"
                        :fieldNames="{ children: 'children', title: 'name', key: 'id' }"
                        v-model:expandedKeys="expandKeys"
                        v-model:checkedKeys="checkedKeys"
                      />
                    </a-form-item>
                    <div style="text-align: center">
                      <a-button type="primary" @click="saveData">保存</a-button>
                    </div>
                  </a-form>
                </div>
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-row>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue';
import { UserPowerApi } from '@/api/system/user-power/UserPowerApi';
import { message } from 'ant-design-vue';
import { SysRoleApi } from '@/api/system/role/SysRoleApi';
import { SysMenuApi } from '@/api/common/SysMenuApi';
import { eachTreeData } from 'ele-admin-pro';
import { SysResourceApi } from '@/api/common/SysResourceApi';
import { OrganizationApi } from '@/api/system/organization/OrganizationApi';
import { deepCopy } from '@/utils/util';
export default defineComponent({
  name: 'RolePower',
  props: {
    // 资源类型
    resourceBizType: Number
  },
  setup(props) {
    const data = reactive({
      userList: [],
      //   左侧默认选中
      activeKey: '',
      //   右侧默认选中
      rightActiveKey: 'menu',
      // 右侧加载laod
      authLoading: false,
      // menu权限数据
      authData: [],
      // menu表格列配置
      menuColumns: [
        {
          title: '一级菜单',
          key: 'menu',
          width: 200,
          dataIndex: 'menu'
        },
        {
          title: '子菜单',
          key: 'menus',
          dataIndex: 'menus'
        }
      ],
      // api表格列配置
      apiColumns: [
        {
          title: '接口分类',
          key: 'controller',
          dataIndex: 'controller',
          width: 200
        },
        {
          title: '接口列表',
          key: 'apis',
          dataIndex: 'apis',
          width: 900
        }
      ],
      // api表格数据接口
      dataSource: [],
      // 表单验证规则
      rules: {
        dataScopeType: [
          {
            required: true,
            message: '请选择数据范围',
            type: 'number',
            trigger: 'blur'
          }
        ]
      },
      scopeData: [
        { code: 10, name: '仅本人数据' },
        { code: 20, name: '本部门数据' },
        { code: 30, name: '本部门及以下数据' },
        { code: 40, name: '指定部门数据' },
        { code: 50, name: '全部数据' }
      ],
      //   表单数据
      form: {},
      // 权限展开的keys
      expandKeys: [],
      // 角色权限选中的keys
      checkedKeys: [],
      // 部门数据
      orgData: [],
      copyList: [],
      // 菜单权限是否显示选择所有
      checkedAll: false,
      // 按钮操作权限数据列表
      buttonData: [],
      // 按钮操作权限表格配置
      buttonColumns: [
        {
          title: '菜单',
          key: 'menu',
          width: 200,
          dataIndex: 'menu'
        },
        {
          title: '按钮',
          key: 'buttons',
          dataIndex: 'buttons'
        }
      ],
      // 操作权限是否全选
      checkedButtonAll: false,
      // 分配接口是否全选
      checkedApiAll: false
    });
    onMounted(() => {
      getRoleSelectList();
    });

    // 获取角色列表
    const getRoleSelectList = async () => {
      data.userList = await UserPowerApi.getRoleSelectList({ adminFlag: 'N' });
      if (data.userList && data.userList.length > 0) {
        data.activeKey = data.userList[0].roleId;
        loadAuthData();
      }
    };

    /**
     * 菜单处理选中组的事件
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    const menuCheckedGroup = async (event, record) => {
      // 开启加载
      data.authLoading = true;

      //菜单选中id列表
      let grantMenuIdList = [];
      if (record.totalNodes && record.totalNodes.length > 0) {
        grantMenuIdList = record.totalNodes.map(item => item.value);
      }
      grantMenuIdList.push(record.id);
      // 参数
      let params = {
        roleId: data.activeKey,
        selectBindFlag: record.checked,
        grantMenuIdList: grantMenuIdList,
        resourceBizType: props.resourceBizType
      };
      let res = await SysMenuApi.grantRoleMenus(params);
      data.authData = res.data;
      setAuthData(data.authData, 'children', 'name', 'id');
      message.success(res.message);

      // 关闭加载
      data.authLoading = false;
    };

    /**
     * 菜单处理选中的节点数据
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    const menuCheckedItem = async (event, record, chilItem) => {
      //菜单选中id列表
      let grantMenuIdList = [];
      if (event.target.checked) {
        grantMenuIdList.push(record.id);
        record.children.forEach(item => {
          if (item.checked) {
            grantMenuIdList.push(item.id);
          }
        });
      } else {
        record.children.forEach(item => {
          if (!item.checked) {
            grantMenuIdList.push(item.id);
          }
        });
      }

      // 参数
      let params = {
        roleId: data.activeKey,
        selectBindFlag: event.target.checked,
        grantMenuIdList: grantMenuIdList,
        resourceBizType: props.resourceBizType
      };
      let res = await SysMenuApi.grantRoleMenus(params);
      data.authData = res.data;
      setAuthData(data.authData, 'children', 'name', 'id');
      message.success(res.message);
    };

    /**
     * 菜单查询权限数据
     *
     * @author fengshuonan
     * @date 2021/8/10 21:20
     */
    const loadAuthData = async () => {
      data.authData = [];
      data.authLoading = true;

      data.authData = await SysMenuApi.roleBindMenuList({ roleId: data.activeKey, resourceBizType: props.resourceBizType });

      setAuthData(data.authData, 'children', 'name', 'id');
      data.authLoading = false;
    };

    // 设置菜单权限数据
    const setAuthData = (list, childrenName, label, value) => {
      // 资源整理成map
      for (const item of list) {
        // 获取所有的子节点
        let totalNodes = [];
        if (item[childrenName]) {
          for (const subItem of item[childrenName]) {
            totalNodes.push({ label: subItem[label], value: subItem[value] });
          }
          item.totalNodes = totalNodes;

          // 获取选中的子节点
          item.selectedNodes = item[childrenName]
            .filter(value => {
              return value.checked;
            })
            .map(value => value.id);
        }
      }
    };

    /**
     * api处理选中组的事件
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    const apiCheckedGroup = async (event, record) => {
      // 如果是全选事件，则变为全选，如果是非全选事件则变为非全选
      if (event.target.checked) {
        record.indeterminate = false;
        record.selectedNodes = record.totalNodes.map(item => item.value);
      } else {
        record.selectedNodes = [];
      }

      // 开启加载
      data.authLoading = true;

      // 将选中的资源请求后端
      let modularTotalResource = record.totalNodes.map(item => item.value);
      let selectedResource = record.selectedNodes;
      await SysRoleApi.grantResource({
        roleId: data.activeKey,
        modularTotalResource,
        selectedResource
      });

      // 关闭加载
      data.authLoading = false;
    };

    /**
     * api处理选中的节点数据
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    const apiCheckedItem = async (checkedValue, record) => {
      let totalSelectFlag = true;

      // 获取当前行所有的code
      const totalNodes = record.totalNodes.map(item => item.value);
      for (const node of totalNodes) {
        if (!record.selectedNodes.includes(node)) {
          totalSelectFlag = false;
        }
      }

      // 如果全部选中
      if (totalSelectFlag) {
        record.checked = true;
        record.indeterminate = false;
      } else {
        record.checked = false;
        record.indeterminate = true;
      }

      // 如果全部未选中
      if (record.selectedNodes.length === 0) {
        record.indeterminate = false;
      }

      // 将选中的资源请求后端
      let modularTotalResource = record.totalNodes.map(item => item.value);
      let selectedResource = record.selectedNodes;
      SysRoleApi.grantResource({
        roleId: data.activeKey,
        modularTotalResource,
        selectedResource
      });
    };

    /**
     * api加载资源列表
     *
     * @author fengshuonan
     * @date 2021/8/8 23:34
     */
    const loadMenuResource = async () => {
      // 开启加载
      data.authLoading = true;

      // 获取资源
      data.dataSource = await SysResourceApi.getResourceList({ roleId: data.activeKey, resourceBizType: props.resourceBizType });

      // 资源整理成map
      for (const item of data.dataSource) {
        // 获取所有的子节点
        let totalNodes = [];
        for (const subItem of item.children) {
          totalNodes.push({ label: subItem.nodeName, value: subItem.code });
        }
        item.totalNodes = totalNodes;

        // 获取选中的子节点
        item.selectedNodes = item.children
          .filter(value => {
            return value.checked;
          })
          .map(value => value.code);
      }

      // 关闭加载
      data.authLoading = false;
    };

    // 右侧tab点击
    const rightChange = key => {
      if (key == 'menu') {
        loadAuthData();
      } else if (key == 'api') {
        loadMenuResource();
      } else if (key == 'data') {
        data.userList.forEach(item => {
          if (item.roleId == data.activeKey) {
            nextTick(() => {
              data.form = item;
            });
          }
        });
        query();
      } else if (key == 'button') {
        getRoleBindOperateList();
      }
    };

    // 数据加载tree
    const query = () => {
      let roleId = data.activeKey;
      OrganizationApi.tree({ roleId, resourceBizType: props.resourceBizType })
        .then(res => {
          // 加载框
          data.authLoading = false;

          if (res.success) {
            let treeExpandKeys = [],
              treeCheckedKeys = [];

            // 只展开组织机构树的顶级节点
            res.data.forEach(data => {
              treeExpandKeys.push(data.id);
            });

            // 组织机构数据赋值
            data.orgData = res.data;

            // 遍历所有节点，所有选中的节点搜集起来
            eachTreeData(data.orgData, d => {
              if (d.checked) {
                treeCheckedKeys.push(d.id);
              }
            });

            data.expandKeys = treeExpandKeys;
            data.checkedKeys = treeCheckedKeys;
          } else {
            message.error(res.data.message);
          }
        })
        .catch(e => {
          data.authLoading = false;
          message.error(e.message);
        });
    };

    // 保存编辑
    const saveData = async () => {
      // 校验表单
      if (!data.form.dataScopeType) return message.warning('请选择数据范围！');
      // 加载中
      data.authLoading = true;

      // 获取部门树选择数据
      let ids = data.checkedKeys?.checked;
      await SysRoleApi.grantDataScope({
        roleId: data.activeKey,
        grantOrgIdList: ids,
        dataScopeType: data.form.dataScopeType
      })
        .then(res => {
          // 移除加载框
          data.authLoading = false;
          if (res.success) {
            message.success(res.message);
          } else {
            message.error('操作失败：' + res.message);
          }
        })
        .catch(e => {
          data.authLoading = false;
          message.error(e.message);
        });
    };

    // 左侧点击
    const leftChange = key => {
      data.rightActiveKey = 'menu';
      loadAuthData();
    };

    // 获取操作权限列表
    const getRoleBindOperateList = async () => {
      data.authLoading = true;
      data.buttonData = await SysMenuApi.roleBindOperateList({ roleId: data.activeKey, resourceBizType: props.resourceBizType });
      setAuthData(data.buttonData, 'buttons', 'name', 'id');
      data.authLoading = false;
    };

    // 选择所有变化
    const selectAll = async (val, flag) => {
      data.authLoading = true;
      let params = {
        roleId: data.activeKey,
        totalSelectFlag: val.target.checked,
        resourceBizType: props.resourceBizType
      };
      let res;
      if (flag == 'menu') {
        res = await SysMenuApi.grantAll(params);
        loadAuthData();
      } else if (flag == 'buttons') {
        res = await SysMenuApi.grantButtonAll(params);
        getRoleBindOperateList();
      } else if (flag == 'api') {
        res = await SysMenuApi.grantResourceV2All(params);
        loadMenuResource();
      }
      message.success(res.message);
      data.authLoading = false;
    };

    // 操作权限菜单选中
    const buttonCheckedGroup = async (event, record) => {
      let selectedButtonIds = [];
      // 如果是全选
      if (event.target.checked) {
        selectedButtonIds = record.totalNodes.map(item => item.value);
      } else {
        selectedButtonIds = [];
      }
      data.authLoading = true;
      let params = {
        roleId: data.activeKey,
        selectedButtonIds: selectedButtonIds,
        modularButtonIds: record.totalNodes.map(item => item.value),
        resourceBizType: props.resourceBizType
      };

      let res = await SysMenuApi.grantButton(params);
      data.buttonData = res.data;
      setAuthData(data.buttonData, 'buttons', 'name', 'id');
      message.success(res.message);
      data.authLoading = false;
    };

    // 操作权限按钮变化
    const buttonCheckedItem = async (checkedValue, record) => {
      data.authLoading = true;
      let params = {
        roleId: data.activeKey,
        selectedButtonIds: checkedValue,
        modularButtonIds: record.totalNodes.map(item => item.value),
        resourceBizType: props.resourceBizType
      };

      let res = await SysMenuApi.grantButton(params);
      data.buttonData = res.data;
      setAuthData(data.buttonData, 'buttons', 'name', 'id');
      message.success(res.message);
      data.authLoading = false;
    };

    // 监听菜单权限列表，控制全选按钮
    watch(
      () => data.authData,
      val => {
        setCheckedValue(val, 'checkedAll');
      }
    );

    // 监听操作权限列表，控制全选按钮
    watch(
      () => data.buttonData,
      val => {
        if (val && val.length > 0) {
          let newArr = [];
          val.forEach(item => {
            if (item.buttons && item.buttons.length > 0) {
              newArr.push(item);
            }
          });

          setCheckedValue(newArr, 'checkedButtonAll');
        } else {
          return (data.checkedButtonAll = false);
        }
      }
    );

    // 监听分配接口列表，控制全选按钮
    watch(
      () => data.dataSource,
      val => {
        setCheckedValue(val, 'checkedApiAll');
      }
    );

    // 设置全选按钮是否选中
    const setCheckedValue = (list, name) => {
      if (list && list.length > 0) {
        if (list.find(item => item.checked == false)) {
          return (data[name] = false);
        } else {
          return (data[name] = true);
        }
      } else {
        return (data[name] = false);
      }
    };

    return {
      ...toRefs(data),
      getRoleBindOperateList,
      buttonCheckedGroup,
      buttonCheckedItem,
      getRoleSelectList,
      menuCheckedGroup,
      setCheckedValue,
      leftChange,
      apiCheckedItem,
      menuCheckedItem,
      loadMenuResource,
      apiCheckedGroup,
      rightChange,
      loadAuthData,
      setAuthData,
      selectAll,
      query,
      saveData
    };
  }
});
</script>

<style scoped lang="less">
.right {
  height: calc(90vh - 108px);
  overflow-y: auto;
}
.right-top {
  margin-top: -10px;
}
:deep(.left-tab .ant-tabs-tab-active) {
  background: var(--primary-1);
}
:deep(.right-tab .ant-tabs-tab-active) {
  background: #fff;
}
:deep(.left-tab .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  min-width: 70px;
  text-align: center;
}
:deep(.left-tab .ant-tabs-tab-btn) {
  min-width: 70px;
  text-align: center;
}
</style>
