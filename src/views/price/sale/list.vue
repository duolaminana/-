<template>
  <div class="app-container editModifyPrice">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '160px'" inline size="small">
        <div>
          <el-form-item :label="$t('price.saleList.adjustName')">
            <el-input v-model.trim="postData.adjustName" clearable :placeholder="$t('price.saleList.adjustName')" style="width: 300px" />
          </el-form-item>
          <el-form-item :label="$t('price.saleList.adjustStatus')">
            <el-select v-model="postData.adjustStatus" clearable :placeholder="$t('price.saleList.adjustStatus')" style="width: 150px" >
              <el-option :label="$t('approval.approvalList.processStatusAll')" value=""></el-option>
              <el-option :label="$t('price.saleList.Editing')" :value="0"></el-option>
              <el-option :label="$t('price.saleList.ToApprove')" :value="1"></el-option>
              <el-option :label="$t('price.saleList.WaitingExecute')" :value="2"></el-option>
              <el-option :label="$t('price.saleList.ExecuteSuccessfully')" :value="3"></el-option>
              <el-option :label="$t('price.saleList.AuditFailed')" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('price.saleList.effectTime')">
            <el-date-picker
              v-model="rangeTime"
              style="width: 300px"
              type="datetimerange"
              range-separator="~"
              :start-placeholder="$t('common.timeSelector.beginTime')"
              :end-placeholder="$t('common.timeSelector.endTime')"
              @change="getRangeTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDetail(2)">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteApi()">{{$t('common.delete')}}</el-button>
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
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('price.saleList.adjustName')" prop="adjustName" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('price.saleList.changeGoodsNumber')" width="160" prop="productSum" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('price.saleList.changeSkuNumber')" width="165" prop="skuSum" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('price.saleList.effectTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.effectTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" :label="$t('price.saleList.createTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="140" :label="$t('price.saleList.adjustStatus')" prop="level" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.adjustStatus | statusType" size="mini">{{ scope.row.adjustStatus | statusName(language)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDetail(1, scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="!scope.row.adjustStatus || scope.row.adjustStatus === 4" @click="openDetail(2, scope.row.bid)">{{$t('common.table.edit')}}</el-button>
          <!--<el-button type="danger" size="mini" v-if="!scope.row.adjustStatus" @click="deleteApi(scope.row.bid)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import {
  getSaleModifyPriceList,
  deleteModifyPrice,
  exportExcelPriceAdjustList
} from '@/api/price';
export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      dialogType: '',
      rangeTime: [],
      selectList: [],
      fileList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        adjustStatus: '',
        adjustName: ''
      },
      dataList: [],
      detailForm: {},
      editForm: {
        adjustName: '',
        effectTime: '',
        adjustStatus: '',
        isApproval: 1,
        fileUrl: '',
        fileName: '',
        remark: ''
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    clearData() {
      if (this.dialogType === 'edit') {
        this.editForm.bid = '';
        this.editForm.id = '';
        this.editForm.fileName = '';
        this.editForm.fileUrl = '';
        this.editForm.isApproval = 1;
        this.editForm.adjustName = '';
        this.editForm.effectTime = '';
        this.editForm.remark = '';
        this.fileList = []
      }
    },
    getRangeTime(arr) {
      if (arr && arr.length) {
        this.postData.sdate = arr[0];
        this.postData.edate = arr[1];
      } else {
        this.postData.sdate = '';
        this.postData.edate = '';
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getSaleModifyPriceList(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    openDetail(type, id) {
      let path = type === 1 ? '/price/sale/detail' : '/price/sale/edit';
      this.$router.push({
        path: path,
        query: {
          id: id
        }
      })
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    deleteApi(bid) {
      let obj = {};
      if (bid) {
        obj.bid = bid
      } else {
        if (!this.selectList.length) {
          return this.$message.warning(this.$t('common.tip.deleteDataTip'))
        }
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].adjustStatus) {
            return this.$message.warning(this.$t('price.tip.editDeleteTip'));
          }
        }
        obj.bid = this.selectList.map(e => e.bid).join(',')
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        deleteModifyPrice(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t('common.tip.deleteTip'));
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
    outportData () {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelPriceAdjustList(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '销售调价管理列表.xlsx')
        } else {
          link.setAttribute('download', 'Sales price management list.xlsx')
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusType(val) {
      switch (Number(val)) {
        case 0: return 'warning';
        case 1: return '';
        case 2: return 'success';
        case 3: return 'info';
        case 4: return 'danger';
      }
    },
    statusName(val, language) {
      switch (Number(val)) {
        case 0: return language === 'zh' ? '编辑中' : 'Editing';
        case 1: return language === 'zh' ? '审核中' : 'To Approve';
        case 2: return language === 'zh' ? '通过待执行' : 'Waiting Execute';
        case 3: return language === 'zh' ? '通过已执行' : 'Execute Successfully';
        case 4: return language === 'zh' ? '审核未通过' : 'Audit Failed';
        default: return language === 'zh' ? '编辑中' : 'Editing';
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editModifyPrice {
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
    .file-name {
      cursor: pointer;
    }
    .file-name:hover {
      text-decoration:underline
    }
  }
</style>
