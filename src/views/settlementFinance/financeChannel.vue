<template>
  <div class="app-container financingChannel">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <el-form-item :label="$t('finance.financeChannel.code')">
          <el-input v-model.trim="postData.instituteCode" clearable style="width: 200px" :placeholder="$t('finance.financeChannel.code')"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')">
          <el-input v-model.trim="postData.instituteName" clearable style="width: 200px" :placeholder="$t('finance.financeChannel.name')"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteClick()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect1">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('finance.financeChannel.code')" prop="instituteCode" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeChannel.name')" prop="instituteName" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeChannel.contact')" prop="instituteContact" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('common.table.updateBy')" prop="updateUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('common.table.updateTime')">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('common.status')" prop="updateUserName" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag :type="row.instituteStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ row.instituteStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh ? '180px' : '200px'" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.instituteStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.instituteStatus === 0 ? $t('system.role.enable') : $t('system.role.disable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" :title="dialogType === 'add' ? $t('finance.financeChannel.add') : $t('finance.financeChannel.edit')"
               width="600px" center @closed="clearData">
      <el-form ref="addForm" :model="addForm" v-if="addModel" :label-width="isZh ? '110px' : '200px'" label-position="right" size="small" style="margin-top: 15px" :rules="addFormRules">
        <el-form-item :label="$t('finance.financeChannel.code')" prop="instituteCode">
          <el-input v-model="addForm.instituteCode" maxlength="30" clearable class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')" prop="instituteName">
          <el-input v-model="addForm.instituteName" maxlength="100" clearable class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.supplierBId')" prop="supplierBId">
          <el-select v-model="addForm.supplierBId" clearable class="form-dialog-width">
            <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.contact')" prop="instituteContact">
          <el-input v-model="addForm.instituteContact" clearable class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.phone')" prop="instituteContactNumber">
          <el-input v-model="addForm.instituteContactNumber" clearable class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.address')" prop="instituteContactAddress">
          <el-input v-model="addForm.instituteContactAddress" clearable class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeProduct.name')" prop="productCheck">
          <el-checkbox-group v-model="addForm.productCheck" @change="getProductBId">
            <el-checkbox v-for="(item, index) in productList" :label="item.bid" :key="index">{{item.financingProductName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.annexe')" prop="fileCheck">
          <el-checkbox-group v-model="addForm.fileCheck" @change="getFileId">
            <el-checkbox v-for="(item, index) in fileList" :label="item.value" :key="index">{{language === 'zh' ? item.label : item.labelEn}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2)">
          {{$t('common.buttonText.save')}}
        </el-button>
        <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('finance.financeChannel.detail')" width="600px" center>
      <el-form :label-width="isZh ? '110px' : '200px'" label-position="right" size="small" style="margin-top: 15px">
        <el-form-item :label="$t('finance.financeChannel.code')">
          <el-input v-model="detailData.instituteCode" readonly class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')">
          <el-input v-model="detailData.instituteName" readonly class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.supplierBId')" prop="supplierBId">
          <el-select v-model="detailData.supplierBId" disabled clearable class="form-dialog-width">
            <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.contact')">
          <el-input v-model="detailData.instituteContact" readonly class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.phone')">
          <el-input v-model="detailData.instituteContactNumber" readonly class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.address')">
          <el-input v-model="detailData.instituteContactAddress" readonly class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeProduct.name')">
          <el-checkbox-group v-model="detailData.productCheck" disabled>
            <el-checkbox v-for="(item, index) in productList" :label="item.bid" :key="index">{{item.financingProductName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.annexe')">
          <el-checkbox-group v-model="detailData.fileCheck" disabled>
            <el-checkbox v-for="(item, index) in fileList" :label="item.value" :key="index">{{language === 'zh' ? item.label : item.labelEn}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;margin: 30px 0">
        <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  financeProduct,
  financeChannel,
  addFinanceChannel,
  updateFinanceChannel,
  delBatchFinanceChannel,
  exportByFinancingInstitute,
  enableFinancingInstitute
} from '@/api/finance'
import { supplierTypeList } from "@/api/supplier";
import { deepClone, parseTime } from '@/utils/index'
import { selectgetDictionaryBykeyApi } from '@/api/system'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      addLoading: false,
      addModel: false,
      detailModal: false,
      addChannelModal: false,
      dialogType: '',
      newRoleName: '',
      detailData: {},
      addForm: {
        instituteName: '',
        instituteCode: '',
        instituteContact: '',
        instituteContactNumber: '',
        instituteContactAddress: '',
        attachmentCode: '',
        financingProductBids: '',
        productCheck: [],
        fileCheck: [],
        instituteStatus: 0,
        supplierBId: ''
      },
      supplierList: [],
      addFormRules: {
        instituteCode: [
          { required: true, message: this.$t('finance.financeChannel.inputCode'), trigger: 'blur' }
        ],
        instituteName: [
          { required: true, message: this.$t('finance.financeChannel.inputName'), trigger: 'blur' }
        ],
        supplierBId: [
          { required: true, message: this.$t('finance.financeChannel.supplierBIdHint'), trigger: 'blur' }
        ],
        instituteContact: [
          { required: true, message: this.$t('finance.financeChannel.inputContact'), trigger: 'blur' }
        ],
        instituteContactNumber: [
          { required: true, message: this.$t('finance.financeChannel.inputNumber'), trigger: 'blur' }
        ],
        instituteContactAddress: [
          { required: true, message: this.$t('finance.financeChannel.inputAddress'), trigger: 'blur' }
        ],
        productCheck: [
          { type: 'array', required: true, message: this.$t('finance.financeChannel.inputCheck'), trigger: 'change' }
        ],
        fileCheck: [
          { type: 'array', required: true, message: this.$t('finance.financeChannel.inputfile'), trigger: 'change' }
        ]
      },
      productList: [],
      selectList: [],
      selectList1: [],
      userListParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        instituteName: '',
        instituteCode: ''
      },
      fileList: [],
      // fileList: [
      //   {
      //     labelZh: '形式发票',
      //     label: 'Proforma Invoice(P/I)',
      //     id: 1
      //   },
      //   {
      //     labelZh: '提货单',
      //     label: 'Bill of Lading(B/L)',
      //     id: 2
      //   },
      //   {
      //     labelZh: '合同',
      //     label: 'Contract',
      //     id: 3
      //   },
      //   {
      //     labelZh: '报关单',
      //     label: 'Customs Declaration',
      //     id: 4
      //   },
      //   {
      //     labelZh: '原产地证明',
      //     label: 'Certificate of Origin(C/O)',
      //     id: 5
      //   },
      //   {
      //     labelZh: '保险单',
      //     label: 'Insurance Poicy',
      //     id: 6
      //   },
      //   {
      //     labelZh: '品质证明',
      //     label: 'Certificate of Quality(C/Q)',
      //     id: 7
      //   },
      //   {
      //     labelZh: '装箱单',
      //     label: 'Packing List',
      //     id: 8
      //   }
      // ],
      dataList: []
    }
  },
  created() {
    this.getDataList();
    this.getProductList()
    this.dictionary();
    this.getSupplierList();
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  methods: {
    // 金融供应商列表
    getSupplierList() {
      supplierTypeList({ supplierType: 3 }).then(res => {
        this.supplierList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    setOption() {
      this.addFormRules = {
        instituteCode: [
          { required: true, message: this.$t('finance.financeChannel.inputCode'), trigger: 'blur' }
        ],
        instituteName: [
          { required: true, message: this.$t('finance.financeChannel.inputName'), trigger: 'blur' }
        ],
        instituteContact: [
          { required: true, message: this.$t('finance.financeChannel.inputContact'), trigger: 'blur' }
        ],
        instituteContactNumber: [
          { required: true, message: this.$t('finance.financeChannel.inputNumber'), trigger: 'blur' }
        ],
        instituteContactAddress: [
          { required: true, message: this.$t('finance.financeChannel.inputAddress'), trigger: 'blur' }
        ],
        productCheck: [
          { type: 'array', required: true, message: this.$t('finance.financeChannel.inputCheck'), trigger: 'change' }
        ],
        fileCheck: [
          { type: 'array', required: true, message: this.$t('finance.financeChannel.inputfile'), trigger: 'change' }
        ]
      }
    },
    clearData() {
      this.addForm.fileCheck = [];
      this.addForm.productCheck = [];
      this.addForm.instituteName = '';
      this.addForm.instituteCode = '';
      this.addForm.instituteContact = '';
      this.addForm.instituteContactNumber = '';
      this.addForm.instituteContactAddress = '';
      this.addForm.attachmentCode = '';
      this.addForm.financingProductBids = '';
      this.addForm.supplierBId = ''
    },
    getProductBId(arr) {
      if (arr) {
        this.addForm.financingProductBids = this.addForm.productCheck.join(',')
      } else {
        this.addForm.financingProductBids = ''
      }
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        type: row.instituteStatus === 1 ? 0 : 1
      };
      enableFinancingInstitute(obj).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    dictionary() {
      selectgetDictionaryBykeyApi({
        key: 'allowable attachment'
      }).then(res => {
        if (res.status === 200) {
          this.fileList = res.data || []
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getFileId(arr) {
      if (arr) {
        this.addForm.attachmentCode = this.addForm.fileCheck.join(',')
      } else {
        this.addForm.attachmentCode = ''
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    searchUser() {
      this.userListParam.pageNum = 1;
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      financeChannel(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getProductList() {
      financeProduct({ pageNum: 1, pageSize: 999 }).then(res => {
        this.productList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = Object.assign(this.addForm, row);
        if (this.addForm.attachmentCode) {
          this.addForm.fileCheck = this.addForm.attachmentCode.split(',')
        }
        if (this.addForm.financingProductBids) {
          this.addForm.productCheck = this.addForm.financingProductBids.split(',')
        }
      }
      this.addModel = true;
    },
    openDetail(row) {
      this.detailData = deepClone(row);
      if (this.detailData.attachmentCode) {
        this.detailData.fileCheck = this.detailData.attachmentCode.split(',')
      }
      if (this.detailData.financingProductBids) {
        this.detailData.productCheck = this.detailData.financingProductBids.split(',')
      }
      this.detailModal = true;
    },
    submitClick(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = type === 1 ? addFinanceChannel : updateFinanceChannel;
          this.addLoading = true;
          api(this.addForm).then(res => {
            this.$message.success(type === 1 ? this.$t("system.userManage.addSuccess") : this.$t("system.userManage.updata"));
            this.postData.pageNum = 1;
            this.addLoading = false;
            this.addModel = false;
            this.getDataList();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        }
      })
    },
    deleteClick() {
      if (!this.selectList1.length) {
        return this.$message.warning(this.$t("system.userManage.option"));
      } else {
        for (let i = 0; i < this.selectList1.length; i++) {
          if (this.selectList1[i].instituteStatus === 1) {
            return this.$message.warning(this.language === 'zh' ? '使用状态下,无法删除!' : 'Cannot delete in use state!')
          }
        }
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
        let obj = { ids: this.selectList1.map(e => e.id).join(',') };
        delBatchFinanceChannel(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t("system.userManage.handle"));
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
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    getSelect1(selects) {
      this.selectList1 = selects
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportByFinancingInstitute(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'financeChannelList.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status]
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>
