<template>
  <div class="app-container edit-purchase-inquiry">
    <div class="edit-title">采购询价单</div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" style="margin-top: 20px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="询价单编码" prop="inquiryCode">
            <el-input v-model="editForm.inquiryCode" readonly placeholder="请输入询价单编码" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="currency">
            <el-input v-model="editForm.currency" readonly placeholder="请输入询价单币种" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="询价单名称" prop="inquiryName">
            <el-input v-model="editForm.inquiryName" readonly placeholder="请输入询价单名称" style="width: 80%"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="询价日期" prop="rangeTime">
            <el-date-picker
              v-model="editForm.rangeTime"
              type="datetimerange"
              unlink-panels
              disabled
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="commissionType">
            <el-select v-model="editForm.commissionType" class="edit-form-width">
              <el-option label="委托卖方" :value="1"></el-option>
              <el-option label="自提" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportType">
            <el-select v-model="editForm.transportType" disabled placeholder="请选择运输方式" class="edit-form-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="目的港口/地址" prop="transportAddress">
            <el-input v-model="editForm.transportAddress" readonly placeholder="请输入目的港口/地址" style="width: 80%"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="inquiryRemarks">
            <el-input v-model="editForm.inquiryRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" readonly style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="sale-order-table">
      <div class="table-top">
        <div style="float: left">选择的待销售订单：</div>
      </div>
      <el-table
        :data="inquirySaleOrderList"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="55">
        </el-table-column>

        <el-table-column align="center" label="订单号" prop="salesOrderNo"/>

        <el-table-column align="center" label="客户名称" prop="buyerName"/>

        <el-table-column align="center" label="所属国家" prop="buyerCountry"/>

        <el-table-column align="center" label="SKU数" prop="skuNumber">
          <template slot-scope="scope">
            {{scope.row.skuNumber}}
          </template>
        </el-table-column>

        <el-table-column align="center" label="订货量" prop="productQuantity"/>

        <el-table-column align="center" width="160" label="订单日期" prop="createTime">
          <template slot-scope="scope">
            {{scope.row.createTime | timeFmt}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="inquiryPostData.total" :page.sync="inquiryPostData.pageNum" :limit.sync="inquiryPostData.pageSize" @pagination="getSaleOrderByBId" ></Pagination>

      <div class="table-top">
        <div>选择的订单待采购商品：</div>
      </div>
      <el-table
        :data="inquirySkuList"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="55">
        </el-table-column>

        <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-img"><img :src="scope.row.productImgUrl" alt=""></div>
              <div class="goods-text">
                <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                <div>所属类目：{{scope.row.catalogBName}}</div>
                <div>商品编码：{{scope.row.productCode}}</div>
                <div>海关编码：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="150px" label="SKU描述" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-text">
                <div>{{scope.row.productDescription}}</div>
                <div>sku编码：{{scope.row.skuCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="80px" label="订货量" prop="productQuantity">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="询价量" prop="inquiryQuantity">
          <template slot-scope="scope">
            {{scope.row.inquiryQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180px" label="询价备注" prop="inquiryRemark">
          <template slot-scope="scope">
            {{scope.row.inquiryRemark}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="70px" label="供应商数" prop="supplierNumber"/>

        <el-table-column align="center" width="200px" label="已选供应商" prop="productQuantity">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.pioslist" :key="index" class="td-text">
              {{index+1}}、{{item.supplierInfo.supplierName}}
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="text-align: center;margin: 40px 0">
      <el-button type="danger" size="small" @click="closePage">返回</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import {
  getPurchaseInquiryDetail,
  getPurchaseInquiryWithSaleOrder,
  getPurchaseInquiryWithSku
} from '@/api/order'
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      selectList: [],
      postData: {
        orderNo: '',
        customerCountryCode: '',
        customerUserName: '',
        rangeTime: [],
        orderStartTime: '',
        orderEndTime: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        ifPurchase: 0,
        ifInquiry: 0
      },
      inquiryPostData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      saleOrderList: [],
      inquirySaleOrderList: [],
      inquirySkuList: [],
      editForm: {
        rangeTime: [],
        transportType: 1,
        currency: '',
        inquiryCode: '',
        inquiryName: '',
        inquiryStatus: 0,
        inquiryRemarks: '',
        commissionType: 1,
        transportAddress: '',
        beginTime: '',
        endTime: ''
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
    if (this.$route.query.id) {
      this.getDetail();
      this.getSaleOrderByBId();
      this.getSaleOrderSkuByBId()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchaseOrderInquiry'
        })
      })
    },
    getDetail() {
      let obj = {
        bid: this.$route.query.id
      };
      getPurchaseInquiryDetail(obj).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.rangeTime = [this.editForm.beginTime, this.editForm.endTime];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleOrderByBId() {
      this.inquiryPostData.purchaseInquiryBId = this.$route.query.id;
      getPurchaseInquiryWithSaleOrder(this.inquiryPostData).then(res => {
        this.inquirySaleOrderList = res.data.list;
        this.inquiryPostData.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleOrderSkuByBId() {
      let obj = {
        purchaseInquiryBId: this.$route.query.id
      };
      getPurchaseInquiryWithSku(obj).then(res => {
        this.inquirySkuList = res.data.map(e => {
          e.inquiryQuantity = e.inquiryQuantity || e.productQuantity;
          e.pioslist = e.pioslist || [];
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .edit-purchase-inquiry {
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
    .edit-form-width {
      width: 300px;
    }
    .table-top {
      line-height: 40px;
      height: 40px;
      padding: 5px;
      border-top: 1px solid $border-light-color;
      margin-top: 20px;
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
    .td-text {
      line-height: 12px;
    }
  }
</style>
