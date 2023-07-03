<!-- 表单弹窗 -->
<template>
  <a-modal :visible="visible" :body-style="bodyStyle" :footer="null" @update:visible="updateVisible" width="1000px">
    <iframe class="frame" scrolling="yes" id="formFillIframe" width="95%" height="95%" frameborder="0" :src="iframeSrc"></iframe>
  </a-modal>
</template>

<script>
import { FORM_ENGINE_HOST } from '@/config/setting';
import { getToken } from '@/utils/token-util';

export default {
  name: 'FormComData',
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
      cData: {}
    };
  },

  computed: {
    iframeSrc() {
      return (
        `${FORM_ENGINE_HOST}/FormFill/` +
        this.token +
        '/' +
        this.cData?.procDef?.id +
        '/' +
        this.cData?.id +
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
    window.addEventListener('message', e => {
      if (e.data && e.data.height) {
        this.bodyStyle.height = e.data.height + 100 + 'px';
      }
    });
  },
  methods: {
    /**
     * 弹框是否显示
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
