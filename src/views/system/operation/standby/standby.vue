<template>
  <div class="ele-body">
    <!-- 主备切换 -->
    <a-spin :spinning="state.loading" :delay="100">
      <a-row class="content" v-if="state.switchData" :gutter="16">
        <a-col :span="8" v-for="(item, index) in state.switchData.clusterStatus" :key="index">
          <a-card :bordered="true" style="width: 100%; border: 1px solid #ccc" hoverable>
            <template #title>
              <div class="title-box">
                <div class="title">
                  {{ item.serverType == 'MASTER' ? '主数据库' : '备数据库' }}
                  <span v-if="item.serverType.toLowerCase() == state.switchData.currentActive" style="color: var(--green-6)">(已激活)</span>
                </div>
                <div class="status"><a-badge status="processing" :color="item.enableFlag ? 'green' : 'red'" /></div>
              </div>
            </template>
            <div>
              <span>URL：</span>
              <span v-if="item.connectionUrl && item.connectionUrl.length <= 60">{{ item.connectionUrl }}</span>
              <span v-if="item.connectionUrl && item.connectionUrl.length > 60">
                <a-tooltip>
                  <template #title>{{ item.connectionUrl }}</template>
                  {{ item.connectionUrl.substring(0, 60) }}...
                </a-tooltip>
              </span>
            </div>

            <div class="button">
              <a-button type="primary" @click="switchData(item)">切换</a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup>
import { StandbyApi } from '@/api/system/operation/StandbyApi';
import { message } from 'ant-design-vue';
import { onMounted, reactive } from 'vue';

onMounted(() => {
  getMasterSlaveStatus();
});

const state = reactive({
  loading: false,
  // 总的数据
  switchData: null
});

// 获取目前是主还是备
const getMasterSlaveStatus = () => {
  state.loading = true;
  StandbyApi.getMasterSlaveStatus()
    .then(res => {
      if (res.code == '00000') {
        state.switchData = res.data;
      }
    })
    .finally(() => (state.loading = false));
};

// 切换数据库
const switchData = item => {
  state.loading = true;
  setTimeout(async () => {
    let dbSwitchType = '';
    if (item.serverType == 'MASTER') {
      dbSwitchType = 'master';
    } else {
      dbSwitchType = 'slave';
    }
    let res = await StandbyApi.switchDB({ dbSwitchType: dbSwitchType });
    message.success(res.message);
    state.loading = false;
    getMasterSlaveStatus();
  }, 1000);
};
</script>

<style scoped lang="less">
.content {
  margin-top: 20px;
  display: flex;
}
.title-box {
  position: relative;
}
.button {
  margin-top: 40px;
}
.status {
  position: absolute;
  top: 0px;
  right: 0px;
}
:deep(.ant-badge-status-dot) {
  width: 10px;
  height: 10px;
}
</style>
