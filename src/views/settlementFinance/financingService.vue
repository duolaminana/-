<template>
  <div class="app-container financingServer">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <el-form-item :label="$t('finance.financeProduct.name')">
          <el-input v-model.trim="postData.financingProductName" clearable style="width: 200px" :placeholder="$t('finance.financeProduct.name')"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')">
          <el-input v-model.trim="postData.financingProductCode" clearable style="width: 200px" :placeholder="$t('finance.financeChannel.name')"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteClick()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('finance.financeService.No')" prop="finacingServiceNo" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('finance.financeService.amount')" prop="loanAmount" width="120"/>

      <el-table-column :label="$t('finance.financeService.product')" prop="financingProductName" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeService.channel')" prop="instituteName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('finance.financeService.applier')" prop="updateUserName"/>

      <el-table-column align="center" width="160" :label="$t('finance.financeService.appliedTime')">
        <template slot-scope="scope">
          {{scope.row.approveTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="180px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail('detail',row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.approveStatus === 0 || row.approveStatus === 3" @click="openDialog('edit', row)">
            {{$t('common.table.edit')}}
          </el-button>
          <el-button type="primary" size="mini" v-if="row.approveStatus === 1" @click="openDetail('apply',row)">
            {{$t('finance.financeService.accept')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" :title="dialogType === 'add' ? $t('finance.financeService.add') : $t('finance.financeService.edit')"
               width="1100px" center @close="clearData('addForm')">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form ref="addForm" :model="addForm" v-if="addModel" :label-width="isZh ? '175px' : '200px'" label-position="left" size="small" style="margin-top: 15px" :rules="addFormRules">
            <el-form-item :label="$t('finance.financeService.productForm')" prop="financingProductBid">
              <el-select v-model="addForm.financingProductBid" filterable clearable class="form-dialog-width" style="width: 500px" @change="getProductInfo">
                <el-option v-for="(item, index) in productList" :label="item.financingProductName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.channelForm')" prop="instituteBid">
              <el-select v-model="addForm.instituteBid" filterable clearable :disabled="!addForm.financingProductBid" class="form-dialog-width" style="width: 500px" @change="getChannelInfo">
                <el-option v-for="(item, index) in channelList" :label="item.instituteName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('logistics.logisticsOrder.orderType')" prop="orderType">
              <el-radio-group v-model="addForm.orderType">
                <el-radio label="0">{{$t('logistics.logisticsOrder.sales')}}</el-radio>
                <el-radio label="1">{{$t('logistics.logisticsOrder.other')}}</el-radio>
                <el-radio label="2">{{$t('logistics.logisticsOrder.purchase')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.order')" prop="orderNoList">
              <el-input v-model="addForm.orderNoList" readonly :placeholder="$t('finance.financeService.orderService')" style="width:500px;"></el-input>
              <el-button type="primary" class="export" @click="openAddOrderDialog">{{$t('common.addTo')}}</el-button>
            </el-form-item>
            <div style="margin: 20px;border-top: 1px solid #eee"></div>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.payment')" prop="totalAmount">
                  <el-input v-model.number="addForm.totalAmount" type="number" clearable style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.amount')" prop="loanAmount">
                  <el-input v-model.number="addForm.loanAmount" type="number" clearable style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.paymentMethod')" prop="interestCalculationMethod">
                  <el-select v-model="addForm.interestCalculationMethod" style="width: 150px">
                    <el-option v-for="(item, index) in payMethodList" :label="language === 'zh' ? item.methodZh : item.method" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col style="padding: 0">
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.currency')" prop="paymentCurrency">
                    <el-select filterable
                               v-model="addForm.paymentCurrency"
                               remote
                               :remote-method="selectCurrencyCodeListFun"
                               style="width: 150px"
                               :loading="loading1"
                               clearable>
                      <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.rate')" prop="interestRate">
                    <el-input v-model.number="addForm.interestRate" clearable oninput="value=value.replace(/[^\d.]/g,'')" style="width: 150px" />
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.table.status')">
                  {{addForm.approveStatus | statusFilter(language === 'zh')}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.start')" prop="startDate">
                  <el-date-picker
                    v-model="addForm.startDate"
                    :picker-options="pickerOptionsStart"
                    type="date"
                    style="width: 150px">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.end')" prop="endDate">
                  <el-date-picker
                    v-model="addForm.endDate"
                    :picker-options="pickerOptionsEnd"
                    type="date"
                    style="width: 150px">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <div style="margin-top: 10px">
              {{$t('finance.financeService.file')}}
              <el-button type="primary" size="small" style="margin: 0 20px" @click="addFileRow">{{$t('finance.financeService.addFile')}}</el-button>
            </div>
            <el-table
              :data="fileList"
              border
              fit
              style="margin: 10px 0 20px"
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column
                align="center"
                type="index"
                :label="$t('common.table.id')"
                width="55">
              </el-table-column>

              <el-table-column align="center" :label="$t('finance.financeService.fileType')" prop="documentName">
                <template slot-scope="{row}">
                  {{row.documentName}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <my-upload
                    style="display: inline-block"
                    :accept="scope.row"
                    :show-file="false"
                    :on-success="handleSuccess">
                  </my-upload>
                  <el-button type="danger" size="mini" @click="deleteFileRow(scope.$index)">{{$t('common.table.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!--<el-form-item :label="$t('common.remark')">-->
              <!--<el-input v-model="addForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" clearable placeholder="remark"/>-->
            <!--</el-form-item>-->

            <div style="text-align: center;margin: 30px 0">
              <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2, 0)">
                {{$t('common.buttonText.save')}}
              </el-button>
              <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2, 1)">
                {{$t('common.buttonText.submit')}}
              </el-button>
              <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.cancel')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeService.repayment')" name="2" v-if="addForm.bid">
          <div style="text-align: right;padding-right: 30px">
            <el-button type="primary" size="mini" @click="addRecordRow">{{$t('common.add')}}</el-button>
          </div>
          <el-table
            :data="recordList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.paymentDate')">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.paymentDate"
                  type="date"
                  style="width: 100%">
                </el-date-picker>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.principal')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.principalAmount" type="number" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.interest')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.intrest" type="number" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.penalty')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.penaltyIntrest" type="number" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.balance')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.balanceAmount" type="number" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.currency')" width="130" prop="paymentCurrency"/>

            <el-table-column align="center" :label="$t('common.table.actions')" width="90" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="savePaymentRecord(scope)">
                  {{$t('common.buttonText.save')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        width="1000px"
        center
        :title="$t('logistics.logisticsOrder.orderList')"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        append-to-body>
        <div class="search-box">
          <el-form label-width="80px" size="small" inline class="edit-form">
            <el-form-item :label="$t('logistics.logisticsOrder.orderNo')">
              <el-input v-model.trim="orderSearchData.orderNo" clearable :placeholder="$t('logistics.logisticsOrder.orderNo')" size="mini"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" class="export" @click="searchOrderList">{{$t('common.search')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          ref="multipleTable"
          :data="orderList"
          border
          fit
          style="margin: 10px 0"
          size="small"
          @selection-change="getSelectOrderList"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column
            align="center"
            type="selection"
            width="50">
          </el-table-column>

          <el-table-column
            :label="$t('logistics.logisticsOrder.indesNo')"
            align="center"
            type="index"
            width="50">
          </el-table-column>

          <el-table-column align="center" :label="$t('logistics.logisticsOrder.orderNo')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.orderNo || scope.row.purchaseNo}}
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('logistics.logisticsOrder.buyerName')" prop="buyerName" show-overflow-tooltip/>

          <el-table-column align="center" :label="$t('logistics.logisticsOrder.sellerName')" prop="sellerName" show-overflow-tooltip/>

          <el-table-column align="center" width="160" :label="$t('logistics.logisticsOrder.paymentCurrency')" prop="orderCurrency" show-overflow-tooltip/>

          <el-table-column align="center" width="160" :label="$t('logistics.logisticsOrder.createTime')" prop="companyName" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.createTime | timeFmt}}
            </template>
          </el-table-column>

        </el-table>

        <Pagination :total="orderSearchData.total" :page.sync="orderSearchData.pageIndex" :limit.sync="orderSearchData.pageSize" @pagination="getOrderListByType"/>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="addOrderToService">{{$t('common.buttonText.confirm')}}</el-button>
          <el-button type="danger" size="small" @click="innerVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
        </div>
      </el-dialog>

    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="detailModal" :title="auditType === 'detail' ? $t('finance.financeService.detail') : isZh ?'金融服务审核':'Financial services audit'" width="1100px" center @close="clearData">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form ref="addForm" :model="detailData" :label-width="isZh ? '175px' : '200px'" label-position="left" size="small" style="margin-top: 15px" :rules="addFormRules">
            <el-form-item :label="$t('finance.financeService.productForm')" prop="financingProductBid">
              <el-select v-model="detailData.financingProductBid" filterable disabled
                         class="form-dialog-width"
                         style="width: 500px">
                <el-option v-for="(item, index) in productList" :label="item.financingProductName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.channelForm')">
              <el-select v-model="detailData.instituteBid" filterable disabled
                         class="form-dialog-width"
                         style="width: 500px">
                <el-option v-for="(item, index) in channelList" :label="item.instituteName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('logistics.logisticsOrder.orderType')">
              <el-radio-group v-model="detailData.orderType" disabled>
                <el-radio label="0">{{$t('logistics.logisticsOrder.sales')}}</el-radio>
                <el-radio label="1">{{$t('logistics.logisticsOrder.other')}}</el-radio>
                <el-radio label="2">{{$t('logistics.logisticsOrder.purchase')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.order')">
              <el-input v-model="detailData.orderNoList" disabled :placeholder="$t('finance.financeService.orderService')" style="width:500px;"></el-input>
            </el-form-item>
            <div style="margin: 20px;border-top: 1px solid #eee"></div>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.payment')">
                  <el-input v-model="detailData.totalAmount" type="number" disabled style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.amount')" >
                  <el-input v-model="detailData.loanAmount" type="number" disabled style="width: 150px" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.paymentMethod')" >
                  <el-select v-model="detailData.interestCalculationMethod" disabled style="width: 150px" >
                    <el-option v-for="(item, index) in payMethodList" :label="language === 'zh' ? item.methodZh : item.method" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col style="padding: 0">
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.currency')" >
                    <el-select filterable
                               v-model="detailData.paymentCurrency"
                               remote
                               :remote-method="selectCurrencyCodeListFun"
                               :loading="loading1"
                               disabled
                               style="width: 150px">
                      <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.rate')" >
                    <el-input v-model.number="detailData.interestRate" disabled style="width: 150px" />
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.table.status')">
                  {{detailData.approveStatus | statusFilter(language === 'zh')}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.start')" >
                  <el-date-picker
                    v-model="detailData.startDate"
                    type="date"
                    disabled
                    style="width: 150px">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.end')" >
                  <el-date-picker
                    v-model="detailData.endDate"
                    type="date"
                    disabled
                    style="width: 150px">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <div style="margin-top: 10px">
              {{$t('finance.financeService.file')}}
            </div>
            <el-table
              :data="fileList"
              border
              fit
              style="margin: 10px 0 20px"
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column
                align="center"
                type="index"
                :label="$t('common.table.id')"
                width="55">
              </el-table-column>

              <el-table-column align="center" :label="$t('finance.financeService.fileType')" >
                <template slot-scope="{row}">
                  {{row.documentName}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" class="export" @click="downFile(scope.row.documentPath)">
                    {{$t('common.table.download')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="isApply">{{isZh?'审批意见':'Audit opinion'}}</div>
            <el-input v-show="isApply" v-model="applyText" type="textarea"></el-input>
            <div style="text-align: center;margin: 30px 0" v-show="isApply">
              <el-button type="primary" size="small" @click="Auditpass('2')">{{isZh?'审核通过':'Audit pass'}}</el-button>
              <el-button type="primary" size="small" @click="Auditpass('3')">{{isZh?'审核驳回':'Audit rejected'}}</el-button>
              <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
            <div style="text-align: center;margin: 30px 0" v-show="!isApply">
              <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeService.repayment')" v-if="!isApply" name="2">
          <el-table
            :data="recordList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.paymentDate')">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.paymentDate"
                  type="date"
                  disabled
                  style="width: 100%">
                </el-date-picker>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.principal')">
              <template slot-scope="scope">
                {{scope.row.principalAmount}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.interest')">
              <template slot-scope="scope">
                {{scope.row.intrest}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.penalty')">
              <template slot-scope="scope">
                {{scope.row.penaltyIntrest}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.balance')">
              <template slot-scope="scope">
                {{scope.row.balanceAmount}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.currency')" />
          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// import ApprovalFlow from '@/components/ApprovalFlow'
import MyUpload from '@/components/MyUpload'
import {
  financeProduct,
  financeChannel,
  financeService,
  addFinanceService,
  updateFinanceService,
  delBatchFinanceService,
  financeServicePaymentRecord,
  saveServiceRecord,
  updateServiceRecord,
  exportByFinancingService,
  updateAudioFinancingServiceById,
  getFinanceChannelByProduct
} from '@/api/finance'
import { selectCurrencyCodeListApi } from '@/api/system'
import {
  getSaleOrderListByType,
  getTransitradeOrderListByType,
  getPurchaseOrderListByType
} from '@/api/logistic'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination,
    MyUpload
  },
  data() {
    return {
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      isApply: false,
      auditType: '',
      approveCommentsBid: '',
      approveCommentsid: '',
      applyText: '',
      dataList: [],
      listLoading: true,
      addLoading: false,
      loading1: false,
      channelLoading: false,
      addModel: false,
      detailModal: false,
      addChannelModal: false,
      innerVisible: false,
      activeName: '1',
      dialogType: '',
      newRoleName: '',
      detailData: {},
      addForm: {
        approveStatus: 0,
        serviceStatus: 0,
        loanAmount: 0,
        interestRate: 0,
        orderType: '0',
        orderArr: [],
        orderNoList: '',
        orderBIdList: '',
        financingProductBid: '',
        financingProductName: '',
        paymentCurrency: '',
        interestCalculationMethod: 1,
        totalAmount: 0,
        instituteBid: '',
        instituteName: '',
        startDate: '',
        endDate: ''
      },
      addFormRules: {
        financingProductBid: [
          { required: true, message: this.$t('finance.financeService.inputProduct'), trigger: 'change' }
        ],
        instituteBid: [
          { required: true, message: this.$t('finance.financeService.inputBid'), trigger: 'change' }
        ],
        paymentCurrency: [
          { required: true, message: this.$t('finance.financeService.inputCurrency'), trigger: 'change' }
        ],
        interestCalculationMethod: [
          { required: true, message: this.$t('finance.financeService.inputMethods'), trigger: 'change' }
        ],
        startDate: [
          { required: true, message: this.$t('finance.financeService.inputStart'), trigger: 'change' }
        ],
        endDate: [
          { required: true, message: this.$t('finance.financeService.inputEnd'), trigger: 'change' }
        ],
        orderNoList: [
          { required: true, message: this.$t('finance.financeService.inputOrder'), trigger: 'change' }
        ],
        loanAmount: [
          { type: 'number', required: true, message: this.$t('finance.financeService.inputAmount'), trigger: 'blur' }
        ],
        totalAmount: [
          { type: 'number', required: true, message: this.$t('finance.financeService.inputTotalAmount'), trigger: 'blur' }
        ],
        interestRate: [
          { type: 'number', required: true, message: this.$t('finance.financeService.inputRate'), trigger: 'blur' }
        ]
      },
      channelList: [],
      productList: [],
      recordList: [],
      fileList: [
        {
          attachmentUuid: '',
          documentName: '',
          documentPath: '',
          financingServiceBId: ''
        }
      ],
      orderList: [],
      payMethodList: [
        {
          id: 1,
          methodZh: '按年计算',
          method: 'annualized'
        },
        {
          id: 2,
          methodZh: '按月计算',
          method: 'by the month'
        },
        {
          id: 3,
          methodZh: '按日计算',
          method: 'by the day'
        }
      ],
      currencyCodeList: [],
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        financingProductCode: '',
        financingProductName: '',
        status: ''
      },
      statusList: [
        {
          labelZh: '使用中',
          label: 'Enabled',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ],
      orderType: '',
      selectOrderList: [],
      orderSearchData: {
        orderNo: '',
        orderStatus: 5,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.addForm.endDate) {
            return time.getTime() > this.addForm.endDate
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.addForm.startDate) {
            return time.getTime() < this.addForm.startDate
          }
        }
      }
    }
  },
  created() {
    this.getDataList();
    this.getChannelList();
    this.getProductList();
    this.selectCurrencyCodeListFun();
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  methods: {
    setOption() {
      this.addFormRules = {
        financingProductBid: [
          { required: true, message: this.$t('finance.financeService.inputProduct'), trigger: 'change' }
        ],
        instituteBid: [
          { required: true, message: this.$t('finance.financeService.inputBid'), trigger: 'change' }
        ],
        paymentCurrency: [
          { required: true, message: this.$t('finance.financeService.inputCurrency'), trigger: 'change' }
        ],
        interestCalculationMethod: [
          { required: true, message: this.$t('finance.financeService.inputMethods'), trigger: 'change' }
        ],
        startDate: [
          { required: true, message: this.$t('finance.financeService.inputStart'), trigger: 'change' }
        ],
        endDate: [
          { required: true, message: this.$t('finance.financeService.inputEnd'), trigger: 'change' }
        ],
        orderNoList: [
          { required: true, message: this.$t('finance.financeService.inputOrder'), trigger: 'change' }
        ],
        loanAmount: [
          { type: 'number', required: true, message: this.$t('finance.financeService.inputAmount'), trigger: 'blur' }
        ],
        totalAmount: [
          { type: 'number', required: true, message: this.$t('finance.financeService.inputTotalAmount'), trigger: 'blur' }
        ],
        interestRate: [
          { type: 'number', required: true, message: this.$t('finance.financeService.inputRate'), trigger: 'blur' }
        ]
      }
    },
    clearData() {
      // this.$refs['addForm'].resetFields();
      this.applyText = '';
      this.fileList = [{
        attachmentUuid: '',
        documentName: '',
        documentPath: '',
        financingServiceBId: ''
      }];
      this.addForm.bid = '';
      this.addForm.id = '';
      this.addForm.approveStatus = 0;
      this.addForm.serviceStatus = 0;
      this.addForm.loanAmount = 0;
      this.addForm.interestRate = 0;
      this.addForm.orderType = '0';
      this.addForm.orderArr = [];
      this.addForm.orderNoList = '';
      this.addForm.orderBIdList = '';
      this.addForm.financingProductBid = '';
      this.addForm.financingProductName = '';
      this.addForm.paymentCurrency = '';
      this.addForm.interestCalculationMethod = 1;
      this.addForm.totalAmount = 0;
      this.addForm.instituteBid = '';
      this.addForm.instituteName = '';
      this.addForm.startDate = '';
      this.addForm.endDate = '';
      this.getDataList();
    },
    selectCurrencyCodeListFun(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectCurrencyCodeListApi(val).then(res => {
          _this.currencyCodeList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.currencyCodeList = [];
      }
    },
    Auditpass(type) {
      if (this.applyText === '') {
        return this.$message.warning(this.language === 'zh' ? '请输入审核意见' : 'Please enter your comments')
      }
      let obj = {};
      if (type === '2') {
        obj.approveStatus = 2;
        obj.approveComments = this.applyText;
        obj.id = this.approveCommentsid;
        obj.bid = this.approveCommentsBid
      } else {
        obj.approveStatus = 3;
        obj.approveComments = this.applyText;
        obj.id = this.approveCommentsid;
        obj.bid = this.approveCommentsBid
      }
      updateAudioFinancingServiceById(obj).then(res => {
        this.detailModal = false
        this.getDataList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getChannelListByBId(id) {
      getFinanceChannelByProduct({ bid: id }).then(res => {
        this.channelList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      financeService(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.activeName = '1';
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = Object.assign(this.addForm, row);
        this.orderType = this.addForm.orderType;
        this.fileList = this.addForm.financingServiceApplyDocList
        this.getRecordList(row.bid);
      }
      this.addModel = true;
    },
    openDetail(type, row) {
      this.activeName = '1';
      this.auditType = type
      if (type === 'apply') {
        this.isApply = true
      } else {
        this.isApply = false
      }
      this.approveCommentsBid = row.bid
      this.approveCommentsid = row.id
      this.detailData = Object.assign(this.detailData, row);
      this.fileList = this.detailData.financingServiceApplyDocList
      this.getRecordList(row.bid);
      this.detailModal = true;
    },
    getSelectOrderList(selects) {
      this.selectOrderList = selects
    },
    // 打开选择订单窗口
    openAddOrderDialog() {
      this.innerVisible = true;
      this.orderSearchData.orderNo = '';
      this.getOrderListByType()
    },
    searchOrderList() {
      this.orderSearchData.pageNum = 1;
      this.getOrderListByType()
    },
    getOrderListByType() {
      let api = '';
      switch (Number(this.addForm.orderType)) {
        case 0: api = getSaleOrderListByType; break;
        case 1: api = getTransitradeOrderListByType; break;
        case 2: api = getPurchaseOrderListByType; break;
      }
      api(this.orderSearchData).then(res => {
        this.orderList = res.data.list || [];
        this.orderSearchData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    addOrderToService() {
      if (!this.selectOrderList.length) {
        return this.$message.warning(this.$t('finance.financeService.inputOrder'))
      }
      this.orderType = this.addForm.orderType;
      this.addForm.orderNoList = this.selectOrderList.map(e => {
        e.orderNoList = e.orderNo || e.purchaseNo;
        return e.orderNoList
      }).join(',');
      this.addForm.orderBIdList = this.selectOrderList.map(e => e.bid).join(',');
      this.selectOrderList = [];
      this.$refs.multipleTable.clearSelection();
      this.innerVisible = false;
    },
    addRecordRow() {
      this.recordList.push({
        balanceAmount: 0,
        financingServiceBId: this.addForm.bid,
        intrest: 0,
        paymentCurrency: this.addForm.paymentCurrency,
        paymentDate: '',
        penaltyIntrest: 0,
        principalAmount: 0
      })
    },
    savePaymentRecord(scope) {
      let api = !scope.row.id ? saveServiceRecord : updateServiceRecord;
      api(scope.row).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getRecordList(scope.row.financingServiceBId)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getRecordList(id) {
      financeServicePaymentRecord({ financingServiceBId: id }).then(res => {
        this.recordList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getProductList() {
      financeProduct({ pageNum: 1, pageSize: 999 }).then(res => {
        this.productList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getChannelList() {
      financeChannel({ pageNum: 1, pageSize: 999 }).then(res => {
        this.channelList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getProductInfo(val) {
      let obj = this.productList.filter(e => e.bid === val)[0];
      this.addForm.financingProductName = obj.financingProductName;
      if (val) {
        this.getChannelListByBId(val)
      } else {
        this.channelList = [];
      }
    },
    getChannelInfo(val) {
      let obj = this.channelList.filter(e => e.bid === val)[0];
      this.addForm.instituteName = obj.instituteName
    },
    addFileRow() {
      this.fileList.push({
        attachmentUuid: '',
        documentName: '',
        documentPath: '',
        financingServiceBId: ''
      })
    },
    deleteFileRow(index) {
      this.fileList.splice(index, 1)
    },
    submitClick(formName, type, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = type === 1 ? addFinanceService : updateFinanceService;
          this.addLoading = true;
          this.addForm.financingServiceApplyDocList = this.fileList.filter(e => e.documentPath);
          this.addForm.approveStatus = status;
          this.addForm.orderType = this.orderType;
          api(this.addForm).then(res => {
            this.$message.success(type === 1 ? this.$t("system.userManage.addSuccess") : this.$t("system.userManage.updata"));
            this.addForm.bid = type === 1 ? res.data : this.addForm.bid;
            this.postData.pageNum = 1;
            this.addLoading = false;
            this.getDataList();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        }
      })
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t("system.userManage.option"));
      }
      this.$confirm(this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"), {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: 'warning',
          center: true
        }).then(() => {
        let obj = { ids: this.selectList.map(e => e.id).join(',') };
        delBatchFinanceService(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t("system.userManage.handle"));
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
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    handleSuccess(res, file, fileList, row) {
      row.attachmentUuid = res.data.Uuid;
      row.documentPath = res.data.filePath;
      row.documentName = file.name;
      row.financingServiceBId = this.addForm.bid
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportByFinancingService(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'financeServiceList.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    statusFilter(status, flag) {
      const statusMapZh = ['未提交', '待审核', '审核通过', '审核失败', '已完成'];
      const statusMap = ['Not submitted', 'Approval Pending', 'Approve', 'Approved fail', 'Completed'];
      return flag ? statusMapZh[status] : statusMap[status]
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>
