<template>
  <div class="app-container saleModifyPrice">
    <div class="search-box">
      <el-form ref="editForm" :model="editForm" label-width="170px" size="small">
        <el-form-item :label="$t('price.saleView.adjustName')" prop="adjustName">
          <el-input v-model="editForm.adjustName" readonly style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.saleView.productType')" prop="productType">
          <el-select v-model="editForm.productType" disabled>
            <el-option :label="$t('price.saleView.standardProduct')" :value="1"></el-option>
            <el-option :label="$t('price.saleView.rawMaterial')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="5">
            <el-form-item :label="$t('price.saleView.effectTime')" prop="effectTime">
              <el-date-picker
                v-model="editForm.effectTime"
                type="datetime"
                readonly>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('price.saleView.fileList')" style="width: 550px">
          <div v-for="(item, index) in fileList" :key="index">
            <span>{{item.annexName}}</span>
            <el-button type="warning" size="mini" style="margin: 0 20px" @click="downFile(item.annexPath)">{{$t('common.download')}}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('price.saleView.remark')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" readonly style="width: 500px" />
        </el-form-item>
      </el-form>
    </div>
    <div>
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
                <div class="expand-box"></div>
                <div class="expand-box"></div>
                <div class="table-flex">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>{{$t('price.saleView.tier')}}{{childIndex+1}}</div>
                  <div>{{item.originalPrice | moneyFmt}}</div>
                  <div>
                    {{item.priceNumber | moneyFmt}}
                  </div>
                  <div>{{item.adjustRatio}}</div>
                  <div>{{item.afterPrice}}</div>
                  <div>{{item.originalMinimum}}</div>
                  <div>{{item.minimunNumber}}</div>
                </div>
              </div>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleView.catalogBName')" prop="catalogBName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleView.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleView.skuCode')" prop="skuCode" show-overflow-tooltip/>

        <el-table-column header-align="center" :label="$t('price.saleView.attrValueList')" prop="attrValueList" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleView.originalPrice')" prop="name" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleView.priceNumber')" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleView.adjustRatio')" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleView.afterPrice')" show-overflow-tooltip/>

        <el-table-column align="center" label="调整前起订量" show-overflow-tooltip/>

        <el-table-column align="center" label="调整量" show-overflow-tooltip/>
      </el-table>
      <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

      <ApprovalHistory></ApprovalHistory>

    </div>

    <div style="margin: 30px 0;text-align: center">
      <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ApprovalHistory from '@/components/ApprovalHistory'
import { getPublicCategory } from '@/api/product'
import { parseTime } from '@/utils/index'
import { getModifyPriceSkuList, getModifyPriceDetail, serarchSkuLadder } from '@/api/price';
import moneyFmt from "@/mixin/moneyFmt";
export default {
  components: {
    Pagination,
    ApprovalHistory
  },
  mixins: [moneyFmt],
  data() {
    return {
      list: null,
      listLoading: true,
      listLoading1: false,
      confirmLoading: false,
      dialogVisible: false,
      editType: false,
      checkList: [],
      searchDataList: [],
      parentsName: [],
      rangeTime: [],
      selectList: [],
      selectList1: [],
      fileList: [],
      saveFiles: [],
      productSkuList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editForm: {
        adjustName: '',
        productType: 1,
        effectTime: '',
        adjustStatus: '',
        isApproval: 1,
        fileUrl: '',
        fileName: '',
        remark: ''
      },
      searchObj: {
        catalogBId: '',
        productCode: '',
        productName: '',
        attrValueList: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      addSkuObj: {
        price: 0,
        number: 0
      },
      dataList: []
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
    if (this.$route.query.id || localStorage.getItem('id')) {
      this.editType = true;
      this.getModifyPriceDetail();
      this.getDataList();
    }
    this.getAllDataList();
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.searchObj.catalogBId = arr.join(',');
      } else {
        this.searchObj.catalogBId = '';
      }
    },
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      // let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag) {
        serarchSkuLadder({ adjustBId: this.$route.query.id, skuBId: row.skuBId }).then(res => {
          this.dataList[rowIndex].childs = res.data.map(e => {
            e.editable = false;
            return { ...e }
          })
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return [1, 5];
      } else if (columnIndex > 4 && columnIndex < 9) {
        return [0, 0]
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    getModifyPriceDetail() {
      getModifyPriceDetail({ BId: this.$route.query.id || localStorage.getItem('id') }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (res.data.adjustAnnexList) {
          this.fileList = res.data.adjustAnnexList.map(e => {
            e.name = e.annexName;
            e.url = e.annexPath;
            return {
              ...e
            }
          });
        }
        localStorage.setItem('id', this.editForm.bid)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getDataList() {
      this.postData.BId = this.$route.query.id || localStorage.getItem('id');
      getModifyPriceSkuList(this.postData).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list.map(e => {
          e.childs = [];
          return { ...e }
        });
        this.postData.total = res.data.total
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
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
  .saleModifyPrice {
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
    .sku-price-reset {
      .reset-title {
        height: 35px;
        line-height: 35px;
        font-weight: bold;
        background: #F5F5F5;
        padding-left: 20px;
        margin-bottom: 20px;
      }
    }
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 51px;
        height: 36px;
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
          line-height: 1.15rem;
        }
      }
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
  }
</style>
