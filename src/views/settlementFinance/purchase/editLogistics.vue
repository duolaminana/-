<template>
  <div class="app-container editPayRecord" id="printDiv">
    <div class="edit-title">{{$t('settlementFinance.purchase.applyLogisticsPayment')}}</div>
    <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" class="edit-form">
     <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.purchase.logisticsInFormation')}}</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.logisticsOrderNo')}}</td>
              <td width="60%">
                {{detailForm.logisticsOrderDetail.logisticsOrderNo}}
              </td>
            </tr>
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.orderNo')}}</td>
              <td width="60%" ref="orderNoWidthBox">
                <el-tooltip class="item" effect="dark" :content="detailForm.logisticsOrderDetail.orderNo" placement="top-start">
                  <div style="width:100%;height:24px;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;" :style="{width:orderNoWidth+'px'}">{{detailForm.logisticsOrderDetail.orderNo}}</div>
                </el-tooltip>
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.method')}}</td><td>{{detailForm.logisticsOrderDetail.transportationMethod | transportationFt(language) }}</td>
            </tr>
            <tr>
              <td>{{$t('query.tableLabel.DeparturePort')}}</td><td>{{detailForm.logisticsOrderDetail.departurePortAdd}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.ETD')}}</td><td>{{detailForm.logisticsOrderDetail.etd | timeFmt}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="11">
          <div class="row-label" style="height:32px;width:100%"></div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.orderDate')}}</td>
              <td width="60%">
                {{detailForm.logisticsOrderDetail.logisticsOrderDate | timeFmt}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.shipper')}}</td><td>{{companyName}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.destination')}}</td><td>{{detailForm.logisticsOrderDetail.destinationPortAdd}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.ETA')}}</td><td>{{detailForm.logisticsOrderDetail.eta | timeFmt}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.purchase.clientInformation')}}</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.clientName')}}</td>
              <td width="60%">
                {{detailForm.logisticsOrderDetail.supplierInfo.supplierName}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.shortName')}}</td><td>{{detailForm.logisticsOrderDetail.supplierInfo.shortName}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.contactName')}}</td><td>{{detailForm.logisticsOrderDetail.supplierInfo.concatName}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.contactNo')}}</td><td>{{detailForm.logisticsOrderDetail.supplierInfo.mobilePhone}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.address')}}</td><td>{{detailForm.logisticsOrderDetail.supplierInfo.registerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.country')}}</td><td>{{detailForm.logisticsOrderDetail.supplierInfo.countryCode}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.purchase.accountInformation')}}</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <!-- <tr>
              <td width="40%">账号名称</td>
              <td width="60%">
                {{detailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount.sellerName}}
              </td>
            </tr> -->
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.bankName')}}</td>
              <td width="60%">
                {{supplierBank ? supplierBank.bankAddress :''}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.branchName')}}</td>
              <td>
                {{supplierBank ? supplierBank.branchName :''}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.accountName')}}</td>
              <td>
                {{supplierBank ? supplierBank.bankAccount :''}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.branchAddress')}}</td>
              <td>
                {{supplierBank ? supplierBank.bankAddress :''}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.swiftCode')}}</td>
              <td>
                {{supplierBank ? supplierBank.swiftCode :''}}
              </td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">{{$t('settlementFinance.purchase.applyInformation')}}</div>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.orderAmount')">
            {{detailForm.logisticsOrderDetail.logisticsOrderAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.orderCurrency')">
            {{detailForm.logisticsOrderDetail.paymentCurrency}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.pendingCollection')">
            {{detailForm.pendingPayment | moneyFmt}}
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="申请付款">-->
            <!--{{detailForm.applyPaymentAmount | moneyFmt}}-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.collectionDate')">
            {{detailForm.applyPaymentDate | timeFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.collectionMoney')">
            {{detailForm.applyPaymentAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="detailForm.remark"></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">{{$t('query.tableLabel.AppendixUpload')}}</div>
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
              <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <div class="topBtns">
            <div class="row-label">{{$t('settlementFinance.purchase.paymentRecord')}}</div>
            <el-button type="primary" size="small" @click="openDialog('add')" v-if="$route.query.isApply==2">{{$t('system.role.add')}}</el-button>
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

            <el-table-column align="center" :label="$t('settlementFinance.purchase.paymentTime')" prop="paymentTime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.paymentTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('settlementFinance.purchase.curency')" prop="paymentCurrency" show-overflow-tooltip/>

            <el-table-column align="center" :label="$t('settlementFinance.purchase.amount')" prop="paymentAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.paymentAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('settlementFinance.purchase.supportingFile')" prop="fileName" show-overflow-tooltip/>

            <!-- <el-table-column align="center" label="备注" prop="collectionRemark" show-overflow-tooltip/> -->

            <el-table-column align="center" :label="$t('system.role.operation')" width="150" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row)">详情</el-button> -->
                <el-button type="primary" size="mini" @click="openDialog('edit', scope.row)" v-if="$route.query.isApply==2">{{$t('system.userManage.editUser')}}</el-button>
                <!-- <a :href="scope.row.paymentDocList[0].attachmentPath" :download="scope.row.paymentDocList[0].attachmentName">下载</a> -->
                <el-button type="primary" v-if="scope.row.paymentDocList.length == 1" size="mini" @click="exportfile(scope.row.paymentDocList[0])">{{$t('settlementFinance.purchase.download')}}</el-button>
                <el-dropdown @command="exportfile" v-else-if="scope.row.paymentDocList.length > 1">
                  <el-button type="primary" size="mini">
                    {{$t('settlementFinance.sale.ViewFile')}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in scope.row.paymentDocList" :command="item" :key="index">{{item.attachmentName}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <ApprovalFlow @close="closePage" v-if="$route.query.isApply === undefined"></ApprovalFlow>
      <el-form-item style="text-align: center;margin-top: 20px" v-else>
        <!--<el-button type="primary" size="small" @click="applyPrint" v-if="$route.query.isApply==0">打印</el-button>-->
        <el-button type="primary" size="small" @click="applyLogistics" v-if="$route.query.isApply==1">{{$t('settlementFinance.purchase.apply')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('system.role.return')}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType=== 'add' ? $t('settlementFinance.purchase.addPayment') : $t('settlementFinance.purchase.editPayment')" width="500px" center close-on-click-modal @close="clearData">
      <el-form ref="addForm" :model="addForm" label-width="120px" label-position="right" size="small" :rules="addFormRules">
        <el-form-item :label="$t('settlementFinance.purchase.paymentTime')" prop="paymentTime">
          <el-date-picker type="datetime" v-model="addForm.paymentTime" style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.orderCurrency')" prop="paymentCurrency">
          <el-select
            style="width: 100%"
            filterable
            remote
            :remote-method="getCurrencyCodeList"
            :loading="loading1"
            disabled
            v-model="addForm.paymentCurrency">
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.paymentAmount')" prop="paymentAmount">
          <el-input v-model.number="addForm.paymentAmount" type="number" clearable />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="collectionRemark">
          <el-input v-model="addForm.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 100%"/>
        </el-form-item> -->
        <el-form-item :label="$t('settlementFinance.purchase.supportingFile')" prop="component">
          <el-upload
            ref="upload"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :data="{type: 2}"
            :on-remove="handleRemove"
            :on-preview="detailComponent"
            :before-remove="beforeRemove"
            :limit="5"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">{{$t('settlementFinance.sale.uploadfiles')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('settlementFinance.sale.paymentAttachment')}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="savePayRecord('addForm')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('settlementFinance.purchase.paymentRecordDetail')" width="500px" center close-on-click-modal>
      <el-form :model="addFormDetail" label-width="120px" label-position="right" size="small">
        <el-form-item :label="$t('settlementFinance.purchase.paymentTime')" prop="paymentTime">
          <el-date-picker type="datetime" v-model="addFormDetail.paymentTime" disabled style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.orderCurrency')" prop="paymentCurrency">
          <el-select
            style="width: 100%"
            filterable
            remote
            :remote-method="getCurrencyCodeList"
            :loading="loading1"
            v-model="addFormDetail.paymentCurrency"
            disabled>
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.paymentAmount')" prop="paymentAmount">
          <el-input v-model.number="addFormDetail.paymentAmount" type="number" disabled clearable />
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.remark')" prop="collectionRemark">
          <el-input v-model="addFormDetail.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" readonly style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.supportingFile')" prop="component">
          <el-table
            :data="fileList"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column align="center" :label="$t('settlementFinance.sale.fileName')" prop="attachmentName" >
              <template slot-scope="scope">
                <a href="javascript: void (0)" @click="downFile(item.attachmentPath)">{{scope.row.attachmentName}}</a>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('system.role.operation')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('system.role.view')}}</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import OrderStep from '@/components/OrderStep'
import ApprovalFlow from '@/components/ApprovalFlow'
import { selectCurrencyCodeListApi, getSupplyCompanyList } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerBank, getCustomerInfoByBId } from '@/api/customer'
import { detailPaymentDataApi, addPaymentRecord, updatePaymentsRecord, submitApproval } from '@/api/finance'
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    ApprovalFlow
  },
  mixins: [moneyFmt],
  data() {
    return {
      companyName: '',
      uploadActionUrl,
      dialogVisible: false,
      dialogVisible1: false,
      loading1: false,
      confirmLoading: false,
      dialogType: '',
      nodeActive: 0,
      customInfo: {},
      supplierBank: {},
      detailForm: {
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: '',
        coolectionAmount: '',
        paidAmount: '',
        logisticsOrderDetail: { supplierInfo: { supplierBankAccount: {}}},
        lastPaymentTime: ''
      },
      customerInfoList: [],
      recRecordList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      customerBankList: [],
      sysBankList: [],
      currencyCodeList: [],
      fileList: [],
      orderNoWidth: 0,
      payFileList: [],
      addForm: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        collectionRemark: '',
        paymentDocList: []
      },
      addFormDetail: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        collectionRemark: ''
      },
      addFormRules: {
        paymentTime: [{ required: true, message: this.$t('settlementFinance.purchase.inputDate'), trigger: 'change' }],
        paymentAmount: [{ type: 'number', required: true, message: this.$t('settlementFinance.purchase.inputAmount'), trigger: 'blur' }]
      }
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getSaleOrderDetail();
    this.getCurrencyCodeList()
  },
  mounted() {
    this.$nextTick(() => {
      this.orderNoWidth = this.$refs.orderNoWidthBox.offsetWidth - 10
    })
  },
  methods: {
    // 查看附件
    applyPrint() {
      let newstr = document.getElementById('printDiv').innerHTML;
      document.body.innerHTML = newstr;
      window.print();
      this.$router.go(0)
      return false;
    },
    applyLogistics() {
      submitApproval({ bid: this.detailForm.bid }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.closePage()
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    exportfile(row) {
      this.downFile(row.attachmentPath)
    },
    exportPactFile(row) {
      this.downFile(row.attachmentPath)
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/settlementFinance/payment/purchaseOrder'
        })
      })
    },
    clearData() {
      this.addForm.id = '';
      this.addForm.paymentTime = '';
      this.addForm.paymentAmount = '';
      this.addForm.collectionRemark = '';
      this.addForm.paymentDocList = [];
      this.fileList = [];
    },
    // 获取客户银行列表
    getCustomerBankList(id, bankId) {
      listCustomerBank({ customerBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.customerBankList = res.data.list || [];
        // let obj = this.customerBankList.filter(e => {
        //   return e.id === bankId
        // })[0];
        // this.detailForm.buyerBankAddress = obj.bankAddress;
        // this.detailForm.buyerBranchName = obj.branchName;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.clearData();
      this.dialogVisible = true;
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = Object.assign(this.addForm, row);
        this.fileList = this.addForm.paymentDocList.map(e => {
          e.url = e.attachmentPath;
          e.name = e.attachmentName;
          return { ...e }
        })
      } else {
        this.fileList = []
        this.addForm.paymentDocList = []
      }
    },
    openDetail(row) {
      this.dialogVisible1 = true;
      this.addFormDetail = Object.assign(this.addForm, row);
      this.fileList = this.addFormDetail.paymentDocList.map(e => {
        e.url = e.attachmentPath;
        e.name = e.attachmentName;
        return { ...e }
      })
    },
    handleRemove(file, fileList) {
      // this.payFileList = [];
      this.payFileList = fileList.map(e => {
        e.attachmentName = e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath
        e.attachmentUuid = e.attachmentUuid || e.response.data.UUID;
        return { ... e }
      })
    },
    detailComponent(file) {
      this.downFile(file.attachmentPath)
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('settlementFinance.purchase.maxFive'));
    },
    beforeRemove(file, fileList) {
      return this.$confirm(this.$t("system.userManage.whether"));
    },
    handleSuccess(res, file, fileList) {
      this.payFileList = fileList.map(e => {
        e.attachmentName = e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath
        e.attachmentUuid = e.attachmentUuid || e.response.data.UUID;
        return { ... e }
      })
    },
    // 客户列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun(id) {
      getSupplyCompanyList().then(res => {
        this.sysCustomerInfoList = res.data || []
        if (id) {
          let obj = this.sysCustomerInfoList.filter(e => e.bid === id)[0];
          this.companyName = obj.companyName
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    savePayRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.dialogType === 'add' ? addPaymentRecord : updatePaymentsRecord;
          this.addForm.paymentDocList = this.payFileList.length ? this.payFileList : this.addForm.paymentDocList;
          // this.addForm.salesOrderBId = this.detailForm.logisticsOrderDetail.supplierInfo.bid;
          this.addForm.nodeType = 2;
          this.addForm.paymentOrderType = 2
          this.addForm.paymentInstructNo = this.$route.query.paymentInstructNo
          this.addForm.paymentAssociatedOrders = this.detailForm.logisticsOrderDetail.logisticsOrderNo
          this.addForm.associatedOrderBId = this.detailForm.logisticsOrderDetail.bid
          this.addForm.customerBId = this.detailForm.logisticsOrderDetail.supplierInfo.bid
          api(this.addForm).then(res => {
            this.$message.success(this.dialogType === 'add' ? this.$t("system.userManage.handle") : this.$t("system.userManage.handle"));
            this.fileList = [];
            this.addForm.paymentDocList = []
            this.$refs.upload.clearFiles();
            this.dialogVisible = false;
            this.getSaleOrderDetail();
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning(this.$t('customer.customerList.complete'))
        }
      });
    },
    // 获取物流表格信息
    getSaleOrderDetail() {
      detailPaymentDataApi({ bid: this.$route.query.id, type: this.$route.query.type }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.supplierBank = this.detailForm.logisticsOrderDetail.supplierInfo.supplierBankAccount;
        this.addForm.paymentCurrency = this.detailForm.logisticsOrderDetail.paymentCurrency;
        this.recRecordList = (res.data.paymentRecordVoList || []).map(e => {
          e.fileName = e.paymentDocList.map(e => e.attachmentName).join(',');
          return { ...e }
        })
        this.getCustomerBankList(this.detailForm.customerBId, this.detailForm.buyerBankId);
        this.getCustomerInfo(this.detailForm.logisticsOrderDetail.customerBasicInfoBId)
        this.getSysCustomerInfoListFun(this.detailForm.logisticsOrderDetail.companyInfoBId)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取客户信息
    getCustomerInfo(bid) {
      getCustomerInfoByBId({ bid: bid }).then(res => {
        this.customInfo = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    transportationFt(val, language) {
      let transportation = ''
      switch (Number(val)) {
        case 1:
          transportation = language === 'zh' ? '汽运' : 'By Truck'
          break;
        case 2:
          transportation = language === 'zh' ? '铁路' : 'By Train'
          break;
        case 3:
          transportation = language === 'zh' ? '海运' : 'By Ship'
          break;
        case 4:
          transportation = language === 'zh' ? '空运' : 'By Air'
          break;
      }
      return transportation
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editPayRecord {
    width: 80%;
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
    .row-item {
      padding: 16px 0;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .row-label {
      float: left;
      line-height: 32px;
      font-weight: bold;
    }
  }
</style>
