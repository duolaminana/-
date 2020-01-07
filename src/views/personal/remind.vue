<template>
  <div class="memoRemind">
    <!--<div class="memoRemind-editor-container">-->
      <!--<panel-group/>-->
    <!--</div>-->
    <!--<div class="memoRemind-top"><span>备忘提醒</span></div>-->

    <div class="saleOrder">
      <div class="search-box">
        <el-form label-width="90px" inline size="small">
          <div>
            <el-form-item :label="$t('personal.remind.remindTitle')">
              <el-input v-model.trim="postData.remindTitle" clearable :placeholder="$t('personal.remind.remindTitle')" style="width: 360px" />
            </el-form-item>
          </div>
          <div>
            <el-form-item :label="$t('personal.remind.remindTime')">
              <el-date-picker
                v-model="remindTime"
                type="daterange"
                align="right"
                unlink-panels
                clearable
                range-separator="~"
                :start-placeholder="$t('personal.remind.StartDate')"
                :end-placeholder="$t('personal.remind.EndDate')"
                style="width: 360px"
                :picker-options="pickerOptions"
                @change="getSearchTime">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('personal.remind.disposeStatus')" v-if="activeName === 'first'">
              <el-select v-model="postData.disposeStatus" clearable :placeholder="$t('personal.remind.disposeStatus')" style="width: 200px">
                <el-option v-for="(item, index) in disposeStatusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.disposeStatus" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="padding-left: 120px;">
              <el-button type="primary" class="export" @click="searchData(activeName)">{{$t('system.role.search')}}</el-button>
            </el-form-item>
          </div>
          <div>
            <el-form-item v-if="activeName === 'first'" style="float: right;padding-right: 15px">
              <el-button type="primary" size="small" @click="openRemind('add')">{{$t('common.add')}}</el-button>
              <el-button type="primary" size="small" @click="deleteHint">{{$t('common.delete')}}</el-button>
            </el-form-item>
            <el-form-item v-if="activeName === 'second'" style="float: right;padding-right: 15px">
              <el-button type="primary" size="small" @click="openRemind('add')">{{$t('common.add')}}</el-button>
              <el-button type="primary" size="small" @click="deleteClick">{{$t('common.delete')}}</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick(activeName)">
        <el-tab-pane :label="$t('personal.remind.receivedReminders')" name="first">
          <!--<div class="topBtns">-->
            <!--<el-button type="primary" size="small" @click="openRemind('add')">{{$t('common.add')}}</el-button>-->
            <!--<el-button type="primary" size="small" @click="deleteHint">{{$t('common.delete')}}</el-button>-->
          <!--</div>-->
          <el-table
            v-loading="listLoading"
            :data="MemoRemindUserDateList"
            element-loading-text="loading。。。"
            border
            fit
            size="mini"
            row-key="id"
            @selection-change="getSelect"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('personal.remind.index')"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column width="200" :label="$t('personal.remind.remindTitle')" prop="remindTitle" show-overflow-tooltip />

            <el-table-column :label="$t('personal.remind.remindContent')" prop="remindContent" />

            <el-table-column align="center" width="150" :label="$t('personal.remind.remindTime')" prop="remindTime">
              <template slot-scope="scope">
                {{scope.row.remindTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" :label="$t('personal.remind.remindUserName')" prop="remindUserName" show-overflow-tooltip/>

            <el-table-column align="center" width="100" :label="$t('personal.remind.disposeStatus')" prop="disposeStatus">
              <template slot-scope="{row}">
                <el-tag :type="row.disposeStatus === 1 ? 'danger' : 'primary'" size="mini">
                  {{ row.disposeStatus === 1 ? $t('personal.remind.untreated') : $t('personal.remind.done') }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('common.table.actions')" width="100" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" v-if="row.disposeStatus === 1" @click="changeStatus(row)">{{$t('common.table.dispose')}}</el-button>
                <el-button type="primary" size="mini" v-if="row.disposeStatus === 2" class="export" @click="openDisposeDetails(row)">{{$t('common.table.view')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getMemoRemindUserDateList" ></Pagination>

        </el-tab-pane>
        <el-tab-pane :label="$t('personal.remind.SendReminders')" name="second">
          <!--<div class="topBtns">-->
          <!--<el-button type="primary" size="small" @click="openRemind('add')">{{$t('common.add')}}</el-button>-->
          <!--<el-button type="primary" size="small" @click="deleteClick">{{$t('common.delete')}}</el-button>-->
          <!--</div>-->

          <el-table
            v-loading="memoListLoading"
            :data="MemoDateList"
            element-loading-text="loading。。。"
            border
            fit
            size="mini"
            row-key="id"
            header-align="center"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">

            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>

            <el-table-column
              align="center"
              :label="$t('personal.remind.index')"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column width="200" :label="$t('personal.remind.remindTitle')" prop="remindTitle" show-overflow-tooltip/>

            <el-table-column :label="$t('personal.remind.remindContent')" prop="remindContent" />

            <el-table-column :label="$t('personal.remind.sysMemoRemindUserList')" prop="sysMemoRemindUserList" show-overflow-tooltip>
              <template slot-scope="scope">
                {{getPostUserName(scope.row.sysMemoRemindUserList)}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="150" :label="$t('personal.remind.remindTime')" prop="remindTime">
              <template slot-scope="scope">
                {{scope.row.remindTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('common.table.actions')" width="80" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" class="export" @click="openRemind('details',row)">{{$t('common.table.view')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getMemoRemindList" ></Pagination>

        </el-tab-pane>
      </el-tabs>
      <el-dialog :visible.sync="disposeDetailsVisible" :title="$t('personal.remind.ViewTitile')" center width="900px" @closed="clearData">
        <el-form :model="disposeDetailsForm" label-width="120px" label-position="left" size="small">
          <el-form-item :label="$t('personal.remind.remindTitle')">
            <el-input v-model="disposeDetailsForm.remindTitle" clearable style="width: 700px" readonly/>
          </el-form-item>
          <el-form-item :label="$t('personal.remind.remindContent')">
            <el-input v-model="disposeDetailsForm.remindContent" type="textarea" :rows="10" clearable style="width: 700px" readonly/>
          </el-form-item>
          <el-form-item :label="$t('personal.remind.remindUserName')">
            {{disposeDetailsForm.remindUserName}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="disposeDetailsVisible=false">{{$t('common.buttonText.close')}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogType==='add'?$t('personal.remind.addTitile'): $t('personal.remind.ViewTitile')" center width="900px" @closed="clearData">
        <el-form ref="memoRemind" :model="addMemoRemind" label-width="130px" label-position="left" size="small" :rules="addMemoRemindRules">
          <el-form-item :label="$t('personal.remind.remindTitle')" prop="remindTitle">
            <el-input v-model="addMemoRemind.remindTitle" clearable :readonly="dialogType === 'details'" :placeholder="$t('personal.remind.remindTitle')" style="width: 700px" />
          </el-form-item>
          <el-form-item :label="$t('common.dashboard.remindObj')" prop="sysMemoRemindUserList">
            <el-select multiple filterable :loading="loading" v-model="addMemoRemind.disposeUsersIds" :disabled="dialogType === 'details'" clearable :placeholder="$t('common.dashboard.remindObj2')" @change="getRemindUser" style="width: 700px">
              <el-option v-for="(itemUser, index) in userInfoList" :label="itemUser.userName" :value="itemUser.accountBId" :key="index">
                {{itemUser.userName}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('personal.remind.remindContent')" prop="remindContent">
            <el-input v-model="addMemoRemind.remindContent" :readonly="dialogType === 'details'" :autosize="{ minRows: 7, maxRows: 7}" type="textarea" clearable :placeholder="$t('personal.remind.remindContent')" style="width: 700px" />
          </el-form-item>
          <el-form-item :label="$t('personal.remind.remindUserName')" prop="remindUserName">
            {{addMemoRemind.remindUserName}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" v-if="dialogType === 'add'" @click="addRemind('memoRemind', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.send')}}</el-button>
          <el-button type="danger" size="small" v-if="dialogType === 'add'" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
          <el-button type="danger" size="small" v-if="dialogType !== 'add'" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import PanelGroup from './components/PanelGroup'
import { mapGetters } from 'vuex'
import { selectMemoRemindUserListApi, updateDisposeStatusApi, selectMemoRemindListApi, selectUserListAllApi, saveMemoRemindApi, deleteMemoRemindByIdsApi, deleteSysMemoRemindUserByIds } from '@/api/system'
import { deepClone } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'

export default {
  name: 'DashboardAdmin',
  components: {
    // PanelGroup,
    Pagination
  },
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      idsForm: {
        ids: ''
      },
      listLoading: true,
      memoListLoading: true,
      MemoRemindUserDateList: [],
      MemoDateList: [],
      dialogVisible: false,
      disposeDetailsVisible: false,
      remindTime: [],
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        disposeUsersId: '',
        remindUserId: '',
        remindTitle: '',
        disposeStatus: '',
        endTime: '',
        startTime: ''
      },
      disposeDetailsForm: {
        remindTitle: '',
        remindContent: '',
        remindUserName: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: this.$t('common.timeSelector.lastWeek'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('common.timeSelector.lastMonth'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('common.timeSelector.lastThreeMonths'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      disposeStatusList: [
        // 处理状态（1-待处理/2-已处理）
        {
          labelZh: '全部',
          label: 'All',
          disposeStatus: ''
        },
        {
          label: 'Untreated',
          labelZh: '待处理',
          disposeStatus: 1
        },
        {
          label: 'Done',
          labelZh: '已处理',
          disposeStatus: 2
        }
      ],
      activeName: 'first',
      loading: false,
      dialogType: '',
      addMemoRemind: {
        remindTitle: '',
        disposeUsersIds: [],
        remindUserName: '',
        remindContent: '',
        sysMemoRemindUserList: []
      },
      userInfoList: [],
      addMemoRemindRules: {
        remindTitle: [
          { required: true, message: this.$t('common.dashboard.remindTitleHint'), trigger: 'blur' }
        ],
        remindContent: [
          { required: true, message: this.$t('common.dashboard.remindContentHint'), trigger: 'blur' }
        ],
        sysMemoRemindUserList: [
          { required: true, message: this.$t('common.dashboard.sysMemoRemindUserListHint'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    isZh() {
      this.addMemoRemindRules = {
        remindTitle: [
          { required: true, message: this.$t('common.dashboard.remindTitleHint'), trigger: 'blur' }
        ],
        remindContent: [
          { required: true, message: this.$t('common.dashboard.remindContentHint'), trigger: 'blur' }
        ],
        sysMemoRemindUserList: [
          { required: true, message: this.$t('common.dashboard.sysMemoRemindUserListHint'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ]),
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getMemoRemindUserDateList(); // 分页查询-我的提醒列表数据
    this.getMemoRemindList()
    this.selectUserListAllFun(); // 获取后台人员
  },
  methods: {
    // 时间搜索
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    // 打开新增备忘记录框
    openRemind(type, row) {
      this.dialogType = type;
      this.addMemoRemind.remindUserName = this.userInfo.userName;
      console.log(type)
      if (type === 'details') {
        this.addMemoRemind = deepClone(row);
        this.addMemoRemind.disposeUsersIds = this.addMemoRemind.sysMemoRemindUserList.map(e => e.disposeUsersId)
      } else {
        this.addMemoRemind.remindTitle = '';
        this.addMemoRemind.remindContent = '';
        this.addMemoRemind.disposeUsersIds = [];
        this.addMemoRemind.sysMemoRemindUserList = [];
      }
      this.dialogVisible = true;
    },
    selectUserListAllFun() { // 获取后台人员
      selectUserListAllApi().then(res => {
        this.userInfoList = res.data;
      });
    },
    getRemindUser(arr) {
      this.addMemoRemind.sysMemoRemindUserList = this.userInfoList.filter(e => {
        e.disposeUsersId = e.accountBId;
        e.disposeUsersName = e.userName;
        return arr.includes(e.accountBId)
      });
    },
    getPostUserName(arr = []) {
      return arr.map(e => e.disposeUsersName).join(',')
    },
    // 关闭清空数据
    clearData() {
      console.log(this.disposeDetailsForm)
      console.log(this.addMemoRemind);
      this.addMemoRemind.remindTitle = '';
      this.addMemoRemind.remindContent = '';
      this.addMemoRemind.disposeUsersIds = [];
      this.addMemoRemind.sysMemoRemindUserList = [];
      this.disposeDetailsForm.remindTitle = '';
      this.disposeDetailsForm.remindContent = '';
    },
    // 新增一条备忘记录
    addRemind(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveMemoRemindApi(this.addMemoRemind).then(res => {
            this.$message.success(res.message);
            this.$refs[formName].resetFields();
            this.getMemoRemindList(); // 分页查询-我的发送列表数据
            this.getMemoRemindUserDateList();
            this.dialogVisible = false;
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'));
          return false;
        }
      });
    },
    deleteHint() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.selectDataTip'))
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.tip.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteSysMemoRemindUserByIds(formData).then(res => {
          this.getMemoRemindList();
          this.getMemoRemindUserDateList();
          this.$message.success(this.$t('common.tip.deleteTip'));
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.selectDataTip'))
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.tip.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteMemoRemindByIdsApi(formData).then(res => {
          this.getMemoRemindList();
          this.getMemoRemindUserDateList();
          this.$message.success(this.$t('common.tip.deleteTip'));
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    searchData(activeName) {
      this.postData.pageNum = 1;
      if (activeName === 'first') {
        this.getMemoRemindUserDateList() // 分页查询-我的提醒列表数据
      } else {
        this.getMemoRemindList(); // 分页查询-我的发送列表数据
      }
    },
    // 卡片选择
    handleClick(activeName) {
      if (activeName === 'first') {
        this.getMemoRemindUserDateList(); // 分页查询-我的提醒列表数据
      } else {
        this.getMemoRemindList(); // 分页查询-我的发送列表数据
      }
    },
    // 分页查询-我的提醒列表数据
    getMemoRemindUserDateList() {
      this.postData.disposeUsersId = this.userInfo.accountBId;
      selectMemoRemindUserListApi(this.postData).then(res => {
        this.MemoRemindUserDateList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 分页查询-我的发送列表数据
    getMemoRemindList() {
      this.postData.remindUserId = this.userInfo.accountBId;
      selectMemoRemindListApi(this.postData).then(res => {
        this.MemoDateList = res.data.list;
        this.postData.total = res.data.total;
        this.memoListLoading = false;
      }).catch(err => {
        this.memoListLoading = false;
        this.$message.error(err.message)
      });
    },
    // 打开提醒对象详情页
    openDisposeDetails(row) {
      this.disposeDetailsForm = deepClone(row);
      this.disposeDetailsVisible = true;
    },
    // 进行状态处理
    changeStatus(row) {
      let data = {
        id: row.id,
        disposeStatus: 2
      };
      updateDisposeStatusApi(data).then(res => {
        this.$message.success(this.$t('common.tip.deal'));
        this.getMemoRemindUserDateList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .memoRemind {
    /*background-color: #f6f7fb;*/
  }
  .memoRemind-editor-container {
    padding: 25px 25px 0px 25px;
    background-color: #f6f7fb;
    position: relative;
    height: 100%;
    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }
  }
  .memoRemind-top{
    background-color: rgb(234, 225, 225);
    height: 40px;
    text-align: center;
    line-height: 41px;
    font-size: 18px;
  }
  .saleOrder {
    padding-top: 20px;
    .search-box {
      padding-bottom: 35px;
      margin-bottom: 0px !important;
    }
    .leftBtns {
      float: left;
      margin-bottom: 10px;
      button {
        margin: 0 10px;
      }
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .row-item {
      margin-bottom: 20px;
    }
    .step-node {
      position: relative;
      font-weight: bold;
      font-size: 15px;
      line-height: 40px;
      padding: 5px 5px 5px 20px;
      border-bottom: 1px solid $border-light-color;
    }
  }
</style>
