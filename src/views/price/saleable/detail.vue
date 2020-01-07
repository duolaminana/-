<template>
  <div class="app-container saleable-edit">
    <div class="search-box">
      <el-form label-width="170px" size="small" >
        <el-form-item :label="$t('price.saleablePriceView.priceAdjustName')" prop="priceAdjustName">
          <el-input v-model="detailForm.priceAdjustName" readonly style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.customerName')" prop="customerBId">
          <el-select
            v-model="detailForm.customerBId"
            disabled
            style="width: 300px">
            <el-option v-for="(item,index) in customerInfoList" :key="index" :label="item.customerName" :value="item.bid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.effectiveDate')" prop="effectiveDate">
          <el-date-picker
            v-model="detailForm.effectiveDate"
            type="datetime"
            disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.fileList')" style="width: 550px">
          {{detailForm.attachmentName}}
          <el-button type="primary" size="mini" v-if="detailForm.attachmentName" style="margin: 0 20px" @click="downFile(detailForm.attachmentPath)">
            {{$t('common.download')}}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceView.remark')" prop="remark">
          <el-input v-model="detailForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" readonly style="width: 500px" />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="listLoading"
        :data="sellableDetailList"
        element-loading-text="loading。。。"
        border
        fit
        size="mini"
        max-height="400"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column
          align="center"
          type="index"
          :label="$t('common.table.id')"
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
            {{scope.row.adjustmentPercentage || 0}}%
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceView.priceAfterAdj')" prop="priceAfterAdj">
          <template slot-scope="scope">
            {{scope.row.priceAfterAdj || 0}}
          </template>
        </el-table-column>
      </el-table>
      <ApprovalHistory></ApprovalHistory>
      <div class="edit-footer">
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ApprovalHistory from '@/components/ApprovalHistory'
import { parseTime } from '@/utils/index'
import { listCustomerInfoContactApi } from '@/api/customer';
import {
  saleableProductList,
  saleableDetail
} from '@/api/price';
export default {
  components: {
    ApprovalHistory
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
      detailForm: {
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
      sellableDetailList: []
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
      localStorage.setItem('id', '');
      this.$route.query.id = '';
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
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.fileList = [{ url: this.detailForm.attachmentPath, name: this.detailForm.attachmentName }];
        localStorage.setItem('id', this.detailForm.bid)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getDataList() {
      let obj = {
        sellablePriceAdjustBId: this.$route.query.id || localStorage.getItem('id')
      };
      this.listLoading = true;
      saleableProductList(obj).then(res => {
        this.listLoading = false;
        this.sellableDetailList = res.data.map(e => {
          e.editable = false;
          e.adjustRatio = e.adjustmentPercentage + '%';
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
