<template>
  <div class="app-container noticeTack">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '115px'" inline size="small">
        <div>
          <el-form-item :label="$t('system.notice.taskName')">
            <el-input v-model.trim="postData.taskName" clearable :placeholder="$t('system.notice.taskName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.notice.customTime')">
            <el-date-picker
              v-model="customTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              :start-placeholder="$t('system.notice.runBeginTime')"
              :end-placeholder="$t('system.notice.runEndTime')"
              style="width: 250px"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
        <div>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteListByIds">{{$t('common.delete')}}</el-button>
      <el-button type="primary" class="export" @click="outportData">{{$t('common.export')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
      align="center"
      type="selection"
      width="55">
      </el-table-column>

      <el-table-column min-width="150" :label="$t('system.notice.taskName')" prop="taskName" show-overflow-tooltip >
        <template slot-scope="{row}">
          {{row.taskName || '无'}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" :label="$t('system.notice.runBeginTime')" prop="runBeginTime">
        <template slot-scope="scope">
          {{scope.row.runBeginTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" :label="$t('system.notice.runEndTime')" prop="runEndTime">
        <template slot-scope="scope">
          {{scope.row.runEndTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('system.notice.updateUserName')" prop="updateUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('system.notice.updateTime')" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('system.notice.customStatus')" prop="customStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.taskStatus === 0 ) ? 'danger' : 'primary'" size="mini">{{row.taskStatus | statusFmt(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.taskStatus === 2" @click="openEdit('edit', row)">{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" :title="$t('system.notice.ViewTask')" center class="menuDialog" width="1000px" @closed="clearData">
      <el-form ref="addDepartment" :model="taskData" label-width="130px" label-position="left" size="small">
        <el-form-item :label="$t('system.notice.taskName')" prop="taskName">
          <el-input v-model="taskData.taskName" readonly class="form-dialog-width" />
        </el-form-item>

        <el-form-item :label="$t('system.notice.selectTime')" prop="selectTime">
          <el-date-picker
            v-model="taskData.selectTime"
            readonly
            type="datetimerange"
            range-separator="~"
            :start-placeholder="$t('system.notice.runBeginTime')"
            :end-placeholder="$t('system.notice.runEndTime')"
            align="right">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('system.notice.timeInterval')" prop="timeInterval">
          <el-input v-model="taskData.timeInterval" readonly class="form-dialog-width" />
        </el-form-item>

        <el-form-item :label="$t('system.notice.templateBId')" prop="templateBId">
          <el-select v-model="taskData.templateBId" readonly class="form-dialog-width" disabled>
            <el-option v-for="(item, index) in templateList" :label="item.templateName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('system.notice.taskStatus')" prop="taskStatus">
          <el-select v-model="taskData.taskStatus" readonly class="form-dialog-width" disabled>
            <el-option v-for="(item, index) in statusList" :label="isZh?item.labelZh:item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('system.notice.acceptor')" style="border-top: 1px solid #ccc; padding-top: 10px">
<!--          <el-button type="primary" size="small" class="export" style="margin-bottom: 10px" @click="openUserDialog">选择接收方</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
        :data="sendList"
        border
        fit
        size="mini"
        max-height="900"
        :header-cell-style="{background: '#a7bfee'}">
        <!--            <el-table-column-->
        <!--              align="center"-->
        <!--              type="index"-->
        <!--              label="序号"-->
        <!--              width="55">-->
        <!--            </el-table-column>-->

        <el-table-column align="center" :label="$t('system.notice.companyName')" prop="companyName" />

        <el-table-column align="center" :label="$t('system.notice.userAccount')" prop="userAccount" />

        <el-table-column align="center" min-width="100" :label="$t('system.notice.userName')" prop="userName"/>

        <el-table-column align="center" min-width="100" :label="$t('system.notice.userEmail')" prop="userEmail"/>

        <el-table-column align="center" min-width="100" :label="$t('system.notice.userType')" prop="userType">
          <template slot-scope="scope">
            {{scope.row.userType === 1 ? $t('system.notice.customer') : $t('system.notice.supplier')}}
          </template>
        </el-table-column>

        <!--            <el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">-->
        <!--              <template slot-scope="scope">-->
        <!--                <el-button type="danger" size="mini" class="export" @click="deleteSend(scope.$index)">删除</el-button>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
      </el-table>
      <Pagination :total="sendListData.total" :page.sync="sendListData.pageNum" :limit.sync="sendListData.pageSize" @pagination="getSendListData(taskData.bid)" ></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" :title="dialogType==='add'? $t('system.notice.AddTask'):$t('system.notice.EditTask')" center :close-on-click-modal="false" class="menuDialog" width="1000px" @closed="clearData">
      <el-form ref="addDepartment" :model="taskData" v-if="editVisible" label-width="140px" label-position="left" size="small" :rules="taskDataRules">
        <el-form-item :label="$t('system.notice.taskName')" prop="taskName">
          <el-input v-model="taskData.taskName" clearable maxlength="20" :placeholder="$t('system.notice.taskName')" class="form-dialog-width" />
        </el-form-item>

        <el-form-item :label="$t('system.notice.selectTime')" prop="selectTime">
          <el-date-picker
            v-model="taskData.selectTime"
            type="datetimerange"
            range-separator="~"
            :start-placeholder="$t('system.notice.runBeginTime')"
            :end-placeholder="$t('system.notice.runEndTime')"
            @change="getSelectTime"
            align="right">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('system.notice.timeInterval')" prop="timeInterval">
          <el-input v-model.number="taskData.timeInterval" clearable placeholder="time interval" class="form-dialog-width" />
        </el-form-item>

        <el-form-item :label="$t('system.notice.templateBId')" prop="templateBId">
          <el-select v-model="taskData.templateBId" :placeholder="$t('system.notice.templateBId')" class="form-dialog-width">
            <el-option v-for="(item, index) in templateList" :label="item.templateName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item label="状态" prop="taskStatus">-->
<!--          <el-select v-model="taskData.taskStatus" clearable placeholder="请选择状态" class="form-dialog-width">-->
<!--            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <div style="border-top: 1px solid #ccc; padding-top: 10px">
          <el-button type="primary" size="small" class="export" style="margin-bottom: 10px" @click="openUserDialog">{{$t('system.notice.chooeesAcceptor')}}</el-button>
        </div>
      </el-form>
      <el-table
        :data="sendList"
        border
        fit
        size="mini"
        max-height="1000"
        :header-cell-style="{background: '#a7bfee'}">
        <!--            <el-table-column-->
        <!--              align="center"-->
        <!--              type="index"-->
        <!--              width="55">-->
        <!--            </el-table-column>-->

        <el-table-column align="center" :label="$t('system.notice.companyName')" prop="companyName" />

        <el-table-column align="center" :label="$t('system.notice.userAccount')" prop="userAccount" />

        <el-table-column align="center" min-width="100" :label="$t('system.notice.userName')" prop="userName"/>

        <el-table-column align="center" min-width="100" :label="$t('system.notice.userEmail')" prop="userEmail"/>

        <el-table-column align="center" min-width="100" :label="$t('system.notice.userType')" prop="userType">
          <template slot-scope="scope">
            {{scope.row.userType === 1 ? $t('system.notice.customer') : $t('system.notice.supplier')}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('common.table.actions')" width="90" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="deleteSend(scope.$index)">{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="editVisible1" :title="$t('system.notice.chooeesAcceptor')" center :close-on-click-modal="false" append-to-body width="1000px">
        <el-form :model="dialogSearchData" label-width="120px" label-position="left" size="small" inline>
          <el-form-item :label="$t('system.notice.userType2')">
            <el-select v-model="dialogSearchData.userType" :placeholder="$t('system.notice.userType2')" style="width: 240px">
              <el-option :label="$t('system.notice.customer')" :value="1"></el-option>
              <el-option :label="$t('system.notice.supplier')" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('system.notice.customerName')" v-if="dialogSearchData.userType === 1">
            <el-input v-model.trim="dialogSearchData.customerName" clearable :placeholder="$t('system.notice.customerName')" style="width: 240px" />
          </el-form-item>

          <el-form-item :label="$t('system.notice.customerCode')" v-if="dialogSearchData.userType === 1">
            <el-input v-model.trim="dialogSearchData.customerCode" clearable :placeholder="$t('system.notice.customerCode')" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('system.notice.customerEmailAddress')" v-if="dialogSearchData.userType === 1">
            <el-input v-model.trim="dialogSearchData.customerEmailAddress" clearable :placeholder="$t('system.notice.customerEmailAddress')" style="width: 240px" />
          </el-form-item>

          <el-form-item :label="$t('system.notice.supplierName')" v-if="dialogSearchData.userType === 2">
            <el-input v-model.trim="dialogSearchData.supplierName" clearable :placeholder="$t('system.notice.supplierName')" style="width: 240px" />
          </el-form-item>

          <el-form-item :label="$t('system.notice.supplierCode')" v-if="dialogSearchData.userType === 2">
            <el-input v-model.trim="dialogSearchData.supplierCode" clearable :placeholder="$t('system.notice.supplierCode')" style="width: 240px" />
          </el-form-item>

          <el-form-item :label="$t('system.notice.supplierEmailAddress')" v-if="dialogSearchData.userType === 2">
            <el-input v-model.trim="dialogSearchData.supplierEmailAddress" clearable :placeholder="$t('system.notice.supplierEmailAddress')" style="width: 240px" />
          </el-form-item>

          <el-form-item :label="$t('system.notice.companyName2')">
            <el-input v-model.trim="dialogSearchData.companyName" clearable :placeholder="$t('system.notice.companyName2')" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('system.notice.countryCode')">
            <el-input v-model.trim="dialogSearchData.countryCode" clearable :placeholder="$t('system.notice.countryCode')" style="width: 240px"/>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" class="export" @click="userSearch(dialogSearchData.userType)">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-table
            ref="multipleTable"
            :data="userList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getDialogSelect">
            <el-table-column
              :label="$t('system.notice.indexNo')"
              type="selection"
              width="50">
            </el-table-column>

<!--            <el-table-column-->
<!--              label="序号"-->
<!--              type="index"-->
<!--              width="50">-->
<!--            </el-table-column>-->

            <el-table-column align="center" :label="$t('system.notice.countryCode')" prop="countryCode" />

            <el-table-column align="center" min-width="100" :label="$t('system.notice.companyName')" prop="companyName"/>

            <el-table-column align="center" min-width="100" :label="$t('system.notice.userAccount')" prop="userAccount"/>

            <el-table-column align="center" min-width="100" :label="$t('system.notice.userName')" prop="contactName">
              <template slot-scope="scope">
                {{scope.row.contactName}}
              </template>
            </el-table-column>

            <el-table-column align="center" min-width="100" :label="$t('system.notice.userEmail')" prop="userEmail"/>

            <el-table-column align="center" min-width="100" :label="$t('system.notice.userType')" prop="userType">
              <template slot-scope="scope">
                {{scope.row.userType === 1 ? $t('system.notice.customer') : $t('system.notice.supplier')}}
              </template>
            </el-table-column>
          </el-table>
          <Pagination :total="dialogSearchData.total" :page.sync="dialogSearchData.pageNum" :limit.sync="dialogSearchData.pageSize" @pagination="getUserDataList(dialogSearchData.userType)" ></Pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="addSendUser">{{$t('common.add')}}</el-button>
          <el-button type="danger" size="small" @click="editVisible1=false">{{$t('common.buttonText.cancel')}}</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogType==='add'" type="primary" size="small" @click="confirmAdd('addDepartment',2)">{{$t('common.buttonText.save')}}</el-button>
        <el-button v-if="dialogType==='edit'" type="primary" size="small" @click="confirmEdit('addDepartment',2)">{{$t('common.buttonText.save')}}</el-button>
        <el-button v-if="dialogType==='add'" type="primary" size="small" @click="confirmAdd('addDepartment',0)">{{$t('common.buttonText.submit')}}</el-button>
        <el-button v-if="dialogType==='edit'" type="primary" size="small" @click="confirmEdit('addDepartment',0)">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pagephCustomerContactByCustomerInfo } from '@/api/customer'
import { pagephSupplierContactBySupplierInfo } from '@/api/supplier'
import Pagination from '@/components/Pagination'
import { pagephNoticeTimingTask,
  deleteNoticeTimingTaskByIds,
  detailNoticeTimingTask,
  saveNoticeTimingTask,
  listNoticeTemplate,
  updateNoticeTimingTask,
  pagephNoticeTaskRecipient,
  exportBySysNoticeTimingTask
} from '@/api/system'
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  filters: {
    statusFmt(val, language) {
      switch (Number(val)) {
        case 1: return language === 'zh' ? '已执行' : 'Executed';
        case 0: return language === 'zh' ? '待执行' : 'Wait For Executing';
        case 3: return language === 'zh' ? '执行中' : 'Executing';
        case 2: return language === 'zh' ? '编辑中' : 'Editing';
        default:
          return language === 'zh' ? '数据异常' : 'Data Exception';
      }
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      taskDataRules: {
        taskName: [
          { required: true, message: this.$t('system.notice.taskNameHint'), trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: this.$t('system.notice.templateBIdHint'), trigger: 'blur' }
        ],
        timeInterval: [
          { type: 'number', required: true, message: this.$t('system.notice.timeIntervalHint'), trigger: 'blur' }
        ],
        selectTime: [
          { required: true, message: this.$t('system.notice.selectTimeHint'), trigger: 'change' }
        ]
      },
      detailVisible: false,
      editVisible: false,
      editVisible1: false,
      templateList: [],
      selectList: [],
      idsForm: {
        ids: ''
      },
      statusList: [
        {
          labelZh: '已执行',
          label: 'Executed',
          id: 1
        },
        {
          labelZh: '待执行',
          label: 'Wait For Executing',
          id: 0
        },
        {
          labelZh: '执行中',
          label: 'Executing',
          id: 3
        }
      ],
      dialogType: '',
      dataList: [],
      sendList: [],
      userList: [],
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      dialogSelectList: [],
      listLoading: true,
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        updateTime: '',
        updateUserName: '',
        taskStatus: '',
        taskName: '',
        startTime: '',
        endTime: ''
      },
      customTime: [],
      taskData: {
        templateBId: '',
        taskName: '',
        taskStatus: 0,
        // gradeType: 1,
        runBeginTime: '',
        runEndTime: '',
        timeInterval: 1,
        delFlag: 1,
        updateTime: '',
        createTime: '',
        updateUserName: '',
        selectTime: [],
        sysNoticeTaskRecipientList: []
      },
      sendListData: {
        taskBId: '',
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      dialogSearchData: {
        userType: 1,
        customerCode: '',
        customerName: '',
        companyName: '',
        customerEmailAddress: '',
        countryCode: '',
        supplierCode: '',
        supplierName: '',
        supplierEmailAddress: '',
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  watch: {
    isZh() {
      this.taskDataRules = {
        taskName: [
          { required: true, message: this.$t('system.notice.taskNameHint'), trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: this.$t('system.notice.templateBIdHint'), trigger: 'blur' }
        ],
        timeInterval: [
          { type: 'number', required: true, message: this.$t('system.notice.timeIntervalHint'), trigger: 'blur' }
        ],
        selectTime: [
          { required: true, message: this.$t('system.notice.selectTimeHint'), trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getDataList()
    this.listNoticeTemplate();
  },
  methods: {
    verification() {
      this.pickerOptions = {
        shortcuts: [{
          text: this.language === 'zh' ? '最近一周' : 'The last Week',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.language === 'zh' ? '最近一个月' : 'The last month',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.language === 'zh' ? '最近三个月' : 'The last three months',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    },
    clearData() {
      this.taskData.selectTime = [];
      this.taskData.templateBId = '';
      this.taskData.runBeginTime = '';
      this.taskData.runEndTime = '';
      this.taskData.taskName = '';
      this.taskData.taskStatus = 0;
      this.taskData.runEndTime = 1;
      this.taskData.updateTime = '';
      this.taskData.createTime = '';
      this.taskData.sysNoticeTaskRecipientList = [];
      this.dialogSelectList = [];
      this.sendList = [];
    },
    // 查看任务详情  接受方分页
    getSendListData(bId) {
      this.sendListData.taskBId = bId;
      pagephNoticeTaskRecipient(this.sendListData).then(res => {
        this.sendList = res.data.list;
        this.sendListData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    confirmAdd(formName, taskStatus) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.taskData.taskStatus = taskStatus;
          this.taskData.sysNoticeTaskRecipientList = this.sendList;
          saveNoticeTimingTask(this.taskData).then(res => {
            if (res.status === 200) {
              if (res.data) {
                this.$message.success(this.$t("system.userManage.handle"));
                // this.$message.success("操作成功");
              } else {
                this.$message.error("Operation failed");
                // this.$message.error("操作失败");
              }
            }
            this.$refs[formName].resetFields();
            this.getDataList();
            this.editVisible = false;
            this.clearData();
          }).catch(err => {
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'));
          return false;
        }
      });
    },
    confirmEdit(formName, taskStatus) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.taskData.taskStatus = taskStatus;
          this.taskData.sysNoticeTaskRecipientList = this.sendList;
          updateNoticeTimingTask(this.taskData).then(res => {
            if (res.status === 200) {
              if (res.data) {
                this.$message.success(this.$t("system.userManage.handle"));
                // this.$message.success("操作成功");
              } else {
                this.$message.error("Operation failed");
                // this.$message.error("操作失败");
              }
            }
            this.$refs[formName].resetFields();
            this.getDataList();
            this.editVisible = false;
            this.clearData();
          }).catch(err => {
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('Verification failed!');
          // this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    getSelectTime(date) {
      if (date && date.length) {
        this.taskData.runBeginTime = date[0];
        this.taskData.runEndTime = date[1];
      } else {
        this.taskData.runBeginTime = '';
        this.taskData.runEndTime = '';
      }
    },
    openEdit(type, row) {
      this.userList = [];
      if (type === 'edit') {
        this.taskData.bid = row.bid;
        let obj = {
          bId: row.bid
        };
        detailNoticeTimingTask(obj).then(res => {
          this.taskData = Object.assign(this.taskData, res.data);
          this.taskData.selectTime = [res.data.runBeginTime, res.data.runEndTime];
          this.sendList = res.data.sysNoticeTaskRecipientList;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    deleteSend(index) {
      this.sendList.splice(index, 1)
    },
    openUserDialog() {
      this.editVisible1 = true;
      this.userSearch()
    },
    addSendUser() {
      if (!this.dialogSelectList.length) {
        return this.$message.warning('Please tick the user as the recipient')
        // return this.$message.warning('请勾选用户作为接收人')
      }
      if (!this.sendList.length) {
        this.sendList = this.dialogSelectList;
      } else {
        let arr = [];
        let addArr = [];
        this.dialogSelectList.forEach(e => {
          this.sendList.forEach(t => {
            if ((e.userType === t.userType) && (e.userName === t.userName) && (e.userAccount === t.userAccount) && (e.companyName === t.companyName)) {
              arr.push(e)
            }
          })
        });
        if (arr.length) {
          addArr = this.dialogSelectList.filter(e => {
            let flag = false;
            arr.forEach(t => {
              if ((e.userName === t.userName) && (e.userAccount === t.userAccount) && (e.companyName === t.companyName)) {
                flag = true
              }
            });
            return !flag
          });
        } else {
          addArr = this.dialogSelectList
        }
        this.sendList = this.sendList.concat(addArr);
      }
      this.$refs.multipleTable.clearSelection();
      this.dialogSelectList = [];
      this.editVisible1 = false;
    },
    userSearch(type) {
      this.dialogSearchData.pageNum = 1;
      this.getUserDataList(type)
    },
    getUserDataList(type) {
      // let obj = {};
      // for (let key in this.dialogSearchData) {
      //   if (this.dialogSearchData[key] !== '') {
      //     obj[key] = this.dialogSearchData[key]
      //   }
      // }
      if (type === 1) {
        pagephCustomerContactByCustomerInfo(this.dialogSearchData).then(res => {
          this.userList = res.data.list.map(e => {
            e.userBId = e.accountBId;
            e.userName = e.contactName;
            e.userAccount = e.emailAddress;
            e.userType = 1;
            e.userEmail = e.emailAddress;
            return { ...e }
          });
          this.dialogSearchData.total = res.data.total;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      if (type === 2) {
        pagephSupplierContactBySupplierInfo(this.dialogSearchData).then(res => {
          this.userList = res.data.list.map(e => {
            e.userBId = e.accountBId;
            e.userName = e.contactName;
            e.userAccount = e.emailAddress;
            e.userType = 2;
            e.userEmail = e.emailAddress;
            return { ...e }
          });
          this.dialogSearchData.total = res.data.total;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    listNoticeTemplate() {
      listNoticeTemplate({}).then(res => {
        this.templateList = res.data;
      });
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      pagephNoticeTimingTask(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
    },
    // 查看详情
    detailDialog(row) {
      detailNoticeTimingTask({ bId: row.bid }).then(res => {
        this.taskData = Object.assign(this.taskData, res.data);
        this.taskData.selectTime = [res.data.runBeginTime, res.data.runEndTime];
        // this.sendList = res.data.sysNoticeTaskRecipientList;
        this.detailVisible = true;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.sendListData.taskBId = row.bid;
      pagephNoticeTaskRecipient(this.sendListData).then(res => {
        this.sendList = res.data.list;
        this.sendListData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message.warning(this.isZh ? '请选择数据!' : 'Please select data!');
        // return this.$message.warning('请选择数据');
      }
      this.$confirm(this.$t('common.tip.isDeleteMsg'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteNoticeTimingTaskByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('common.tip.deleteTip'));
            // this.$message.success('操作成功!');
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
    getSelect(selects) {
      this.selectList = selects;
    },
    getDialogSelect(selects) {
      this.dialogSelectList = selects;
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportBySysNoticeTimingTask(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'noticeTaskList.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .noticeTack {
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
    .menuDialog {
      .el-dialog {
        width: 800px;
      }
      .form-dialog-width {
        width: 400px;
      }
    }
  }
</style>
