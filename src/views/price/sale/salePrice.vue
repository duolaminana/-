<template>
  <div class="app-container table-demo">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '160px'" inline size="small">
        <div>
          <el-form-item :label="$t('price.salePrice.catalogBName')">
            <el-cascader
              :key="isZh"
              ref="catalogName"
              style="width: 250px"
              v-model="cascaderArr"
              :options="searchDataList"
              :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
              filterable
              clearable
              :placeholder="$t('common.search')"
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('price.salePrice.productName')">
            <el-input v-model.trim="postData.cnProductName" v-if="isZh" clearable :placeholder="$t('price.salePrice.productName')" style="width: 250px" />
            <el-input v-model.trim="postData.enProductName" v-else clearable :placeholder="$t('price.salePrice.productName')" style="width: 250px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('price.salePrice.productCode')">
            <el-input v-model.trim="postData.productCode" clearable :placeholder="$t('price.salePrice.productCode')" style="width: 250px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openAddModifyPrice()">{{$t('common.add')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      :element-loading-text="$t('common.search')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      :span-method="arraySpanMethod"
      @expand-change="expandTable">

      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="table-expand" v-for="(item, childIndex) in props.row.childs" :key="childIndex">
            <!--<div class="expand-box"></div>-->
            <div class="expand-box"></div>
            <div class="table-flex">
              <div class="sku-td1">SKU</div>
              <div class="sku-td2">{{isZh ? item.cnAttrValueList : item.enAttrValueList}}</div>
              <div class="sku-msg">
                <div v-for="(item1, mapIndex) in item.map" :key="mapIndex">{{item1}}</div>
              </div>
              <div class="sku-td">{{item.updateTime | timeFmt}}</div>
              <div class="sku-todo">
                <div>
                  <el-button v-if="isZh" type="primary" size="mini" class="export" @click="openHistoryDialog(item.skuBId, props.row.cnCatalogBName, props.row.cnProductName, item.cnAttrValueList)">{{$t('common.table.Adjust')}}</el-button>
                  <el-button v-else type="primary" size="mini" class="export" @click="openHistoryDialog(item.skuBId, props.row.enCatalogBName, props.row.enProductName, item.enAttrValueList)">{{$t('common.table.Adjust')}}</el-button>
                  <!-- 查看供应商供价 <el-button type="primary" size="mini" class="export" @click="openSkuDialog(item.skuBId, props.row.catalogBName, props.row.productName,item.attrValueList)">查看供价</el-button> -->
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="160px" :label="$t('price.salePrice.catalogBName')" prop="catalogBName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
        </template>
      </el-table-column>

      <el-table-column width="120px" :label="$t('price.salePrice.productCode')" prop="productCode" show-overflow-tooltip/>

      <el-table-column width="120px" :label="$t('price.salePrice.productName')" prop="productName">
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="150px" v-for="(item,index) in autoTitleSum" :key="index" :label="$t('price.salePrice.tier') + `${index+1}` + $t('price.salePrice.tierExplain')"/>

      <el-table-column align="center" width="150px" :label="$t('price.salePrice.updateTime')" prop="level" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200px" class-name="small-padding fixed-width"/>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="historyDialog" :title="$t('price.salePrice.saleHistoryData')" width="800px" center class="menuDialog" close-on-click-modal @closed="clearHistoryData">
      <el-form :model="saleHistoryData" label-width="130px" label-position="right" size="small">
        <el-form-item :label="$t('price.salePrice.catalogBName')" prop="catalogBName">
          <el-input v-model="saleHistoryData.catalogBName" readonly class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('price.salePrice.productName')" prop="productName">
          <el-input v-model="saleHistoryData.productName" readonly class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('price.salePrice.attrValueList')" prop="attrValueList">
          <el-input v-model="saleHistoryData.attrValueList" readonly class="form-dialog-width" />
        </el-form-item>

        <div class="price-stage" v-for="(stage, index) in saleHistoryData.productPriceAdjustSkuList" :key="index">
          <div class="stage-label">{{$t('price.salePrice.tier')}}{{index + 1}}:</div>
          <el-table
            :data="stage"
            border
            fit
            size="small"
            max-height="300"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" :label="$t('price.salePrice.index')" type="index" width="50"/>
            <el-table-column align="center" :label="$t('price.salePrice.originalPrice')" prop="originalPrice" show-overflow-tooltip/>
            <el-table-column align="center" :label="$t('price.salePrice.afterPrice')" prop="afterPrice" show-overflow-tooltip/>
            <el-table-column align="center" :label="$t('price.salePrice.effectTime')" prop="effectTime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.effectTime | timeFmt}}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('price.salePrice.adjustName')" prop="adjustName" show-overflow-tooltip/>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="historyDialog=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import { getPublicCategory } from '@/api/product'
import { getSalePriceList, getSalePriceSkuList, getSalePriceSkuHistoryList } from '@/api/price'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      historyDialog: false,
      dialogType: '',
      dataList: [],
      searchDataList: [],
      cascaderArr: [],
      autoTitleSum: 1,
      saleHistoryData: {
        productPriceAdjustSkuList: [],
        catalogBName: '',
        productName: '',
        attrValueList: ''
      },
      supplierPriceData: {
        listdata: [],
        catalogBName: '',
        productName: '',
        attrValueList: ''
      },
      sppdata: {
        skulistdata: [],
        pricelistdata: [],
        catalogBName: '',
        productName: ''
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productCode: '',
        cnProductName: '',
        enProudctName: '',
        catalogBId: ''
      },
      postHistory: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        skuBId: ''
      }
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList()
  },
  methods: {
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list || [];
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        return [1, this.autoTitleSum + 1];
      } else if (columnIndex > 3 && (columnIndex < (4 + this.autoTitleSum))) {
        return [0, 0]
      }
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getSalePriceList(obj).then(res => {
        if (res.status === 200) {
          this.autoTitleSum = Number(res.message)
        }
        this.dataList = (res.data.list || []).map(e => {
          e.childs = [];
          return { ...e }
        });
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      // let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag) {
        getSalePriceSkuList({ productBId: row.productBId }).then(res => {
          if (res.data && res.data.length) {
            this.dataList[rowIndex].childs = res.data.map(e => {
              if (e.map.length < this.autoTitleSum) {
                for (let i = 0; i < this.autoTitleSum; i++) {
                  if (!e.map[i]) {
                    e.map[i] = '';
                  }
                }
              }
              return { ...e }
            })
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    openAddModifyPrice() {
      let path = '/price/sale/edit';
      this.$router.push({
        path: path
      })
    },
    clearHistoryData() {
      this.saleHistoryData.productPriceAdjustSkuList = [];
      this.saleHistoryData.catalogBName = '';
      this.saleHistoryData.productName = '';
      this.saleHistoryData.attrValueList = '';
    },
    getDataHistoryList() {
      let obj = {};
      for (let key in this.postHistory) {
        if (this.postHistory[key] !== '') {
          obj[key] = this.postHistory[key]
        }
      }
      getSalePriceSkuHistoryList(obj).then(res => {
        let allArr = res.data.skulist.list;
        let maxLevel = res.data.maxLevel;
        let arr = [];
        for (let i = 0; i < maxLevel; i++) {
          arr[i] = allArr.filter(e => e.adjustSkuLevel === (i + 1))
        }
        this.saleHistoryData.productPriceAdjustSkuList = arr;
      }).catch(err => {
        this.historyDialog = false;
        this.$message.error(err.message)
      })
    },
    openHistoryDialog(skuBId, catalogBName, productName, attrValueList) {
      this.historyDialog = true;
      this.postHistory.skuBId = skuBId;
      this.saleHistoryData.catalogBName = catalogBName;
      this.saleHistoryData.productName = productName;
      this.saleHistoryData.attrValueList = attrValueList;
      this.getDataHistoryList();
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
  .table-demo {
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
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 51px;
        line-height: 36px;
        text-align: center;
        padding: 0 5px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        font-size: 12px;
        .sku-td1 {
          width: 100px;
          text-align: center;
          padding: 0 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
          word-break: normal;
          line-height: 1.15rem;
        }
        .sku-td2 {
          width: 300px;
          text-align: center;
          padding: 0 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
          word-break: normal;
          line-height: 1.15rem;
        }
        .sku-td {
          width: 150px;
          text-align: center;
          padding: 0 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
          word-break: normal;
          line-height: 1.15rem;
        }
        .sku-msg {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            height: 36px;
            line-height: 36px;
            min-width: 150px;
            text-align: center;
            padding: 0 5px;
          }
        }
        .sku-todo {
          width: 200px;
          >div {
            flex: 1;
            height: 36px;
            line-height: 36px;
            text-align: center;
            padding: 0 5px;
          }
        }
      }
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .table-label {
      padding-left: 20px;
      font-weight: bold;
      line-height: 40px;
      margin-top: 10px;
    }
    .price-stage {
      margin: 20px 0;
      .stage-label {
        text-align: left;
        padding-left: 5px;
        line-height: 1.5rem;
        font-weight: bold;
      }
    }
  }
</style>
