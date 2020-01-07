<template>
  <div class="app-container editOrder">
    <div class="edit-title">{{$t('order.purchase.orderApproval')}}</div>
    <el-form ref="editForm" :model="editForm" label-width="170px" size="small" class="edit-form">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('order.sale.orderNo')">
            {{editForm.purchaseNo ? editForm.purchaseNo : 'Null'}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('order.sale.orderDate')">
            {{(editForm.orderCreateTime || new Date()) | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="11">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">{{$t('order.sale.buyer')}}</td>
              <td width="60%">{{editForm.buyerName}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contact')}}</td>
              <td>{{editForm.buyerContactBy}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.address')}}</td><td>{{editForm.buyerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contactPhone')}}</td><td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.email')}}</td><td>{{editForm.buyerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
              <td>
                {{editForm.buyerBank}}
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.bankAccount')}}</td><td>{{editForm.buyerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.swiftCode')}}</td><td>{{editForm.buyerSwiftcode}}</td>
            </tr>
            <!--<tr>-->
              <!--<td>目的港口</td><td>{{editForm.arrivePort}}</td>-->
            <!--</tr>-->
          </table>
        </el-col>
        <el-col :span="11">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">{{$t('order.sale.seller')}}</td>
              <td width="60%">{{editForm.sellerName}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contact')}}</td><td>{{editForm.sellerContact}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.address')}}</td><td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.contactPhone')}}</td><td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.email')}}</td><td>{{editForm.sellerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">{{$t('order.sale.bank')}}</span></td>
              <td>
                {{editForm.sellerBank}}
              </td>
            </tr>
            <tr>
              <td>{{$t('order.sale.bankAccount')}}</td><td>{{editForm.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>{{$t('order.sale.swiftCode')}}</td><td>{{editForm.sellerSwifcode}}</td>
            </tr>
            <!--<tr>-->
              <!--<td>出发港口</td><td>{{editForm.departurePort}}</td>-->
            <!--</tr>-->
          </table>
        </el-col>
      </el-row>
      <div class="table-top">
        <div class="top-title">{{$t('order.sale.products')}}:</div>
      </div>
      <el-table
        :data="orderSkuList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column align="center" type="index" :label="$t('common.table.id')" width="55"/>

        <!--<el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >-->
        <!--<template slot-scope="scope">-->
        <!--<div class="table-goods">-->
        <!--<div class="goods-img"><img :src="fullUrl(scope.row.productImge)" alt=""></div>-->
        <!--<div class="goods-text">-->
        <!--<div>{{scope.row.productCode}}/{{scope.row.productName}}</div>-->
        <!--<div>海关编码：{{scope.row.customsCode}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column align="center" min-width="150px" label="SKU描述" >-->
        <!--<template slot-scope="scope">-->
        <!--<div class="table-goods">-->
        <!--<div class="goods-text" style="text-align: center">-->
        <!--<div>{{scope.row.productDescription}}</div>-->
        <!--<div>sku编码：{{scope.row.skuCode}}</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" width="110" :label="$t('product.product.customsCode')" prop="customsCode"/>

        <el-table-column align="center" width="80" :label="$t('product.product.skuCode')" prop="skuCode"/>

        <el-table-column align="center" width="120" :label="$t('product.product.productName')" prop="productName">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="150" :label="$t('order.sale.productDescription')" prop="productDescription">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('order.sale.reference')">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnSkuReference : scope.row.enSkuReference}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.quotedQuantity')">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unit')">
          <template slot-scope="scope">
            {{scope.row.productUnit}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.unitPrice')">
          <template slot-scope="scope">
            {{scope.row.productPrice}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" :label="$t('order.sale.amount')" prop="productAmount"/>

        <el-table-column align="center" min-width="150" :label="$t('common.table.remark')">
          <template slot-scope="scope">
            {{scope.row.productRemark}}
          </template>
        </el-table-column>

      </el-table>
      <el-form-item/>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.freight')">
            {{editForm.orderFreight | toThousandFilter}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.totalAmount')">
            {{editForm.totalAmount | toThousandFilter}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.deliveryDate')" prop="dateOfDelivery">
            <el-input v-model="editForm.dateOfDelivery" readonly style="width: 700px"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.departure')" prop="departurePort">
            <el-input v-model="editForm.departurePort" readonly style="width: 700px" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('order.sale.destination')" prop="arrivePort">
            <el-input v-model="editForm.arrivePort" readonly style="width: 700px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.transportBy')" prop="entrustTransportation">
            <el-select v-model="editForm.entrustTransportation" disabled class="edit-form-width">
              <el-option :label="isZh?'SGI': 'SGI'" :value="0"></el-option>
              <el-option :label="isZh?'自提': 'Self'" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.transportationMethod')" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" class="edit-form-width" disabled>
              <el-option v-for="(item,index) in transportList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.currency')" prop="orderCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.orderCurrency" disabled class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('order.sale.payWay')" prop="payMode">
            <el-select v-model="editForm.payMode" disabled class="edit-form-width">
              <el-option v-for="(item, index) in paymentList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('order.sale.payTerm')">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
          <tr>
            <th>{{$t('common.table.id')}}</th>
            <th>{{$t('order.sale.payNode')}}</th>
            <th>{{$t('order.sale.payPercent')}}</th>
            <th>{{$t('order.sale.payDays')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in controlTowerList" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.nodeName}}</td>
            <td>
              {{item.paymentRatio}}%
            </td>
            <td>
              {{item.paymentTerm || 0}}&nbsp;{{$t('order.sale.days')}}
            </td>
          </tr>
          <tr v-if="!controlTowerList.length">
            <td colspan="4" style="text-align: center;padding: 5px">{{$t('common.noData')}}</td>
          </tr>
          </tbody>
        </table>
      </el-form-item>

      <el-row style="margin-top: 16px">
        <el-col>
          <el-form-item :label="$t('order.sale.fileType')">
            <el-checkbox-group v-model="fileTypeCheck" disabled>
              <el-checkbox v-for="(item, index) in fileTypeList" :label="item.value" :key="index">
                <span>{{isZh?item.label:item.labelEn}}</span>
                <!--<span v-else>{{newFileType}}</span>-->
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('common.table.remark')" prop="orderRemarks">
            <el-input v-model="editForm.orderRemarks" disabled :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ApprovalFlow @close="closePage"></ApprovalFlow>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectSysOrderParameterApi, selectgetDictionaryBykeyApi } from '@/api/system'
import { parseTime } from '@/utils/index'
import { getDetailPOFlowById, payTermsByBid } from '@/api/purchaseOrder'
export default {
  components: {
    ApprovalFlow
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      listLoading1: false,
      dialogVisible: false,
      loading1: false,
      loading2: false,
      currencyCodeList: [],
      modalList: [],
      selectList: [],
      dialogSelectList: [],
      controlTowerList: [],
      orderSkuList: [],
      fileTypeCheck: [],
      allNodeList: [],
      newFileType: '',
      overAllowMoney: false,
      editForm: {
        netTotalAmount: 0, // 订单总金额
        purchaseNo: '',
        buyerName: '',
        buyerContactBy: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        buyerBankId: '',
        buyerBank: '',
        buyerBankAccount: '',
        buyerSwiftcode: '',
        sellerName: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sellerBankId: '',
        sellerBank: '',
        sellerBankAccount: '',
        sellerSwifcode: '',
        sysCompanyBId: '', //  企业主体BID
        transportationWay: 2, // 运输方式
        entrustTransportation: 0, // 运输委托方（0铭美、1自提）
        orderCurrency: '', // 订单货币
        dateOfDelivery: 0, // 交货日期说明
        payMode: '', // 支付方式
        orderFreight: 0, // 运费
        choosedAttachment: '', // 选择的附件
        orderRemarks: '', // 订单备注
        arrivePort: '', // 到达港口
        departurePort: '' // 出发港口
      },
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      sysCustomerInfoList: [],
      fileTypeList: [],
      paymentMethodList: [
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
    },
    orderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      return val
    }
  },
  created() {
    this.getCurrencyCodeList();
    this.getSysCustomerInfoListFun();
    this.getPurchaseOrderDetail();
    this.getFileTypeList()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchaseOrder'
        })
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.sysCustomerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
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
    // 获取付款条件节点数据
    selectPayTermsByBid(val) {
      payTermsByBid({ supplierBId: val }).then(res => {
        if (res.data.sopnList && res.data.sopnList.length) {
          this.controlTowerList = res.data.sopnList.map(e => {
            e.paymentTerm = e.dayNum;
            return { ...e }
          });
        } else {
          this.controlTowerList = res.data.sysOrderPayNodeList.map(e => {
            e.paymentTerm = e.dayNum;
            return { ...e }
          });
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getFileTypeList() {
      selectgetDictionaryBykeyApi({ key: 'allowable attachment' }).then(res => {
        this.getSaleSetting(res.data);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleSetting(fileTypeList) {
      selectSysOrderParameterApi({ orderParameterType: 3 }).then(res => {
        if (res.data) {
          this.editForm.toleranceNumber = res.data.toleranceNumber
        }
        let saleFileType = res.data.sysOrderParameterAnnexList.filter(e => {
          // if (e.dictCode === '8' && e.isAllow) {
          //   this.newFileType = e.customizeName;
          // }
          return e.isAllow
        }).map(t => {
          return t.dictCode
        });
        this.fileTypeList = fileTypeList.filter(e => {
          return saleFileType.includes(e.value)
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getPurchaseOrderDetail() {
      getDetailPOFlowById({ bid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.orderSkuList = this.editForm.productList;
        if (this.editForm.paymentList && this.editForm.paymentList.length) {
          this.controlTowerList = this.editForm.paymentList;
        } else {
          this.selectPayTermsByBid(this.editForm.supplierBId);
        }
        if (res.data.wfplist) {
          this.allNodeList = res.data.wfplist.map(e => {
            e.currentCompletion = (e.currentCompletion || 0).toString();
            return { ...e }
          });
        }
        if (this.editForm.choosedAttachment) {
          this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editOrder {
    width: 90%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
      position: relative;
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
    .edit-form-width {
      width: 260px;
    }
    .row-item {
      margin-bottom: 20px;
    }
    .tableSet {
      text-align: center;
      width: 1000px !important;
      thead {
        tr {
          th {
            padding: 3px;
            border-right: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            border-bottom: 1px solid $border-light-color;
          }
          th:first-child {
            border-left: 1px solid $border-light-color;
          }
        }
      }
      tr {
        td {
          padding: 3px;
          border-right: 1px solid $border-light-color;
          border-bottom: 1px solid $border-light-color;
        }
        td:first-child {
          border-left: 1px solid $border-light-color;
        }
      }
    }
    .table-top {
      line-height: 1.5rem;
      padding: 5px;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      .top-title {
        width: 50%;
        text-align: left;
      }
      .top-btns {
        width: 50%;
        text-align: right;
      }
      button {
        margin: 0 10px;
      }
    }
    .table-goods {
      display: flex;
      display: -webkit-flex;
      .goods-img {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods-text {
        margin-left: 10px;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;
        >div {
          font-size: 12px;
        }
      }
    }
    .order-record {
      font-size: 16px;
      font-weight: bold;
      color: #3f51b5;
      text-decoration: underline;
    }
  }
</style>
