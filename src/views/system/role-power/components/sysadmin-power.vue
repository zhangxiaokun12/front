<template>
  <a-row style="width: 100%">
    <!-- 管理员权限权限 -->
    <a-card :bordered="false" class="table-height" style="width: 100%">
      <a-spin :spinning="allLoading" :delay="100">
        <!-- 顶部按钮 -->
        <div class="header-button">
          <a-space>
            <a-button type="primary" @click="addAdmin"
              ><template #icon><plus-outlined /></template>添加管理员</a-button
            >
            <a-button danger @click="deleteAdmin"
              ><template #icon><delete-outlined /></template>删除管理员</a-button
            >
          </a-space>
        </div>
        <!-- 底部内容 -->
        <a-tabs v-model:activeKey="activeKey" tab-position="left" animated @change="leftChange" class="left-tab">
          <a-tab-pane :key="item.roleId" :tab="item.realName" v-for="item in userList">
            <div v-if="activeKey" class="right">
              <a-spin :spinning="authLoading" :delay="100">
                <div class="right-top">
                  <a-tabs v-model:activeKey="rightActiveKey" animated class="right-tab">
                    <a-tab-pane key="menu" tab="菜单权限"></a-tab-pane>
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
                </div>
              </a-spin>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-card>

    <!-- 添加管理员 -->
    <flow-pick
      v-model:visible="isShowAdd"
      v-if="isShowAdd"
      title="添加管理员"
      :showTab="['user']"
      @done="closeAdd"
      :data="allRoleData"
    ></flow-pick>
  </a-row>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, createVNode, watch } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { UserPowerApi } from '@/api/system/user-power/UserPowerApi';
import FlowPick from '@/components/FlowPick/index.vue';
import { SysMenuApi } from '@/api/common/SysMenuApi';
import { message, Modal } from 'ant-design-vue';
export default defineComponent({
  props: {
    // 资源类型
    resourceBizType: Number
  },
  components: { FlowPick },
  setup(props) {
    const state = reactive({
      // 右侧tab默认选中
      rightActiveKey: 'menu',
      // 左侧默认选中
      activeKey: '',
      // 左侧用户列表
      userList: [],
      // 菜单权限列表
      authData: [],
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
      // 右侧加载动画
      authLoading: false,
      //是否全选
      checkedAll: false,
      //是否显示添加管理员弹框
      isShowAdd: false,
      //左侧所有的人员列表
      allRoleData: {},
      // 所有的加载动画
      allLoading: false
    });

    onMounted(() => {
      getRoleSelectList();
    });

    // 左侧用户切换
    const leftChange = key => {
      state.rightActiveKey = 'menu';
      loadAuthData();
    };

    // 获取角色列表
    const getRoleSelectList = async () => {
      state.allLoading = true;
      state.userList = await UserPowerApi.getAdminList();
      if (state.userList && state.userList.length > 0) {
        state.activeKey = state.userList[0].roleId;
        loadAuthData();
      }
      state.allLoading = false;
    };

    /**
     * 菜单查询权限数据
     *
     * @author fengshuonan
     * @date 2021/8/10 21:20
     */
    const loadAuthData = async () => {
      state.authData = [];
      state.authLoading = true;

      state.authData = await SysMenuApi.roleBindMenuList({ roleId: state.activeKey, resourceBizType: props.resourceBizType });

      setAuthData(state.authData, 'children', 'name', 'id');
      state.authLoading = false;
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

    // 选择所有变化
    const selectAll = async (val, flag) => {
      state.authLoading = true;
      let params = {
        roleId: state.activeKey,
        totalSelectFlag: val.target.checked,
        resourceBizType: props.resourceBizType
      };
      let res;
      if (flag == 'menu') {
        res = await SysMenuApi.grantAll(params);
        loadAuthData();
      }
      message.success(res.message);
      state.authLoading = false;
    };

    // 一级菜单选中
    const menuCheckedGroup = async (event, record) => {
      // 开启加载
      state.authLoading = true;

      //菜单选中id列表
      let grantMenuIdList = [];
      if (record.totalNodes && record.totalNodes.length > 0) {
        grantMenuIdList = record.totalNodes.map(item => item.value);
      }
      grantMenuIdList.push(record.id);
      // 参数
      let params = {
        roleId: state.activeKey,
        selectBindFlag: record.checked,
        grantMenuIdList: grantMenuIdList,
        resourceBizType: props.resourceBizType
      };
      let res = await SysMenuApi.grantRoleMenus(params);
      state.authData = res.data;
      setAuthData(state.authData, 'children', 'name', 'id');
      message.success(res.message);

      // 关闭加载
      state.authLoading = false;
    };

    /**
     * 子菜单选中
     * @author: nxy
     * @Date: 2022-09-30 10:10:05
     * @param {*} event 选中的结果
     * @param {*} record 当前行数据
     * @param {*} chiItem 当前选中的子菜单数据
     */
    const menuCheckedItem = async (event, record, chiItem) => {
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
        roleId: state.activeKey,
        selectBindFlag: event.target.checked,
        grantMenuIdList: grantMenuIdList,
        resourceBizType: props.resourceBizType
      };
      let res = await SysMenuApi.grantRoleMenus(params);
      state.authData = res.data;
      setAuthData(state.authData, 'children', 'name', 'id');
      message.success(res.message);
    };

    // 添加管理员
    const addAdmin = () => {
      let params = {
        selectUserList: []
      };
      if (state.userList && state.userList.length > 0) {
        state.userList.forEach(item => {
          let obj = {
            bizId: item.userId,
            name: item.realName
          };
          params.selectUserList.push(obj);
        });
      }
      state.allRoleData = params;
      state.isShowAdd = true;
    };

    // 删除管理员
    const deleteAdmin = () => {
      if (state.activeKey) {
        let userId = '';
        state.userList.forEach(item => {
          if (item.roleId == state.activeKey) {
            userId = item.userId;
          }
        });
        Modal.confirm({
          title: '提示',
          content: '确定要删除当前管理员吗?',
          icon: createVNode(ExclamationCircleOutlined),
          maskClosable: true,
          onOk: async () => {
            let result = await UserPowerApi.delAdmin({ userId: userId });
            message.success(result.message);
            getRoleSelectList();
          }
        });
      }
    };

    // 关闭添加弹框
    const closeAdd = params => {
      state.allLoading = true;
      let userIdList = [];
      if (params.selectUserList && params.selectUserList.length > 0) {
        userIdList = params.selectUserList.map(item => item.bizId);
      }
      UserPowerApi.addAdmin({ userIdList: userIdList })
        .then(res => {
          if (res.code == '00000') {
            message.success(res.message);
            getRoleSelectList();
          }
        })
        .finally(() => (state.allLoading = false));
    };

    watch(
      () => state.authData,
      val => {
        if (val && val.length > 0) {
          if (val.find(item => item.checked == false)) {
            return (state.checkedAll = false);
          } else {
            return (state.checkedAll = true);
          }
        } else {
          return (state.checkedAll = false);
        }
      }
    );

    return {
      ...toRefs(state),
      menuCheckedGroup,
      menuCheckedItem,
      getRoleSelectList,
      loadAuthData,
      deleteAdmin,
      setAuthData,
      addAdmin,
      leftChange,
      closeAdd,
      selectAll
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
.header-button {
  width: 100%;
  text-align: right;
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
