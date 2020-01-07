<template>
  <div class="app-container inquiry">
    <div class="topBtns">
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

      <el-table-column :label="$t('inquiry.inquiryOrder.inqueryNo')" prop="inqueryNo" show-overflow-tooltip />

      <!--<el-table-column width="100" :label="$t('inquiry.inquiryOrder.buyerAddress')" prop="buyerAddress" show-overflow-tooltip />-->

      <el-table-column width="120" :label="$t('inquiry.inquiryOrder.countryPhone')" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--{{language === 'zh' ?scope.row.cnCountryName :scope.row.enCountryName}}/-->
          {{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('inquiry.inquiryOrder.skuQuantity')" prop="skuQuantity"/>

      <el-table-column align="center" width="100" :label="$t('inquiry.inquiryOrder.inquiryUserName')" prop="inquiryUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('query.tableLabel.InquiryTime')" prop="inquiryTime">
        <template slot-scope="scope">
          {{scope.row.inquiryTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="130" :label="$t('inquiry.inquiryOrder.inquiryStatus')" prop="inquiryStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.inquiryStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.inquiryStatus | inquiryStatusFmt(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="110" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px;text-align:right;cursor:pointer">
      <span @click="toMore">{{$t('common.more')}}>></span>
    </div>
    <!-- <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination> -->

    <el-dialog :visible.sync="detailModal" :title="$t('inquiry.inquiryOrder.inquiryDetails')" center width="900px" append-to-body>
      <el-form ref="editForm" :model="editForm" label-width="120px" size="small" class="edit-form">
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
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.costomerBId')" prop="costomerBId">
              <el-select v-model="editForm.costomerBId" disabled :placeholder="$t('query.placeholder.userCompany')" class="edit-form-width">
                <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.inquirerBId')" prop="inquirerBId">
              <el-select v-model="editForm.inquirerBId" disabled :placeholder="$t('query.placeholder.buyType')" class="edit-form-width">
                <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerAddress2')" prop="buyerAddress">
              <el-input v-model="editForm.buyerAddress" readonly :placeholder="$t('query.placeholder.address')" class="edit-form-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerTelephone')" prop="buyerTelephone">
              <el-input v-model="editForm.buyerTelephone" readonly :placeholder="$t('query.placeholder.phone')" class="edit-form-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerContactBy')" prop="buyerContactBy">
              <el-input v-model="editForm.buyerContactBy" readonly :placeholder="$t('query.placeholder.buyerContact')" class="edit-form-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerEmail')" prop="buyerEmail">
              <el-input v-model="editForm.buyerEmail" readonly :placeholder="$t('query.placeholder.buyerContact')" class="edit-form-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="entrustTransportation">
              {{editForm.entrustTransportation === 0 ? 'SGI' : $t('inquiry.inquiryOrder.SelfMention')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.transportationWay')" prop="transportationWay">
              {{editForm.transportationWay | transportTypeName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.departurePort')" prop="departurePort">
              <el-input v-model="editForm.departurePort" readonly class="edit-form-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.destinationPort')" prop="destinationPort">
              <el-input v-model="editForm.destinationPort" readonly class="edit-form-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.currency')" prop="currency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.currency" disabled :placeholder="$t('query.placeholder.currency')" class="edit-form-width">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.dateOfDelivery')" prop="dateOfDelivery">
              {{$t('query.tableLabel.afterPayment')}}<el-input-number v-model.number="editForm.dateOfDelivery" readonly class="input-center" style="width: 100px"/>{{$t('query.tableLabel.workingDays')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.paymentCondition')" prop="paymentCondition">
              <el-select v-model="editForm.paymentCondition" disabled :placeholder="$t('query.placeholder.payModeArr')" class="edit-form-width">
                <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentCondition" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('inquiry.inquiryOrder.paymentDefault')" class="inquiry">
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
              {{isZh?scope.row.cnProductName:scope.row.enProductName}}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.attrValueList')" show-overflow-tooltip >
            <template slot-scope="scope">
              {{isZh?scope.row.cnAttrValueList:scope.row.enAttrValueList}}
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { uploadActionUrl } from '@/api/common'
import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { detailInquiryPrice, pageInquiryPrice, deleteInquiryPriceByIds, exportExcelByEasypoiApi } from '@/api/inquiry'
import { parseTime } from '@/utils/index'
export default {
  props: { customBid: { type: String, default: '' }, supplierBId: { type: String, default: '' }},
  components: {
    // Pagination
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
        case 4: return language === 'zh' ? '重新待报价' : 'To be quoted again';
        case 5: return language === 'zh' ? '重新待审批' : 'Re-pending approval';
        case 6: return language === 'zh' ? '已重新报价' : 'Requoted';
        case 7: return language === 'zh' ? '废弃' : 'Discard';
        case 8: return language === 'zh' ? '拒绝报价' : 'Refusal of quotation';
        case 9: return language === 'zh' ? '审批通过' : 'Approval and approval';
        case 10: return language === 'zh' ? '审批不通过' : 'Audit failed';
        case 11: return language === 'zh' ? '重新审批通过' : 'Re-approval passed';
        case 12: return language === 'zh' ? '重新审批不通过' : 'Re-approval does not pass';
        case 13: return language === 'zh' ? '报价中' : 'Quotation';
        case 14: return language === 'zh' ? '重新报价中' : 'In the renewed offer';
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
      editForm: {},
      // exportExcelForm: {
      //   pageNum: 1,
      //   pageSize: 10
      // },
      postData: {
        pageNum: 1,
        pageSize: 5,
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
      inquiryTime: [],
      customerInfoList: [],
      modalList: [],
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
      ]
    }
  },
  created() {
    this.getDataList();
    this.getCustomerInfoListFun()
  },
  watch: {
    'editForm.costomerBId' (val, oldVal) {
      if (val && !oldVal) {
        this.customerContactFun(val);
      } else if (val && oldVal) {
        this.customerContactFun(val);
        this.editForm.inquirerBId = ''
      }
    }
  },
  methods: {
    toMore() {
      let obj = {}
      if (this.customBid) {
        obj = { customerBId: this.customerBId }
      }
      if (this.supplierBId) {
        obj = { supplierBId: this.supplierBId }
      }
      this.$router.push({
        path: '/query/inquiry', query: obj })
    },
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
      if (this.customBid) {
        obj.costomerBId = this.customBid
      }
      if (this.supplierBId) {
        obj.supplierBId = this.supplierBId
      }
      pageInquiryPrice(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message(err.message);
      });
    },
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      listCustomerContact({ customerBId: val }).then(res => {
        this.modalList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查看详情
    detailDialog(row) {
      detailInquiryPrice({ inquiryPriceBId: row.bid }).then(res => {
        this.detailModal = true;
        this.editForm = res.data;
        this.filesList = res.data.inquiryPriceDetails;
        this.controlTowerList = res.data.inquiryOrderPayNodeList || [];
      }).catch(err => {
        this.$message.error(err.message);
      })
      // this.editForm = deepClone(row);
      // this.filesList = row.filesList;
    },
    // 报价按钮
    openQuoted(row) {
      this.$router.push({
        path: '/query/editInquiry',
        query: {
          inquiryId: row.bid
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
        return this.$message(msg3);
      }
      for (let i = 0; i < this.selectList.length; i++) {
        let msg4 = (this.language === 'zh' ? '只能删除编辑中的数据' : 'Only data in editing can be deleted')
        if (this.selectList[i].inquiryStatus !== 0) {
          return this.$message.warning(msg4)
        }
      }
      this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
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
            this.$message.success(this.$t('query.formMessage.SuccessfulOperation'));
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
    // 导出操作
    exportExcelByEasypoiFun() {
      exportExcelByEasypoiApi().then(res => {
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
