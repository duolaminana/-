<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('logistics.purchaseLogisticsTracking.supplierName')">
            <el-input v-model.trim="postData.sellerName" clearable :placeholder="$t('logistics.purchaseLogisticsTracking.supplierName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('logistics.purchaseLogisticsTracking.supplierCode')">
            <el-input v-model.trim="postData.sellerCode" clearable :placeholder="$t('logistics.purchaseLogisticsTracking.supplierCode')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.table.status')">
            <el-select v-model="postData.orderStatus" clearable :placeholder="$t('common.table.status')" style="width: 200px">
              <el-option :label="isZh?'全部':'All'" value=""></el-option>
              <el-option v-for="(item, index) in orderStatusList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('logistics.purchaseLogisticsTracking.orderNo')">
            <el-input v-model.trim="postData.purchaseNo" clearable :placeholder="$t('logistics.purchaseLogisticsTracking.orderNo')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.start')">
            <el-date-picker
              v-model="postData.sdate"
              :picker-options="pickerOptionsStart"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.end')">
            <el-date-picker
              v-model="postData.edate"
              :picker-options="pickerOptionsEnd"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
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
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        :label="$t('common.table.id')"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('logistics.purchaseLogisticsTracking.orderNo')" prop="purchaseNo" show-overflow-tooltip/>

      <el-table-column min-width="105" :label="$t('logistics.purchaseLogisticsTracking.supplierCode')" prop="sellerCode" show-overflow-tooltip/>

      <el-table-column min-width="110" :label="$t('logistics.purchaseLogisticsTracking.supplierName')" prop="sellerName" show-overflow-tooltip/>

      <el-table-column min-width="100" :label="$t('logistics.purchaseLogisticsTracking.sellerTelephone')" prop="sellerTelephone" show-overflow-tooltip/>

      <el-table-column align="center" width="80" :label="$t('logistics.purchaseLogisticsTracking.skuCount')" prop="skuCount" />

      <el-table-column align="center" min-width="100" :label="$t('logistics.purchaseLogisticsTracking.totalAmount')" prop="netTotalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('logistics.purchaseLogisticsTracking.updateUserId')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('logistics.purchaseLogisticsTracking.rangeTime')" prop="orderCreateTime">
        <template slot-scope="scope">
          {{scope.row.orderCreateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :width="isZh?'100px':'120px'" :label="$t('common.status')" prop="orderStatus">
        <template slot-scope="scope">
          {{scope.row.orderStatus | statusFmt(orderStatusList, isZh)}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh?'180px': '200px'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus > 11" @click="openDialog(scope.row.bid)">
            {{$t('common.table.maintenance')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('logistics.purchaseLogisticsTracking.orderMaintenance')" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.purchaseLogisticsTracking.orderNo')">
              {{detailForm.purchaseNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.purchaseLogisticsTracking.rangeTime')">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('logistics.logisticsTrace.buyer')}}</td>
                <td width="60%">
                  {{detailForm.buyerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerAddress')}}</td>
                <td>{{detailForm.buyerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerTelephone')}}</td>
                <td>{{detailForm.buyerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerEmail')}}</td>
                <td>{{detailForm.buyerEmail}}</td>
              </tr>
              <tr>
                <td>
                  <span class="label-required">{{$t('logistics.logisticsTrace.buyerBank')}}</span>
                </td>
                <td>{{detailForm.buyerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerBankAccount')}}</td>
                <td>{{detailForm.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerSwiftcode')}}</td>
                <td>{{detailForm.buyerSwiftcode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.arrivePort')}}</td>
                <td>{{detailForm.arrivePort}}</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('logistics.logisticsTrace.seller')}}</td>
                <td width="60%">
                  {{detailForm.sellerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerContact')}}</td>
                <td>{{detailForm.sellerContact}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerAddress')}}</td>
                <td>{{detailForm.sellerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerTelephone')}}</td>
                <td>{{detailForm.sellerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerEmail')}}</td>
                <td>{{detailForm.sellerEmail}}</td>
              </tr>
              <tr>
                <td>
                  <span class="label-required">{{$t('logistics.logisticsTrace.sellerBank')}}</span>
                </td>
                <td>{{detailForm.sellerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerBankAccount')}}</td>
                <td>{{detailForm.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerSwifcode')}}</td>
                <td>{{detailForm.sellerSwifcode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.departurePort')}}</td>
                <td>{{detailForm.departurePort}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          {{$t('logistics.purchaseLogisticsTracking.orderSchedule')}}
          <!--<el-button type="primary" size="mini" style="float: right" @click="openFiles(detailForm.bid)">相关文件上传</el-button>-->
        </div>

        <div>
          <order-step :list="allNodeList" :can-click="true" :type="1"></order-step>
        </div>

        <el-popover
          placement="bottom-start"
          trigger="hover">
          <el-table
            fit
            size="mini"
            :data="saleOrderWithPurchaseList">
            <el-table-column width="120" align="center" prop="orderNo" :label="$t('logistics.purchaseLogisticsTracking.orderNo')"></el-table-column>
            <el-table-column width="150" align="center" prop="buyerName" :label="$t('logistics.purchaseLogisticsTracking.buyerName')"></el-table-column>
            <el-table-column width="120" align="center" prop="sellerName" :label="$t('logistics.purchaseLogisticsTracking.sellerName')"></el-table-column>
            <el-table-column align="center" width="160" label="订单日期">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>
          </el-table>
          <div slot="reference" class="related-file" style="width: 120px">{{$t('logistics.purchaseLogisticsTracking.relatedSalerOrder')}}</div>
        </el-popover>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.tagsView.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import { selectgetDictionaryBykeyApi } from "@/api/system";
import {
  getPurchaseOrderList,
  getDetailPOFlowById,
  getNodePurchase,
  getPurchaseRelateOrder
} from '@/api/purchaseOrder'
export default {
  components: {
    Pagination,
    OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      dialogVisible1: false,
      payDialogVisible: false,
      rangeTime: [],
      selectList: [],
      orderStatusList: [],
      saleOrderWithPurchaseList: [],
      payRecordList: [],
      stockRecordList: [],
      deliveryRecordList: [],
      checkRecordList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        sellerName: '',
        sellerCode: '',
        purchaseNo: '',
        orderStatus: '',
        sdate: '',
        edate: ''
      },
      detailForm: {},
      paymentData: {},
      paymentForm: {
        paymentTime: '',
        applyPaymentAmount: '',
        paymentOrderType: 1,
        paymentCurrency: '',
        amountAll: 0,
        pendingPayment: 0,
        associatedOrderBId: '',
        customerBId: '',
        customerName: ''
      },
      dataList: [],
      countryList: [],
      allNodeList: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.postData.edate) {
            return time.getTime() > this.postData.edate
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.postData.sdate) {
            return time.getTime() < this.postData.sdate
          }
        }
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: []
    }
  },
  created() {
    this.getOrderStatusList();
    this.getDataList()
  },
  methods: {
    goRouter(type, id) {
      this.$router.push({
        path: '/order/purchase/detailPurchaseOrder',
        query: {
          id: id,
          type: type
        }
      });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.sdate = date[0];
        this.postData.edate = date[1]
      } else {
        this.postData.sdate = '';
        this.postData.edate = '';
      }
    },
    getOrderStatusList() {
      selectgetDictionaryBykeyApi({ key: 'order status' }).then(res => {
        this.orderStatusList = res.data.map(e => {
          if (e.value === '2') {
            e.label = '待供应商确认';
            e.labelEn = 'Pending for Supplier Confirmation'
          }
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openDialog(id) {
      this.getPurchaseOrderDetail(id);
      this.getAllNodePurchaseOrder(id);
      this.getSalesOrderByPurchase(id)
    },
    getPurchaseOrderDetail(id) {
      getDetailPOFlowById({ bid: id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.dialogVisible = true;
        // this.customerContactFun(this.detailForm.customerBId);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getAllNodePurchaseOrder(id) {
      getNodePurchase({ purchaseBid: id }).then(res => {
        let allNodeList = res.data.map((e, index) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          return { ...e }
        });
        this.allNodeList = allNodeList.filter(e => e.nodeType === 3);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSalesOrderByPurchase(id) {
      getPurchaseRelateOrder({ bid: id }).then(res => {
        this.saleOrderWithPurchaseList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
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
      if (this.$route.query.customerUserBid) {
        obj.customerUserBid = this.$route.query.customerUserBid
      }
      getPurchaseOrderList(obj).then(res => {
        this.dataList = res.data.list;
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
    },
    statusFmt(val, arr, isZh) {
      let objArr = arr.filter(e => Number(e.value) === val);
      if (objArr.length) {
        return isZh ? objArr[0].label : objArr[0].labelEn
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .saleOrder {
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
    .related-file {
      text-decoration: underline;
      font-size: 16px;
      color: #1e6abc;
      cursor: pointer;
      margin: 20px;
    }
    .file-record-item {
      margin: 20px 0;
      .file-record-label {
        line-height: 1.5rem;
      }
    }
    .payment-box {
      >div {
        margin: 20px 0;
      }
      .payment-order {
        &-item {
          display: flex;
          line-height: 28px;
          >div {
            flex: 1;
            display: flex;
            .item-label {
              width: 130px;
            }
            .item-text {
              flex: 1;
            }
          }
        }
      }
      .payment-supplier {
        display: flex;
        border-top: 1px solid $border-light-color;
        padding-top: 10px;
        >div {
          flex: 1;
          .payment-supplier-item {
            padding-left: 100px;
            flex: 1;
            display: flex;
            line-height: 35px;
            .item-label {
              width: 130px;
            }
            .item-text {
              flex: 1;
            }
          }
        }
      }
    }
  }
</style>
