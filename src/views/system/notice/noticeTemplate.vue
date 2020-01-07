<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <el-form-item :label="$t('system.notice.templateName')">
          <el-input v-model.trim="postData.templateName" clearable :placeholder="$t('system.notice.templateName')" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.templateType')">
          <el-select v-model="postData.templateType" clearable :placeholder="$t('system.notice.templateType')" style="width: 200px">
            <el-option v-for="(item, index) in noticeTypeList" :label="isZh?item.label:item.labelEn" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod">{{$t('common.delete')}}</el-button>
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
      <el-table-column :label="$t('system.notice.templateName')" prop="templateName" show-overflow-tooltip/>

      <el-table-column :label="$t('system.notice.templateCode')" prop="templateCode" show-overflow-tooltip/>

      <el-table-column :label="$t('system.notice.templateType')" prop="templateType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.templateType | noticeTypeSwitch(isZh) }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.updateBy')" prop="updateUserName">
      </el-table-column>

      <el-table-column align="center" width="160" :label="$t('system.notice.updateTime')" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('system.notice.templateStatus')" prop="dictStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.templateStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.templateStatus
            === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">
            {{$t('common.table.view')}}
          </el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button v-if="row.templateStatus === 1" type="info" size="mini" @click="enableNoticeTemplateMethod(row.id)">
            {{$t('common.table.disable')}}
          </el-button>
          <el-button v-if="row.templateStatus === 0" type="danger" size="mini" @click="enableNoticeTemplateMethod(row.id)">
            {{$t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.notice.addNotificationTemplate'):$t('system.notice.editNotificationTemplate')" center width="700px" @close="clearData">
      <el-form :model="entity" ref="ruleForm" v-if="dialogVisible" label-width="150px" label-position="left" size="small" :rules="dictionaryDataRules">
        <el-form-item :label="$t('system.notice.templateName')" prop="templateName">
          <el-input v-model="entity.templateName" clearable :placeholder="$t('system.notice.templateName')" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.templateCode')" prop="templateCode">
          <el-input v-model="entity.templateCode" clearable :placeholder="$t('system.notice.templateCode')" :disabled="isShowCode" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.templateType')" prop="templateType">
          <el-select v-model="entity.templateType" clearable :placeholder="$t('system.notice.templateType')" style="width: 300px" @change="changeType">
            <el-option v-for="(item, index) in noticeTypeList" :label="isZh?item.label:item.labelEn" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item v-show="showNode" :label="$t('system.notice.nodeBId')" prop="nodeBId">
              <el-select v-model="entity.nodeBId" clearable :placeholder="$t('system.notice.nodeBId')" style="width: 100%">
                <el-option v-for="(item, index) in noticeNodeBidList" :label="isZh?item.nodeNameCh:item.nodeName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="showNode" :label="$t('system.notice.nodeWhen')" prop="nodeWhen">
              <el-select v-model="entity.nodeWhen" clearable :placeholder="$t('system.notice.nodeWhen')" style="width: 100%">
                <el-option :label="$t('system.notice.beforeTheNode')" :value="1"></el-option>
                <el-option :label="$t('system.notice.afterTheNode')" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.notice.noticeTypeStr')" prop="noticeTypeStr">
          <el-checkbox-group v-model="entity.noticeTypeStr" @change="getCheckBoxVal">
            <el-checkbox label="0">{{$t('system.notice.siteNotification')}}</el-checkbox>
            <el-checkbox label="1">{{$t('system.notice.appNotification')}}</el-checkbox>
            <!--<el-checkbox label="2">{{$t('system.notice.smsNotification')}}</el-checkbox>-->
            <el-checkbox label="3">{{$t('system.notice.emailNotification')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('system.notice.noticeTitle')" prop="noticeTitle">
          <el-input v-model="entity.noticeTitle" clearable class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.noticeContent')" prop="noticeContent">
          <el-input type="textarea" v-model="entity.noticeContent" :autosize="{ minRows: 4, maxRows: 6}" clearable style="width: 100%"/>
        </el-form-item>
        <!--        <el-form-item label="通知附件">-->
        <!--          <el-input type="textarea" v-model="entity.dictRemark" clearable placeholder="请输入字典备注" class="form-dialog-width"/>-->
        <!--        </el-form-item>-->
        <el-form-item :label="$t('system.notice.noticeContent')" style="width: 500px">
          <my-upload
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="entity.sysNoticeAnnexList">
          </my-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="closeOPenDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('system.notice.notificationTemplateDetails')" center width="700px">
      <el-form :model="entity" ref="ruleForm" label-width="150px" label-position="left" size="small">
        <el-form-item :label="$t('system.notice.templateName')" prop="templateName">
          <el-input v-model="entity.templateName" :placeholder="$t('system.notice.templateName')" disabled class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.templateCode')" prop="templateCode">
          <el-input v-model="entity.templateCode" placeholder="$t('system.notice.templateCode')" disabled class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.templateType')" prop="templateType">
          <el-select v-model="entity.templateType" clearable :placeholder="$t('system.notice.templateType')" style="width: 300px" disabled>
            <el-option v-for="(item, index) in noticeTypeList" :label="isZh?item.label:item.labelEn" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-show="showNode" :label="$t('system.notice.nodeBId')" prop="nodeBId">
              <el-select v-model="entity.nodeBId" clearable :placeholder="$t('system.notice.nodeBId')" disabled style="width: 100%">
                <el-option v-for="(item, index) in noticeNodeBidList" :label="isZh?item.nodeNameCh:item.nodeName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="showNode" :label="$t('system.notice.nodeWhen')" prop="nodeWhen">
              <el-select v-model="entity.nodeWhen" clearable :placeholder="$t('system.notice.nodeWhen')" disabled style="width: 100%">
                <el-option :label="$t('system.notice.beforeTheNode')" :value="1"></el-option>
                <el-option :label="$t('system.notice.afterTheNode')" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.notice.noticeTypeStr')" prop="noticeTypeStr" disabled>
          <el-checkbox-group v-model="entity.noticeTypeStr" @change="getCheckBoxVal">
            <el-checkbox label="0">{{$t('system.notice.siteNotification')}}</el-checkbox>
            <el-checkbox label="1">{{$t('system.notice.appNotification')}}</el-checkbox>
            <!--<el-checkbox label="2">{{$t('system.notice.smsNotification')}}</el-checkbox>-->
            <el-checkbox label="3">{{$t('system.notice.emailNotification')}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('system.notice.noticeTitle')" prop="dictLabel">
          <el-input v-model="entity.noticeTitle" :placeholder="$t('system.notice.noticeTitle')" class="form-dialog-width" disabled/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.noticeContent')" prop="dictLabel" disabled>
          <el-input v-model="entity.noticeContent" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :placeholder="$t('system.notice.noticeContent')" disabled style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('system.notice.sysNoticeAnnexList')">
          <div v-for="(item, index) in entity.sysNoticeAnnexList" :key="index">
            {{item.annexName}}
            <el-button type="primary" size="mini" style="margin-left: 20px" @click="downLoadFile(item.annexPath, item.annexName)">{{$t('common.download')}}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeOPenDialog1">{{$t('common.tagsView.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import MyUpload from '@/components/MyUpload'
import {
  pagephNoticeTemplate,
  selectControlTowerByTypeList,
  saveNoticeTemplate,
  updateNoticeTemplate,
  deleteBatchNoticeTemplate,
  enableNoticeTemplate,
  exportByNoticeTemplate
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination,
    MyUpload
  },
  mixins: [treeMenu],
  data() {
    return {
      listLoading: true,
      isShowCode: false,
      addLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      showNode: false,
      entity: {
        bid: "",
        id: "",
        nodeBId: "",
        nodeWhen: "",
        noticeContent: "",
        noticeTitle: "",
        noticeType: "",
        noticeTypeStr: [],
        templateCode: "",
        templateName: "",
        templateStatus: 0,
        templateType: "",
        sysNoticeAnnexList: []
      },
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      noticeNodeBidList: [],
      noticeTypeList: [
        {
          label: '系统模板',
          labelEn: 'System',
          id: 0
        },
        {
          label: '定制',
          labelEn: 'Customize',
          id: 1
        },
        {
          label: '节点',
          labelEn: 'Trigger Point',
          id: 2
        }
      ],
      list: [],
      departmentList: [],
      dictionaryDataRules: {
        templateName: [
          { required: true, message: this.$t('system.notice.inputTemplateName'), trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: this.$t('system.notice.inputTemplateCode'), trigger: 'blur' }
        ],
        templateType: [
          { required: true, message: this.$t('system.notice.inputTemplateType'), trigger: 'change' }
        ],
        noticeTypeStr: [
          { required: true, message: this.$t('system.notice.inputNodeBId'), trigger: 'change' }
        ],
        noticeContent: [
          { required: true, message: this.$t('system.notice.inputContent'), trigger: 'blur' }
        ],
        noticeTitle: [
          { required: true, message: this.$t('system.notice.inputTitle'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
    this.selectControlTowerByTypeListMethod();
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  methods: {
    setOption() {
      this.dictionaryDataRules = {
        templateName: [
          { required: true, message: this.$t('system.notice.inputTemplateName'), trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: this.$t('system.notice.inputTemplateCode'), trigger: 'blur' }
        ],
        templateType: [
          { required: true, message: this.$t('system.notice.inputTemplateType'), trigger: 'change' }
        ],
        noticeTypeStr: [
          { required: true, message: this.$t('system.notice.inputNodeBId'), trigger: 'change' }
        ],
        noticeContent: [
          { required: true, message: this.$t('system.notice.inputContent'), trigger: 'blur' }
        ],
        noticeTitle: [
          { required: true, message: this.$t('system.notice.inputTitle'), trigger: 'blur' }
        ]
      }
    },
    clearData() {
      // this.entity.disposeUserStr = [];
    },
    // 搜索
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      pagephNoticeTemplate(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.isShowCode = true
        this.entity = Object.assign(this.entity, row);
        if (this.entity.noticeType) {
          this.entity.noticeTypeStr = this.entity.noticeType.split(",");
        }
        if (this.entity.templateType === 2) {
          this.showNode = true;
        } else {
          this.showNode = false;
        }
        this.entity.sysNoticeAnnexList.forEach(e => {
          e.url = e.annexPath;
          e.name = e.annexName
        })
      } else {
        this.isShowCode = false
        this.showNode = false;
        this.entity = {
          bid: "",
          id: "",
          nodeBId: "",
          nodeWhen: "",
          noticeContent: "",
          noticeTitle: "",
          noticeType: "",
          noticeTypeStr: [],
          templateCode: "",
          templateName: "",
          templateStatus: 0,
          templateType: "",
          sysNoticeAnnexList: []
        };
        // this.entity.dictStatus = 1;
      }
      this.dialogVisible = true;
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
    closeOPenDialog() {
      this.dialogVisible = false;
    },
    closeOPenDialog1() {
      this.dialogVisible1 = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    downLoadFile(url, name) {
      const form = document.createElement('a');
      form.setAttribute("download", name);
      form.setAttribute("href", this.uploadFileHttp + url);
      document.body.appendChild(form);
      form.click();
      document.body.removeChild(form)
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.entity.id) {
            updateNoticeTemplate(this.entity).then(res => {
              this.$message.success(this.$t("system.userManage.handle"));
              // this.$message.success('更新成功');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closeOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            saveNoticeTemplate(this.entity).then(res => {
              this.$message.success(this.$t("system.userManage.handle"));
              // this.$message.success('新增成功');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closeOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error(this.$t('system.userManage.check'));
          // this.$message.error("验证未通过");
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message.warning(this.isZh ? '请选择数据' : 'Please select data!');
      }
      this.$confirm(this.$t('common.tip.isDeleteMsg'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.id;
        }).join(",");
        let formData = new FormData();
        formData.append('ids', this.deleteIdsForm);
        deleteBatchNoticeTemplate(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('common.tip.deleteTip'));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    selectControlTowerByTypeListMethod() {
      // let obj = { nodeType: 1 };
      let obj = {};
      selectControlTowerByTypeList(obj).then(res => {
        this.noticeNodeBidList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    enableNoticeTemplateMethod(id) {
      let obj = { id: id };
      enableNoticeTemplate(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getCheckBoxVal(arr) {
      if (arr && arr.length) {
        this.entity.noticeType = arr.join(',')
      } else {
        this.entity.noticeType = ''
      }
    },
    changeType(arr) {
      if (arr === 2) {
        this.showNode = true;
      } else {
        this.entity.nodeBId = '';
        this.entity.nodeWhen = '';
        this.showNode = false;
      }
    },
    // 上传文件组件方法：handleRemove、handleSuccess
    handleRemove(file, fileList) {
      this.entity.sysNoticeAnnexList = fileList.map(e => {
        e.annexName = e.annexName || e.name;
        e.annexPath = e.annexPath || e.response.data.filePath;
        return { ...e }
      });
    },
    handleSuccess(res, file, fileList) {
      this.entity.sysNoticeAnnexList = fileList.map(e => {
        e.annexName = e.annexName || e.name;
        e.annexPath = e.annexPath || e.response.data.filePath;
        return { ...e }
      });
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportByNoticeTemplate(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'sysNoticeTemplateList.xls');
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
    noticeTypeSwitch(val, isZh) {
      switch (val) {
        case 0:
          return isZh ? '系统模版' : 'System';
        case 1:
          return isZh ? '定制模版' : 'Customize';
        case 2:
          return isZh ? '节点模版' : 'Trigger Point';
        default:
          return isZh ? '未知模版' : 'Error';
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
