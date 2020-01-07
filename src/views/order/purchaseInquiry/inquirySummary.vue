<template>
  <div class="app-container inquiry-summary">
    <div class="edit-title">采购询价单优选</div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" style="margin-top: 20px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="询价单单号" prop="inquiryCode">
            {{editForm.inquiryCode}}
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
            <el-select v-model="editForm.commissionType" disabled class="edit-form-width">
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

    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="按供应商报价" name="1">
        <div class="search-box">
          <el-form label-width="90px" inline size="small">
            <el-form-item label="供应商编码">
              <el-input v-model="postData1.sellerCode" clearable placeholder="供应商编码" style="width: 200px" />
            </el-form-item>
            <el-form-item label="供应商名称">
              <el-input v-model="postData1.sellerName" clearable placeholder="供应商名称" style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="export" @click="searchData1">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-title">供应商报价列表：<span>（点击可查看报价明细）</span></div>
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
          </el-table-column>

          <el-table-column align="center" label="供应商编码" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.sellerCode}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="供应商名称" prop="buyerName" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.sellerName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="联系人" prop="concatName" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.sellerContact}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="联系电话" prop="concatMobile" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.sellerTelephone}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="总询价量" prop="inquiryQuantity"/>
          <el-table-column align="center" label="sku数" prop="skuNumber"/>
          <el-table-column align="center" label="报价金额" prop="quotedAmount"/>
          <el-table-column align="center" width="80px" label="状态" prop="quotedStatus">
            <template slot-scope="scope">
              {{scope.row.quotedStatus | statusName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购量" prop="purchaseQuantity"/>
          <el-table-column align="center" label="采购总金额" prop="netTotalAmount"/>
          <el-table-column align="center" width="160px" label="报价时间" prop="quotedTime">
            <template slot-scope="scope">
              {{scope.row.quotedTime | timeFmt}}
            </template>
          </el-table-column>
        </el-table>

        <Pagination :total="postData1.total" :page.sync="postData1.pageNum" :limit.sync="postData1.pageSize" @pagination="getDataList1" ></Pagination>

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

            <el-table-column min-width="150px" label="SKU描述" show-overflow-tooltip >
              <template slot-scope="scope">
                <div class="table-goods">
                  <div class="goods-text">
                    <div>{{scope.row.productDescription}}</div>
                    <div>sku编码：{{scope.row.skuCode}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" label="总订货量" prop="productQuantity">
              <template slot-scope="scope">
                {{scope.row.productQuantity}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="实际报价" prop="quotedPrice">
              <template slot-scope="scope">
                {{scope.row.quotedPrice}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="实际采购量">
              <template slot-scope="scope">
                {{scope.row.purchaseQuantity}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="实际总金额">
              <template slot-scope="scope">
                {{scope.row.purchaseAmount}}
              </template>
            </el-table-column>
          </el-table>

          <Pagination :total="rowClickData1.total" :page.sync="rowClickData1.pageNum" :limit.sync="rowClickData1.pageSize" @pagination="getQuotedSkuDetail" ></Pagination>

        </div>

        <div style="text-align: center;margin: 30px 0">
          <el-button type="danger" size="small" @click="closePage">返回</el-button>
        </div>

      </el-tab-pane>
      <el-tab-pane label="按商品报价" name="2">
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
        <div class="table-title">供应商产品报价明细列表<span>（点击可查看报价供应商）</span></div>
        <el-table
          :data="dataList2"
          border
          fit
          size="small"
          highlight-current-row
          :header-cell-style="{background: '#a7bfee'}"
          :row-class-name="tableRowClassName"
          @row-click="rowClick2">
          <el-table-column align="center" width="55">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.radio" :label="true">{{null}}</el-radio>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="序号"
            type="index"
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

          <el-table-column align="center" width="100px" label="询价量" prop="inquiryQuantity">
            <template slot-scope="scope">
              {{scope.row.inquiryQuantity || 0}}
            </template>
          </el-table-column>

          <el-table-column align="center" width="100px" label="最低报价单价" prop="minQuotePrice"/>

          <el-table-column align="center" width="100px" label="已选报价单价" prop="quotedPrice"/>

          <el-table-column align="center" width="200px" label="已选供应商" prop="supplierName"/>
        </el-table>
        <Pagination :total="postData2.total" :page.sync="postData2.pageNum" :limit.sync="postData2.pageSize" @pagination="getDataList2" ></Pagination>

        <div class="table-title">供应商报价列表：</div>
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
          </el-table-column>

          <el-table-column align="center" label="供应商编码">
            <template slot-scope="scope">
              {{scope.row.supplierInfo.supplierCode}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="供应商名称" prop="buyerName">
            <template slot-scope="scope">
              {{scope.row.supplierInfo.supplierName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="联系人" prop="concatName">
            <template slot-scope="scope">
              {{scope.row.supplierInfo.concatName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="联系电话" prop="concatMobile">
            <template slot-scope="scope">
              {{scope.row.supplierInfo.concatMobile}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="询价量" prop="inquiryQuantity">
            <template slot-scope="scope">
              {{scope.row.inquiryQuantity}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="报价单价" prop="quotedPrice">
            <template slot-scope="scope">
              {{scope.row.quotedPrice}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="总金额" prop="quotedAmount">
            <template slot-scope="scope">
              {{scope.row.quotedAmount}}
            </template>
          </el-table-column>
        </el-table>

        <Pagination :total="rowClickData2.total" :page.sync="rowClickData2.pageNum" :limit.sync="rowClickData2.pageSize" @pagination="getInquiryQuotedSupplier" ></Pagination>

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
  selectSupplierQuotedListApi,
  getPurchaseQuotedByBIdApi,
  preferencePurchaseInquirySku,
  preferencePurchaseInquirySupplier,
  getPurchaseInquiryDetail
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
      editForm: {
        rangeTime: []
      },
      postData1: {
        sellerCode: '',
        sellerName: '',
        purchaseInquiryBId: this.$route.query.id,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      postData2: {
        productDescription: '',
        productCode: '',
        productName: '',
        skuCode: '',
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
        purchaseQuotedBId: ''
      },
      rowClickData2: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        skuBId: '',
        purchaseInquiryBId: ''
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
    this.getDetail()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchaseOrderInquiry'
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.quotedPrice && Number(row.quotedPrice) === Number(row.minQuotePrice)) {
        return 'warning-row';
      }
      return '';
    },
    searchData1() {
      this.postData1.pageNum = 1;
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
      selectSupplierQuotedListApi(obj).then(res => {
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
      obj.purchaseInquiryBId = this.$route.query.id;
      preferencePurchaseInquirySku(obj).then(res => {
        this.dataList2 = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.postData2.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getQuotedSkuDetail() {
      this.listLoading1 = true;
      getPurchaseQuotedByBIdApi(this.rowClickData1).then(res => {
        this.rowClickData1.total = res.data.total;
        this.dataClickList1 = res.data.list;
        this.listLoading1 = false;
      }).catch(err => {
        this.listLoading1 = false;
        this.$message.error(err.message)
      });
    },
    getInquiryQuotedSupplier() {
      this.listLoading1 = true;
      preferencePurchaseInquirySupplier(this.rowClickData2).then(res => {
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
      this.rowClickData1.purchaseQuotedBId = row.bid;
      this.getQuotedSkuDetail()
    },

    rowClick2(row) {
      this.dataList2.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.rowClickData2.skuBId = row.skuBId;
      this.rowClickData2.purchaseInquiryBId = this.$route.query.id;
      this.getInquiryQuotedSupplier()
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    deleteMenu() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      if (this.selectList.length > 1) {
        return this.$message('一次只能删除一条记录');
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
    }
  },
  filters: {
    statusName(status) {
      const statusMap = ['待报价', '报价中', '已报价', '采购中', '采购驳回', '已采购'];
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
  .inquiry-summary {
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
    .warning-row {
      background: #f0f9eb;
    }
  }
</style>
