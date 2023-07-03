<!-- 新增和编辑弹窗 -->
<template>
  <a-modal
    :width='800'
    :visible='visible'
    :confirm-loading='loading'
    :title="isUpdate ? '修改车辆' : '新建车辆'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible='updateVisible'
    @ok='save'
  >
    <a-form
      layout='horizontal'
      ref='form'
      :model='form'
      :rules='rules'
      :label-col='{ md: { span: 4 }, sm: { span: 24 } }'
      :wrapper-col='{ md: { span: 20 }, sm: { span: 24 } }'
    >
      <a-form-item label='车辆名称:' name='carName'>
        <a-input v-model:value='form.carName' placeholder='请输入车辆名称' allow-clear autocomplete='off' />
      </a-form-item>

      <a-form-item label='车辆类型:' name='carType' defa>
        <a-select v-model:value='form.carType' placeholder='请选择车辆类型'>
          <a-select-option :value='1'>轿车</a-select-option>
          <a-select-option :value='2'>货车</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label='车辆颜色:' name='carColor'>
        <a-input v-model:value='form.carColor' placeholder='请输入车辆颜色' allow-clear autocomplete='off' />
      </a-form-item>

      <a-form-item label='车辆价格:' name='carPrice'>
        <a-input-number v-model:value='form.carPrice' placeholder='请输入车辆价格' :min='0' class='ele-fluid' />
      </a-form-item>

      <a-form-item label='车辆制造商:' name='manufacturer'>
        <a-input v-model:value='form.manufacturer' placeholder='请输入车辆制造商' allow-clear autocomplete='off' />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { CarApi } from '@/api/car/CarApi';
import { message } from 'ant-design-vue';

export default {
  name: 'CarEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        carName: [{ required: true, message: '请输入车辆名称', type: 'string', trigger: 'blur' }],
        carType: [{ required: true, message: '请选择车辆类型', type: 'number', trigger: 'blur' }],
        carColor: [{ required: true, message: '请输入车辆颜色', type: 'string', trigger: 'blur' }]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /**
     * 保存和编辑
     *
     * @author fengshuonan
     * @date 2021/4/8 13:33
     */
    async save() {
      console.log(this.form);
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      console.log('执行操作,true为更新，false为新增：', this.isUpdate);

      // 执行编辑或修改
      if (this.isUpdate) {
        result = CarApi.edit(this.form);
      } else {
        result = CarApi.add(this.form);
      }
      result
        .then(result => {

          // 提示添加成功
          message.success(result.message);

          // 移除加载框
          this.loading = false;

          // 如果是新增，则form表单置空
          if (!this.isUpdate) {
            this.form = {};
          }

          // 关闭弹框，通过控制visible的值，传递给父组件
          this.updateVisible(false);

          // 触发父组件done事件
          this.$emit('done');
        })
        .catch(() => {
          this.loading = false;
        });
    },

    /**
     * 更新编辑界面的弹框是否显示
     *
     * @param value true-显示，false-隐藏
     * @author fengshuonan
     * @date 2021/4/7 11:00
     */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
};
</script>
