<template>
  <div class="app-container personnelAllotment">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <el-form-item :label="$t('supplier.product.supplierName')">
          <el-input v-model.trim="postData.supplierName" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('supplier.product.supplierCode')">
          <el-input v-model.trim="postData.supplierCode" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('supplier.product.service')">
          <el-select
            v-model="postData.accountBId"
            size="small"
            remote
            :remote-method="getAccountUserList"
            clearable
            filterable
            :loading="loading1">
            <el-option v-for="(item, index) in accountUserList" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteList()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
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

      <el-table-column :label="$t('supplier.product.supplierName')" prop="supplierName" show-overflow-tooltip />

      <el-table-column :label="$t('supplier.product.supplierCode')" prop="supplierCode" show-overflow-tooltip />

      <el-table-column :label="$t('supplier.product.countryName')" prop="countryCode" show-overflow-tooltip/>

      <el-table-column :label="$t('supplier.product.mobilePhone')" prop="mobilePhone" show-overflow-tooltip/>

      <el-table-column :label="$t('supplier.product.service')" prop="serviceName" show-overflow-tooltip/>

      <el-table-column align="center" width="100" :label="$t('supplier.category.modifier')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('supplier.category.modifiedTime')" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="岗位/职务" prop="csJob" />-->

      <!--<el-table-column align="center" label="操作" width="240" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="danger" size="mini" @click="deleteList(scope.row)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" :title="$t('supplier.product.viewLevel')" class="menuDialog" @closed="clearData">
      <el-form :model="dialogForm" label-width="80px" label-position="right" size="small">
        <el-form-item :label="$t('supplier.product.levelName')" prop="gradeName">
          <el-input v-model="dialogForm.gradeName" readonly="readonly" class="form-dialog-width" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">{{$t('system.role,return')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" :title="$t('supplier.product.addService')" center width="700px" @closed="clearData">
      <el-form ref="dialogData" :model="dialogData" label-width="100px" label-position="right" inline="" size="small" :rules="dialogFormRules">
        <el-form-item :label="$t('supplier.product.supplierLevel')" prop="supplierName">
          <el-cascader
            style="width: 200px"
            v-model="supplierSortName"
            :options="sortList"
            :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
            filterable
            clearable
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('supplier.product.supplierCategory')" prop="supplierName">
          <el-select v-model="dialogData.supplierGradeBId" clearable style="width: 200px">
            <el-option v-for="(item, index) in gradeList" :label="item.gradeName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('supplier.product.countryName')" prop="supplierName">
          <el-select
            v-model="dialogData.countryCode"
            clearable
            filterable
            remote
            :remote-method="getCountryList"
            :loading="loading1"
            style="width: 200px">
            <el-option v-for="(item, index) in countryList" :label="item.searchStr" :value="item.searchStr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('supplier.product.supplierCode')" prop="supplierName">
          <el-input v-model="dialogData.supplierCode" clearable style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('supplier.product.supplierName')" prop="supplierName">
          <el-input v-model="dialogData.supplierName" clearable style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchDialogData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
      <div class="service-bottom">
        <el-row :gutter="28">
          <el-col :span="12">
            {{$t('supplier.product.service')}}
            <el-select
              v-model="serviceForm.accountBId"
              size="small"
              remote
              :remote-method="getAccountUserList"
              clearable
              filterable
              :loading="loading1">
              <el-option v-for="(item, index) in accountUserList" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
            </el-select>
          </el-col>
          <!--<el-col :span="12">-->
            <!--岗位/职务-->
            <!--<el-select v-model="serviceForm.csJob" clearable size="small">-->
              <!--<el-option value="客服员"></el-option>-->
              <!--<el-option value="采购专员"></el-option>-->
              <!--<el-option value="采购经理"></el-option>-->
              <!--<el-option value="技术经理"></el-option>-->
            <!--</el-select>-->
          <!--</el-col>-->
        </el-row>
      </div>
      <el-table
        :data="supplierList"
        border
        fit
        style="margin: 10px 0"
        height="300px"
        size="small"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getDialogSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('supplier.product.supplierCode')" prop="supplierCode" />

        <el-table-column align="center" :label="$t('supplier.product.supplierName')" prop="supplierName" />

        <el-table-column align="center" :label="$t('supplier.product.countryName')" prop="countryCode"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getServiceListPage,
  deleteBatchService,
  gradeList,
  sortList,
  getSupplierList,
  setServicePeople,
  exportExcelSupplierServingList
} from '@/api/supplier';
import { selectCountryListApi } from '@/api/system'
import { getAdminUserList, selectUserListAllApi } from '@/api/user'
import { deepClone, parseTime } from "@/utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      loading1: false,
      editVisible: false,
      detailVisible: false,
      supplierSortName: [],
      dialogForm: {
        gradeName: '',
        gradeStatus: 1,
        gradeId: '',
        countryCode: ''
      },
      serviceForm: {
        accountBId: ''
      },
      dialogFormRules: {
        gradeName: [
          { required: true, message: this.$t('supplier.product.inputLevelName'), trigger: 'blur' }
        ],
        gradeStatus: [
          { required: true, message: this.$t('supplier.product.inputStatus'), trigger: 'change' }
        ]
      },
      selectList: [],
      selectList1: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        supplierCode: '',
        serviceName: ''
      },
      dialogData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        supplierCode: '',
        supplierSortBId: '',
        supplierGradeBId: '',
        countryCode: ''
      },
      sortList: [],
      gradeList: [],
      accountUserList: [],
      dataList: [],
      countryList: [],
      supplierList: []
    }
  },
  created() {
    this.getDataList();
    // this.getUserAccountList();
    this.getGradeList();
    this.getSortList()
  },
  methods: {
    clearData() {
      this.$refs['dialogData'].resetFields();
      this.supplierList = [];
      this.selectList1 = []
    },
    getParentId(arr) {
      if (arr.length) {
        this.dialogData.supplierSortBId = arr.join(',')
      } else {
        this.dialogData.supplierSortBId = ''
      }
    },
    // 获取等级列表
    getGradeList() {
      gradeList().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      sortList().then(res => {
        this.sortList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取后台用户
    getUserAccountList() {
      getAdminUserList().then(res => {
        this.accountUserList = res.data || []
      })
    },
    getAccountUserList(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectUserListAllApi(val).then(res => {
          _this.accountUserList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.accountUserList = [];
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
        }, 100);
      } else {
        this.countryList = [];
      }
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelSupplierServingList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', ' serviceStaff .xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    searchDialogData() {
      this.dialogData.pageNum = 1;
      this.getSupplierList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getServiceListPage(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    getSupplierList() {
      let obj = {};
      for (let key in this.dialogData) {
        if (this.dialogData[key]) {
          obj[key] = this.dialogData[key]
        }
      }
      getSupplierList(obj).then(res => {
        this.supplierList = res.data;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openEdit() {
      this.editVisible = true;
      this.serviceForm.accountBId = '';
    },
    openDetail(row) {
      this.detailVisible = true;
      this.dialogForm = deepClone(row)
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    },
    getDialogSelect(selects) {
      this.selectList1 = selects;
    },
    clearForm() {
      this.dialogForm.gradeName = '';
      this.dialogForm.gradeStatus = 1;
    },
    deleteList(row) {
      let obj = {};
      if (!row) {
        if (!this.selectList.length) {
          return this.$message.error(this.$t("system.userManage.option"))
        }
        obj = { ids: this.selectList.map(e => e.id).join(',') }
      } else {
        obj = { ids: row.id };
      }
      this.$confirm(this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"), {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: 'warning',
          center: true
        }).then(() => {
        deleteBatchService(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t('customer.category.operationSuccessful'))
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
    confirmAdd() {
      let obj = {};
      let { accountBId } = this.serviceForm;
      if (!this.selectList1.length) {
        return this.$message.error(this.$t('supplier.product.selectSupplier'))
      }
      if (!accountBId) {
        return this.$message.error(this.$t('supplier.product.inputService'))
      }
      obj.accountBId = accountBId;
      obj.supplierInfoList = this.selectList1;
      setServicePeople(obj).then(res => {
        this.$message.success(this.$t('customer.category.operationSuccessful'));
        this.editVisible = false;
        this.postData.pageNum = 1;
        this.serviceForm.accountBId = '';
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message);
      });
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
  .personnelAllotment {
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
    .service-bottom {
      padding-top: 15px;
      border-top: 1px solid $border-light-color;
    }
  }
</style>
