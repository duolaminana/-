<template>
  <div class="app-container supplierProduct">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="商品类目">
          <el-cascader
            :key="isZh"
            style="width: 200px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="postData.productName" clearable placeholder="请输入商品名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="postData.attrValueList" clearable placeholder="请输入SKU" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getDataSelect">
      <!--<el-table-column-->
      <!--align="center"-->
      <!--type="selection"-->
      <!--width="55">-->
      <!--</el-table-column>-->
      <!--      <el-table-column align="center" label="商品编码" prop="productCode" />-->
      <!--      <el-table-column align="center" label="商品名称" prop="productName" />-->
      <el-table-column label="商品编码/商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <a style="color: #1e6abc" @click="detailAdjustSkuBySku2(scope.row)">{{scope.row.productCode
            }}/{{scope.row.productName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="商品SKU" prop="attrValueList" show-overflow-tooltip/>
      <el-table-column label="最低价格/起订量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.lowPrice }}/{{scope.row.lowMinimum }}
        </template>
      </el-table-column>
      <el-table-column label="最高价格/起订量" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.maxPrice }}/{{scope.row.maxMinimum }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商数量" prop="supplierNumber" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="操作" width="110" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailAdjustSkuBySku(row)">查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="detailModal" title="供应价格明细" center width="800px">
      <el-form :model="dialogForm" label-width="130px" label-position="left" inline size="small">
        <el-form-item label="商品类目">
          <el-input v-model="dialogForm.catalogBName" clearable placeholder="商品编码" style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="dialogForm.productName" clearable placeholder="商品编码" style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item label="商品SKU">
          <el-input v-model="dialogForm.attrValueList" clearable placeholder="商品编码" style="width: 580px" readonly/>
        </el-form-item>
      </el-form>
      <el-table
        :data="showRecordList"
        height="250"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unitPrice" label="价格" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="minimum" label="起订量" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal2" title="供应价格明细" center width="700px">
      <el-form :model="dialogForm" label-width="100px" label-position="left" inline size="small">
        <el-form-item label="商品类目">
          <el-input v-model="dialogForm.catalogBName" clearable placeholder="商品编码" readonly/>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="dialogForm.productName" clearable placeholder="商品编码" readonly/>
        </el-form-item>
        <!--        <el-form-item label="商品SKU">-->
        <!--          <el-input v-model="dialogForm.attrValueList" clearable placeholder="商品编码" style="width: 580px" readonly />-->
        <!--        </el-form-item>-->
      </el-form>
      <el-table
        :data="showRecordList2"
        height="250"
        border
        size="small"
        highlight-current-row
        @current-change="handleCurrentChange"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="attrValueList" label="sku" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierNumber" label="供应商数量" align="center" show-overflow-tooltip></el-table-column>
      </el-table>

      <el-table
        :data="showRecordList3"
        height="250"
        border
        size="small"
        :header-cell-style="{background: '#a7bfee'}"
        style="margin-top: 20px">
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
        <el-table-column prop="unitPrice" label="价格" align="center"></el-table-column>
        <el-table-column prop="minimum" label="起订量" align="center"></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal2=false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory } from '@/api/product'
import { selectPageProductSku, selectSupplierDetailBySkuBid, selectSupplierDetailByProductBid } from '@/api/price';
import { deepClone } from '@/utils/index'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    priceStatusFmt(val) {
      switch (val) {
        // 价格状态：1有效、2无效、3停止采购
        case 1:
          return '有效';
        case 2:
          return '无效';
        case 3:
          return '停止采购';
        default:
          return '不存在';
      }
    }
  },
  data() {
    return {
      listLoading: true,
      detailModal: false,
      detailModal2: false,
      parentsName: [],
      searchDataList: [],
      selectDataList: [],
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        catalogBName: '',
        attrValueList: '',
        productName: ''
      },
      dataList: [],
      dialogForm: {
        catalogBId: '',
        catalogBName: '',
        productName: '',
        attrValueList: '',
        skuBId: ''
      },
      showRecordList: [],
      showRecordList2: [],
      showRecordList3: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList();
  },
  methods: {
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageIndex: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    handleCurrentChange(row) {
      this.showRecordList3 = row.supplierProductSkuList || []
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    // 供应商价格列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      selectPageProductSku(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    // 供应商价格调整历史详情
    detailAdjustSkuBySku(row) {
      this.dialogForm = deepClone(row);
      selectSupplierDetailBySkuBid({ skuBid: row.bid }).then(res => {
        if (res.status === 200) {
          this.showRecordList = res.data;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.detailModal = true;
    },
    detailAdjustSkuBySku2(row) {
      this.dialogForm = deepClone(row);
      this.showRecordList3 = [];
      selectSupplierDetailByProductBid({ productBid: row.productBId }).then(res => {
        if (res.status === 200) {
          this.showRecordList2 = res.data;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.detailModal2 = true;
    },
    getDataSelect(selects) {
      this.selectDataList = selects;
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.supplierProduct {
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

  .menuDialog {
    .el-dialog {
      width: 700px;
    }
  }
}
</style>
