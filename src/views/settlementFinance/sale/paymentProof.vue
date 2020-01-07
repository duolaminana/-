<template>
  <div class="app-container saleOrderPay">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '170px'" inline size="small">
        <div>
          <el-form-item :label="$t('order.purchase.orderType')">
            <el-radio-group v-model="saleType" @change="searchData">
              <el-radio :label="1">{{isZh ? '销售订单' : 'Sales Order'}}</el-radio>
              <el-radio :label="2">{{isZh ? '转单订单' : 'Transfer Order'}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item :label="$t('settlementFinance.sale.SalesOrderNo')">
          <el-input v-model.trim="postData.orderNo" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('finance.financeService.start')">
          <el-date-picker
            v-model="postData.orderStartTime"
            :picker-options="pickerOptionsStart"
            type="datetime"
            style="width: 200px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('finance.financeService.end')">
          <el-date-picker
            v-model="postData.orderEndTime"
            :picker-options="pickerOptionsEnd"
            type="datetime"
            style="width: 200px">
          </el-date-picker>
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
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <!-- <el-table-column :label="$t('settlementFinance.sale.collectionNo')" prop="collectionNo" show-overflow-tooltip /> -->

      <el-table-column :label="$t('system.workflowNode.orderBId')" prop="orderNo" show-overflow-tooltip />

      <el-table-column :label="$t('settlementFinance.sale.ClientAbbr')" prop="buyerName" show-overflow-tooltip/>

      <el-table-column :label="$t('inquiry.inquiryOrder.currency')" prop="orderCurrency" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('query.tableLabel.Amount')" prop="totalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="实收金额" prop="paidAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.paidAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="待收金额" prop="coolectionAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.coolectionAmount | moneyFmt}}
        </template>
      </el-table-column> -->

      <!-- <el-table-column align="center" width="100" label="收款人" prop="paymenterName" show-overflow-tooltip/> -->

      <!-- <el-table-column align="center" width="100" label="支持文件" prop="paymenterName" show-overflow-tooltip/> -->

      <el-table-column align="center" width="180" :label="$t('settlementFinance.sale.PaymentReceivingTime')" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.lastPaymentTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDialog(scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus > 4" @click="goRouter(scope.row.bid)">{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('settlementFinance.sale.CollectionInstructionDetail')" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" id="printDiv">
        <el-row class="row-item">
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.SalesOrderNo')+'：'">
              {{detailForm.orderNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.CurrentNode')+'：'">
              {{detailForm.nodeName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.collectionNo')+'：'">
              {{detailForm.collectionNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.Applicant')+'：'">
              {{detailForm.applicantUser}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.carriage.createTime')+'：'">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.CollectionDate')+'：'">
              {{detailForm.lastPaymentTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row class="row-item">
          <el-col>
            <el-form-item label="订单支付节点进度：">
              <order-step :list="allNodeList"></order-step>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            {{$t('settlementFinance.sale.ClientInformation')}}
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('query.tableLabel.CustomerName')}}</td>
                <td width="60%">
                  <!--<el-select v-model="detailForm.customerBId" disabled placeholder="请选择公司名称" class="edit-form-width">-->
                    <!--<el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                  <!--</el-select>-->
                  {{detailForm.buyerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('customer.record.country')}}</td><td>{{detailForm.buyerCountryCode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm.buyerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm.buyerBranchName}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm.buyerBankAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm.buyerSwiftcode}}</td>
              </tr>
              <!-- <tr>
                <td>目的港口</td><td>{{detailForm.arrivePort}}</td>
              </tr> -->
            </table>
          </el-col>
          <el-col :span="11">
            {{$t('settlementFinance.sale.ReceiverInformation')}}：
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('settlementFinance.sale.AccountName')}}</td>
                <td width="60%">
                  <!--<el-select v-model="detailForm.sysCompanyBId" disabled placeholder="请选择卖方企业名称" class="edit-form-width">-->
                    <!--<el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                  <!--</el-select>-->
                  {{detailForm.sellerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('customer.record.country')}}</td><td>{{detailForm.sellerCountryCode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm.sellerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm.sellerBranchName}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm.sellerBankAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm.sellerSwifcode}}</td>
              </tr>
              <!-- <tr>
                <td>出发港口</td><td>{{detailForm.departurePort}}</td>
              </tr> -->
            </table>
          </el-col>
        </el-row>
        <el-row class="row-item">
          <div style="line-height: 1.5rem;font-weight: bold">{{$t('settlementFinance.sale.CollectionInformation')}}：</div>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.OrderAmount')">
              {{detailForm.totalAmount | moneyFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.OrderCurrency')">
              {{detailForm.orderCurrency}}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="当前实收金额">
              {{detailForm.paidAmount | moneyFmt}}
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.PendingCollection')">
              {{detailForm.coolectionAmount | moneyFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.CollectionDate')">
              {{detailForm.lastPaymentTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row class="row-item">
          <el-col>
            <div style="font-weight: bold;line-height: 1.5rem;margin-bottom:10px;">收款记录表：
              <el-button size="mini" style="float:right" type="primary">新增</el-button>
            </div>
            <el-table
              :data="recRecordList"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
             <el-table-column
               label="序号"
               align="center"
               type="index"
               width="55">
             </el-table-column>

              <el-table-column align="center" label="收款日期" prop="collectionTime" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.collectionTime | timeFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" label="币种" prop="collectionCurrency" show-overflow-tooltip/>

              <el-table-column align="center" label="金额" prop="collectionAmount" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{scope.row.collectionAmount | moneyFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" label="支持文件" prop="fileName" show-overflow-tooltip/>

              <el-table-column align="center" :label="$t('common.table.actions')" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
                  <el-button type="primary" size="mini" v-if="!detailModal" @click="removeFile(scope)">{{$t('common.table.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="Printing()">{{$t('settlementFinance.sale.print')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// import OrderStep from '@/components/OrderStep'
import { parseTime } from '@/utils/index'
import { selectCountryListApi, getSupplyCompanyList, selectCompanyBankAccountListApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerBank } from '@/api/customer'
import { supplierBankList } from "@/api/supplier";
import { getSaleOrderList, saleOrderDetail, typeNodeSaleOrder, getPaymentsList } from '@/api/order'
import { getTransferOrderList, transferOrderDetail } from '@/api/transitrade'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination
    // ,
    // OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      list: null,
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      rangeTime: [],
      selectList: [],
      saleType: 1,
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        customerUserName: '',
        orderNo: '',
        customerCountryCode: '',
        orderEndTime: '',
        orderStartTime: ''
      },
      dataList: [],
      recRecordList: [],
      countryList: [],
      detailForm: {
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: ''
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.postData.orderEndTime) {
            return time.getTime() > this.postData.orderEndTime
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.postData.orderStartTime) {
            return time.getTime() < this.postData.orderStartTime
          }
        }
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      customerBankList: [],
      sysBankList: []
    }
  },
  watch: {
    'language' (val) {
      this.verification()
    }
  },
  created() {
    this.verification()
    this.getDataList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
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
      };
    },
    Printing() {
      let newstr = document.getElementById('printDiv').innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      this.$router.go(0)
      return false;
    },
    goRouter(id) {
      this.$router.push({
        path: '/settlementFinance/sale/editPayRecord',
        query: {
          id: id,
          type: 2,
          saleType: this.saleType === 1 ? 0 : 1
        }
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
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.sysCustomerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(id) {
      this.getSaleOrderDetail(id);
      this.getTypeNodeSaleOrder(id);
      this.getPaymentsList(id);
    },
    getSaleOrderDetail(id) {
      this.dialogVisible = true;
      let api = this.saleType === 1 ? saleOrderDetail : transferOrderDetail;
      api({ orderBid: id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.dialogVisible = true;
        this.getCustomerBankList(this.detailForm.customerBId || this.detailForm.supplierBId, this.detailForm.buyerBankId, this.detailForm.salesOrderType);
        if (this.detailForm.sysCompanyBId) {
          this.getCompanyBankList(this.detailForm.sysCompanyBId, this.detailForm.sellerBankId);
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取付款记录
    getPaymentsList(id) {
      getPaymentsList({ salesOrderBId: id }).then(res => {
        this.recRecordList = (res.data || []).map(e => {
          e.fileName = e.salesCollectionProofList.map(e => e.attachmentName).join(',');
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder(id) {
      typeNodeSaleOrder({ orderBid: id, nodeType: 2 }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map(e => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取客户银行列表
    getCustomerBankList(id, bankId, orderType) {
      let api = orderType === 1 ? listCustomerBank : supplierBankList;
      let obj = orderType === 1 ? { customerBId: id, pageNum: 1, pageSize: 999 } : { supplierBId: id };
      api(obj).then(res => {
        this.customerBankList = orderType === 1 ? res.data.list : res.data;
        let obj = this.customerBankList.filter(e => {
          return e.id === bankId
        })[0];
        this.detailForm.buyerBankAddress = obj ? obj.bankAddress : '';
        this.detailForm.buyerBranchName = obj ? obj.branchName : '';
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取主体企业银行卡列表
    getCompanyBankList(id, bankId) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.sysBankList = res.data.list || [];
        let obj = this.sysBankList.filter(e => {
          return e.id === bankId
        })[0];
        this.detailForm.sellerBankAddress = obj ? obj.bankAddress : '';
        this.detailForm.sellerBranchName = obj ? obj.branchName : '';
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    searchData() {
      this.listLoading = true;
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      obj.apiType = 2;
      if (this.$route.query.supplierBId) {
        obj.supplierBId = this.$route.query.supplierBId
      }
      if (this.$route.query.customerUserBid) {
        obj.customerUserBid = this.$route.query.customerUserBid
      }
      let api = this.saleType === 1 ? getSaleOrderList : getTransferOrderList;
      // this.dataList = [{}]
      api(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
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
  .saleOrderPay {
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
    .row-item {
      padding: 16px 0;
      border-bottom: 1px solid $border-light-color;
    }
  }
</style>
