<template>
  <a-modal
    wrapClassName="file-select"
    :width="1200"
    :maskClosable="false"
    :visible="showFileSelectModal"
    title="文件选择"
    @update:visible="updateVisible"
    @ok="submit"
  >
    <div class="file-select-card">
      <a-card :bordered="false">
        <a-form layout="inline" :model="where">
          <a-row>
            <a-form-item label="存储位置:">
              <a-select v-model:value="where.fileLocation" style="width: 205px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">阿里云</a-select-option>
                <a-select-option value="2">腾讯云</a-select-option>
                <a-select-option value="3">minio</a-select-option>
                <a-select-option value="4">本地</a-select-option>
                <a-select-option value="5">数据库</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="文件名称:">
              <a-input v-model:value.trim="where.fileOriginName" allow-clear />
            </a-form-item>
            <a-form-item class="ele-text-center">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
        <ele-pro-table
          ref="table"
          row-key="fileId"
          v-model:selection="selection"
          :row-selection="{ columnWidth: 48 }"
          :datasource="datasource"
          :columns="columns"
          :where="where"
          :scroll="{ x: 'max-content' }"
        >
          <template #bodyCell="{ column, record }">
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
          </template>
        </ele-pro-table>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import { FileApi } from '@/api/system/operation/FileApi';

export default {
  name: 'FileSelect',
  components: {},
  emits: ['done'],
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
        }
      ],
      // 表格搜索条件
      where: {},
      // 是否显示文件选择弹框
      showFileSelectModal: false,
      // 选择的行
      selection: []
    };
  },
  watch: {
    showFileSelectModal() {
      if (this.showFileSelectModal) {
        this.selection = [];
        this.where = {};
      }
    }
  },
  methods: {
    /**
     * 重新加载文件列表数据
     *
     * @author fengshuonan
     * @date 2022/1/3 16:01
     */
    reload() {
      this.$refs.table.reload({ page: 1 });
    },

    /**
     * 更新显示隐藏状态
     *
     * @author fengshuonan
     * @date 2022/1/3 15:59
     */
    updateVisible(visible) {
      this.showFileSelectModal = visible;
    },

    /**
     * 打开文件选择弹框
     *
     * @author fengshuonan
     * @date 2022/1/3 16:00
     */
    openModal() {
      this.showFileSelectModal = true;
    },

    /**
     * 提交文件选择
     *
     * @author fengshuonan
     * @date 2022/1/3 16:37
     */
    submit() {
      // 筛选出所有文件id
      let fileIds = [];
      this.selection.forEach(value => {
        fileIds.push(value.fileId);
      });

      this.$emit('done', this.selection, fileIds);
      this.showFileSelectModal = false;
    },

    /**
     * 获取表格数据
     *
     * @author fengshuonan
     * @date 2022/5/8 15:18
     */
    datasource({ page, limit, where, orders }) {
      return FileApi.findSelectPageList({ ...where, ...orders, pageNo: page, pageSize: limit });
    }
  }
};
</script>
<style lang="less">
.file-select {
  .ant-modal-body {
    padding: 10px;
  }
}
</style>
<style lang="css" scoped>
.file-select-card >>> .ant-card-body {
  padding-bottom: 0;
  padding-top: 15px;
}
</style>
