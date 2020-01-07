<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form label-width="120px" inline size="small">
        <!-- <div>
          <el-form-item label="供应商名称">
            <el-input v-model="postData.sellerName" clearable placeholder="请输入供应商名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="供应商编码">
            <el-input v-model="postData.sellerCode" clearable placeholder="请输入供应商编码" style="width: 200px" />
          </el-form-item>
        </div> -->
        <div>
          <el-form-item :label="$t('settlementFinance.purchase.PurchaseOrderNo')">
            <el-input v-model.trim="postData.paymentAssociatedOrders" clearable style="width: 200px" />
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
      <!-- <el-button type="primary" size="small" @click="addClick(1)">从销售订单新增</el-button>
      <el-button type="primary" size="small" @click="addClick(2)">新增</el-button>
      <el-button type="primary" size="small" @click="deleteClick">删除</el-button> -->
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      size="mini"
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <!-- <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column :label="$t('settlementFinance.purchase.collectionNo')" prop="paymentInstructionNo" show-overflow-tooltip/>
      <el-table-column :label="$t('settlementFinance.purchase.orderNo')" prop="paymentAssociatedOrders" show-overflow-tooltip/>

      <el-table-column :label="$t('settlementFinance.purchase.clientAbbr')" prop="customerName" show-overflow-tooltip/>

      <!--<el-table-column align="center" label="类型" prop="paymentOrderType" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.paymentOrderType | OrderType(language)}}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" :label="$t('settlementFinance.purchase.amount')" prop="applyPaymentAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.applyPaymentAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('settlementFinance.purchase.curency')" prop="paymentCurrency" show-overflow-tooltip/>

      <el-table-column align="center" width="150px" :label="$t('system.role.status')" prop="approveStatus">
        <template slot-scope="scope">
          {{scope.row.approveStatus | orderStatusFmt(language)}}
        </template>
      </el-table-column>

      <!-- <el-table-column label="供应商名称" prop="sellerName" show-overflow-tooltip/>

      <el-table-column label="电话" prop="sellerTelephone" show-overflow-tooltip/>

      <el-table-column align="center" width="70" label="SKU数" prop="skuCount" />

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/> -->

      <el-table-column align="center" width="170" :label="$t('settlementFinance.purchase.paymentTime')" prop="customerName">
        <template slot-scope="scope">
          {{scope.row.paymentTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDialog(scope.row.paymentOrderType, scope.row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.approveStatus ===1" @click="openDialog(scope.row.paymentOrderType, scope.row, 1)">
            {{$t('settlementFinance.purchase.apply')}}</el-button>
          <el-button type="primary" size="mini" class="export" v-if="scope.row.approveStatus ===3" @click="goRouter(scope.row.paymentOrderType, scope.row, 2)">
            {{$t('settlementFinance.purchase.paymentRecord')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    <!--采购订单-->
    <el-dialog :visible.sync="dialogVisible" :title="$t('settlementFinance.sale.PaymentInstructionDetail')" width="1100px" center :close-on-click-modal="false" >
      <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" id="printDiv">
        <el-row class="row-item">
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.SalesOrderNo')+'：'">
              {{detailForm.paymentAssociatedOrders}}
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
              {{detailForm.createUserName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.carriage.createTime')+'：'">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.CollectionDate')+'：'">
              {{detailForm.paymentTime | timeFmt}}
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
        <el-row v-if="isProgress">
          <el-col class="row-item">
            <el-form-item :label="$t('settlementFinance.purchase.paymentProcess')">
              <order-step :list="allNodeList" :active="nodeActive"></order-step>
            </el-form-item>
          </el-col>
        </el-row>
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
                  {{detailForm.purchaseOrder.buyerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('customer.record.country')}}</td><td>{{detailForm.purchaseOrder.buyerCountryCode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm.purchaseOrder.buyerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm.purchaseOrder.buyerBranchName}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm.purchaseOrder.buyerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm.purchaseOrder.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm.purchaseOrder.buyerSwiftcode}}</td>
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
                  {{detailForm.purchaseOrder.sellerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('customer.record.country')}}</td><td>{{detailForm.purchaseOrder.sellerCountryCode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm.purchaseOrder.sellerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm.purchaseOrder.sellerBranchName}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm.purchaseOrder.sellerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm.purchaseOrder.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm.purchaseOrder.sellerSwifcode}}</td>
              </tr>
              <!-- <tr>
                <td>出发港口</td><td>{{detailForm.departurePort}}</td>
              </tr> -->
            </table>
          </el-col>
        </el-row>
        <el-row class="row-item">
          <div style="line-height: 1.5rem;font-weight: bold">{{$t('settlementFinance.sale.CollectionInformation')}}</div>
          <el-col :span="24">
            <el-form-item :label="$t('settlementFinance.sale.OrderAmount')">
              {{detailForm.amountAll | moneyFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('settlementFinance.sale.OrderCurrency')">
              {{detailForm.paymentCurrency}}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="当前实收金额">
              {{detailForm.paidAmount | moneyFmt}}
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item :label="$t('settlementFinance.sale.PendingCollection')">
              {{detailForm.pendingPayment | moneyFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item :label="$t('logistics.logisticsOrder.applyPaymentAmount')">
              <!--<el-input v-model.number="detailForm.applyPaymentAmount" size="small" clearable style="width: 200px"/>-->
              {{detailForm.applyPaymentAmount}}
            </el-form-item>
              <!--<div >{{$t('logistics.logisticsOrder.applyPaymentAmount')}}</div>-->
              <!--<div >-->
                <!--<el-input v-model.number="paymentForm.applyPaymentAmount" size="small" clearable style="width: 200px"/>-->
              <!--</div>-->
          </el-col>
          <!--<el-col :span="24" >-->
            <!--<el-form-item :label="$t('logistics.logisticsOrder.paymentTime')">-->
              <!--<el-date-picker v-model="paymentForm.paymentTime" type="date" placeholder="select date" style="width: 200px"/>-->
            <!--</el-form-item>-->
              <!--&lt;!&ndash;<div class="item-label">{{$t('logistics.logisticsOrder.paymentTime')}}</div>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="item-text">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-date-picker v-model="paymentForm.paymentTime" type="date" placeholder="select date" style="width: 200px"/>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--</el-col>-->
          <el-col :span="24" >
            <el-form-item :label="$t('settlementFinance.sale.CollectionDate')">
              {{detailForm.paymentTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-item" v-show="isProgress">
          <el-col>
            <div style="font-weight: bold;line-height: 1.5rem;margin-bottom:10px;">
              {{$t('settlementFinance.sale.CollectionRecordList')}}
              <!--<el-button size="mini" style="float:right" type="primary">新增</el-button>-->
            </div>
            <el-table
              :data="recRecordList"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
             <el-table-column
               align="center"
               type="index"
               width="55">
             </el-table-column>

              <el-table-column align="center" :label="$t('settlementFinance.sale.ReceivingTime')" prop="collectionTime" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.createTime | timeFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('inquiry.inquiryOrder.currency')" prop="collectionCurrency" show-overflow-tooltip>
                {{addForm.paymentCurrency}}
              </el-table-column>

              <el-table-column align="center" :label="$t('query.tableLabel.Amount')" prop="paymentAmount" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{scope.row.paymentAmount | moneyFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('customer.collect.supporting')" prop="fileName" show-overflow-tooltip/>

              <el-table-column align="center" :label="$t('common.table.actions')" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.paymentDocList[0].attachmentPath)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
                  <!--<el-button type="primary" size="mini" v-if="!detailModal" @click="removeFile(scope)">{{$t('common.table.delete')}}</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div style="font-weight: bold;line-height: 1.5rem;margin-bottom:10px;">
          {{$t('query.tableLabel.AppendixUpload')}}
        </div>
        <el-table
          :data="detailForm.paymentDocList"
          border
          fit
          style="margin: 10px 0"
          size="small"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" :label="$t('query.tableLabel.AnnexName')" prop="attachmentName">
          </el-table-column>
          <el-table-column align="center" :label="$t('common.table.actions')" >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" v-show="!isProgress" @click="Printing">{{$t('settlementFinance.sale.print')}}</el-button>-->
        <el-button type="primary" size="small" v-show="isProgress" :loading="loading" @click="addOrderPayment">{{$t('settlementFinance.purchase.apply')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <!-- 物流订单-->
    <el-dialog :visible.sync="paymentVisible" :title="$t('logistics.logisticsOrder.applayLogisticsOrder')" width="900px" center :close-on-click-modal="false">
      <div class="payment-box">
        <div class="payment-order">
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.logisticsOrderNo')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.logisticsOrderNo}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.logisticsOrderDate')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.logisticsOrderDate | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.customerBasicInfoBId')}}</div>
              <div class="item-text">{{logisticsCompanyName}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.transportationMethod')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.transportationMethod | transportationFilter(language)}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.departurePortAdd')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.departurePortAdd}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.destinationPortAdd')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.destinationPortAdd}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.etd2')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.etd | timeFmt}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.eta2')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.eta | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.orderNo')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.orderNo}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier" v-if="logisticsdetailForm.logisticsOrderDetail.supplierInfo">
          <div>
            <div>{{$t('logistics.logisticsOrder.supplierInfo')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.supplierName')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.chargeBy')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.chargeBy}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.mobilePhone')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.mobilePhone}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.registerAddress')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.registerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.countryCode')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.countryCode}}</div>
            </div>
          </div>
          <div>
            <div>{{$t('logistics.logisticsOrder.supplierBankAccount')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.bankName')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount.bankName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.branchName')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount.branchName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.bankAccount')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount.bankAccount}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.bankAddress')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount.bankAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.swiftCode')}}</div>
              <div class="item-text">{{logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount.swiftCode}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('logistics.logisticsOrder.paymentInfo')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.logisticsOrderAmount2')}}</div>
              <div class="item-text">{{logisticsdetailForm.amountAll | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.paymentCurrency2')}}</div>
              <div class="item-text">{{logisticsdetailForm.paymentCurrency}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.pendingPayment')}}</div>
              <div class="item-text">{{logisticsdetailForm.pendingPayment | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.applyPaymentAmount')}}</div>
              <!--<div class="item-text">-->
                <!--<el-input v-model.number="paymentForm.applyPaymentAmount" size="small" clearable style="width: 200px"/>-->
              <!--</div>-->
              <div class="item-text">{{logisticsdetailForm.applyPaymentAmount | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.paymentTime')}}</div>
              <!--<div class="item-text">-->
                <!--<el-date-picker v-model="paymentForm.paymentTime" type="date" placeholder="select date" style="width: 200px"/>-->
              <!--</div>-->
              <div class="item-text">{{logisticsdetailForm.applyPaymentDate | timeFmt}}</div>
            </div>
            <!--<div class="payment-supplier-item">-->
              <!--<div class="item-label">{{$t('logistics.logisticsOrder.applicationReason')}}</div>-->
              <!--&lt;!&ndash;<div class="item-text">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-input type="textarea" v-model="paymentForm.applicationReason" style="width: 60%"/>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</div>-->
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('query.tableLabel.AppendixUpload')}}</div>
            <el-table
              :data="logisticsdetailForm.paymentDocList"
              border
              fit
              style="margin: 10px 0"
              size="small"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" :label="$t('query.tableLabel.AnnexName')" prop="attachmentName">
              </el-table-column>
              <el-table-column align="center" :label="$t('common.table.actions')" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" @click="addOrderPayment">{{$t('common.buttonText.submit')}}</el-button>-->
        <el-button type="primary" size="small" v-show="isProgress" :loading="loading" @click="addOrderPayment">{{$t('settlementFinance.purchase.apply')}}</el-button>
        <el-button type="danger" size="small" @click="paymentVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <!-- 过渡订单-->
    <el-dialog :visible.sync="dialogVisible1" :title="$t('settlementFinance.sale.PaymentInstructionDetail')" width="1100px" center :close-on-click-modal="false" >
      <el-form ref="detailForm" :model="detailForm1" label-width="140px" size="small">
        <el-row class="row-item">
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.SalesOrderNo')+'：'">
              {{detailForm1.paymentAssociatedOrders}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.CurrentNode')+'：'">
              {{detailForm1.nodeName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.collectionNo')+'：'">
              {{detailForm1.collectionNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.Applicant')+'：'">
              {{detailForm1.createUserName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.carriage.createTime')+'：'">
              {{detailForm1.createTime | timeFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('settlementFinance.sale.CollectionDate')+'：'">
              {{detailForm1.paymentTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            {{$t('settlementFinance.sale.ClientInformation')}}
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('query.tableLabel.CustomerName')}}</td>
                <td width="60%">
                  <!--<el-select v-model="detailForm1.customerBId" disabled placeholder="请选择公司名称" class="edit-form-width">-->
                  <!--<el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                  <!--</el-select>-->
                  {{detailForm1.transitradeOrderDetailVo.buyerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('customer.record.country')}}</td><td>{{detailForm1.transitradeOrderDetailVo.buyerCountryCode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm1.transitradeOrderDetailVo.buyerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm1.transitradeOrderDetailVo.buyerBranchName}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm1.transitradeOrderDetailVo.buyerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm1.transitradeOrderDetailVo.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm1.transitradeOrderDetailVo.buyerSwiftcode}}</td>
              </tr>
              <!-- <tr>
                <td>目的港口</td><td>{{detailForm1.arrivePort}}</td>
              </tr> -->
            </table>
          </el-col>
          <el-col :span="11">
            {{$t('settlementFinance.sale.ReceiverInformation')}}：
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('settlementFinance.sale.AccountName')}}</td>
                <td width="60%">
                  <!--<el-select v-model="detailForm1.sysCompanyBId" disabled placeholder="请选择卖方企业名称" class="edit-form-width">-->
                  <!--<el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                  <!--</el-select>-->
                  {{detailForm1.transitradeOrderDetailVo.sellerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('customer.record.country')}}</td><td>{{detailForm1.transitradeOrderDetailVo.sellerCountryCode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm1.transitradeOrderDetailVo.sellerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm1.transitradeOrderDetailVo.sellerBranchName}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm1.transitradeOrderDetailVo.sellerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm1.transitradeOrderDetailVo.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm1.transitradeOrderDetailVo.sellerSwifcode}}</td>
              </tr>
              <!-- <tr>
                <td>出发港口</td><td>{{detailForm1.departurePort}}</td>
              </tr> -->
            </table>
          </el-col>
        </el-row>
        <el-row class="row-item">
          <div style="line-height: 1.5rem;font-weight: bold">{{$t('settlementFinance.sale.CollectionInformation')}}</div>
          <el-col :span="24">
            <el-form-item :label="$t('settlementFinance.sale.OrderAmount')">
              {{detailForm1.amountAll | moneyFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('settlementFinance.sale.OrderCurrency')">
              {{detailForm1.paymentCurrency}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('settlementFinance.sale.PendingCollection')">
              {{detailForm1.pendingPayment | moneyFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item :label="$t('logistics.logisticsOrder.applyPaymentAmount')">
              {{detailForm1.applyPaymentAmount}}
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item :label="$t('settlementFinance.sale.CollectionDate')">
              {{detailForm1.paymentTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-item" v-show="isProgress">
          <el-col>
            <div style="font-weight: bold;line-height: 1.5rem;margin-bottom:10px;">
              {{$t('settlementFinance.sale.CollectionRecordList')}}
              <!--<el-button size="mini" style="float:right" type="primary">新增</el-button>-->
            </div>
            <el-table
              :data="recRecordList1"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column
                align="center"
                type="index"
                width="55">
              </el-table-column>

              <el-table-column align="center" :label="$t('settlementFinance.sale.ReceivingTime')" prop="collectionTime" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.createTime | timeFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('inquiry.inquiryOrder.currency')" prop="collectionCurrency" show-overflow-tooltip>
                {{addForm.paymentCurrency}}
              </el-table-column>

              <el-table-column align="center" :label="$t('query.tableLabel.Amount')" prop="paymentAmount" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{scope.row.paymentAmount | moneyFmt}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('customer.collect.supporting')" prop="fileName" show-overflow-tooltip/>

              <el-table-column align="center" :label="$t('common.table.actions')" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.paymentDocList[0].attachmentPath)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
                  <!--<el-button type="primary" size="mini" v-if="!detailModal" @click="removeFile(scope)">{{$t('common.table.delete')}}</el-button>-->
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div style="font-weight: bold;line-height: 1.5rem;margin-bottom:10px;">
          {{$t('query.tableLabel.AppendixUpload')}}
        </div>
        <el-table
          :data="detailForm1.paymentDocList"
          border
          fit
          style="margin: 10px 0"
          size="small"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" :label="$t('query.tableLabel.AnnexName')" prop="attachmentName">
          </el-table-column>
          <el-table-column align="center" :label="$t('common.table.actions')" >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" v-show="!isProgress" @click="Printing">{{$t('settlementFinance.sale.print')}}</el-button>-->
        <el-button type="primary" size="small" v-show="isProgress" :loading="loading" @click="addOrderPayment">{{$t('settlementFinance.purchase.apply')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
// import ApprovalHistory from '@/components/ApprovalHistory'
import { parseTime, deepClone } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import { selectCountryListApi, selectCompanyBankAccountListApi, getSupplyCompanyList } from '@/api/system'
// import { selectLogisticsOrderByIdAPI } from '@/api/logistic'
import { listCustomerBank } from '@/api/customer'
// import { getPurchaseOrderList, deletePurchaseOrder, getDetailPOFlowById, getNodePurchase, getPurchaseRecordList, getPurchaseRelateOrder, exportPurchaseOrderExcel } from '@/api/finance'
import {
  getPurchaseOrderList,
  // getPurchaseRecordList,
  paymentExportEasypoi,
  detailPaymentDataApi,
  submitApproval
} from '@/api/finance'
export default {
  components: {
    Pagination,
    OrderStep
    // ApprovalHistory
  },
  mixins: [moneyFmt],
  data() {
    return {
      listLoading: true,
      paymentVisible: false,
      paymentVisible1: false,
      loading1: false,
      dialogVisible: false,
      dialogVisible1: false,
      loading: false,
      recRecordList: [],
      recRecordList1: [],
      rangeTime: [],
      selectList: [],
      companyList: [
        {
          companyName: ''
        }
      ],
      saleOrderWithPurchaseList: [],
      payRecordList: [],
      stockRecordList: [],
      deliveryRecordList: [],
      checkRecordList: [],
      isProgress: false,
      nodeActive: 0,
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
        applicationReason: '',
        paymentDocList: []
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        sellerName: '',
        sellerCode: '',
        purchaseNo: '',
        sdate: '',
        edate: '',
        endInstructionTime: "",
        paymentAssociatedOrders: "",
        startInstructionTime: ""
      },
      paymentBid: '',
      logisticsCompanyName: '',
      addForm: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        collectionRemark: ''
      },
      detailForm: {
        purchaseOrder: {}
      },
      detailForm1: {
        transitradeOrderDetailVo: {}
      },
      logisticsdetailForm: {
        logisticsOrderDetail: []
      },
      dataList: [],
      customerBankList: [],
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
    this.getDataList()
    this.getSysCustomerInfoListFun()
  },
  methods: {
    addOrderPayment() {
      // const { paymentTime, applyPaymentAmount } = this.paymentForm;
      // if (!paymentTime || !applyPaymentAmount) {
      //   return this.$message.warning('Payment and application time cannot be empty')
      // }
      // console.log(this.paymentForm)
      this.loading = true
      submitApproval({
        bid: this.paymentBid
      }).then(res => {
        // this.$message.success('Submit Success');
        // this.paymentForm.paymentTime = '';
        // this.paymentForm.applyPaymentAmount = '';
        // this.paymentForm.applicationReason = '';
        if (res.status === 200) {
          this.$message.success(this.$t("system.userManage.handle"));
          this.getDataList();
          this.loading = false
        }
        this.dialogVisible1 = false;
        this.dialogVisible = false;
        this.paymentVisible = false
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openDialog(paymentOrderType, row, type) {
      if (type) {
        this.isProgress = true
      } else {
        this.isProgress = false
      }
      this.paymentBid = row.bid
      // console.log(type === 'payent')
      if (row.paymentOrderType === 1) {
        this.dialogVisible = true;
        detailPaymentDataApi({ bid: row.bid, type: 1 }).then(res => {
          this.detailForm = Object.assign(this.detailForm, res.data);
          this.addForm.paymentCurrency = this.detailForm.purchaseOrder.orderCurrency;
          // console.log(this.addForm.paymentCurrency)
          this.recRecordList = (res.data.paymentRecordVoList || []).map(e => {
            e.fileName = e.paymentDocList.map(e => e.attachmentName).join(',');
            return { ...e }
          })
          this.allNodeList = res.data.purchaseOrder.wfplist.filter((e) => {
            e.currentCompletion = (e.currentCompletion || 0).toString();
            return e.nodeType === 2
          });
          this.getCustomerBankList(this.detailForm.customerBId, this.detailForm.buyerBankId);
          this.getCompanyBankList(this.detailForm.purchaseOrder.sysCompanyBId, this.detailForm.sellerBankId);
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else if (row.paymentOrderType === 2) {
        detailPaymentDataApi({ bid: row.bid, type: 2 }).then(res => {
          this.paymentVisible = true;
          this.logisticsdetailForm = deepClone(res.data);
          // this.logisticsdetailForm.logisticsOrderDetail.transportationMethod = Number(this.logisticsdetailForm.logisticsOrderDetail.transportationMethod);
          // console.log(this.logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount === null)
          if (this.logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount === null) {
            this.logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount = []
          }
          for (let i = 0; i < this.companyList.length; i++) {
            if (this.companyList[i].bid === this.logisticsdetailForm.logisticsOrderDetail.companyInfoBId) {
              this.logisticsCompanyName = this.companyList[i].companyName
            }
          }
          // this.logisticsdetailForm.supplierInfo.logisticsOrderDetail.supplierBankAccount = this.logisticsdetailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount || [];
          // this.paymentForm.paymentCurrency = this.logisticsdetailForm.paymentCurrency;
          // this.paymentForm.logisticsOrderAmount = this.logisticsdetailForm.logisticsOrderAmount;
          // this.paymentForm.supplierInfoBId = this.logisticsdetailForm.supplierInfoBId;
          // this.paymentForm.supplierName = this.logisticsdetailForm.supplierInfo.supplierName;
          // this.paymentForm.logisticsOrderBId = this.logisticsdetailForm.bid;
          // this.paymentForm.logisticsOrderNo = this.logisticsdetailForm.logisticsOrderDetail.logisticsOrderNo;
          // this.selectSurplusAmountFun(row.bid);
        }).catch(err => {
          this.$message.error(err.message)
        });
        this.getSysCustomerInfoListFun()
      } else if (row.paymentOrderType === 3) {
        this.dialogVisible1 = true;
        detailPaymentDataApi({ bid: row.bid, type: 3 }).then(res => {
          this.detailForm1 = Object.assign(this.detailForm1, res.data);
          this.addForm.paymentCurrency = this.detailForm1.transitradeOrderDetailVo.orderCurrency;
          // console.log(this.addForm.paymentCurrency)
          this.recRecordList1 = (res.data.paymentRecordVoList || []).map(e => {
            e.fileName = e.paymentDocList.map(e => e.attachmentName).join(',');
            return { ...e }
          })
          this.getCustomerBankList(this.detailForm1.transitradeOrderDetailVo.customerBId, this.detailForm1.buyerBankId);
          this.getCompanyBankList(this.detailForm1.transitradeOrderDetailVo.sysCompanyBId, this.detailForm1.sellerBankId);
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    // selectSurplusAmountFun(id) {
    //   getPaymentAmount({ associatedOrderBId: id, type: 2 }).then(res => {
    //     this.paymentForm.pendingPayment = res.data;
    //   });
    // },
    // companyFilter(id) {
    //   if (id) {
    //     let obj = this.companyList.filter(e => e.bid === id)[0];
    //     return obj.companyName
    //   }
    // },
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.companyList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取客户银行列表
    getCustomerBankList(id, bankId) {
      listCustomerBank({ customerBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.customerBankList = res.data.list || [];
        let obj = this.customerBankList.filter(e => {
          return e.id === bankId
        })[0];
        if (obj) {
          // this.detailForm.buyerBankAddress = obj.bankAddress;
          this.detailForm.buyerBranchName = obj.branchName;
        }
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
        if (obj) {
          this.detailForm.sellerBranchName = obj.branchName;
        }
        // this.detailForm.sellerBankAddress = obj.bankAddress;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    goRouter(type, row, isApply) {
      let path = type === 1 ? '/settlementFinance/payment/paymentMGT' : '/settlementFinance/payment/editLogistics';
      switch (Number(type)) {
        case 1: path = '/settlementFinance/payment/paymentMGT'; break;
        case 2: path = '/settlementFinance/payment/editLogistics'; break;
        case 3: path = '/settlementFinance/payment/transferPayment'; break;
      }
      this.$router.push({
        path: path,
        query: {
          id: row.bid,
          paymentInstructNo: row.paymentInstructionNo,
          type: type,
          isApply: isApply
        }
      });
    },
    addClick(type) {
      let path = type === 1 ? '/settlementFinance/purchase/addPurchaseOrder' : '/settlementFinance/purchase/editPurchaseOrder';
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      });
    },
    outportData() {
      let obj = {
        pageNum: '',
        pageSize: '',
        endInstructionTime: this.postData.endInstructionTime,
        paymentAssociatedOrders: this.postData.paymentAssociatedOrders,
        startInstructionTime: this.postData.startInstructionTime
      };
      paymentExportEasypoi(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'purchaseOrder.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
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
    // openRecordDialog() {
    //   getPurchaseRecordList({ bid: this.detailForm.bid }).then(res => {
    //     this.stockRecordList = res.data.stocking;
    //     this.deliveryRecordList = res.data.ship;
    //     this.checkRecordList = res.data.acceptance;
    //     this.payRecordList = res.data.ppflist;
    //     this.dialogVisible1 = true;
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   })
    // },
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
      if (this.$route.query.customerBId) {
        obj.customerBId = this.$route.query.customerBId
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
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    // OrderType(val, language) {
    //   let typeName = (val === 1) ? language === 'zh' ? '采购订单' : 'PurchaseOrder' : language === 'zh' ? '物流订单' : 'LogisticsOrder';
    //   return typeName
    // },
    timeFmt1(val) {
      if (val) {
        return parseTime(val)
      }
    },
    transportationFilter(id, flag) {
      switch (id) {
        case 1: return flag ? '汽运' : 'By Truck';
        case 2: return flag ? '铁路' : 'By Railway';
        case 3: return flag ? '海运' : 'By Ship';
        case 4: return flag ? '空运' : 'By Air';
        default: break
      }
    },
    orderStatusFmt: function (val, language) {
      let statusName = '';
      switch (val) {
        case 1: return language === 'zh' ? '编辑中' : 'Editing';
        case 2: return language === 'zh' ? '审核中' : 'To Approve';
        case 3: return language === 'zh' ? '审批通过' : 'Execute Successfully';
        case 4: return language === 'zh' ? '审核未通过' : 'Audit Failed';
      }
      return statusName;
    },
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status]
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
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
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
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .row-item {
        padding: 16px 0;
        border-bottom: 1px solid $border-light-color;
      }
    }
  }
</style>
