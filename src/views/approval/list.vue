<template>
  <div class="app-container approval-list">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '115px'" inline size="small">
        <div>
          <el-form-item :label="$t('approval.approvalList.businessName')">
            <el-select v-model="postData.businessType" clearable :placeholder="$t('approval.approvalList.businessName')" style="width: 200px">
              <el-option v-for="(item, index) in approvalTypeList" :key="index" :label="isZh?item.label:item.labelEn" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('approvalRemind.approval.processStatus')">
            <el-select v-model="postData.processStatus" clearable :placeholder="$t('approvalRemind.approval.processStatus')" style="width: 150px">
              <el-option :label="$t('approval.approvalList.processStatusAll')" value=""></el-option>
              <el-option :label="$t('approval.approvalList.processStatusNo')" :value="1"></el-option>
              <el-option :label="$t('approval.approvalList.processStatusYes')" :value="2"></el-option>
              <el-option :label="$t('approval.approvalList.processStatusReject')" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('approval.approvalList.applier')">
          <el-input v-model.trim="postData.applicantName" clearable :placeholder="$t('approval.approvalList.applier')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
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
      <el-table-column :label="$t('approval.approvalList.businessName')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.businessType | businessName(approvalTypeList,isZh)}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('approval.approvalList.approvalObject')" prop="businessName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('approval.approvalList.applier')" prop="userBidName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('approval.approvalList.applicationTime')">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="roleStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.processStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.processStatus === 1 ? $t('approvalRemind.approval.processStatusNo') : $t('approvalRemind.approval.processStatusYes') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="160" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" class="export" size="mini" @click="goDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" v-if="row.processStatus === 1" size="mini" @click="goRouter(row)">{{$t('common.buttonText.detail')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getApprovalList,
  updateAgendaItem,
  exportByAgendaItem,
  selectgetDictionaryBykeyApi
} from '@/api/system'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      dataList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        precessStatus: '',
        businessType: '',
        businessName: '',
        applicantName: ''
      },
      approvalTypeList: []
    }
  },
  created() {
    this.getDataList();
    this.getApporvalTypeList();
  },
  methods: {
    getApporvalTypeList() {
      selectgetDictionaryBykeyApi({ key: 'approval_type' }).then(res => {
        this.approvalTypeList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
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
      getApprovalList(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    goDetail(item) {
      let path = '';
      switch (Number(item.businessType)) {
        case 1: path = '/price/supplier/detail'; break;
        case 2: path = '/price/sale/detail'; break;
        case 3: path = '/query/detailQuoted'; break;
        case 4: path = '/order/sale/saleOrderDetail'; break;
        case 5: path = '/order/purchase/detailPurchaseOrder'; break;
        case 6: path = '/settlementFinance/sale/editPayRecord'; break;
        case 7: path = '/settlementFinance/payment/paymentMGT?isApply=0'; break;
        case 8: path = '/settlementFinance/payment/editLogistics?isApply=5'; break;
        case 9: path = '/logistics/detail'; break;
        case 10: path = '/price/saleable/detail'; break;
        case 11: path = '/MarketIntelligence/approvalNews'; break;
        case 12: path = '/order/purchase/checkDetail'; break;
        case 13: path = '/order/sale/checkDetail?saleType=0'; break;
        case 14: path = '/order/transitrade/transitradeOrderApproval'; break;
        case 15: path = '/order/sale/checkDetail?saleType=1'; break;
        case 16: path = '/settlementFinance/sale/editPayRecord?saleType=1'; break;
        case 17: path = '/settlementFinance/payment/transferPayment?isApply=0'; break;
      }
      if (path) {
        this.$router.push({
          path: path,
          query: {
            id: item.businessBid
          }
        })
      }
    },
    goRouter(item) {
      let path = '';
      switch (Number(item.businessType)) {
        case 1: path = '/price/supplier/approval'; break;
        case 2: path = '/price/sale/approval'; break;
        case 3: path = '/query/quoteApproval'; break;
        case 4: path = '/order/sale/saleOrderApproval'; break;
        case 5: path = '/order/purchase/buyOrderApproval'; break;
        case 6: path = '/settlementFinance/sale/editPayRecord'; break;
        case 7: path = '/settlementFinance/payment/paymentMGT'; break;
        case 8: path = '/settlementFinance/payment/editLogistics'; break;
        case 9: path = '/logistics/approvalLogistics'; break;
        case 10: path = '/price/saleable/approval'; break;
        case 11: path = '/MarketIntelligence/approvalNews'; break;
        case 12: path = '/order/purchase/checkApproval'; break;
        case 13: path = '/order/sale/saleReceivingAudit'; break;
        case 14: path = '/order/transitrade/transitradeOrderApproval'; break;
        case 15: path = '/order/transitrade/orderTransitradeReceivingAudit'; break;
        case 16: path = '/settlementFinance/sale/editPayRecord?saleType=1'; break;
        case 17: path = '/settlementFinance/payment/transferPayment'; break;
      }
      if (path) {
        this.$router.push({
          path: path,
          query: {
            id: item.businessBid,
            approvalBid: item.approvalBid,
            agendaBid: item.bid,
            approvalNodeBid: item.approvalNodeBid,
            processBid: item.processBid
          }
        })
      }
      if (Number(item.businessType) === 6 || Number(item.businessType) === 16) {
        let obj = {
          id: item.id,
          processStatus: 2
        };
        // 做更新操作
        updateAgendaItem(obj).then(res => {
        }).catch(err => {
          this.$message.error(err.message)
        });
      }
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportByAgendaItem(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'agendaItemList.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    businessName(val, typeList, isZh) {
      let arr = typeList.filter(e => Number(e.value) === Number(val));
      if (arr.length) {
        return isZh ? arr[0].label : arr[0].labelEn
      } else {
        return ''
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
    .export {
      background: #42b983;
      border: #42b983;
    }
    button {
      margin: 0 10px;
    }
  }
}
</style>
