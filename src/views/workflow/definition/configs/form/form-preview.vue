<!-- 应用编辑弹窗 -->
<template>
  <a-modal :visible="visible" :body-style="bodyStyle" :footer="null" @update:visible="updateVisible" width="1000px">
    <iframe scrolling="yes" id="form-def-preview-iframe" width="95%" frameborder="0" height="95%" class="frame" :src="iframeSrc"></iframe>
  </a-modal>
</template>

<script>
import { getToken } from '@/utils/token-util';
import { FORM_ENGINE_HOST } from '@/config/setting';

export default {
  name: 'FormPreview',
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
      bodyStyle: {
        margin: '0',
        padding: '10px'
      },
      formResourceId: '',
      cData: {},
      spinning: true
    };
  },
  computed: {
    iframeSrc() {
      return (
        `${FORM_ENGINE_HOST}/FormPreView/` + this.token + '/' + this.cData?.formResourceId + '/' + Math.floor(Math.random() * 10000) + 1
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
    window.addEventListener('message', e => {
      if (e.data && e.data.height) {
        this.bodyStyle.height = e.data.height + 80 + 'px';
        this.spinning = false;
      }
    });
  },
  mounted() {},
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

<style scoped>
.frame {
  padding-top: 30px;
  padding-left: 30px;
}
</style>
