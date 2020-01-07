<template>
  <div class="app-container productSupport">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item :label="$t('supplier.record.supplierName')">
          <el-input v-model.trim="postData.supplierName" clearable placeholder="" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('product.product.productCode')">
          <el-input v-model.trim="postData.productCode" clearable placeholder="" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')">
          <el-input v-model.trim="postData.productName" clearable placeholder="" style="width: 200px" />
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model.trim="postData.attrValueList" clearable placeholder="" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Search"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('supplier.record.supplierName')" prop="supplierName" show-overflow-tooltip/>

      <el-table-column :label="$t('product.categoryTemplate.category')" prop="catalogBName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product.productCode')" prop="productCode" show-overflow-tooltip/>
      <el-table-column :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product.skuCode')" prop="skuCode" show-overflow-tooltip/>
      <el-table-column label="SKU" prop="attrValueList">
        <template slot-scope="scope">
          {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100px" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="140px" :label="$t('common.table.updateTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" :label="$t('common.table.actions')" prop="labelStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.priceStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.priceStatus === 1 ? this.$t('product.product.haveShop') : this.$t('product.product.stopShop') }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSupplierProductList } from '@/api/supplier';
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      saveLoading: false,
      editVisible: false,
      detailVisible: false,
      selectList: [],
      parentsName: [],
      searchDataList: [],
      productSkuList: [],
      supplierList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        catalogBId: '',
        attrValueList: '',
        productName: ''
      },
      dataList: [],
      dialogForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: ''
      },
      addForm: {
        supplierBId: '',
        priceStatus: 1
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getSupplierProductList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
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
  .productSupport {
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
