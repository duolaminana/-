<template>
  <div class="app-container editPayRecord">
    <div class="edit-title">{{$t('settlementFinance.sale.CollectionRecordList')}}</div>
    <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" class="edit-form">
      <el-row class="row-item">
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.SalesOrderNo')+'：'" label-width="80">
            {{detailForm.orderNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.collectionNo')+'：'" label-width="80">
            {{detailForm.collectionNo}}
          </el-form-item>
        </el-col>
        </el-row>
        <el-row class="row-item">
        <el-col :span="12">
          <el-form-item :label="$t('logistics.arrival.createTime')+'：'" label-width="80">
            {{detailForm.createTime | timeFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.CollectionDate')+'：'" label-width="80">
            {{detailForm.lastPaymentTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <el-form-item :label="$t('settlementFinance.sale.PaymentProcess')+'：'">
            <order-step :list="allNodeList" :active="nodeActive"></order-step>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.sale.ClientInformation')}}：</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">{{$t('query.tableLabel.CustomerName')}}</td>
              <td width="60%">
                {{detailForm.buyerName}}
              </td>
            </tr>
            <tr>
              <td>{{$t('customer.record.country')}}</td><td>{{detailForm.buyerCountryCode}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm.buyerBank}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm.buyerBranchName}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm.buyerBankAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm.buyerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm.buyerSwiftcode}}</td>
            </tr>
            <!-- <tr>
              <td>目的港口</td><td>{{detailForm.arrivePort}}</td>
            </tr> -->
          </table>
        </el-col>
        <el-col :span="11">
          <div class="row-label">{{$t('settlementFinance.sale.ReceiverInformation')}}：</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">{{$t('settlementFinance.sale.AccountName')}}</td>
              <td width="60%">
                {{detailForm.sellerName}}
              </td>
            </tr>
            <tr>
              <td>{{$t('customer.record.country')}}</td><td>{{detailForm.sellerCountryCode}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.bankName')}}</td><td>{{detailForm.sellerBank}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.branchName')}}</td><td>{{detailForm.sellerBranchName}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.bankAddress')}}</td><td>{{detailForm.sellerBankAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.bankAccount')}}</td><td>{{detailForm.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('logistics.logisticsOrder.swiftCode')}}</td><td>{{detailForm.sellerSwifcode}}</td>
            </tr>
            <!-- <tr>
              <td>出发港口</td><td>{{detailForm.departurePort}}</td>
            </tr> -->
          </table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">{{$t('settlementFinance.sale.CollectionInformation')}}：</div>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.OrderAmount')">
            {{detailForm.totalAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.OrderCurrency')">
            {{detailForm.orderCurrency}}
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="当前实收金额">
            {{detailForm.paidAmount | moneyFmt}}
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.PendingCollection')">
            {{detailForm.coolectionAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('settlementFinance.sale.CollectionDate')">
            {{detailForm.lastPaymentTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <div class="topBtns">
            <div class="row-label">{{$t('customer.collect.payment')}}：</div>
            <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
          </div>
          <el-table
            :data="recRecordList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
           <el-table-column
             :label="$t('common.table.id')"
             align="center"
             type="index"
             width="55">
           </el-table-column>

            <el-table-column align="center" :label="$t('settlementFinance.sale.ReceivingTime')" prop="collectionTime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.collectionTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('inquiry.inquiryOrder.currency')" prop="collectionCurrency" show-overflow-tooltip/>

            <el-table-column align="center" :label="$t('query.tableLabel.Amount')" prop="collectionAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.collectionAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('customer.collect.supporting')" prop="fileName" show-overflow-tooltip/>

            <!-- <el-table-column align="center" label="备注" prop="collectionRemark" show-overflow-tooltip/> -->

            <el-table-column align="center" :label="$t('common.table.actions')" width="150" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row)">详情</el-button> -->
                <el-button type="primary" size="mini" @click="openDialog('edit', scope.row)">{{$t('common.table.edit')}}</el-button>
                <!-- <a :href="scope.row.salesCollectionProofList[0].attachmentPath" :download="scope.row.salesCollectionProofList[0].attachmentName">下载</a> -->
                <el-button type="primary" v-if="scope.row.salesCollectionProofList.length === 1" size="mini" @click="downFile(scope.row.salesCollectionProofList[0].attachmentPath)">{{$t('settlementFinance.sale.ViewFile')}}</el-button>
                <el-dropdown @command="downFileClick" v-else-if="scope.row.salesCollectionProofList.length > 1">
                  <el-button type="primary" size="mini">
                    {{$t('settlementFinance.sale.ViewFile')}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in scope.row.salesCollectionProofList" :command="item" :key="index">{{item.attachmentName}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>

    <!--收款记录编辑-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType=== 'add' ? $t('settlementFinance.sale.AddCollectionRecord') : $t('settlementFinance.sale.EditCollectionRecord')" width="600px" center close-on-click-modal @close="clearData">
      <el-form ref="addForm" :model="addForm" v-if="dialogVisible" :label-width="isZh ? '100px' : '120px'" label-position="right" size="small" :rules="addFormRules">
        <el-form-item :label="$t('settlementFinance.sale.ReceivingTime')" prop="collectionTime">
          <el-date-picker type="datetime" v-model="addForm.collectionTime" style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('inquiry.inquiryOrder.currency')" prop="collectionCurrency">
          <el-select
            style="width: 100%"
            filterable
            remote
            :remote-method="getCurrencyCodeList"
            :loading="loading1"
            v-model="addForm.collectionCurrency"
            disabled>
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.sale.CollectionAmount')" prop="collectionAmount">
          <el-input v-model.number="addForm.collectionAmount" type="number" clearable />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="collectionRemark">
          <el-input v-model="addForm.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 100%"/>
        </el-form-item> -->
        <el-form-item :label="$t('customer.collect.supporting')" prop="component">
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
        <el-button type="primary" size="small" :loading="confirmLoading" @click="savePayRecord('addForm')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <!--收款记录详情-->
    <el-dialog :visible.sync="dialogVisible1" :title="$t('settlementFinance.sale.CollectionRecordDetail')" width="450px" center close-on-click-modal>
      <el-form :model="addFormDetail" label-width="90px" label-position="right" size="small">
        <el-form-item :label="$t('settlementFinance.sale.ReceivingTime')" prop="collectionTime">
          <el-date-picker type="datetime" v-model="addFormDetail.collectionTime" disabled style="width: 100%"/>
        </el-form-item>
        <el-form-item :label="$t('inquiry.inquiryOrder.currency')" prop="collectionCurrency">
          <el-select
            style="width: 100%"
            filterable
            remote
            :remote-method="getCurrencyCodeList"
            :loading="loading1"
            v-model="addFormDetail.collectionCurrency"
            disabled>
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('settlementFinance.sale.CollectionAmount')" prop="collectionAmount">
          <el-input v-model.number="addFormDetail.collectionAmount" type="number" disabled clearable />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="collectionRemark">
          <el-input v-model="addFormDetail.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" readonly style="width: 100%"/>
        </el-form-item> -->
        <el-form-item :label="$t('customer.collect.supporting')" prop="component">
          <el-table
            :data="fileList"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column align="center" :label="$t('customer.record.fileName')" prop="attachmentName" >
              <template slot-scope="scope">
                <a href="javascript: void (0)" @click="downFile(item.attachmentPath)">{{scope.row.attachmentName}}</a>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('common.table.actions')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="downFile(scope.row.attachmentPath)">{{$t('common.table.view')}}</el-button>
              </template>
            </el-table-column>

          </el-table>
<!--          <p v-for="item in fileList" :key="item.id">{{item.attachmentName}}</p>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectCompanyBankAccountListApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerBank } from '@/api/customer'
import { supplierBankList } from "@/api/supplier";
import { saleOrderDetail, typeNodeSaleOrder, getPaymentsList, addPaymentRecord, updatePaymentsRecord } from '@/api/order'
import { transferOrderDetail } from '@/api/transitrade'
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    OrderStep
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
        lastPaymentTime: ''
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
        collectionTime: '',
        collectionCurrency: '',
        collectionAmount: '',
        collectionRemark: ''
      },
      addFormDetail: {
        collectionTime: '',
        collectionCurrency: '',
        collectionAmount: '',
        collectionRemark: ''
      },
      addFormRules: {
        // collectionTime: [{ required: true, message: '请选择日期', trigger: 'change' }],
        // collectionAmount: [{ type: 'number', required: true, message: '请填写金额', trigger: 'blur' }]
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
    this.getTypeNodeSaleOrder();
    this.getPaymentsList();
  },
  methods: {
    verification() {
      this.addFormRules = {
        collectionTime: [{ required: true, message: this.language === 'zh' ? '请选择日期' : '', trigger: 'Please choose the date' }],
        collectionAmount: [{ type: 'number', required: true, message: this.language === 'zh' ? '请填写金额.' : 'Please fill in the amount', trigger: 'blur' }]
      }
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
    },
    clearData() {
      this.addForm.id = '';
      this.addForm.collectionTime = '';
      this.addForm.collectionAmount = '';
      this.addForm.collectionRemark = '';
      this.addForm.salesCollectionProofList = [];
      this.fileList = [];
    },
    downFileClick(row) {
      this.downFile(row.attachmentPath)
    },
    // 获取客户银行列表
    getCustomerBankList(id, bankId, orderType) {
      let api = orderType ? listCustomerBank : supplierBankList;
      let obj = orderType ? { customerBId: id, pageNum: 1, pageSize: 999 } : { supplierBId: id };
      api(obj).then(res => {
        this.customerBankList = orderType ? res.data.list : res.data;
        let obj = this.customerBankList.filter(e => {
          return e.id === bankId
        })[0];
        this.detailForm.buyerBankAddress = obj ? obj.bankAddress : '';
        this.detailForm.buyerBranchName = obj ? obj.branchName : '';
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
        this.detailForm.sellerBankAddress = obj ? obj.bankAddress : '';
        this.detailForm.sellerBranchName = obj ? obj.branchName : '';
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.verification();
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
      } else {
        this.fileList = [];
        this.addForm.salesCollectionProofList = []
        this.payFileList = []
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
      let msg = this.language === 'zh' ? '最多只能上传5个文件' : 'Up to 5 files';
      this.$message.warning(msg);
    },
    beforeRemove(file, fileList) {
      let msg1 = this.language === 'zh' ? '确定移除' : 'Confirm removal';
      return this.$confirm(`${ msg1 } ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.payFileList = fileList.map(e => {
        e.attachmentName = e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        e.attachmentUuid = e.attachmentUuid || e.response.data.UUID;
        return { ... e }
      })
    },
    savePayRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.dialogType === 'add' ? addPaymentRecord : updatePaymentsRecord;
          this.addForm.salesCollectionProofList = this.payFileList.length ? this.payFileList : this.addForm.salesCollectionProofList;
          this.addForm.salesOrderBId = this.$route.query.id;
          this.addForm.collectionType = Number(this.$route.query.saleType) ? 2 : 1;
          this.addForm.nodeType = 2;
          this.confirmLoading = true;
          api(this.addForm).then(res => {
            this.$message.success(this.dialogType === 'add' ? this.$t('system.userManage.addSuccess') : this.$t('system.role.saveSuccess'));
            this.getPaymentsList();
            this.getTypeNodeSaleOrder();
            this.fileList = [];
            this.$refs.upload.clearFiles();
            this.dialogVisible = false;
            this.getSaleOrderDetail();
            this.confirmLoading = false;
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          })
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
    // 获取付款记录
    getPaymentsList() {
      getPaymentsList({ salesOrderBId: this.$route.query.id }).then(res => {
        this.recRecordList = (res.data || []).map(e => {
          e.fileName = e.salesCollectionProofList.map(e => e.attachmentName).join(',');
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder() {
      typeNodeSaleOrder({ orderBid: this.$route.query.id, nodeType: this.$route.query.type || 2 }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map((e, index) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          if (e.currentNodeFlag) {
            this.nodeActive = index
          }
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSaleOrderDetail() {
      let api = Number(this.$route.query.saleType) ? transferOrderDetail : saleOrderDetail;
      api({ orderBid: this.$route.query.id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.addForm.collectionCurrency = this.detailForm.orderCurrency;
        this.getCustomerBankList(this.detailForm.customerBId || this.detailForm.supplierBId, this.detailForm.buyerBankId, this.detailForm.salesOrderType);
        if (this.detailForm.sysCompanyBId) {
          this.getCompanyBankList(this.detailForm.sysCompanyBId, this.detailForm.sellerBankId);
        }
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
  .el-message-box__message p {
    text-align: center !important;
  }
  .el-message-box__btns {
    text-align: center;
  }
</style>
