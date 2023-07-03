<template>
  <div class="ele-body">
    <a-table :dataSource="dataSource" :columns="columns" :pagination="false" rowKey="code" childrenColumnName="other">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'controller'">
          <a-checkbox v-model:checked="record.checked" :indeterminate="record.indeterminate" @change="checkedGroup($event, record)">
            {{ record.nodeName }}
          </a-checkbox>
        </template>
        <template v-else-if="column.key === 'apis'">
          <a-checkbox-group :options="record.totalNodes" v-model:value="record.selectedNodes" @change="checkedItem($event, record)" />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    dataSource: Array,
    columns: Array
  },
  setup(props, { emit }) {
    /**
     * 处理选中组的事件
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    const checkedGroup = (event, record) => {
      emit('checkedGroup', event, record);
    };

    /**
     * 处理选中的节点数据
     *
     * @author fengshuonan
     * @date 2021/8/8 23:35
     */
    const checkedItem = (event, record) => {
      emit('checkedItem', event, record);
    };

    return {
      checkedGroup,
      checkedItem
    };
  }
});
</script>

<style></style>
