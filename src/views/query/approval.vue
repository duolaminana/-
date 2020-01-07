<template>
  <div class="app-container editInquiry">
    <div class="edit-title">{{$t('query.tableLabel.Quotation')}}</div>
    <el-form ref="editForm" :model="editForm" :label-width="isZh?'100px':'180px'" size="small" :rules="editRules" label-position="left" class="edit-form" v-loading="loading">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('query.tableLabel.quotationNumber')">
            {{editForm.quotationNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('query.tableLabel.QuotationTime')">
            {{editForm.quotationTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%;text-align: left">
            <tr>
              <td width="40%" style="min-width: 100px">{{$t('logistics.logisticsTrace.buyer')}}</td>
              <td width="60%">
                {{editForm.buyerName}}
                <!-- <el-select v-model="editForm.buyerBId" disabled :placeholder="$t('query.placeholder.userCompany')" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select> -->
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerContactBy')}}</td>
              <td>
                <!--<el-select v-model="editForm.buyerContact" disabled :placeholder="$t('query.placeholder.buyType')" class="edit-form-width input-center">-->
                  <!--<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>-->
                <!--</el-select>-->
                {{editForm.buyerContactBy}}
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerAddress')}}</td>
              <td>{{editForm.buyerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerTelephone')}}</td>
              <td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerEmail')}}</td>
              <td>{{editForm.buyerEmail}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%;text-align: left">
            <tr>
              <td width="40%" style="min-width: 100px">{{$t('logistics.logisticsTrace.seller')}}</td>
              <td width="60%">
                <el-select v-model="editForm.sysCompanyBId" disabled :placeholder="$t('query.placeholder.business')" class="edit-form-width">
                  <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerContact')}}</td>
              <td>
                {{editForm.sellerContact}}
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerAddress')}}</td>
              <td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerTelephone')}}</td>
              <td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerEmail')}}</td>
              <td>{{editForm.sellerEmail}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <div class="table-top">
        <div class="top-title">{{$t('inquiry.inquiryOrder.inquiryPriceDetails')}}</div>
      </div>
      <el-table
        :data="dataList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55"/>

        <!--<el-table-column align="center" type="selection" width="50"/>-->

        <!--<el-table-column align="center" min-width="285px" label="商品信息" prop="inqueryNo" >-->
        <!--<template slot-scope="scope">-->
        <!--<div class="table-goods">-->
        <!--<div class="goods-img"><img :src="fullUrl(scope.row.productImge)" alt=""></div>-->
        <!--<div class="goods-text">-->
        <!--<div>{{scope.row.productName}}</div>-->
        <!--<div>{{scope.row.attrValueList}}</div>-->
        <!--<div>商品编码：{{scope.row.productCode}}</div>-->
        <!--<div>海关编码：{{scope.row.customsCode}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" width="150" :label="$t('logistics.logisticsOrder.productName')" prop="inqueryNo" show-overflow-tooltip>
          <template slot-scope="scope">
            {{language === 'zh' ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" :label="$t('query.tableLabel.describeSKU')" :prop="language === 'zh' ? 'cnAttrValueList' : 'enAttrValueList'" show-overflow-tooltip/>

        <el-table-column align="center" width="140" :label="$t('query.tableLabel.QuotationQuantity')" prop="quotedQuantity" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unit')" >
          <template slot-scope="scope">
            {{scope.row.productUnit}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.PreviousOffer')" prop="lastQuotedPrice" show-overflow-tooltip/>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.UnitQuotedPrice')" prop="quotedPrice">
          <template slot-scope="scope">
            {{scope.row.quotedPrice}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.QuotedPrice')" prop="productAmount"/>

        <el-table-column align="center" :label="$t('query.tableLabel.QuotedRemarks')" prop="quotedRemark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quotedRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" readonly clearable style="font-size: 12px"/>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item/>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('query.tableLabel.freight')">
            {{editForm.transportationCost}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('query.tableLabel.TotalOrders')">
            {{quoteMoneyTotal}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('inquiry.inquiryOrder.dateOfDelivery')" prop="dateOfDelivery">
            <el-input v-model="editForm.dateOfDelivery" readonly class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.DeparturePort')" prop="departurePort">
            <el-input v-model="editForm.departurePort" readonly :placeholder="$t('query.placeholder.DeparturePort')" class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="destinationPort">
            <el-input v-model="editForm.destinationPort" readonly :placeholder="$t('query.tableLabel.DestinationPortAddr')" class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="transportation">
            <el-select v-model="editForm.transportation" disabled class="edit-form-width">
              <el-option label="SGI" :value="0"></el-option>
              <el-option :label="$t('inquiry.inquiryOrder.SelfMention')" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.transportationWay')" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" disabled class="edit-form-width">
              <el-option v-for="(item, index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('finance.financeService.currency')" prop="currency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.currency" disabled :placeholder="$t('query.placeholder.currency')" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.paymentCondition')" prop="paymentCondition">
            <el-select v-model="editForm.paymentCondition" disabled :placeholder="$t('query.placeholder.payModeArr')" class="edit-form-width">
              <el-option v-for="(item, index) in paymentList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.effectiveDate')" prop="effectiveDate">
            <el-date-picker v-model="editForm.effectiveDate" disabled type="datetime" clearable :placeholder="$t('inquiry.inquiryOrder.effectiveDate')" class="edit-form-width" :picker-options="pickerOptionsEnd"/>
          </el-form-item>
        </el-col>
        <!--<el-col>-->
          <!--<el-form-item label="其他条款" prop="otherTerms">-->
            <!--<el-input v-model="editForm.otherTerms" readonly style="width: 80%" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-form-item :label="$t('query.tableLabel.payment')">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
          <tr>
           <th>{{$t('common.table.id')}}</th>
            <th>{{$t('inquiry.inquiryOrder.nodeName')}}</th>
            <th>{{$t('inquiry.inquiryOrder.paymentRatio')}}</th>
            <th>{{$t('inquiry.inquiryOrder.dayNum')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in controlTowerList" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.nodeName}}</td>
            <td>
              {{item.paymentRatio}}%
            </td>
            <td>
              {{item.dayNum || 0}}{{$t('inquiry.inquiryOrder.day')}}
            </td>
          </tr>
          <tr v-if="!controlTowerList.length">
            <td colspan="4" style="text-align: center;padding: 5px">{{$t('common.noData')}}</td>
          </tr>
          </tbody>
        </table>
      </el-form-item>
      <el-row>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.QuotedRemarks')" prop="quotedRemarks">
            <el-input v-model="editForm.quotedRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" readonly style="width: 80%"/>
          </el-form-item>
        </el-col>
<!--        <el-col>-->
<!--          <el-form-item label="是否审核" prop="ifAudit">-->
<!--            <el-radio-group v-model="editForm.isApproval" disabled>-->
<!--              <el-radio :label="1">是</el-radio>-->
<!--              <el-radio :label="0">否</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col>-->
<!--          <el-form-item label="选择审批流程" prop="approvalBId" v-if="editForm.isApproval">-->
<!--            <el-select v-model="editForm.approvalBId" disabled filterable placeholder="请选择" style="width: 300px">-->
<!--              <el-option v-for="(item,index) in approvalSelectList" :key="index" :label="item.approvalName" :value="item.bid">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>
    </el-form>
    <approval-flow @close="closePage"></approval-flow>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import ApprovalFlow from '@/components/ApprovalFlow'
import { selectCurrencyCodeListApi, approvalSelectList, getSupplyCompanyList } from '@/api/system'
import {
  listCustomerInfoContactApi
  // getCustomerInfo
} from '@/api/customer'
import { parseTime } from '@/utils/index'
import { detailQuotedPrice, saveQuotedPrice, updateQuotedPrice } from '@/api/inquiry'
// import { supplierDetailById } from "@/api/supplier";
export default {
  components: {
    // Pagination,
    ApprovalFlow
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
      listLoading1: false,
      loading: true,
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      customerInfoList: [],
      approvalSelectList: [],
      sysCustomerInfoList: [],
      controlTowerList: [],
      modalList: [],
      editForm: {
        quotationNo: '',
        quotationTime: '',
        buyerBId: '',
        userBId2: '',
        contactAddress: '',
        mobilePhone: '',
        contactBy: '',
        transportationWay: 2,
        transportation: 0,
        departurePort: '',
        destinationPort: '',
        emailAddress: '',
        currency: '',
        exchangeRate: 0,
        dateOfDelivery: 0,
        paymentCondition: '',
        isApproval: 1,
        approvalBId: '',
        quotedRemarks: '',
        transportationCost: 0,
        remarks: '',
        quotedStatus: 1
      },
      editRules: {
        buyerBId: [
          { required: true, message: '请选择购买公司', trigger: 'change' }
        ],
        userBId2: [
          { required: true, message: '请选择购买人', trigger: 'change' }
        ],
        contactAddress: [
          { required: true, message: '请填写联系地址', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请填写联系电话', trigger: 'blur' }
        ],
        contactBy: [
          { required: true, message: '请填写联系人', trigger: 'blur' }
        ],
        departurePort: [
          { required: true, message: '出发港口', trigger: 'change' }
        ],
        destinationPort: [
          { required: true, message: '目的港口', trigger: 'change' }
        ],
        emailAddress: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ],
        exchangeRate: [
          { required: true, message: '请填写邮汇率', trigger: 'blur' }
        ],
        dateOfDelivery: [
          { required: true, message: '请填写付款限制天数', trigger: 'blur' }
        ],
        paymentCondition: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        approvalBId: [
          { required: true, message: '请选择审批流程', trigger: 'change' }
        ]
      },
      customTime: [],
      inquiryStatusList: [
        {
          label: '待报价',
          inquiryStatus: 1
        },
        {
          label: '审批中',
          inquiryStatus: 2
        },
        {
          label: '已报价',
          inquiryStatus: 3
        },
        {
          label: '重新待报价',
          inquiryStatus: 4
        },
        {
          label: '重新待审批',
          inquiryStatus: 5
        },
        {
          label: '已重新报价',
          inquiryStatus: 6
        },
        {
          label: '废弃',
          inquiryStatus: 7
        },
        {
          label: '拒绝报价',
          inquiryStatus: 8
        }
      ],
      quoteTypeList: [
        // 报价类型（0-EXW,1-FOB）
        {
          label: 'EXW',
          quoteType: 0
        },
        {
          label: 'FOB',
          quoteType: 1
        }
      ],
      paymentMethodList: [
        {
          label: 'T/T',
          paymentCondition: 1
        },
        {
          label: 'L/C',
          paymentCondition: 2
        },
        {
          label: 'P/A',
          paymentCondition: 3
        },
        {
          label: 'D/A',
          paymentCondition: 4
        }
      ],
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.editForm.effectiveDate) {
            return time.getTime() < this.editForm.effectiveDate
          }
        }
      }
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    },
    transportList() {
      return this.$store.state.order.transportList
    },
    paymentList() {
      return this.$store.state.order.paymentList
    },
    quoteMoneyTotal() {
      let val = 0;
      this.dataList.forEach(e => {
        val += e.productAmount
      });
      val += Number(this.editForm.transportationCost);
      return val
    }
  },
  // watch: {
  //   'editForm.buyerBId' (val, oldVal) {
  //     if (val && !oldVal) {
  //       this.customerContactFun(val);
  //     } else if (val && oldVal) {
  //       this.customerContactFun(val);
  //       this.editForm.userBId2 = ''
  //     }
  //   }
  // },
  created() {
    this.loading = false;
    this.getDetail();
    this.getCustomerInfoListFun();
    this.getApprovalSelectList();
    this.getSysCustomerInfoListFun()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
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
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    // 客户下的联系人列表
    // customerContactFun(val) {
    //   // let api = this.orderType === 1 ? getCustomerInfo : supplierDetailById;
    //   getCustomerInfo({ bid: val }).then(res => {
    //     this.modalList = res.data.customerContactList || [];
    //   }).catch(err => {
    //     this.$message.error(err.message);
    //   });
    // },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    getDetail() {
      detailQuotedPrice({ quotedPriceBId: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.paymentCondition = res.data.paymentCondition;
        this.editForm.transportationWay = String(res.data.transportationWay);
        if (res.data.buyerSupplierBId) {
          this.modalList = res.data.supplierInfo.supplierContactList
        } else {
          this.modalList = res.data.customerInfoVo.customerContactList
        }
        if (res.data) {
          this.controlTowerList = res.data.quotedOrderPayNodeList || [];
          this.editForm.buyerContact = res.data.inquirerBId;
          this.editForm.sysCompanyBId = res.data.sellerBId;
          // this.dataList = res.data.quotedPriceDetailList.map(e => {
          //   e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
          //   e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
          //   e.mininumMoney = (e.mininum * e.unitPrice * 100) / 100;
          //   e.quoteMoney = Number(e.quoteNumber) * Number(e.quotePrice * 100) / 100;
          //   e.imagePath = e.productImge;
          //   return { ...e }
          // });
          this.dataList = res.data.quotedPriceDetailList.map(e => {
            e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
            e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
            e.mininumMoney = (e.mininum * 100) * (e.unitPrice * 100) / 100;
            e.productAmount = Number(e.quotedQuantity * 100) * Number(e.quotedPrice * 100) / 10000;
            // if (this.$route.query.flag) {
            //   e.lastQuotedNumber = e.quotedQuantity;
            //   e.lastQuotedPrice = e.quotedPrice;
            //   e.lastQuotedRemark = e.quoteRemark;
            // }
            return { ...e }
          });
        }
      }).catch(err => {
        this.$message(err.message);
      });
    },
    changeNumber(item, val) {
      this.$nextTick(() => {
        item.productAmount = (item.quoteNumber * item.quotePrice * 100) / 100
      })
    },
    changePrice(item, val) {
      this.$nextTick(() => {
        item.productAmount = (item.quoteNumber * item.quotePrice * 100) / 100
      })
    },
    confirmAdd(formName, status, type) {
      if (!this.dataList.length) {
        let msg1 = this.language === 'zh' ? '请选择调价商品' : 'Please choose the price-adjusted goods.'
        return this.$message.warning(msg1);
      }
      this.$refs[formName].validate((valid) => {
        let api = type ? updateQuotedPrice : saveQuotedPrice;
        this.editForm.quotedStatus = status;
        this.editForm.quotedPriceDetailList = this.dataList;
        this.editForm.inquiryBId = this.editForm.inquiryBId ? this.editForm.inquiryBId : this.$route.query.inquiryId;
        if (valid) {
          this.saveLoading = true;
          api(this.editForm).then(res => {
            let msg2 = this.language === 'zh' ? '提交审批成功' : 'Successful submission of approval'
            this.saveLoading = false;
            this.$message.success(status === 2 ? msg2 : this.$t('system.role.saveSuccess'));
            this.closePage()
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          let msg3 = this.language === 'zh' ? '请填写完整' : 'Please complete the form.'
          this.$message.warning(msg3)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editInquiry {
    width: 90%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid $border-light-color;
    }
    .edit-form {
      margin-top: 20px;
    }
    .edit-form-width {
      width: 300px;
    }
    .row-item {
      margin-bottom: 20px;
    }
    .tableSet {
      text-align: center;
      width: 680px !important;
      thead {
        tr {
          th {
            padding: 3px;
            border-right: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            border-bottom: 1px solid $border-light-color;
          }
          th:first-child {
            border-left: 1px solid $border-light-color;
          }
        }
      }
      tr {
        td {
          padding: 3px;
          border-right: 1px solid $border-light-color;
          border-bottom: 1px solid $border-light-color;
        }
        td:first-child {
          border-left: 1px solid $border-light-color;
        }
      }
    }
    .table-top {
      line-height: 1.5rem;
      padding: 5px;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      .top-title {
        width: 50%;
        text-align: left;
      }
      .top-btns {
        width: 50%;
        text-align: right;
      }
      button {
        margin: 0 10px;
      }
    }
    .table-goods {
      display: flex;
      display: -webkit-flex;
      .goods-img {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods-text {
        margin-left: 10px;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;
        >div {
          font-size: 12px;
        }
      }
    }
  }
</style>
