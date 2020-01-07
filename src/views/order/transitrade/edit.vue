<template>
  <div class="app-container editOrder">
    <div class="edit-title">{{$t('order.sale.transferOrder')}}</div>
    <el-form ref="editForm" :model="editForm" :label-width="isZh?'100px': '150px'" size="small" class="edit-form" label-position="left">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('order.sale.orderNo')">
            {{editForm.orderNo ? editForm.orderNo : 'Null'}}
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="editForm.quotedNo">
          <el-form-item :label="$t('order.sale.quotedOrderNo')">
            {{editForm.quotedNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('order.sale.orderDate')">
            {{(editForm.createTime || new Date()) | timeFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.clientNo')">
            <el-input v-model="editForm.clientPoNo" clearable style="width: 200px" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.clientDate')">
            <el-date-picker v-model="editForm.clientPoDate" type="datetime" clearable style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%;text-align: left">
            <tr>
              <td width="40%" style="min-width: 100px">{{$t('order.sale.buyer')}}</td>
              <td width="60%">
                <el-select v-model="editForm.customerBId" filterable disabled size="mini" class="edit-form-width" @change="setBuyerInfo">
                  <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contact')}}</td>
              <td>
                <!--<el-select v-model="editForm.buyerContactBy" disabled size="mini" class="edit-form-width input-center">-->
                  <!--<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>-->
                <!--</el-select>-->
                {{editForm.buyerContactBy}}
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.address')}}</td><td>{{editForm.buyerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contactPhone')}}</td><td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.email')}}</td><td>{{editForm.buyerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
              <td>
                <el-select v-model="editForm.buyerBankId" disabled size="mini" class="edit-form-width">
                  <el-option v-for="(item, index) in customerBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.bankAccount')}}</td><td>{{editForm.buyerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.swiftCode')}}</td><td>{{editForm.buyerSwiftcode}}</td>
            </tr>
            <!--<tr>-->
              <!--<td>目的港口</td><td>{{editForm.arrivePort}}</td>-->
            <!--</tr>-->
          </table>
        </el-col>
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%;text-align: left">
            <tr>
              <td width="40%;" style="min-width: 100px">{{$t('order.sale.seller')}}</td>
              <td width="60%">
                <el-select v-model="editForm.sysCompanyBId" disabled size="mini" class="edit-form-width">
                  <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contact')}}</td><td>{{editForm.sellerContact}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.address')}}</td><td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contactPhone')}}</td><td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.email')}}</td><td>{{editForm.sellerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
              <td>
                <el-select v-model="editForm.sellerBankId" disabled size="mini" class="edit-form-width">
                  <el-option v-for="(item, index) in sysBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.bankAccount')}}</td><td>{{editForm.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.swiftCode')}}</td><td>{{editForm.sellerSwifcode}}</td>
            </tr>
            <!--<tr>-->
              <!--<td>出发港口</td><td>{{editForm.departurePort}}</td>-->
            <!--</tr>-->
          </table>
        </el-col>
      </el-row>
      <div class="table-top">
        <div class="top-title">{{$t('order.sale.products')}}</div>
        <!--<div class="top-btns">-->
        <!--<el-button type="primary" size="small" @click="openDialog">{{$t('order.sale.addTo')}}</el-button>-->
        <!--</div>-->
      </div>
      <el-table
        :data="orderSkuList"
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

        <el-table-column align="center" width="110" :label="$t('product.product.customsCode')" prop="customsCode">
          <template slot-scope="scope">
            {{scope.row.customsCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('product.product.skuCode')" prop="skuCode">
          <template slot-scope="scope">
            {{scope.row.skuCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" :label="$t('order.sale.productDescription')" prop="productDescription" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="130" :label="$t('order.sale.reference')" prop="clientProductRef">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnSkuReference : scope.row.enSkuReference}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('order.sale.quotedQuantity')" prop="productQuantity">
          <template slot-scope="scope">
            <!--<el-input-number v-model="scope.row.productQuantity" :min="0" size="small" class="hidden-control" @blur="changeNumber(scope.row)"/>-->
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unit')" >
          <template slot-scope="scope">
            {{scope.row.productUnit}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('order.sale.quotedPrice')">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.productPrice" :min="0" size="small" class="hidden-control" @blur="changeNumber(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="100" :label="$t('order.sale.amount')" prop="productAmount"/>

        <el-table-column align="center" min-width="150" :label="$t('common.table.remark')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.cnProductRemark}}
          </template>
        </el-table-column>

        <!--<el-table-column align="center" width="100" :label="$t('common.table.actions')" prop="quotePrice">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button type="primary" size="mini" @click="removeOrderSku(scope.$index)">{{$t('common.delete')}}</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <el-form-item/>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.freight')">
            <el-input v-model.number="editForm.orderFreight" type="number" readonly class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.totalAmount')">
            {{allAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.deliveryDate')" prop="dateOfDelivery">
            <el-input v-model="editForm.dateOfDelivery" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.departure')" prop="departurePort" >
            <el-input v-model="editForm.departurePort" disabled class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.destination')" prop="arrivePort">
            <el-input v-model="editForm.arrivePort" disabled class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.transportBy')" prop="entrustTransportation">
            <el-select v-model="editForm.entrustTransportation" class="edit-form-width" disabled>
              <el-option :label="isZh?'SGI': 'SGI'" :value="0"></el-option>
              <el-option :label="isZh?'自提':'Self'" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.transportationMethod')" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" class="edit-form-width" disabled>
              <el-option v-for="(item,index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.currency')" prop="orderCurrency">
            <el-select disabled remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.orderCurrency" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.payWay')" prop="payMode">
            <el-select v-model="editForm.payMode" class="edit-form-width" disabled>
              <el-option v-for="(item, index) in paymentList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('order.sale.payTerm')">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
          <tr>
            <th>{{$t('common.table.id')}}</th>
            <th>{{$t('order.sale.payNode')}}</th>
            <th>{{$t('order.sale.payPercent')}}</th>
            <th>{{$t('order.sale.payDays')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in controlTowerList" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.nodeName}}</td>
            <td>
              <el-input-number v-model="item.paymentRatio" :min="0" :max="100" :precision="2" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;%
            </td>
            <td>
              <el-input-number v-model="item.paymentTerm" :min="0" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;{{$t('system.business.day')}}
            </td>
          </tr>
          <tr v-if="!controlTowerList.length">
            <td colspan="4" style="text-align: center;padding: 5px">{{$t('common.noData')}}</td>
          </tr>
          </tbody>
        </table>
      </el-form-item>

      <el-row style="margin-top: 16px">
        <el-col>
          <el-form-item :label="$t('order.sale.fileType')">
            <el-checkbox-group v-model="fileTypeCheck" @change="getFileCheckBox">
              <el-checkbox v-for="(item, index) in fileTypeList" :label="item.value" :key="index">
                <span>{{isZh?item.label:item.labelEn}}</span>
                <!--<span v-else>{{newFileType}}</span>-->
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('common.table.remark')" prop="orderRemarks">
            <el-input v-model="editForm.orderRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit(1, 'editForm')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit(2, 'editForm')">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible" :title="$t('order.sale.selectProduct')" width="900px" center close-on-click-modal>
      <el-table
        v-loading="listLoading1"
        :data="quoteSkuList"
        :element-loading-text="$t('system.userManage.lodding')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getDialogSelect">
        <el-table-column align="center" type="selection" width="50"/>

        <el-table-column align="center" min-width="285px" :label="$t('order.sale.productInfo')" prop="inquiryNo" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-text">
                <div style="font-weight: bold">{{$t('product.product.productName')}}：{{isZh ? scope.row.cnProductName : scope.row.enProductName}}</div>
                <div>{{$t('product.categoryTemplate.category')}}：{{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}</div>
                <div>{{$t('product.product.productCode')}}：{{scope.row.productCode}}</div>
                <div>{{$t('product.product.customsCode')}}：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="150px" :label="$t('order.sale.productDescription')">
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-text" style="text-align: center">
                <div>{{isZh ? scope.row.cnAttrValueList: scope.row.enAttrValueList}}</div>
                <div>{{$t('product.product.skuCode')}}：{{scope.row.skuCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" :label="$t('order.sale.startingQuantity')" prop="mininum" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.mininum}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" :label="$t('order.sale.unitPrice')" prop="unitPrice">
          <template slot-scope="scope">
            {{scope.row.unitPrice}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getQuotedProductSku"></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="getOrderSku">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectCompanyBankAccountListApi, selectgetDictionaryBykeyApi, selectSysOrderParameterApi } from '@/api/system'
import { listCustomerInfoContactApi, getCustomerInfo, listCustomerBank } from '@/api/customer'
import { getQuotedProductSku } from '@/api/product'
import { supplierPageList, supplierBankList, getLinkList } from "@/api/supplier";
import { parseTime } from '@/utils/index'
import { addSaleOrder, saleOrderDetail, updateSaleOrder } from '@/api/transitrade'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination
  },
  mixins: [moneyFmt],
  data() {
    return {
      listLoading1: false,
      dialogVisible: false,
      loading1: false,
      loading2: false,
      saveLoading: false,
      editType: false,
      overAllowMoney: false,
      currencyCodeList: [],
      customerInfoList: [],
      supplierList: [],
      modalList: [],
      selectList: [],
      dialogSelectList: [],
      controlTowerList: [],
      quoteSkuList: [],
      orderSkuList: [],
      fileTypeCheck: [],
      newFileType: '',
      editForm: {
        quotedNo: '',
        quotedTime: '',
        customerBId: '',
        supplierBId: '',
        buyerContactBy: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        buyerBankId: '',
        buyerBank: '',
        buyerBankAccount: '',
        buyerSwiftcode: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sellerBankId: '',
        sellerBank: '',
        sellerName: '',
        sellerBankAccount: '',
        sellerSwifcode: '',
        sysCompanyBId: '',
        transportationWay: 2,
        entrustTransportation: 0,
        shippingPort: '',
        purposePort: '',
        emailAddress: '',
        orderCurrency: '',
        exchangeRate: 0,
        dateOfDelivery: 0,
        payMode: '',
        quotedRemarks: '',
        orderFreight: 0,
        toleranceNumber: '',
        choosedAttachment: '',
        orderRemarks: '',
        arrivePort: '',
        departurePort: ''
      },
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      sysCustomerInfoList: [],
      customerBankList: [],
      sysBankList: [],
      fileTypeList: []
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
    selectQuoteSku() {
      return this.$store.state.order.quoteSku
    },
    transportList() {
      return this.$store.state.order.transportList
    },
    paymentList() {
      return this.$store.state.order.paymentList
    },
    totalPayment() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val
    },
    orderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      return val.toFixed(4)
    },
    allAmount() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.orderFreight);
      return val.toFixed(4)
    }
  },
  watch: {
    'editForm.customerBId' (val) {
      if (val) {
        // if (Number(this.$route.query.orderType) === 1) {
        //   this.customerContactFun(val);
        //   this.getCustomerBankList(val)
        // } else {
        //   this.supplierContactFun(val);
        //   this.getSupplierBankList(val)
        // }
        this.getBuyerBankList(val)
      }
    },
    'editForm.sysCompanyBId' (val) {
      if (val) {
        this.getCompanyBankList(val);
      }
    },
    allAmount(val) {
      this.overAllowMoney = (Math.abs((this.editForm.estimatedAmountAll - val) / this.editForm.estimatedAmountAll * 100) > this.editForm.toleranceNumber) && this.editForm.quotedNo
    }
  },
  created() {
    this.getFileTypeList();
    if (Number(this.$route.query.orderType) === 1) {
      this.getCustomerInfoListFun();
    } else {
      this.getSupplierInfoListFun();
    }
    this.getSysCustomerInfoListFun();
    this.getCurrencyCodeList();
    if (this.$route.query.id) {
      this.getSaleOrderDetail();
    }
    this.editType = this.$route.query.editType
  },
  destroyed() {
    this.$store.commit('SET_QUOTE_SKU', null);
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 勾选触发 selects为选择的数据数组
    getDialogSelect(selects) {
      this.dialogSelectList = selects;
    },
    // 获取客户银行列表
    getCustomerBankList(id) {
      listCustomerBank({ customerBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.customerBankList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取主体企业银行卡列表
    getCompanyBankList(id) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.sysBankList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取主体企业银行卡列表
    getBuyerBankList(id) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.customerBankList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商银行卡列表
    getSupplierBankList(val) {
      supplierBankList({ supplierBId: val }).then(res => {
        this.customerBankList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商联系人
    supplierContactFun(val) {
      getLinkList({ supplierBId: val }).then(res => {
        this.modalList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getFileTypeList() {
      selectgetDictionaryBykeyApi({ key: 'allowable attachment' }).then(res => {
        this.getSaleSetting(res.data);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleSetting(fileTypeList) {
      selectSysOrderParameterApi({ orderParameterType: 3 }).then(res => {
        if (res.data) {
          this.editForm.toleranceNumber = res.data.toleranceNumber
        }
        let saleFileType = res.data.sysOrderParameterAnnexList.filter(e => {
          // if (e.dictCode === '8' && e.isAllow) {
          //   this.newFileType = e.customizeName;
          // }
          return e.isAllow
        }).map(t => {
          return t.dictCode
        });
        this.fileTypeList = fileTypeList.filter(e => {
          return saleFileType.includes(e.value)
        });
        this.controlTowerList = res.data.sysOrderPayNodeList.map(e => {
          e.paymentTerm = e.dayNum;
          e.workflowProcessBId = e.controlNodeBId;
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    removeOrderSku(index) {
      this.orderSkuList.splice(index, 1)
    },
    openDialog() {
      this.dialogVisible = true;
      this.dialogSelectList = [];
      this.searchProductSku()
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getQuotedProductSku();
    },
    getQuotedProductSku() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      this.listLoading1 = true;
      getQuotedProductSku(obj).then(res => {
        this.quoteSkuList = res.data.list.map(e => {
          e.mininum = e.mininum || e.miniOrderNumber || 0;
          e.unitPrice = e.unitPrice || 0;
          e.mininumMoney = (e.mininum * e.unitPrice * 100) / 100;
          e.quoteMoney = e.mininumMoney;
          e.enProductDescription = e.enAttrValueList;
          e.cnProductDescription = e.cnAttrValueList;
          e.cnProductRemark = e.inquiryRemark;
          e.productPrice = e.unitPrice;
          e.productQuantity = e.mininum;
          e.singleAmount = e.singlePackage;
          e.skuReference = e.catalogBName;
          e.cnSkuReference = e.cnAttrValueList;
          e.enSkuReference = e.enAttrValueList;
          e.productUnit = e.skuUnit;
          e.productImge = e.imagePath;
          e.productBId = e.bid;
          e.productAmount = (e.productQuantity * e.productPrice).toFixed(4);
          e.id = '';
          return { ...e }
        });
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    getOrderSku() {
      if (!this.dialogSelectList.length) {
        return this.$message.warning(this.$t('order.sale.noProductMsg'))
      }
      let skuBIdArr = this.orderSkuList.map(e => e.skuBId);
      let arr = this.dialogSelectList.filter(t => {
        return !skuBIdArr.includes(t.skuBId)
      });
      this.orderSkuList = this.orderSkuList.concat(arr);
      this.dialogVisible = false;
      this.dialogSelectList = []
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
    getSupplierInfoListFun() {
      supplierPageList({ pageNum: 1, pageSize: 999 }).then(res => {
        this.customerInfoList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    changeNumber(item, val) {
      this.$nextTick(() => {
        item.productAmount = ((item.productQuantity * item.productPrice * 100) / 100).toFixed(4)
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
    getFileCheckBox(arr) {
      if (arr.length) {
        this.editForm.choosedAttachment = arr.join(',')
      } else {
        this.editForm.choosedAttachment = ''
      }
    },
    setBuyerInfo(val) {
      if (val) {
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        this.editForm.buyerContactBy = obj.chargeBy;
        this.editForm.buyerAddress = obj.officeAddress;
        this.editForm.buyerName = obj.companyName || obj.supplierName;
        this.editForm.buyerTelephone = obj.chargePhone;
        this.editForm.buyerEmail = obj.emailAddress;
        this.editForm.buyerCountryCode = obj.countryCode;
        this.editForm.buyerShort = obj.shortName
      } else {
        this.editForm.buyerContactBy = '';
        this.editForm.buyerAddress = '';
        this.editForm.buyerName = '';
        this.editForm.buyerTelephone = '';
        this.editForm.buyerEmail = '';
        this.editForm.buyerCountryCode = '';
        this.editForm.buyerShort = ''
      }
    },
    getSaleOrderDetail() {
      saleOrderDetail({ orderBid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.controlTowerList = this.editForm.transitradeOrderCollectionList;
        this.orderSkuList = this.editForm.transitradeOrderProductsList;
        if (this.editForm.choosedAttachment) {
          this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onSubmit(status, formName) {
      if (status === 2 && !this.orderSkuList.length) {
        return this.$message.warning(this.$t('order.sale.noProductMsg'));
      }
      if (this.totalPayment !== 100) {
        return this.$message.warning(this.$t('customer.customerList.proportion'))
      }
      let obj1 = this.customerInfoList.filter(e => e.bid === this.editForm.customerBId)[0];
      let obj2 = this.sysCustomerInfoList.filter(e => e.bid === this.editForm.sysCompanyBId)[0];
      this.editForm.buyerCountryCode = this.editForm.buyerCountryCode || obj1.cnCountryName;
      this.editForm.buyerShort = this.editForm.buyerShort || obj1.shortName;
      this.editForm.sellerCountryCode = this.editForm.sellerCountryCode || obj2.countryCode;
      this.editForm.sellerName = this.editForm.sellerName || obj2.companyName;
      this.editForm.sellerShort = this.editForm.sellerShort || obj2.companyShort;
      this.editForm.orderStatus = status === 2 ? 5 : 1;
      this.editForm.salesOrderCollectionList = this.controlTowerList;
      this.editForm.salesOrderProductsList = this.orderSkuList;
      this.editForm.totalAmount = this.editForm.totalAmount || this.allAmount;
      this.editForm.netTotalAmount = this.editForm.netTotalAmount || this.orderMoneyTotal;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.$route.query.id ? updateSaleOrder : addSaleOrder;
          this.saveLoading = true;
          api(this.editForm).then(res => {
            this.closePage();
            this.saveLoading = false;
            this.$message.success(status === 1 ? this.$t('common.tip.saveTip') : this.$t('common.tip.submitTip'));
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning(this.language === 'zh' ? '请填写完整' : 'Please complete the form.')
        }
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
  .editOrder {
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
    }
    .edit-form {
      margin-top: 20px;
    }
    .edit-form-width {
      width: 260px;
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
