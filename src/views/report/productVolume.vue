<template>
  <div class="app-container product-volume">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('report.productVolumeCount.date')">
            <el-date-picker
              v-model="rangeTime"
              type="datetimerange"
              style="width: 300px"
              range-separator="~"
              :start-placeholder="$t('report.productVolumeCount.sDate')"
              :end-placeholder="$t('report.productVolumeCount.eDate')"
              @change="getRangeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('report.productVolumeCount.orderType')">
            <el-input v-model.trim="postData.orderType" clearable :placeholder="$t('report.productVolumeCount.orderType')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('report.productVolumeCount.calssNmme')">
            <el-input v-model.trim="postData.categoryName" clearable :placeholder="$t('report.productVolumeCount.calssNmme')" style="width: 200px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('report.productVolumeCount.goodName')">
            <el-input v-model.trim="postData.productName" clearable :placeholder="$t('report.productVolumeCount.goodName')" style="width: 300px" />
          </el-form-item>
          <el-form-item :label="$t('report.productVolumeCount.skuCode')">
            <el-input v-model.trim="postData.skuCode" clearable :placeholder="$t('report.productVolumeCount.skuCode')" style="width: 200px" />
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
      <el-table-column width="160" :label="$t('report.productVolumeCount.calssNmme')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCategoryName : scope.row.enCategoryName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('report.productVolumeCount.goodName')" prop="productName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('report.productVolumeCount.skuCode')" prop="businessBid" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
        </template>
      </el-table-column>

      <el-table-column width="150" :label="$t('report.productVolumeCount.orderCount')" prop="orderCount" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('report.productVolumeCount.goodsCount')" prop="productCount">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('report.productVolumeCount.totalMoney')" prop="amountMoney" />

      <el-table-column align="center" width="150" :label="$t('report.productVolumeCount.avgMoney')" prop="averagePrice"/>

    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  queryProductVolume
} from '@/api/report'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      rangeTime: [],
      dataList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        skuCode: '',
        categoryName: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.getDataList()
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
      queryProductVolume(obj).then(res => {
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
.product-volume {
}
</style>
