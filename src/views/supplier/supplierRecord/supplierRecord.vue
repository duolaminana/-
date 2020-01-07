<template>
  <div class="app-container goutong-test">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('supplier.record.supplierName')">
            <el-input v-model.trim="postData.supplierName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.classification')">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
              filterable
              clearable
              change-on-select
              @change="getParentId1"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.level')">
            <el-select v-model="postData.supplierGradeBId" clearable style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="language === 'zh' ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('supplier.record.supplierCode')">
            <el-input v-model.trim="postData.supplierCode" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('customer.record.country')">
            <el-select
              v-model="postData.countryCode"
              clearable
              filterable
              style="width: 200px"
            >
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.record.contactNo')">
            <el-input v-model.trim="postData.officePhone" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openAddDialog">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" class="export">{{$t('customer.record.import')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
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

      <el-table-column min-width="110" :label="$t('supplier.record.supplierName')" prop="supplierName" show-overflow-tooltip />

      <el-table-column min-width="110" :label="$t('supplier.record.supplierCode')" prop="supplierCode" show-overflow-tooltip />

      <!--<el-table-column :label="$t('customer.record.clientCode')" prop="customerCode" show-overflow-tooltip />-->

      <el-table-column min-width="110" :label="$t('customer.record.country')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCountryName : scope.row.enCountryName}}
        </template>
      </el-table-column>

      <el-table-column min-width="110" align="center" :label="$t('customer.record.contactNo')" prop="mobilePhone" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('system.role.modifier')" prop="updateUserId" show-overflow-tooltip />

      <el-table-column width="160" align="center" :label="$t('system.userManage.editTime')" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="supplierStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.supplierStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.supplierStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.operation')" :width="isZh?'100':'180'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row)">{{$t('customer.record.records')}}</el-button>
          <!--<el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row.bid)">禁用</el-button>-->
          <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑</el-button>-->
          <!--<el-button type="primary" size="mini" class="table-btn-width" @click="addCustomerRecord(scope.row.bid,scope.row.customerName)">沟通记录</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'? $t('customer.record.addCommunication'): $t('customer.record.editCommunication')" center width="1000px" @closed="clearData">
      <el-form ref="addCompany" :model="adsPosition" v-if="dialogVisible" :label-width="isZh?'100px':'170px'" label-position="right" size="small" :rules="adsPositionRules">
        <el-form-item :label="$t('supplier.record.supplierName')" prop="supplierBId">
          <el-select v-model="adsPosition.supplierBId" clearable style="width: 100%" disabled>
            <el-option v-for="(item, index) in clientList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item :label="$t('customer.record.contact')" prop="contact">
          <el-input v-model="adsPosition.contact" clearable style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationTheme')" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.participant')" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationDate')" prop="commTime">
          <el-date-picker
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationPlace')" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationMode')" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 500px">
            <el-radio :label="1">{{$t('customer.record.instant')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.mail')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.telephone')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.interview')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationContent')" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce ref="commRemarks" v-model="adsPosition.commRemarks" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('customer.record.evaluate')" prop="commSituation">
          <el-radio-group v-model="adsPosition.commSituation" style="width: 500px">
            <el-radio :label="1">{{$t('customer.record.veryGood')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.good')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.ordinary')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.bad')}}</el-radio>
            <el-radio :label="5">{{$t('customer.record.veryBad')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.actionPlan')" prop="commPlan">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce ref="commPlan" v-model="adsPosition.commPlan" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('customer.record.uplode')">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadActionUrl"
            :show-file-list="false"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('customer.record.clickUplode')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('customer.record.restrictions')}}</div>
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
        <el-table-column align="center" :label="$t('customer.record.fileName')" prop="filesName">
        </el-table-column>
        <el-table-column align="center" :label="$t('system.role.operation')" >
          <template slot-scope="scope">
            <!--<el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">下载附件</el-button>-->
            <el-button type="danger" size="mini" @click="removeFile(scope)">{{$t('system.role.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table-->
        <!--:data="filesList"-->
        <!--border-->
        <!--fit-->
        <!--style="margin: 10px 0"-->
        <!--size="small">-->
        <!--<el-table-column :label="$t('customer.record.fileName')" prop="filesName">-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('customer.record.detailCommunication')" center width="1150px" @closed="clearData">
      <el-form :label-width="isZh?'100px':'100px'" size="small" v-model="dialogPostData">
        <div>
          <el-form-item :label="$t('customer.record.contact')">
            <el-input v-model.trim="dialogPostData.contact" clearable style="width: 380px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.communicationMode')" prop="commType">
            <el-radio-group v-model="dialogPostData.commType" style="width: 500px">
              <el-radio >{{isZh ? '全部' : 'All'}}</el-radio>
              <el-radio :label="1">{{$t('customer.record.instant')}}</el-radio>
              <el-radio :label="2">{{$t('customer.record.mail')}}</el-radio>
              <el-radio :label="3">{{$t('customer.record.telephone')}}</el-radio>
              <el-radio :label="4">{{$t('customer.record.interview')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.record.communicationTheme')">
            <el-input v-model.trim="dialogPostData.commTheme" clearable style="width: 380px" />
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.start')">
            <el-date-picker
              v-model="dialogPostData.startTime"
              :picker-options="pickerOptionsStart"
              type="datetime"
              style="width: 380px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.end')">
            <el-date-picker
              v-model="dialogPostData.endTime"
              :picker-options="pickerOptionsEnd"
              type="datetime"
              style="width: 380px">
            </el-date-picker>
            <el-button type="primary" class="export" style="margin-left: 10px" @click="searchRecord">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="topBtns">
          <el-button type="primary" size="small" @click="openDialog('add',dialogPostData)">{{$t('system.role.add')}}</el-button>
          <el-button type="primary" size="small" @click="deleteListByIds">{{$t('system.role.delete')}}</el-button>
          <el-button type="primary" size="small" @click="outportSupplierRecordData" class="export">{{$t('system.role.export')}}</el-button>
      </div>
      <el-table
        :data="dialogDataList"
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
        <el-table-column :label="$t('supplier.record.supplierName')" show-overflow-tooltip >
          <template>
            {{ customerNameNum }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.record.contact')" prop="contact" show-overflow-tooltip />
        <el-table-column width="160" :label="$t('customer.record.communicationTheme')" prop="commTheme" show-overflow-tooltip/>
        <el-table-column width="160" align="center" :label="$t('customer.record.communicationMode')" prop="commType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.commType | commTypeFmt(language)}}
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" :label="$t('customer.record.communicationDate')" prop="commTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.commTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('system.role.operation')" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export" @click="openVisibleDetail(scope.row)">{{$t('system.role.view')}}</el-button>
            <el-button type="primary" size="mini" @click="openDialog('edit',scope.row)">{{$t('system.userManage.editUser')}}</el-button>
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑</el-button>-->
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="addCustomerRecord(scope.row.bid,scope.row.customerName)">沟通记录</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="dialogPostData.total" :page.sync="dialogPostData.pageNum" :limit.sync="dialogPostData.pageSize" @pagination="getDialogDataList" ></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="dialogVisibleDetail" :title="$t('customer.record.detailCommunication')" center width="1000px" @closed="clearData">
      <el-form ref="addCompany" :model="adsPosition" :label-width="isZh?'100px':'170px'" label-position="right" size="small" :rules="adsPositionRules">
        <el-form-item :label="$t('supplier.record.supplierName')" prop="customerBId">
          <el-select v-model="adsPosition.supplierBId" disabled style="width: 100%">
            <el-option v-for="(item, index) in clientList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item :label="$t('customer.record.contact')" prop="contact">
          <el-input v-model="adsPosition.contact" clearable style="width: 100%" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationTheme')" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable style="width: 100%" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.participant')" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" style="width: 100%" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationDate')" prop="commTime">
          <el-date-picker
            disabled
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationPlace')" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable style="width: 100%" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationMode')" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 500px" disabled>
            <el-radio :label="1">{{$t('customer.record.instant')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.mail')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.telephone')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.interview')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationContent')" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce ref="commRemarks1" v-model="adsPosition.commRemarks" style="width: 100%;pointer-events:none"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.evaluate')" prop="commSituation">
          <el-radio-group v-model="adsPosition.commSituation" style="width: 500px" disabled>
            <el-radio :label="1">{{$t('customer.record.veryGood')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.good')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.ordinary')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.bad')}}</el-radio>
            <el-radio :label="5">{{$t('customer.record.veryBad')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.actionPlan')" prop="commPlan">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce ref="commPlan1" v-model="adsPosition.commPlan" style="width: 100%;pointer-events:none"/>
        </el-form-item>
        <!--<el-form-item :label="$t('logistics.logisticsOrder.filesList')">-->
          <!--<div v-for="(item,index) in adsPosition.filesList" :key="index" >-->
            <!--{{item.filesName}}-->
            <!--<el-button type="danger" size="mini" class="export" style="margin-left: 20px" @click="downFile(item.filesUrl)">{{$t('logistics.logisticsOrder.download')}}</el-button>-->
          <!--</div>-->
        <!--</el-form-item>-->
      </el-form>
      <el-table
        :data="adsPosition.filesList"
        border
        fit
        style="margin: 10px 0"
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" :label="$t('customer.record.fileName')" prop="filesName">
        </el-table-column>
        <el-table-column align="center" :label="$t('system.role.operation')" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.filesUrl)">{{$t('logistics.logisticsOrder.download')}}</el-button>
            <!--<el-button type="danger" size="mini" @click="removeFile(scope)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table-->
        <!--:data="adsPosition.filesList"-->
        <!--border-->
        <!--fit-->
        <!--style="margin: 10px 0"-->
        <!--size="small">-->
        <!--&lt;!&ndash;<el-table-column :label="$t('customer.record.fileName')" prop="filesName">&ndash;&gt;-->
        <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
        <!--<el-table-column :label="$t('customer.record.fileName')">-->
          <!--<div v-for="(item,index) in adsPosition.filesList" :key="index" >-->
            <!--{{item.filesName}}-->
            <!--<el-button type="danger" size="mini" class="export" style="margin-left: 20px" @click="downFile(item.filesUrl)">{{$t('logistics.logisticsOrder.download')}}</el-button>-->
          <!--</div>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisibleDetail=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog :visible.sync="addialogVisible" :title=" $t('customer.record.addCommunication')" center width="1000px" @closed="clearData">
      <el-form ref="addCompany" :model="addAdsPosition" v-if="addialogVisible" :label-width="isZh ? '100px' :'170px'" label-position="right" size="small" :rules="adsPositionRules">
        <el-form-item :label="$t('supplier.record.supplierName')" prop="supplierBId">
          <el-select v-model="addAdsPosition.supplierBId" clearable style="width: 100%">
            <el-option v-for="(item, index) in clientList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item :label="$t('customer.record.contact')" prop="contact">
          <el-input v-model="addAdsPosition.contact" clearable style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationTheme')" prop="commTheme">
          <el-input v-model="addAdsPosition.commTheme" clearable style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.participant')" prop="participantCustomerBId">
          <el-input v-model="addAdsPosition.participantCustomerBId" style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationDate')" prop="commTime">
          <el-date-picker
            v-model="addAdsPosition.commTime"
            type="datetime"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationPlace')" prop="commPlace">
          <el-input v-model="addAdsPosition.commPlace" clearable style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationMode')" prop="commType">
          <el-radio-group v-model="addAdsPosition.commType" style="width: 500px">
            <el-radio :label="1">{{$t('customer.record.instant')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.mail')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.telephone')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.interview')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationContent')" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce ref="commRemarks" v-model="addAdsPosition.commRemarks" style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.evaluate')" prop="commSituation">
          <el-radio-group v-model="addAdsPosition.commSituation" style="width: 500px">
            <el-radio :label="1">{{$t('customer.record.veryGood')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.good')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.ordinary')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.bad')}}</el-radio>
            <el-radio :label="5">{{$t('customer.record.veryBad')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.actionPlan')" prop="commPlan" label-position="top">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce ref="commPlan" v-model="addAdsPosition.commPlan" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('common.upload')">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="AddhandleSuccess"
            :show-file-list="false"
            :on-remove="handleRemove"
            :before-upload="AddbeforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('customer.record.clickUplode')}}</el-button>
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
        <el-table-column align="center" :label="$t('customer.record.fileName')" prop="filesName">
        </el-table-column>
        <el-table-column align="center" :label="$t('system.role.operation')" >
          <template slot-scope="scope">
            <!--<el-button type="primary" size="mini" class="export" @click="downFile(scope.row.filesUrl)">下载附件</el-button>-->
            <el-button type="danger" size="mini" @click="removeFile(scope)">{{$t('system.role.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<el-table-->
        <!--:data="filesList"-->
        <!--border-->
        <!--fit-->
        <!--style="margin: 10px 0"-->
        <!--size="small">-->
        <!--<el-table-column :label="$t('customer.record.fileName')" prop="filesName">-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addconfirmAdd('addCompany')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="addialogVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { parseTime, deepClone } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { selectCountryListApi } from '@/api/system'
import {
  supplierPageList,
  listSupplierCommunicationApi,
  saveSupplierCommunicationApi,
  updateSupplierCommunicationApi,
  deleteBatchByIds,
  getAllSortList,
  exportExcelSupplierList,
  exportExcelCommunicationList
} from '@/api/supplier'
import Tinymce from '@/components/Tinymce'
import { listMemberLevel } from "@/api/member";

export default {
  components: {
    Pagination,
    Tinymce
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    timeFmt1(val) {
      if (val) {
        return parseTime(val, '{y}-{m}-{d}')
      }
    },
    fileSvg(file) {
      let fileType = file.split('.')[file.split('.').length - 1];
      if (fileType === 'doc' || fileType === 'docx') {
        return 'doc'
      } else if (fileType === 'xls' || fileType === 'xlsx') {
        return 'excel'
      } else if (fileType === 'pdf' || fileType === 'PDF') {
        return 'pdf'
      } else if (fileType === 'zip' || fileType === 'rar') {
        return 'zip'
      } else {
        return 'text'
      }
    },
    commTypeFmt(val, language) {
      switch (val) {
        // 沟通方式(1-即时通讯 ,  2-邮件 , 3-电话 , 4-见面)
        case 1: return language === 'zh' ? '即时通讯' : 'Instant';
        case 2: return language === 'zh' ? '邮件' : 'Mail';
        case 3: return language === 'zh' ? '电话' : 'Telephone';
        case 4: return language === 'zh' ? '拜访' : 'Interview';
        default:
          return '';
      }
    },
    commSituationFmt(val, language) {
      switch (val) {
        // 沟通情况(1-非常好 , 2-好 , 3-一般 , 4-糟糕 , 5-非常糟糕)
        case 1: return language === 'zh' ? '很好' : 'Very Good';
        case 2: return language === 'zh' ? '好' : 'Good';
        case 3: return language === 'zh' ? '一般' : 'Ordinary';
        case 4: return language === 'zh' ? '差' : 'Bad';
        case 5: return language === 'zh' ? '很差' : 'Very Bad'
        default:
          return '';
      }
    },
    sourceName(val) {
      switch (Number(val)) {
        case 1: return '自助开发';
        case 2: return '询盘';
        case 3: return '展会';
        default: return ''
      }
    }
  },
  data() {
    return {
      ActivityStart: [],
      dialogDataList: [],
      dialogVisibleDetail: false,
      addialogVisible: false,
      dialogPostData: {
        supplierBId: '',
        contact: '',
        commTheme: '',
        customerName: '',
        commType: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      clientList: [],
      searchSortName: [],
      customerNameNum: '',
      sortList: [],
      uploadActionUrl,
      dataList: [],
      filesList: [],
      listLoading: true,
      dialogVisible: false,
      detailModal: false,
      dialogType: '',
      rangeTime: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.dialogPostData.endTime) {
            return time.getTime() > this.dialogPostData.endTime
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.dialogPostData.startTime) {
            return time.getTime() < this.dialogPostData.startTime
          }
        }
      },
      selectList: [],
      gradeList: [],
      countryList: [],
      cusInfo: {},
      gradeObj: {},
      countryObj: {},
      reviewForm: {
        positionIds: ''
      },
      addAdsPosition: {
        supplierBId: '',
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: "",
        supplierName: ""
      },
      adsPosition: {
        supplierBId: '',
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: "",
        supplierName: ""
      },
      adsPosition1: {
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        filesList: []
      },
      adsPositionRules: {
        contact: [
          { required: true, message: this.$t('customer.record.inputContactName'), trigger: 'blur' }
        ],
        supplierBId: [
          { required: true, message: this.$t('customer.record.inputClientName'), trigger: 'blur' }
        ],
        commTime: [
          { required: true, message: this.$t('customer.record.inputDate'), trigger: 'blur' }
        ],
        commType: [
          { required: true, message: this.$t('customer.record.inputWay'), trigger: 'blur' }
        ],
        commSituation: [
          { required: true, message: this.$t('customer.record.inputSituation'), trigger: 'blur' }
        ],
        commTheme: [
          { required: true, message: this.$t('customer.record.inputTheme'), trigger: 'blur' }
        ],
        participantCustomerBId: [
          { required: true, message: this.$t('customer.record.inputParticipant'), trigger: 'blur' }
        ],
        commPlace: [
          { required: true, message: this.$t('customer.record.inputPlace'), trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: '',
        endTime: '',
        commTheme: '',
        customerName: '',
        customerStatus: '',
        customerCode: '',
        mobilePhone: '',
        countryCode: '',
        memberBId: '',
        supplierSortBId: ''
      },
      areaList: [
        {
          label: 'Enabled',
          labelZh: '使用中',
          inquiryStatus: 0
        },
        {
          label: 'Disabled',
          labelZh: '已禁用',
          inquiryStatus: 1
        }
      ],
      isDetailFirst: true,
      isFirst: true
    }
  },
  watch: {
    addialogVisible(val) {
      if (!val) {
        this.$refs['commPlan'].setContent('');
        this.$refs['commRemarks'].setContent('');
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$refs['commPlan'].setContent('');
        this.$refs['commRemarks'].setContent('');
        this.isFirst = true
      }
    },
    dialogVisibleDetail(val) {
      if (!val) {
        this.$refs['commPlan1'].setContent('');
        this.$refs['commRemarks1'].setContent('');
        this.isDetailFirst = true;
      }
    },
    isZh() {
      this.adsPositionRules = {
        contact: [
          { required: true, message: this.$t('customer.record.inputContactName'), trigger: 'blur' }
        ],
        supplierBId: [
          { required: true, message: this.$t('customer.record.inputClientName'), trigger: 'blur' }
        ],
        commTime: [
          { required: true, message: this.$t('customer.record.inputDate'), trigger: 'blur' }
        ],
        commType: [
          { required: true, message: this.$t('customer.record.inputWay'), trigger: 'blur' }
        ],
        commSituation: [
          { required: true, message: this.$t('customer.record.inputSituation'), trigger: 'blur' }
        ],
        commTheme: [
          { required: true, message: this.$t('customer.record.inputTheme'), trigger: 'blur' }
        ],
        participantCustomerBId: [
          { required: true, message: this.$t('customer.record.inputParticipant'), trigger: 'blur' }
        ],
        commPlace: [
          { required: true, message: this.$t('customer.record.inputPlace'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.promise();
    this.getDataList();
    this.getSortList()
    this.getGradeList()
  },
  methods: {
    searchRecord() {
      this.dialogPostData.pageNum = 1;
      this.getDialogDataList()
    },
    openVisibleDetail(row) {
      this.dialogVisibleDetail = true
      this.adsPosition = deepClone(row);
      if (!this.isDetailFirst) {
        this.$refs['commPlan1'].setContent(this.adsPosition.commPlan);
        this.$refs['commRemarks1'].setContent(this.adsPosition.commRemarks);
      }
      supplierPageList({ pageNum: 1, pageSize: 999 }).then(res => {
        this.clientList = res.data.list
      })
    },
    getParentId1(arr) {
      if (arr.length) {
        this.postData.supplierSortBId = arr.join(',')
      } else {
        this.postData.supplierSortBId = ''
      }
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelSupplierList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '供应商沟通管理列表.xlsx');
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    outportSupplierRecordData() {
      let obj = {};
      for (let key in this.dialogPostData) {
        if (this.dialogPostData[key] !== '') {
          obj[key] = this.dialogPostData[key]
        }
      }
      exportExcelCommunicationList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'supplierRecord.xls');
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    clearData() {
      this.addAdsPosition = {
        supplierBId: '',
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: "",
        supplierName: ""
      };
      this.adsPosition = {
        supplierBId: '',
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: "",
        supplierName: ""
      }
      this.dialogPostData.commTheme = "";
      this.dialogPostData.contact = "";
      this.dialogPostData.commType = "";
      this.dialogPostData.commTime = "";
      this.dialogPostData.startTime = "";
      this.dialogPostData.endTime = "";
      this.filesList = [];
    },
    async promise() {
      try {
        await this.getGradeList();
        await this.getCountryAllList();
        // this.getCusInfo();
      } catch (e) {
        this.$message.error(e)
      }
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    // 供应商分类
    getSortList() {
      getAllSortList().then(res => {
        this.sortList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 删除
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('system.userManage.option'));
      }
      this.$confirm(this.$t('system.userManage.whether'), 'Tips', {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("common.buttonText.close"),
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.id;
        }).join(",");
        deleteBatchByIds({ ids: this.deleteIdsForm }).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.getDialogDataList();
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
    // 会员等级
    getGradeList() {
      return new Promise((resolve, reject) => {
        listMemberLevel().then(res => {
          this.gradeList = res.data
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    openAddDialog() {
      supplierPageList({ pageNum: 1, pageSize: 9999 }).then(res => {
        this.clientList = res.data.list
      })
      this.addialogVisible = true
    },
    getCountryAllList() {
      return new Promise((resolve, reject) => {
        selectCountryListApi().then(res => {
          this.countryList = res.data || [];
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    // 供应商列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      supplierPageList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    openDetail(row) {
      this.adsPosition1 = deepClone(row);
      // this.filesList = row.filesList;
      this.customerNameNum = row.supplierName;
      this.dialogPostData.supplierBId = row.bid;
      this.getDialogDataList();
      this.detailModal = true;
    },
    // 沟通记录
    getDialogDataList() {
      listSupplierCommunicationApi(this.dialogPostData).then(res => {
        this.dialogDataList = res.data.list;
        // this.dialogPostData = res.data.list[0]
        this.dialogPostData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.dialogVisible = true;
      this.dialogType = type;
      if (type === 'edit') {
        this.adsPosition = deepClone(row);
        this.filesList = row.filesList;
        if (!this.isFirst) {
          this.$refs['commPlan'].setContent(this.adsPosition.commPlan);
          this.$refs['commRemarks'].setContent(this.adsPosition.commRemarks);
        }
      } else {
        this.adsPosition.supplierBId = row.supplierBId
        if (!this.isFirst) {
          this.$refs['commPlan'].setContent('');
          this.$refs['commRemarks'].setContent('');
        }
      }
      supplierPageList({ pageNum: 1, pageSize: 9999 }).then(res => {
        this.clientList = res.data.list
      });
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            // this.adsPosition.customerBId = this.$route.query.id;
            this.adsPosition.filesList = this.filesList;
            saveSupplierCommunicationApi(this.adsPosition).then(res => {
              this.$message.success(this.$t('customer.record.saveSuccess'));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.getDialogDataList()
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            this.adsPosition.filesList = this.filesList;
            updateSupplierCommunicationApi(this.adsPosition).then(res => {
              this.$message.success(this.$t('customer.record.update'));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.getDialogDataList()
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning(this.$t('customer.record.through'));
          return false;
        }
      });
    },
    addconfirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.adsPosition.customerBId = this.$route.query.id;
          this.addAdsPosition.filesList = this.filesList;
          saveSupplierCommunicationApi(this.addAdsPosition).then(res => {
            this.$message.success(this.$t('customer.record.saveSuccess'))
            this.$refs[formName].resetFields();
            // this.getDataList();
            this.getDialogDataList()
            this.addialogVisible = false;
          }).catch(err => {
            this.listLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning(this.$t('customer.record.through'));
          return false;
        }
      });
    },
    // 勾选触发 selects为选择的数据数组
    // getSelect(selects) {
    //   this.selectList = selects;
    // },
    // 删除接口
    // deleteListByIds(row) {
    //   this.$confirm('此操作将删除该沟通记录, 是否继续?', '提示', {
    // confirmButtonClass: 'el-button-confirmClass',
    // cancelButtonClass: 'el-button-cancelClass',
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     center: true
    //   }).then(() => {
    //     let obj = {
    //       id: row.id
    //     };
    //     deleteCustomerCommunication(obj).then(res => {
    //       if (res.status === 200) {
    //         this.$message.success('操作成功!');
    //       }
    //       this.getDataList();
    //     }).catch(err => {
    //       this.$message.error(err.message);
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消操作'
    //     });
    //   });
    // },
    // 新增协议
    addPactFileList() {
      if (!this.adsPosition.filesName) {
        return this.$message.warning(this.$t('customer.record.complete'));
      }
      // let currency = this.adsPosition.filesName[0];
      // for (let i = 0; i < this.filesList.length; i++) {
      //   if (currency.label === this.filesList[i].filesName) {
      //     return this.$message.error('该文件已存在')
      //   }
      // }
      this.filesList.push({ filesName: this.adsPosition.filesName, filesUrl: this.adsPosition.filesUrl });
      this.adsPosition.filesName = '';
      this.adsPosition.filesUrl = '';
      this.$refs.upload.clearFiles();
    },
    // 删除协议
    removeFile(scope) {
      this.filesList.splice(scope.$index, 1)
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.filesList.filesName = '';
      this.filesList.filesUrl = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.adsPosition.filesName = file.name;
      this.adsPosition.filesUrl = res.data.filePath;
      this.filesList.push({ filesName: this.adsPosition.filesName, filesUrl: this.adsPosition.filesUrl });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].filesName === file.name) {
          this.$message.error(this.$t('customer.record.repeat'));
          return false
        }
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: this.$t('customer.record.fileFormat'),
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: this.$t('customer.record.fileSize'),
          type: 'warning'
        });
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    },
    AddbeforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].filesName === file.name) {
          this.$message.error(this.$t('customer.record.repeat'));
          return false
        }
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: this.$t('customer.record.fileFormat'),
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: this.$t('customer.record.fileSize'),
          type: 'warning'
        });
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    },
    AddhandleSuccess(res, file, filename) {
      this.addAdsPosition.filesName = file.name;
      this.addAdsPosition.filesUrl = res.data.filePath;
      this.filesList.push({ filesName: this.addAdsPosition.filesName, filesUrl: this.addAdsPosition.filesUrl });
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .goutong-test {
    /*width: 90%;*/
    margin: 0 auto;
    overflow: auto;
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .item-label {
      .el-form-item__label {
        width: 68px !important;
      }
      .el-form-item__content {
        margin-left: 68px !important;
      }
    }
    .category-footer {
      text-align: center;
      margin: 20px 0;
      button {
        margin:  0 20px;
      }
    }
    .connectRecord {
      padding: 15px;
      .cusInfo {
        display: flex;
        display: -webkit-flex;
        background: white;
        padding: 20px;
        border: 1px solid $border-light-color;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        .cus-grade {
          width: 120px;
          text-align: center;
          .grade-img {
            width: 80px;
            height: 80px;
            margin: 20px auto;
            -webkit-border-radius: 5px;
            border-radius: 5px;
            overflow: hidden;
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .grade-text {
            color: #376FF6;
          }
        }
        .cus-detail {
          flex: 1;
          margin-left: 20px;
          position: relative;
          .cus-company {
            color: #505559;
          }
          .cus-main {
            display: flex;
            display: -webkit-flex;
            background: #F6F7FB;
            padding: 16px;
            font-size: 14px;
            -webkit-border-radius: 3px;
            border-radius: 3px;
            flex-wrap: wrap;
            >div {
              width: 25%;
              line-height: 2rem;
            }
          }
        }
      }
      .close-page {
        position: absolute;
        right: 20px;
        top: 8px;
      }
      .record-list {
        padding: 20px;
        margin-top: 20px;
        background: white;
        border: 1px solid $border-light-color;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        .search-top {
          -webkit-border-radius: 3px;
          border-radius: 3px;
          background: #CFD9DB;
          padding: 14px;
          display: -webkit-flex;
          display: flex;
          >div {
            display: inline-block;
          }
          .btn-right {
            flex: 1;
            text-align: right;
          }
          .svgClass {
            margin-right: 6px;
          }
        }
        .record-item-bg {
          background: #F6F7FB;
        }
        .record-item {
          .record-header {
            display: flex;
            display: -webkit-flex;
            position: relative;
            font-size: 14px;
            padding: 15px;
            line-height: 1.25rem;
            border-bottom: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            .record-date {
              color: #376FF6;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin: 0 20px;
            }
            .record-contact {
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin: 0 20px;
              color: #959998;
            }
          }
          .record-main {
            display: flex;
            display: -webkit-flex;
            padding-top: 24px;
            .record-left {
              width: 90px;
              padding: 10px;
              .cus-headerImg {
                margin: 0 auto;
                display: flex;
                display: -webkit-flex;
                width: 50px;
                height: 50px;
                background: #C7ECF2;
                -webkit-border-radius: 50px;
                border-radius: 50%;
                overflow: hidden;
                justify-content: center;
                align-items: center;
                img {
                  width: 100%;
                  height: 100%;
                }
                .svgClass {
                  color: #35BAC3;
                  font-size: 18px;
                }
              }
            }
            .record-file {
              margin-left: 16px;
              width: 280px;
              display: -webkit-flex;
              display: flex;
              flex-wrap: wrap;
              .file-item {
                font-size: 12px;
                margin: 0 10px;
                .fileSvg {
                  display: block;
                  margin: 5px auto;
                }
              }
            }
            .record-content {
              flex: 1;
              position: relative;
              padding-bottom: 30px;
              -webkit-border-radius: 3px;
              border-radius: 3px;
              .record-theme {
                cursor: pointer;
              }
              img {
                max-width: 100%;
              }
              .modal-hide {
                height: 100px;
                width: 100%;
                z-index: 150;
                position: absolute;
                bottom: 0;
                left: 0;
                background-image: -webkit-gradient(linear,left top, left bottom,from(rgba(255,255,255,0)),color-stop(70%, #fff));
                background-image: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 70%);
              }
              .click-text {
                position: absolute;
                text-align: center;
                color: #376FF6;
                cursor: pointer;
                width: 100%;
                bottom: 10px
              }
            }
            .hideClass {
              height: 200px;
              overflow: hidden;
            }
            .showClass {
              height: auto;
            }
          }
        }
      }
    }
  }
</style>

