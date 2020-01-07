<template>
  <div class="app-container editPayRecord">
    <div class="edit-title">{{$t('settlementFinance.purchase.recordList')}}</div>
    <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" class="edit-form">
      <el-row class="row-item">
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.PurchaseOrderNo')">
            {{detailForm.purchaseOrder.purchaseNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.orderDate')" label-width="80">
            {{detailForm.purchaseOrder.createTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <el-form-item :label="$t('settlementFinance.purchase.paymentProcess')">
            <order-step :list="allNodeList" :active="nodeActive"></order-step>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.purchase.clientInformation')}}</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.clientName')}}</td>
              <td width="60%">
                {{detailForm.purchaseOrder.sellerName}}
              </td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.shortName')}}</td><td>{{detailForm.purchaseOrder.sellerShort}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.contactName')}}</td><td>{{detailForm.purchaseOrder.sellerContact}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.contactNo')}}</td><td>{{detailForm.purchaseOrder.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.address')}}</td><td>{{detailForm.purchaseOrder.sellerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.country')}}</td><td>{{detailForm.purchaseOrder.sellerCountryCode}}</td>
            </tr>
            <!-- <tr>
              <td>银行账号</td><td>{{detailForm.buyerBankAccount}}</td>
            </tr> -->
            <!-- <tr>
              <td>SWIF编码</td><td>{{detailForm.buyerSwiftcode}}</td>
            </tr>
            <tr>
              <td>目的港口</td><td>{{detailForm.arrivePort}}</td>
            </tr> -->
          </table>
        </el-col>
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.purchase.receiver')}}</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <!-- <tr>
              <td width="40%">账号名称</td>
              <td width="60%">
                {{detailForm.purchaseOrder.sellerName}}
              </td>
            </tr> -->
            <tr>
              <td width="40%">{{$t('settlementFinance.purchase.bankName')}}</td>
              <td width="60%">
                {{detailForm.purchaseOrder.sellerBank}}
              </td>
            </tr>
            <!-- <tr>
              <td>国家</td><td>{{detailForm.sellerCountryCode}}</td>
            </tr> -->
            <!-- <tr>
              <td>银行名称</td><td>{{detailForm.purchaseOrder.sellerBank}}</td>
            </tr> -->
            <!-- <tr>
              <td>支行名称</td><td>{{detailForm.purchaseOrder.sellerBranchName}}</td>
            </tr> -->
            <!-- <tr>
              <td>支行地址</td><td>{{detailForm.purchaseOrder.sellerBankAddress}}</td>
            </tr> -->
            <tr>
              <td>{{$t('settlementFinance.purchase.accountName')}}</td><td>{{detailForm.purchaseOrder.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('settlementFinance.purchase.swiftCode')}}</td><td>{{detailForm.purchaseOrder.sellerSwifcode}}</td>
            </tr>
            <!-- <tr>
              <td>出发港口</td><td>{{detailForm.departurePort}}</td>
            </tr> -->
          </table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">{{$t('settlementFinance.purchase.collection')}}</div>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.orderAmount')">
            {{detailForm.purchaseOrder.totalAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.orderCurrency')">
            {{detailForm.purchaseOrder.orderCurrency}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.purchase.pendingCollection')">
            {{detailForm.pendingPayment | moneyFmt}}
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="申请金额">-->
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
        <el-button type="primary" size="small" @click="applyLogistics" v-if="$route.query.isApply==1">{{$t('settlementFinance.purchase.apply')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('system.role.return')}}</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType=== 'add' ? $t('settlementFinance.purchase.addPayment') : $t('settlementFinance.purchase.editPayment')" width="500px" center close-on-click-modal @close="clearData">
      <el-form ref="addForm" :model="addForm" v-if="dialogVisible" label-width="120px" label-position="right" size="small" :rules="addFormRules">
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
            v-model="addForm.paymentCurrency"
            disabled>
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.purchase.paymentAmount')" prop="paymentAmount">
          <el-input v-model.number="addForm.paymentAmount" type="number" clearable/>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="collectionRemark">
          <el-input v-model="addForm.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 100%"/>
        </el-form-item> -->
        <el-form-item :label="$t('settlementFinance.purchase.supportingFile')" prop="component">
          <el-upload
            ref="upload"
            :headers="upLoadHeaders"
            :action="uploadActionUrl"
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
<!--          <p v-for="item in fileList" :key="item.id">{{item.attachmentName}}</p>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import OrderStep from '@/components/OrderStep'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectCompanyBankAccountListApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerBank } from '@/api/customer'
import { detailPaymentDataApi, addPaymentRecord, updatePaymentsRecord, submitApproval, paymentExportEasypoi } from '@/api/finance'
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    OrderStep,
    ApprovalFlow
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      dialogVisible: false,
      dialogVisible1: false,
      loading1: false,
      confirmLoading: false,
      dialogType: '',
      nodeActive: 0,
      detailForm: {
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: '',
        coolectionAmount: '',
        paidAmount: '',
        lastPaymentTime: '',
        purchaseOrder: {}
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      customerBankList: [],
      sysBankList: [],
      recRecordList: [],
      currencyCodeList: [],
      fileList: [],
      payFileList: [],
      addForm: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        collectionRemark: ''
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
  watch: {
    isZh() {
      this.addFormRules = {
        paymentTime: [{ required: true, message: this.$t('settlementFinance.purchase.inputDate'), trigger: 'change' }],
        paymentAmount: [{ type: 'number', required: true, message: this.$t('settlementFinance.purchase.inputAmount'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getSaleOrderDetail();
  },
  methods: {
    // 导出操作
    exportExcelByEasypoiFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        levelCode: this.postData.levelCode,
        cnLevelName: this.postData.cnLevelName,
        enLevelName: this.postData.enLevelName,
        levelStatus: this.postData.levelStatus
      };
      paymentExportEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'MemberLevel.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    applyLogistics() {
      submitApproval({ bid: this.detailForm.bid }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.closePage()
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查看附件
    exportfile(row) {
      this.downFile(row.attachmentPath)
    },
    exportPactFile(row) {
      this.downFile(row.attachmentPath)
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
    },
    clearData() {
      this.addForm.id = '';
      this.addForm.paymentTime = '';
      this.addForm.paymentAmount = '';
      this.addForm.collectionRemark = '';
      this.addForm.salesCollectionProofList = [];
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
    // 获取主体企业银行卡列表
    getCompanyBankList(id, bankId) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        // this.sysBankList = res.data.list || [];
        // let obj = this.sysBankList.filter(e => {
        //   return e.id === bankId
        // })[0];
        // this.detailForm.sellerBankAddress = obj.bankAddress;
        // this.detailForm.sellerBranchName = obj.branchName;
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
        this.fileList = this.addForm.salesCollectionProofList.map(e => {
          e.url = e.attachmentPath;
          e.name = e.attachmentName;
          return { ...e }
        })
      }
    },
    openDetail(row) {
      this.dialogVisible1 = true;
      this.addFormDetail = Object.assign(this.addForm, row);
      this.fileList = this.addFormDetail.salesCollectionProofList.map(e => {
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
    savePayRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.dialogType === 'add' ? addPaymentRecord : updatePaymentsRecord;
          this.addForm.paymentDocList = this.payFileList.length ? this.payFileList : this.addForm.paymentDocList;
          // this.addForm.salesOrderBId = this.detailForm.logisticsOrderDetail.supplierInfo.bid;
          this.addForm.nodeType = 2;
          this.addForm.paymentOrderType = 1;
          this.addForm.paymentInstructNo = this.$route.query.paymentInstructNo;
          this.addForm.paymentAssociatedOrders = this.detailForm.purchaseOrder.paymentAssociatedOrders;
          this.addForm.associatedOrderBId = this.$route.query.id;
          this.addForm.workflowProcessBId = this.$route.query.workflowId;
          this.addForm.customerBId = this.detailForm.purchaseOrder.supplierBId;
          api(this.addForm).then(res => {
            this.$message.success(this.dialogType === 'add' ? this.$t("system.userManage.handle") : this.$t("system.userManage.handle"));
            this.fileList = [];
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
    // 客户列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
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
    // 根据节点类型获取流程节点
    getSaleOrderDetail() {
      detailPaymentDataApi({ bid: this.$route.query.id, type: this.$route.query.purchaseType }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.addForm.paymentCurrency = this.detailForm.purchaseOrder.orderCurrency;
        this.recRecordList = (res.data.paymentRecordVoList || []).map(e => {
          e.fileName = e.paymentDocList.map(e => e.attachmentName).join(',');
          return { ...e }
        })
        this.allNodeList = res.data.purchaseOrder.wfplist.filter((e) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          return e.nodeType === 2
        });
        this.getCustomerBankList(this.detailForm.customerBId, this.detailForm.buyerBankId);
        this.getCompanyBankList(this.detailForm.sysCompanyBId, this.detailForm.sellerBankId);
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
