<template>
  <div class="app-container editQuoted">
    <div class="edit-title">
      {{$t('query.tableLabel.Quotation')}}
      <div class="detail-status">{{editForm.quoteStatus | statusName(language)}}</div>
    </div>
    <el-form ref="editForm" :model="editForm" :label-width="isZh?'100px':'140px'" size="small" label-position="left">
      <el-row>
        <el-col :span="12" v-if="editType">
          <el-form-item :label="$t('query.tableLabel.quotationNumber')">
            {{editForm.quotationNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="editType">
          <el-form-item :label="$t('query.tableLabel.QuotationTime')">
            {{editForm.quotationTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" style="margin-bottom: -12px !important">
          <el-form-item :label="$t('logistics.logisticsOrder.orderType')">
            <el-radio-group v-model="editForm.orderType" disabled>
              <el-radio :label="0">{{$t('query.tableLabel.RawMaterialSalesList')}}</el-radio>
              <el-radio :label="1">{{$t('query.tableLabel.MerchandiseSalesList')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10" style="width: 59.66667%">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 90%;text-align: left">
            <tr>
              <td width="20%" style="min-width: 100px">{{$t('logistics.logisticsTrace.buyer')}}</td>
              <td width="80%">
                {{editForm.buyerName}}
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerContactBy')}}</td>
              <td>
                <!--{{editForm.inquiryCustomerName}}-->
                {{editForm.buyerContactBy}}
                <!-- <el-select v-model="editForm.buyerContact" size="mini" disabled :placeholder="$t('query.placeholder.buyType')" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
                </el-select> -->
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerTelephone')}}</td>
              <td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerEmail')}}</td>
              <td>{{editForm.buyerEmail}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerAddress')}}</td>
              <td>{{editForm.buyerAddress}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="10" style="width: 59.66667%">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 90%;text-align: left">
            <tr>
              <td width="20%" style="min-width: 100px">{{$t('logistics.logisticsTrace.seller')}}</td>
              <td width="80%">
                {{editForm.sellerName}}
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerContact')}}</td>
              <td>
                {{editForm.sellerContact}}
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerTelephone')}}</td>
              <td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerEmail')}}</td>
              <td>{{editForm.sellerEmail}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerAddress')}}</td>
              <td>{{editForm.sellerAddress}}</td>
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
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column align="center" type="selection" width="50"/>

        <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55"/>

        <el-table-column align="center" width="150" :label="$t('logistics.logisticsOrder.productName')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{language==='zh'?scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" :label="$t('query.tableLabel.describeSKU')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{language==='zh'?scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <!--<el-table-column v-if="editForm.quotedType === 1" min-width="80" align="center" label="起订量" prop="mininum" />-->

        <!--<el-table-column v-if="editForm.quotedType === 2" min-width="80" align="center" label="询价量" prop="orderNumber" />-->

        <el-table-column align="center" width="130" :label="$t('query.tableLabel.QuotationQuantity')" prop="quotedQuantity" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unit')" >
          <template slot-scope="scope">
            {{scope.row.productUnit}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.PreviousOffer')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.lastQuotedPrice}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.UnitQuotedPrice')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedPrice}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.QuotedPrice')" prop="productAmount" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('query.tableLabel.QuotedRemarks')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedRemark}}
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination :total="editForm.total" :page.sync="editForm.pageNum" :limit.sync="editForm.pageSize" @pagination="getDetail"></Pagination>-->
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
            <!--{{editForm.estimatedAmountAll}}-->
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('inquiry.inquiryOrder.dateOfDelivery')" prop="dateOfDelivery">
            <el-input v-model="editForm.dateOfDelivery" readonly class="edit-form-width" style="width: 700px;"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.DeparturePort')" prop="departurePort">
            <el-input v-model="editForm.departurePort" readonly :placeholder="$t('query.placeholder.DeparturePort')" class="edit-form-width" style="width: 700px;"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="destinationPort">
            <el-input v-model="editForm.destinationPort" readonly :placeholder="$t('query.tableLabel.DestinationPortAddr')" class="edit-form-width" style="width: 700px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="transportation">
            <el-select v-model="editForm.transportation" disabled :placeholder="$t('query.placeholder.entrustTransportation')" class="edit-form-width">
              <el-option label="SGI" :value="0"></el-option>
              <el-option :label="$t('inquiry.inquiryOrder.SelfMention')" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.transportationWay')" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" disabled :placeholder="$t('query.placeholder.transportationWay')" class="edit-form-width">
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
            <!--<el-input v-model="editForm.otherTerms" readonly="" clearable style="width: 80%" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-form-item :label="$t('query.tableLabel.payment')">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
          <tr style="background-color: #a7bfee;text-align: left">
            <th>{{$t('common.table.id')}}</th>
            <th>{{$t('inquiry.inquiryOrder.nodeName')}}</th>
            <th>{{$t('inquiry.inquiryOrder.paymentRatio')}}</th>
            <th>{{$t('inquiry.inquiryOrder.dayNum')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in controlTowerList" :key="index" style="text-align: left">
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
        <!--<el-col :span="12">-->
          <!--<el-form-item :label="$t('query.tableLabel.freight')">-->
            <!--{{editForm.transportationCost}}-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item :label="$t('query.tableLabel.TotalOrders')">-->
            <!--{{quoteMoneyTotal}}-->
            <!--&lt;!&ndash;{{editForm.estimatedAmountAll}}&ndash;&gt;-->
          <!--</el-form-item>-->
        <!--</el-col>-->
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

      <ApprovalHistory></ApprovalHistory>

      <el-form-item style="text-align: center">
        <el-button type="primary" v-if="editForm.quoteStatus === 3" size="small" @click="setOrder">{{$t('query.tableLabel.PlacingOrder')}}</el-button>
        <el-button type="primary" v-if="editForm.quoteStatus === 3" size="small" @click="againQuote">{{$t('query.tableLabel.Requote')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import ApprovalHistory from '@/components/ApprovalHistory'
import { selectCurrencyCodeListApi, approvalSelectList, getSupplyCompanyList } from '@/api/system'
import { listCustomerInfoContactApi, getCustomerInfo } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { detailQuotedPrice } from '@/api/inquiry'
export default {
  components: {
    ApprovalHistory
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusName(val, language) {
      switch (Number(val)) {
        case 1: return language === 'zh' ? '编辑中' : 'Editing';
        case 2: return language === 'zh' ? '审批中' : 'to approve';
        case 3: return language === 'zh' ? '已报价' : 'Quoted price';
        // case 4: return language === 'zh' ? '待重新报价' : 'To be re-quoted';
        case 5: return language === 'zh' ? '废弃' : 'Discard';
        case 6: return language === 'zh' ? '拒绝报价' : 'Refusal of quotation';
        // case 7: return language === 'zh' ? '审批通过' : 'Audit pass';
        case 8: return language === 'zh' ? '审批未通过' : 'Audit failed';
        // case 9: return language === 'zh' ? '已拒绝' : 'Rejected';
        case 10: return language === 'zh' ? '待通知' : 'Wait notification';
        default:
          return language === 'zh' ? '数据异常' : 'Data abnormity';
      }
    }
  },
  data() {
    return {
      dataList: [],
      listLoading1: false,
      dialogVisible: false,
      loading1: false,
      loading2: false,
      editType: false,
      countryList: [],
      currencyCodeList: [],
      customerInfoList: [],
      approvalSelectList: [],
      modalList: [],
      parentsName: [],
      searchDataList: [],
      selectList: [],
      productSkuList: [],
      delSkuList: [],
      controlTowerList: [],
      editForm: {
        quotationNo: '',
        quotationTime: '',
        costomerBId: '',
        buyerContact: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sysCompanyBId: '',
        transportationWay: 3,
        transportation: 0,
        departurePort: '',
        destinationPort: '',
        emailAddress: '',
        currency: '',
        exchangeRate: 0,
        dateOfDelivery: '',
        effectiveDate: '',
        paymentCondition: '',
        isApproval: 1,
        approvalBId: '',
        quotedRemarks: '',
        transportationCost: 0,
        otherTerms: ''
      },
      editRules: {
        departurePort: [
          { required: true, message: '出发港口/地址', trigger: 'change' }
        ],
        destinationPort: [
          { required: true, message: '目的港口/地址', trigger: 'change' }
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
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      customTime: [],
      sysCustomerInfoList: [],
      paymentMethodList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
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
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.transportationCost);
      return val
    }
  },
  watch: {
    'editForm.costomerBId' (val, oldVal) {
      if (val && !oldVal) {
        this.customerContactFun(val);
      } else if (val && oldVal) {
        this.customerContactFun(val);
      }
    }
  },
  created() {
    this.getCustomerInfoListFun();
    this.getApprovalSelectList();
    this.getSysCustomerInfoListFun();
    if (this.$route.query.id) {
      this.editType = true;
      this.getDetail()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/query/quoted'
        })
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    againQuote() {
      this.$router.push({
        path: '/query/editQuoted',
        query: {
          id: this.editForm.bid,
          flag: true,
          orderType: this.editForm.orderType
        }
      });
    },
    setOrder() {
      if (!this.selectList.length) {
        let msg = this.language === 'zh' ? '请先选择商品再下订单' : 'Please select the goods before placing the order.'
        return this.$message.warning(msg)
      }
      this.$store.commit('SET_QUOTE_SKU', this.selectList);
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/sale/editOrder',
          query: {
            quoteId: this.$route.query.id,
            orderType: this.editForm.orderType
          }
        });
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
    customerContactFun(val) {
      getCustomerInfo({ bid: val }).then(res => {
        this.modalList = res.data.customerContactList || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
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
        this.editForm.paymentCondition = String(res.data.paymentCondition);
        this.editForm.transportationWay = String(res.data.transportationWay);
        this.editForm.buyerContact = res.data.inquirerBId;
        this.controlTowerList = res.data.quotedOrderPayNodeList || [];
        this.dataList = res.data.quotedPriceDetailList.map(e => {
          e.productAmount = (Number(e.quotedQuantity * e.quotedPrice * 100) / 100).toFixed(4);
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editQuoted {
    width: 90%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
      position: relative;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid $border-light-color;
      .detail-status {
        position: absolute;
        right: 5%;
        top: 25%;
        font-size: 16px;
        line-height: 24px;
        color: #ff3a3d;
        width: 100px;
        border: 1px solid #ff3a3d;
        transform:rotate(45deg);
      }
    }
    .edit-form {
      margin-top: 20px;
    }
    .edit-form-width {
      width: 350px;
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
