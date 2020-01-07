<template>
  <div class="app-container table-demo">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '140px'" inline size="small">
        <div>
          <el-form-item :label="$t('query.tableLabel.CustomerName')" >
            <el-input v-model.trim="postData.buyer" clearable :placeholder="$t('query.placeholder.CustomerName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomerCoding')">
            <el-input v-model.trim="postData.customerCode" clearable :placeholder="$t('query.placeholder.CustomerCoding')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.customizeStatus" clearable :placeholder="$t('common.status')" style="width: 150px">
              <el-option v-for="(item, index) in customizeStatusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.customizeStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('query.tableLabel.CustomOrderNumber')" label-width="">
            <el-input v-model.trim="postData.tailormadeFormNumber" clearable :placeholder="$t('query.placeholder.CustomOrderNumber')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.country')" prop="buyerState">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.buyerState" clearable :placeholder="$t('system.business.searchCountryCode')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('finance.financeService.start')">
            <el-date-picker
              v-model="postData.startTime"
              :picker-options="pickerOptionsStart"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.end')">
            <el-date-picker
              v-model="postData.endTime"
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
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="disableClick()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportCustomOrderExcelFun()">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist"
      :element-loading-text="$t('system.userManage.loading')"
      type="expand"
      border
      fit
      size="mini"
      row-key="customOrderIds"
      :indent="indent"
      :expand-row-keys="expandArr"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('query.tableLabel.CustomOrderNumber')" prop="tailormadeFormNumber" show-overflow-tooltip/>

      <el-table-column :label="$t('query.tableLabel.CustomerCompany')" prop="buyer" show-overflow-tooltip/>

      <el-table-column :label="$t('query.tableLabel.countryAndPhoneNumber')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{language === 'zh' ?scope.row.cnCountryName :scope.row.enCountryName}}/{{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('query.tableLabel.FileNum')" prop="fileNums"/>

      <el-table-column align="center" width="100" :label="$t('query.tableLabel.inquirer')" prop="customByName" show-overflow-tooltip>
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.contactNameList[0].contactName }}-->
        <!--</template>-->
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('query.tableLabel.InquiryTime')" prop="inquiryTime">
        <template slot-scope="scope">
          {{scope.row.inquiryTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :width="isZh?'120px': '150px'" :label="$t('common.status')" prop="customizeStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.customizeStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.customizeStatus | customizeStatusFmt(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh?'260px':'250px'" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="row.customizeStatus === 2" @click="openQuoted(row)">{{$t('query.tableLabel.offer')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.customizeStatus===2" @click="detailDialog(row, true)">{{language === 'zh' ? '拒绝报价' : 'Reject'}}</el-button>
          <!--<el-button type="danger" size="mini" v-if="row.customizeStatus === 1 || row.customizeStatus === 2" @click="deleteClick(row)">删除</el-button>-->
          <el-button type="primary" size="mini" v-if="row.customizeStatus === 1" @click="openDialog('edit',row)">{{$t('common.table.edit')}}</el-button>
          <span v-if="row.customizeStatus === 4 && row.quotedPriceList.length">
            <el-dropdown size="mini" v-if="row.quotedPriceList.length >1" type="primary" style="margin-left: 10px" @command="detailQuoted">
              <el-button type="primary" size="mini" class="export">{{$t('query.tableLabel.CheckTheQuotation')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in row.quotedPriceList" :command="item.bid" :key="index">{{$t('query.tableLabel.quotationNumber')}}：{{item.quotationNo}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" v-else size="mini" class="export" style="margin-left: 10px" @click="detailQuoted(row.quotedPriceList[0].bid)">{{$t('query.tableLabel.CheckTheQuotation')}}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    <!-- 选择添加定制单弹框 -->
    <el-dialog :visible.sync="dialogVisible"
               :title="detailModal?$t('query.tableLabel.details'):(dialogType==='add'?$t('query.tableLabel.addCustomized'):$t('query.tableLabel.EditCustomized'))"
               center @closed="clearData" width="1000px">
      <el-form ref="addCompany" v-if="dialogType==='edit' || detailModal" :model="customData" label-width="150px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="$t('query.tableLabel.CustomOrderNumber')" prop="tailormadeFormNumber">
          {{customData.tailormadeFormNumber}}
          <!--<el-input v-model="customData.tailormadeFormNumber" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly/>-->
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.InquiryTime')" prop="inquiryTime">
          {{customData.inquiryTime | timeFmt}}
          <!--<el-input v-model="customData.inquiryTime" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly/>-->
        </el-form-item>
      </el-form>
      <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
        <!--<tr>-->
          <!--<td style="width: 180px;">{{$t('logistics.logisticsOrder.orderType')}}</td>-->
          <!--<td>-->
            <!--<el-select v-model="customData.orderType" style="width: 600px" disabled @change="clearCustomer">-->
              <!--&lt;!&ndash;:disabled="Boolean(customData.id) && detailModal"&ndash;&gt;-->
              <!--<el-option :label="$t('query.tableLabel.MerchandiseSalesList')" :value="1"></el-option>-->
              <!--<el-option :label="$t('query.tableLabel.RawMaterialSalesList')" :value="0"></el-option>-->
            <!--</el-select>-->
          <!--</td>-->
        <!--</tr>-->
        <tr>
          <td style="width: 180px;">{{$t('logistics.logisticsTrace.buyer')}}</td>
          <td>
            <el-select v-model="customData.customerBasicInfoBId" :disabled="Boolean(customData.id) && detailModal" filterable clearable :placeholder="$t('query.placeholder.userCompany')" style="width: 600px">
              <el-option v-for="(item, index) in customerInfoList" :label="customData.orderType === 1?item.companyName:item.supplierName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">{{$t('query.tableLabel.inquirer')}}</td>
          <td>
            <!--暂时不通过买方企业进行询价人关联-->
            <el-select v-model="customData.customBy" :disabled="Boolean(customData.id) && detailModal" clearable :placeholder="$t('query.placeholder.selectInquirer')" :no-data-text="$t('query.noDataText')" style="width: 600px">
              <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
            </el-select>
            <!--<el-input v-model="customData.customBy" :disabled="Boolean(customData.id) && detailModal" clearable :placeholder="$t('query.placeholder.selectInquirer')" style="width: 600px"/>-->
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">{{$t('system.userManage.address')}}</td>
          <td>
            <el-input v-model="customData.buyerAddress" clearable :disabled="Boolean(customData.id) && detailModal" :placeholder="$t('query.placeholder.address')" style="width: 600px"/>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">{{$t('common.personal.telephone')}}</td>
          <td>
            <el-input v-model="customData.buyerTelephone" clearable :disabled="Boolean(customData.id) && detailModal" :placeholder="$t('query.placeholder.phone')" style="width: 600px"/>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">{{$t('inquiry.inquiryOrder.buyerContactBy')}}</td>
          <td>
            <el-input v-model="customData.buyerContact" clearable :disabled="Boolean(customData.id) && detailModal" :placeholder="$t('query.placeholder.buyerContact')" style="width: 600px" />
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">{{$t('common.personal.email')}}</td>
          <td>
            <el-input v-model="customData.buyerMailbox" clearable :disabled="Boolean(customData.id) && detailModal" :placeholder="$t('query.placeholder.email')" style="width: 600px"/>
          </td>
        </tr>
      </table>
      <div class="table-top">
        <div class="top-title"></div>
        <div class="top-btns" v-if="!detailModal">
          <el-button type="primary" size="small" @click="openGoodsDialog">{{$t('query.tableLabel.ChooseCommodity')}}</el-button>
          <el-button type="primary" size="small" @click="addSku">{{$t('query.tableLabel.add')}}</el-button>
          <el-button type="danger" size="small" @click="deleteSku">{{$t('common.table.delete')}}</el-button>
        </div>
      </div>
      <el-table
        :data="customProductList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px;margin-bottom:20px;"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="selectProd">

        <el-table-column align="center" type="selection" width="50"/>

        <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55"/>

        <el-table-column align="center" min-width="80" :label="$t('logistics.logisticsOrder.productName')" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.cnProductName" :readonly="!!scope.row.skuBId" :autosize="{ minRows: 4, maxRows: 6}" size="small" :placeholder="$t('query.tableLabel.cnProductName')" clearable
                      style="font-size: 12px;margin-bottom:10px"/>
            <el-input v-model="scope.row.enProductName" :readonly="!!scope.row.skuBId" :autosize="{ minRows: 4, maxRows: 6}" size="small" :placeholder="$t('query.tableLabel.enProductName')" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="80" :label="$t('query.tableLabel.describeSKU')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cnAttrValueList" :readonly="!!scope.row.skuBId" :autosize="{ minRows: 4, maxRows: 6}" size="small" :placeholder="$t('query.tableLabel.cnAttrValueList')" clearable style="font-size:
            12px;margin-bottom:10px"/>
            <el-input v-model="scope.row.enAttrValueList" :readonly="!!scope.row.skuBId" :autosize="{ minRows: 4, maxRows: 6}" size="small" :placeholder="$t('query.tableLabel.enAttrValueList')" clearable style="font-size:
            12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" :label="$t('order.sale.unit')">
          <template slot-scope="scope">
            <!--v-if="dialogType==='edit' || detailModal"-->
            <el-input v-model="scope.row.productUnit" :readonly="!!scope.row.skuBId" size="small" clearable />
            <!--<span v-else>{{scope.row.productUnit}}</span>-->
          </template>
        </el-table-column>

        <!--<el-table-column align="center" label="起订金额" prop="mininumMoney"/>-->

        <el-table-column align="center" width="180px" :label="$t('query.tableLabel.productRemark')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" :placeholder="$t('query.tableLabel.productRemark')" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="90" :label="$t('query.tableLabel.Quantity')">
         <template slot-scope="scope">
            <el-input-number v-model="scope.row.productQuantity" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>
      </el-table>
      <el-form ref="addCompany" :model="customData" label-width="200px" label-position="right" inline size="small" :rules="menuDataRules">
        <!-- <el-form-item :label="$t('query.tableLabel.CustomerInquirer')" prop="customBy">
          <el-select v-model="customData.customBy" clearable :placeholder="$t('query.placeholder.selectInquirer')" :no-data-text="$t('query.noDataText')" class="form-dialog-width">
            <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('query.tableLabel.DeparturePort')" prop="departurePort">
          <el-input v-model="customData.departurePort" clearable :placeholder="$t('query.placeholder.DeparturePort')" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.DeliveryDate')" prop="dateOfDelivery">
          <el-input-number v-model="customData.dateOfDelivery" style="width:140px" clearable :placeholder="$t('query.tableLabel.DeliveryDate')" class="form-dialog-width"/>{{$t('system.sysPwdSet.day')}}
        </el-form-item>
        <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="transportation">
          <el-radio-group v-model="customData.transportation" style="">
            <el-radio :label="0">SGI</el-radio>
            <el-radio :label="1">{{$t('inquiry.inquiryOrder.SelfMention')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('inquiry.inquiryOrder.transportationWay')" prop="transportationWay">
          <el-select v-model="customData.transportationWay" :placeholder="$t('query.placeholder.transportationWay')" class="form-dialog-width">
              <el-option :label="$t('query.tableLabel.ByTruck')" :value="1"></el-option>
              <el-option :label="$t('query.tableLabel.ByTrain')" :value="2"></el-option>
              <el-option :label="$t('query.tableLabel.Byship')" :value="3"></el-option>
              <el-option :label="$t('query.tableLabel.Byair')" :value="4"></el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('common.personal.email')" prop="buyerMailbox">
          <el-input v-model="customData.buyerMailbox" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="buyerAddress">
          <el-input v-model="customData.buyerAddress" clearable :placeholder="$t('query.placeholder.address')" class="form-dialog-width" readonly/>
        </el-form-item>
        <el-form-item :label="$t('common.personal.telephone')" prop="buyerTelephone">
          <el-input v-model="customData.buyerTelephone" clearable :placeholder="$t('query.placeholder.phone')" class="form-dialog-width" readonly/>
        </el-form-item> -->
        <!--<el-form-item label="联系人" prop="contactBy">-->
          <!--<el-input v-model="customData.contactBy" clearable placeholder="输入联系人" class="form-dialog-width" />-->
        <!--</el-form-item>-->
        <!-- <el-form-item :label="$t('query.tableLabel.CustomizedQuantity')" prop="customQuantity">
          <el-input-number :min="0" :step="1" :precision="0" controls-position="right" v-model="customData.customQuantity" clearable :placeholder="$t('query.placeholder.CustomizedQuantity')" class="form-dialog-width"/>
        </el-form-item> -->
        <!--<el-form-item label="定制关键词" prop="customKeyword">-->
          <!--<el-input v-model="customData.customKeyword" clearable placeholder="请输入关键词" class="form-dialog-width" style="width: 744px"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="destinationPort">
          <el-input v-model="customData.destinationPort" clearable :placeholder="$t('query.tableLabel.DestinationPort')" class="form-dialog-width" style="width: 680px"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('query.tableLabel.QuotationType')" prop="quoteType">
          <el-select v-model="customData.quoteType" clearable :placeholder="$t('query.placeholder.QuotationType')" class="form-dialog-width" style="width: 120px">
            <el-option v-for="(item, index) in quoteTypeList" :label="item.label" :value="item.quoteType" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('system.business.payModeArr')" prop="paymentMethods">
          <el-select v-model="customData.paymentMethods" clearable :placeholder="$t('query.placeholder.payModeArr')" class="form-dialog-width" style="width: 120px">
            <el-option v-for="(item, index) in paymentMethodsList" :label="item.label" :value="item.paymentMethods" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('finance.financeService.currency')" prop="currency">
          <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="customData.currency" clearable :placeholder="$t('system.business.searchCurrencyCode')" style="width: 215px">
            <el-option v-for="(item, index) in currencyList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.PaymentLot')+':'">
          <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
            <thead>
            <tr>
              <th>{{$t('common.table.id')}}</th>
              <th>{{$t('system.business.nodeName')}}</th>
              <th>{{$t('system.business.paymentRatio')}}</th>
              <th>{{$t('system.business.dayNum')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in controlTowerList" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.nodeName}}</td>
              <td>
                <el-input-number v-model="item.paymentRatio" :min="0" :max="100" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;%
              </td>
              <td>
                <el-input-number v-model="item.dayNum" :min="0" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;{{$t('system.business.day')}}
              </td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.CustomizedNotes')" prop="remark">
          <el-input v-model="customData.remark" type="textarea" :rows="5" clearable :placeholder="$t('query.placeholder.CustomizedNotes')" class="form-dialog-width" style="width: 680px"/>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.AppendixUpload')">
          <el-upload
            v-if="!detailModal"
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            :action="uploadActionUrl"
            :data="{type: 2}"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('query.tableLabel.ClickUpload')}}</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传word/pdf，且不超过10M</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="filesList"
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
            <el-button type="primary" size="mini" v-if="!detailModal" @click="removeFile(scope)">{{$t('common.table.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="isUnlabel" style="color: red; margin-left: 10%; font-size: 12px">{{isZh ? '拒绝的原因' : 'Reject Reasons'}}</div>
      <div style="width: 680px;margin:10px 0 0 22%;" prop="rejectReason" v-if="isUnlabel">
        <el-input v-model="editForm.rejectReason" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" prop="rejectReason"></el-input>
      </div>
      <!--<el-row style="margin-top: 10px;" v-if="isUnlabel">-->
        <!--<el-col>-->
          <!--<el-form-item prop="rejectReason">-->
            <!--<el-input :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" style="width: 80%"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" v-if="!detailModal" :loading="addLoading" @click="saveClick('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="primary" size="small" v-if="!detailModal" :loading="addLoading" @click="sumbitClick('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="primary" size="small" v-if="isUnlabel2" :loading="addLoading" @click="unLabel('addCompany')">{{isZh ? '拒绝' : 'Reiect'}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{detailModal?$t('common.buttonText.close'):$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 选择商品弹框 -->
    <el-dialog :visible.sync="goodsDialogVisible" :title="$t('query.tableLabel.ChooseCommodity')" width="1000px" center close-on-click-modal>
      <el-form ref="editForm" :model="searchObj" label-width="140px" label-position="right" inline size="small">
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
            @change="getGoodsParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.CommodityCode')" prop="productCode">
          <el-input v-model.trim="searchObj.productCode" clearable :placeholder="$t('query.tableLabel.CommodityCode')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('inquiry.inquiryOrder.productName')" prop="productName">
          <el-input v-model.trim="searchObj.productName" clearable :placeholder="$t('inquiry.inquiryOrder.productName')" style="width: 240px"/>
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
        @selection-change="getSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" width="180" :label="$t('product.categoryTemplate.category')" :prop="language === 'zh' ? 'cnCatalogBName' : 'enCatalogBName'" />

        <el-table-column align="center" :label="$t('inquiry.inquiryOrder.productName')" :prop="language === 'zh' ? 'cnProductName' : 'cnProductName'"/>

        <el-table-column align="center" width="130" :label="$t('query.tableLabel.CommodityCode')" prop="productCode"/>

        <el-table-column align="center" min-width="180px" label="SKU" :prop="language === 'zh' ? 'cnAttrValueList' : 'enAttrValueList'" />

        <el-table-column align="center" width="165" :label="$t('product.product.minimumOrderQuantity')" prop="mininum" />

        <el-table-column align="center" width="80" :label="$t('query.tableLabel.UnitPrice')" prop="unitPrice" />
      </el-table>

      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getQuotedProductSku"></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addQuotedSku">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="goodsDialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <!-- <el-dialog :visible.sync="detailModal" :title="$t('query.tableLabel.details')" center @closed="clearData" width="950px">
      <el-form ref="addCompany" :model="customData" label-width="130px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="$t('query.tableLabel.CustomOrderNumber')" prop="tailormadeFormNumber">
          <div style="width: 180px;padding-left: 15px;padding-right: 283px;">
            {{customData.tailormadeFormNumber}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.InquiryTime')" prop="inquiryTime">
          <div style="padding-left: 15px;">
            {{customData.inquiryTime | timeFmt}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.Customer')" prop="customerBasicInfoBId">
          <el-select v-model="customData.customerBasicInfoBId" clearable disabled :placeholder="$t('system.userManage.userCompany')" class="form-dialog-width">
            <el-option v-for="(item, index) in customerInfoList" disabled :label="item.companyName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.inquirer')" prop="customBy">
          <el-select v-model="customData.customBy" clearable disabled :placeholder="$t('query.placeholder.selectInquirer')" :no-data-text="$t('query.noDataText')" class="form-dialog-width">
            <el-option v-for="(item, index) in modalList" disabled :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item :label="$t('common.personal.email')" prop="buyerMailbox">
            <el-input v-model="customData.buyerMailbox" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly />
          </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="buyerAddress">
          <el-input v-model="customData.buyerAddress" clearable :placeholder="$t('query.placeholder.address')" class="form-dialog-width" readonly/>
        </el-form-item>
          <el-form-item :label="$t('common.personal.telephone')" prop="buyerTelephone">
            <el-input v-model="customData.buyerTelephone" clearable :placeholder="$t('query.placeholder.phone')" class="form-dialog-width" readonly />
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomizedQuantity')" prop="customQuantity">
            <el-input-number :min="0" :step="1" :precision="0" controls-position="right" v-model="customData.customQuantity" clearable :placeholder="$t('query.placeholder.CustomizedQuantity')" class="form-dialog-width" disabled/>
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="portPlace">
            <el-input v-model="customData.portPlace" clearable :placeholder="$t('query.placeholder.DestinationPort')" class="form-dialog-width" style="width: 744px" readonly/>
          </el-form-item>
          <el-form-item :label="$t('system.business.payModeArr')" prop="paymentMethods">
            <el-select v-model="customData.paymentMethods" clearable :placeholder="$t('query.placeholder.payModeArr')" class="form-dialog-width" style="width: 120px">
              <el-option v-for="(item, index) in paymentMethodsList" disabled :label="item.label" :value="item.paymentMethods" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.currency')" prop="currency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="customData.currency" clearable :placeholder="$t('system.business.searchCurrencyCode')" style="width: 215px">
              <el-option v-for="(item, index) in currencyList" disabled :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item :label="$t('query.tableLabel.payment')+':'">
          <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
            <thead>
            <tr>
              <th>{{$t('common.table.id')}}</th>
              <th>{{$t('system.business.nodeName')}}</th>
              <th>{{$t('system.business.paymentRatio')}}</th>
              <th>{{$t('system.business.dayNum')}}</th>
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
                {{item.dayNum}}{{$t('system.sysPwdSet.day')}}
              </td>
            </tr>
            <tr v-if="!controlTowerList.length">
              <td colspan="4" style="text-align: center;padding: 5px">{{$t('query.tableLabel.nodata')}}</td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomizedNotes')" prop="remark">
            <el-input v-model="customData.remark" type="textarea" :rows="5" clearable :placeholder="$t('query.placeholder.CustomizedNotes')" class="form-dialog-width" style="width: 744px" readonly />
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.fileType')">
          </el-form-item>
          <el-table
            :data="filesList"
            border
            fit
            style="margin: 10px 0;width: 100%"
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
          <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
        </div>
    </el-dialog> -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory, productListGetPrice } from '@/api/product'
import { selectCountryListApi, selectCurrencyCodeListApi, selectControlTowerListApi } from '@/api/system'
import { uploadActionUrl } from '@/api/common'
import { selectCustomOrderListAllApi, saveAdminCustomApi, submitAdminCustomApi, deleteCustomByIdApi, selectCustomById, deleteCustomOrderIdsApi, downloadApi, exportCustomOrderExcelApi, updateRefused } from '@/api/inquiry'
import { listCustomerInfoContactApi, getCustomerInfo } from '@/api/customer'
import { supplierPageList, supplierDetailById } from '@/api/supplier'
import { deepClone, parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    customizeStatusFmt(val, language) {
      switch (val) {
        // 定制状态（1-编辑中，2-未报价，3-报价中，4-已报价   5 拒绝报价  7 报价审核通过  8 报价审批未通过）
        case 1: return language === 'zh' ? '编辑中' : 'Editing';
        case 2: return language === 'zh' ? '未报价' : 'No offer';
        case 3: return language === 'zh' ? '报价中' : 'Quotation';
        case 4: return language === 'zh' ? '已报价' : 'Quoted price';
        case 5: return language === 'zh' ? '拒绝报价' : 'Refusal of quotation';
        // case 7: return language === 'zh' ? '报价审核通过' : 'Quotation Audit pass';
        case 8: return language === 'zh' ? '报价审核未通过' : 'Quotation audit failed';
        default:
          return language === 'zh' ? '不存在' : 'Non-existent';
      }
    }
  },
  data() {
    return {
      uploadActionUrl,
      datalist: [],
      editForm: {
        rejectReason: ''
      },
      loading1: false,
      loading2: false,
      loading3: false,
      addLoading: false,
      countryList: [],
      currencyList: [],
      customerInfoList: [],
      companyName: '',
      modalList: [],
      filesList: [],
      orderPayNodeList: [],
      customizeOrderPayNodeList: [],
      selectProdList: [],
      selectList: [],
      list: null,
      listLoading: true,
      listLoading1: false,
      dialogVisible: false,
      productSkuList: [],
      customProductList: [],
      parentsName: [],
      searchDataList: [],
      goodsDialogVisible: false,
      detailModal: false,
      isUnlabel: false,
      isUnlabel2: false,
      dialogType: '',
      indent: 20,
      expandArr: [1036013, 1036014],
      controlTowerList: [],
      customData: {
        filesList: [],
        orderPayNodeList: [],
        customizeOrderPayNodeList: [],
        contactNameList: [],
        attachmentName: '',
        attachmentPath: '',
        customerBasicInfoBId: '',
        customBy: '',
        buyerMailbox: '',
        transportation: 0,
        transportationWay: 3,
        buyerTelephone: '',
        contactBy: '',
        customQuantity: '',
        customKeyword: '',
        buyerAddress: '',
        destinationPort: '',
        departurePort: '',
        dateOfDelivery: '',
        portPlace: '',
        quoteType: 0,
        currency: '',
        paymentMethods: 1,
        orderType: 1,
        remark: '',
        inquiryTime: '',
        tailormadeFormNumber: '',
        companyName: '',
        contactName: '',
        customBId: '',
        paymentRatio: '',
        dayNum: '',
        id: '',
        buyerContact: ''
      },
      menuDataRules: {
        // customerBasicInfoBId: [
        //   { required: true, message: this.$t('query.placeholder.userCompany'), trigger: 'change' }
        // ],
        // customBy: [
        //   { required: true, message: '询价人不为空', trigger: 'blur' }
        // ],
        // quoteType: [
        //   { required: true, message: '报价类型不为空', trigger: 'change' }
        // ],
        // destinationPort: [
        //   { required: true, message: this.language === 'zh' ? '目的港口不为空' : 'The destination port is not empty', trigger: 'change' }
        // ],
        // paymentMethods: [
        //   { required: true, message: this.language === 'zh' ? '付款方式不为空' : 'Payment method is not empty', trigger: 'change' }
        // ],
        // currency: [
        //   { required: true, message: this.language === 'zh' ? '币种不为空' : 'currency is not empty', trigger: 'change' }
        // ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        buyer: '',
        customerCode: '',
        buyerState: '',
        customizeStatus: '',
        inquiryTime: '',
        startTime: '',
        endTime: '',
        tailormadeFormNumber: ''
      },
      reviewForm: {
        customOrderIds: '',
        delFlag: 1
      },
      dataId: '1',
      inquiryTime: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.postData.endTime) {
            return time.getTime() > this.postData.endTime
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.postData.startTime) {
            return time.getTime() < this.postData.startTime
          }
        }
      },
      customizeStatusList: [
        // 定制状态（1-编辑中，2-未报价，3-报价中，4-已报价   5 拒绝报价  7 报价审核通过(预留，暂时不用)  8 报价审批未通过）
        {
          labelZh: '全部',
          label: 'All',
          customizeStatus: ''
        },
        {
          label: 'Editing',
          labelZh: '编辑中',
          customizeStatus: 1
        },
        {
          label: 'No offer',
          labelZh: '未报价',
          customizeStatus: 2
        },
        {
          label: 'Quotation',
          labelZh: '报价中',
          customizeStatus: 3
        },
        {
          label: 'Quoted price',
          labelZh: '已报价',
          customizeStatus: 4
        },
        {
          label: 'Refusal of quotation',
          labelZh: '拒绝报价',
          customizeStatus: 5
        },
        {
          label: 'Audit failed',
          labelZh: '报价审核未通过',
          customizeStatus: 8
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
      paymentMethodsList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
        {
          label: 'T/T',
          paymentMethods: 1
        },
        {
          label: 'L/C',
          paymentMethods: 2
        },
        {
          label: 'P/A',
          paymentMethods: 3
        },
        {
          label: 'D/A',
          paymentMethods: 4
        }
      ],
      editFlagNum: 0,
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      customerList: [],
      supplierList: []
    }
  },
  watch: {
    'customData.orderType'(val, oldVal) {
      // this.customData.customerBasicInfoBId = '';
      this.getCustomerInfoListFun();
    },
    // 暂时不通过买方企业进行地址、联系电话、邮箱进行关联
    'customData.customerBasicInfoBId' (val, oldVal) {
      this.editFlagNum++;
      if (val && !oldVal) {
        this.customerContactFun(val);
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        if (obj) {
          // 暂时不通过买方企业进行地址、联系电话、邮箱进行关联
          // this.customData.buyerAddress = obj.officeAddress;
          // this.customData.buyerTelephone = obj.mobilePhone;
          // this.customData.buyerMailbox = obj.emailAddress;
        }
      } else if (val && oldVal) {
        this.customerContactFun(val);
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        if (obj) {
          // 暂时不通过买方企业进行地址、联系电话、邮箱进行关联
          // this.customData.customBy = '';
          // this.customData.buyerAddress = obj.officeAddress;
          // this.customData.buyerTelephone = obj.mobilePhone;
          // this.customData.buyerMailbox = obj.emailAddress;
        }
      } else {
        this.customData.customBy = '';
        this.customData.buyerAddress = '';
        this.customData.buyerTelephone = '';
        this.customData.buyerMailbox = '';
        this.controlTowerList = [];
        this.modalList = []
      }
    }
  },
  computed: {
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val;
    }
  },
  created() {
    this.getCurrencyCodeList();
    this.getCustomerInfoList();
    this.getSupplierInfoList()
    this.getDataList();
    this.getAllDataList()
  },
  methods: {
    addSku() {
      this.dataId = this.dataId + '1';
      this.customProductList.push({ dataId: this.dataId })
    },
    deleteSku() {
      for (let i = 0; i < this.customProductList.length; i++) {
        if (this.customProductList[i].dataId) {
          this.selectProdList.forEach(e => {
            if (e.dataId === this.customProductList[i].dataId) {
              this.customProductList.splice(i, 1)
            }
          })
        } else {
          this.selectProdList.forEach(e => {
            if (e.skuBId === this.customProductList[i].skuBId) {
              this.customProductList.splice(i, 1)
            }
          })
        }
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    clearCustomer(val) {
      this.customData.customerBasicInfoBId = '';
      this.customData.customBy = '';
      this.customProductList = []
    },
    addQuotedSku() {
      if (!this.selectList.length) {
        let msg = this.language === 'zh' ? '请先选择商品' : 'Please choose the goods first.'
        return this.$message.warning(msg)
      }
      let skuBIdArr = this.customProductList.map(e => e.skuBId);
      let arr = this.selectList.map(e => {
        return {
          enAttrValueList: e.enAttrValueList,
          cnAttrValueList: e.cnAttrValueList,
          enCatalogBName: e.enCatalogBName,
          cnCatalogBName: e.cnCatalogBName,
          skuBId: e.bid,
          skuCode: e.skuCode,
          productCode: e.productCode,
          enProductName: e.enProductName,
          cnProductName: e.cnProductName,
          productBId: e.bid,
          unitPrice: e.unitPrice,
          mininum: e.minimum,
          productImge: e.imagePath,
          customsCode: e.customsCode,
          singleBulk: e.singleBulk,
          singlePackage: e.singlePackage,
          singleWeight: e.singleWeight,
          mininumMoney: e.mininum * e.unitPrice,
          quoteNumber: 0,
          quotePrice: 0,
          quoteMoney: 0,
          productUnit: e.skuUnit,
          skuDecimalPlaces: e.skuDecimalPlaces || 2
        }
      }).filter(t => {
        return !skuBIdArr.includes(t.skuBId)
      });
      this.customProductList = this.customProductList.concat(arr);
      this.goodsDialogVisible = false
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getQuotedProductSku();
    },
    getGoodsParentId(arr) {
      if (arr.length) {
        this.searchObj.catalogBId = arr.join(',');
      } else {
        this.searchObj.catalogBId = '';
      }
    },
    openGoodsDialog() {
      if (!this.customData.customerBasicInfoBId) {
        return this.$message.warning(this.$t('order.sale.selectCompanyMsg'))
      }
      this.selectList = [];
      this.goodsDialogVisible = true;
      this.getQuotedProductSku()
    },
    getQuotedProductSku() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      obj.customerBId = this.customData.customerBasicInfoBId;
      obj.productType = this.customData.orderType;
      this.listLoading1 = true;
      productListGetPrice(obj).then(res => {
        this.productSkuList = res.data.list.map(e => {
          e.mininum = e.minimum || 0;
          e.unitPrice = e.unitPrice || 0;
          return { ...e }
        });
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      selectCustomOrderListAllApi(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    // 根据类型查询流程控制列表
    selectControlTowerListFun() {
      selectControlTowerListApi({ nodeType: 2 }).then(res => {
        this.controlTowerList = res.data.map(e => {
          if (this.customData.customizeOrderPayNodeList && this.customData.customizeOrderPayNodeList.length) {
            this.customData.customizeOrderPayNodeList.forEach(t => {
              if (e.nodeName === t.nodeName) {
                e.paymentRatio = t.paymentRatio;
                e.dayNum = t.dayNum;
              }
            });
          }
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 客户人列表
    getCustomerInfoListFun() {
      let api = this.customData.orderType === 1 ? listCustomerInfoContactApi : supplierPageList;
      let obj = this.customData.orderType === 1 ? null : { pageNum: 1, pageSize: 999 };
      api(obj).then(res => {
        this.customData.orderType === 1 ? this.customerInfoList = res.data || [] : this.customerInfoList = res.data.list || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 客户人列表
    getCustomerInfoList() {
      supplierPageList({ pageNum: 1, pageSize: 999 }).then(res => {
        this.supplierList = res.data.list || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 客户人列表
    getSupplierInfoList() {
      listCustomerInfoContactApi().then(res => {
        this.customerList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getParentId(arr) {
      if (arr.length) {
        this.customData.customerBasicInfoBId = arr.customerBasicInfoBId
      } else {
        this.customData.customerBasicInfoBId = '';
      }
    },
    openDialog(type, row) {
      this.isUnlabel = false;
      this.isUnlabel2 = false;
      if (type === 'edit') {
        this.customerInfoList = row.orderType === 1 ? this.customerList : this.supplierList;
        selectCustomById({
          bId: row.bid
        }).then(res => {
          this.controlTowerList = res.data.customizeOrderPayNodeList;
        });
        this.customData = deepClone(row);
        this.customData.paymentMethods = Number(this.customData.paymentMethods);
        // this.controlTowerList = row.customizeOrderPayNodeList;
        this.customData.transportationWay = Number(row.transportationWay);
        this.filesList = row.filesList;
        this.customProductList = row.customizeProductList;
        // this.selectControlTowerListFun();
      } else {
        this.customData.orderType = 1;
        this.customerInfoList = this.customerList
      }
      this.dialogType = type;
      this.dialogVisible = true;
      this.detailModal = false;
    },
    // 查看详情
    detailDialog(row, type) {
      selectCustomById({
        bId: row.bid
      }).then(res => {
        this.controlTowerList = res.data.customizeOrderPayNodeList;
        this.isUnlabel = true;
        if (!type) {
          this.isUnlabel2 = false;
          this.editForm.rejectReason = res.data.rejectReason
        } else {
          this.isUnlabel2 = true;
          this.editForm.rejectReason = ''
        }
      });
      this.customData = deepClone(row);
      this.customData.paymentMethods = Number(this.customData.paymentMethods);
      this.filesList = row.filesList;
      // this.controlTowerList = row.customizeOrderPayNodeList;
      this.customProductList = row.customizeProductList;
      this.customData.transportationWay = Number(row.transportationWay);
      // this.selectControlTowerListFun();
      this.dialogType = type;
      this.detailModal = true;
      this.dialogVisible = true;
      // this.getDetailList(row.bid)
    },
    // 无法报价
    unLabel(addCompany) {
      this.$refs[addCompany].validate((valid) => {
        if (valid) {
          if (this.editForm.rejectReason === '') {
            return this.$message.warning(this.language === 'zh' ? '请输入拒绝理由' : 'The reason for rejection')
          }
          this.addLoading = true;
          updateRefused({
            id: this.customData.id,
            rejectReason: this.editForm.rejectReason
          }).then(res => {
            this.$message.success(this.$t("system.userManage.handle"));
            this.addLoading = false;
            this.dialogVisible = false
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          })
        }
      })
    },
    // 报价按钮
    openQuoted(row) {
      this.$router.push({
        path: '/query/editQuoted',
        query: {
          customBId: row.bid,
          orderType: row.orderType,
          isShow: false
        }
      })
    },
    // 查看询价按钮
    detailQuoted(id) {
      this.$router.push({
        path: '/query/detailQuoted',
        query: { id }
      })
    },
    // 暂存操作
    saveClick(addCompany) {
      if (this.totalSum !== 100) {
        let msg1 = this.language === 'zh' ? '付款条件比例必须等于100' : 'The ratio of payment terms must be equal to 100'
        return this.$message.warning(msg1);
      }
      if (!this.customData.customerBasicInfoBId) {
        return this.$message.warning(this.$t('query.placeholder.userCompany'));
      }
      if (!this.customData.customBy) {
        return this.$message.warning(this.$t('query.placeholder.customBy'));
      }
      this.$refs[addCompany].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          this.customData.filesList = this.filesList;
          this.customData.customizeProductList = this.customProductList;
          this.customData.customizeOrderPayNodeList = this.controlTowerList.map(e => {
            return { ...e }
          });
          saveAdminCustomApi(this.customData).then(res => {
            if (res.status === 200) {
              this.addLoading = false;
              this.$message.success(this.$t('system.role.saveSuccess'));
              this.$refs[addCompany].resetFields();
              this.dialogVisible = false;
              this.getDataList();
            } else {
              this.addLoading = false;
              this.listLoading = false;
              this.dialogVisible = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.warning(this.$t('query.formMessage.VerificationFailed'));
          return false;
        }
      });
    },
    // 提交操作
    sumbitClick(addCompany) {
      if (this.totalSum !== 100) {
        let msg1 = this.language === 'zh' ? '付款条件比例必须等于100' : 'The ratio of payment terms must be equal to 100'
        return this.$message.warning(msg1);
      }
      if (!this.customData.customerBasicInfoBId) {
        return this.$message.warning(this.$t('query.placeholder.userCompany'));
      }
      if (!this.customData.customBy) {
        return this.$message.warning(this.$t('query.placeholder.customBy'));
      }
      this.$refs[addCompany].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          this.customData.filesList = this.filesList;
          this.customData.customizeProductList = this.customProductList;
          this.customData.customizeOrderPayNodeList = this.controlTowerList.map(e => {
            return { ...e }
          });
          submitAdminCustomApi(this.customData).then(res => {
            if (res.status === 200) {
              this.addLoading = false;
              this.$message.success(this.$t('query.formMessage.submitSuccess'));
              this.$refs[addCompany].resetFields();
              this.dialogVisible = false;
              this.getDataList();
            } else {
              this.addLoading = false;
              this.listLoading = false;
              this.dialogVisible = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.warning(this.$t('query.formMessage.VerificationFailed'));
          return false;
        }
      });
    },
    // 删除接口
    deleteClick(row) {
      this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          id: row.id,
          customBId: row.customBId,
          delFlag: 1
        };
        deleteCustomByIdApi(obj).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message);
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    selectProd(selects) {
      this.selectProdList = selects;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 批量删除接口
    disableClick() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('query.formMessage.PleaseSelectData'));
      }
      this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.customOrderIds = this.selectList.map(e => {
          return e.id;
        }).join(',');
        deleteCustomOrderIdsApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message);
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // getDetailList(val) {
    //   selectCustomByIdApi({bId: val}).then(res => {
    //     console.log(res)
    //   })
    // },
    // 导出定制单列表Excel数据
    exportCustomOrderExcelFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        buyer: this.postData.buyer,
        customerCode: this.postData.customerCode,
        buyerState: this.postData.buyerState,
        customizeStatus: this.postData.customizeStatus,
        startTime: this.postData.startTime,
        endTime: this.postData.endTime,
        tailormadeFormNumber: this.postData.tailormadeFormNumber
      };
      exportCustomOrderExcelApi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'customOrder.xls');
        document.body.appendChild(link);
        link.click();
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
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyList = res.data || []
          })
        }, 200);
      } else {
        this.currencyList = [];
      }
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      let api = this.customData.orderType === 1 ? getCustomerInfo : supplierDetailById;
      api({ bid: val }).then(res => {
        if (this.customData.orderType === 1) {
          let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
          this.modalList = res.data.customerContactList || [];
          if ((this.dialogType !== 'add' && this.editFlagNum !== 1) || this.dialogType === 'add') {
            if (this.customData.customizeOrderPayNodeList.length > 0) {
              this.controlTowerList = this.customData.customizeOrderPayNodeList;
            } else {
              this.controlTowerList = payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList;
            }
          }
        } else {
          let payterms = res.data.supplierOrderPayNodeList;
          this.modalList = res.data.supplierContactList || [];
          if (!this.$route.query.id && !this.$route.query.customBId) {
            this.controlTowerList = payterms && payterms.length ? payterms : [];
          }
          // this.getlinkMan(val)
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // getlinkMan(val) {
    //   getLinkList({ bid: val }).then(res => {
    //     if (res.data) {
    //       this.modalList = res.data || [];
    //     }
    //   }).catch(err => {
    //     this.$message.error(err.message);
    //   })
    // },
    // 清空数据
    clearData() {
      this.addLoading = false;
      this.editFlagNum = 0;
      this.filesList = [];
      this.customProductList = [];
      this.customData.orderPayNodeList = [];
      this.customizeOrderPayNodeList = [];
      this.customData.customizeOrderPayNodeList = [];
      this.customData.id = '';
      this.customData.bid = '';
      this.customData.paymentRatio = '';
      this.dayNum = '';
      this.customBId = '';
      this.customData.attachmentName = '';
      this.customData.attachmentPath = '';
      this.customData.customerBasicInfoBId = '';
      this.customData.customBy = '';
      this.customData.buyerMailbox = '';
      this.customData.buyerContact = '';
      this.customData.buyerTelephone = '';
      this.customData.contactBy = '';
      this.customData.customQuantity = '';
      this.customData.customKeyword = '';
      this.customData.buyerAddress = '';
      this.customData.destinationPort = '';
      this.customData.departurePort = '';
      this.customData.dateOfDelivery = '';
      this.customData.transportation = 0;
      this.customData.transportationWay = 3;
      this.customData.quoteType = 0;
      this.customData.currency = '';
      this.customData.paymentMethods = 1;
      this.customData.remark = '';
      this.customData.orderType = 1;
      this.controlTowerList = [];
      this.getDataList();
    },
    // 删除协议
    removeFile(scope) {
      this.filesList.splice(scope.$index, 1)
    },
    // 多附件打包下载
    downloadFilesListFun2(customBId) {
      let date = {
        customBId: customBId
      };
      // debugger;
      downloadApi(date).then(res => {
        // if (res.status === 200) {
        //   this.$message.success("下载成功");
        //   this.getDataList();
        // } else {
        //   this.$message.error('异常提示：' + res.message);
        // }
      }).catch(err => {
        this.$message.error(this.$t('query.formMessage.DownloadFailed') + err.message);
      });
    },
    downloadFilesListFun() {
      let data = {
        customBId: this.customData.customBId
      };
      downloadApi(data).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'customOrderFile.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.customData.attachmentName = '';
      this.customData.attachmentPath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.customData.attachmentName = file.name;
      this.customData.attachmentPath = res.data.filePath;
      this.filesList.push({ attachmentName: this.customData.attachmentName, attachmentPath: this.customData.attachmentPath });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].attachmentName === file.name) {
          this.$message.error(this.$t('query.formMessage.repeatedly'));
          return false
        }
      }
      // let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      // const extension = testmsg === 'PDF';
      // const extension2 = testmsg === 'pdf';
      // const extension3 = testmsg === 'doc';
      // const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      // if (!extension && !extension2 && !extension3 && !extension4) {
      //   this.$message({
      //     message: '上传文件只能是 PDF、doc、docx格式!',
      //     type: 'warning'
      //   });
      // }
      if (!isLt2M) {
        this.$message({
          message: this.$t('query.formMessage.fileSize'),
          type: 'warning'
        });
      }
      // return (extension || extension2 || extension3 || extension4) && isLt2M
      return isLt2M
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .table-demo {
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
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
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
    .form-table tr td:last-child{
      text-align: left;
    }
  }
</style>
