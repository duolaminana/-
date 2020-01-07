<template>
  <div class="app-container preference-purchase-inquiry">
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

    <div class="table-box">
      <div>
        <el-form label-width="90px" inline size="small">
          <el-form-item label="商品编码">
            <el-input v-model="postData.productCode" clearable placeholder="请输入商品编码" style="width: 240px" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="postData.productName" clearable placeholder="请输入商品名称" style="width: 240px" />
          </el-form-item>
          <el-form-item label="SKU名称">
            <el-input v-model="postData.productDescription" clearable placeholder="请输入SKU名称" style="width: 240px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-top">
        <div>供应商报价商品列表：</div>
      </div>
      <el-table
        :data="inquirySkuList"
        border
        fit
        size="small"
        highlight-current-row
        :header-cell-style="{background: '#a7bfee'}"
        :row-class-name="tableRowClassName"
        @row-click="rowClick1">

        <el-table-column align="center" width="60">
          <template slot-scope="scope">
            <el-radio v-model="scope.row.radio" :label="true">{{null}}</el-radio>
          </template>
        </el-table-column>

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

        <el-table-column align="center" width="60px" label="单位" prop="productUnit"/>

        <el-table-column align="center" width="100px" label="最低报价单价" prop="minQuotePrice"/>

        <el-table-column align="center" width="100px" label="已选报价单价" prop="quotedPrice"/>

        <el-table-column align="center" width="200px" label="已选供应商" prop="supplierName"/>

      </el-table>
      <div class="sku-total">
        <div class="total-left">合计：</div>
        <div class="total-right">
          <div>最低报价总金额：<span>{{statistics.sumMinQuotePrice}}</span>预选采购总金额：<span>{{statistics.sumTotalQuotePrice}}</span>超出比率：<span>{{statistics.beyondRate}}</span></div>
          <div>（未确认供应商SKU数：<span>{{statistics.quoteCountZero || 0}}个</span>已选择供应商SKU数：<span>{{statistics.quoteCountOne || 0}}个</span>）</div>
        </div>
      </div>
      <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getInquirySkuList" ></Pagination>

      <div class="table-top">
        <div style="float: left">供应商报价列表：</div>
        <div class="table-top-right">
          <el-button type="primary" size="small" @click="confirmSelect">确认预选</el-button>
        </div>
      </div>
      <el-table
        :data="inquirySupplierList"
        border
        fit
        size="mini"
        highlight-current-row
        :header-cell-style="{background: '#a7bfee'}"
        @row-click="rowClick2">
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
      <Pagination :total="supplierPostData.total" :page.sync="supplierPostData.pageNum" :limit.sync="supplierPostData.pageSize" @pagination="getQuotedSupplierList" ></Pagination>
    </div>

    <el-dialog :visible.sync="previewModal" title="采购询价优选方案预览" width="1000px" center :close-on-click-modal="false">

      <el-tabs type="card" value="first">
        <el-tab-pane label="已选询价供应商" name="first">
          <el-table
            :data="previewSupplierList"
            border
            fit
            size="mini"
            highlight-current-row
            :header-cell-style="{background: '#a7bfee'}"
            @row-click="previewRowClick">
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

            <el-table-column align="center" label="SKU数" prop="skuNumber">
              <template slot-scope="scope">
                {{scope.row.skuNumber}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="金额" prop="sumInquiryQuantity"/>

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

            <el-table-column align="center" label="邮箱地址" prop="email">
              <template slot-scope="scope">
                {{scope.row.supplierInfo.emailAddress}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <Pagination :total="previewSupplierPostData.total" :page.sync="previewSupplierPostData.pageNum" :limit.sync="previewSupplierPostData.pageSize" @pagination="getPreviewSupplierList" ></Pagination>
      </el-tabs>

      <el-tabs type="card" value="first">
        <el-tab-pane label="供应商商品列表" name="first">
          <el-table
            v-loading="previewLoading"
            :data="previewSkuList"
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

            <el-table-column width="180px" label="SKU描述" >
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

            <el-table-column align="center" width="80px" label="单位" prop="productUnit">
              <template slot-scope="scope">
                {{scope.row.productUnit}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80px" label="报价" prop="quotedPrice">
              <template slot-scope="scope">
                {{scope.row.quotedPrice}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80px" label="采购量" prop="quotedPrice">
              <template slot-scope="scope">
                {{scope.row.inquiryQuantity}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100px" label="金额" prop="quotedAmount">
              <template slot-scope="scope">
                {{scope.row.quotedAmount}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <Pagination :total="skuPostData.total" :page.sync="skuPostData.pageNum" :limit.sync="skuPostData.pageSize" @pagination="getPreviewSkuList" ></Pagination>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="previewModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <div style="text-align: center;margin: 40px 0">
      <el-button type="primary" size="small" class="export" @click="openPreviewDialog">询价方案预览</el-button>
      <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit">生成采购订单</el-button>
      <el-button type="danger" size="small" @click="closePage">返回</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime, deepClone } from '@/utils/index'
import {
  getPurchaseInquiryDetail,
  preferencePurchaseInquirySupplier,
  preferencePurchaseInquirySku,
  confirmPreferenceSupplier,
  preferencePurchaseInquiryTotal,
  getPurchaseQuotedSkuByBId,
  getPreviewSupplier,
  setPurchaseInquiryOrder
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
      saveLoading: false,
      previewModal: false,
      previewLoading: false,
      postData: {
        productName: '',
        productCode: '',
        productDescription: '',
        skuCode: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      supplierPostData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        purchaseQuotedBid: '',
        skuBId: ''
      },
      previewSupplierPostData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        purchaseInquiryBId: '',
        selectFlag: 1
      },
      skuPostData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierBId: ''
      },
      inquirySkuList: [],
      inquirySupplierList: [],
      editForm: {
        rangeTime: []
      },
      purchaseinquiryBId: this.$route.query.id,
      inquirySkuDetail: {},
      selectSupplier: null,
      statistics: {},
      previewSupplierList: [],
      previewSkuList: []
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
    if (this.purchaseinquiryBId) {
      this.getDetail();
      this.getInquirySkuList();
      this.getSumTotal()
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
    tableRowClassName({ row, rowIndex }) {
      if (row.quotedPrice && Number(row.quotedPrice) === Number(row.minQuotePrice)) {
        return 'warning-row';
      }
      return '';
    },
    rowClick1(row) {
      this.inquirySkuList.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.inquirySkuDetail = deepClone(row);
      this.supplierPostData.skuBId = row.skuBId;
      this.supplierPostData.purchaseInquiryBId = this.purchaseinquiryBId;
      this.getQuotedSupplierList()
    },
    rowClick2(row) {
      this.inquirySupplierList.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.selectSupplier = deepClone(row)
    },
    openPreviewDialog() {
      this.previewModal = true;
      this.previewSkuList = [];
      this.skuPostData.total = 0;
      this.getPreviewSupplierList()
    },
    previewRowClick(row) {
      this.previewSupplierList.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.skuPostData.supplierBId = row.supplierBId;
      this.getPreviewSkuList()
    },
    getPreviewSupplierList() {
      this.previewSupplierPostData.purchaseInquiryBId = this.purchaseinquiryBId;
      getPreviewSupplier(this.previewSupplierPostData).then(res => {
        this.previewSupplierList = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.previewSupplierPostData.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getPreviewSkuList() {
      this.previewLoading = true;
      this.skuPostData.purchaseInquiryBId = this.purchaseinquiryBId;
      getPurchaseQuotedSkuByBId(this.skuPostData).then(res => {
        this.previewSkuList = res.data.list.map(e => {
          return { ...e }
        });
        this.previewLoading = false;
        this.skuPostData.total = res.data.total
      }).catch(err => {
        this.previewLoading = false;
        this.$message.error(err.message)
      });
    },
    getDetail() {
      let obj = {
        bid: this.purchaseinquiryBId
      };
      getPurchaseInquiryDetail(obj).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.rangeTime = [this.editForm.beginTime, this.editForm.endTime];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSumTotal() {
      let obj = {
        purchaseInquiryBid: this.purchaseinquiryBId
      };
      preferencePurchaseInquiryTotal(obj).then(res => {
        this.statistics = res.data
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getQuotedSupplierList() {
      preferencePurchaseInquirySupplier(this.supplierPostData).then(res => {
        this.inquirySupplierList = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.supplierPostData.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    confirmSelect() {
      if (!this.selectSupplier) {
        return this.$message.warning('请先选择报价供应商');
      }
      let obj = {
        selectFlag: 1,
        purchaseInquiryBId: this.purchaseinquiryBId,
        supplierBId: this.selectSupplier.supplierBId,
        inquiryDetailBId: this.inquirySkuDetail.bid
      };
      confirmPreferenceSupplier(obj).then(res => {
        this.getInquirySkuList();
        this.getSumTotal();
        this.inquirySupplierList = [];
        this.selectSupplier = null;
        this.inquirySkuDetail = null;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getInquirySkuList();
    },
    getInquirySkuList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      obj.purchaseInquiryBId = this.purchaseinquiryBId;
      preferencePurchaseInquirySku(obj).then(res => {
        this.inquirySkuList = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.postData.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    onSubmit() {
      this.saveLoading = false;
      for (let i = 0; i < this.inquirySkuList.length; i++) {
        if (!this.inquirySkuList[i].supplierName) {
          return this.$message.warning('请给商品选择采购供应商')
        }
      }
      let obj = {
        purchaseInquiryBId: this.purchaseinquiryBId,
        purchaseInquiryProductDetailList: this.inquirySkuList
      };
      setPurchaseInquiryOrder(obj).then(res => {
        this.$message.success('生成订单成功，请去采购订单管理填写完整再提交');
        this.closePage()
      }).catch(err => {
        this.$message.error(err);
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .preference-purchase-inquiry {
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
    .table-box {
      border-top: 1px solid #ccc;
      margin-top: 50px;
      padding: 20px;
    }
    .table-top {
      line-height: 40px;
      height: 40px;
      padding: 5px;
      border-top: 1px solid $border-light-color;
      margin-top: 20px;
      .table-top-right {
        float: right;
        margin-right: 50px;
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
    .td-text {
      line-height: 12px;
    }
    .sku-total {
      display: -webkit-flex;
      display: flex;
      height: 80px;
      border: 1px solid $border-light-color;
      .total-left {
        flex: 1;
        left: 50px;
        font-size: 18px;
        line-height: 80px;
        padding-right: 10px;
        text-align: right;
        border-right: 1px solid $border-light-color;
      }
      .total-right {
        flex: 1;
        padding: 10px;
        font-size: 14px;
        line-height: 1.5rem;
        span {
          color: red;
          display: inline-block;
          margin-right: 16px;
        }
      }
    }
    .warning-row {
      background: #f0f9eb;
    }
  }
</style>
