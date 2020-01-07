<template>
  <div class="app-container check">
    <div class="edit-title">{{$t('order.sale.orderCheckApproval')}}</div>
    <el-form
      ref="detailForm"
      :model="detailForm"
      label-width="140px"
      size="small"
      class="edit-form"
    >
      <el-row class="row-item">
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.orderNo')">{{detailForm.orderNo}}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.orderDate')">{{detailForm.createTime | timeFmt}}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.buyer')">{{detailForm.buyerName}}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.seller')">{{detailForm.sellerName}}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('order.sale.country')">
            {{detailForm.buyerCountryCode}}
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
      <el-row>
        <el-col>
          <el-table
            :data="orderSkuList"
            border
            fit
            show-summary
            size="small"
            max-height="520"
            style="font-size: 12px"
            :header-cell-style="{background: '#a7bfee'}"
          >
            <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55" />

            <el-table-column align="center" width="100" :label="$t('product.product.productName')">
              <template slot-scope="scope">
                {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="150" :label="$t('order.sale.productDescription')">
              <template
                slot-scope="scope"
              >{{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}</template>
            </el-table-column>

            <el-table-column align="center" width="80" :label="$t('product.product.skuCode')">
              <template slot-scope="scope">{{scope.row.skuCode}}</template>
            </el-table-column>

            <el-table-column align="center" width="180px" :label="$t('common.table.remark')">
              <template slot-scope="scope">{{scope.row.productRemark}}</template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.quotedQuantity')" prop="productQuantity" />

            <el-table-column align="center" :label="$t('order.sale.unitPrice')">
              <template slot-scope="scope">{{scope.row.productPrice}}</template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.amount')" prop="productAmount" />

            <el-table-column align="center" width="150px" :label="$t('order.sale.receiptQuantity')" prop="receivedQuantity">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.receivedQuantity"
                  controls-position="right"
                  size="small"
                  :min="0"
                  @change="changeNumber(scope.row)"
                />
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" :label="$t('order.sale.receiptAmount')" prop="receivedAmount" />
          </el-table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-form
          ref="checkForm"
          :model="checkForm"
          label-width="180px"
          size="small"
          :rules="checkFormRules"
        >
          <el-col :span="12">
            <el-form-item :label="$t('order.sale.currency')">{{detailForm.orderCurrency}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('order.sale.adjustAmount') + '（+/-）：'" prop="adjustAmount">
              <el-input-number v-model="checkForm.adjustAmount" disabled size="small" style="width: 160px" />
            </el-form-item>
          </el-col>
          <el-form-item :label="$t('order.sale.attachment')" style="width: 500px">
            <el-upload
              disabled
              ref="upload"
              :headers="upLoadHeaders"
              :action="uploadActionUrl"
              :data="{type: 2}"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :file-list="fileList"
            >
              <el-button size="small" type="primary" disabled>{{$t('common.upload')}}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('common.table.remark')" prop="orderRemarks">
            <el-input
              readonly
              v-model="checkForm.orderRemarks"
              :autosize="{ minRows: 3, maxRows: 5}"
              type="textarea"
              size="small"
              style="width: 60%"
            />
          </el-form-item>
          <el-form-item :label="$t('order.sale.attachment')">
            <div class="record-file">
              <div class="file-item" v-for="(item,index) in recordList" :key="item.id">
                <a
                  href="javascript: void (0)"
                  @click="downFile(item.attachmentPath)"
                >{{index + 1}}、{{item.attachmentName}}</a>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('order.sale.clientAttachment')">
            <div class="record-file">
              <div class="file-item" v-for="(item,index) in cusRecordList" :key="item.id">
                <a href="javascript: void (0)">{{index + 1}}、{{item.attachmentName}}</a>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('order.sale.clientRemark')" prop="customerRemarks">
            <el-input
              v-model="checkForm.customerRemarks"
              :autosize="{ minRows: 3, maxRows: 5}"
              type="textarea"
              size="small"
              readonly
              style="width: 60%"
            />
          </el-form-item>
          <!--<el-form-item label="客户备注说明：">-->
          <!--<el-input v-model="checkForm.eventRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 60%"/>-->
          <!--</el-form-item>-->
        </el-form>
      </el-row>
      <!--<el-row class="row-item">-->
      <!--<el-col>-->
      <!--<div class="topBtns">-->
      <!--<div class="row-label">备货记录表：</div>-->
      <!--</div>-->
      <!--<el-table-->
      <!--:data="recordList"-->
      <!--border-->
      <!--fit-->
      <!--size="mini"-->
      <!--:header-cell-style="{background: '#a7bfee'}">-->
      <!--<el-table-column-->
      <!--align="center"-->
      <!--type="index"-->
      <!--width="55">-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" width="170" label="备货日期" prop="attachmentUploadTime">-->
      <!--<template slot-scope="scope">-->
      <!--{{scope.row.attachmentUploadTime | timeFmt}}-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" width="90" label="比率" prop="completeDegree"/>-->

      <!--<el-table-column align="center" label="备注" prop="eventRemark"/>-->

      <!--<el-table-column align="center" label="附件" prop="attachmentName" >-->
      <!--<template slot-scope="scope">-->
      <!--{{scope.row.attachmentName}}-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="primary" size="mini" @click="deleteRecord(scope.row.id)">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--</el-table>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-form-item style="text-align: center;margin-top: 20px">-->
        <!--<el-button-->
          <!--type="primary"-->
          <!--size="small"-->
          <!--:loading="confirmLoading"-->
          <!--@click="saveClick('checkForm')"-->
        <!--&gt;保存</el-button>-->
        <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
      <!--</el-form-item>-->
    </el-form>
    <ApprovalFlow @close="closePage"></ApprovalFlow>
  </div>
</template>

<script>
import OrderStep from "@/components/OrderStep";
import ApprovalFlow from '@/components/ApprovalFlow'
import {
  saleOrderDetail,
  allNodeSaleOrder,
  stockRecord
  // addRecordFile,
  // checkSaleOrderFlow
} from "@/api/order";
import { uploadActionUrl } from "@/api/common";
import { parseTime } from "@/utils/index";
import moneyFmt from "@/mixin/moneyFmt";
export default {
  components: {
    OrderStep,
    ApprovalFlow
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      confirmLoading: false,
      dialogType: "",
      detailForm: {
        sellerBankAddress: "",
        sellerBranchName: "",
        buyerBankAddress: "",
        buyerBranchName: ""
      },
      checkForm: {
        attachmentName: "",
        attachmentPath: "",
        attachmentUuid: "",
        eventRemark: "",
        attachmentUploadTime: "",
        completeDegree: "",
        adjustAmount: "",
        orderRemarks: "",
        workflowType: 3
      },
      checkFormRules: {
        adjustAmount: [{ required: true, message: "Please fill in adjust amount", trigger: "blur" }],
        orderRemarks: [{ required: true, message: "Please fill in remark", trigger: "blur" }]
      },
      orderSkuList: [],
      allNodeList: [],
      recordList: [],
      cusRecordList: [],
      fileList: [],
      payFileList: []
    };
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path;
      })[0];
      return activePath;
    }
  },
  created() {
    this.getSaleOrderDetail();
    this.getTypeNodeSaleOrder();
    this.getRecordList();
  },
  methods: {
    closePage() {
      this.$store.dispatch("delView", this.activeRoute).then(() => {
        this.$router.back()
      });
    },
    handleRemove(file, fileList) {
      this.checkForm.attachmentName = "";
      this.checkForm.attachmentPath = "";
      this.checkForm.attachmentUuid = "";
    },
    handleExceed(files, fileList) {
      this.$message.warning("Upload only one file at most");
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Are you sure to remove ${file.name}？`);
    },
    handleSuccess(res, file, fileList) {
      this.checkForm.attachmentName = file.name;
      this.checkForm.attachmentPath = res.data.filePath;
      this.checkForm.attachmentUuid = res.data.UUID;
    },
    changeNumber(item) {
      item.receivedAmount = (
        Number(item.receivedQuantity) * Number(item.productPrice)
      ).toFixed(4);
      this.checkForm.adjustAmount =
        Math.round((item.productAmount - item.receivedAmount) * 10000) / 10000;
    },
    // 获取记录
    getRecordList() {
      stockRecord({ salesOrderBId: this.$route.query.id })
        .then(res => {
          this.recordList = (res.data || []).map(e => {
            return { ...e };
          }).filter(e => {
            return e.attachmentPath
          })
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder() {
      allNodeSaleOrder({ orderBid: this.$route.query.id })
        .then(res => {
          this.allNodeList = res.data.workflowProcessList.map((e, index) => {
            e.currentCompletion = (e.currentCompletion || 0).toString();
            return { ...e };
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getSaleOrderDetail() {
      saleOrderDetail({ orderBid: this.$route.query.id })
        .then(res => {
          this.detailForm = Object.assign(this.detailForm, res.data);
          this.checkForm.adjustAmount = this.detailForm.adjustAmount;
          this.checkForm.orderRemarks = this.detailForm.orderRemarks;
          this.orderSkuList = this.detailForm.salesOrderProductsList.map(e => {
            e.receivedQuantity = e.receivedQuantity || e.productQuantity;
            e.receivedAmount = (
              Number(e.receivedQuantity) * Number(e.productPrice)
            ).toFixed(4);
            return { ...e };
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.check {
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
      > div {
        font-size: 12px;
      }
    }
  }
  .record-file {
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    .file-item {
      min-width: 180px;
      max-width: 230px;
      margin: 0 10px;
      white-space: nowrap;
      overflow: hidden;
      flex: 1;
      a {
        text-decoration: underline;
      }
    }
  }
}
</style>
