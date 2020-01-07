<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('order.sale.clientName')">
            <el-input v-model.trim="postData.customerUserName" clearable :placeholder="$t('order.sale.clientName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('order.sale.orderNo')">
            <el-input v-model.trim="postData.orderNo" clearable :placeholder="$t('order.sale.orderNo')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.table.status')">
            <el-select v-model="postData.orderStatus" clearable :placeholder="$t('common.table.status')" style="width: 200px">
              <el-option :label="isZh?'全部':'All'" value=""></el-option>
              <el-option v-for="(item, index) in orderStatusList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('order.sale.country')" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.customerCountryCode" clearable
                       :placeholder="$t('order.sale.countryPlaceholder')"
                       style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
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
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="goAddRouter">{{$t('common.add')}}</el-button>-->
      <el-button type="primary" size="small" @click="deleteClick">{{$t('common.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">{{$t('common.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
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
      <el-table-column :label="$t('order.sale.orderNo')" prop="orderNo" show-overflow-tooltip/>

      <el-table-column :label="$t('order.sale.clientName')" prop="buyerName" show-overflow-tooltip/>

      <el-table-column :label="$t('order.sale.country') + '/' + $t('order.sale.country')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.buyerCountryCode}}/{{scope.row.buyerTelephone}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('order.sale.skuTotal')" prop="prodcutSkuCount" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('order.sale.amount')" prop="totalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.createdBy')" prop="createUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('order.sale.orderDate')" prop="createTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :width="isZh?'100px':'120px'" :label="$t('common.table.status')" prop="statusStr">
        <template slot-scope="scope">
          {{scope.row.orderStatus | statusFmt(orderStatusList, isZh)}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh?'270px': '350px'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            class="table-btn-width"
            v-if="scope.row.orderStatus === 1"
            @click="goRouter(1, scope.row.bid, scope.row.salesOrderType)">
            {{$t('common.table.edit')}}
          </el-button>
          <!--<el-button type="primary" size="mini" v-if="scope.row.orderStatus === 4" @click="goRouter(4, scope.row.bid)">{{$t('order.sale.confirm')}}</el-button>-->
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus > 6 && scope.row.orderStatus < 21" @click="openDialog(scope.row.bid)">{{$t('order.sale.statusAction')}}</el-button>
          <!--<el-button type="primary" size="mini" v-if="scope.row.orderStatus > 6 && scope.row.orderStatus < 21" @click="openPayDialog(scope.row)">{{$t('order.purchase.paymentInstructions')}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('order.sale.saleStatusAction')" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('order.sale.orderNo')">
              {{detailForm.orderNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('order.sale.orderDate')">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('order.sale.buyer')}}</td>
                <td width="60%">
                  {{detailForm.buyerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contact')}}</td>
                <td>
                  {{detailForm.buyerContactBy}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.address')}}</td><td>{{detailForm.buyerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contactPhone')}}</td><td>{{detailForm.buyerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.email')}}</td><td>{{detailForm.buyerEmail}}</td>
              </tr>
              <tr>
                <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
                <td>
                  {{detailForm.buyerBank}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.bankAccount')}}</td><td>{{detailForm.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.swiftCode')}}</td><td>{{detailForm.buyerSwiftcode}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.destination')}}</td><td>{{detailForm.arrivePort}}</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('order.sale.seller')}}</td>
                <td width="60%">
                  {{detailForm.sellerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contact')}}</td><td>{{detailForm.sellerContact}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.address')}}</td><td>{{detailForm.sellerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contactPhone')}}</td><td>{{detailForm.sellerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.email')}}</td><td>{{detailForm.sellerEmail}}</td>
              </tr>
              <tr>
                <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
                <td>
                  {{detailForm.sellerBank}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.bankAccount')}}</td><td>{{detailForm.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.swiftCode')}}</td><td>{{detailForm.sellerSwifcode}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.departure')}}</td><td>{{detailForm.departurePort}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <div class="step-node">
          {{$t('order.sale.orderPrecess')}}
          <el-button type="primary" size="mini" style="float: right" @click="openFiles(detailForm.bid)">{{$t('order.sale.relatedFileUpload')}}</el-button>
        </div>

        <div style="margin: 20px 0; border-bottom: 1px solid #eee;">
          <order-step :list="allNodeList" :can-click="true" :sale-type="1"></order-step>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="payDialogVisible" :title="$t('order.purchase.applyPayments')" width="900px" center :close-on-click-modal="false">
      <div class="payment-box">
        <div class="payment-order">
          <div class="payment-order-item">
            <div>
              <div class="item-label">{{$t('order.sale.orderNo')}}</div>
              <div class="item-text">{{paymentData.orderNo}}</div>
            </div>
            <div>
              <div class="item-label">{{$t('order.sale.orderDate')}}</div>
              <div class="item-text">{{paymentData.createTime | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">{{$t('order.purchase.nowNode')}}</div>
              <div class="item-text">{{paymentData.orderStatus | statusFmt(orderStatusList, isZh)}}</div>
            </div>
            <div>
              <div class="item-label">{{$t('order.purchase.applier')}}</div>
              <div class="item-text">{{userInfo.userName}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('order.sale.seller')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.supplierName')}}</div>
              <div class="item-text">{{paymentData.sellerName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.sale.contact')}}</div>
              <div class="item-text">{{paymentData.buyerContactBy}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.contactNo')}}</div>
              <div class="item-text">{{paymentData.buyerTelephone}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.sale.address')}}</div>
              <div class="item-text">{{paymentData.buyerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.sale.country')}}</div>
              <div class="item-text">{{paymentData.sellerCountryCode}}</div>
            </div>
          </div>
          <div>
            <div>{{$t('order.purchase.accountInfo')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.bankName')}}</div>
              <div class="item-text">{{paymentData.sellerBank}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.branchBank')}}</div>
              <div class="item-text">{{paymentData.branchName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.accountNo')}}</div>
              <div class="item-text">{{paymentData.sellerBankAccount}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.sale.address')}}</div>
              <div class="item-text">{{paymentData.sellerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.sale.swiftCode')}}</div>
              <div class="item-text">{{paymentData.sellerSwifcode}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('order.purchase.paymentInfo')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.orderAmount')}}</div>
              <div class="item-text">{{paymentForm.amountAll | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.orderCurrency')}}</div>
              <div class="item-text">{{paymentData.orderCurrency}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.pendingPay')}}</div>
              <div class="item-text">{{paymentForm.pendingPayment | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.applyPayment')}}</div>
              <div class="item-text">
                <el-input v-model.number="paymentForm.applyPaymentAmount" type="number" min="0" size="small" clearable style="width: 200px"/>
              </div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('order.purchase.applyTime')}}</div>
              <div class="item-text">
                <el-date-picker v-model="paymentForm.paymentTime" type="datetime" style="width: 200px"/>
              </div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('query.tableLabel.AppendixUpload')}}</div>
            <div style="float: right !important;">
              <el-upload
                class="upload-demo"
                ref="upload"
                :show-file-list="false"
                :action="uploadActionUrl"
                :data="{type: 2}"
                :headers="upLoadHeaders"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :file-list="paymentForm.paymentDocList">
                <el-button size="small" type="primary">{{$t('query.tableLabel.ClickUpload')}}</el-button>
              </el-upload>
            </div>
          </div>

        </div>
        <div>
          <el-table
            :data="paymentForm.paymentDocList"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" :label="$t('query.tableLabel.AnnexName')" prop="attachmentName">
            </el-table-column>
            <el-table-column align="center" :label="$t('common.table.actions')" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
                <el-button type="primary" size="mini" @click="removeFile(scope)">{{$t('common.table.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addOrderPayment">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="payDialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import { parseTime, deepClone } from '@/utils/index'
import { selectCountryListApi, getSupplyCompanyList, selectgetDictionaryBykeyApi, selectCompanyBankAccountListApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { getSaleOrderList, deleteSaleOrder, saleOrderDetail, allNodeSaleOrder } from '@/api/transitrade'
import { getLinkList } from "@/api/supplier";
import { getPaymentAmount, addPaymentInstruction } from '@/api/finance'
import { uploadActionUrl } from '@/api/common'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination,
    OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      list: null,
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      payDialogVisible: false,
      rangeTime: [],
      selectList: [],
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        customerUserName: '',
        orderNo: '',
        orderStatus: '',
        customerCountryCode: '',
        orderEndTime: '',
        orderStartTime: ''
      },
      dataList: [],
      countryList: [],
      detailForm: {},
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
      orderStatusList: [],
      paymentData: {
        branchName: ''
      },
      paymentForm: {
        paymentTime: '',
        applyPaymentAmount: '',
        paymentOrderType: 3,
        paymentCurrency: '',
        amountAll: 0,
        pendingPayment: 0,
        associatedOrderBId: '',
        customerBId: '',
        customerName: '',
        paymentDocList: [],
        attachmentName: '',
        attachmentPath: ''
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  watch: {
    isZh() {
      this.getDataList()
    }
  },
  created() {
    this.getOrderStatusList();
    this.getDataList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getCountryList()
  },
  methods: {
    // 点击 相关文件上传 到按钮跳转上传列表页面操作
    openFiles(id) {
      this.$router.push({
        path: '/order/sale/relevantFiles',
        query: {
          id: id,
          saleType: 1
        }
      });
    },
    goRouter(type, id, orderType) {
      let path = type === 1 ? '/order/transitrade/editOrder' : '/order/transitrade/transitradeOrderDetail';
      this.$router.push({
        path: path,
        query: {
          id, type, orderType
        }
      });
    },
    goAddRouter() {
      this.$router.push({
        path: '/order/transitrade/editOrder',
        query: {
          editType: true
        }
      });
    },
    getOrderStatusList() {
      selectgetDictionaryBykeyApi({ key: 'order status' }).then(res => {
        this.orderStatusList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
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
    // 客户下的联系人列表
    customerContactFun(val) {
      let api = this.detailForm.salesOrderType ? listCustomerContact : getLinkList;
      let obj = this.detailForm.salesOrderType ? { customerBId: val } : { supplierBId: val };
      api(obj).then(res => {
        this.modalList = this.detailForm.salesOrderType ? res.data.list : res.data
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
      this.getAllNodeSaleOrder(id)
    },
    getSaleOrderDetail(id) {
      saleOrderDetail({ orderBid: id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.dialogVisible = true;
        this.customerContactFun(this.detailForm.customerBId);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getAllNodeSaleOrder(id) {
      allNodeSaleOrder({ orderBid: id }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map((e, index) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    openPayDialog(row) {
      this.payDialogVisible = true;
      this.paymentData = deepClone(row);
      this.paymentForm.paymentCurrency = this.paymentData.orderCurrency;
      this.paymentForm.amountAll = this.paymentData.totalAmount;
      this.paymentForm.customerBId = this.paymentData.sysCompanyBId;
      this.paymentForm.customerName = this.paymentData.sellerName;
      this.paymentForm.associatedOrderBId = this.paymentData.bid;
      this.paymentForm.paymentAssociatedOrders = this.paymentData.orderNo;
      this.selectSurplusAmountFun(row.bid);
      this.getSupplierBankList(row.sysCompanyBId);
    },
    // 通过转单bid获取当前付款金额
    selectSurplusAmountFun(id) {
      getPaymentAmount({ associatedOrderBId: id, type: 3 }).then(res => {
        this.paymentForm.pendingPayment = res.data;
      });
    },
    getSupplierBankList(val, type) {
      selectCompanyBankAccountListApi({ companyInfoBId: val, pageNum: 1, pageSize: 999 }).then(res => {
        let obj = res.data.list.filter(e => e.id === this.paymentData.sellerBankId)[0];
        if (obj) {
          this.paymentData.branchName = obj.branchName
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    addOrderPayment() {
      const { paymentTime, applyPaymentAmount } = this.paymentForm;
      if (!paymentTime || !applyPaymentAmount) {
        return this.$message.warning(this.$t('order.tip.emptyTip'))
      }
      addPaymentInstruction(this.paymentForm).then(res => {
        this.$message.success(this.$t('common.tip.submitTip'));
        this.paymentForm.paymentTime = '';
        this.paymentForm.applyPaymentAmount = '';
        this.payDialogVisible = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.deleteDataTip'));
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].orderStatus !== 1) {
          return this.$message.warning(this.$t('price.tip.editDeleteTip'));
        }
      }
      this.$confirm(this.$t('common.tip.isDeleteMsg'), 'Tips', {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          ids: this.selectList.map(e => e.id).join(',')
        };
        deleteSaleOrder(obj).then(res => {
          this.getDataList();
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
    searchData() {
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
      getSaleOrderList(obj).then(res => {
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
    },
    // 下载附件
    exportPactFile(row) {
      this.downFile(row.attachmentPath)
    },
    // 删除附件
    removeFile(scope) {
      this.paymentForm.paymentDocList.splice(scope.$index, 1)
    },
    // 上传文件删除
    handleRemove() {
      this.paymentForm.attachmentName = '';
      this.paymentForm.attachmentPath = '';
    },
    // 上传成功
    handleSuccess(res, file) {
      this.paymentForm.attachmentName = file.name;
      this.paymentForm.attachmentPath = res.data.filePath;
      this.paymentForm.paymentDocList.push({ attachmentName: this.paymentForm.attachmentName, attachmentPath: this.paymentForm.attachmentPath });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.paymentForm.paymentDocList.length; i++) {
        if (this.paymentForm.paymentDocList[i].attachmentName === file.name) {
          this.$message.error(this.$t('query.formMessage.repeatedly'));
          return false
        }
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message({
          message: this.$t('query.formMessage.fileSize'),
          type: 'warning'
        });
      }
      // return (extension || extension2 || extension3 || extension4) && isLt2M
      return isLt2M
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
