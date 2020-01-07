<template>
  <div class="app-container check">
    <div class="edit-title">{{$t('order.sale.orderCheck')}}</div>
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
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55"/>

            <el-table-column align="center" width="100" :label="$t('product.product.productName')">
              <template slot-scope="scope">
                {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="150" :label="$t('order.sale.productDescription')">
              <template slot-scope="scope">
                {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80" :label="$t('product.product.skuCode')">
              <template slot-scope="scope">
                {{scope.row.skuCode}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="180px" :label="$t('common.table.remark')">
              <template slot-scope="scope">
                {{scope.row.productRemark}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.quotedQuantity')" prop="productQuantity"/>

            <el-table-column align="center" :label="$t('order.sale.unitPrice')">
              <template slot-scope="scope">
                {{scope.row.productPrice}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('order.sale.amount')" prop="productAmount"/>

            <el-table-column align="center" width="150px" :label="$t('order.sale.receiptQuantity')" prop="receivedQuantity">
              <template slot-scope="scope">
                {{scope.row.receivedQuantity}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" :label="$t('order.sale.receiptAmount')" prop="receivedAmount"/>

          </el-table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-form ref="checkForm" :model="checkForm" label-width="180px" size="small" :rules="checkFormRules">
          <el-col :span="12">
            <el-form-item :label="$t('order.sale.currency')">
              {{detailForm.orderCurrency}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('order.sale.adjustAmount') + '（+/-）：'" prop="adjustAmount">
              <el-input-number v-model="checkForm.adjustAmount" size="small" disabled style="width: 160px"/>
            </el-form-item>
          </el-col>
          <el-form-item :label="$t('common.table.remark')" prop="orderRemarks">
            <el-input v-model="checkForm.orderRemarks" :autosize="{ minRows: 3, maxRows: 5}" disabled type="textarea" size="small" style="width: 60%"/>
          </el-form-item>
          <el-form-item :label="$t('order.sale.attachment')">
            <div class="record-file">
              <div class="file-item" v-for="(item,index) in recordList" :key="item.id">
                <a href="javascript: void (0)" @click="downFile(item.attachmentPath)">{{index + 1}}、{{item.attachmentName}}</a>
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
            <el-input v-model="checkForm.customerRemarks" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" disabled style="width: 60%"/>
          </el-form-item>
        </el-form>
      </el-row>
      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.close')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import { saleOrderDetail, allNodeSaleOrder, stockRecord } from '@/api/order'
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
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: ''
      },
      checkForm: {
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: '',
        eventRemark: '',
        attachmentUploadTime: '',
        completeDegree: '',
        adjustAmount: '',
        orderRemarks: '',
        workflowType: 3
      },
      checkFormRules: {
        adjustAmount: [{ required: true, message: 'Please fill in the adjust amount', trigger: 'blur' }],
        orderRemarks: [{ required: true, message: 'Please fill in the remark', trigger: 'blur' }]
      },
      orderSkuList: [],
      allNodeList: [],
      recordList: [],
      cusRecordList: [],
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
    // 获取记录
    getRecordList() {
      stockRecord({ salesOrderBId: this.$route.query.id }).then(res => {
        this.recordList = (res.data || []).map(e => {
          return { ...e }
        }).filter(e => {
          return e.attachmentPath
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder() {
      allNodeSaleOrder({ orderBid: this.$route.query.id }).then(res => {
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
        this.checkForm.adjustAmount = this.detailForm.adjustAmount;
        this.checkForm.orderRemarks = this.detailForm.orderRemarks;
        let arr = Number(this.$route.query.saleType) ? this.detailForm.transitradeOrderProductsList : this.detailForm.salesOrderProductsList;
        this.orderSkuList = arr.map(e => {
          e.receivedQuantity = e.receivedQuantity || e.productQuantity;
          e.receivedAmount = (Number(e.receivedQuantity) * Number(e.productPrice)).toFixed(4);
          return { ...e }
        })
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
        >div {
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
        white-space:nowrap;
        overflow: hidden;
        flex: 1;
        a {
          text-decoration: underline;
        }
      }
    }
  }
</style>
