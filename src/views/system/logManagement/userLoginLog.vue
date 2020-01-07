<template>
  <div class="app-container form-test">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '100px'" inline size="small">
        <el-form-item :label="$t('logHistory.userLoginLog.loginerName')">
          <el-input v-model.trim="postData.loginerName" clearable :placeholder="$t('logHistory.userLoginLog.loginerName')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('logHistory.userLoginLog.loginTime')">
          <el-date-picker
            v-model="postData.loginTime"
            type="datetime"
            :placeholder="$t('logHistory.userLoginLog.loginTime')"
            style="width: 200px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('logHistory.userLoginLog.loginStatus')">
          <el-select v-model="postData.loginStatus" clearable :placeholder="$t('logHistory.userLoginLog.loginStatus')" style="width: 150px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.loginStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
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
      <el-table-column :label="$t('logHistory.userLoginLog.id')" prop="id" show-overflow-tooltip />

      <el-table-column :label="$t('logHistory.userLoginLog.loginerName')" prop="loginerName" show-overflow-tooltip />
      <el-table-column :label="$t('logHistory.userLoginLog.loginIp')" prop="loginIp" show-overflow-tooltip />
      <el-table-column :label="$t('logHistory.userLoginLog.browserName')" prop="browserName" show-overflow-tooltip />
      <el-table-column :label="$t('logHistory.userLoginLog.osInfo')" prop="osInfo" show-overflow-tooltip />
      <el-table-column :label="$t('logHistory.userLoginLog.loginDeviceInfo')" prop="loginDeviceInfo" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('logHistory.userLoginLog.loginStatus')" prop="loginStatus" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag :type="row.loginStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ row.loginStatus === 1 ? $t('logHistory.userLoginLog.success') : $t('logHistory.userLoginLog.failed') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('logHistory.userLoginLog.loginTime')" prop="loginTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.loginTime | timeFmt}}
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import {
  selectUserLoginHistoryListApi
  // exportByUserLoginHistoryByApi
} from '@/api/logHistory';
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      dataList: [],
      listLoading: true,
      selectList: [],
      reviewForm: {
        ids: ''
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        loginerName: '',
        loginStatus: '',
        loginTime: ''
      },
      areaList: [
        // 登录状态 0-失败 1-成功
        {
          labelZh: '全部',
          label: 'All',
          loginStatus: ''
        },
        {
          labelZh: '失败',
          label: 'Failed',
          loginStatus: 0
        },
        {
          labelZh: '成功',
          label: 'Success',
          loginStatus: 1
        }
      ]
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      selectUserLoginHistoryListApi(this.postData).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message({ message: err.message });
      });
      this.listLoading = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    }
    // 批量删除接口
    // disableClick() {
    //   if (!this.selectList.length) {
    //     return this.$message(this.$t('query.formMessage.PleaseSelectData'));
    //   }
    //   this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
    //     confirmButtonText: this.$t('common.buttonText.confirm'),
    //     cancelButtonText: this.$t('common.buttonText.cancel'),
    //     type: 'warning',
    //     center: true
    //   }).then(() => {
    //     this.reviewForm.ids = this.selectList.map(e => {
    //       return e.id;
    //     }).join(',');
    //     delectPositionByIdApi(this.reviewForm).then(res => {
    //       if (res.status === 200) {
    //         this.$message.success(this.$t('common.tip.deleteTip'));
    //       }
    //       this.getDataList();
    //     }).catch(err => {
    //       this.$message.error(err.message);
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: "info",
    //       message: this.$t("system.userManage.cancel")
    //     });
    //   });
    // },
    // 导出操作
    // outportData() {
    //   let obj = {
    //     pageNum: '',
    //     pageSize: '',
    //     positionName: this.postData.positionName,
    //     positionStatus: this.postData.positionStatus
    //   };
    //   exportBySysAdPositionExcel(obj).then(res => {
    //     const link = document.createElement('a');
    //     let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
    //     link.style.display = 'none';
    //     link.href = URL.createObjectURL(blob);
    //     link.setAttribute('download', 'SysAdPosition.xls');
    //     document.body.appendChild(link)
    //     link.click();
    //     document.body.removeChild(link)
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   });
    // }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .form-test {
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .item-label {
      margin-left: -80px !important;
      .el-form-item__label {
        width: 130px !important;
      }
    }
    .form-padding {
      padding-right: 85px;
    }
  }
</style>

