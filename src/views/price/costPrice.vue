<template>
  <div class="app-container saleOrderPay">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <!--<el-form-item :label="$t('price.costPrice.attrValueList')">-->
          <!--<el-input v-model.trim="postData.attrValueList" clearable :placeholder="$t('price.costPrice.attrValueList')" style="width: 200px" />-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('product.categoryTemplate.category')">
            <el-cascader
              :key="isZh"
              style="width: 200px"
              v-model="parentsName"
              :options="searchDataList"
              :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
              filterable
              clearable
              :placeholder="$t('common.search')"
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('price.costPrice.productName')">
            <el-input v-model.trim="postData.productName" clearable :placeholder="$t('price.costPrice.productName')" style="width: 200px" />
          </el-form-item>
        </div>
        <el-form-item :label="$t('price.costPrice.sku')">
          <el-input v-if="isZh" v-model.trim="postData.cnAttrValueList" clearable :placeholder="$t('price.costPrice.sku')" style="width: 200px" />
          <el-input v-else v-model.trim="postData.enAttrValueList" clearable :placeholder="$t('price.costPrice.sku')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
        v-loading="listLoading"
        :data="dataList"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        :span-method="arraySpanMethod"
        :cell-class-name="cellMethod"
        :header-cell-class-name="cellMethod"
        @selection-change="getSelect"
        @expand-change="expandTable">

        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column type="expand">
          <template slot-scope="props">
              <div class="table-expand" v-for="(item, childIndex) in props.row.childs" :key="childIndex">
                <div class="expand-box"></div>
                <div class="expand-box"></div>
                <div class="table-flex">
                  <div style="text-align:center">SKU</div>
                  <!--<div></div>-->
                  <div>{{isZh ? item.cnAttrValueList: item.enAttrValueList}}</div>
                  <div>{{item.purchaseCostPrice | moneyFmt}}</div>
                  <div>{{item.salesCostPrice | moneyFmt}}</div>
                  <div>{{item.otherCostPrice | moneyFmt}}</div>
                  <div class="update-time">{{item.updateTime | timeFmt}}</div>
                  <div style="text-align:center">
                    <el-button v-if="!item.editable" type="primary" size="mini" @click="openDialog(props.row, item, childIndex)">{{$t('common.table.edit')}}</el-button>
                  </div>
                </div>
              </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('price.costPrice.catalogBName')" prop="catalogBName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCategoryName : scope.row.enCategoryName}}
          </template>
        </el-table-column>

        <!--<el-table-column :label="$t('price.costPrice.productCode')" prop="productCode" show-overflow-tooltip/>-->

        <el-table-column :label="$t('price.costPrice.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="140px" :label="$t('price.costPrice.purchaseCostPrice')" prop="purchaseCostPrice" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.costPrice.salesCostPrice')" prop="salesCostPrice" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.costPrice.otherCostPrice')" prop="otherCostPrice" show-overflow-tooltip/>

        <el-table-column align="center" width="150px" :label="$t('price.costPrice.updateTime')" prop="level" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updateTime | timeFmt}}
          </template>
        </el-table-column>

         <el-table-column align="center" :label="$t('common.table.actions')" class-name="small-padding fixed-width"/>
      </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('price.costPrice.ViewCostPrice')" width="440px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" :rules="rules">
        <el-row class="row-item">
          <el-col :span="24">
            <el-form-item :label="$t('price.costPrice.catalogBName')">
              <el-input :value="isZh ? detailForm.cnCategoryName : detailForm.enCategoryName" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('price.costPrice.productName')">
              <el-input :value="isZh ? detailForm.cnProductName : detailForm.enProductName" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('price.costPrice.sku')">
              <el-input :value="isZh ? detailForm.cnAttrValueList : detailForm.enAttrValueList" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('price.costPrice.purchaseCostPrice')" prop="purchaseCostPrice">
              <el-input v-model="detailForm.purchaseCostPrice" clearable :placeholder="$t('price.costPrice.purchaseCostPrice')" style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('price.costPrice.salesCostPrice')" prop="salesCostPrice">
              <el-input v-model="detailForm.salesCostPrice" clearable :placeholder="$t('price.costPrice.salesCostPrice')" style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('price.costPrice.otherCostPrice')" prop="otherCostPrice">
              <el-input v-model="detailForm.otherCostPrice" clearable :placeholder="$t('price.costPrice.otherCostPrice')" style="width: 200px" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveData()">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="cancel()">{{$t('common.buttonText.back')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils/index'
import { getCostProductList, getPublicCategory } from '@/api/product'
import { parseTime } from '@/utils/index'
import { saveProductCostPrice, updateProductCostPrice, selectProductSkuList } from '@/api/price'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination
  },
  mixins: [moneyFmt],
  data() {
    return {
      list: null,
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      rangeTime: [],
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        catalogBId: '',
        productBId: '',
        cnAttrValueList: '',
        enAttrValueList: ''
      },
      dataList: [],
      recRecordList: [],
      countryList: [],
      detailForm: {
        childs: [],
        attrValueList: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: ''
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
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      customerBankList: [],
      sysBankList: [],
      parentsName: [],
      searchDataList: [],
      rules: {
        otherCostPrice: [
          { required: true, message: this.$t('price.costPrice.inputPurchaseCostPrice'), trigger: 'blur' },
          { pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g, message: this.$t('price.costPrice.inputNumber') }
        ],
        salesCostPrice: [
          { required: true, message: this.$t('price.costPrice.inputPurchaseCostPrice'), trigger: 'blur' },
          { pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g, message: this.$t('price.costPrice.inputNumber') }
        ],
        purchaseCostPrice: [
          { required: true, message: this.$t('price.costPrice.inputPurchaseCostPrice'), trigger: 'blur' },
          { pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g, message: this.$t('price.costPrice.inputNumber') }
        ]
      }
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList()
  },
  methods: {
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      // let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag) {
        this.postData.productBId = row.productBId;
        let params = {};
        for (let key in this.postData) {
          if (this.postData[key] !== '') {
            params[key] = this.postData[key]
          }
        }
        selectProductSkuList(params).then(res => {
          if (res.data) {
            this.dataList[rowIndex].childs = res.data.map(e => {
              // e.editable = false;
              return { ...e }
            })
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
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
        this.searchDataList = res.data.list;
      })
    },
    // getDataList() {
    //   let obj = {}
    //   for (let key in this.postData) {
    //     if (this.postData[key] !== '') {
    //       obj.append(key, this.postData[key])
    //     }
    //   }
    //   getCostPriceChildList(obj).then(res => {
    //     console.log(res)
    //   })
    // },
    cancel() {
      this.detailForm = {
        childs: [],
        attrValueList: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: ''
      };
      this.dialogVisible = false;
    },
    saveData() {
      let obj = {
        productDocBasicInfoBId: this.detailForm.productBId,
        skuManagementBId: this.detailForm.bid,
        purchaseCostPrice: this.detailForm.purchaseCostPrice,
        otherCostPrice: this.detailForm.otherCostPrice,
        salesCostPrice: this.detailForm.salesCostPrice,
        id: this.detailForm.id
      }
      let api = '';
      if (this.detailForm.flag === 0) {
        api = saveProductCostPrice
      } else {
        obj.id = this.detailForm.id
        api = updateProductCostPrice
      }
      api(obj).then(res => {
        this.$message.success('Save Success');
        this.getDataList();
        this.cancel()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3) {
        return [1, 6];
      } else if (columnIndex > 3 && columnIndex < 11) {
        return [0, 0]
      }
    },
    cellMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'table-expand-border'
      }
    },
    openDialog(row, item, index) {
      this.detailForm = deepClone(item);
      this.detailForm.cnCategoryName = row.cnCategoryName;
      this.detailForm.enCategoryName = row.enCategoryName;
      this.detailForm.cnProductName = row.cnProductName;
      this.detailForm.enProductName = row.enProductName;
      // this.getSaleOrderDetail(id);;
      this.dialogVisible = true;
    },
    getSaleOrderDetail(id) {
      this.dialogVisible = true;
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getCostProductList(obj).then(res => {
        this.listLoading = false;
        this.dataList = (res.data.list || []).map(e => {
          e.childs = [];
          return { ...e }
        });
        this.postData.total = res.data.total
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
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
  .saleOrderPay {
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
    .row-item {
      padding: 16px 0;
      border-bottom: 1px solid $border-light-color;
    }
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 51px;
        line-height: 36px;
        text-align: center;
        padding: 0 10px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        font-size: 12px;
        .sku-attr {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            height: 36px;
            line-height: 36px;
            text-align: center;
            padding: 0 10px;
          }
        }
        .sku-msg {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            height: 36px;
            line-height: 36px;
            text-align: center;
            padding: 0 10px;
          }
        }
        >div {
          flex: 1;
          text-align: center;
          padding: 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
          word-break: normal;
          height: 30px;
          line-height: 1.25rem;
        }
        >.update-time{
          display: block;
          width: 150px;
          height: 30px;
          flex: none;
          line-height: 30px;
        }
      }
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .table-expand-border {
      border-right: none;
    }
  }
</style>
