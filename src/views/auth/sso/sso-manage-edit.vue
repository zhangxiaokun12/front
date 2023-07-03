<template>
  <a-modal
    :width="1440"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '编辑应用' : '新建应用'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
    :maskClosable="false"
  >
    <a-form
      layout="horizontal"
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 7 }, sm: { span: 24 } }"
      :wrapper-col="{ md: { span: 17 }, sm: { span: 24 } }"
    >
      <a-row :gutter="16">
        <a-col :md="11" :sm="24" :xs="24">
          <a-form-item label="应用名称:" name="clientName">
            <a-input v-model:value="form.clientName" placeholder="请输入应用名称，例如：门户平台" allow-clear autocomplete="off" />
          </a-form-item>
          <a-form-item label="接入配置:" name="clientConfig">
            <a-input
              v-model:value="form.clientConfig"
              placeholder="请填写接入网站的域名，例如：https://www.baidu.com"
              allow-clear
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item label="应用Logo:" name="clientLogoFileId">
            <a-upload
              name="file"
              :multiple="false"
              list-type="picture-card"
              :action="fileUploadUrl"
              :headers="headers"
              v-model:file-list="tempFileList"
              :before-upload="beforeUpload"
              @change="handleFileChange"
              @preview="handlePreview"
            >
              <div v-if="tempFileList.length === 0">
                <div class="ant-upload-text">点击上传</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-form-item>
          <a-form-item label="是否统一退出" name="ssoConsistentLogoutFlag">
            <a-switch checkedValue="Y" un-checked-value="N" v-model:checked="form.ssoConsistentLogoutFlag" />
          </a-form-item>
          <a-form-item label="申请人:" name="clientApplicant">
            <a-input v-model:value="form.clientApplicant" placeholder="请填写申请人姓名" allow-clear autocomplete="off" />
          </a-form-item>
          <a-form-item label="应用类型" name="clientType">
            <a-select v-model:value="form.clientType" placeholder="请选择应用类型" allow-clear>
              <a-select-option :value="1">PC端</a-select-option>
              <a-select-option :value="2">APP手机</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="应用有效期:" name="clientExpireTime">
            <a-date-picker
              style="width: 100%"
              v-model:value="form.clientExpireTime"
              :format="dateFormatPattern"
              :show-time="{ format: 'HH:mm' }"
              :valueFormat="dateFormatPattern"
              placeholder="请选择过期时间"
            />
          </a-form-item>
          <a-form-item label="应用描述">
            <a-textarea v-model:value="form.clientDescription" placeholder="请输入备注" :rows="3" />
          </a-form-item>
        </a-col>
        <a-col :md="11" :sm="24" :xs="24">
          <a-form-item label="单点认证方式" name="authType">
            <a-select v-model:value="form.authType" placeholder="请选择单点认证方式" allow-clear>
              <a-select-option :value="1">Token</a-select-option>
              <a-select-option :value="2">OAuth2(待对接)</a-select-option>
              <a-select-option :value="3">CAS(待对接)</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="接入地址:" name="ssoCallbackUrl">
            <a-input
              v-model:value="form.ssoCallbackUrl"
              placeholder="请输入单点登录回调地址，例如：https://baidu.com/callback"
              allow-clear
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item label="退出地址:" name="ssoLogoutUrl">
            <a-input
              v-model:value="form.ssoLogoutUrl"
              placeholder="请输入单点退出回调地址，例如：https://baidu.com/sso_logout"
              allow-clear
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item label="Token秘钥:" name="caTokenSecret">
            <div style="width: 100%">
              <a-input
                v-model:value="form.caTokenSecret"
                placeholder="生成针对Token的加密和解密秘钥，基于AES"
                allow-clear
                autocomplete="off"
                style="width: 80%"
              />
              <a-button type="primary" style="width: 20%" @click="createTokenSecret">生成</a-button>
            </div>
          </a-form-item>
          <a-form-item label="数据秘钥:" name="userDataSecret">
            <div style="width: 100%">
              <a-input
                v-model:value="form.userDataSecret"
                placeholder="请生成针对数据传输的加密和解密秘钥，基于AES"
                allow-clear
                autocomplete="off"
                style="width: 80%"
              />
              <a-button type="primary" style="width: 20%" @click="createDataSecret">生成</a-button>
            </div>
          </a-form-item>
          <a-form-item label="登录地址类型" name="ssoLoginUrlType">
            <a-select v-model:value="form.ssoLoginUrlType" placeholder="请选择登录地址类型" allow-clear>
              <a-select-option :value="1">应用自定义登录界面</a-select-option>
              <a-select-option :value="2">使用CA服务统一登录界面</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="自定义登录地址:" name="ssoLoginUrl">
            <a-input v-model:value="form.ssoLoginUrl" placeholder="应用登录的地址，针对应用自定义登录界面" allow-clear autocomplete="off" />
          </a-form-item>
          <a-form-item label="token过期时间:" name="tokenExpireSeconds">
            <a-input-number
              v-model:value="form.tokenExpireSeconds"
              placeholder="sso单点会话过期时间，单位是秒"
              allow-clear
              autocomplete="off"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="排序:" name="clientSort">
            <a-input-number v-model:value="form.clientSort" placeholder="排序" allow-clear autocomplete="off" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { SsoClientApi } from '@/api/auth/SsoClientApi';
import { FileApi, FileUploadUrl as fileUploadUrlPrefix } from '@/api/system/operation/FileApi';
import { message } from 'ant-design-vue';
import { getToken } from '@/utils/token-util';
import { uuid } from 'ele-admin-pro';
import { API_BASE_PREFIX } from '@/config/setting';

export default {
  name: 'SsoManageEdit',
  emits: ['done'],
  data() {
    return {
      // 表单数据
      form: {},
      // 是否显示弹框
      visible: false,
      // 表单验证规则
      rules: {
        clientName: [{ required: true, message: '请输入应用名称', type: 'string', trigger: 'blur' }],
        clientConfig: [{ required: true, message: '请输入接入配置域名信息，例如：https://www.baidu.com', type: 'string', trigger: 'blur' }],
        ssoConsistentLogoutFlag: [{ required: true, message: '请选择是否统一退出', type: 'string', trigger: 'blur' }],
        clientType: [{ required: true, message: '请选择应用类型', type: 'number', trigger: 'blur' }],
        authType: [{ required: true, message: '请选择认证方式', type: 'number', trigger: 'blur' }],
        ssoCallbackUrl: [{ required: true, message: '请输入接入地址', type: 'string', trigger: 'blur' }],
        ssoLogoutUrl: [{ required: true, message: '请输入单点退出回调地址', type: 'string', trigger: 'blur' }],
        caTokenSecret: [{ required: true, message: '请点击生成按钮，生成一个随机秘钥', type: 'string', trigger: 'blur' }],
        userDataSecret: [{ required: true, message: '请点击生成按钮，生成一个随机秘钥', type: 'string', trigger: 'blur' }],
        ssoLoginUrlType: [{ required: true, message: '请选择登录地址类型', type: 'number', trigger: 'blur' }],
        tokenExpireSeconds: [{ required: true, message: '请输入SSO单点会话过期时间', type: 'number', trigger: 'blur' }],
        ssoLoginUrl: null
      },
      // 提交状态
      loading: false,
      // 是否是修改界面
      isUpdate: false,
      // 上传文件的url
      fileUploadUrl: `${API_BASE_PREFIX}${fileUploadUrlPrefix}?secretFlag=N`,
      // 上传文件时候要带header
      headers: {
        Authorization: getToken()
      },
      // 临时存放文件列表（用来限制上传数量）
      tempFileList: [],
      // 查看图片的弹框
      previewVisible: false,
      // 预览图片的地址
      previewImage: null,
      // 时间格式化表达式
      dateFormatPattern: 'YYYY-MM-DD HH:mm'
    };
  },
  watch: {
    'form.ssoLoginUrlType'(newVal) {
      if (newVal === 1) {
        this.rules.ssoLoginUrl = [{ required: true, message: '请输入单点登录地址', type: 'string', trigger: 'blur' }];
      } else {
        this.rules.ssoLoginUrl = null;
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      }
    }
  },
  methods: {
    /**
     * 打开新建或编辑单点应用的窗口
     *
     * @param isUpdate 是否是编辑界面
     * @param data 从上个界面传递过来的数据
     * @author fengshuonan
     * @date 2022/3/28 10:46
     */
    async openDialog(isUpdate, data) {
      this.visible = true;
      this.isUpdate = isUpdate;
      this.tempFileList = [];

      // 修改界面，则对表单赋值
      if (isUpdate && data) {
        this.form = data;
        // 如果有图片信息，则加载图片
        if (this.form.clientLogoFileId) {
          let antdVInfo = await FileApi.getAntdVInfo({ fileId: this.form.clientLogoFileId });
          this.tempFileList.push(antdVInfo);
        }
      }

      // 新增界面，初始化内容
      if (!isUpdate) {
        // 设置表单默认值
        this.form = {
          ssoConsistentLogoutFlag: 'N'
        };
        this.createTokenSecret();
        this.createDataSecret();
      }

      // 清空表单校验逻辑
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    },

    /**
     * 提交操作
     *
     * @author fengshuonan
     * @date 2022/3/28 10:26
     */
    async save() {
      // 校验表单
      await this.$refs.form.validate();

      // 修改加载框为正在加载
      this.loading = true;

      let result = null;

      // 执行编辑或修改
      if (this.isUpdate) {
        result = SsoClientApi.edit(this.form);
      } else {
        result = SsoClientApi.add(this.form);
      }
      result
        .then(result => {
          // 移除加载框
          this.loading = false;

          // 提示添加成功
          message.success(result.message);

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
     * @author fengshuonan
     * @date 2022/3/28 10:26
     */
    updateVisible(value) {
      this.visible = value;
    },

    /**
     * 上传文件改变时的状态
     *
     * @param info 组件回调原有参数
     * @author fengshuonan
     * @date 2022/3/28 9:35
     */
    handleFileChange(info) {
      if (info.file.status === 'done') {
        // 设置临时fileList的值
        this.tempFileList = [info.file];
        // 将文件属性名和文件编码存入数组中
        message.success(`${info.file.name} 图片上传成功`);
        // 设置表单对应的文件属性的值
        this.form.clientLogoFileId = info.file.response.data.fileId;
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 图片上传失败`);
      }
    },

    /**
     * 创建Token秘钥
     *
     * @author fengshuonan
     * @date 2022/3/28 10:27
     */
    createTokenSecret() {
      this.form.caTokenSecret = uuid();
    },

    /**
     * 创建数据秘钥
     *
     * @author fengshuonan
     * @date 2022/3/28 10:27
     */
    createDataSecret() {
      this.form.userDataSecret = uuid();
    },

    /**
     * 上传图片前验证大小
     *
     * @author fengshuonan
     * @date 2022/3/28 13:56
     */
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('您只可以上传图片文件jpg或png，请检查文件格式');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('只能上传2M以内图片，请检查文件大小');
      }
      return isJpgOrPng && isLt2M;
    },

    /**
     * 取消预览图片
     *
     * @author fengshuonan
     * @date 2022/3/28 14:08
     */
    handleCancel() {
      this.previewVisible = false;
    },

    /**
     * 预览图片
     *
     * @author fengshuonan
     * @date 2022/3/28 14:10
     */
    async handlePreview(file) {
      const getBase64 = file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      };
      if (!file.url && !file.preview && !this.form.clientLogoFileId) {
        file.preview = await getBase64(file.originFileObj);
      }
      if (this.form.clientLogoFileId) {
        file.preview = file.thumbUrl;
      }
      this.previewVisible = true;
      this.previewImage = file.url || file.preview;
    }
  }
};
</script>
