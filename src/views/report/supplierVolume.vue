<template>
  <div class="app-container supplier-volume">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('report.supplierVolumeCount.date')">
            <el-date-picker
              v-model="rangeTime"
              type="datetimerange"
              range-separator="~"
              style="width: 300px"
              :start-placeholder="$t('report.supplierVolumeCount.sDate')"
              :end-placeholder="$t('report.supplierVolumeCount.eDate')"
              @change="getRangeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('report.supplierVolumeCount.supplierClass')">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
              filterable
              clearable
              :placeholder="$t('report.supplierVolumeCount.supplierClass')"
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('report.supplierVolumeCount.supplierName')">
            <el-input v-model.trim="postData.supplierName" clearable :placeholder="$t('report.supplierVolumeCount.supplierName')" style="width: 300px" />
          </el-form-item>
          <el-form-item :label="$t('report.supplierVolumeCount.state')">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable :placeholder="$t('report.supplierVolumeCount.state')" style="width: 200px">
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
        :label="$t('report.supplierVolumeCount.serialNumber')"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('report.supplierVolumeCount.supplierClass')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sortName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('report.supplierVolumeCount.supplierName')" prop="supplierName"/>

      <el-table-column :label="$t('report.supplierVolumeCount.state')" prop="countryCode" />

      <el-table-column align="center" width="150" :label="$t('report.supplierVolumeCount.orderCount')" prop="orderCount" />

      <el-table-column align="center" width="160" :label="$t('report.supplierVolumeCount.totalMoney')" prop="totalAmount"/>

      <el-table-column align="center" width="150" :label="$t('report.supplierVolumeCount.avgMoney')" prop="averagePrice" />
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  querySupplierVolume
} from '@/api/report'
import { selectCountryListApi } from '@/api/system'
import { getAllSortList } from '@/api/supplier'
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
      countryList: [],
      dataList: [],
      sortList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        sortBId: '',
        startTime: '',
        supplierName: '',
        endTime: '',
        countryCode: ''
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
        this.postData.sortBId = arr.join(',')
      } else {
        this.postData.sortBId = ''
      }
    },
    // 获取分类列表
    getSortList() {
      getAllSortList({ pageNum: 1, pageSize: 999 }).then(res => {
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
      querySupplierVolume(obj).then(res => {
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
.supplier-volume {
}
</style>
