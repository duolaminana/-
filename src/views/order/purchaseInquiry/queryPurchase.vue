<template>
  <div class="app-container query-purchase">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="待采购销售订单" name="1">
        <div class="search-box">
          <el-form label-width="90px" inline size="small">
            <el-form-item label="订单号">
              <el-input v-model="postData1.orderNo" clearable placeholder="销售订单号" style="width: 200px" />
            </el-form-item>
            <el-form-item label="客户名称">
              <el-input v-model="postData1.customerUserName" clearable placeholder="客户名称" style="width: 200px" />
            </el-form-item>
            <el-form-item label="所属国家">
              <el-input v-model="postData1.customerCountryCode" clearable placeholder="国家名称" style="width: 200px" />
            </el-form-item>
            <el-form-item label="订单日期">
              <el-date-picker
                v-model="postData1.rangeTime"
                type="datetimerange"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="getRangeTime1">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="export" @click="searchData1">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-title">待采购销售订单：<span>（点击可查看订单商品）</span></div>
        <el-table
          v-loading="listLoading"
          :data="dataList1"
          element-loading-text="正在查询中。。。"
          border
          fit
          size="mini"
          highlight-current-row
          :header-cell-style="{background: '#a7bfee'}"
          @row-click="rowClick1">
          <el-table-column align="center" width="60">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.radio" :label="true">{{null}}</el-radio>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="55">
            <template slot-scope="scope">
              <span>{{(postData1.pageIndex - 1) * postData1.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="订单号" prop="orderNo" show-overflow-tooltip/>

          <el-table-column align="center" label="客户名称" prop="buyerName" show-overflow-tooltip/>

          <el-table-column align="center" label="所属国家" prop="buyerCountryCode" show-overflow-tooltip/>

          <el-table-column align="center" label="SKU数" prop="prodcutSkuCount" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.prodcutSkuCount}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="订货量" prop="orderNumber"/>

          <el-table-column align="center" width="160" label="订单日期" prop="createTime">
            <template slot-scope="scope">
              {{scope.row.createTime | timeFmt}}
            </template>
          </el-table-column>
        </el-table>

        <Pagination :total="postData1.total" :page.sync="postData1.pageIndex" :limit.sync="postData1.pageSize" @pagination="getDataList1" ></Pagination>

        <div class="sku-box">
          <div class="table-title">销售订单商品：</div>
          <el-table
            v-loading="listLoading1"
            :data="dataClickList1"
            border
            fit
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
              <template slot-scope="scope">
                <span>{{(rowClickData1.pageNum - 1) * rowClickData1.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
              <template slot-scope="scope">
                <div class="table-goods">
                  <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
                  <div class="goods-text">
                    <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                    <div>所属类目：{{scope.row.skuReference}}</div>
                    <div>商品编码：{{scope.row.productCode}}</div>
                    <div>海关编码：{{scope.row.customsCode}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column min-width="150px" label="SKU描述" >
              <template slot-scope="scope">
                <div class="table-goods">
                  <div class="goods-text">
                    <div>{{scope.row.productDescription}}</div>
                    <div>sku编码：{{scope.row.skuCode}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" width="150px" label="订货量" prop="productQuantity">
              <template slot-scope="scope">
                {{scope.row.productQuantity}}
              </template>
            </el-table-column>

            <el-table-column align="center" min-width="150px" label="备注" prop="productRemark">
              <template slot-scope="scope">
                {{scope.row.productRemark}}
              </template>
            </el-table-column>
          </el-table>

          <Pagination :total="rowClickData1.total" :page.sync="rowClickData1.pageNum" :limit.sync="rowClickData1.pageSize" @pagination="getSaleOrderSkuByBId" ></Pagination>

        </div>

        <div style="text-align: center;margin: 30px 0">
          <el-button type="danger" size="small" @click="closePage">返回</el-button>
        </div>

      </el-tab-pane>
      <el-tab-pane label="待采购商品" name="2">
        <div class="search-box">
          <el-form label-width="90px" inline size="small">
            <el-form-item label="商品编码">
              <el-input v-model="postData2.productCode" clearable placeholder="请输入商品编码" style="width: 200px" />
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="postData2.productName" clearable placeholder="请输入商品名称" style="width: 200px" />
            </el-form-item>
            <el-form-item label="SKU名称">
              <el-input v-model="postData2.productDescription" clearable placeholder="请输入sku名称" style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="export" @click="searchData2">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-title">待采购商品<span>（点击可查看所属销售订单）</span></div>
        <el-table
          :data="dataList2"
          border
          fit
          size="small"
          highlight-current-row
          :header-cell-style="{background: '#a7bfee'}"
          @row-click="rowClick2">
          <el-table-column align="center" width="55">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.radio" :label="true">{{null}}</el-radio>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="55">
            <template slot-scope="scope">
              <span>{{(postData2.pageNum - 1) * postData2.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
            <template slot-scope="scope">
              <div class="table-goods">
                <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
                <div class="goods-text">
                  <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                  <div>所属类目：{{scope.row.skuReference}}</div>
                  <div>商品编码：{{scope.row.productCode}}</div>
                  <div>海关编码：{{scope.row.customsCode}}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="150px" label="SKU描述" >
            <template slot-scope="scope">
              <div class="table-goods">
                <div class="goods-text">
                  <div>{{scope.row.productDescription}}</div>
                  <div>sku编码：{{scope.row.skuCode}}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150px" label="订货量" prop="productQuantity">
            <template slot-scope="scope">
              {{scope.row.productQuantity}}
            </template>
          </el-table-column>

          <el-table-column align="center" min-width="150px" label="备注" prop="productRemark">
            <template slot-scope="scope">
              {{scope.row.productRemark}}
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="postData2.total" :page.sync="postData2.pageNum" :limit.sync="postData2.pageSize" @pagination="getDataList2" ></Pagination>

        <div class="table-title">待采购销售订单：</div>
        <el-table
          :data="dataClickList2"
          border
          fit
          size="mini"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="55">
            <template slot-scope="scope">
              <span>{{(rowClickData2.pageIndex - 1) * rowClickData2.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="订单号" prop="orderNo"/>

          <el-table-column align="center" label="客户名称" prop="buyerName"/>

          <el-table-column align="center" label="所属国家" prop="buyerCountryCode"/>

          <el-table-column align="center" label="SKU数" prop="prodcutSkuCount">
            <template slot-scope="scope">
              {{scope.row.prodcutSkuCount}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="订货量" prop="orderNumber"/>

          <el-table-column align="center" width="160" label="订单日期" prop="createTime">
            <template slot-scope="scope">
              {{scope.row.createTime | timeFmt}}
            </template>
          </el-table-column>
        </el-table>

        <Pagination :total="rowClickData2.total" :page.sync="rowClickData2.pageIndex" :limit.sync="rowClickData2.pageSize" @pagination="getSaleOrderBySkuBId" ></Pagination>

        <div style="text-align: center;margin: 30px 0">
          <el-button type="danger" size="small" @click="closePage">返回</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  deletePurchaseInquiry,
  getWaitPurchaseSaleOrder,
  getSaleOrderSkuByBId,
  postSaleOrderSkuByBId,
  getSaleOrderBySkuBId
} from '@/api/order'
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      activeName: '1',
      dataList1: [],
      dataList2: [],
      dataClickList1: [],
      dataClickList2: [],
      selectList: [],
      listLoading: true,
      listLoading1: false,
      dialogVisible: false,
      postData1: {
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
      postData2: {
        productDescription: '',
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        ifPurchase: 0,
        ifInquiry: 0
      },
      rowClickData1: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        salesOrderBId: '',
        ifPurchase: 0,
        ifInquiry: 0
      },
      rowClickData2: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        skuBId: '',
        ifPurchase: 0,
        ifInquiry: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
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
    this.getDataList1();
    this.getDataList2();
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchaseOrderInquiry'
        })
      })
    },
    getRangeTime1(arr) {
      if (arr && arr.length) {
        this.postData1.orderStartTime = new Date(arr[0]);
        this.postData1.orderEndTime = new Date(arr[1]);
      } else {
        this.postData1.orderStartTime = '';
        this.postData1.orderEndTime = '';
      }
    },
    searchData1() {
      this.postData1.pageIndex = 1;
      this.getDataList1()
    },
    searchData2() {
      this.postData2.pageNum = 1;
      this.getDataList2()
    },
    getDataList1() {
      let obj = {};
      for (let key in this.postData1) {
        if (this.postData1[key] !== '') {
          obj[key] = this.postData1[key]
        }
      }
      getWaitPurchaseSaleOrder(obj).then(res => {
        this.dataList1 = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.postData1.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getDataList2() {
      let obj = {};
      for (let key in this.postData2) {
        if (this.postData2[key] !== '') {
          obj[key] = this.postData2[key]
        }
      }
      postSaleOrderSkuByBId(obj).then(res => {
        this.dataList2 = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.postData2.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleOrderSkuByBId() {
      this.listLoading1 = true;
      getSaleOrderSkuByBId(this.rowClickData1).then(res => {
        this.rowClickData1.total = res.data.total;
        this.dataClickList1 = res.data.list;
        this.listLoading1 = false;
      }).catch(err => {
        this.listLoading1 = false;
        this.$message.error(err.message)
      });
    },
    getSaleOrderBySkuBId() {
      this.listLoading1 = true;
      getSaleOrderBySkuBId(this.rowClickData2).then(res => {
        this.rowClickData2.total = res.data.total;
        this.dataClickList2 = res.data.list;
        this.listLoading1 = false;
      }).catch(err => {
        this.listLoading1 = false;
        this.$message.error(err.message)
      });
    },
    rowClick1(row) {
      this.dataList1.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.rowClickData1.salesOrderBId = row.bid;
      this.getSaleOrderSkuByBId()
    },

    rowClick2(row) {
      this.dataList2.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.rowClickData2.skuBId = row.skuBId;
      this.getSaleOrderBySkuBId()
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    deleteMenu() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('此操作将删除该询价单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let ids = this.selectList.map(e => e.id).join(',');
        deletePurchaseInquiry({ ids: ids }).then(res => {
          this.getDataList1();
          this.$message.success(res.message);
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    }
  },
  filters: {
    statusName(status) {
      const statusMap = ['编辑', '询价中', '优选中', '已完成'];
      return statusMap[status]
    },
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
  .query-purchase {
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
    .table-title {
      line-height: 36px;
      span {
        color: #DD4A68;
        font-size: 12px;
      }
    }
    .sku-box {
      margin: 30px 0;
      border-top: 1px solid $border-light-color;
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
  }
</style>
