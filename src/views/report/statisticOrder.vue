<template>
  <div class="app-container order-volume">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <el-form-item :label="$t('report.productVolumeCount.date')">
          <el-date-picker
            v-model="rangeTime"
            type="datetimerange"
            range-separator="~"
            style="width: 300px"
            :start-placeholder="$t('report.standardProductsPriceCount.sDate')"
            :end-placeholder="$t('report.standardProductsPriceCount.eDate')"
            @change="getRangeTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('report.standardProductsPriceCount.productName')">
          <el-input v-model.trim="postData.productName" clearable :placeholder="$t('report.standardProductsPriceCount.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
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
        :label="$t('common.table.id')"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('report.standardProductsPriceCount.goodsName')" prop="productName" show-overflow-tooltip >
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('report.standardProductsPriceCount.skuCode')" prop="skuCode"/>

      <el-table-column :label="$t('report.standardProductsPriceCount.sku')" prop="cnAttrValueList" show-overflow-tooltip >
        <template slot-scope="scope">
          {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('report.standardProductsPriceCount.inquiryCount')" prop="inquiryCount"/>

      <el-table-column align="center" :label="$t('report.standardProductsPriceCount.quotedCount')" prop="quotationCount"/>

      <el-table-column align="center" :label="$t('report.standardProductsPriceCount.orderCount')" prop="orderCount"/>

      <el-table-column align="center" :label="$t('report.standardProductsPriceCount.transformationRate')" prop="turnoverRate"/>

    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { queryStandardProductVolume } from '@/api/report'
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
      queryStandardProductVolume(obj).then(res => {
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
.order-volume {
}
</style>
