<template>
  <div class="ele-body">
    <!-- 搜索表单 -->
    <div class="block-interval">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="存储位置:">
              <a-select v-model:value="where.fileLocation" style="width: 205px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option :value="1">阿里云</a-select-option>
                <a-select-option :value="2">腾讯云</a-select-option>
                <a-select-option :value="3">minio</a-select-option>
                <a-select-option :value="4">本地</a-select-option>
                <a-select-option :value="5">数据库</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="文件名称:">
              <a-input v-model:value.trim="where.fileOriginName" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </a-card>
    </div>

    <!-- 表格 -->
    <div>
      <a-card :bordered="false" class="table-height">
        <ele-pro-table
          ref="table"
          row-key="fileId"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          :scroll="{ x: 'max-content' }"
        >
          <!-- table上边工具栏 -->
          <template #toolbar>
            <a-space>
              <a-upload
                name="file"
                :multiple="true"
                :action="FileUploadUrl"
                :headers="headers"
                @change="afterUpload"
                :showUploadList="false"
              >
                <a-button type="primary">
                  <template #icon>
                    <CloudUploadOutlined />
                  </template>
                  <span>上传文件</span>
                </a-button>
              </a-upload>
              <a-upload
                name="file"
                :multiple="true"
                :action="FileUploadUrlToDb"
                :headers="headers"
                :before-upload="beforeUpload"
                @change="afterUpload"
                :showUploadList="false"
              >
                <a-button>
                  <template #icon>
                    <CloudUploadOutlined />
                  </template>
                  <span>上传到数据库（1MB限制）</span>
                </a-button>
              </a-upload>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex == 'fileOriginName'">
              <a @click="detail(record)">{{ record.fileOriginName }}</a>
            </template>

            <!-- table列表状态栏 -->
            <!-- table存储位置列 -->
            <template v-if="column.key === 'fileLocation'">
              <a-tag color="orange" v-if="record.fileLocation === 1">阿里云</a-tag>
              <a-tag color="blue" v-if="record.fileLocation === 2">腾讯云</a-tag>
              <a-tag color="red" v-if="record.fileLocation === 3">minio</a-tag>
              <a-tag color="green" v-if="record.fileLocation === 4">本地</a-tag>
              <a-tag color="cyan" v-if="record.fileLocation === 5">数据库</a-tag>
            </template>

            <!-- 图片预览 -->
            <template v-else-if="column.key === 'filePreview'">
              <a-image :width="30" :src="record.fileUrl" />
            </template>

            <!-- table操作栏按钮 -->
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a @click="download(record)">下载</a>
                <a-divider type="vertical" />
                <a @click="detail(record)">详情</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除此文件吗？" @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template></ele-pro-table
        >
      </a-card>
    </div>

    <!-- 编辑弹窗 -->
    <file-detail v-model:visible="showEdit" :data="current" />
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { FileApi, FileUploadUrl } from '@/api/system/operation/FileApi';
import FileDetail from '@/views/system/operation/file/file-detail.vue';
import { getToken } from '@/utils/token-util';
import { API_BASE_PREFIX } from '@/config/setting';

export default {
  name: 'FileManager',
  components: {
    FileDetail,
    CloudUploadOutlined
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 48,
          align: 'center',
          fixed: 'left',
          hideInSetting: true,
          customRender: ({ index }) => this.$refs.table.tableIndex + index
        },
        {
          title: '文件id',
          dataIndex: 'fileId'
        },
        {
          title: '文件名称',
          dataIndex: 'fileOriginName'
        },
        {
          title: '图片预览',
          key: 'filePreview',
          dataIndex: 'fileUrl'
        },
        {
          title: '存储位置',
          key: 'fileLocation',
          dataIndex: 'fileLocation'
        },
        {
          title: '是否机密',
          dataIndex: 'secretFlag',
          customRender: function ({ text }) {
            if ('Y' === text) {
              return '是';
            } else {
              return '否';
            }
          }
        },
        {
          title: '文件大小',
          dataIndex: 'fileSizeInfo'
        },
        {
          title: '文件后缀',
          dataIndex: 'fileSuffix'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '创建人',
          dataIndex: 'createUserName'
        },
        {
          title: '操作',
          key: 'action',
          width: 280,
          align: 'center'
        }
      ],
      // 表格搜索条件
      where: {},
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 上传文件的url
      FileUploadUrl: `${API_BASE_PREFIX}${FileUploadUrl}?secretFlag=N`,
      // 上传文件的url（上传到数据库）
      FileUploadUrlToDb: `${API_BASE_PREFIX}${FileUploadUrl}?secretFlag=N&fileLocation=5`,
      // 上传文件时候要带header
      headers: {
        Authorization: getToken()
      }
    };
  },
  methods: {
    /**
     * 搜索按钮
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reload() {
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 重置搜索
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    reset() {
      this.where.fileLocation = '';
      this.where.fileOriginName = '';
      this.reload();
    },

    /**
     * 删除单个
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    async remove(row) {
      const result = await FileApi.delete({ fileCode: row.fileCode });
      message.success(result.message);
      this.reload();
    },

    /**
     * 下载文件
     *
     * @author fengshuonan
     * @date 2021/4/12 22:11
     */
    download(row) {
      FileApi.download({
        fileId: row.fileId,
        secretFlag: row.secretFlag,
        token: getToken()
      });
    },

    /**
     * 打开详情界面
     *
     * @author fengshuonan
     * @date 2021/4/12 22:29
     */
    detail(row) {
      this.current = row;
      this.showEdit = true;
    },

    /**
     * 控制上传到数据库的图片不能超过1M
     *
     * @author fengshuonan
     * @date 2021/4/12 22:29
     */
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 <= 1;
      if (!isLt1M) {
        message.error('上传图片不能超过1MB');
      }
      return isLt1M;
    },

    /**
     * 上传成功的回调
     *
     * @author fengshuonan
     * @date 2021/4/2 17:03
     */
    afterUpload({ file }) {
      if (file.response) {
        message.success('上传成功');
        this.reload();
      }
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return FileApi.findPage({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
