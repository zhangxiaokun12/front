<template>
  <div class="ele-body">
    <a-row class="power-header" v-if="resourceBizType == 2">
      <a-card :bordered="false" style="width: 100%">
        <a-tabs v-model:activeKey="activeKey" animated>
          <a-tab-pane :key="1" :tab="'角色权限'"></a-tab-pane>
          <a-tab-pane :key="2" :tab="'管理员权限'"></a-tab-pane>
        </a-tabs>
      </a-card>
    </a-row>

    <!-- 角色权限 -->
    <role-power v-if="activeKey == 1" :resourceBizType="resourceBizType"></role-power>
    <!-- 管理员权限 -->
    <sys-admin-power v-if="activeKey == 2" :resourceBizType="resourceBizType"></sys-admin-power>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue';
import { message } from 'ant-design-vue';
import RolePower from './components/role-power.vue';
import SysAdminPower from './components/sysadmin-power.vue';
export default defineComponent({
  props: {
    // 资源类型
    resourceBizType: {
      type: Number,
      default: 1
    }
  },
  components: { RolePower, SysAdminPower },
  setup(props) {
    const data = reactive({
      activeKey: 1,
    });
    
    return {
      ...toRefs(data),
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
:deep(.power-header .ant-card-body) {
  padding: 0 24px;
}
:deep(.power-header .ant-tabs-top > .ant-tabs-nav) {
  margin: 0;
}
</style>
