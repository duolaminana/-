<template>
  <div class="app-container saleSupplierModifyPrice">
    <div class="search-box">
      <el-form ref="editForm" :model="editForm" label-width="170px" size="small">
        <el-form-item :label="$t('price.supplierView.adjustName')" prop="adjustName">
          <el-input v-model="editForm.adjustName" readonly style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.supplierView.supplierName')" prop="supplierBId">
          <el-select
            v-model="editForm.supplierBId"
            disabled
            filterable
            style="width: 300px">
            <el-option v-for="(item,index) in supplierList" :key="index" :label="item.supplierName" :value="item.bid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('price.supplierView.effectTime')" prop="effectTime">
          <el-date-picker
            v-model="editForm.effectTime"
            type="datetime"
            disabled
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="是否审核" prop="ifAudit">-->
<!--          <el-radio-group v-model="editForm.ifAudit" disabled>-->
<!--            <el-radio :label="1">是</el-radio>-->
<!--            <el-radio :label="0">否</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="选择审批流程" prop="approvalBId" v-if="editForm.ifAudit">-->
<!--          <el-select v-model="editForm.approvalBId" disabled placeholder="请选择" style="width: 300px">-->
<!--            <el-option v-for="(item,index) in approvalSelectList" :key="index" :label="item.approvalName" :value="item.bid">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item :label="$t('price.supplierView.fileList')" prop="remark" style="width: 550px">
          <div v-for="(item, index) in fileList" :key="index">
            <span>{{item.annexName}}</span>
            <el-button type="warning" size="mini" style="margin: 0 20px" @click="downFile(item.annexPath)">{{$t('common.download')}}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('price.supplierView.remark')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" readonly style="width: 500px" />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="loading。。。"
        border
        fit
        size="small"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.catalogBName')" prop="catalogBName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.attrValueList')" prop="attrValueList" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.originalPrice')" prop="originalPrice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.originalPrice || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.priceNumber')" prop="priceNumber" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.priceNumber || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.adjustRatio')" prop="adjustRatio" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.adjustRatio || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.afterPrice')" prop="afterPrice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.afterPrice || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.originalMinimum')" prop="originalMinimum" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.originalMinimum || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.minimunNumber')" prop="minimunNumber" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.minimunNumber || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierView.afterMinimum')" prop="afterMinimum" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.afterMinimum || 0}}
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>-->

      <ApprovalHistory></ApprovalHistory>

    </div>
    <div style="margin: 30px 0;text-align: center">
      <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
    </div>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import ApprovalHistory from '@/components/ApprovalHistory'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { getSupplierList } from '@/api/supplier';
import { approvalSelectList } from '@/api/system';
import {
  getSupplierModifyPriceDetail,
  getAllSupplierModifyPriceSkuList
} from '@/api/price';
export default {
  components: {
    ApprovalHistory
  },
  data() {
    return {
      uploadActionUrl,
      list: null,
      listLoading: true,
      listLoading1: false,
      confirmLoading: false,
      dialogVisible: false,
      editType: false,
      checkList: [],
      parentsName: [],
      rangeTime: [],
      selectList: [],
      fileList: [],
      supplierList: [],
      productSkuList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editForm: {
        adjustName: '',
        effectTime: '',
        adjustStatus: '',
        supplierBId: '',
        supplierName: '',
        ifAudit: 1,
        approvalBId: '',
        remark: ''
      },
      approvalSelectList: [],
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
      this.getSupplierModifyPriceDetail();
      this.getDataList();
    }
    this.getSupplierList();
    this.getApprovalSelectList()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.go(-1)
      })
    },
    getSupplierList() {
      getSupplierList().then(res => {
        this.supplierList = res.data || [];
      })
    },
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    getSupplierModifyPriceDetail() {
      getSupplierModifyPriceDetail({ bid: this.$route.query.id || localStorage.getItem('id') }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (res.data.supplierPriceAdjustAnnexList) {
          this.fileList = res.data.supplierPriceAdjustAnnexList.map(e => {
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
      // let obj = { adjustBId: this.$route.query.id || localStorage.getItem('id') };
      // getAllSupplierModifyPriceSkuList(obj).then(res => {
      //   this.listLoading = false;
      //   this.dataList = res.data.list.map(e => {
      //     return { ...e }
      //   });
      //   this.postData.total = res.data.total;
      // }).catch(err => {
      //   this.listLoading = false;
      //   this.$message.error(err.message)
      // })
      let obj = { adjustBId: this.$route.query.id || localStorage.getItem('id') };
      this.listLoading = true;
      getAllSupplierModifyPriceSkuList(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.map(e => {
          e.editable = false;
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
  .saleSupplierModifyPrice {
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
  }
</style>
