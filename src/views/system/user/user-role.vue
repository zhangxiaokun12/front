<!-- 用户分配角色 -->
<template>
    <a-spin :spinning="dataLoading">
      <div style="height: 30vh" class="ele-scrollbar-hover">
        <a-tree
          checkable
          :tree-data="roleData"
          :fieldNames="{ children: 'children', title: 'name', key: 'id' }"
          v-model:checkedKeys="checkedKeys"
          @check="treeCheck"
        />
      </div>
    </a-spin>
</template>

<script>
import { message } from 'ant-design-vue';
import { UserApi } from '@/api/system/user/UserApi';

export default {
  name: 'UserRole',
  props: {
    // 当前用户数据
    data: Object
  },
  data() {
    return {
      // 角色数据
      roleData: [],
      // 数据请求状态
      dataLoading: false,
      // 提交状态
      loading: false,
      // 角色选中的keys
      checkedKeys: []
    };
  },
  created() {
    this.query();
  },
  methods: {
    // 树选中
    treeCheck(checkedKeys) {
      this.save();
    },
    /**
     * 获取角色信息
     *
     * @author fengshuonan
     * @date 2021/4/7 16:54
     */
    async query() {
      this.roleData = [];
      this.checkedKeys = [];
      if (!this.data) {
        return;
      }
      this.dataLoading = true;

      // 获取系统的所有角色列表
      this.roleData = await UserApi.getRoleDropList();

      // 获取用户所有的角色
      let userId = this.data.userId;
      let userRoles = await UserApi.getUserRoles({ userId });
      this.checkedKeys = userRoles.map(data => data.roleId);

      // 关闭loading
      this.dataLoading = false;
    },

    /**
     * 保存角色信息
     *
     * @author fengshuonan
     * @date 2021/4/7 16:57
     */
    async save() {
      // 获取当前登录用户和选择的角色
      let userId = this.data.userId;
      let grantRoleIdList = this.checkedKeys;

      // 显示加载中
      this.loading = true;

      // 分配角色
      const result = await UserApi.grantRoles({ userId, grantRoleIdList });
      message.success(result.message);

      // 移除加载中
      this.loading = false;
    },
  }
};
</script>

<style scoped></style>
