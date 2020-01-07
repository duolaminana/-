<template>
  <div class="app-container supplierProduct">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('price.saleablePrice.customerName')">
            <el-input v-model.trim="postData.customerName" clearable :placeholder="$t('price.saleablePrice.customerName')" style="width: 200px"/>
          </el-form-item>
          <!--<el-form-item :label="$t('price.saleablePrice.catalogBName')">-->
            <!--<el-input v-model="postData.catalogBName" clearable :placeholder="$t('price.saleablePrice.catalogBName')" style="width: 200px"/>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('product.categoryTemplate.category')">
            <el-cascader
              :key="isZh"
              style="width: 200px"
              v-model="parentsName"
              :options="categoryList"
              :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
              filterable
              clearable
              :placeholder="$t('common.search')"
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('price.saleablePrice.productName')">
            <el-input v-model.trim="postData.productName" clearable :placeholder="$t('price.saleablePrice.productName')" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('price.saleablePrice.attrValueList')">
            <el-input v-model.trim="postData.attrValueList" clearable :placeholder="$t('price.saleablePrice.attrValueList')" style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openAddModifyPrice()">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      :element-loading-text="$t('common.search')"
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
      <el-table-column :label="$t('price.saleablePrice.customerName')" prop="customerName" show-overflow-tooltip/>
      <el-table-column :label="$t('price.saleablePrice.catalogBName2')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('price.saleablePrice.productName')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('price.saleablePrice.attrValueList')" prop="attrValueList" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('price.saleablePrice.price')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="160" :label="$t('price.saleablePrice.updateTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="90" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailAdjustSkuBySku(row)">{{$t('common.table.Adjust')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="detailModal" :title="$t('price.saleablePrice.SupplierPriceRecordView')" center width="800px">
      <el-form :model="dialogForm" label-width="130px" label-position="right" inline size="small">
        <el-form-item v-if="isZh" :label="$t('price.saleablePrice.catalogBName2')">
          <el-input v-model="dialogForm.cnCatalogBName" clearable style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item v-else :label="$t('price.saleablePrice.catalogBName2')">
          <el-input v-model="dialogForm.enCatalogBName" clearable style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item v-if="isZh" :label="$t('price.saleablePrice.productName')">
          <el-input v-model="dialogForm.cnProductName" clearable style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item v-else :label="$t('price.saleablePrice.productName')">
          <el-input v-model="dialogForm.enProductName" clearable style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item v-if="isZh" :label="$t('price.saleablePrice.attrValueList')">
          <el-input v-model="dialogForm.cnAttrValueList" clearable style="width: 580px" readonly/>
        </el-form-item>
        <el-form-item v-else :label="$t('price.saleablePrice.attrValueList')">
          <el-input v-model="dialogForm.enAttrValueList" clearable style="width: 580px" readonly/>
        </el-form-item>
      </el-form>
      <el-table
        :data="showRecordList"
        max-height="250"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column type="index" :label="$t('price.saleablePrice.index')" width="55" align="center" />
        <el-table-column prop="priceBeforeAdj" :label="$t('price.saleablePrice.priceBeforeAdj')" align="center" show-overflow-tooltip/>
        <el-table-column prop="priceAfterAdj" :label="$t('price.saleablePrice.priceAfterAdj')" align="center" show-overflow-tooltip/>
        <el-table-column prop="updateTime" :label="$t('price.saleablePrice.updateTime2')" width="160px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updateTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column prop="adjustName" :label="$t('price.saleablePrice.adjustName')" show-overflow-tooltip/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory } from '@/api/product'
import { saleableModifyPriceList, saleableModifyPriceHistory, exportExcelSellablePriceList } from '@/api/price';
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
    }
  },
  data() {
    return {
      listLoading: true,
      detailModal: false,
      parentsName: [],
      categoryList: [],
      selectDataList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        customerName: '',
        catalogBId: '',
        catalogBName: '',
        attrValueList: '',
        productName: ''
      },
      dataList: [],
      dialogForm: {
        catalogBId: '',
        cnCatalogBName: '',
        enCatalogBName: '',
        cnProductName: '',
        enProductName: '',
        cnAttrValueList: '',
        enAttrValueList: '',
        skuBId: ''
      },
      showRecordList: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList();
  },
  methods: {
    openAddModifyPrice() {
      let path = '/price/saleable/edit';
      this.$router.push({
        path: path
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.categoryList = res.data.list;
      })
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
      saleableModifyPriceList(obj).then(res => {
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
      saleableModifyPriceHistory({ skuBId: row.skuBId, customerBId: row.customerBId }).then(res => {
        this.showRecordList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.detailModal = true;
    },
    getDataSelect(selects) {
      this.selectDataList = selects;
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelSellablePriceList(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '可售价格调整记录列表.xlsx')
        } else {
          link.setAttribute('download', 'List of saleable price adjustment records.xlsx')
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
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
