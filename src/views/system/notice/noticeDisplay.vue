<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('system.notice.noticeTitle')">
            <el-input v-model.trim="postData.noticeTitle" clearable :placeholder="$t('system.notice.noticeTitle')" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.notice.triggerStatus')">
            <el-select v-model="postData.triggerStatus" clearable :placeholder="$t('system.notice.triggerStatus')" style="width: 150px">
              <el-option v-for="(item, index) in triggerStatusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('system.notice.noticeType')">
          <el-select v-model="postData.noticeType" clearable :placeholder="$t('system.notice.noticeType')" style="width: 200px">
            <el-option v-for="(item, index) in noticeTypeList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="resend()">{{$t('system.notice.resend')}}</el-button>
      <el-button type="primary" class="export" @click="outportData">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.notice.noticeTitle')" min-width="200" prop="noticeTitle" show-overflow-tooltip/>

      <el-table-column align="center" min-width="100" :label="$t('system.notice.triggerType')" prop="triggerType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.triggerType | triggerTypeSwitch(language) }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" :label="$t('system.notice.noticeType')" prop="noticeType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.noticeType | noticeTypeSwitch(language) }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="160" :label="$t('system.notice.triggerTime')" prop="triggerTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.triggerTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" :label="$t('system.notice.readStatus')" prop="readStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.readStatus === '0' ? $t('system.notice.unread') : $t('system.notice.read') }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" :label="$t('system.notice.triggerStatus')" prop="triggerStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.triggerStatus === '0' ? $t('system.notice.failed') : $t('system.notice.successful') }}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="100" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">
            {{$t('common.table.view')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('system.notice.notificationContent')" center width="500px">
      <el-form :model="entity" ref="ruleForm" label-width="150px" label-position="left" size="small" :rules="dictionaryDataRules">
        <el-form-item :label="$t('system.notice.noticeTitle')" prop="dictLabel">
          <el-input v-model="entity.noticeTitle" placeholder="$t('system.notice.noticeTitle')" class="form-dialog-width" disabled/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.noticeContent')" prop="dictLabel" disabled>
          <el-input :autosize="{ minRows: 4, maxRows: 10}" type="textarea" v-model="entity.noticeContent" placeholder="$t('system.notice.noticeContent')" class="form-dialog-width" disabled/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.sysNoticeAnnexList')">
          <div v-for="(item, index) in entity.sysNoticeAnnexList" :key="index">{{item.annexName}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog1">{{$t('common.tagsView.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  pagephNoticeRecording,
  exportBySysNoticeRecording,
  sysNoticeRecordingResend
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      selectList: [],
      listLoading: true,
      dialogVisible1: false,
      resendIds: '',
      entity: {
      },
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        triggerStatus: '',
        noticeType: '',
        noticeTitle: ''
      },
      noticeTypeList: [
        {
          labelZh: '站内通知',
          label: 'Site Notification',
          id: 0
        },
        {
          labelZh: 'APP通知',
          label: 'APP Notification',
          id: 1
        },
        // {
        //   labelZh: '短信通知',
        //   label: 'Note Notification',
        //   id: 2
        // },
        {
          labelZh: '邮件通知',
          label: 'Email Notification',
          id: 3
        }
      ],
      triggerStatusList: [
        {
          labelZh: '成功',
          label: 'Successful',
          id: 1
        },
        {
          labelZh: '失败',
          label: 'Failed',
          id: 0
        }
      ],
      list: [],
      departmentList: [],
      dictionaryDataRules: {
        dictName: [
          { required: true, message: '请填写字典名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      // this.entity.disposeUserStr = [];
    },
    // 搜索
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    resend() {
      if (!this.selectList.length) {
        return this.$message.warning(this.isZh ? '请选择数据' : 'Please select data!');
      }
      this.resendIds = this.selectList.map(e => {
        return e.id;
      }).join(",");
      let formData = new FormData();
      formData.append('ids', this.resendIds);
      sysNoticeRecordingResend(formData).then(res => {
        if (res.status === 200) {
          this.$message.success(this.language === 'zh' ? '发送成功' : 'Send success');
        }
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message);
      });
      // this.$confirm(this.$t('common.tip.isDeleteMsg'), 'Tips', {
      // confirmButtonClass: 'el-button-confirmClass',
      //   cancelButtonClass: 'el-button-cancelClass',
      //   confirmButtonText: this.$t('common.buttonText.confirm'),
      //   cancelButtonText: this.$t('common.buttonText.cancel'),
      //   type: 'warning',
      //   center: true
      // }).then(() => {
      //   this.deleteIdsForm = this.selectList.map(e => {
      //     return e.id;
      //   }).join(",");
      //   let formData = new FormData();
      //   formData.append('ids', this.deleteIdsForm);
      //   sysNoticeRecordingResend(formData).then(res => {
      //     if (res.status === 200) {
      //       this.$message.success('Delete Success');
      //     }
      //     this.getDataList();
      //   }).catch(err => {
      //     this.$message.error(err.message);
      //   });
      // }).catch(() => {
      // });
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      pagephNoticeRecording(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    openDetail(row) {
      this.entity = deepClone(row);
      if (this.entity.noticeType) {
        this.entity.noticeTypeStr = this.entity.noticeType.split(",");
      }
      if (this.entity.templateType === 2) {
        this.showNode = true;
      } else {
        this.showNode = false;
      }
      this.dialogVisible1 = true;
    },
    closOPenDialog1() {
      this.dialogVisible1 = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportBySysNoticeRecording(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'noticeDisplayList.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status]
    },
    noticeTypeSwitch(val, language) {
      switch (val) {
        case '0':
          return language === 'zh' ? '站内通知' : 'Site Notification';
        case '1':
          return language === 'zh' ? 'App通知' : 'APP Notification';
        case '2':
          return language === 'zh' ? '短信通知' : 'Note Notification';
        case '3':
          return language === 'zh' ? '邮件通知' : 'Email Notification';
        default:
          return language === 'zh' ? '未知' : 'Unknown';
      }
    },
    triggerTypeSwitch(val, language) {
      switch (val) {
        case '0':
          return language === 'zh' ? '流程触发' : 'Process Trigger';
        case '1':
          return language === 'zh' ? '定时任务触发' : 'Timed task trigger';
        case '2':
          return language === 'zh' ? '其他' : 'Other';
        default:
          return language === 'zh' ? '未知' : 'Unknown';
      }
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.roleManagement {
  .search-box {
    margin-bottom: 15px;
    border-bottom: 1px solid $border-light-color;
  }

  .topBtns {
    margin-bottom: 10px;
    text-align: right;

    button {
      margin: 0 10px;
    }
  }

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
