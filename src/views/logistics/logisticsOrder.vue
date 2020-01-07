<template>
  <div class="app-container logisticOrder">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderNo')">
            <el-input
              v-model.trim="postData.logisticsOrderNo"
              clearable
              :placeholder="$t('logistics.logisticsOrder.logisticsOrderNo')"
              style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('logistics.logisticsOrder.etd')" prop="startDate">
            <el-date-picker
              v-model="postData.etd"
              type="datetime"
              style="width: 200px"
              :placeholder="$t('logistics.logisticsOrder.selectTime')">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('logistics.logisticsOrder.eta')" prop="startDate">
            <el-date-picker
              v-model="postData.eta"
              type="datetime"
              style="width: 200px"
              :placeholder="$t('logistics.logisticsOrder.selectTime')">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('logistics.logisticsOrder.orderNo')">
            <el-input
              v-model.trim="postData.orderNo"
              clearable
              :placeholder="$t('logistics.logisticsOrder.orderNo')"
              style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('logistics.logisticsOrder.orderType')">
            <el-select v-model="postData.orderType" clearable :placeholder="$t('logistics.logisticsOrder.orderNo')" style="width: 200px">
              <el-option v-for="(item, index) in orderTypeList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.orderType" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportExcelFun()">{{$t('common.export')}}</el-button>
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
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column :label="$t('logistics.logisticsOrder.logisticsOrderNo')" prop="logisticsOrderNo" show-overflow-tooltip />

      <el-table-column :label="$t('logistics.logisticsOrder.orderNo')" prop="orderNo" show-overflow-tooltip/>

      <el-table-column align="center" width="160px" :label="$t('logistics.logisticsOrder.logisticsOrderDate')" prop="logisticsOrderDate" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.logisticsOrderDate | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('logistics.logisticsOrder.orderType')" width="120" prop="orderType" >
        <template slot-scope="scope">
          {{scope.row.orderType | orderTypeFmt(isZh)}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" :label="$t('logistics.logisticsOrder.logisticsOrderAmount')" prop="logisticsOrderAmount" show-overflow-tooltip />

      <el-table-column align="center" width="100" :label="$t('logistics.logisticsOrder.updateUserIdName')" prop="updateUserIdName" show-overflow-tooltip/>

      <el-table-column :label="$t('logistics.logisticsOrder.updateTime')" prop="updateTime" width="160px" align="center">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('logistics.logisticsOrder.logisticsStatus')" prop="logisticsStatus" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.logisticsStatus | statusFilter(isZh)}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDetailDialog(scope.row,1)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.logisticsStatus === 1 || scope.row.logisticsStatus === 4 " @click="openDialog('edit', scope.row)">{{$t('common.table.edit')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.logisticsStatus === 3 || scope.row.logisticsStatus === 5" @click="payment(scope.row)">{{$t('common.table.pay')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.logisticsStatus === 3" @click="openDetailDialog(scope.row, 2)">{{$t('common.table.accept')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? $t('logistics.logisticsOrder.addLogisticsOrder'): $t('logistics.logisticsOrder.editLogisticsOrder')"
      width="1000px"
      center
      @close="clearData"
      :close-on-click-modal="false">
      <el-form ref="editForm" v-if="dialogVisible" :model="editForm" label-position="left" :label-width="isZh?'100px':'165px'" size="small" inline :rules="editFormRules">
        <div>
          <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderNo')">
            {{editForm.logisticsOrderNo || 'Null'}}
          </el-form-item>
        </div>
        <el-row :gutter="16">
          <el-col>
            <el-form-item :label="$t('logistics.logisticsOrder.orderType')" prop="orderType">
              <el-radio-group v-model="editForm.orderType">
                <el-radio label="0">{{$t('logistics.logisticsOrder.sales')}}</el-radio>
                <el-radio label="1">{{$t('logistics.logisticsOrder.other')}}</el-radio>
                <el-radio label="2">{{$t('logistics.logisticsOrder.purchase')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('logistics.logisticsOrder.orderNo')" prop="orderNoArr">
              <el-input v-model="editForm.orderNo" readonly :placeholder="$t('logistics.logisticsOrder.orderNo')" style="width:500px;"></el-input>
              <el-button type="primary" class="export" @click="openAddOrderDialog">{{$t('common.addTo')}}</el-button>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('order.sale.buyer')">
              <el-input v-model="editForm.buyBIdName" readonly style="width:500px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.supplierInfoBId')" prop="supplierInfoBId">
              <el-select v-model="editForm.supplierInfoBId" clearable style="width: 240px" :placeholder="$t('logistics.logisticsOrder.supplierInfoBId')">
                <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.customerBasicInfoBId')" prop="companyInfoBId">
              <el-select v-model="editForm.companyInfoBId" clearable :placeholder="$t('logistics.logisticsOrder.customerBasicInfoBId')" style="width: 240px">
                <el-option v-for="(item, index) in companyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.transportationMethod')" prop="transportationMethod">
              <el-select v-model="editForm.transportationMethod" style="width: 240px">
                <el-option v-for="(item, index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.paymentCurrency')" prop="paymentCurrency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.paymentCurrency" clearable :placeholder="$t('logistics.logisticsOrder.currencySearch')" style="width: 240px">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.departurePortAdd')" prop="departurePortAdd">
              <el-input v-model="editForm.departurePortAdd" :maxlength="30" clearable style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.destinationPortAdd')" prop="destinationPortAdd">
              <el-input v-model="editForm.destinationPortAdd" :maxlength="30" clearable style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.etd2')" prop="etd">
              <el-date-picker v-model="editForm.etd" type="datetime" clearableplaceholder="select date" style="width: 240px" :picker-options="pickerOptionsStart" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.eta2')" prop="eta">
              <el-date-picker v-model="editForm.eta" type="datetime" clearable placeholder="select date" style="width: 240px" :picker-options="pickerOptionsEnd"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="editForm.logisticsOrderProductsList"
              style="margin: 16px 0"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" type="index" width="55"></el-table-column>
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.productName')" prop="productName" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.productDescription')" prop="productDescription" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{isZh ? scope.row.cnProductDescription : scope.row.enProductDescription}}
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.clientProductRef')" :prop="language === 'zh' ? 'cnSkuReference' : 'enSkuReference'" show-overflow-tooltip />
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.productQuantity')" prop="productQuantity" show-overflow-tooltip />
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderWeight')" prop="logisticsOrderWeight">
              <el-input v-model.number="editForm.logisticsOrderWeight" clearable style="width:130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderVolume')" prop="logisticsOrderVolume">
              <el-input v-model.number="editForm.logisticsOrderVolume" clearable style="width:130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderAmount')" prop="logisticsOrderAmount">
              <el-input v-model.number="editForm.logisticsOrderAmount" clearable style="width:130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('logistics.logisticsOrder.remark')" prop="remark">
              <el-input v-model="editForm.remark" type="textarea" :maxlength="200" :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('logistics.logisticsOrder.filesList')">
              <el-upload
                ref="upload"
                :action="uploadActionUrl"
                :headers="upLoadHeaders"
                :data="{type: 2}"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                multiple
                :limit="5"
                :file-list="fileList">
                <el-button size="small" type="primary" icon="el-icon-upload">{{$t('common.upload')}}</el-button>
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-dialog
        width="1000px"
        center
        :title="$t('logistics.logisticsOrder.orderList')"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        append-to-body>
        <div class="search-box">
          <el-form label-width="80px" size="small" inline class="edit-form">
            <el-form-item :label="$t('logistics.logisticsOrder.orderNo')" prop="eventRemark">
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

          <el-table-column align="center" :label="$t('logistics.logisticsOrder.orderNo')" prop="orderNo" show-overflow-tooltip>
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
          <el-button type="primary" size="small" @click="addLogisticOrderProduct">{{$t('common.buttonText.confirm')}}</el-button>
          <el-button type="danger" size="small" @click="innerVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="loading1" @click="submit('editForm', 1, dialogType === 'add')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="primary" size="small" :loading="loading1" @click="submit('editForm', 2, dialogType === 'add')">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="shutDown">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="detailVisible"
      :title="$t('logistics.logisticsOrder.viewLogisticsOrder')"
      width="1000px"
      center
      :close-on-click-modal="false">
      <el-form label-position="left" :label-width="isZh?'100px':'165px'" size="small" inline>
        <div>
          <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderNo')">
            {{detailForm.logisticsOrderNo || 'Null'}}
          </el-form-item>
        </div>
        <el-row :gutter="16">
          <el-col>
            <el-form-item :label="$t('logistics.logisticsOrder.orderType')" prop="orderType">
              <el-radio-group v-model="detailForm.orderType" disabled>
                <el-radio label="0">{{$t('logistics.logisticsOrder.sales')}}</el-radio>
                <el-radio label="1">{{$t('logistics.logisticsOrder.other')}}</el-radio>
                <el-radio label="2">{{$t('logistics.logisticsOrder.purchase')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('logistics.logisticsOrder.orderNo')" prop="orderNoArr">
              <el-input v-model="detailForm.orderNo" readonly style="width:500px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('order.sale.buyer')">
              <el-input v-model="detailForm.buyBIdName" readonly style="width:500px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.supplierInfoBId')" prop="supplierInfoBId">
              <el-select v-model="detailForm.supplierInfoBId" disabled style="width: 240px">
                <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.customerBasicInfoBId')" prop="companyInfoBId">
              <el-select v-model="detailForm.companyInfoBId" disabled placeholder="select" style="width: 240px">
                <el-option v-for="(item, index) in companyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.transportationMethod')" prop="transportationMethod" >
              <el-select v-model="detailForm.transportationMethod" disabled style="width: 240px">
                <el-option v-for="(item, index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.paymentCurrency')" prop="paymentCurrency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="detailForm.paymentCurrency" disabled style="width: 240px">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.departurePortAdd')" prop="departurePortAdd">
              <el-input v-model="detailForm.departurePortAdd" disabled style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.destinationPortAdd')" prop="destinationPortAdd">
              <el-input v-model="detailForm.destinationPortAdd" disabled style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.etd2')" prop="etd">
              <el-date-picker v-model="detailForm.etd" type="datetime" disabled leplaceholder="select date" style="width: 240px">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.logisticsOrder.eta2')" prop="eta">
              <el-date-picker v-model="detailForm.eta" type="datetime" disabled placeholder="select date" style="width: 240px">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="detailForm.logisticsOrderProductsList"
              style="margin: 16px 0"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" type="index" width="55"></el-table-column>
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.productName')" prop="productName" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.productDescription')" prop="productDescription" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{isZh ? scope.row.cnProductDescription : scope.row.enProductDescription}}
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.clientProductRef')" prop="productSkuReference" show-overflow-tooltip />
              <el-table-column align="center" :label="$t('logistics.logisticsOrder.productQuantity')" prop="productQuantity" show-overflow-tooltip />
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderWeight')" prop="logisticsOrderWeight">
              <el-input v-model.number="detailForm.logisticsOrderWeight" readonly style="width:130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderVolume')" prop="logisticsOrderVolume">
              <el-input v-model.number="detailForm.logisticsOrderVolume" readonly style="width:130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderAmount')" prop="logisticsOrderAmount">
              <el-input v-model.number="detailForm.logisticsOrderAmount" readonly style="width:130px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('logistics.logisticsOrder.remark')" prop="remark">
              <el-input v-model="detailForm.remark" type="textarea" readonly :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('logistics.logisticsOrder.filesList')">
              <div v-for="(item,index) in detailForm.logisticsOrderAttachmentsList" :key="index">
                {{item.attachmentName}}
                <el-button type="danger" size="mini" class="export" style="margin-left: 20px" @click="downFile(item.attachmentPath)">{{$t('logistics.logisticsOrder.download')}}</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="affirmVisible">
            <el-form-item :label="$t('logistics.logisticsOrder.auditResult')" required>
              <el-input v-model="auditResult" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" v-if="affirmVisible" @click="acceptOrder(1)">{{$t('common.buttonText.accepted')}}</el-button>
        <el-button type="primary" size="small" v-if="affirmVisible" @click="acceptOrder(2)">{{$t('common.buttonText.rejected')}}</el-button>
        <el-button type="danger" size="small" @click="shutDown">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="paymentVisible" :title="$t('logistics.logisticsOrder.applayLogisticsOrder')" width="900px" center :close-on-click-modal="false" @closed="clearData">
      <div class="payment-box">
        <div class="payment-order">
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.logisticsOrderNo')}}</div>
              <div class="item-text">{{detailForm.logisticsOrderNo}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.logisticsOrderDate')}}</div>
              <div class="item-text">{{detailForm.logisticsOrderDate | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.customerBasicInfoBId')}}</div>
              <div class="item-text">{{companyFilter(detailForm.companyInfoBId)}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.transportationMethod')}}</div>
              <div class="item-text">{{transportationFilter(detailForm.transportationMethod, language === 'zh')}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.departurePortAdd')}}</div>
              <div class="item-text">{{detailForm.departurePortAdd}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.destinationPortAdd')}}</div>
              <div class="item-text">{{detailForm.destinationPortAdd}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.etd2')}}</div>
              <div class="item-text">{{detailForm.etd | timeFmt}}</div>
            </div>
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.eta2')}}</div>
              <div class="item-text">{{detailForm.eta | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label" style="width: 150px">{{$t('logistics.logisticsOrder.orderNo')}}</div>
              <div class="item-text">{{detailForm.orderNo}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier" v-if="detailForm.supplierInfo">
          <div>
            <div>{{$t('logistics.logisticsOrder.supplierInfo')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.supplierName')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.chargeBy')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.chargeBy}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.mobilePhone')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.mobilePhone}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.registerAddress')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.registerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.countryCode')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.countryCode}}</div>
            </div>
          </div>
          <div>
            <div>{{$t('logistics.logisticsOrder.supplierBankAccount')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.bankName')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.bankName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.branchName')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.branchName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.bankAccount')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.bankAccount}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.bankAddress')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.bankAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.swiftCode')}}</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.swiftCode}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>{{$t('logistics.logisticsOrder.paymentInfo')}}</div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.logisticsOrderAmount2')}}</div>
              <div class="item-text">{{paymentForm.logisticsOrderAmount | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.paymentCurrency2')}}</div>
              <div class="item-text">{{paymentForm.paymentCurrency}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.pendingPayment')}}</div>
              <div class="item-text">{{paymentForm.pendingPayment | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.applyPaymentAmount')}}</div>
              <div class="item-text">
                <el-input-number v-model="paymentForm.applyPaymentAmount" size="small" :min="0" clearable class="hidden-control input-center" style="width: 200px"/>
              </div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.paymentTime')}}</div>
              <div class="item-text">
                <el-date-picker v-model="paymentForm.paymentTime" type="date" placeholder="select date" style="width: 200px"/>
              </div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">{{$t('logistics.logisticsOrder.applicationReason')}}</div>
              <div class="item-text">
                <el-input type="textarea" :maxlength="200" v-model="paymentForm.applicationReason" style="width: 60%"/>
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
                :on-success="handleSuccess2"
                :on-remove="handleRemove2"
                :before-upload="beforeUpload2"
                :file-list="paymentForm.paymentDocList">
                <el-button size="small" type="primary">{{$t('query.tableLabel.ClickUpload')}}</el-button>
              </el-upload>
            </div>
          </div>
        </div>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addOrderPayment">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="paymentVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { parseTime, deepClone } from "@/utils/index";
import { uploadActionUrl } from '@/api/common'
import { selectCountryListApi, getSupplyCompanyList, selectCurrencyCodeListApi } from "@/api/system";
import { supplierTypeList } from "@/api/supplier";
import {
  selectLogisticsOrderDetailListAPI,
  getLogisticsOrderNoAPI,
  getSaleOrderListByType,
  getTransitradeOrderListByType,
  getPurchaseOrderListByType,
  addSaleOrderProductToLogistic,
  addTransitradeOrderProductToLogistic,
  addPurchaseOrderProductToLogistic,
  saveLogisticsOrderDetailAPI,
  submitLogisticsOrderDetailAPI,
  selectLogisticsOrderByIdAPI,
  saveApplyAPI,
  updateAffirmResultAPI,
  exportLogisticsOrderExcelApi
} from '@/api/logistic'
import { getPaymentAmount } from '@/api/finance'
import moneyFmt from "@/mixin/moneyFmt";
export default {
  components: {
    Pagination
    // OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      paymentVisible: false,
      affirmVisible: false,
      detailVisible: false,
      innerVisible: false,
      dialogType: '',
      uploadActionUrl,
      listLoading: true,
      loading1: false,
      loading2: false,
      dialogVisible: false,
      rangeTime: [],
      selectList: [],
      selectOrderList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        logisticsOrderNo: '',
        etd: '',
        eta: '',
        orderNo: '',
        orderType: ''
      },
      orderSearchData: {
        orderNo: '',
        orderStatus: 5,
        pageNum: 1,
        pageSize: 10,
        total: 0
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
        applicationReason: '',
        paymentDocList: [],
        attachmentName: '',
        attachmentPath: ''
      },
      dataList: [],
      logisticsOrderProductsList: [],
      currencyCodeList: [],
      orderList: [],
      supplierList: [],
      companyList: [],
      fileList: [],
      auditResult: '',
      detailForm: {},
      editForm: {
        logisticsOrderNo: '',
        companyInfoBId: '',
        supplierInfoBId: '',
        departurePortAdd: '',
        destinationPortAdd: '',
        eta: '',
        etd: '',
        logisticsOrderAmount: 0,
        logisticsOrderVolume: 0,
        logisticsOrderWeight: 0,
        orderNo: '',
        paymentCurrency: '',
        remark: '',
        transportationMethod: '1',
        orderType: '0',
        logisticsOrderProductsList: [],
        logisticsOrderAttachmentsList: []
      },
      editFormRules: {
        supplierInfoBId: [{ required: true, message: this.$t('logistics.hint.supplierInfoBIdHint'), trigger: 'change' }],
        companyInfoBId: [{ required: true, message: this.$t('logistics.hint.companyInfoBIdHint'), trigger: 'change' }],
        paymentCurrency: [{ required: true, message: this.$t('logistics.hint.paymentCurrencyHint'), trigger: 'change' }],
        transportationMethod: [{ required: true, message: this.$t('logistics.hint.transportationMethodHint'), trigger: 'change' }],
        departurePortAdd: [{ required: true, message: this.$t('logistics.hint.departurePortAddHint'), trigger: 'blur' }],
        destinationPortAdd: [{ required: true, message: this.$t('logistics.hint.destinationPortAddHint'), trigger: 'blur' }],
        eta: [{ required: true, message: this.$t('logistics.hint.etaHint'), trigger: 'blur' }],
        etd: [{ required: true, message: this.$t('logistics.hint.etdHint'), trigger: 'blur' }],
        logisticsOrderAmount: [{ type: 'number', required: true, message: this.$t('logistics.hint.logisticsOrderAmountHint'), trigger: 'blur' }],
        logisticsOrderVolume: [{ type: 'number', required: true, message: this.$t('logistics.hint.logisticsOrderVolumeHint'), trigger: 'blur' }],
        logisticsOrderWeight: [{ type: 'number', required: true, message: this.$t('logistics.hint.logisticsOrderWeightHint'), trigger: 'blur' }]
      },
      orderTypeList: [
        {
          labelZh: '销售',
          label: 'Sales',
          orderType: 0
        },
        {
          labelZh: '转单',
          label: 'Other',
          orderType: 1
        },
        {
          labelZh: '采购',
          label: 'Purchase',
          orderType: 2
        }
      ],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.editForm.eta) {
            return time.getTime() > this.editForm.eta;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.editForm.etd) {
            return time.getTime() < this.editForm.etd
          }
        }
      }
    }
  },
  computed: {
    transportList() {
      return this.$store.state.order.transportList
    }
  },
  watch: {
    isZh() {
      this.editFormRules = {
        supplierInfoBId: [{ required: true, message: this.$t('logistics.hint.supplierInfoBIdHint'), trigger: 'change' }],
        companyInfoBId: [{ required: true, message: this.$t('logistics.hint.companyInfoBIdHint'), trigger: 'change' }],
        paymentCurrency: [{ required: true, message: this.$t('logistics.hint.paymentCurrencyHint'), trigger: 'change' }],
        transportationMethod: [{ required: true, message: this.$t('logistics.hint.transportationMethodHint'), trigger: 'change' }],
        departurePortAdd: [{ required: true, message: this.$t('logistics.hint.departurePortAddHint'), trigger: 'blur' }],
        destinationPortAdd: [{ required: true, message: this.$t('logistics.hint.destinationPortAddHint'), trigger: 'blur' }],
        eta: [{ required: true, message: this.$t('logistics.hint.etaHint'), trigger: 'blur' }],
        etd: [{ required: true, message: this.$t('logistics.hint.etdHint'), trigger: 'blur' }],
        logisticsOrderAmount: [{ type: 'number', required: true, message: this.$t('logistics.hint.logisticsOrderAmountHint'), trigger: 'blur' }],
        logisticsOrderVolume: [{ type: 'number', required: true, message: this.$t('logistics.hint.logisticsOrderVolumeHint'), trigger: 'blur' }],
        logisticsOrderWeight: [{ type: 'number', required: true, message: this.$t('logistics.hint.logisticsOrderWeightHint'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCurrencyCodeList();
    this.getDataList();
    this.getSupplierList();
    this.getSysCustomerInfoListFun();
  },
  methods: {
    clearData() {
      this.$refs['upload'].clearFiles();
      this.editForm = {
        logisticsOrderNo: '',
        companyInfoBId: '',
        supplierInfoBId: '',
        departurePortAdd: '',
        destinationPortAdd: '',
        eta: '',
        etd: '',
        logisticsOrderAmount: 0,
        logisticsOrderVolume: 0,
        logisticsOrderWeight: 0,
        orderNo: '',
        paymentCurrency: '',
        remark: '',
        transportationMethod: '',
        orderType: '0',
        logisticsOrderProductsList: [],
        logisticsOrderAttachmentsList: []
      };
      this.paymentForm = {
        applyPaymentAmount: '',
        paymentTime: '',
        applicationReason: '',
        paymentDocList: []
      }
    },
    // 支付
    payment (row) {
      selectLogisticsOrderByIdAPI({ bId: row.bid }).then(res => {
        this.paymentVisible = true;
        this.detailForm = deepClone(res.data);
        this.detailForm.transportationMethod = String(this.detailForm.transportationMethod);
        this.detailForm.supplierInfo.supplierBankAccount = this.detailForm.supplierInfo.supplierBankAccount || [];
        this.paymentForm.paymentCurrency = this.detailForm.paymentCurrency;
        this.paymentForm.logisticsOrderAmount = this.detailForm.logisticsOrderAmount;
        this.paymentForm.supplierInfoBId = this.detailForm.supplierInfoBId;
        this.paymentForm.supplierName = this.detailForm.supplierInfo.supplierName;
        this.paymentForm.logisticsOrderBId = this.detailForm.bid;
        this.paymentForm.logisticsOrderNo = this.detailForm.logisticsOrderNo;
        this.selectSurplusAmountFun(row.bid);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 通过采购bid获取当前付款金额
    selectSurplusAmountFun(id) {
      getPaymentAmount({ associatedOrderBId: id, type: 2 }).then(res => {
        this.paymentForm.pendingPayment = res.data;
      });
    },
    addOrderPayment() {
      const { paymentTime, applyPaymentAmount } = this.paymentForm;
      if (!paymentTime || !applyPaymentAmount) {
        return this.$message.warning('Payment and application time cannot be empty')
      }
      saveApplyAPI(this.paymentForm).then(res => {
        this.$message.success('Submit Success');
        this.paymentForm.paymentTime = '';
        this.paymentForm.applyPaymentAmount = '';
        this.paymentForm.applicationReason = '';
        this.paymentVisible = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 详情
    openDetailDialog (row, type) {
      this.detailVisible = true;
      this.auditResult = '';
      this.detailForm = deepClone(row);
      this.detailForm.transportationMethod = String(this.detailForm.transportationMethod);
      this.affirmVisible = type === 2
    },
    // 打开选择订单窗口
    openAddOrderDialog() {
      this.innerVisible = true;
      this.orderSearchData.orderNo = '';
      this.getOrderListByType()
    },
    addLogisticOrderProduct() {
      let api = '';
      switch (Number(this.editForm.orderType)) {
        case 0: api = addSaleOrderProductToLogistic; break;
        case 1: api = addTransitradeOrderProductToLogistic; break;
        case 2: api = addPurchaseOrderProductToLogistic; break;
      }
      if (!this.selectOrderList.length) {
        return this.$message.warning(this.$t('finance.financeService.inputOrder'))
      }
      let obj = {
        orderBids: this.selectOrderList.map(e => e.bid).join(',')
      };
      api(obj).then(res => {
        this.editForm.logisticsOrderProductsList = res.data.map(e => {
          e.productSkuReference = e.clientProductRef;
          e.enProductDescription = e.enAttrValueList;
          e.cnProductDescription = e.cnAttrValueList;
          return { ...e }
        });
        this.orderType = this.editForm.orderType;
        this.editForm.orderNo = this.selectOrderList.map(e => e.orderNo || e.purchaseNo).join(',');
        this.editForm.orderBIdList = this.selectOrderList.map(e => e.bid).join(',');
        if (this.editForm.orderType === '0') {
          this.editForm.buyerBId = this.selectOrderList.map(e => {
            e.buyerId = e.customerBId || e.supplierBId;
            return e.buyerId
          }).join(',');
        } else if (this.editForm.orderType === '1') {
          this.editForm.buyerBId = this.selectOrderList.map(e => e.customerBId).join(',');
        } else if (this.editForm.orderType === '2') {
          this.editForm.buyerBId = this.selectOrderList.map(e => e.sysCompanyBId).join(',');
        }
        this.editForm.buyBIdName = this.selectOrderList.map(e => e.buyerName).join(',');
        this.selectOrderList = [];
        this.$refs.multipleTable.clearSelection();
        this.innerVisible = false
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    acceptOrder(status) {
      if (!this.auditResult) {
        // return this.$message.warning('请填写审批意见')
        return this.$message.warning('Please fill in the approval comments')
      }
      let obj = {
        id: this.detailForm.id,
        affirmResult: status,
        auditResult: this.auditResult
      };
      updateAffirmResultAPI(obj).then(res => {
        this.$message.success('operate successfully');
        this.getDataList();
        this.shutDown()
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    shutDown () {
      this.paymentVisible = false;
      this.detailVisible = false;
      this.affirmVisible = false;
      this.dialogVisible = false;
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
    // 查询获取国家
    getCountryList(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || [];
          });
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 物流供应商列表
    getSupplierList() {
      supplierTypeList({ supplierType: 2 }).then(res => {
        this.supplierList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.companyList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.editForm = Object.assign(this.editForm, row);
        this.editForm.transportationMethod = String(this.editForm.transportationMethod);
        this.orderType = this.editForm.orderType;
        this.fileList = this.editForm.logisticsOrderAttachmentsList.map(e => {
          e.name = e.attachmentName;
          e.url = e.attachmentPath;
          return { ...e }
        })
      } else {
        getLogisticsOrderNoAPI().then(res => {
          this.editForm.logisticsOrderNo = res.data;
        })
      }
      this.dialogVisible = true;
    },
    submit(formName, type, flag) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true;
          this.editForm.logisticsStatus = type;
          this.editForm.orderType = this.orderType;
          let api = type === 1 ? saveLogisticsOrderDetailAPI : submitLogisticsOrderDetailAPI;
          api(this.editForm).then(res => {
            this.dialogVisible = false;
            this.loading1 = false;
            this.$message.success('Save Success');
            this.getDataList()
          }).catch(err => {
            this.loading1 = false;
            this.$message.error(err.message);
          });
        }
      })
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.orderStartTime = date[0];
        this.postData.orderEndTime = date[1];
      } else {
        this.postData.orderStartTime = "";
        this.postData.orderEndTime = "";
      }
    },
    searchOrderList() {
      this.orderSearchData.pageNum = 1;
      this.getOrderListByType()
    },
    getOrderListByType() {
      let api = '';
      switch (Number(this.editForm.orderType)) {
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
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 物流单列表
    getDataList() {
      // let obj = {};
      // for (let key in this.postData) {
      //   if (this.postData[key] !== "") {
      //     obj[key] = this.postData[key];
      //   }
      // }
      selectLogisticsOrderDetailListAPI(this.postData).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    getSelectOrderList(selects) {
      this.selectOrderList = selects
    },
    handleRemove(file, fileList) {
      this.editForm.logisticsOrderAttachmentsList = fileList.map(e => {
        e.attachmentFileUuid = e.attachmentFileUuid || e.response.data.UUID;
        e.attachmentName = e.attachmentName || e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        return { ...e }
      })
    },
    beforeUpload(file) {
      for (let i = 0; i < this.editForm.logisticsOrderAttachmentsList.length; i++) {
        if (this.editForm.logisticsOrderAttachmentsList[i].attachmentName === file.name) {
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
      return isLt2M
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The current limit selects 3 files, this time selected ${files.length} Documents，Selected altogether ${files.length + fileList.length} Documents`);
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Confirm removal ${ file.name }？`);
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.editForm.logisticsOrderAttachmentsList = fileList.map(e => {
        e.attachmentFileUuid = e.attachmentFileUuid || e.response.data.UUID;
        e.attachmentName = e.attachmentName || e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        return { ...e }
      })
    },
    // 申请付款凭证-上传成功
    handleSuccess2(res, file, filename) {
      this.paymentForm.attachmentName = file.name;
      this.paymentForm.attachmentPath = res.data.filePath;
      this.paymentForm.paymentDocList.push({ attachmentName: this.paymentForm.attachmentName, attachmentPath: this.paymentForm.attachmentPath });
    },
    // 申请付款凭证-上传文件删除
    handleRemove2(file, paymentDocList) {
      this.paymentForm.attachmentName = '';
      this.paymentForm.attachmentPath = '';
    },
    // 申请付款凭证-上传之前限制
    beforeUpload2(file) {
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
      return isLt2M
    },
    // 删除协议
    removeFile(scope) {
      this.paymentForm.paymentDocList.splice(scope.$index, 1)
    },
    // 下载协议
    exportPactFile(row) {
      this.downFile(row.attachmentPath)
    },
    companyFilter(id) {
      if (id) {
        let obj = this.companyList.filter(e => e.bid === id)[0];
        return obj.companyName
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
    // transportationFilter(flag) {
    //   switch (flag) {
    //     case 0: return 'By Truck';
    //     case 1: return 'By Railway';
    //     case 2: return 'By Ship';
    //     case 3: return 'By Air';
    //     default: break
    //   }
    // },
    // 导出操作
    exportExcelFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        logisticsOrderNo: this.postData.logisticsOrderNo,
        etd: this.postData.etd,
        eta: this.postData.eta,
        orderNo: this.postData.orderNo,
        orderType: this.postData.orderType
      };
      exportLogisticsOrderExcelApi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'LogisticsOrder.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    orderTypeFmt(status, isZh) {
      switch (Number(status)) {
        case 0: return isZh ? '销售' : 'Sales';
        case 1: return isZh ? '转单' : 'TransiTrades';
        case 2: return isZh ? '采购' : 'Purchase';
      }
    },
    statusFilter(status, isZh) {
      switch (Number(status)) {
        case 1: return isZh ? '编辑中' : 'Editing';
        case 2: return isZh ? '审批中' : 'Pending Approval';
        case 3: return isZh ? '审批通过' : 'Approval Pass';
        case 4: return isZh ? '审批失败' : 'Rejected';
        case 5: return isZh ? '运输中' : 'In Transportation';
        case 6: return isZh ? '商家拒绝' : 'Merchant refusal';
        case 7: return isZh ? '完成' : 'Complete';
        default: break
      }
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.logisticOrder {
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
  .avatar {
    width: 60%;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
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
  }
}
</style>
