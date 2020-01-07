<template>
  <div class="app-container editQuoted">
    <div class="edit-title">{{$t('query.tableLabel.Quotation')}}</div>
    <el-form
      ref="editForm"
      :model="editForm"
      size="small"
      :rules="editRules"
      v-loading="loading"
      label-position="left"
      :label-width="isZh?'100px':'140px'"
    >
      <el-row>
        <el-col :span="12" v-if="editType">
          <el-form-item :label="$t('query.tableLabel.quotationNumber')">{{editForm.quotationNo}}</el-form-item>
        </el-col>
        <el-col :span="12" v-if="editType">
          <el-form-item
            :label="$t('query.tableLabel.QuotationTime')"
          >{{editForm.quotationTime | timeFmt}}</el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="20" style="margin-bottom: -12px !important">-->
          <!--<el-form-item :label="$t('logistics.logisticsOrder.orderType')">-->
            <!--&lt;!&ndash;:disabled="buyType || isShowOrder"&ndash;&gt;-->
            <!--<el-radio-group v-model="orderType" @change="orderTypeFn" :disabled="buyType || isShowOrder">-->
              <!--<el-radio :label="0">{{$t('query.tableLabel.RawMaterialSalesList')}}</el-radio>-->
              <!--<el-radio :label="1">{{$t('query.tableLabel.MerchandiseSalesList')}}</el-radio>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10" style="width: 59.66667%">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 90%;text-align: left">
            <tr>
              <td width="20%" style="min-width: 100px">{{$t('logistics.logisticsTrace.buyer')}}</td>
              <td width="80%">
                <el-select v-model="editForm.buyerBId" size="mini" filterable clearable :disabled="buyType || isShowOrder" :placeholder="$t('query.placeholder.userCompany')" class="edit-form-width">
                  <el-option v-for="(item, index) in customerInfoList" :label="orderType === 1?item.companyName:item.supplierName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerContactBy')}}</td>
              <td>
                <!--暂时不通过买方企业进行联系人关联-->
                <!--<el-select v-model="editForm.buyerContactBy" size="mini" clearable :placeholder="$t('query.placeholder.buyType')" :no-data-text="$t('query.noDataText')" class="edit-form-width">-->
                  <!--<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>-->
                <!--</el-select>-->
                <el-input v-model="editForm.buyerContactBy" clearable size="mini" :placeholder="$t('query.placeholder.buyType')" class="edit-form-width"/>
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerTelephone')}}</td>
              <!--<td>{{editForm.buyerTelephone}}</td>-->
              <td>
                <el-input v-model="editForm.buyerTelephone" clearable size="mini" :placeholder="$t('query.placeholder.buyerTelephone')" class="edit-form-width"/>
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerEmail')}}</td>
              <!--<td>{{editForm.buyerEmail}}</td>-->
              <td>
                <el-input v-model="editForm.buyerEmail" clearable size="mini" :placeholder="$t('query.placeholder.buyerEmail')" class="edit-form-width"/>
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.buyerAddress')}}</td>
              <!--<td>{{editForm.buyerAddress}}</td>-->
              <td>
                <el-input v-model="editForm.buyerAddress" clearable size="mini" :placeholder="$t('query.placeholder.buyerAddress')" class="edit-form-width"/>
              </td>
            </tr>
          </table>
        </el-col>
        <el-col :span="10" style="width: 59.66667%">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 90%;text-align: left">
            <tr>
              <td width="20%" style="min-width: 100px">{{$t('logistics.logisticsTrace.seller')}}</td>
              <td width="80%">
                <el-select
                  v-model="editForm.sysCompanyBId"
                  size="mini"
                  filterable
                  clearable
                  :placeholder="$t('query.placeholder.business')"
                  class="edit-form-width"
                ><el-option
                    v-for="(item, index) in sysCustomerInfoList"
                    :label="item.companyName"
                    :value="item.bid"
                    :key="index"
                  ></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsTrace.sellerContact')}}</td>
              <td>{{editForm.sellerContact}}</td>
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
        <div class="top-btns" v-if="isShow">
          <el-button type="primary" size="small" @click="openDialog" >{{$t('query.tableLabel.add')}}</el-button>
          <!--<el-button type="danger" size="small" @click="deleteAllSku">{{$t('query.tableLabel.empty')}}</el-button>-->
        </div>
      </div>
      <el-table
        :data="dataList"
        border
        fit
        show-summary
        size="mini"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}"
      >
        <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55" />

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

        <el-table-column
          align="center"
          width="150"
          :label="$t('query.tableLabel.QuotationQuantity')"
          prop="quotedQuantity">
          <template slot-scope="scope">
            <!--<el-input v-model="scope.row.quotedQuantity" size="small" :min="0" class="input-center" @change="changeNumber(scope.row, scope.row.quotedQuantity)"/>-->
            <el-input-number v-model="scope.row.quotedQuantity" :min="0" :precision="scope.row.skuDecimalPlaces" clearable class="hidden-control input-center" @change="changeNumber(scope.row, scope.row.quotedQuantity)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unit')" >
          <template slot-scope="scope">
            {{scope.row.productUnit}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('query.tableLabel.PreviousOffer')" >
          <template slot-scope="scope">
            {{scope.row.lastQuotedPrice}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="150"
          :label="$t('query.tableLabel.UnitQuotedPrice')"
        >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quotedPrice" :min="0" :precision="2" clearable class="hidden-control input-center" @change="changePrice(scope.row, scope.row.quotedPrice)"/>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="120"
          :label="$t('query.tableLabel.QuotedPrice')"
          prop="productAmount"
        />

        <el-table-column
          align="center"
          :label="$t('query.tableLabel.QuotedRemarks')">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.quotedRemark"
              :autosize="{ minRows: 4, maxRows: 6}"
              type="textarea"
              size="small"
              clearable
              style="font-size: 12px"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" :label="$t('common.table.actions')" v-if="isShow">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteSku(scope)">{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item />
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('query.tableLabel.freight')">
            <el-input v-model.number="editForm.transportationCost" type="number" :min="0" clearable class="edit-form-width"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('query.tableLabel.TotalOrders')">
            {{quoteMoneyTotal | moneyFmt}}
            <!--<el-input v-model="quoteMoneyTotal" readonly class="edit-form-width"/>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('inquiry.inquiryOrder.dateOfDelivery')" prop="dateOfDelivery">
            <el-input v-model="editForm.dateOfDelivery" class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.DeparturePort')" prop="departurePort">
            <el-input
              v-model="editForm.departurePort"
              clearable
              :placeholder="$t('query.placeholder.DeparturePort')"
              class="edit-form-width"
              maxlength="30"
              style="width: 700px"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="destinationPort">
            <el-input
              v-model="editForm.destinationPort"
              clearable
              :placeholder="$t('query.tableLabel.DestinationPortAddr')"
              class="edit-form-width"
              maxlength="30"
              style="width: 700px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="transportation">
            <el-select v-model="editForm.transportation" :placeholder="$t('query.placeholder.entrustTransportation')" class="edit-form-width">
              <el-option label="SGI" :value="0"></el-option>
              <el-option :label="$t('inquiry.inquiryOrder.SelfMention')" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('inquiry.inquiryOrder.transportationWay')"
            prop="transportationWay"
          >
            <el-select
              v-model="editForm.transportationWay"
              :placeholder="$t('query.placeholder.transportationWay')"
              class="edit-form-width"
            >
              <el-option v-for="(item, index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('finance.financeService.currency')" prop="currency">
            <el-select
              filterable
              remote
              :remote-method="getCurrencyCodeList"
              :loading="loading2"
              v-model="editForm.currency"
              clearable
              :placeholder="$t('query.placeholder.currency')"
              class="edit-form-width"
            >
              <el-option
                v-for="(item, index) in currencyCodeList"
                :label="item.searchCurrencyCodeStr"
                :value="item.currencyCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.paymentCondition')" prop="paymentCondition">
            <el-select v-model="editForm.paymentCondition" :placeholder="$t('query.placeholder.payModeArr')" class="edit-form-width">
              <el-option v-for="(item, index) in paymentList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('inquiry.inquiryOrder.effectiveDate')" prop="effectiveDate">
            <el-date-picker v-model="editForm.effectiveDate" type="datetime" clearable :placeholder="$t('inquiry.inquiryOrder.effectiveDate')" class="edit-form-width"/>
          </el-form-item>
        </el-col>
        <!--<el-col>-->
        <!--<el-form-item label="其他条款" prop="otherTerms">-->
        <!--<el-input v-model="editForm.otherTerms" clearable style="width: 80%" />-->
        <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-form-item :label="$t('query.tableLabel.payment')">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
            <tr style="background-color: #a7bfee;">
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
                <el-input-number v-model="item.paymentRatio" :min="0" :max="100" :precision="2" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;%
              </td>
              <td>
                <el-input-number v-model="item.dayNum" :min="0" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;{{$t('system.business.day')}}
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
            <el-input
              v-model="editForm.quotedRemarks"
              :autosize="{ minRows: 4, maxRows: 6}"
              maxlength="200"
              type="textarea"
              size="small"
              clearable
              style="width: 80%"
            />
          </el-form-item>
        </el-col>
        <!--        <el-col>-->
        <!--          <el-form-item label="是否审核" prop="ifAudit">-->
        <!--            <el-radio-group v-model="editForm.isApproval">-->
        <!--              <el-radio :label="1">是</el-radio>-->
        <!--              <el-radio :label="0">否</el-radio>-->
        <!--            </el-radio-group>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <!--        <el-col>-->
        <!--          <el-form-item label="选择审批流程" prop="approvalBId" v-if="editForm.isApproval">-->
        <!--            <el-select v-model="editForm.approvalBId" clearable filterable placeholder="请选择" style="width: 300px">-->
        <!--              <el-option v-for="(item,index) in approvalSelectList" :key="index" :label="item.approvalName" :value="item.bid">-->
        <!--              </el-option>-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          size="small"
          :loading="saveLoading"
          @click="confirmAdd('editForm', 1, editType)"
        >{{$t('common.buttonText.save')}}</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="saveLoading"
          @click="confirmAdd('editForm', 2, editType)"
        >{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="$t('query.tableLabel.commodityQuotation')"
      width="1000px"
      center
      close-on-click-modal
    >
      <el-form
        ref="editForm"
        :model="searchObj"
        label-width="100px"
        label-position="left"
        inline
        size="small"
      >
        <el-form-item :label="$t('product.categoryTemplate.category')">
          <el-cascader
            :key="isZh"
            style="width: 240px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('query.placeholder.Searchable')"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.CommodityCode')" prop="productCode">
          <el-input
            v-model.trim="searchObj.productCode"
            clearable
            :placeholder="$t('query.tableLabel.CommodityCode')"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item :label="$t('inquiry.inquiryOrder.productName')" prop="productName">
          <el-input
            v-model.trim="searchObj.productName"
            clearable
            :placeholder="$t('inquiry.inquiryOrder.productName')"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="productSkuList"
        :element-loading-text="$t('system.userManage.lodding')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>

        <el-table-column
          align="center"
          width="180"
          :label="$t('product.categoryTemplate.category')"
          :prop="language==='zh'?'cnCatalogBName':'enCatalogBName'"
        />

        <el-table-column
          align="center"
          :label="$t('inquiry.inquiryOrder.productName')"
          :prop="language==='zh'?'cnProductName':'enProductName'"
        />

        <el-table-column
          align="center"
          width="130"
          :label="$t('query.tableLabel.CommodityCode')"
          prop="productCode"
        />

        <el-table-column
          align="center"
          min-width="180px"
          label="SKU"
          :prop="language==='zh'?'cnAttrValueList':'enAttrValueList'"
        />

        <el-table-column
          align="center"
          width="165"
          :label="$t('product.product.minimumOrderQuantity')"
          prop="mininum"
        />

        <el-table-column
          align="center"
          width="80"
          :label="$t('query.tableLabel.UnitPrice')"
          prop="unitPrice"
        />
      </el-table>

      <Pagination
        :total="searchObj.total"
        :page.sync="searchObj.pageNum"
        :limit.sync="searchObj.pageSize"
        @pagination="getQuotedProductSku"
      ></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="addQuotedSku"
        >{{$t('common.buttonText.save')}}</el-button>
        <el-button
          type="danger"
          size="small"
          @click="dialogVisible=false"
        >{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { getPublicCategory, productListGetPrice } from "@/api/product";
import { selectCurrencyCodeListApi,
  approvalSelectList
  // getSupplyCompanyList
} from "@/api/system";
import { listCustomerInfoContactApi, getCustomerInfo } from "@/api/customer";
import { supplierPageList, supplierDetailById } from "@/api/supplier";
import { parseTime } from "@/utils/index";
import { detailQuotedPrice, saveQuotedPrice, updateQuotedPrice, selectCustomByIdApi, getSetSellerNameInfoApi } from "@/api/inquiry";
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination
  },
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val);
      }
    }
  },
  data() {
    return {
      dataList: [],
      isShow: false,
      isShowOrder: false,
      listLoading1: false,
      orderType: 1,
      dialogVisible: false,
      loading: true,
      orderTypeFlag: false,
      loading1: false,
      loading2: false,
      saveLoading: false,
      editType: false,
      buyType: false,
      countryList: [],
      currencyCodeList: [],
      customerInfoList: [],
      sysCustomerInfoList: [],
      approvalSelectList: [],
      modalList: [],
      parentsName: [],
      searchDataList: [],
      selectList: [],
      productSkuList: [],
      delSkuList: [],
      controlTowerList: [],
      editForm: {
        quotationNo: "",
        quotationTime: "",
        buyerBId: "",
        buyerContactBy: "",
        // buyerContactBId: '',
        inquirerBId: "",
        buyerAddress: "",
        buyerTelephone: "",
        buyerEmail: "",
        buyerName: "",
        sellerContact: "",
        sellerAddress: "",
        sellerTelephone: "",
        sellerEmail: "",
        sysCompanyBId: "",
        transportationWay: '3',
        transportation: 0,
        departurePort: "",
        destinationPort: "",
        emailAddress: "",
        currency: "",
        exchangeRate: 0,
        dateOfDelivery: "",
        paymentCondition: "1",
        isApproval: 1,
        approvalBId: "",
        quotedRemarks: "",
        transportationCost: 0,
        inquiryNo: "",
        otherTerms: "",
        effectiveDate: ''
      },
      editRules: {
        departurePort: [
          { required: true, message: this.$t('query.hint.departurePortHint'), trigger: 'blur' }
        ],
        destinationPort: [
          { required: true, message: this.$t('query.hint.destinationPortHint'), trigger: 'blur' }
        ],
        dateOfDelivery: [
          { required: true, message: this.$t('query.hint.dateOfDeliveryHint'), trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: this.$t('query.hint.effectiveDateHint'), trigger: 'blur' }
        ],
        paymentCondition: [
          { required: true, message: this.$t('query.hint.paymentConditionHint'), trigger: 'change' }
        ],
        currency: [
          { required: true, message: this.$t('query.hint.currencyHint'), trigger: 'change' }
        ]
      },
      searchObj: {
        productCode: "",
        productName: "",
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      customTime: [],
      inquiryStatusList: [
        {
          label: "待报价",
          inquiryStatus: 1
        },
        {
          label: "审批中",
          inquiryStatus: 2
        },
        {
          label: "已报价",
          inquiryStatus: 3
        },
        {
          label: "重新待报价",
          inquiryStatus: 4
        },
        {
          label: "重新待审批",
          inquiryStatus: 5
        },
        {
          label: "已重新报价",
          inquiryStatus: 6
        },
        {
          label: "废弃",
          inquiryStatus: 7
        },
        {
          label: "拒绝报价",
          inquiryStatus: 8
        }
      ],
      quoteTypeList: [
        // 报价类型（0-EXW,1-FOB）
        {
          label: "EXW",
          quoteType: 0
        },
        {
          label: "FOB",
          quoteType: 1
        }
      ],
      paymentMethodList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
        {
          label: "T/T",
          paymentCondition: 1
        },
        {
          label: "L/C",
          paymentCondition: 2
        },
        {
          label: "P/A",
          paymentCondition: 3
        },
        {
          label: "D/A",
          paymentCondition: 4
        }
      ],
      portList: [
        {
          portName: "港口1",
          bid: "1"
        },
        {
          portName: "港口2",
          bid: "2"
        },
        {
          portName: "港口3",
          bid: "3"
        },
        {
          portName: "港口4",
          bid: "4"
        }
      ],
      cloneType: '',
      cloneList: [],
      sellerCompanyName: ''
      // pickerOptionsEnd: {
      //   disabledDate: (time) => {
      //     if (this.editForm.effectiveDate) {
      //       return time.getTime() < this.editForm.effectiveDate
      //     }
      //   }
      // }
    };
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path;
      })[0];
      return activePath;
    },
    transportList() {
      return this.$store.state.order.transportList
    },
    paymentList() {
      return this.$store.state.order.paymentList
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio);
      });
      return val;
    },
    quoteMoneyTotal() {
      let val = 0;
      this.dataList.forEach(e => {
        val += Number(e.productAmount);
      });
      val += Number(this.editForm.transportationCost);
      return val;
    }
  },
  watch: {
    "editForm.buyerBId"(val, oldVal) {
      if (val && !oldVal) {
        this.customerContactFun(val, false);
        if (!this.$route.query.customBId) {
          let obj = this.customerInfoList.filter(e => e.bid === val)[0];
          if (!obj) return false;
          // 通过新增按钮过来的----暂时买家企业不与地址，邮箱，电话进行关联
          // this.editForm.buyerAddress = obj.officeAddress;
          // this.editForm.buyerName = obj.companyName;
          // this.editForm.buyerTelephone = obj.mobilePhone;
          // this.editForm.buyerEmail = obj.emailAddress;
        } else if (this.$route.query.customBId) {
          let obj = this.customerInfoList.filter(e => e.bid === val)[0];
          if (!obj) return false;
          // 通过定制单报价按钮过来的----直接将地址，邮箱，电话信息带过来
          this.editForm.buyerCode = obj.customerCode;
          this.editForm.buyerCountryCode = obj.countryCode;
          this.editForm.buyerName = obj.companyName;
        }
      } else if (val && oldVal) {
        this.customerContactFun(val, true);
        // 通过新增按钮过来的----暂时买家企业不与地址，邮箱，电话进行关联
        // let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        this.editForm.buyerContactBy = "";
        this.editForm.inquirerBId = "";
        // this.editForm.buyerAddress = obj.officeAddress;
        // this.editForm.buyerName = obj.companyName;
        // this.editForm.buyerTelephone = obj.mobilePhone;
        // this.editForm.buyerEmail = obj.emailAddress;
        this.editForm.buyerName = "";
        this.editForm.buyerAddress = "";
        this.editForm.buyerTelephone = "";
        this.editForm.buyerEmail = "";
      } else {
        this.editForm.buyerContactBy = "";
        this.editForm.inquirerBId = "";
        this.editForm.buyerAddress = "";
        this.editForm.buyerTelephone = "";
        this.editForm.buyerEmail = "";
        if (!this.$route.query.id && !this.$route.query.customBId) {
          this.controlTowerList = [];
        }
      }
    },
    isZh() {
      this.editRules = {
        departurePort: [
          { required: true, message: this.$t('query.hint.departurePortHint'), trigger: 'blur' }
        ],
        destinationPort: [
          { required: true, message: this.$t('query.hint.destinationPortHint'), trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: this.$t('query.hint.effectiveDateHint'), trigger: 'blur' }
        ],
        dateOfDelivery: [
          { required: true, message: this.$t('query.hint.dateOfDeliveryHint'), trigger: 'blur' }
        ],
        paymentCondition: [
          { required: true, message: this.$t('query.hint.paymentConditionHint'), trigger: 'change' }
        ],
        currency: [
          { required: true, message: this.$t('query.hint.currencyHint'), trigger: 'change' }
        ]
      }
    }
    // "editForm.sysCompanyBId"(val) {
    //   if (val) {
    //     let obj = this.sysCustomerInfoList.filter(e => e.bid === val)[0];
    //     this.editForm.sellerBId = obj.bid;
    //     this.editForm.sellerShort = obj.companyShort;
    //     this.editForm.sellerCode = obj.companyCode;
    //     this.editForm.sellerCountryCode = obj.countryCode;
    //     this.editForm.sellerName = obj.companyName;
    //     this.editForm.sellerContact = obj.chargeBy;
    //     this.editForm.sellerAddress = obj.officeAddress;
    //     this.editForm.sellerTelephone = obj.chargePhone;
    //     this.editForm.sellerEmail = obj.emailAddress;
    //   } else {
    //     this.editForm.sellerContact = '';
    //     this.editForm.sellerAddress = '';
    //     this.editForm.sellerTelephone = '';
    //     this.editForm.sellerEmail = '';
    //     this.editForm.sellerName = ''
    //   }
    // }
  },
  created() {
    if (this.$route.query.id) {
      this.editType = true;
    }
    if (this.$route.query.isShow) {
      // this.isShow = isShow
      this.isShow = false;
    } else {
      this.isShow = true;
    }
    // this.getCustomerInfoListFun();
    // this.getSysCustomerInfoListFun();
    this.getApprovalSelectList();
    // 获取类目列表
    this.getAllDataList();
    this.getCurrencyCodeList();
    // this.getDetail();
    if (this.$route.query.orderType === 0) {
      this.orderType = this.$route.query.orderType;
    } else {
      this.orderType = 1;
    }
    this.promise();
  },
  methods: {
    orderTypeFn(val) {
      this.orderTypeFlag = true;
      this.productSkuList = [];
      this.modalList = [];
      this.editForm.buyerBId = "";
      this.getCustomerInfoListFun();
      if (val === this.cloneType) {
        this.dataList = this.cloneList.map(e => e)
      } else {
        this.dataList = [];
      }
    },
    closePage() {
      this.$store.dispatch("delView", this.activeRoute).then(() => {
        this.$router.push({
          path: "/query/quoted"
        });
      });
    },
    changePrice(item, val) {
      this.$nextTick(() => {
        item.productAmount = (
          (Number(item.quotedQuantity) * Number(item.quotedPrice) * 100) /
          100
        ).toFixed(4);
      });
    },
    async promise() {
      try {
        await this.getCustomerInfoListFun();
        // await this.getSysCustomerInfoListFun();
        this.getSetSellerNameInfoFun(); // 默认获取当前用户下的企业id
        this.getDetail();
        this.loading = false;
      } catch (e) {
        this.$message.error(e);
      }
    },
    getParentId(arr) {
      if (arr.length) {
        this.searchObj.catalogBId = arr.join(",");
      } else {
        this.searchObj.catalogBId = "";
      }
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    // 客户人列表
    getCustomerInfoListFun() {
      return new Promise((resolve, reject) => {
        let api = this.orderType === 1 ? listCustomerInfoContactApi : supplierPageList;
        let obj = this.orderType === 1 ? null : { pageNum: 1, pageSize: 999 };
        api(obj)
          .then(res => {
            this.customerInfoList = this.orderType === 1 ? res.data : res.data.list;
            resolve(res);
          })
          .catch(err => {
            reject(err);
            this.$message.error(err.message);
          });
      });
    },
    // 主体企业列表
    // getSysCustomerInfoListFun() {
    //   return new Promise((resolve, reject) => {
    //     getSupplyCompanyList()
    //       .then(res => {
    //         this.sysCustomerInfoList = res.data || [];
    //         resolve(res);
    //       })
    //       .catch(err => {
    //         reject(err);
    //         this.$message.error(err.message);
    //       });
    //   });
    // },
    getSetSellerNameInfoFun() {
      // if (this.$route.query.id) {
      //   return false
      // }
      getSetSellerNameInfoApi().then(res => {
        this.sysCustomerInfoList = res.data;
      });
    },
    // setSellerInfo(val) {
    //   if (val) {
    //     let obj = this.sysCustomerInfoList.filter(e => e.bid === val)[0];
    //     this.editForm.sellerBId = obj.bid;
    //     this.editForm.sellerShort = obj.companyShort;
    //     this.editForm.sellerCode = obj.companyCode;
    //     this.editForm.sellerCountryCode = obj.countryCode;
    //     this.editForm.sellerName = obj.companyName;
    //     this.editForm.sellerContact = obj.chargeBy;
    //     this.editForm.sellerAddress = obj.officeAddress;
    //     this.editForm.sellerTelephone = obj.chargePhone;
    //     this.editForm.sellerEmail = obj.emailAddress;
    //   } else {
    //     this.editForm.sellerContact = '';
    //     this.editForm.sellerAddress = '';
    //     this.editForm.sellerTelephone = '';
    //     this.editForm.sellerEmail = '';
    //     this.editForm.sellerName = ''
    //   }
    // },
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      });
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      });
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getQuotedProductSku();
    },
    getQuotedProductSku() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key];
        }
      }
      obj.productType = this.orderType;
      obj.customerBId = this.editForm.buyerBId;
      this.listLoading1 = true;
      productListGetPrice(obj)
        .then(res => {
          this.productSkuList = res.data.list.map(e => {
            e.mininum = e.minimum || 0;
            e.unitPrice = e.unitPrice || 0;
            return { ...e };
          });
          this.searchObj.total = res.data.total;
          this.listLoading1 = false;
        })
        .catch(() => {
          this.listLoading1 = false;
        });
    },
    // 客户下的联系人列表
    customerContactFun(val, flag) {
      if (!val) {
        return;
      }
      let api = this.orderType === 1 ? getCustomerInfo : supplierDetailById;
      api({ bid: val })
        .then(res => {
          if (res.data) {
            if (this.orderType === 1) {
              this.modalList = res.data.customerContactList || [];
              let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
              if (!this.$route.query.id && !this.$route.query.customBId) {
                this.controlTowerList = payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList;
              }
            } else {
              let payterms = res.data.supplierOrderPayNodeList;
              this.modalList = res.data.supplierContactList || [];
              if (!this.$route.query.id && !this.$route.query.customBId) {
                this.controlTowerList = payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList;
              }
              // this.getlinkMan(val, flag);
            }
            if (this.modalList.length && flag) {
              this.editForm.inquirerBId = this.modalList[0].accountBId;
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // getlinkMan(val, flag) {
    //   getLinkList({ bid: val })
    //     .then(res => {
    //       if (res.data) {
    //         this.modalList = res.data || [];
    //         if (this.modalList.length && flag) {
    //           this.editForm.buyerContactBy = this.modalList[0].accountBId;
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message);
    //     });
    // },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== "") {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || [];
          });
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    getDetail() {
      this.getSetSellerNameInfoFun()
      // if (this.$route.query.inqueryTailormadeNo !== undefined || null) {
      //   this.isShow = false
      //
      if (this.$route.query.id) {
        detailQuotedPrice({ quotedPriceBId: this.$route.query.id })
          .then(res => {
            this.editForm = Object.assign(this.editForm, res.data);
            // this.editForm.inqueryTailormadeNo = res.data.inqueryTailormadeNo;
            if (this.editForm.orderType === 0) {
              this.editForm.buyerBId = this.editForm.buyerSupplierBId;
            }
            // if (this.$route.query.flag) {
            //   this.editForm.lastQuotedBId = this.editForm.bid;
            //   this.editForm.bid = "";
            // }
            if (res.data.buyerBId) {
              this.buyType = true;
            }
            this.editForm.paymentCondition = String(res.data.paymentCondition);
            this.editForm.transportationWay = String(res.data.transportationWay);
            // this.editForm.buyerContactBId = res.data.inquirerBId;
            this.editForm.sysCompanyBId = res.data.sellerBId;
            this.controlTowerList = res.data.quotedOrderPayNodeList || [];
            this.dataList = res.data.quotedPriceDetailList.map(e => {
              e.productAmount = (Number(e.quotedQuantity * 100) * Number(e.quotedPrice * 100)) / 10000;
              // if (this.$route.query.flag) {
              //   e.lastQuotedNumber = e.quotedQuantity;
              //   e.lastQuotedPrice = e.quotedPrice;
              //   e.lastQuotedRemark = e.quoteRemark;
              // }
              return { ...e };
            });
            if (this.orderTypeFlag) {
              this.deleteAllSku();
            }
            if (this.$route.query.flag === true) {
              this.isShowOrder = true;
              this.editForm.lastQuotedBId = this.editForm.bid;
              this.editForm.bid = "";
              this.dataList = res.data.quotedPriceDetailList.map(e => {
                e.productAmount = (Number(e.quotedQuantity * 100) * Number(e.quotedPrice * 100)) / 10000;
                // if (this.$route.query.flag) {
                //   e.lastQuotedNumber = e.quotedQuantity;
                //   e.lastQuotedPrice = e.quotedPrice;
                //   e.lastQuotedNumber = e.quoteRemark;
                // }
                return { ...e };
              });
            }
            this.cloneList = this.dataList.map(e => e);
            this.cloneType = this.editForm.orderType;
          })
          .catch(err => {
            this.$message(err.message);
          });
        if (this.$route.query.inqueryTailormadeNo !== null) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      } else if (this.$route.query.customBId) {
        selectCustomByIdApi({ bId: this.$route.query.customBId })
          .then(res => {
            this.editForm.inqueryTailormadeNo = res.data.tailormadeFormNumber;
            this.editForm.inqueryTailormadeBId = res.data.bid;
            this.editForm.buyerBId = res.data.customerBasicInfoBId;
            if (this.editForm.orderType === 0) {
              this.editForm.buyerSupplierBId = res.data.customerBasicInfoBId;
            }
            this.editForm.inquirerBId = res.data.customBy;
            this.editForm.buyerEmail = res.data.buyerMailbox;
            this.editForm.buyerTelephone = res.data.buyerTelephone;
            this.editForm.sellerContact = this.userInfo.userName;
            this.editForm.sellerAddress = this.userInfo.contactAddress;
            this.editForm.sellerTelephone = this.userInfo.mobilePhone;
            this.editForm.sellerEmail = this.userInfo.emailAddress;
            this.editForm.buyerAddress = res.data.buyerAddress;
            this.editForm.currency = res.data.currency;
            this.editForm.paymentCondition = String(res.data.paymentMethods);
            this.editForm.remarks = res.data.customRemarks;
            this.editForm.departurePort = res.data.departurePort;
            this.editForm.destinationPort = res.data.destinationPort;
            this.editForm.customBId = res.data.inqueryTailormadeBId;
            this.editForm.inquiryNo = res.data.customNo;
            this.editForm.dateOfDelivery = res.data.dateOfDelivery;
            this.editForm.transportation = res.data.transportation;
            this.editForm.transportationWay = String(res.data.transportationWay);
            this.controlTowerList = res.data.customizeOrderPayNodeList || [];
            this.dataList = res.data.customizeProductList.map(e => {
              e.mininumMoney = (e.inquiryQuantity * e.defaultPrice * 100) / 100;
              e.quotedQuantity = e.productQuantity;
              e.quotedPrice = 0;
              e.productAmount = 0;
              e.skuDecimalPlaces = e.skuDecimalPlaces || 2;
              return { ...e };
            });
            // if (this.orderTypeFlag) {
            //   this.deleteAllSku()
            // }
            this.buyType = true;
          })
          .catch(err => {
            this.$message(err.message);
          });
        this.isShow = false;
      } else {
        if (this.orderTypeFlag) {
          this.deleteAllSku();
        }
        this.editForm.sellerContact = this.userInfo.userName;
        this.editForm.sellerAddress = this.userInfo.contactAddress;
        this.editForm.sellerTelephone = this.userInfo.mobilePhone;
        this.editForm.sellerEmail = this.userInfo.emailAddress;
        // this.editForm.sellerName = this.sellerCompanyName;
      }
    },
    changeNumber(item, val) {
      this.$nextTick(() => {
        item.productAmount = (
          (Number(item.quotedQuantity) * Number(item.quotedPrice) * 100) /
          100
        ).toFixed(4);
      });
    },
    // changePrice(item, val) {
    //   this.$nextTick(() => {
    //     item.productAmount = ((item.quotedQuantity * item.quotedPrice * 100) / 100).toFixed(2)
    //   })
    // },
    openDialog() {
      if (!this.editForm.buyerBId) {
        return this.$message.warning(this.$t('order.sale.selectCompanyMsg'))
      }
      this.selectList = [];
      this.dialogVisible = true;
      this.getQuotedProductSku();
    },
    deleteSku(scope) {
      let delSku = this.dataList.splice(scope.$index, 1)[0];
      if (delSku.id) {
        this.delSkuList.push(delSku);
      }
    },
    deleteAllSku() {
      if (this.delSkuList.length) {
        this.delSkuList = this.dataList.filter(e => e.id);
      } else {
        let arr = this.dataList.filter(e => e.id);
        this.delSkuList = [...new Set(this.delSkuList.concat(arr))];
      }
      this.dataList = [];
    },
    addQuotedSku() {
      if (!this.selectList.length) {
        let msg =
          this.language === "zh"
            ? "请先选择商品"
            : "Please choose the goods first.";
        return this.$message.warning(msg);
      }
      let skuBIdArr = this.dataList.map(e => e.skuBId);
      let arr = this.selectList
        .map(e => {
          return {
            cnAttrValueList: e.cnAttrValueList,
            enAttrValueList: e.enAttrValueList,
            cnCatalogBName: e.cnCatalogBName,
            enCatalogBName: e.enCatalogBName,
            skuBId: e.bid,
            skuCode: e.skuCode,
            productCode: e.productCode,
            enProductName: e.enProductName,
            cnProductName: e.cnProductName,
            productBId: e.bid,
            unitPrice: e.unitPrice,
            mininum: e.mininum,
            productImge: e.imagePath,
            customsCode: e.customsCode,
            singleBulk: e.singleBulk,
            singlePackage: e.singlePackage,
            singleWeight: e.singleWeight,
            mininumMoney: e.mininum * e.unitPrice,
            quotedQuantity: 0,
            quotedPrice: 0,
            productAmount: 0,
            productUnit: e.skuUnit,
            skuDecimalPlaces: e.skuDecimalPlaces || 2
          };
        })
        .filter(t => {
          return !skuBIdArr.includes(t.skuBId);
        });
      this.dataList = this.dataList.concat(arr);
      this.dialogVisible = false;
    },
    confirmAdd(formName, status, type) {
      if (!this.editForm.buyerBId || !this.editForm.buyerContactBy) {
        return this.$message.warning(this.$t("query.placeholder.buyType"));
      }
      if (!this.editForm.sysCompanyBId) {
        return this.$message.warning(this.$t("query.placeholder.business"));
      }
      if (!this.dataList.length) {
        let msg1 =
          this.language === "zh"
            ? "请选择商品"
            : "Please choose the goods.";
        return this.$message.warning(msg1);
      }
      if (this.totalSum !== 100) {
        let msg2 =
          this.language === "zh"
            ? "付款条件比例必须等于100"
            : "The ratio of payment terms must be equal to 100";
        return this.$message.warning(msg2);
      }
      for (let i = 0; i < this.dataList.length; i++) {
        if (!this.dataList[i].quotedPrice) {
          return this.$message.warning(this.isZh ? '商品价格不能为0或空值' : 'The price of a commodity cannot be zero or null');
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let api =
            type && !this.$route.query.flag
              ? updateQuotedPrice
              : saveQuotedPrice;
          this.editForm.quoteStatus = status;
          this.editForm.orderType = this.orderType;
          this.delSkuList.forEach(e => {
            e.delFlag = 1;
          });
          this.editForm.quotedPriceDetailList = this.dataList.concat(this.delSkuList);
          // 商品
          if (this.cloneType !== this.orderType) {
            let arr = this.cloneList.map(e => {
              e.delFlag = 1;
              return { ...e }
            });
            this.editForm.quotedPriceDetailList = this.editForm.quotedPriceDetailList.concat(arr);
          }
          this.editForm.quotedOrderPayNodeList = this.controlTowerList;
          // 报价来源(1-定制, 2-非定制(询价，报价新增))
          this.editForm.quotedType = 2;
          if (this.isShow === true) {
            this.editForm.inquirerBId = this.editForm.buyerContactBy;
          }
          this.saveLoading = true;
          this.editForm.sellerBId = this.editForm.sysCompanyBId;
          let obj = JSON.parse(JSON.stringify(this.editForm));
          let obj1 = this.customerInfoList.find(e => e.bid === obj.buyerBId);
          obj.buyerName = this.orderType === 1 ? obj1.companyName : obj1.supplierName;
          if (obj.orderType === 0) {
            obj.buyerSupplierBId = obj.buyerBId;
            obj.buyerBId = ''
          } else {
            obj.buyerSupplierBId = '';
          }
          api(obj)
            .then(res => {
              this.$message.success(
                status === 2
                  ? this.$t("query.formMessage.submitSuccess")
                  : this.$t("system.role.saveSuccess")
              );
              this.closePage();
              this.saveLoading = false;
            })
            .catch(err => {
              this.saveLoading = false;
              this.$message.error(err.message);
            });
        } else {
          let msg3 =
            this.language === "zh" ? "请填写完整" : "Please complete the form.";
          this.$message.warning(msg3);
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.editQuoted {
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
    margin-top: 5px;
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
      > div {
        font-size: 12px;
      }
    }
  }
}
</style>
