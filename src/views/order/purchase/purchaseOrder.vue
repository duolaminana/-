<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('supplier.record.supplierName')">
            <el-input v-model.trim="postData.sellerName" clearable :placeholder="$t('supplier.record.supplierName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('supplier.record.supplierCode')">
            <el-input v-model.trim="postData.sellerCode" clearable :placeholder="$t('supplier.record.supplierCode')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.table.status')">
            <el-select v-model="postData.orderStatus" clearable :placeholder="$t('common.table.status')" style="width: 200px">
              <el-option :label="isZh?'全部':'All'" value=""></el-option>
              <el-option v-for="(item, index) in orderStatusList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('order.sale.orderNo')">
            <el-input v-model.trim="postData.purchaseNo" clearable :placeholder="$t('order.sale.orderNo')" style="width: 200px" />
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
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="goPage(1)">{{$t('order.purchase.server')}}</el-button>-->
      <el-button type="primary" size="small" @click="addClick(1)">{{$t('order.purchase.backToOrder')}}</el-button>
      <el-button type="primary" size="small" @click="addClick(2)">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteClick">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>
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
      <el-table-column min-width="130" :label="$t('order.sale.orderNo')" prop="purchaseNo" show-overflow-tooltip/>

      <el-table-column min-width="120" :label="$t('supplier.record.supplierCode')" prop="sellerCode" show-overflow-tooltip/>

      <el-table-column min-width="120" :label="$t('supplier.record.supplierName')" prop="sellerName" show-overflow-tooltip/>

      <el-table-column :label="$t('order.sale.phone')" prop="sellerTelephone" show-overflow-tooltip/>

      <el-table-column min-width="100" align="center" :label="$t('order.sale.skuTotal')" prop="skuCount" />

      <el-table-column min-width="100" align="center" :label="$t('order.sale.amount')" prop="netTotalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.createdBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('order.sale.orderDate')" prop="orderCreateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.orderCreateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :width="isZh?'100px':'120px'" :label="$t('common.table.status')" prop="orderStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.orderStatus | statusFmt(orderStatusList, isZh)}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh?'270px': '350px'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 6" @click="goRouter(1, scope.row.bid)">{{$t('common.table.edit')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus === 2" @click="goRouter(2, scope.row.bid)">
            {{$t('order.purchase.supplierConfirm')}}
          </el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus === 4" @click="goRouter(4, scope.row.bid)">
            {{$t('order.sale.confirm')}}/{{$t('common.buttonText.void')}}
          </el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus > 6 && scope.row.orderStatus < 21" @click="openDialog(scope.row.bid)">{{$t('order.sale.statusAction')}}</el-button>
          <!--<el-button type="primary" size="mini" v-if="scope.row.orderStatus > 6 && scope.row.orderStatus < 21" @click="openPayDialog(scope.row)">{{$t('order.purchase.paymentInstructions')}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('order.purchase.purchaseStatusAction')" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('order.sale.orderNo')">
              {{detailForm.purchaseNo}}
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
        <div style="margin-top: 20px">
          {{$t('order.sale.orderPrecess')}}
          <!--<el-button type="primary" size="mini" style="float: right" @click="openFiles(detailForm.bid)">相关文件上传</el-button>-->
        </div>

        <div>
          <order-step :list="allNodeList" :can-click="true" :type="1"></order-step>
        </div>

        <div class="related-file" v-if="detailForm.orderStatus === 5" @click="openRecordDialog">{{$t('order.sale.relatedFileUpload')}}</div>
        <el-popover
          placement="bottom-start"
          trigger="hover">
          <el-table
            fit
            size="mini"
            :data="saleOrderWithPurchaseList">
            <el-table-column width="120" align="center" prop="orderNo" :label="$t('order.sale.orderNo')"></el-table-column>
            <el-table-column width="150" align="center" prop="buyerName" :label="$t('order.sale.buyer')"></el-table-column>
            <el-table-column width="120" align="center" prop="sellerName" :label="$t('order.sale.seller')"></el-table-column>
            <el-table-column align="center" width="160" :label="$t('order.sale.orderDate')">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>
          </el-table>
          <div slot="reference" class="related-file" style="width: 200px">{{$t('order.purchase.relatedOrder')}}</div>
        </el-popover>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('order.sale.recordFiles')" width="900px" center :close-on-click-modal="false">
      <el-form label-width="150px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('order.sale.orderNo')">
              {{detailForm.purchaseNo}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('order.sale.orderDate')">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          {{$t('order.sale.orderPrecess')}}
        </div>
        <order-step :list="allNodeList"></order-step>

        <ApprovalHistory></ApprovalHistory>

        <div class="file-record-item">
          <div class="file-record-label">{{$t('order.sale.payVoucher')}}：</div>
          <el-table
            :data="payRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              :label="$t('common.table.id')"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" :label="$t('order.sale.uploadTime')">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.voucher')">
              <template slot-scope="scope">
                {{scope.row.attachmentName}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" :label="$t('common.table.actions')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('common.download')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="file-record-item">
          <div class="file-record-label">{{$t('order.sale.stockVoucher')}}：</div>
          <el-table
            :data="stockRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              :label="$t('common.table.id')"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" :label="$t('order.sale.uploadTime')">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.voucher')">
              <template slot-scope="scope">
                {{scope.row.attachmentName || 'null'}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" :label="$t('common.table.actions')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('common.download')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="file-record-item">
          <div class="file-record-label">{{$t('order.sale.deliveryVoucher')}}：</div>
          <el-table
            :data="deliveryRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              :label="$t('common.table.id')"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" :label="$t('order.sale.uploadTime')">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.voucher')">
              <template slot-scope="scope">
                {{scope.row.attachmentName || 'null'}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" :label="$t('common.table.actions')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('common.download')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="file-record-item">
          <div class="file-record-label">{{$t('order.sale.checkVoucher')}}：</div>
          <el-table
            :data="checkRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              :label="$t('common.table.id')"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" :label="$t('order.sale.uploadTime')">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.voucher')">
              <template slot-scope="scope">
                {{scope.row.attachmentName || 'null'}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" :label="$t('common.table.actions')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('common.download')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="payDialogVisible" :title="$t('order.purchase.applyPayments')" width="900px" center :close-on-click-modal="false">
      <div class="payment-box">
        <div class="payment-order">
          <div class="payment-order-item">
            <div>
              <div class="item-label">{{$t('order.sale.orderNo')}}</div>
              <div class="item-text">{{paymentData.purchaseNo}}</div>
            </div>
            <div>
              <div class="item-label">{{$t('order.sale.orderDate')}}</div>
              <div class="item-text">{{paymentData.orderCreateTime | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">{{$t('order.purchase.nowNode')}}</div>
              <div class="item-text">{{paymentData.orderStatus | statusFmt(orderStatusList, isZh)}}</div>
            </div>
            <div>
              <div class="item-label">{{$t('order.purchase.applier')}}</div>
              <div class="item-text">{{paymentData.updateUserId}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('order.purchase.supplierInfo')}}</div>
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
import ApprovalHistory from '@/components/ApprovalHistory'
import { parseTime, deepClone } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import { selectCountryListApi, selectCompanyBankAccountListApi, selectgetDictionaryBykeyApi } from '@/api/system'
import { supplierBankList } from '@/api/supplier'
import { getPaymentAmount, addPaymentInstruction } from '@/api/finance'
import { uploadActionUrl } from '@/api/common'
import {
  getPurchaseOrderList,
  deletePurchaseOrder,
  getDetailPOFlowById,
  getNodePurchase,
  getPurchaseRecordList,
  getPurchaseRelateOrder,
  exportPurchaseOrderExcel
} from '@/api/purchaseOrder'
export default {
  components: {
    Pagination,
    OrderStep,
    ApprovalHistory
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      dialogVisible1: false,
      payDialogVisible: false,
      rangeTime: [],
      selectList: [],
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
      paymentData: {
        branchName: ''
      },
      paymentForm: {
        paymentTime: '',
        applyPaymentAmount: '',
        paymentOrderType: 1,
        paymentCurrency: '',
        amountAll: 0,
        pendingPayment: 0,
        associatedOrderBId: '',
        customerBId: '',
        customerName: '',
        paymentDocList: [],
        attachmentName: '',
        attachmentPath: ''
      },
      dataList: [],
      countryList: [],
      allNodeList: [],
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      orderStatusList: [],
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
      }
    }
  },
  created() {
    this.getOrderStatusList();
    this.getDataList()
  },
  methods: {
    goRouter(type, id) {
      let path = type === 1 ? '/order/purchase/editPurchaseOrder' : '/order/purchase/detailPurchaseOrder';
      this.$router.push({
        path: path,
        query: {
          id: id,
          type: type
        }
      });
    },
    goPage() {
      this.$router.push({
        path: '/settlementFinance/financingService'
      });
    },
    addClick(type) {
      let path = type === 1 ? '/order/purchase/addPurchaseOrder' : '/order/purchase/editPurchaseOrder';
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      });
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportPurchaseOrderExcel(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'Purchase Order List.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
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
    openRecordDialog() {
      getPurchaseRecordList({ bid: this.detailForm.bid }).then(res => {
        this.stockRecordList = res.data.stocking;
        this.deliveryRecordList = res.data.ship;
        this.checkRecordList = res.data.acceptance;
        this.payRecordList = res.data.ppflist;
        this.dialogVisible1 = true;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    openDialog(id) {
      this.getPurchaseOrderDetail(id);
      this.getAllNodePurchaseOrder(id);
      this.getSalesOrderByPurchase(id)
    },
    openPayDialog(row) {
      this.payDialogVisible = true;
      this.paymentData = deepClone(row);
      this.paymentForm.paymentCurrency = this.paymentData.orderCurrency;
      this.paymentForm.amountAll = this.paymentData.totalAmount;
      this.paymentForm.customerBId = this.paymentData.supplierBId;
      this.paymentForm.customerName = this.paymentData.sellerName;
      this.paymentForm.associatedOrderBId = this.paymentData.bid;
      this.paymentForm.paymentAssociatedOrders = this.paymentData.purchaseNo;
      this.selectSurplusAmountFun(row.bid);
      this.getSupplierBankList(row.supplierBId, row.type);
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
        this.allNodeList = res.data.map((e, index) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          return { ...e }
        });
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
    // 获取供应商银行卡列表
    getSupplierBankList(val, type) {
      if (type === 2) {
        supplierBankList({ supplierBId: val }).then(res => {
          let obj = res.data.filter(e => e.id === this.paymentData.sellerBankId)[0];
          if (obj) {
            this.paymentData.branchName = obj.branchName
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      } else {
        selectCompanyBankAccountListApi({ companyInfoBId: val, pageNum: 1, pageSize: 999 }).then(res => {
          let obj = res.data.list.filter(e => e.id === this.paymentData.sellerBankId)[0];
          if (obj) {
            this.paymentData.branchName = obj.branchName
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    // 通过采购bid获取当前付款金额
    selectSurplusAmountFun(id) {
      getPaymentAmount({ associatedOrderBId: id, type: 1 }).then(res => {
        this.paymentForm.pendingPayment = res.data;
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
      this.$confirm(this.$t('common.tip.isDeleteMsg'), this.$t("system.userManage.hint"), {
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
        deletePurchaseOrder(obj).then(res => {
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
