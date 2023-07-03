<template>
  <div class="ele-body">
    <a-row>
      <!-- 左侧业务类型列表 -->
      <a-col :lg="3" :md="4" :sm="24" :xs="24" class="left-menu-height left-menu-background" style="padding: 1em">
        <a-menu mode="inline" class="zero-border" v-model:selectedKeys="selectedApiClients">
          <a-menu-item v-for="item in leftApiClients" :key="item.apiClientId" @click="loadMenuResource(item.apiClientId)">
            {{ item.apiClientName }}
          </a-menu-item>
        </a-menu>
      </a-col>

      <!-- 右侧分配绑定资源 -->
      <a-col :lg="21" :md="20" :sm="24" :xs="24">
        <div>
          <a-card :bordered="false" class="left-menu-height">
            <a-table :dataSource="dataSource" :columns="columns" :pagination="false" rowKey="code" childrenColumnName="other">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'controller'">
                  <a-checkbox v-model:checked="record.checked" :indeterminate="record.indeterminate" @change="checkedGroup($event, record)">
                    {{ record.nodeName }}
                  </a-checkbox>
                </template>
                <template v-else-if="column.key === 'apis'">
                  <a-checkbox-group
                    :options="record.totalNodes"
                    v-model:value="record.selectedNodes"
                    @change="checkedItem($event, record)"
                  />
                </template>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ApiAppAuthorityApi } from '@/api/auth/ApiAppAuthorityApi';

export default {
  name: 'BindingInterface',
  data() {
    return {
      // 当前左侧选中的apiClient
      selectedApiClients: [],
      // 左侧所有的apiClient
      leftApiClients: [],
      // 右侧表格数据
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
      ]
    };
  },

  created() {
    // 获取左侧api客户端列表渲染
    this.getApiClientList();
  },

  methods: {
    /**
     * 获取左侧api客户端列表渲染
     *
     * @author fengshuonan
     * @date 2022/4/16 23:15
     */
    async getApiClientList() {
      this.leftApiClients = await ApiAppAuthorityApi.getList();

      // 默认进来加载第一个
      this.selectedApiClients[0] = this.leftApiClients[0].apiClientId;

      // 加载第一个对应的资源列表数据
      await this.loadMenuResource(this.selectedApiClients[0]);
    },

    /**
     * 加载api应用对应的资源列表
     *
     * @author fengshuonan
     * @date 2022/4/16 23:22
     */
    async loadMenuResource(apiClientId) {
      // 开启加载
      this.loading = true;

      // 获取apiClientId对应的资源列表
      this.dataSource = await ApiAppAuthorityApi.getResourceBoard({ apiClientId });

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
     * @date 2022/4/16 23:11
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
      await ApiAppAuthorityApi.grantResource({
        apiClientId: this.selectedApiClients[0],
        modularTotalResource,
        selectedResource
      });

      // 关闭加载
      this.loading = false;
    },

    /**
     * 处理选中单个资源的节点数据
     *
     * @author fengshuonan
     * @date 2022/4/16 23:12
     */
    checkedItem(checkedValue, record) {
      let resourceFlag = true;

      // 获取当前行所有的code
      const totalNodes = record.totalNodes.map(item => item.value);
      for (const node of totalNodes) {
        if (!record.selectedNodes.includes(node)) {
          resourceFlag = false;
        }
      }

      // 如果全部选中
      if (resourceFlag) {
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
      ApiAppAuthorityApi.grantResource({
        apiClientId: this.selectedApiClients[0],
        modularTotalResource,
        selectedResource
      });
    }
  }
};
</script>
<style scoped>
.left-menu-background {
  background-color: white;
  border-right: 1px solid var(--border-color-split);
}

.zero-border {
  border-right: 0;
}
</style>
