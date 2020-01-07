<template>
  <div class="app-container quoted">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '135px'" inline size="small">
        <div>
          <el-form-item :label="$t('query.tableLabel.CustomerName')">
            <el-input v-model.trim="postData.buyerName" clearable :placeholder="$t('query.tableLabel.CustomerName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomerCoding')">
            <el-input v-model.trim="postData.buyerCode" clearable :placeholder="$t('query.tableLabel.CustomerCoding')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.quoteStatus" clearable :placeholder="$t('system.role.status')" style="width: 150px">
              <el-option v-for="(item, index) in quoteStatusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.quoteStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('query.tableLabel.quotationNumber')">
            <el-input v-model.trim="postData.quotationNo" clearable :placeholder="$t('query.tableLabel.quotationNumber')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.country')" prop="buyerCountryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.buyerCountryCode" clearable :placeholder="$t('query.tableLabel.searchCountryCode')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('finance.financeService.start')">
            <el-date-picker
              v-model="postData.startTime"
              :picker-options="pickerOptionsStart"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.end')">
            <el-date-picker
              v-model="postData.endTime"
              :picker-options="pickerOptionsEnd"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="goEdit(1, '', 1)">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteListByIds">{{$t('common.delete')}}</el-button>
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
      <el-table-column :label="$t('query.tableLabel.quotationNumber')" prop="quotationNo" show-overflow-tooltip/>

      <el-table-column :label="$t('query.tableLabel.SheetNo')" prop="inqueryTailormadeNo" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.inqueryTailormadeNo || '无'}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('query.tableLabel.CustomerName')" show-overflow-tooltip>
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.customerInfoVo.companyName}}-->
        <!--</template>-->
        <template slot-scope="scope">
          {{scope.row.buyerName}}
        </template>
      </el-table-column>

      <el-table-column :label="isZh?'国家/电话':'Country/Contact'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{language === 'zh' ?scope.row.cnCountryName :scope.row.enCountryName}}/{{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="90" :label="$t('query.tableLabel.skuNum')" prop="skuQuantity">
        <template slot-scope="scope">
          {{scope.row.skuQuantity || 0 }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('query.tableLabel.Amount')" prop="totalAmounts" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmountsAll| moneyFmt }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" :label="$t('query.tableLabel.Quoter')" prop="quotedUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150px" :label="$t('query.tableLabel.QuotationTime')" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" :label="$t('common.status')" prop="quoteStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.quoteStatus === 1 || row.quoteStatus === 8) ? 'danger' : 'primary'" size="mini">{{row.quoteStatus | quoteStatusFmt(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="goEdit(0, row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.quoteStatus === 1" @click="goEdit(1, row.bid, row.quotedType, false, row.orderType, row.inqueryTailormadeNo)">{{$t('common.table.edit')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.quoteStatus === 10" @click="SendStatus(row)">{{$t('common.buttonText.send')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { pageQuotedPrice, deleteQuotedPriceByIds, exportByQuotedPriceExcel, updateQuotedPriceSendStatusApi } from '@/api/inquiry'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination
  },
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
        // case 4: return language === 'zh' ? '待重新报价' : 'To be re-quoted';
        case 5: return language === 'zh' ? '废弃' : 'Discard';
        case 6: return language === 'zh' ? '拒绝报价' : 'Refusal of quotation';
        // case 7: return language === 'zh' ? '审批通过' : 'Audit pass';
        case 8: return language === 'zh' ? '审批未通过' : 'Audit failed';
        // case 9: return language === 'zh' ? '已拒绝' : 'Rejected';
        case 10: return language === 'zh' ? '待通知' : 'Wait notification';
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
        quotedType: '',
        pageNum: 1,
        pageSize: 10,
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
      quotationTime: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.postData.endTime) {
            return time.getTime() > this.postData.endTime
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.postData.startTime) {
            return time.getTime() < this.postData.startTime
          }
        }
      },
      quoteStatusList: [
        // 报价单状态：1编辑中、2审批中、3已报价、4重新待报价、5废弃、6拒绝报价, 7审批通过(预留，暂时不用)'', 8 审批未通过 , 9 已拒绝(预留，暂时不用),10 待通知
        {
          labelZh: '全部',
          label: 'All',
          quoteStatus: ''
        },
        {
          label: 'Editing',
          labelZh: '编辑中',
          quoteStatus: 1
        },
        {
          label: 'to approve',
          labelZh: '审批中',
          quoteStatus: 2
        },
        {
          label: 'Quoted price',
          labelZh: '已报价',
          quoteStatus: 3
        },
        // {
        //   label: 'To be re-quoted',
        //   labelZh: '待重新报价',
        //   quoteStatus: 4
        // },
        {
          label: 'Discard',
          labelZh: '废弃',
          quoteStatus: 5
        },
        {
          label: 'Refusal of quotation',
          labelZh: '拒绝报价',
          quoteStatus: 6
        },
        // {
        //   label: 'Audit pass',
        //   labelZh: '审批通过',
        //   quoteStatus: 7
        // },
        {
          label: 'Audit failed',
          labelZh: '审批未通过',
          quoteStatus: 8
        },
        {
          label: 'Wait notification',
          labelZh: '待通知',
          quoteStatus: 10
        }
      ],
      quoteTypeList: [
        // 报价类型（0-EXW,1-FOB）
        {
          label: 'EXW',
          quoteType: 0
        },
        {
          label: 'FOB',
          quoteType: 1
        }
      ],
      paymentMethodList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
        {
          label: 'T/T',
          paymentMethod: 1
        },
        {
          label: 'L/C',
          paymentMethod: 2
        },
        {
          label: 'P/A',
          paymentMethod: 3
        },
        {
          label: 'D/A',
          paymentMethod: 4
        }
      ]
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    goEdit(type, id, quoteType, flag, orderType, inqueryTailormadeNo) {
      let path = '';
      if (type && quoteType === 1) {
        path = '/query/editQuoted'
      } else if (type && quoteType === 2 && inqueryTailormadeNo !== null) {
        path = '/query/editInquiry'
      } else if (type && quoteType === 2 && inqueryTailormadeNo === null) {
        path = '/query/editQuoted2'
      } else {
        path = '/query/detailQuoted'
      }
      // let obj = orderType ? { id, flag, orderType } : { id, flag };
      this.$router.push({
        path: path,
        query: {
          id, flag, orderType, inqueryTailormadeNo
        }
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
      if (this.$route.query.customBid) {
        obj.costomerBId = this.$route.query.customBid
      }
      if (this.$route.query.supplierBId) {
        obj.buyerSupplierBId = this.$route.query.supplierBId
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
    // 通知客户
    SendStatus(row) {
      this.$confirm(this.$t('query.formMessage.isSend'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          quoteStatus: 3,
          id: row.id
        };
        updateQuotedPriceSendStatusApi(obj).then(res => {
          this.$message.success(res.message);
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
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
            this.$message.success(this.$t('query.formMessage.SuccessfulOperation'));
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
      let obj = {
        pageNum: '',
        pageSize: '',
        buyerName: this.postData.buyerName,
        buyerCode: this.postData.buyerCode,
        buyerCountryCode: this.postData.buyerCountryCode,
        quoteStatus: this.postData.quoteStatus,
        quotationTime: this.postData.quotationTime,
        startTime: this.postData.startTime,
        endTime: this.postData.endTime,
        quotationNo: this.postData.quotationNo
      };
      exportByQuotedPriceExcel(obj).then(res => {
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
