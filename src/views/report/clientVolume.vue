<template>
  <div class="app-container approval-list">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('report.clientVolumeCount.date')">
            <el-date-picker
              v-model="rangeTime"
              type="datetimerange"
              range-separator="~"
              style="width: 300px"
              :start-placeholder="$t('report.clientVolumeCount.sDate')"
              :end-placeholder="$t('report.clientVolumeCount.eDate')"
              @change="getRangeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('report.clientVolumeCount.clientClass')">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'sortName', children: 'children'}"
              filterable
              clearable
              :placeholder="$t('report.clientVolumeCount.clientClass')"
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('report.clientVolumeCount.cliendName')">
            <el-input v-model.trim="postData.customerName" clearable :placeholder="$t('report.clientVolumeCount.cliendName')" style="width: 300px" />
          </el-form-item>
          <el-form-item :label="$t('report.clientVolumeCount.cliendState')">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable :placeholder="$t('report.clientVolumeCount.cliendState')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        :label="$t('report.clientVolumeCount.serialNumber')"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('report.clientVolumeCount.clientClass')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sortName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('report.clientVolumeCount.cliendName')" prop="customerName" />

      <el-table-column :label="$t('report.clientVolumeCount.cliendState')" prop="countryCode" />

      <el-table-column align="center" width="150" :label="$t('report.clientVolumeCount.orderCount')" prop="orderCount" />

      <el-table-column align="center" width="160" :label="$t('report.clientVolumeCount.totalMoney')" prop="totalAmount">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('report.clientVolumeCount.avgMoney')" prop="averagePrice" />
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  queryClientVolume
} from '@/api/report'
import { listSort } from '@/api/customer'
import { selectCountryListApi } from '@/api/system'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      loading1: false,
      rangeTime: [],
      searchSortName: [],
      sortList: [],
      countryList: [],
      dataList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        customerName: '',
        custSortBId: '',
        countryCode: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.getDataList();
    this.getSortList();
    this.getCountryList()
  },
  methods: {
    getRangeTime(arr) {
      if (arr && arr.length) {
        this.postData.startTime = arr[0];
        this.postData.endTime = arr[1];
      } else {
        this.postData.startTime = '';
        this.postData.endTime = '';
      }
    },
    // 主列表数组转为字符串搜索
    getParentId(arr) {
      if (arr.length) {
        this.postData.custSortBId = arr.join(',')
      } else {
        this.postData.custSortBId = ''
      }
    },
    // 获取分类列表
    getSortList() {
      listSort({ pageNum: 1, pageSize: 999 }).then(res => {
        this.sortList = res.data.list || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      queryClientVolume(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    }
  },
  filters: {
    businessName(val) {
      switch (Number(val)) {
        case 1: return '供应商调价';
        case 2: return '销售调价';
        case 3: return '报价单审核';
        case 4: return '销售订单审核';
        case 5: return '采购订单审核';
        case 6: return '销售订单收款确认';
        case 7: return '采购订单付款申请审核';
        case 8: return '物流订单付款申请审核';
        case 9: return '物流订单审核'
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

<style lang="scss">
@import '~@/styles/variables.scss';
.approval-list {
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
}
</style>
