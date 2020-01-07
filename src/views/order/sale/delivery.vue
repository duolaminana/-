<template>
  <div class="app-container delivery">
    <div class="edit-title">{{Number($route.query.saleType) === 1 ? $t('order.sale.transferDelivery') : $t('order.sale.orderDelivery')}}</div>
    <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" class="edit-form">
      <el-row class="row-item">
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.orderNo')">
            {{detailForm.orderNo}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.orderDate')">
            {{detailForm.createTime | timeFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.buyer')">
            {{detailForm.buyerName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.seller')">
            {{detailForm.sellerName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <el-form-item :label="$t('order.sale.orderPrecess')">
            <order-step :list="allNodeList"></order-step>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">{{$t('order.sale.goodsDelivery')}}：</div>
        <el-form ref="deliveryForm" :model="deliveryForm" label-width="140px" size="small" :rules="stockFormRules">
          <el-form-item :label="$t('order.sale.deliveryCompletion')" prop="completeDegree" :label-width="isZh? '':'300px'">
            <el-input-number v-model="deliveryForm.completeDegree" controls-position="right" :min="0" :max="100" size="small" style="width: 200px"/> &nbsp;%
          </el-form-item>
          <el-form-item :label="$t('order.sale.deliveryDate')" prop="attachmentUploadTime">
            <el-date-picker v-model="deliveryForm.attachmentUploadTime" type="datetime" placeholder="select date" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('order.sale.deliveryRemark')" prop="eventRemark">
            <el-input v-model="deliveryForm.eventRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 60%"/>
          </el-form-item>
          <el-form-item :label="$t('order.sale.attachment')" prop="component" style="width: 500px">
            <el-upload
              ref="upload"
              :action="uploadActionUrl"
              :headers="upLoadHeaders"
              :data="{type: 2}"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :file-list="fileList">
              <el-button size="small" type="primary">{{$t('common.upload')}}</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <div class="topBtns">
            <div class="row-label">{{$t('order.sale.deliveryRecord')}}：</div>
          </div>
          <el-table
            :data="recordList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="170" :label="$t('order.sale.deliveryDate')" prop="attachmentUploadTime">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="90" :label="$t('order.sale.completePercent')" prop="completeDegree"/>

            <el-table-column align="center" :label="$t('order.sale.deliveryRemark')" prop="eventRemark"/>

            <el-table-column align="center" :label="$t('order.sale.attachment')" prop="attachmentName" >
              <template slot-scope="scope">
                {{scope.row.attachmentName}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('common.table.actions')" width="90" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="deleteRecord(scope.row.id)">{{$t('common.delete')}}</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="saveRecord('deliveryForm')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import { saleOrderDetail, typeNodeSaleOrder, stockRecord, addRecordFile, updateOrderFlowInfo, deleteOrderStockRecord } from '@/api/order'
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
      confirmLoading: false,
      dialogType: '',
      detailForm: {
        orderNo: '',
        createTime: '',
        buyerName: '',
        sellerName: '',
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: ''
      },
      deliveryForm: {
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: '',
        eventRemark: '',
        attachmentUploadTime: '',
        completeDegree: '',
        workflowType: 2
      },
      stockFormRules: {
        attachmentUploadTime: [{ required: true, message: 'Please select stock Date', trigger: 'change' }],
        completeDegree: [{ required: true, message: 'Please fill in Proportion', trigger: 'blur' }]
      },
      allNodeList: [],
      recordList: [],
      fileList: [],
      payFileList: []
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
    this.getSaleOrderDetail();
    this.getTypeNodeSaleOrder();
    this.getRecordList();
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
    },
    clearForm() {
      this.deliveryForm.attachmentName = '';
      this.deliveryForm.attachmentPath = '';
      this.deliveryForm.attachmentUuid = '';
      this.deliveryForm.eventRemark = '';
      this.deliveryForm.attachmentUploadTime = '';
      this.deliveryForm.completeDegree = '';
      this.deliveryForm.id = '';
      this.deliveryForm.bid = '';
    },
    handleRemove(file, fileList) {
      this.deliveryForm.attachmentName = '';
      this.deliveryForm.attachmentPath = '';
      this.deliveryForm.attachmentUuid = '';
    },
    handleExceed(files, fileList) {
      this.$message.warning('Upload only one file at most');
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Are you sure to remove ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.deliveryForm.attachmentName = file.name;
      this.deliveryForm.attachmentPath = res.data.filePath;
      this.deliveryForm.attachmentUuid = res.data.UUID;
    },
    saveRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          let obj1 = {
            currentCompletion: this.deliveryForm.completeDegree,
            id: this.$route.query.nodeId,
            orderBId: this.$route.query.id
          };
          updateOrderFlowInfo(obj1).then(res => {
            this.confirmLoading = false;
            this.getTypeNodeSaleOrder()
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });

          this.deliveryForm.salesOrderBId = this.$route.query.id;
          this.deliveryForm.id = this.$route.query.nodeId;
          this.deliveryForm.workflowProcessBId = this.$route.query.workflowId;
          addRecordFile(this.deliveryForm).then(res => {
            this.confirmLoading = false;
            this.getRecordList();
            this.$message.success('save Success');
            this.clearForm();
            this.$refs.upload.clearFiles()
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });
        }
      });
    },
    deleteRecord(id) {
      this.$confirm(this.$t('common.tip.isDeleteMsg'), 'Tips', {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        deleteOrderStockRecord({ id: id }).then(res => {
          this.$message.success(this.$t('common.tip.deleteTip'));
          this.getRecordList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // 获取记录
    getRecordList() {
      stockRecord({ salesOrderBId: this.$route.query.id, workflowProcessBId: this.$route.query.workflowId }).then(res => {
        this.recordList = (res.data || []).map(e => {
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder() {
      typeNodeSaleOrder({ orderBid: this.$route.query.id, nodeType: this.$route.query.type }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map((e, index) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
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
  .delivery {
    width:80%;
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
