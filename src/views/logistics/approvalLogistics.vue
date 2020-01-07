<template>
  <div class="app-container logisticOrderDetail">
    <div class="edit-title">{{$t('logistics.logisticsOrder.approval')}}</div>
    <el-form label-position="left" label-width="165px" size="small" inline class="edit-form">
      <div>
        <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderNo')">
          {{detailForm.logisticsOrderNo || 'Null'}}
        </el-form-item>
      </div>
      <el-row :gutter="16">
        <el-col>
          <el-form-item :label="$t('logistics.logisticsOrder.orderType')" prop="orderType">
            <el-radio-group v-model="detailForm.orderType" disabled>
              <el-radio label="0">{{$t('logistics.logisticsOrder.sales')}}</el-radio>
              <el-radio label="1">{{$t('logistics.logisticsOrder.other')}}</el-radio>
              <el-radio label="2">{{$t('logistics.logisticsOrder.purchase')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('logistics.logisticsOrder.orderNo')" prop="orderNoArr">
            <el-input v-model="detailForm.orderNo" readonly placeholder="Please click the button to add order" style="width:500px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.supplierInfoBId')">
            <el-select v-model="detailForm.supplierInfoBId" disabled style="width: 240px">
              <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.customerBasicInfoBId')" prop="companyInfoBId">
            <el-select v-model="detailForm.companyInfoBId" disabled placeholder="select" style="width: 240px">
              <el-option v-for="(item, index) in companyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.transportationMethod')" prop="transportationMethod">
            <el-select v-model="detailForm.transportationMethod" disabled style="width: 240px">
              <el-option v-for="(item,index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.paymentCurrency')" prop="paymentCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="detailForm.paymentCurrency" disabled style="width: 240px">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.departurePortAdd')" prop="departurePortAdd">
            <el-input v-model="detailForm.departurePortAdd" disabled style="width: 240px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.destinationPortAdd')" prop="destinationPortAdd">
            <el-input v-model="detailForm.destinationPortAdd" disabled style="width: 240px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.etd2')" prop="eta">
            <el-date-picker v-model="detailForm.eta" type="datetime" disabled leplaceholder="select date" style="width: 240px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logistics.logisticsOrder.eta2')" prop="etd">
            <el-date-picker v-model="detailForm.etd" type="datetime" disabled placeholder="select date" style="width: 240px">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="detailForm.logisticsOrderProductsList"
            style="margin: 16px 0"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" :label="$t('logistics.logisticsOrder.productName')" prop="productName" show-overflow-tooltip >
              <template slot-scope="scope">
                {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('logistics.logisticsOrder.productDescription')" prop="productDescription" show-overflow-tooltip >
              <template slot-scope="scope">
                {{isZh ? scope.row.cnProductDescription : scope.row.enProductDescription}}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('logistics.logisticsOrder.clientProductRef')" prop="productSkuReference" show-overflow-tooltip />
            <el-table-column align="center" :label="$t('logistics.logisticsOrder.productQuantity')" prop="productQuantity" show-overflow-tooltip />
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderWeight')" prop="logisticsOrderWeight">
            <el-input v-model.number="detailForm.logisticsOrderWeight" readonly style="width:130px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderVolume')" prop="logisticsOrderVolume">
            <el-input v-model.number="detailForm.logisticsOrderVolume" readonly style="width:130px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('logistics.logisticsOrder.logisticsOrderAmount')" prop="logisticsOrderAmount">
            <el-input v-model.number="detailForm.logisticsOrderAmount" readonly style="width:130px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('logistics.logisticsOrder.remark')" prop="remark">
            <el-input v-model="detailForm.remark" type="textarea" readonly :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('logistics.logisticsOrder.filesList')">
            <div v-for="(item,index) in detailForm.logisticsOrderAttachmentsList" :key="index">
              {{item.attachmentName}}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ApprovalFlow @close="closePage"></ApprovalFlow>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import { parseTime, deepClone } from "@/utils/index";
import { selectCountryListApi, getSupplyCompanyList, selectCurrencyCodeListApi } from "@/api/system";
import { supplierTypeList } from "@/api/supplier";
import {
  // selectLogisticsOrderDetailListAPI,
  // getLogisticsOrderNoAPI,
  // getSaleOrderListByType,
  // getTransitradeOrderListByType,
  // getPurchaseOrderListByType,
  // addSaleOrderProductToLogistic,
  // addTransitradeOrderProductToLogistic,
  // addPurchaseOrderProductToLogistic,
  // saveLogisticsOrderDetailAPI,
  // submitLogisticsOrderDetailAPI,
  selectLogisticsOrderByIdAPI
} from '@/api/logistic'
import moneyFmt from "@/mixin/moneyFmt";
export default {
  components: {
    ApprovalFlow
  },
  mixins: [moneyFmt],
  data() {
    return {
      loading1: false,
      loading2: false,
      currencyCodeList: [],
      supplierList: [],
      companyList: [],
      detailForm: {
        logisticsOrderNo: '',
        companyInfoBId: '',
        supplierInfoBId: '',
        departurePortAdd: '',
        destinationPortAdd: '',
        eta: '',
        etd: '',
        logisticsOrderAmount: 0,
        logisticsOrderVolume: 0,
        logisticsOrderWeight: 0,
        orderNo: '',
        paymentCurrency: '',
        remark: '',
        transportationMethod: '1',
        orderType: '0',
        logisticsOrderProductsList: [],
        logisticsOrderAttachmentsList: []
      },
      orderTypeList: [
        {
          labelZh: '销售',
          label: 'Sales',
          orderType: 0
        },
        {
          labelZh: '转单',
          label: 'Other',
          orderType: 1
        },
        {
          labelZh: '采购',
          label: 'Purchase',
          orderType: 2
        }
      ]
    };
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    },
    transportList() {
      return this.$store.state.order.transportList
    },
    paymentList() {
      return this.$store.state.order.paymentList
    }
  },
  created() {
    this.getCurrencyCodeList();
    this.getSupplierList();
    this.getSysCustomerInfoListFun();
    this.getOrderDettail()
  },
  methods: {
    transportationFilter(val, flag) {
      switch (Number(val)) {
        case 1: return flag ? '汽运' : 'By Truck';
        case 2: return flag ? '铁路' : 'By Railway';
        case 3: return flag ? '海运' : 'By Ship';
        case 4: return flag ? '海运' : 'By Air';
        default: break
      }
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
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
    // 查询获取国家
    getCountryList(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || [];
          });
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 物流供应商列表
    getSupplierList() {
      supplierTypeList({ supplierType: 1 }).then(res => {
        this.supplierList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.companyList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getOrderDettail () {
      selectLogisticsOrderByIdAPI({ bId: this.$route.query.id }).then(res => {
        this.detailForm = deepClone(res.data);
        this.detailForm.transportationMethod = String(this.detailForm.transportationMethod)
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
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.logisticOrderDetail {
  width: 70%;
  margin: 0 auto;
  border: 1px solid $border-light-color;
  .edit-title {
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid $border-light-color;
  }
  .edit-form {
    margin-top: 20px;
  }
  .payment-box {
    >div {
      margin: 20px 0;
    }
    .payment-order {
      &-item {
        display: flex;
        line-height: 28px;
        >div {
          flex: 1;
          display: flex;
          .item-label {
            width: 130px;
          }
          .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .payment-supplier {
      display: flex;
      border-top: 1px solid $border-light-color;
      padding-top: 10px;
      >div {
        flex: 1;
        .payment-supplier-item {
          padding-left: 100px;
          flex: 1;
          display: flex;
          line-height: 35px;
          .item-label {
            width: 130px;
          }
          .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
