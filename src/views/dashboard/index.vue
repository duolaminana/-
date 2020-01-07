<template>
  <div class="dashboard">
    <div class="dashboard-editor-container">
      <panel-group @handleSetLineChartData="handleSetLineChartData"/>

      <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--<line-chart :chart-data="lineChartData" />-->
      <!--</el-row>-->
      <!--<el-row :gutter="28">-->
      <!--<el-col :xs="24" :sm="24" :lg="8">-->
      <!--<div class="chart-wrapper">-->
      <!--<raddar-chart />-->
      <!--</div>-->
      <!--</el-col>-->
      <!--<el-col :xs="24" :sm="24" :lg="8">-->
      <!--<div class="chart-wrapper">-->
      <!--<pie-chart />-->
      <!--</div>-->
      <!--</el-col>-->
      <!--<el-col :xs="24" :sm="24" :lg="8">-->
      <!--<div class="chart-wrapper">-->
      <!--<bar-chart />-->
      <!--</div>-->
      <!--</el-col>-->
      <!--</el-row>-->
    </div>
    <el-row :gutter="24" class="main-content">
      <el-col :span="12">
        <panel-msg :title="$t('common.dashboard.todo')" :list="waitApprovalList" :total="approvalTotal" :path-type="1"></panel-msg>
      </el-col>
      <el-col :span="12">
        <pane-memo-remind :title="$t('common.dashboard.tips')" :list="memoRemindList" :total="memoRemindTotal" :path-type="2" @reLoad="getMemoRemindUserDateList"></pane-memo-remind>
      </el-col>
      <el-col :span="12" :offset="waitApprovalList.length ? 0 : 12" style="margin-top: 28px">
        <notice-msg :title="$t('common.dashboard.notice')" :list="noticeList" :total="noticeTotal" :path-type="3" @reLoad="getNoticeList"></notice-msg>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" center :title="$t('common.dashboard.password')" width="500px">
      <div style="text-indent: 200px">{{isZh ? '提示': 'Tips'}}</div>
      <div>
        <p style="text-indent: 25px" v-if="!isZh">Your password is expired or initialled, Please update immediately!</p>
        <p style="text-indent: 100px" v-else>您的密码已过期或被初始化，请立即更改！</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updatePwd">{{$t('common.buttonText.update')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible = false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
import PanelMsg from './components/PanelMsg'
import PaneMemoRemind from './components/PaneMemoRemind'
import NoticeMsg from './components/NoticeMsg'
import { getAgendaItemList, selectMemoRemindUserListApi, noticeList } from '@/api/system';

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PanelMsg,
    PaneMemoRemind,
    NoticeMsg
    // LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      waitApprovalList: [],
      memoRemindList: [],
      noticeList: [],
      approvalTotal: 0,
      memoRemindTotal: 0,
      noticeTotal: 0,
      dialogVisible: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getApprovalWaitList() {
      getAgendaItemList({ pageNum: 1, pageSize: 5, processStatus: 1 }).then(res => {
        this.waitApprovalList = res.data.list || [];
        this.approvalTotal = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    updatePwd() {
      this.$router.push({
        path: 'personal/changePassword'
      })
    },
    getMemoRemindUserDateList() {
      selectMemoRemindUserListApi({
        pageNum: 1,
        pageSize: 2,
        disposeStatus: 1,
        disposeUsersId: this.$store.state.user.userInfo.accountBId
      }).then(res => {
        this.memoRemindList = res.data.list || [];
        this.memoRemindTotal = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getNoticeList() {
      noticeList({
        pageIndex: 1,
        pageSize: 2,
        readStatus: 0
      }).then(res => {
        this.noticeList = res.data.list || [];
        this.noticeTotal = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  },
  created() {
    console.log(process.env.VUE_APP_BASE_API)
    this.getApprovalWaitList();
    this.getMemoRemindUserDateList();
    this.getNoticeList();
    if (this.userInfo.ifAlterPwd) {
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  /*background-color: #f6f7fb;*/
}

.dashboard-editor-container {
  padding: 16px;
  background-color: #f6f7fb;
  position: relative;
  height: 100%;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.main-content {
  padding: 0 5px 30px 5px;
}
</style>
