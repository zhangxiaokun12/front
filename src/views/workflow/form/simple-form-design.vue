<!-- 应用编辑弹窗 -->
<template>
  <a-modal :width="windowWidth - 30" :visible="visible" :footer="null" centered @update:visible="updateVisible">
    <a-spin :spinning="spinning">
      <iframe scrolling="yes" id="form-design-iframe" width="100%" frameborder="0" :height="windowHeight" :src="iframeSrc"></iframe>
    </a-spin>
  </a-modal>
</template>

<script>
import { FORM_ENGINE_HOST } from '@/config/setting';
import { getToken } from '@/utils/token-util';

export default {
  name: 'SimpleFormDesign',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  emits: ['done', 'update:visible'],

  data() {
    return {
      token: '123',
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight, //实时屏幕高度
      formResourceId: '',
      cData: {},
      spinning: true
    };
  },

  computed: {
    iframeSrc() {
      return (
        `${FORM_ENGINE_HOST}/FormEdit/` +
        this.token +
        '/' +
        this.cData?.formResourceId +
        '/' +
        this.cData?.formResourceName +
        '/' +
        this.cData?.category +
        '/' +
        this.cData?.formResourceCode +
        '/' +
        Math.floor(Math.random() * 10000) +
        1
      );
    }
  },
  watch: {
    data: function (newVal) {
      this.cData = newVal; //更新传进来的data
    }
  },
  created() {
    this.token = getToken();
  },
  mounted() {
    this.spinning = false;
  },
  methods: {
    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author wangyh
     * @date 2021/7/14 18:03
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>

<style scoped></style>
