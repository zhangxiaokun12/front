<template>
<div>
  <common-drawer
    :width="1100"
    v-if="isShow"
    :visible="visible"
    :title="title"
    @close="updateVisible(false)"
    :mask="isShow"
  >
    <a-spin :spinning="loading">
      <menu-resource-table :dataSource="dataSource" :columns="columns" @checkedGroup="checkedGroup" @checkedItem="checkedItem"></menu-resource-table>
    </a-spin>
  </common-drawer>

  <!-- 不带抽屉 -->
  <a-spin :spinning="loading" v-else>
      <menu-resource-table :dataSource="dataSource" :columns="columns" @checkedGroup="checkedGroup" @checkedItem="checkedItem"></menu-resource-table>
    </a-spin>
</div>
  
</template>

<script>
import { SysResourceApi } from '@/api/common/SysResourceApi';
import { MenuApi } from '@/api/system/menu/MenuApi';
import MenuResourceTable from './menu-resource-table.vue';

export default {
  name: 'MenuResource',
  components: { MenuResourceTable },
  data() {
    return {
      // 页面标题，是给哪个业务分配
      title: '绑定接口资源',
      // 业务业务类型（业务可以是菜单id或按钮id）（1：菜单，2：菜单下按钮）
      businessType: 1,
      // 业务的id
      businessId: '',
      // 表格数据接口
      dataSource: [],
      // 页面是否加载中，用在获取数据时
      loading: false,
      // 表格列配置
      columns: [
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
      // 菜单id
      menuId: null,
      // 弹框是否显示
      visible: false,
      // 是否显示抽屉
      isShow: true,
    };
  },
  methods: {
    /**
     * 打开绑定资源的窗口，业务类型（1：菜单，2：菜单下按钮）
     *
     * @author fengshuonan
     * @date 2021/8/10 15:25
     */
    openWindow(title, businessType, businessId, flag) {
      this.title = title;
      this.visible = true;
      this.isShow = flag;
      this.businessType = businessType;
      this.businessId = businessId;

      // 获取表格数据
      this.loadMenuResource();
    },

    /**
     * 加载资源列表
     *
     * @author fengshuonan
     * @date 2021/8/8 23:34
     */
    async loadMenuResource() {
      // 开启加载
      this.loading = true;

      // 获取资源
      this.dataSource = await SysResourceApi.getMenuResourceList({ businessId: this.businessId });

      // 资源整理成map
      for (const item of this.dataSource) {
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
      this.loading = false;
    },

    /**
     * 处理选中组的事件
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    async checkedGroup(event, record) {
      // 如果是全选事件，则变为全选，如果是非全选事件则变为非全选
      if (event.target.checked) {
        record.indeterminate = false;
        record.selectedNodes = record.totalNodes.map(item => item.value);
      } else {
        record.selectedNodes = [];
      }

      // 开启加载
      this.loading = true;

      // 将选中的资源请求后端
      let modularTotalResource = record.totalNodes.map(item => item.value);
      let selectedResource = record.selectedNodes;
      await MenuApi.addMenuResourceBind({
        businessId: this.businessId,
        businessType: this.businessType,
        modularTotalResource,
        selectedResource
      });

      // 关闭加载
      this.loading = false;
    },

    /**
     * 处理选中的节点数据
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    checkedItem(checkedValue, record) {
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
      MenuApi.addMenuResourceBind({ businessId: this.businessId, businessType: this.businessType, modularTotalResource, selectedResource });
    },

    /**
     * 更新按钮管理界面的弹框是否显示
     *
     * @author fengshuonan
     * @date 2021/8/8 23:34
     */
    updateVisible(value) {
      this.visible = value;
    }
  }
};
</script>
