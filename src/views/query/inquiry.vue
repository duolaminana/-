<template>
  <div class="app-container inquiry">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('inquiry.inquiryOrder.buyerName')">
            <el-input v-model.trim="postData.buyerName" clearable :placeholder="$t('inquiry.inquiryOrder.buyerName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.buyerCode')">
            <el-input v-model.trim="postData.buyerCode" clearable :placeholder="$t('inquiry.inquiryOrder.buyerCode')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.inquiryStatus')">
            <el-select v-model="postData.inquiryStatus" clearable :placeholder="$t('inquiry.inquiryOrder.inquiryStatus')" style="width: 150px">
              <el-option v-for="(item, index) in inquiryStatusList" :label="isZh ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('inquiry.inquiryOrder.inqueryNo')">
            <el-input v-model.trim="postData.inqueryNo" clearable :placeholder="$t('inquiry.inquiryOrder.inqueryNo')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.buyerCountryCode')" prop="buyerCountryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.buyerCountryCode" clearable :placeholder="$t('inquiry.inquiryOrder.countryCodeExplain')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
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
      <!--替用户新增报价单，之后删除-->
      <!--<el-button type="primary" size="small" @click="addInquiry">新增</el-button>-->
      <!--<el-button type="primary" size="small" @click="deleteListByIds()">删除</el-button>-->
      <el-button type="primary" size="small" class="export" @click="exportExcelByEasypoiFun()">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
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

      <el-table-column :label="$t('inquiry.inquiryOrder.inqueryNo2')" prop="inqueryNo" show-overflow-tooltip />

      <el-table-column :label="$t('inquiry.inquiryOrder.buyerAddress')" prop="buyerAddress" show-overflow-tooltip />

      <el-table-column align="center" width="100" :label="$t('inquiry.inquiryOrder.inquiryUserName')" prop="inquiryUserName" show-overflow-tooltip/>

      <el-table-column :label="$t('inquiry.inquiryOrder.countryPhone')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{language === 'zh' ?scope.row.cnCountryName :scope.row.enCountryName}}/{{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('inquiry.inquiryOrder.skuQuantity')" prop="skuQuantity"/>

      <el-table-column align="center" width="150" :label="$t('inquiry.inquiryOrder.inquiryTime')" prop="inquiryTime">
        <template slot-scope="scope">
          {{scope.row.inquiryTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="130" :label="$t('inquiry.inquiryOrder.inquiryStatus')" prop="inquiryStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.inquiryStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.inquiryStatus | inquiryStatusFmt(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh?'260px':'250px'" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="warning" size="mini" class="table-btn-width" v-if="row.inquiryStatus === 1 || row.inquiryStatus === 4" @click="openQuoted(row)">{{$t('query.tableLabel.offer')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.inquiryStatus === 1." @click="detailDialog(row ,true)">{{language === 'zh' ? '拒绝报价' : 'Reject'}}</el-button>
          <span v-if="row.inquiryStatus !== 0 && row.inquiryStatus !== 1 && row.inquiryStatus !== 4 && row.inquiryStatus !== 13 && row.inquiryStatus !== 14 && row.inquiryStatus !== 8">
            <el-button type="primary" v-if="row.quotedPriceList.length === 1" size="mini" style="margin-left: 10px" class="export" @click="detailQuoted(row.quotedPriceList[0].bid)">
              {{$t('query.tableLabel.CheckTheQuotation')}}</el-button>
            <el-dropdown size="mini" v-else type="primary" @command="detailQuoted">
              <el-button type="primary" size="mini" class="export" style="margin-left: 10px">{{$t('query.tableLabel.CheckTheQuotation')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in row.quotedPriceList" :command="item.bid" :key="index">{{$t('query.tableLabel.quotationNumber')}}：{{item.quotationNo}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailModal" :title="$t('inquiry.inquiryOrder.inquiryDetails')" center width="1000px">
      <el-form ref="editForm" :model="editForm" label-width="160px" size="small" class="edit-form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.inqueryNo')">
              {{editForm.inqueryNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.inquiryTime')">
              {{editForm.inquiryTime | timeFmt}}
            </el-form-item>
          </el-col>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="20%" style="min-width: 100px ; text-align: left">{{$t('inquiry.inquiryOrder.costomerBId')}}</td>
              <td width="80%" style="text-align: left">
                {{supplierName}}
              </td>
            </tr>
            <tr>
              <td width="20%" style="min-width: 100px;text-align: left">{{$t('inquiry.inquiryOrder.inquirerBId')}}</td>
              <td width="80%" style="text-align: left">
                {{contactName}}
              </td>
            </tr>
            <tr>
              <td style="text-align: left">{{$t('inquiry.inquiryOrder.buyerContactBy')}}</td>
              <td style="text-align: left">{{editForm.inquiryUserName}}</td>
            </tr>
            <tr>
              <td style="text-align: left">{{$t('inquiry.inquiryOrder.buyerTelephone')}}</td>
              <td style="text-align: left">{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td style="text-align: left">{{$t('inquiry.inquiryOrder.buyerEmail')}}</td>
              <td style="text-align: left">{{editForm.buyerEmail}}</td>
            </tr>
            <tr>
              <td style="text-align: left">{{$t('inquiry.inquiryOrder.buyerAddress2')}}</td>
              <td style="text-align: left">
                {{editForm.buyerAddress}}
              </td>
            </tr>
          </table>
          <!--<el-col :span="12">-->
            <!--<el-form-item :label="$t('inquiry.inquiryOrder.inquirerBId')" prop="inquirerBId">-->
              <!--&lt;!&ndash;<el-select v-model="editForm.inquirerBId" disabled class="edit-form-width">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
              <!--{{contactName}}-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="12">-->
            <!--<el-form-item :label="$t('inquiry.inquiryOrder.buyerAddress2')" prop="buyerAddress">-->
              <!--<el-input v-model="editForm.buyerAddress" readonly style="width: 200px" />-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="12">-->
            <!--<el-form-item :label="$t('inquiry.inquiryOrder.buyerTelephone')" prop="buyerTelephone">-->
              <!--<el-input v-model="editForm.buyerTelephone" readonly style="width: 200px" />-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="12">-->
            <!--<el-form-item :label="$t('inquiry.inquiryOrder.buyerContactBy')" prop="buyerContactBy">-->
              <!--<el-input v-model="editForm.buyerContactBy" readonly style="width: 200px" />-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="12">-->
            <!--<el-form-item :label="$t('inquiry.inquiryOrder.buyerEmail')" prop="buyerEmail">-->
              <!--<el-input v-model="editForm.buyerEmail" readonly style="width: 200px" />-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <div style="padding-bottom: 10px;" />
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="entrustTransportation">
              <el-select v-model="editForm.entrustTransportation" disabled class="edit-form-width">
                <el-option label="SGI" :value="0"></el-option>
                <el-option :label="$t('inquiry.inquiryOrder.SelfMention')" :value="1"></el-option>
              </el-select>
              <!--{{editForm.entrustTransportation === 0 ? 'SGI' : $t('inquiry.inquiryOrder.SelfMention')}}-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.transportationWay')" prop="transportationWay">
              <el-select v-model="editForm.transportationWay" disabled class="edit-form-width">
                <el-option v-for="(item, index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
              <!--{{editForm.transportationWay | transportTypeName(language)}}-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.departurePort')" prop="departurePort">
              <el-input v-model="editForm.departurePort" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.destinationPort')" prop="destinationPort">
              <el-input v-model="editForm.destinationPort" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.currency')" prop="currency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.currency" disabled style="width: 200px">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.dateOfDelivery')" prop="dateOfDelivery">
              {{$t('query.tableLabel.afterPayment')}}<el-input-number v-model.number="editForm.dateOfDelivery" class="input-center" style="width: 100px"/>{{$t('query.tableLabel.workingDays')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.paymentCondition')" prop="paymentCondition">
              <el-select v-model="editForm.paymentCondition" disabled style="width: 200px">
                <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentCondition" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('inquiry.inquiryOrder.paymentDefault')">
          <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
            <thead>
            <tr>
              <th>{{$t('inquiry.inquiryOrder.indexCode')}}</th>
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
                {{item.paymentRatio}}%
              </td>
              <td>
                {{item.dayNum}}{{$t('inquiry.inquiryOrder.day')}}
              </td>
            </tr>
            <tr v-if="!controlTowerList.length">
              <td colspan="4" style="text-align: center;padding: 5px">{{$t('common.noData')}}</td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
        <div class="table-top">
          <div class="top-title">{{$t('inquiry.inquiryOrder.inquiryPriceDetails')}}</div>
        </div>
        <el-table
          :data="editForm.inquiryPriceDetails"
          border
          fit
          show-summary
          size="small"
          min-height="520"
          style="font-size: 12px"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" type="index" :label="$t('inquiry.inquiryOrder.indexCode')" width="55"/>

          <!--<el-table-column align="center" min-width="285px" :label="$t('inquiry.inquiryOrder.productInformation')" prop="inqueryNo" >-->
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
          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.productName')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{language === 'zh' ? scope.row.cnProductName : scope.row.enProductName}}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.attrValueList')" show-overflow-tooltip >
            <template slot-scope="scope">
              {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.inquiryQuantity')" prop="inquiryQuantity" />

          <el-table-column align="center" width="200px" :label="$t('inquiry.inquiryOrder.inquiryRemark')" prop="inquiryRemark" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.inquiryRemark}}
            </template>
          </el-table-column>
        </el-table>
        <el-form-item/>
        <el-row>
          <el-col>
            <el-form-item :label="$t('inquiry.inquiryOrder.remarks')" prop="remarks">
              <el-input v-model="editForm.remarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" readonly style="width: 80%"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="isUnlabel" style="color: red; margin-left: 10%; font-size: 12px">{{isZh ? '拒绝的原因' : 'Reject Reasons'}}</div>
        <el-row style="margin-top: 10px;" v-if="isUnlabel">
          <el-col>
            <el-form-item prop="rejectReason">
              <el-input v-model="editForm.rejectReason " :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" style="width: 80%"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" v-if="isReiect" @click="Unlabel('editForm')">{{isZh ? '拒绝' : 'Reiect'}}</el-button>
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { uploadActionUrl } from '@/api/common'
// import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { detailInquiryPrice, pageInquiryPrice, deleteInquiryPriceByIds, exportByInquiryPriceExcel, updateInquiryOrderRefused } from '@/api/inquiry'
import { parseTime } from '@/utils/index'
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
    inquiryStatusFmt(val, language) {
      switch (Number(val)) {
        case 0: return language === 'zh' ? '编辑中' : 'Editing';
        case 1: return language === 'zh' ? '待报价' : 'To be quoted';
        case 2: return language === 'zh' ? '审批中' : 'In Approval';
        case 3: return language === 'zh' ? '已报价' : 'Quoted price';
        // case 4: return language === 'zh' ? '重新待报价' : 'To be quoted again';
        // case 5: return language === 'zh' ? '重新待审批' : 'Re-pending approval';
        // case 6: return language === 'zh' ? '已重新报价' : 'Requoted';
        // case 7: return language === 'zh' ? '废弃' : 'Discard';
        case 8: return language === 'zh' ? '拒绝报价' : 'Refusal of quotation';
        // case 9: return language === 'zh' ? '审批通过' : 'Approval and approval';
        case 10: return language === 'zh' ? '审批不通过' : 'Audit failed';
        // case 11: return language === 'zh' ? '重新审批通过' : 'Re-approval passed';
        // case 12: return language === 'zh' ? '重新审批不通过' : 'Re-approval does not pass';
        case 13: return language === 'zh' ? '报价中' : 'Quotation';
        // case 14: return language === 'zh' ? '重新报价中' : 'In the renewed offer';
        default:
          return language === 'zh' ? '数据异常' : 'Data abnormity';
      }
    },
    transportTypeName(val, language) {
      switch (Number(val)) {
        case 1: return language === 'zh' ? '汽运' : 'By Truck';
        case 2: return language === 'zh' ? '铁路' : 'By Train';
        case 3: return language === 'zh' ? '海运' : 'By ship';
        case 4: return language === 'zh' ? '空运' : 'By air';
      }
    }
  },
  data() {
    return {
      contactName: '',
      customerName: '',
      supplierName: '',
      orderType: 1,
      isReiect: false,
      isUnlabel: false,
      selectList: [],
      idsForm: {
        ids: ''
      },
      uploadActionUrl,
      dataList: [],
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      filesList: [],
      controlTowerList: [],
      listLoading: true,
      dialogVisible: false,
      detailModal: false,
      dialogType: '',
      editForm: {
        rejectReason: '',
        entrustTransportation: 0
      },
      // exportExcelForm: {
      //   pageNum: 1,
      //   pageSize: 10
      // },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        buyerName: '',
        buyerCode: '',
        buyerCountryCode: '',
        inquiryStatus: '',
        inquiryTime: '',
        startTime: '',
        endTime: '',
        inqueryNo: ''
      },
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
      inquiryTime: [],
      customerInfoList: [],
      modalList: [],
      rules: {
        rejectReason: [
          { required: true, message: this.$t('inquiry.inquiryOrder.rejectReason'), trigger: 'blur' }
        ]
      },
      inquiryStatusList: [
        // 状态：状态：0编辑中(预留，暂时不用)、1待报价、2审批中 3已报价、4重新待报价, 5重新审批中, 6重新报价完成、7废弃、 8、拒绝报价, 9 审核通过(预留，暂时不用),10 审核失败,11重新审核通过(预留，暂时不用), 12重新审核失败,13 报价中, 14 重新报价中(已拒绝改为重新报价中
        {
          labelZh: '全部',
          label: 'All',
          inquiryStatus: ''
        },
        {
          label: 'Editing',
          labelZh: '编辑中',
          inquiryStatus: 0
        },
        {
          label: 'To be quoted',
          labelZh: '待报价',
          inquiryStatus: 1
        },
        {
          label: 'In Approval',
          labelZh: '审批中',
          inquiryStatus: 2
        },
        {
          label: 'Quoted price',
          labelZh: '已报价',
          inquiryStatus: 3
        },
        // {
        //   label: 'To be quoted again',
        //   labelZh: '重新待报价',
        //   inquiryStatus: 4
        // },
        // {
        //   label: 'Re-pending approval',
        //   labelZh: '重新审批中',
        //   inquiryStatus: 5
        // },
        // {
        //   label: 'Requoted',
        //   labelZh: '已重新报价',
        //   inquiryStatus: 6
        // },
        // {
        //   label: 'Discard',
        //   labelZh: '废弃',
        //   inquiryStatus: 7
        // },
        {
          label: 'Refusal of quotation',
          labelZh: '拒绝报价',
          inquiryStatus: 8
        },
        // {
        //   label: 'Approval and approval',
        //   labelZh: '审批通过',
        //   inquiryStatus: 9
        // },
        {
          label: 'Audit failed',
          labelZh: '审批不通过',
          inquiryStatus: 10
        },
        // {
        //   label: 'Re-approval passed',
        //   labelZh: '重新审批通过',
        //   inquiryStatus: 11
        // },
        // {
        //   label: 'Re-approval does not pass',
        //   labelZh: '重新审批不通过',
        //   inquiryStatus: 12
        // },
        {
          label: 'Quotation',
          labelZh: '报价中',
          inquiryStatus: 13
        }
        // {
        //   label: 'In the renewed offer',
        //   labelZh: '重新报价中',
        //   inquiryStatus: 14
        // }
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
      paymentMethodList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
        {
          label: 'T/T',
          paymentCondition: '1'
        },
        {
          label: 'L/C',
          paymentCondition: '2'
        },
        {
          label: 'P/A',
          paymentCondition: '3'
        },
        {
          label: 'D/A',
          paymentCondition: '4'
        }
      ],
      portList: [
        {
          portName: '港口1',
          bid: '1'
        },
        {
          portName: '港口2',
          bid: '2'
        },
        {
          portName: '港口3',
          bid: '3'
        },
        {
          portName: '港口4',
          bid: '4'
        }
      ]
    }
  },
  computed: {
    transportList() {
      return this.$store.state.order.transportList
    }
  },
  created() {
    this.getDataList();
    // this.getCustomerInfoListFun()
  },
  watch: {
    // 'editForm.costomerBId' (val, oldVal) {
    //   if (val && !oldVal) {
    //     this.customerContactFun(val);
    //   } else if (val && oldVal) {
    //     this.customerContactFun(val);
    //     this.editForm.inquirerBId = ''
    //   }
    // }
  },
  methods: {
    addInquiry() {
      this.$router.push('/query/addInquiry')
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
      if (this.$route.query.customBid) {
        obj.costomerBId = this.$route.query.customBid
      }
      if (this.$route.query.supplierBId) {
        obj.supplierBId = this.$route.query.supplierBId
      }
      pageInquiryPrice(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    detailDialog(row, type) {
      detailInquiryPrice({ inquiryPriceBId: row.bid }).then(res => {
        if (row.costomerBId) {
          this.supplierName = res.data.customerInfoVo.companyName || "";
          this.contactName = res.data.customerInfoVo.customerContactList[0].contactName || ""
        }
        if (row.supplierBId) {
          this.supplierName = res.data.supplierInfo.supplierName || "";
          this.contactName = res.data.supplierInfo.supplierContactList[0].contactName || ""
        }
        this.isUnlabel = true;
        if (!type) {
          this.isReiect = false
          this.editForm.rejectReason = res.data.rejectReason
        } else {
          this.isReiect = true
          this.editForm.rejectReason = ''
        }
        this.detailModal = true;
        this.editForm = res.data;
        this.editForm.buyerEmail = res.data.buyerEmail;
        this.editForm.buyerContactBy = res.data.buyerContactBy;
        this.editForm.buyerTelephone = res.data.buyerTelephone;
        this.editForm.buyerAddress = res.data.buyerAddress;
        this.filesList = res.data.inquiryPriceDetails;
        this.controlTowerList = res.data.inquiryOrderPayNodeList || [];
      }).catch(err => {
        this.$message.error(err.message);
      })
      // this.editForm = deepClone(row);
      // this.filesList = row.filesList;
      this.isUnlabel = false
    },
    Unlabel(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          updateInquiryOrderRefused({
            id: this.editForm.id,
            rejectReason: this.editForm.rejectReason
          }).then(res => {
            this.detailModal = false;
            this.getDataList();
          })
        }
      })
    },
    // 报价按钮
    openQuoted(row) {
      this.$router.push({
        path: '/query/editInquiry',
        query: {
          inquiryId: row.bid,
          orderType: row.orderType
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
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
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
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    // 删除协议
    removeFile(scope) {
      this.filesList.splice(scope.$index, 1)
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.editForm.customFileName = '';
      this.editForm.customFilePath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.editForm.customFileName = file.name;
      this.editForm.customFilePath = res.data.filePath;
      this.filesList.push({ customFileName: this.editForm.customFileName, customFilePath: this.editForm.customFilePath });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].customFileName === file.name) {
          let msg = (this.language === 'zh' ? '已有文件不能重复上传' : 'Existing files cannot be uploaded repeatedly')
          this.$message.error(msg);
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
        let msg1 = (this.language === 'zh' ? '上传文件只能是 PDF、doc、docx格式!' : 'Upload files can only be in PDF, doc, docx format!')
        this.$message({
          message: msg1,
          type: 'warning'
        });
      }
      if (!isLt2M) {
        let msg2 = (this.language === 'zh' ? '上传文件大小不能超过 10MB!' : 'Upload file size should not exceed 10MB!')
        this.$message({
          message: msg2,
          type: 'warning'
        });
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    },
    deleteListByIds() {
      if (!this.selectList.length) {
        let msg3 = (this.language === 'zh' ? '请选择数据' : 'Please select data')
        return this.$message.warning(msg3);
      }
      for (let i = 0; i < this.selectList.length; i++) {
        let msg4 = (this.language === 'zh' ? '只能删除编辑中的数据' : 'Only data in editing can be deleted')
        if (this.selectList[i].inquiryStatus !== 0) {
          return this.$message.warning(msg4)
        }
      }
      let msg5 = (this.language === 'zh' ? '是否确定删除?' : 'Are you sure you want to delete it?')
      let msg6 = (this.language === 'zh' ? '提示' : 'Tips')
      let msg7 = (this.language === 'zh' ? '确定' : 'Delete')
      let msg8 = (this.language === 'zh' ? '取消' : 'Cancel')
      this.$confirm(msg5, msg6, {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: msg7,
        cancelButtonText: msg8,
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteInquiryPriceByIds(formData).then(res => {
          if (res.status === 200) {
            let msg9 = (this.language === 'zh' ? '操作成功!' : 'Successful operation!')
            this.$message.success(msg9);
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message.error(this.$t("system.userManage.cancel"));
      });
    },
    // 导出操作
    exportExcelByEasypoiFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        buyerName: this.postData.buyerName,
        buyerCode: this.postData.buyerCode,
        buyerCountryCode: this.postData.buyerCountryCode,
        inquiryStatus: this.postData.inquiryStatus,
        inquiryTime: this.postData.inquiryTime,
        startTime: this.postData.startTime,
        endTime: this.postData.endTime,
        inqueryNo: this.postData.inqueryNo
      };
      exportByInquiryPriceExcel(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'inquiry.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .inquiry {
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
    .deliveryDate-input {
      width: 60px;
      input {
        text-align: center;
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
  }
</style>
