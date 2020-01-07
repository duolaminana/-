<template>
  <div class="app-container saleable-edit">
    <div class="search-box">
      <el-form label-width="170px" size="small" >
        <el-form-item :label="$t('price.saleablePriceView.priceAdjustName')" prop="priceAdjustName">
          <el-input v-model="editForm.priceAdjustName" readonly style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.customerName')" prop="customerBId">
          <el-select
            v-model="editForm.customerBId"
            disabled
            :placeholder="$t('price.tip.selectTip')"
            style="width: 300px">
            <el-option v-for="(item,index) in customerInfoList" :key="index" :label="item.customerName" :value="item.bid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.effectiveDate')" prop="effectiveDate">
          <el-date-picker
            v-model="editForm.effectiveDate"
            type="datetime"
            disabled
            :placeholder="$t('price.tip.selectDateTip')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.fileList')" style="width: 550px">
          {{editForm.attachmentName}}
          <el-button type="primary" size="mini" style="margin: 0 20px" @click="downFile(editForm.attachmentPath)">
            {{$t('common.download')}}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.remark')" prop="remark">
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
        max-height="400"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column
          align="center"
          type="index"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.catalogBName')" prop="catalogBName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.attrValueList')" prop="attrValueList" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.priceBeforeAdj')" prop="priceBeforeAdj" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleablePriceView.priceAdjustmentValue')" prop="priceAdjustmentValue">
          <template slot-scope="scope">
            <span>{{scope.row.priceAdjustmentValue || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.adjustmentPercentage')" prop="adjustmentPercentage">
          <template slot-scope="scope">
            {{scope.row.adjustRatio || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.priceAfterAdj')" prop="priceAfterAdj">
          <template slot-scope="scope">
            {{scope.row.priceAfterAdj || 0}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <approval-flow @close="closePage"></approval-flow>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import { parseTime } from '@/utils/index'
import { listCustomerInfoContactApi } from '@/api/customer';
import {
  saleableProductList,
  saleableDetail
} from '@/api/price';
export default {
  components: {
    ApprovalFlow
  },
  data() {
    return {
      listLoading: false,
      checkList: [],
      parentsName: [],
      rangeTime: [],
      fileList: [],
      customerInfoList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editForm: {
        priceAdjustName: '',
        effectiveDate: '',
        adjustStatus: 0,
        customerBId: '',
        customerName: '',
        ifAudit: 1,
        approvalBId: '',
        remark: '',
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: ''
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
    this.getSaleableDetail();
    this.getDataList();
    this.getCustomerInfoListFun()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
    },
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSaleableDetail() {
      saleableDetail({ bid: this.$route.query.id || localStorage.getItem('id') }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.fileList = [{ url: this.editForm.attachmentPath, name: this.editForm.attachmentName }];
        localStorage.setItem('id', this.editForm.bid)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getDataList() {
      let obj = { sellablePriceAdjustBId: this.$route.query.id || localStorage.getItem('id') };
      this.listLoading = true;
      saleableProductList(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.map(e => {
          e.editable = false;
          e.adjustRatio = (e.adjustmentPercentage || 0) + '%';
          return { ...e }
        });
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
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .saleable-edit {
    .search-box {
      margin-bottom: 25px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      .batch-change {
        float: right;
        margin: 0 50px;
      }
      margin-bottom: 10px;
      /*text-align: right;*/
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
    .edit-footer {
      text-align: center;
      margin-top: 40px;
      button {
        margin: 0 10px;
      }
    }
  }
</style>
