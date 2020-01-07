<template>
  <div class="app-container quoted">
    <div class="topBtns">
      <el-button type="primary" size="small" class="export" @click="exportExcelFun()">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
      align="center"
      type="selection"
      width="55">
      </el-table-column>
      <!--<el-table-column align="center" width="70px" label="报价来源" prop="quotedType">-->
        <!--<template slot-scope="{row}">-->
          <!--<el-tag :type="row.quotedType !== 1 ? 'primary' : 'danger'" size="mini">{{row.quotedType === 1 ? '定制' : '询价'}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column width="135" :label="$t('query.tableLabel.quotationNumber')" prop="quotationNo" show-overflow-tooltip/>

      <!--<el-table-column width="135" :label="$t('query.tableLabel.SheetNo')" prop="inqueryTailormadeNo" show-overflow-tooltip>-->
        <!--<template slot-scope="{row}">-->
          <!--{{row.inqueryTailormadeNo || 'No Data'}}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column width="120" :label="$t('query.tableLabel.CustomerName')" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.customerInfoVo.companyName}}-->
        <!--</template>-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.buyerName}}-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column :label="$t('query.tableLabel.countryAndPhoneNumber')" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--{{language === 'zh' ?scope.row.cnCountryName :scope.row.enCountryName}}/-->
          {{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="90" :label="$t('query.tableLabel.skuNum')" prop="skuQuantity">
        <template slot-scope="scope">
          {{scope.row.skuQuantity || 0 }}
        </template>
      </el-table-column>

      <!--<el-table-column align="center" width="80" :label="$t('query.tableLabel.Amount')" prop="totalAmounts" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.totalAmounts| moneyFmt }}-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" width="100px" :label="$t('query.tableLabel.Quoter')" prop="quotedUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150px" :label="$t('query.tableLabel.QuotationTime')" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.status')" prop="quoteStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.quoteStatus === 1 || row.quoteStatus === 8) ? 'danger' : 'primary'" size="mini">{{row.quoteStatus | quoteStatusFmt(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goEdit(0, row.bid)">{{$t('common.table.view')}}</el-button>
          <!--<el-button type="primary" size="mini" v-if="row.quoteStatus === 1" @click="goEdit(1, row.bid, row.quotedType, false)">{{$t('common.table.edit')}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px;text-align:right;cursor:pointer">
      <span @click="toMore">{{$t('common.more')}}>></span>
    </div>
    <!-- <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination> -->
  </div>
</template>

<script>
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { pageQuotedPrice, deleteQuotedPriceByIds, exportQuotedPriceExcelApi } from '@/api/inquiry'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  props: { customBid: { type: String, default: '' }, supplierBId: { type: String, default: '' }},
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    quoteStatusFmt(val, language) {
      switch (Number(val)) {
        case 1: return language === 'zh' ? '编辑中' : 'Editing';
        case 2: return language === 'zh' ? '审批中' : 'to approve';
        case 3: return language === 'zh' ? '已报价' : 'Quoted price';
        case 4: return language === 'zh' ? '待重新报价' : 'To be re-quoted';
        case 5: return language === 'zh' ? '废弃' : 'Discard';
        case 6: return language === 'zh' ? '拒绝报价' : 'Refusal of quotation';
        case 7: return language === 'zh' ? '审批通过' : 'Audit pass';
        case 8: return language === 'zh' ? '审批未通过' : 'Audit failed';
        case 9: return language === 'zh' ? '已拒绝' : 'Rejected';
        default:
          return language === 'zh' ? '数据异常' : 'Data abnormity';
      }
    }
  },
  data() {
    return {
      selectList: [],
      idsForm: {
        ids: ''
      },
      dataList: [],
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      filesList: [],
      listLoading: true,
      postData: {
        costomerBId: '',
        quotedType: '',
        pageNum: 1,
        pageSize: 5,
        total: 0,
        buyerName: '',
        buyerCode: '',
        buyerCountryCode: '',
        quoteStatus: '',
        quotationTime: '',
        startTime: '',
        endTime: '',
        quotationNo: ''
      },
      quotationTime: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    toMore() {
      let obj = {}
      if (this.customBid) {
        obj = { customBid: this.customBid }
      }
      if (this.supplierBId) {
        obj = { supplierBId: this.supplierBId }
      }
      this.$router.push({
        path: '/query/quoted', query: obj })
    },
    goEdit(type, id, quoteType, flag) {
      let path = '';
      if (type && quoteType === 1) {
        path = '/query/editQuoted'
      } else if (type) {
        path = '/query/editInquiry'
      } else {
        path = '/query/detailQuoted'
      }
      this.$router.push({
        path: path,
        query: { id, flag }
      })
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
      if (this.customBid) {
        obj.costomerBId = this.customBid
      }
      if (this.supplierBId) {
        obj.buyerSupplierBId = this.supplierBId
      }
      pageQuotedPrice(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
    },
    // 查看详情
    detailDialog(row) {
    },
    // 报价按钮
    openQuoted() {
    },
    // 查看询价按钮
    detailQuoted() {
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
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
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('query.formMessage.PleaseSelectData'));
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].quoteStatus !== 1) {
          return this.$message.warning(this.$t('query.formMessage.deleteOnly'))
        }
      }
      this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteQuotedPriceByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('this.formMessage.SuccessfulOperation'));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    },
    // 导出操作
    exportExcelFun() {
      exportQuotedPriceExcelApi().then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'quoted.xls');
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
  .quoted {
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
        width: 500px;
      }
    }
  }
</style>
