<template>
  <div class="app-container editOrder">
    <div class="edit-title">{{$t('order.sale.order')}}</div>
    <el-form ref="editForm" :model="editForm" :rules="editFormRules" :label-width="isZh?'100px':'150px'" label-position="left" size="small" class="edit-form">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('order.sale.orderNo')">
            {{editForm.orderNo}}
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
            <el-input v-model="editForm.clientPoNo" maxlength="30" clearable style="width: 200px" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.clientDate')">
            <el-date-picker v-model="editForm.clientPoDate" type="datetime" clearable style="width: 200px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>-->
        <!--<el-col :span="20">-->
          <!--<el-form-item :label="$t('logistics.logisticsOrder.orderType')">-->
            <!--<el-radio-group v-model="editForm.salesOrderType" :disabled="!!editForm.quotedNo" @change="changeType" >-->
              <!--<el-radio :label="0">{{$t('query.tableLabel.RawMaterialSalesList')}}</el-radio>-->
              <!--<el-radio :label="1">{{$t('query.tableLabel.MerchandiseSalesList')}}</el-radio>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%;text-align: left">
            <tr>
              <td width="40%" style="min-width: 100px">{{$t('order.sale.buyer')}}</td>
              <td width="60%">
                <el-form-item label-width="0" class="form-table-bottom">
                  <el-select v-if="editForm.salesOrderType === 1" v-model="editForm.customerBId" filterable :disabled="!!editForm.quotedNo" :placeholder="$t('order.sale.selectCompany')" size="mini" class="table-input-width" @change="setBuyerInfo">
                    <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                  </el-select>
                  <el-select v-else v-model="editForm.supplierBId" filterable :disabled="!!editForm.quotedNo" :placeholder="$t('order.sale.selectSupplier')" size="mini" class="table-input-width" @change="setBuyerInfo">
                    <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contact')}}</td>
              <td>
                <!--<el-select v-model="editForm.buyerContactBy" :disabled="!!editForm.quotedNo" :placeholder="$t('order.sale.contact')" size="mini" class="edit-form-width">-->
                  <!--<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>-->
                <!--</el-select>-->
                <el-form-item prop="buyerContactBy" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.buyerContactBy" :disabled="!!editForm.quotedNo" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.address')}}</td>
              <td>
                <el-form-item prop="buyerAddress" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.buyerAddress" :disabled="!!editForm.quotedNo" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contactPhone')}}</td>
              <td>
                <el-form-item prop="buyerTelephone" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.buyerTelephone" :disabled="!!editForm.quotedNo" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.email')}}</td>
              <td>
                <el-form-item prop="buyerEmail" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.buyerEmail" size="mini" :disabled="!!editForm.quotedNo" clearable class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
              <td>
                <el-form-item prop="buyerBankId" label-width="0" class="form-table-bottom">
                  <el-select v-model="editForm.buyerBankId" clearable :placeholder="$t('order.sale.selectBank')" size="mini" class="table-input-width" @change="setBuyerBankInfo">
                    <el-option v-for="(item, index) in customerBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-form-item>
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
                <el-form-item label-width="0" class="form-table-bottom">
                  <el-select v-model="editForm.sysCompanyBId" filterable :placeholder="$t('order.sale.selectSellerCompany')" size="mini" class="table-input-width" @change="setSellerInfo">
                    <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contact')}}</td>
              <td>
                <el-form-item prop="sellerContact" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.sellerContact" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.address')}}</td>
              <td>
                <el-form-item prop="sellerAddress" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.sellerAddress" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contactPhone')}}</td>
              <td>
                <el-form-item prop="sellerTelephone" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.sellerTelephone" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.email')}}</td>
              <td>
                <el-form-item prop="sellerEmail" label-width="0" class="form-table-bottom">
                  <el-input v-model="editForm.sellerEmail" clearable size="mini" class="table-input-width"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
              <td>
                <el-form-item prop="sellerBankId" label-width="0" class="form-table-bottom">
                  <el-select v-model="editForm.sellerBankId" clearable size="mini" :placeholder="$t('order.sale.selectBank')" class="table-input-width" @change="setSellerBankInfo">
                    <el-option v-for="(item, index) in sysBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-form-item>
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
        <div class="top-btns" v-if="!editForm.quotedNo">
          <el-button type="primary" size="small" @click="openDialog">{{$t('order.sale.addTo')}}</el-button>
        </div>
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

        <el-table-column align="center" width="110" :label="$t('product.product.customsCode')">
          <template slot-scope="scope">
            {{scope.row.customsCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('product.product.skuCode')">
          <template slot-scope="scope">
            {{scope.row.skuCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('product.product.productName')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" :label="$t('order.sale.productDescription')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="130" :label="$t('order.sale.reference')">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnSkuReference : scope.row.enSkuReference}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('order.sale.quotedQuantity')" prop="quotedQuantity">
          <template slot-scope="scope">
            <!--<el-input v-model.number="scope.row.productQuantity" type="number" @blur="changerAmount(scope.row)" />-->
            <el-input-number v-model="scope.row.productQuantity" :min="scope.row.miniOrderNumber" :precision="scope.row.skuDecimalPlaces" size="small" class="hidden-control" @blur="changerAmount(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unit')" >
          <template slot-scope="scope">
            {{scope.row.productUnit}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('order.sale.quotedPrice')" prop="quotedPrice">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.productPrice" :min="0" size="small" class="hidden-control" @blur="changerAmount(scope.row)"/>
            <!--<el-input v-model.number="scope.row.productPrice" type="number" @blur="changerAmount(scope.row)"/>-->
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" :label="$t('order.sale.amount')" prop="productAmount" show-overflow-tooltip/>

        <el-table-column align="center" min-width="150" :label="$t('common.table.remark')" prop="quotedRemark">
          <template slot-scope="scope">
            {{scope.row.quotedRemark}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" :label="$t('common.table.actions')" v-if="!editForm.quotedNo" prop="quotePrice">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="removeOrderSku(scope.$index)">{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item/>
      <el-row>
        <el-col :span="editForm.quotedNo ? 8 : 12">
          <el-form-item :label="$t('order.sale.freight')">
            <el-input v-model.number="editForm.orderFreight" type="number" clearable style="width: 180px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('order.sale.quotedAmount')" v-if="editForm.quotedNo">
            <!-- {{editForm.estimatedAmountAll | moneyFmt}} -->
            {{quotedAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="editForm.quotedNo ? 8 : 12">
          <el-form-item :label="$t('order.sale.totalAmount')">
            {{allAmount | moneyFmt}}<span style="color: red" v-show="overAllowMoney">（{{$t('order.sale.amountOverText')}}{{editForm.toleranceNumber}}%）</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item :label="$t('order.sale.deliveryDate')" prop="dateOfDelivery">
            <el-input v-model="editForm.dateOfDelivery" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.departure')" prop="departurePort">
            <el-input v-model="editForm.departurePort" maxlength="30" class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.destination')" prop="arrivePort">
            <el-input v-model="editForm.arrivePort" maxlength="30" class="edit-form-width" style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.transportBy')" prop="entrustTransportation">
            <el-select v-model="editForm.entrustTransportation" class="edit-form-width">
              <el-option :label="isZh?'SGI': 'SGI'" :value="0"></el-option>
              <el-option :label="isZh?'自提':'Self'" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.transportationMethod')" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" class="edit-form-width">
              <el-option v-for="(item,index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.payWay')" prop="payMode">
            <el-select v-model="editForm.payMode" class="edit-form-width">
              <el-option v-for="(item, index) in paymentList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.currency')" prop="orderCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.orderCurrency" clearable :placeholder="$t('order.sale.currencySearch')" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
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
                <span>{{isZh ?item.label:item.labelEn}}</span>
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
        <el-button type="primary" size="small" v-if="editForm.orderStatus !== 4" :loading="saveLoading" @click="onSubmit(1, 'editForm')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit(5, 'editForm')">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :title="$t('order.sale.selectProduct')" width="900px" center close-on-click-modal>
      <el-form label-width="130px" label-position="right" inline size="small">
        <el-form-item :label="$t('product.product.productCode')" prop="productCode">
          <el-input v-model.trim="searchObj.productCode" clearable :placeholder="$t('product.product.productCode')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')" prop="productName">
          <el-input v-model.trim="searchObj.productName" clearable :placeholder="$t('product.product.productName')" style="width: 240px"/>
        </el-form-item>
          <el-form-item :label="$t('product.product.skuAttributes')" prop="attrValueList">
            <el-input v-model.trim="searchObj.attrValueList" clearable :placeholder="$t('product.product.skuAttributes')" style="width: 240px"/>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
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
import { supplierPageList, supplierBankList, getLinkList, getPaymentDetail } from "@/api/supplier";
import { productListGetPrice } from '@/api/product'
import { parseTime, deepClone } from '@/utils/index'
import { detailQuotedPrice } from '@/api/inquiry'
// import { payTermsByBid } from '@/api/purchaseOrder'
import { addSaleOrder, saleOrderDetail, updateSaleOrder } from '@/api/order'
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
      quotedAmount: 0,
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
        clientPoDate: '',
        clientPoNo: '',
        salesOrderType: 1,
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
        transportationWay: '2',
        entrustTransportation: 0,
        shippingPort: '',
        purposePort: '',
        emailAddress: '',
        orderCurrency: '',
        exchangeRate: 0,
        dateOfDelivery: 0,
        payMode: '1',
        quotedRemarks: '',
        orderFreight: 0,
        toleranceNumber: '',
        choosedAttachment: '',
        orderRemarks: '',
        arrivePort: '',
        departurePort: ''
      },
      editFormRules: {
        buyerAddress: [{ required: true, message: this.$t('order.tip.bAddress'), trigger: 'blur' }],
        buyerContactBy: [{ required: true, message: this.$t('order.tip.bContact'), trigger: 'blur' }],
        buyerTelephone: [{ required: true, message: this.$t('order.tip.bPhone'), trigger: 'blur' }],
        buyerEmail: [{ type: 'email', required: true, message: this.$t('order.tip.bEmail'), trigger: 'blur' }],
        buyerBankId: [{ required: true, message: this.$t('order.tip.bBank'), trigger: 'change' }],
        sellerContact: [{ required: true, message: this.$t('order.tip.sContact'), trigger: 'blur' }],
        sellerEmail: [{ type: 'email', required: true, message: this.$t('order.tip.sEmail'), trigger: 'blur' }],
        sellerAddress: [{ required: true, message: this.$t('order.tip.sAddress'), trigger: 'blur' }],
        sellerTelephone: [{ required: true, message: this.$t('order.tip.sPone'), trigger: 'blur' }],
        sellerBankId: [{ required: true, message: this.$t('order.tip.sBank'), trigger: 'change' }],
        arrivePort: [{ required: true, message: this.$t('order.tip.arrivePort'), trigger: 'blur' }],
        departurePort: [{ required: true, message: this.$t('order.tip.departurePort'), trigger: 'blur' }],
        entrustTransportation: [{ required: true, message: this.$t('order.tip.entrustTransportation'), trigger: 'change' }],
        transportationWay: [{ required: true, message: this.$t('order.tip.transportationWay'), trigger: 'change' }],
        orderCurrency: [{ required: true, message: this.$t('order.tip.orderCurrency'), trigger: 'change' }],
        payMode: [{ required: true, message: this.$t('order.tip.payMode'), trigger: 'change' }]
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
      fileTypeList: [],
      cloneType: '',
      cloneSkuList: [],
      cloneForm: {},
      cloneControlTowerList: []
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
    selectQuoteSku() {
      return this.$store.state.order.quoteSku
    },
    orderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      return val.toFixed(4)
    },
    totalPayment() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val
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
        this.customerContactFun(val);
        this.getCustomerBankList(val)
      }
    },
    'editForm.supplierBId' (val) {
      if (val) {
        this.supplierContactFun(val);
        this.getSupplierBankList(val)
      }
    },
    'editForm.sysCompanyBId' (val) {
      if (val) {
        this.getCompanyBankList(val);
      }
    },
    orderMoneyTotal(val) {
      this.overAllowMoney = (Math.abs((this.quotedAmount - val) / this.quotedAmount * 100) > this.editForm.toleranceNumber) && this.editForm.quotedNo
    }
  },
  created() {
    this.getFileTypeList();
    this.getCustomerInfoListFun();
    this.getSupplierInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getCurrencyCodeList();
    if (this.$route.query.quoteId) {
      this.getQuoteDetail();
      this.orderSkuList = (this.selectQuoteSku || []).map(e => {
        e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
        e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
        e.mininumMoney = (e.mininum * e.unitPrice * 100) / 100;
        e.quoteMoney = Number(e.quotedQuantity) * Number(e.quotedPrice);
        e.cnProductDescription = e.cnAttrValueList;
        e.enProductDescription = e.enAttrValueList;
        e.productRemark = e.inquiryRemark;
        e.productPrice = e.quotedPrice;
        e.productQuantity = e.quotedQuantity;
        e.singleAmount = e.singlePackage;
        e.cnSkuReference = e.cnAttrValueList;
        e.enSkuReference = e.enAttrValueList;
        e.productAmount = (e.productQuantity * e.productPrice).toFixed(4);
        e.id = '';
        return { ... e }
      })
    }
    if (this.$route.query.id) {
      this.getSaleOrderDetail();
    }
    this.editType = this.$route.query.editType
  },
  destroyed() {
    this.$store.commit('SET_QUOTE_SKU', null);
  },
  methods: {
    changerAmount(e) {
      e.productAmount = ((e.productQuantity ? e.productQuantity : 0) * (e.productPrice ? e.productPrice : 0)).toFixed(4);
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/saleOrder'
        })
      })
    },
    changeType(val) {
      if (val === this.cloneType) {
        this.orderSkuList = this.cloneSkuList.map(e => {
          return { ...e }
        });
      } else {
        this.orderSkuList = []
      }
      this.editForm.supplierBId = '';
      this.editForm.customerBId = '';
      this.editForm.buyerContactBy = '';
      this.modalList = [];
      this.setBuyerInfo();
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
        // if (this.customerBankList.length && this.$route.query.quoteId) {
        //   this.editForm.buyerBankId = this.customerBankList.filter(e => e.defaultValue === 1)[0].id
        // }
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
    setBuyerBankInfo(val) {
      if (val) {
        let obj = this.customerBankList.filter(e => {
          return e.id === val
        })[0];
        this.editForm.buyerBank = obj.bankName;
        this.editForm.buyerBankAccount = obj.bankAccount;
        this.editForm.buyerSwiftcode = obj.swiftCode;
      } else {
        this.editForm.buyerBank = '';
        this.editForm.buyerBankAccount = '';
        this.editForm.buyerSwiftcode = '';
      }
    },
    setSellerBankInfo(val) {
      if (val) {
        let obj = this.sysBankList.filter(e => {
          return e.id === val
        })[0];
        this.editForm.sellerBank = obj.bankName;
        this.editForm.sellerBankAccount = obj.bankAccount;
        this.editForm.sellerSwifcode = obj.swiftCode;
      } else {
        this.editForm.sellerBank = '';
        this.editForm.sellerBankAccount = '';
        this.editForm.sellerSwifcode = '';
      }
    },
    // 获取主体企业银行卡列表
    getCompanyBankList(id) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.sysBankList = res.data.list || [];
        // if (this.sysBankList.length && this.$route.query.quoteId) {
        //   this.editForm.sellerBankId = this.sysBankList.filter(e => e.defaultValue === 1)[0].id
        // }
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
      selectSysOrderParameterApi({ orderParameterType: 2 }).then(res => {
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
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    removeOrderSku(index) {
      this.orderSkuList.splice(index, 1)
    },
    openDialog() {
      if (!this.editForm.supplierBId && !this.editForm.customerBId) {
        return this.$message.warning(this.$t('order.sale.selectCompanyMsg'))
      }
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
      // obj.customerBId = this.editForm.salesOrderType === 1 ? this.editForm.customerBId : this.editForm.supplierBId;
      // obj.productType = this.editForm.salesOrderType === 1 ? 1 : 2;
      obj.customerBId = this.editForm.customerBId;
      obj.productType = 1;
      this.listLoading1 = true;
      productListGetPrice(obj).then(res => {
        this.quoteSkuList = res.data.list.map(e => {
          e.mininum = e.minimum || 0;
          e.miniOrderNumber = e.mininum;
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
          e.skuDecimalPlaces = e.skuDecimalPlaces || 0;
          e.productImge = e.imagePath;
          // e.productBId = e.bid;
          e.skuBId = e.bid;
          e.productAmount = (e.productQuantity * e.productPrice).toFixed(4);
          e.id = '';
          e.bid = '';
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
        return this.$message.warning(this.$t('order.sale.selectProduct'))
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
        this.customerInfoList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSupplierInfoListFun() {
      supplierPageList({ pageNum: 1, pageSize: 999 }).then(res => {
        this.supplierList = res.data.list || [];
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
    changeNumber(item, val) {
      this.$nextTick(() => {
        item.productAmount = ((item.productQuantity * item.productPrice * 100) / 100).toFixed(4)
      })
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      getCustomerInfo({ bid: val }).then(res => {
        let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
        // this.modalList = res.data.customerContactList || [];
        if (!this.$route.query.id && !this.$route.query.quoteId) {
          this.controlTowerList = (payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList).map(e => {
            e.paymentTerm = e.dayNum;
            e.workflowNodeBId = e.controlNodeBId;
            return { ...e }
          });
          this.editForm.transportationWay = res.data.customerPaymentTerms.shipmentType;
          this.editForm.payMode = res.data.customerPaymentTerms.paymentMethod
          // if (this.modalList.length) {
          //   this.editForm.buyerContactBy = this.modalList[0].accountBId
          // } else {
          //   this.editForm.buyerContactBy = ''
          // }
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商联系人
    supplierContactFun(val) {
      getLinkList({ supplierBId: val }).then(res => {
        // this.modalList = res.data || [];
        // if (this.modalList.length) {
        //   this.editForm.buyerContactBy = this.modalList[0].accountBId
        // }
        if (!this.$route.query.id && !this.$route.query.quoteId) {
          this.selectPayTermsByBid(val)
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商付款条件节点数据
    selectPayTermsByBid(val) {
      getPaymentDetail({ supplierBId: val }).then(res => {
        this.controlTowerList = (res.data.sopnList && res.data.sopnList.length ? res.data.sopnList : res.data.sysOrderPayNodeList).map(e => {
          e.paymentTerm = e.dayNum;
          e.workflowNodeBId = e.controlNodeBId;
          return { ...e }
        });
        this.editForm.transportationWay = res.data.shipmentType;
        this.editForm.payMode = res.data.paymentMethod
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
        let arr = this.editForm.salesOrderType === 1 ? this.customerInfoList : this.supplierList;
        let obj = arr.filter(e => e.bid === val)[0];
        this.editForm.buyerAddress = obj.officeAddress;
        this.editForm.buyerName = obj.companyName || obj.supplierName;
        this.editForm.buyerTelephone = obj.mobilePhone;
        this.editForm.buyerEmail = obj.emailAddress;
        this.editForm.buyerCountryCode = obj.countryCode;
        this.editForm.buyerShort = obj.shortName
      } else {
        this.editForm.buyerAddress = '';
        this.editForm.buyerName = '';
        this.editForm.buyerTelephone = '';
        this.editForm.buyerEmail = '';
        this.editForm.buyerCountryCode = '';
        this.editForm.buyerShort = ''
      }
      this.editForm.buyerBankId = '';
      this.setBuyerBankInfo('')
    },
    setSellerInfo(val) {
      if (val) {
        let obj = this.sysCustomerInfoList.filter(e => e.bid === val)[0];
        this.editForm.sellerContact = obj.chargeBy;
        this.editForm.sellerAddress = obj.officeAddress;
        this.editForm.sellerTelephone = obj.chargePhone;
        this.editForm.sellerEmail = obj.emailAddress;
        this.editForm.sellerName = obj.companyName;
        this.editForm.sellerCountryCode = obj.countryCode;
        this.editForm.sellerName = obj.companyName;
        this.editForm.sellerShort = obj.companyShort
      } else {
        this.editForm.sellerContact = '';
        this.editForm.sellerAddress = '';
        this.editForm.sellerTelephone = '';
        this.editForm.sellerEmail = '';
        this.editForm.sellerName = '';
        this.editForm.sellerCountryCode = '';
        this.editForm.sellerName = '';
        this.editForm.sellerShort = ''
      }
      this.editForm.sellerBankId = '';
      this.setSellerBankInfo('')
    },
    getQuoteDetail() {
      detailQuotedPrice({ quotedPriceBId: this.$route.query.quoteId }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.salesOrderType = res.data.orderType === 1 ? 1 : 0;
        this.editForm.createTime = '';
        this.editForm.updateTime = '';
        this.editForm.createUserId = '';
        this.editForm.updateUserId = '';
        this.editForm.bid = '';
        this.editForm.sysCompanyBId = res.data.sellerBId;
        this.editForm.quotedBId = res.data.bid;
        this.editForm.quotedNo = res.data.quotationNo;
        this.editForm.id = '';
        this.editForm.entrustTransportation = res.data.transportation;
        this.editForm.customerBId = this.editForm.salesOrderType !== 0 ? res.data.buyerBId : '';
        this.editForm.supplierBId = this.editForm.salesOrderType === 0 ? res.data.buyerBId : '';
        // this.editForm.buyerContactBy = res.data.inquirerBId;
        this.editForm.transportationWay = String(res.data.transportationWay);
        this.editForm.orderCurrency = res.data.currency;
        this.editForm.payMode = res.data.paymentCondition;
        this.editForm.orderFreight = res.data.transportationCost;
        this.editForm.departurePort = res.data.departurePort;
        this.editForm.arrivePort = res.data.destinationPort;
        this.editForm.totalAmount = 0;
        this.editForm.netTotalAmount = 0;
        this.editForm.choosedAttachment = '';
        this.quotedAmount = res.data.totalAmounts;
        this.controlTowerList = res.data.quotedOrderPayNodeList.map(e => {
          e.paymentTerm = e.dayNum;
          e.workflowNodeBId = e.controlNodeBId;
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSaleOrderDetail() {
      saleOrderDetail({ orderBid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.salesOrderType = this.editForm.salesOrderType !== 0 ? 1 : 0;
        this.controlTowerList = this.editForm.salesOrderCollectionList.map(e => { return { ...e } });
        this.orderSkuList = this.editForm.salesOrderProductsList.map(e => {
          e.miniOrderNumber = e.miniOrderNumber || 0;
          e.skuDecimalPlaces = e.skuDecimalPlaces || 2;
          return { ...e }
        });
        if (this.editForm.choosedAttachment) {
          this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
        }
        this.cloneType = this.editForm.salesOrderType;
        this.cloneForm = Object.assign({}, this.editForm);
        this.cloneControlTowerList = this.editForm.salesOrderCollectionList.map(e => { return { ...e } });
        this.cloneSkuList = deepClone(this.orderSkuList);
        if (this.editForm.quotedBId) {
          detailQuotedPrice({ quotedPriceBId: this.editForm.quotedBId }).then(res => {
            this.quotedAmount = res.data.totalAmounts || 0;
            this.overAllowMoney = (Math.abs((this.quotedAmount - this.allAmount) / this.quotedAmount * 100) > this.editForm.toleranceNumber) && this.editForm.quotedNo
          }).catch(err => {
            this.$message.error(err.message);
          });
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    compareForm() {
      for (let key in this.editForm) {
        if ((typeof this.editForm[key]) === 'string' && this.editForm[key] !== this.cloneForm[key]) {
          return true
        } else if (!isNaN(this.editForm[key]) && this.editForm[key] !== this.cloneForm[key]) {
          return true
        }
      }
      return false
    },
    compareSkuList() {
      let flag = false;
      if (this.cloneSkuList.length !== this.orderSkuList.length) {
        flag = true
      } else {
        let length = this.orderSkuList.length;
        for (let i = 0; i < length; i++) {
          if (this.orderSkuList[i].skuBId !== this.cloneSkuList[i].skuBId) {
            flag = true
          } else if (this.orderSkuList[i].productQuantity !== this.cloneSkuList[i].productQuantity) {
            flag = true
          } else if (this.orderSkuList[i].productPrice !== this.cloneSkuList[i].productPrice) {
            flag = true
          }
        }
      }
      return flag
    },
    compareTList() {
      let flag = false;
      let length = this.controlTowerList.length;
      for (let i = 0; i < length; i++) {
        if (this.controlTowerList[i].paymentRatio !== this.cloneControlTowerList[i].paymentRatio) {
          flag = true
        } else if (this.controlTowerList[i].paymentTerm !== this.cloneControlTowerList[i].paymentTerm) {
          flag = true
        }
      }
      return flag
    },
    onSubmit(status, formName) {
      if (status === 5 && !this.orderSkuList.length) {
        return this.$message.warning(this.$t('order.sale.noProductMsg'));
      }
      if ((!this.editForm.customerBId || !this.editForm.supplierBId) && !this.editForm.sysCompanyBId) {
        return this.$message.warning(this.$t('order.sale.noCompanyMsg'));
      }
      if (!this.editForm.buyerBankId || !this.editForm.sellerBankId) {
        return this.$message.warning(this.$t('order.sale.noBankMsg'));
      }
      if (this.overAllowMoney) {
        return this.$message.warning(this.$t('order.sale.exceedMsg'));
      }
      if (this.totalPayment !== 100) {
        return this.$message.warning(this.$t('customer.customerList.proportion'))
      }
      if (this.compareForm() || this.compareSkuList() || this.compareTList()) {
        this.editForm.customerComfirmStatus = 0
      }
      for (let i = 0; i < this.orderSkuList.length; i++) {
        if (!this.orderSkuList[i].productPrice || !this.orderSkuList[i].productQuantity) {
          return this.$message.warning(this.$t('order.tip.noPrice'))
        }
      }
      if (this.editForm.salesOrderType) {
        this.editForm.supplierBId = '';
      } else {
        this.editForm.customerBId = ''
      }
      let arr = this.editForm.salesOrderType === 1 ? this.customerInfoList : this.supplierList;
      let bid = this.editForm.customerBId || this.editForm.supplierBId;
      let obj1 = arr.filter(e => e.bid === bid)[0];
      let obj2 = this.sysCustomerInfoList.filter(e => e.bid === this.editForm.sysCompanyBId)[0];
      this.editForm.buyerCountryCode = this.editForm.buyerCountryCode || obj1.countryCode;
      this.editForm.buyerShort = this.editForm.buyerShort || obj1.shortName;
      this.editForm.sellerCountryCode = this.editForm.sellerCountryCode || obj2.countryCode;
      this.editForm.sellerName = this.editForm.sellerName || obj2.companyName;
      this.editForm.sellerShort = this.editForm.sellerShort || obj2.companyShort;
      this.editForm.orderStatus = status === 1 ? (this.editForm.orderStatus || status) : status;
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
    .form-table-bottom {
      margin-bottom: 3px !important;
    }
    .table-input-width {
      width: 100%;
      min-width: 260px;
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
