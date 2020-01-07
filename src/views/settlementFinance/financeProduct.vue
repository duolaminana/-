<template>
  <div class="app-container financingProduct">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('finance.financeProduct.code')">
            <el-input v-model.trim="postData.financingProductCode" clearable style="width: 200px" :placeholder="$t('finance.financeProduct.code')"/>
          </el-form-item>
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.status" clearable style="width: 150px" :placeholder="$t('common.status')">
              <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('finance.financeProduct.name')">
          <el-input v-model.trim="postData.financingProductName" clearable style="width: 200px" :placeholder="$t('finance.financeProduct.name')"/>
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
      <el-table-column :label="$t('finance.financeProduct.code')" prop="financingProductCode" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeProduct.name')" prop="financingProductName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('common.table.updateBy')" prop="updateUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('common.table.updateTime')" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="roleStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.status === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="265px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.status === 1 ? 'info' : 'danger'" size="mini" class="table-btn-width" @click="changeStatus(row)">
            {{row.status === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" :title="dialogType === 'add' ? $t('finance.financeProduct.add') : $t('finance.financeProduct.edit')"
               width="600px" center @close="clearData('addForm')">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form ref="addForm" :model="addForm" v-if="addModel" label-width="165px" label-position="left" size="small" style="margin-top: 15px" :rules="addFormRules">
            <el-form-item :label="$t('finance.financeProduct.code')" prop="financingProductCode">
              <el-input v-model="addForm.financingProductCode" maxlength="10" clearable class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('finance.financeProduct.name')" prop="financingProductName">
              <el-input v-model="addForm.financingProductName" maxlength="50" clearable class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('common.table.status')" v-model="addForm.status">
                {{addForm.status === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
            </el-form-item>
            <div style="text-align: center;margin: 30px 0">
              <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2)">
                {{$t('common.buttonText.save')}}
              </el-button>
              <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.cancel')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeProduct.channelList')" name="2" v-if="addForm.bid">
          <div style="text-align: right">
            <el-button type="primary" size="mini" @click="openChannelDialog">{{$t('finance.financeProduct.addFrom')}}</el-button>
          </div>
          <el-table
            :data="productChannelList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeChannel.code')" prop="instituteCode"/>

            <el-table-column align="center" :label="$t('finance.financeChannel.name')" prop="instituteName"/>
          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.cancel')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('finance.financeProduct.detail')" width="600px" center>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form label-width="160px" label-position="left" size="small" style="margin-top: 15px">
            <el-form-item :label="$t('finance.financeProduct.code')" prop="financingProductCode">
              <el-input v-model="detailData.financingProductCode" disabled class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('finance.financeProduct.name')" prop="financingProductName">
              <el-input v-model="detailData.financingProductName" disabled class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('common.table.status')" v-model="detailData.status">
              {{detailData.status === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
            </el-form-item>
            <div style="text-align: center;margin: 30px 0">
              <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeProduct.channelList')" name="2">
          <el-table
            :data="productChannelList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeChannel.code')" prop="instituteCode"/>

            <el-table-column align="center" :label="$t('finance.financeChannel.name')" prop="instituteName"/>

          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      width="800px"
      center
      :title="isZh?'选择渠道':'Select the Channels'"
      :close-on-click-modal="false"
      :visible.sync="addChannelModal"
      append-to-body>
      <div class="search-box">
        <el-form label-width="160px" label-position="right" inline size="small">
          <el-form-item :label="$t('finance.financeChannel.institute')">
            <el-input v-model.trim="channelPostData.instituteName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" class="export" @click="searchChannel">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="channelList"
        v-loading="channelLoading"
        border
        fit
        style="margin: 10px 0"
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('finance.financeChannel.code')" prop="instituteCode"/>

        <el-table-column align="center" :label="$t('finance.financeChannel.name')" prop="instituteName"/>

      </el-table>

      <Pagination :total="channelPostData.total" :page.sync="channelPostData.pageNum" :limit.sync="channelPostData.pageSize" @pagination="getChannelList"/>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addChannelToProduct">{{$t('common.add')}}</el-button>
        <el-button type="danger" size="small" @click="addChannelModal=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  financeProduct,
  addFinanceProduct,
  updateFinanceProduct,
  delBatchFinanceProduct,
  enableFinanceProduct,
  financeChannel,
  getFinanceChannelByProduct,
  addFinanceChannelByProduct,
  exportByFinancingProduct
} from '@/api/finance'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      addLoading: false,
      channelLoading: false,
      addModel: false,
      detailModal: false,
      addChannelModal: false,
      activeName: '1',
      dialogType: '',
      newRoleName: '',
      detailData: {},
      addForm: {
        financingProductCode: '',
        financingProductName: '',
        status: 1
      },
      addFormRules: {
        financingProductCode: [
          { required: true, message: this.$t('finance.financeProduct.inputCode'), trigger: 'blur' }
        ],
        financingProductName: [
          { required: true, message: this.$t('finance.financeProduct.inputName'), trigger: 'blur' }
        ]
      },
      channelList: [],
      productChannelList: [],
      selectList: [],
      selectList1: [],
      channelPostData: {
        instituteName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        financingProductCode: '',
        financingProductName: '',
        status: ''
      },
      statusList: [
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          labelZh: '使用中',
          label: 'Enabled',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ],
      dataList: []
    }
  },
  created() {
    this.getDataList()
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  methods: {
    setOption() {
      this.addFormRules = {
        financingProductCode: [
          { required: true, message: this.$t('finance.financeProduct.inputCode'), trigger: 'blur' }
        ],
        financingProductName: [
          { required: true, message: this.$t('finance.financeProduct.inputName'), trigger: 'blur' }
        ]
      }
    },
    clearData() {
      this.addForm = {
        financingProductCode: '',
        financingProductName: '',
        status: 1
      };
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    searchChannel() {
      this.channelPostData.pageNum = 1;
      this.getChannelList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      financeProduct(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.activeName = '1';
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = deepClone(row);
        this.getChannelListByBId(row.bid)
      }
      this.addModel = true;
    },
    openDetail(row) {
      this.activeName = '1';
      this.detailData = deepClone(row);
      this.getChannelListByBId(row.bid);
      this.detailModal = true;
    },
    openChannelDialog() {
      this.addChannelModal = true;
      this.getChannelList()
    },
    getChannelListByBId(id) {
      getFinanceChannelByProduct({ bid: id, instituteStatus: 0 }).then(res => {
        this.productChannelList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getChannelList() {
      let obj = {
        instituteStatus: 1
      };
      for (let key in this.channelPostData) {
        if (this.channelPostData[key] !== '') {
          obj[key] = this.channelPostData[key]
        }
      }
      this.channelLoading = true;
      financeChannel(obj).then(res => {
        this.channelList = res.data.list || [];
        this.channelPostData.total = res.data.total;
        this.channelLoading = false;
      }).catch(err => {
        this.channelLoading = false;
        this.$message.error(err.message)
      });
    },
    addChannelToProduct() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t("system.userManage.option"))
      }
      let obj = {
        productBid: this.addForm.bid,
        instituteBids: this.selectList.map(e => e.bid)
      };
      addFinanceChannelByProduct(obj).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getChannelListByBId(this.addForm.bid);
        this.addChannelModal = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    submitClick(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = type === 1 ? addFinanceProduct : updateFinanceProduct;
          this.addLoading = true;
          api(this.addForm).then(res => {
            this.$message.success(type === 1 ? this.$t("system.userManage.addSuccess") : this.$t("system.userManage.updata"));
            this.addForm.bid = type === 1 ? res.data : this.addForm.bid;
            this.postData.pageNum = 1;
            this.addLoading = false;
            this.getDataList();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        }
      })
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        type: row.status === 1 ? 0 : 1
      };
      enableFinanceProduct(obj).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteClick() {
      if (!this.selectList1.length) {
        return this.$message.warning(this.$t("system.userManage.option"));
      } else {
        for (let i = 0; i < this.selectList1.length; i++) {
          if (this.selectList1[i].status === 1) {
            return this.$message.warning(this.language === 'zh' ? '正在使用中,无法删除!' : 'In use, cannot delete!')
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
        delBatchFinanceProduct(obj).then(res => {
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
      exportByFinancingProduct(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'financeProductList.xls');
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
