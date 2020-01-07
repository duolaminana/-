<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('order.sale.clientName')">
            <el-input v-model.trim="postData.customerUserName" clearable :placeholder="$t('order.sale.clientName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('order.sale.orderNo')">
            <el-input v-model.trim="postData.orderNo" clearable :placeholder="$t('order.sale.orderNo')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.table.status')">
            <el-select v-model="postData.orderStatus" clearable :placeholder="$t('common.table.status')" style="width: 200px">
              <el-option :label="isZh?'全部':'All'" value=""></el-option>
              <el-option v-for="(item, index) in orderStatusList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('order.sale.country')">
            <el-select filterable remote
                       :remote-method="getCountryList"
                       :loading="loading1"
                       v-model="postData.customerCountryCode"
                       clearable
                       :placeholder="$t('order.sale.countryPlaceholder')"
                       style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.start')">
            <el-date-picker
              v-model="postData.orderStartTime"
              :picker-options="pickerOptionsStart"
              type="datetime"
              style="width: 200px">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.end')">
            <el-date-picker
              v-model="postData.orderEndTime"
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
      <el-button type="primary" size="small" @click="goAddRouter">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteClick">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('order.sale.orderNo')" prop="orderNo" show-overflow-tooltip/>

      <el-table-column :label="$t('order.sale.clientName')" prop="buyerName" show-overflow-tooltip/>

      <el-table-column :label="$t('order.sale.country') + '/' + $t('order.sale.phone')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.buyerCountryCode}}/{{scope.row.buyerTelephone}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('order.sale.skuTotal')" prop="prodcutSkuCount" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('order.sale.amount')" prop="totalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.createdBy')" prop="createUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('order.sale.orderDate')" prop="createTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :width="isZh?'100px':'120px'" :label="$t('common.table.status')" prop="statusStr">
        <template slot-scope="scope">
          {{scope.row.orderStatus | statusFmt(orderStatusList, isZh)}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" :width="isZh ? '190px' : '265px'" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 3 || scope.row.orderStatus === 6" @click="goRouter(1, scope.row.bid)">
            {{$t('common.table.edit')}}
          </el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus === 2" @click="goRouter(2, scope.row.bid)">{{$t('order.sale.substitution')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus === 4" @click="goRouter(4, scope.row.bid)">{{$t('order.sale.confirm')}}</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.orderStatus > 6 && scope.row.orderStatus < 21" @click="openDialog(scope.row.bid)">
            {{$t('order.sale.statusAction')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('order.sale.saleStatusAction')" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('order.sale.orderNo')">
              {{detailForm.orderNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('order.sale.orderDate')">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('order.sale.buyer')}}</td>
                <td width="60%">
                  <!--<el-select v-model="detailForm.customerBId" disabled placeholder="请选择公司名称" class="edit-form-width">-->
                    <!--<el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                  <!--</el-select>-->
                  {{detailForm.buyerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contact')}}</td>
                <td>
                  {{detailForm.buyerContactBy | buyerContactName(modalList)}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.address')}}</td><td>{{detailForm.buyerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contactPhone')}}</td><td>{{detailForm.buyerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.email')}}</td><td>{{detailForm.buyerEmail}}</td>
              </tr>
              <tr>
                <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
                <td>
                  {{detailForm.buyerBank}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.bankAccount')}}</td><td>{{detailForm.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.swiftCode')}}</td><td>{{detailForm.buyerSwiftcode}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.destination')}}</td><td>{{detailForm.arrivePort}}</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('order.sale.seller')}}</td>
                <td width="60%">
                  <!--<el-select v-model="detailForm.sysCompanyBId" disabled placeholder="请选择卖方企业名称" class="edit-form-width">-->
                    <!--<el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                  <!--</el-select>-->
                  {{detailForm.sellerName}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contact')}}</td><td>{{detailForm.sellerContact}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.address')}}</td><td>{{detailForm.sellerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.contactPhone')}}</td><td>{{detailForm.sellerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.email')}}</td><td>{{detailForm.sellerEmail}}</td>
              </tr>
              <tr>
                <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
                <td>
                  {{detailForm.sellerBank}}
                </td>
              </tr>
              <tr>
                <td>{{$t('order.sale.bankAccount')}}</td><td>{{detailForm.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.swiftCode')}}</td><td>{{detailForm.sellerSwifcode}}</td>
              </tr>
              <tr>
                <td>{{$t('order.sale.departure')}}</td><td>{{detailForm.departurePort}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <div class="step-node">
          {{$t('order.sale.orderPrecess')}}
          <el-button type="primary" size="mini" style="float: right" @click="openFiles(detailForm.bid)">{{$t('order.sale.relatedFileUpload')}}</el-button>
        </div>

        <div style="margin: 20px 0; border-bottom: 1px solid #eee;">
          <order-step :list="allNodeList" :can-click="true"></order-step>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import { parseTime } from '@/utils/index'
import { selectCountryListApi, getSupplyCompanyList, selectgetDictionaryBykeyApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { getLinkList } from "@/api/supplier";
import { getSaleOrderList,
  deleteSaleOrder,
  saleOrderDetail,
  allNodeSaleOrder,
  exportBySalesOrderOne
} from '@/api/order'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination,
    OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      list: null,
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      rangeTime: [],
      selectList: [],
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        customerUserName: '',
        orderNo: '',
        orderStatus: '',
        customerCountryCode: '',
        orderEndTime: '',
        orderStartTime: ''
      },
      dataList: [],
      countryList: [],
      orderStatusList: [],
      detailForm: {},
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.postData.orderEndTime) {
            return time.getTime() > this.postData.orderEndTime
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.postData.orderStartTime) {
            return time.getTime() < this.postData.orderStartTime
          }
        }
      }
    }
  },
  watch: {
    isZh() {
      this.getDataList()
    }
  },
  created() {
    this.getOrderStatusList();
    this.getDataList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getCountryList();
  },
  methods: {
    // 点击 相关文件上传 到按钮跳转上传列表页面操作
    openFiles(id) {
      this.$router.push({
        path: '/order/sale/relevantFiles',
        query: {
          id: id,
          saleType: 2
        }
      });
    },
    goRouter(type, id) {
      let path = type === 1 ? '/order/sale/editOrder' : '/order/sale/saleOrderDetail';
      this.$router.push({
        path: path,
        query: {
          id, type
        }
      });
    },
    goAddRouter() {
      this.$router.push({
        path: '/order/sale/editOrder',
        query: {
          editType: true
        }
      });
    },
    getOrderStatusList() {
      selectgetDictionaryBykeyApi({ key: 'order status' }).then(res => {
        this.orderStatusList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
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
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      let api = this.detailForm.salesOrderType ? listCustomerContact : getLinkList;
      let obj = this.detailForm.salesOrderType ? { customerBId: val } : { supplierBId: val };
      api(obj).then(res => {
        this.modalList = this.detailForm.salesOrderType ? res.data.list : res.data
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.sysCustomerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(id) {
      this.getSaleOrderDetail(id);
      this.getAllNodeSaleOrder(id)
    },
    getSaleOrderDetail(id) {
      saleOrderDetail({ orderBid: id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.dialogVisible = true;
        this.customerContactFun(this.detailForm.customerBId || this.detailForm.supplierBId);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getAllNodeSaleOrder(id) {
      allNodeSaleOrder({ orderBid: id }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map((e, index) => {
          e.currentCompletion = (e.currentCompletion || 0).toString();
          // if (e.currentNodeFlag) {
          //   this.nodeActive = index
          // }
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.deleteDataTip'));
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].orderStatus !== 1) {
          return this.$message.warning(this.$t('price.tip.editDeleteTip'));
        }
      }
      this.$confirm(this.$t('common.tip.isDeleteMsg'), this.$t("system.userManage.hint"), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          ids: this.selectList.map(e => e.id).join(',')
        };
        deleteSaleOrder(obj).then(res => {
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
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      obj.apiType = 2;
      if (this.$route.query.customerUserBid) {
        obj.customerUserBid = this.$route.query.customerUserBid
      }
      getSaleOrderList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportBySalesOrderOne(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'salesOrderList.xls');
        document.body.appendChild(link)
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
    statusFmt(val, arr, isZh) {
      let objArr = arr.filter(e => Number(e.value) === val);
      if (objArr.length) {
        return isZh ? objArr[0].label : objArr[0].labelEn
      } else {
        return val
      }
    },
    buyerContactName(val, arr) {
      let objArr = arr.filter(e => e.accountBId === val);
      if (objArr.length) {
        return objArr[0].contactName
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .saleOrder {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .el-form-item__label {
      font-size: 12px;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .row-item {
      margin-bottom: 20px;
    }
    .step-node {
      position: relative;
      font-weight: bold;
      font-size: 15px;
      line-height: 40px;
      padding: 5px 5px 5px 20px;
      border-bottom: 1px solid $border-light-color;
    }
  }
</style>
