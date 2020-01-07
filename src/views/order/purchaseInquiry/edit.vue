<template>
  <div class="app-container edit-purchase-inquiry">
    <div class="edit-title">采购询价单</div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" style="margin-top: 20px"
             :rules="editFormRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="询价单单号" prop="inquiryCode">
            {{editForm.inquiryCode}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="currency">
            <el-select v-model="editForm.currency"
                       filterable
                       remote
                       :remote-method="getCurrencyCodeList"
                       :loading="loading2"
                       clearable
                       class="edit-form-width"
                       placeholder="请输入币种名或者币种编码查找">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr"
                         :value="item.searchCurrencyCodeStr" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="询价单名称" prop="inquiryName">
            <el-input v-model="editForm.inquiryName" clearable placeholder="请输入询价单名称" style="width: 80%"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="询价日期" prop="rangeTime">
            <el-date-picker
              v-model="editForm.rangeTime"
              type="datetimerange"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getRangeTime">
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
            <el-select v-model="editForm.transportType" clearable placeholder="请选择运输方式" class="edit-form-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="目的港口/地址" prop="transportAddress">
            <el-input v-model="editForm.transportAddress" clearable placeholder="请输入目的港口/地址" style="width: 80%"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="inquiryRemarks">
            <el-input v-model="editForm.inquiryRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea"
                      size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-form-item style="text-align: center" v-if="!editType">-->
      <!--<el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit('editForm', 0)">保存</el-button>-->
      <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
      <!--</el-form-item>-->
    </el-form>

    <div class="sale-order-table">
      <div class="table-top">
        <div style="float: left">选择的待销售订单：</div>
        <div class="table-top-right">
          <el-button type="primary" size="small" :disabled="!editType" @click="openDialog">从销售订单新增</el-button>
          <el-button type="danger" size="small" :disabled="!editType" @click="delInquirySaleOrder">删除</el-button>
        </div>
      </div>
      <el-table
        :data="inquirySaleOrderList"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getDelSelect">

        <el-table-column align="center" type="selection" width="55"/>

        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="55">
        </el-table-column>

        <el-table-column align="center" label="订单号" prop="salesOrderNo" show-overflow-tooltip/>

        <el-table-column align="center" label="客户名称" prop="buyerName" show-overflow-tooltip/>

        <el-table-column align="center" label="所属国家" prop="buyerCountry" show-overflow-tooltip/>

        <el-table-column align="center" label="SKU数" prop="skuNumber" show-overflow-tooltip>
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
      <Pagination :total="inquiryPostData.total" :page.sync="inquiryPostData.pageNum"
                  :limit.sync="inquiryPostData.pageSize" @pagination="getSaleOrderByBId"></Pagination>

      <div class="table-top">
        <div style="float: left">选择的订单待采购商品：</div>
        <div class="table-top-right">
          <el-button type="danger" size="small" :disabled="!editType" @click="deleteInquirySku">删除</el-button>
        </div>
      </div>
      <el-table
        :data="inquirySkuList"
        border
        fit
        size="small"
        max-height="600"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSkuSelect">

        <el-table-column align="center" type="selection" width="55"/>

        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="55">
        </el-table-column>

        <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo">
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

        <el-table-column min-width="150px" label="SKU描述" show-overflow-tooltip>
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

        <el-table-column align="center" width="100" label="询价量" prop="inquiryQuantity">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.inquiryQuantity" size="small" :min="0" class="input-center"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="180px" label="询价备注" prop="inquiryRemark" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.inquiryRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea"
                      size="small" clearable/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="70px" label="供应商数" prop="supplierNumber"/>

        <el-table-column align="center" width="200px" label="已选供应商">
          <template slot-scope="scope">
            <span class="svgClass" @click="openSupplierDialog(scope.row)">点击选择<svg-icon icon-class="add" class-name="svgClass" size="20"></svg-icon></span>
            <p v-for="(item, index) in scope.row.pioslist" :key="index" class="td-text">
              {{index+1}}、{{item.supplierInfo.supplierName}}
              <svg-icon icon-class="delete" class-name="svgClass" size="16" @click.native="delInquirySkuSupplier(item.id)"/>
            </p>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-dialog :visible.sync="dialogVisible" title="选择销售订单" width="1000px" center :close-on-click-modal="false">
      <div class="search-box">
        <el-form label-width="90px" inline size="small">
          <el-form-item label="订单号">
            <el-input v-model="postData.orderNo" clearable placeholder="销售订单号" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="postData.customerUserName" clearable placeholder="客户名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="所属国家">
            <el-input v-model="postData.customerCountryCode" clearable placeholder="国家名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="订单日期">
            <el-date-picker
              v-model="postData.rangeTime"
              type="datetimerange"
              unlink-panels
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="getRangeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="listLoading"
        :data="saleOrderList"
        element-loading-text="正在查询中。。。"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column align="center" type="selection" width="55"/>

        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="55">
          <template slot-scope="scope"><span>{{scope.$index+(postData.pageIndex - 1) * postData.pageSize + 1}} </span></template>
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

        <el-table-column align="center" width="160" label="订单日期" prop="orderTime">
          <template slot-scope="scope">
            {{scope.row.orderTime | timeFmt}}
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                  @pagination="getWaitSaleOrderList"></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addSaleOrder">确定</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="supplierModal" title="选择供应商" width="500px" center :close-on-click-modal="false">
      <el-table
        :data="supplierList"
        border
        fit
        size="mini"
        max-height="300"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSupplierSelect">
        <el-table-column align="center" type="selection" width="55"/>

        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="55">
        </el-table-column>

        <el-table-column align="center" label="供应商名称" prop="supplierName"/>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addInquirySkuSupplier">确定</el-button>
        <el-button type="danger" size="small" @click="supplierModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="previewModal" title="采购询价方案预览" width="1000px" center :close-on-click-modal="false">

      <el-tabs type="card" value="first">
        <el-tab-pane label="已选询价供应商" name="first">
          <el-table
            :data="previewSupplierList"
            border
            fit
            size="mini"
            highlight-current-row
            :header-cell-style="{background: '#a7bfee'}"
            @row-click="rowClick">
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
              <template slot-scope="scope"><span>{{scope.$index+(supplierPostData.pageNum - 1) * supplierPostData.pageSize + 1}} </span></template>
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

            <el-table-column align="center" label="询价总量" prop="sumInquiryQuantity"/>

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
        <Pagination :total="supplierPostData.total" :page.sync="supplierPostData.pageNum"
                    :limit.sync="supplierPostData.pageSize" @pagination="getPreviewSupplierList"></Pagination>
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
              <template slot-scope="scope"><span>{{scope.$index+(skuPostData.pageNum- 1) * skuPostData.pageSize + 1}} </span></template>
            </el-table-column>

            <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo">
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

            <el-table-column width="180px" label="SKU描述">
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
                <el-input-number v-model="scope.row.inquiryQuantity" disabled controls-position="right" size="small"
                                 :min="0"/>
              </template>
            </el-table-column>

            <el-table-column align="center" width="180px" label="询价备注" prop="inquiryRemark">
              <template slot-scope="scope">
                <el-input v-model="scope.row.inquiryRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea"
                          size="small" disabled/>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <Pagination :total="skuPostData.total" :page.sync="skuPostData.pageNum" :limit.sync="skuPostData.pageSize"
                    @pagination="getPreviewSkuList"></Pagination>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="previewModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <div class="table-top"></div>

    <div style="text-align: center;margin: 30px 0;">
      <el-button type="primary" size="small" v-if="editType" class="export" @click="openPreviewDialog">询价方案预览
      </el-button>
      <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit('editForm', 0)">保存</el-button>
      <el-button type="primary" size="small" v-if="editType" :loading="saveLoading" @click="onSubmit('editForm', 1)">
        提交
      </el-button>
      <el-button type="danger" size="small" @click="closePage">返回</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime, deepClone } from '@/utils/index'
import { selectCurrencyCodeListApi } from '@/api/system'
import { searchSupplierList, getSupplierList } from '@/api/supplier'
import {
  getWaitPurchaseSaleOrder,
  addPurchaseInquiryOrder,
  updatePurchaseInquiryOrder,
  addSaleOrderWithInquiry,
  getPurchaseInquiryDetail,
  getPurchaseInquiryWithSaleOrder,
  getPurchaseInquiryWithSku,
  delInquirySaleOrder,
  savePurchaseInquirySkuSupplier,
  deletePurchaseInquirySkuSupplier,
  deletePurchaseInquirySku,
  getPreviewSku,
  getPreviewSupplier,
  setPurchaseInquiryNo
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
      previewLoading: false,
      dialogVisible: false,
      supplierModal: false,
      previewModal: false,
      loading1: false,
      loading2: false,
      saveLoading: false,
      editType: false,
      currencyCodeList: [],
      selectList: [],
      delSelectList: [],
      supplierSelectList: [],
      skuSelectList: [],
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
      supplierPostData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        purchaseInquiryBId: ''
      },
      skuPostData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierBid: '',
        purchaseInquiryBid: ''
      },
      saleOrderList: [],
      inquirySaleOrderList: [],
      inquirySkuList: [],
      supplierList: [],
      previewSupplierList: [],
      previewSkuList: [],
      cloneList: [],
      inquirySkuDetail: {},
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
      },
      editFormRules: {
        inquiryName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        inquiryCode: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        transportAddress: [{ required: true, message: '请输入港口', trigger: 'blur' }],
        currency: [{ required: true, message: '请选择币种', trigger: 'change' }],
        rangeTime: [{ required: true, message: '请选择日期', trigger: 'change' }]
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
    this.getCurrencyCodeList();
    if (this.$route.query.id || localStorage.getItem('id')) {
      this.editType = true;
      this.getDetail();
      this.getSaleOrderByBId();
      this.getSaleOrderSkuByBId()
    } else {
      this.setPurchaseInquiryNo()
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
    getRangeTime(arr) {
      if (arr && arr.length) {
        this.editForm.beginTime = new Date(arr[0]);
        this.editForm.endTime = new Date(arr[1]);
      } else {
        this.editForm.beginTime = '';
        this.editForm.endTime = '';
      }
    },
    // 生成询价单号
    setPurchaseInquiryNo() {
      setPurchaseInquiryNo().then(res => {
        this.editForm.inquiryCode = res.data
      })
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    openDialog() {
      this.dialogVisible = true;
      this.getWaitSaleOrderList()
    },
    searchData() {
      this.postData.pageIndex = 1;
      this.getWaitSaleOrderList()
    },
    getWaitSaleOrderList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      this.listLoading = true;
      getWaitPurchaseSaleOrder(obj).then(res => {
        this.saleOrderList = res.data.list.map(e => {
          return { ...e }
        });
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    addSaleOrder() {
      if (!this.selectList.length) {
        return this.$message.warning('请先选择销售订单')
      }
      let obj = {
        purchaseInquiryBId: this.$route.query.id || localStorage.getItem('id'),
        salesOrderList: this.selectList
      };
      addSaleOrderWithInquiry(obj).then(res => {
        this.$message.success('添加成功');
        this.getSaleOrderByBId();
        this.getSaleOrderSkuByBId();
        this.dialogVisible = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    delInquirySaleOrder() {
      if (this.delSelectList.length !== 1) {
        return this.$message.warning('请选择一条数据删除')
      }
      this.$confirm('是否删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          salesOrderBId: this.delSelectList.map(e => e.salesOrderBId).join(',')
        };
        delInquirySaleOrder(obj).then(res => {
          this.getSaleOrderByBId();
          this.getSaleOrderSkuByBId();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    deleteInquirySku() {
      if (!this.skuSelectList.length) {
        return this.$message.warning('请选择一条商品')
      }
      this.$confirm('是否删除改商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          bid: this.skuSelectList.map(e => e.bid).join(',')
        };
        this.cloneList = deepClone(this.inquirySkuList);
        deletePurchaseInquirySku(obj).then(res => {
          this.getSaleOrderSkuByBId();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    openSupplierDialog(row) {
      this.cloneList = deepClone(this.inquirySkuList);
      this.supplierModal = true;
      this.inquirySkuDetail = deepClone(row);
      this.getSupplierListBySkuBId(row, row.skuBId)
    },
    getSupplierListBySkuBId(row, id) {
      if (row.supplierNumber !== 0) {
        searchSupplierList({ skuBId: id }).then(res => {
          this.supplierList = res.data || []
        }).catch(err => {
          this.$message.error(err.message)
        });
      } else {
        getSupplierList().then(res => {
          this.supplierList = res.data || []
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    addInquirySkuSupplier() {
      if (!this.supplierSelectList.length) {
        return this.$message.warning('请选择供应商')
      }
      let obj = {
        inquiryDetailBId: this.inquirySkuDetail.bid,
        purchaseInquiryBId: this.inquirySkuDetail.purchaseInquiryBId,
        strlist: this.supplierSelectList.map(e => {
          return e.supplierBId ? e.supplierBId : e.bid;
        })
      };
      savePurchaseInquirySkuSupplier(obj).then(res => {
        this.getSaleOrderSkuByBId();
        this.supplierModal = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    delInquirySkuSupplier(id) {
      this.cloneList = deepClone(this.inquirySkuList);
      deletePurchaseInquirySkuSupplier({ id: id }).then(res => {
        this.getSaleOrderSkuByBId();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openPreviewDialog() {
      // for (let i = 0; i < this.inquirySkuList.length; i++) {
      //   if (!this.inquirySkuList[i].pioslist.length) {
      //     return this.$message.warning('请先给商品添加询价供应商并保存')
      //   }
      // }
      this.previewModal = true;
      this.previewSkuList = [];
      this.skuPostData.total = 0;
      this.getPreviewSupplierList()
    },
    getPreviewSupplierList() {
      this.supplierPostData.purchaseInquiryBId = this.$route.query.id || localStorage.getItem('id');
      getPreviewSupplier(this.supplierPostData).then(res => {
        this.previewSupplierList = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.supplierPostData.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getPreviewSkuList() {
      this.previewLoading = true;
      getPreviewSku(this.skuPostData).then(res => {
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
    rowClick(row) {
      this.previewSupplierList.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      this.skuPostData.supplierBid = row.supplierBId;
      this.skuPostData.purchaseInquiryBid = row.purchaseInquiryBId;
      this.getPreviewSkuList()
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    getDelSelect(selects) {
      this.delSelectList = selects;
    },
    getSupplierSelect(selects) {
      this.supplierSelectList = selects;
    },
    getSkuSelect(selects) {
      this.skuSelectList = selects;
    },
    getDetail() {
      let obj = {
        bid: this.$route.query.id || localStorage.getItem('id')
      };
      getPurchaseInquiryDetail(obj).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.rangeTime = [this.editForm.beginTime, this.editForm.endTime];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleOrderByBId() {
      this.inquiryPostData.purchaseInquiryBId = this.$route.query.id || localStorage.getItem('id');
      getPurchaseInquiryWithSaleOrder(this.inquiryPostData).then(res => {
        this.inquirySaleOrderList = res.data.list;
        this.inquiryPostData.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleOrderSkuByBId() {
      let obj = {
        purchaseInquiryBId: this.$route.query.id || localStorage.getItem('id')
      };
      getPurchaseInquiryWithSku(obj).then(res => {
        this.inquirySkuList = res.data.map(e => {
          this.cloneList.forEach(t => {
            if (t.skuBId === e.skuBId) {
              e.inquiryRemark = t.inquiryRemark;
              e.inquiryQuantity = t.inquiryQuantity
            }
          });
          e.inquiryQuantity = e.inquiryQuantity || e.productQuantity;
          e.pioslist = e.pioslist || [];
          return { ...e }
        });
        this.cloneList = [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    onSubmit(formName, status) {
      if (status) {
        if (!this.inquirySkuList.length) {
          return this.$message.warning('请选择待询价商品')
        }
        for (let i = 0; i < this.inquirySkuList.length; i++) {
          if (!this.inquirySkuList[i].pioslist.length) {
            return this.$message.warning('请选择询价供应商')
          }
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.editType ? updatePurchaseInquiryOrder : addPurchaseInquiryOrder;
          this.saveLoading = true;
          this.editForm.inquiryStatus = status;
          this.editForm.bid = this.$route.query.id || localStorage.getItem('id');
          this.editForm.pipdlist = this.inquirySkuList;
          api(this.editForm).then(res => {
            this.saveLoading = false;
            this.$message.success(status === 2 ? '提交成功' : '保存成功');
            if (!this.editType) {
              this.editForm.bid = res.data;
              localStorage.setItem('id', res.data);
              this.editType = true;
            } else {
              this.closePage()
            }
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== this.$router.path) {
      localStorage.removeItem('id')
    }
    next();
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
        > div {
          font-size: 12px;
        }
      }
    }
    .td-text {
      line-height: 12px;
    }
    .svgClass {
      cursor: pointer;
      margin-left: 5px;
    }
    .svgClass:hover {
      color: #DD4A68;
    }
  }
</style>
