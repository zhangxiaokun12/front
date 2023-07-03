<!--流程设计界面-->
<template>
  <a-modal title="模型设计" :width="1200" :visible="visible" :confirmLoading="confirmLoading" :footer="null" @cancel="closeModel">
    <div id="wrap" ref="wrap">
      <iframe id="iframe" height="580px" :src="srcUrl" style="width: 100%; overflow: hidden" frameBorder="0"></iframe>
    </div>
  </a-modal>
</template>
<script>
import { getToken } from '@/utils/token-util';
import { API_BASE_PREFIX } from '@/config/setting';

export default {
  name: 'ModelDesign',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      dataRecord: [],
      srcUrl: ''
    };
  },
  methods: {
    /**
     * 初始化模型设计弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 11:51
     */
    initModel(record) {
      this.dataRecord = record;
      this.visible = true;
      const token = getToken();
      this.srcUrl = API_BASE_PREFIX + `/designer/index.html?token=${token}&modelId=${record.modelId}`;
    },
    /**
     * 关闭模型设计弹框
     *
     * @author fengshuonan
     * @date 2021/6/26 11:52
     */
    closeModel() {
      this.visible = false;
      this.srcUrl = '';
    }
  }
};
</script>
