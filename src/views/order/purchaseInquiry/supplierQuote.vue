<template>
  <div class="app-container editPurchase">
    <div class="edit-title">采购询价单</div>
    <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px" size="small" class="edit-form" v-loading="loading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="询价单编码:">
            {{editForm.inquiryCode || '暂无单号'}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报价时间:">
            {{(editForm.quotedTime || new Date()) | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="报价人:">
          {{editForm.createBy}}
        </el-form-item>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td>卖方公司名称</td>
              <td>{{editForm.sellerName}}</td>
            </tr>
            <tr>
              <td>卖方地址</td><td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>卖方电话</td><td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>卖方联系人</td>
              <td>{{editForm.sellerContact}}</td>
              <!--<td>-->
                <!--<el-select v-model="editForm.sellerContact" allow-create filterable default-first-option placeholder="请选择联系人" class="edit-form-width">-->
                  <!--<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.contactName" :key="index"></el-option>-->
                <!--</el-select>-->
              <!--</td>-->
            </tr>
            <tr>
              <td>卖方邮箱</td><td>{{editForm.sellerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">开户银行</span></td>
              <td>
                <el-select v-model="editForm.sellerBankId" clearable placeholder="请选择开户银行" class="edit-form-width" @change="setSellerBankInfo">
                  <el-option v-for="(item, index) in supplierBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>银行账号</td><td>{{editForm.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIF编码</td><td>{{editForm.sellerSwifcode}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td>买方公司名称</td>
              <td>{{editForm.buyerName}}</td>
            </tr>
            <tr>
              <td>买方地址</td><td>{{editForm.buyerAddress}}</td>
            </tr>
            <tr>
              <td>买方电话</td><td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>买方联系人</td>
              <td>{{editForm.buyerContactBy}}</td>
            </tr>
            <tr>
              <td>买方邮箱</td><td>{{editForm.buyerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">开户银行</span></td>
              <td>
                {{editForm.buyerBank}}
              </td>
            </tr>
            <tr>
              <td>银行账号</td><td>{{editForm.buyerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIFE编码</td><td>{{editForm.buyerSwiftcode}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-col>
        <el-form-item label="币种" prop="orderCurrency">
          <el-select v-model="editForm.orderCurrency"
                     filterable
                     remote
                     :remote-method="getCurrencyCodeList"
                     :loading="loading2"
                     clearable
                     class="edit-form-width"
                     placeholder="请输入币种名或者币种编码查找">
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="起始时间:" prop="reBeginTime">
          <el-date-picker
            v-model="editForm.beginTime"
            disabled
            type="datetime"
            style="width: 250px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间:" prop="reBeginTime">
          <el-date-picker
            v-model="editForm.endTime"
            disabled
            type="datetime"
            style="width: 250px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-table
        :data="orderSkuList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column align="center" type="index" label="序号" width="55"/>

        <el-table-column align="center" min-width="285px" label="商品信息" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
              <div class="goods-text">
                <div style="font-weight: bold">{{scope.row.productName}}</div>
                <div>{{scope.row.catalogBName}}</div>
                <div>商品编码：{{scope.row.productCode}}</div>
                <div>海关编码：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="100px" label="采购量" prop="inquiryQuantity" />

        <el-table-column align="center" width="250px" label="采购备注" prop="inquiryRemark"/>

        <el-table-column align="center" width="150px" label="单价">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quotedPrice" controls-position="right" size="small" :min="0" @change="changeNumber(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" label="金额" min-width="100px" prop="quotedAmount"/>

        <el-table-column align="center" width="250px" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quotedRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

      </el-table>
      <el-row style="margin-top: 20px">
        <el-col>
          <el-form-item label="报价说明:" prop="quotedRemarks">
            <el-input v-model="editForm.quotedRemarks" :autosize="{ minRows: 6, maxRows: 10}" type="textarea" size="small" placeholder="报价说明字数不超过150" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>

      <div style="margin: 20px;">
        <order-step v-if="!Number($route.query.type)" :list="allNodeList"></order-step>
      </div>

      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" :loading="loading2" @click="submitOrder('editForm', 0)">保存</el-button>
        <el-button type="primary" size="small" :loading="loading2" @click="submitOrder('editForm', 2)">提交</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
        <!--<el-button type="primary" size="small" :loading="loading2" >保存</el-button>-->
        <!--<el-button type="primary" size="small" :loading="loading2" >提交</el-button>-->
        <!--<el-button type="danger" size="small" >返回</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import { getInquiryOrSupplierDetailsApi, updatePurchaseQuotedSingleApi, getPurchaseInquiryDetail, selectByBIdDetailsApi } from '@/api/order'
import { getIsDefaultSysCompanyInfoApi, selectCurrencyCodeListApi } from '@/api/system'
import { supplierDetailById, supplierBankList } from '@/api/supplier'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    OrderStep
  },
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      loading: false,
      loading2: false,
      currencyCodeList: [],
      modalList: [],
      orderSkuList: [],
      purchaseInquiryProductDetailList: [],
      purchaseQuotedProductDetailList: [],
      allNodeList: [],
      editForm: {
        createBy: '',
        netTotalAmount: 0, // 订单总金额
        purchaseNo: '',
        buyerName: '',
        buyerContactBy: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        buyerBank: '',
        buyerBankId: '',
        buyerBankAccount: '',
        buyerSwiftcode: '',
        salesOrderBId: '',
        sellerName: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sellerBank: '',
        sellerBankId: '',
        sellerBankAccount: '',
        sellerSwifcode: '',
        supplierBId: '', // 供应商BID
        quotedTime: '', // 报价订单报价时间
        sysCompanyBId: '', //  企业主体BID
        transportationWay: 0, // 运输方式
        entrustTransportation: 1, // 运输委托方（0铭美、1自提）
        orderCurrency: '', // 订单货币
        dateOfDelivery: 0, // 交货日期说明
        payMode: '', // 支付方式
        orderFreight: 0, // 运费
        choosedAttachment: '', // 选择的附件
        orderRemarks: '', // 订单备注
        arrivePort: '', // 到达港口
        departurePort: '', // 出发港口
        purchaseQuotedProductDetailList: [],
        id: '',
        bid: ''
      },
      purchaseQuotedSingleBId: '',
      editFormRules: {
        orderFreight: [
          { required: true, message: '请填写运费', trigger: 'blur' }
        ],
        orderCurrency: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ]
      },
      supplierCompanyForm: '', // 供应商主体企业
      supplierBankList: [],
      sysCompanyBankAccountList: [] // 默认主体企业下的默认银行账号
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
    totalInquiryQuantity() { // 询价量求和
      let sum = 0;
      this.orderSkuList.forEach(e => {
        sum += Number(e.inquiryQuantity)
      });
      return sum
    },
    totalInquiryAmount() { // 询价量总金额求和
      let sum = 0;
      this.orderSkuList.forEach(e => {
        sum += Number(e.quotedAmount)
      });
      return sum
    }
  },
  created() {
    this.getPurchaseInquiryDetailFun(); // 查询采购询价单主表详情
    this.getIsDefaultSysCompanyInfoAFun(); // 获取默认主体账号
    this.getInquiryOrSupplierDetailsFun(); // 供应商报价页面，获取供应商及其询价商品数据
    this.supplierDetailByIdFun(); // 获取供应商详情
    this.getselectByBIdDetailsFun(); // 根据采购询价bid和供应商bid来获取采购报价主表的具体数据
  },
  methods: {
    // 查询采购询价单主表详情
    getPurchaseInquiryDetailFun() {
      // let data = {
      //   bid: '1154589381328109568'
      // };
      getPurchaseInquiryDetail({ bid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商详情
    supplierDetailByIdFun() {
      let data = {
        // bid: this.$route.query.supplierBId
        bid: '1141589502603558912'
      };
      supplierDetailById(data).then(res => {
        this.supplierCompanyForm = res.data;
        let obj = this.supplierCompanyForm;
        this.editForm.sellerName = obj.companyName;
        this.editForm.sellerContact = obj.concatName;
        this.editForm.createBy = this.editForm.sellerContact;
        this.editForm.sellerAddress = obj.officeAddress;
        this.editForm.sellerTelephone = obj.officePhone;
        this.editForm.sellerEmail = obj.emailAddress;
        this.editForm.supplierBId = obj.bid;
        this.editForm.sellerBankId = '';
        this.getSupplierBankList();
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商银行卡列表
    getSupplierBankList(val) {
      supplierBankList({ supplierBId: this.editForm.supplierBId }).then(res => {
        this.supplierBankList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    setSellerBankInfo(val) {
      if (val) {
        let obj = this.supplierBankList.filter(e => {
          return e.id === val
        })[0];
        this.editForm.sellerBank = obj.bankName;
        this.editForm.sellerBankAccount = obj.bankAccount;
        this.editForm.sellerSwifcode = obj.swiftCode;
      } else {
        this.editForm.sellerBank = '';
        this.editForm.sellerBankAccount = '';
        this.editForm.sellerSwifcode = '';
      }
    },
    // 根据采购询价bid和供应商bid来获取采购报价主表的具体数据
    getselectByBIdDetailsFun() {
      let data = {
        purchaseInquiryBId: this.$route.query.id,
        // supplierBId: this.$route.query.supplierBId
        supplierBId: '1141589502603558912'
      };
      selectByBIdDetailsApi(data).then(res => {
        if (res.data.id != null && res.data.bid) {
          this.editForm.id = res.data.id;
          this.purchaseQuotedSingleBId = res.data.bid;
          console.log("this.editForm.id " + this.editForm.id);
          console.log("this.purchaseQuotedSingleBId " + this.purchaseQuotedSingleBId);
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 供应商报价页面，获取供应商及其询价商品数据
    getInquiryOrSupplierDetailsFun() {
      let data = {
        purchaseInquiryBId: this.$route.query.id,
        // supplierBId: this.$route.query.supplierBId
        supplierBId: '1141589502603558912'
      };
      getInquiryOrSupplierDetailsApi(data).then(res => {
        this.orderSkuList = (res.data || []).map(e => {
          return e.purchaseInquiryProductDetail
        });
        this.orderSkuList = this.orderSkuList.map(t => {
          t.quotedPrice = 0;
          t.inquiryDetailBId = t.bid;
          t.quotedAmount = t.quotedPrice * t.inquiryQuantity;
          // 需要获取到 `inquiry_detail_b_id` varchar(32) DEFAULT NULL COMMENT '采购询价商品明细BID',

          /* `purchase_quantity` decimal(18,4) DEFAULT NULL COMMENT '采购量',
  `purchase_amount` decimal(18,4) DEFAULT NULL COMMENT '采购金额',*/
          t.quotedRemark = '';
          return { ...t }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取默认主体账号
    getIsDefaultSysCompanyInfoAFun() {
      getIsDefaultSysCompanyInfoApi({ isDefault: 1 }).then(res => {
        let obj = res.data;
        this.editForm.buyerName = obj.companyName;
        this.editForm.buyerContactBy = obj.chargeBy;
        this.editForm.buyerAddress = obj.officeAddress;
        this.editForm.buyerTelephone = obj.officePhone;
        this.editForm.buyerEmail = obj.emailAddress;
        this.editForm.sysCompanyBId = obj.bid;
        this.editForm.buyerBank = obj.sysCompanyBankAccountList[0].bankName;
        this.editForm.buyerBankAccount = obj.sysCompanyBankAccountList[0].bankAccount;
        this.editForm.buyerSwiftcode = obj.sysCompanyBankAccountList[0].swiftCode;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchaseOrderInquiry'
        })
      })
    },
    changeNumber(item) {
      this.$nextTick(() => {
        item.quotedAmount = item.inquiryQuantity * item.quotedPrice
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
    submitOrder(formName, quotedStatus) {
      const { sysCompanyBId, supplierBId, sellerBankId, buyerBank, sellerBankAccount } = this.editForm;
      if (!sysCompanyBId && !supplierBId && !sellerBankId && !buyerBank && !sellerBankAccount) {
        return this.$message.warning('请选择买卖企业和开户银行账户')
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading2 = true;
          // 订单状态
          this.editForm.quotedStatus = quotedStatus;
          this.editForm.purchaseQuotedProductDetailList = this.orderSkuList.map(e => {
            e.purchaseInquiryBId = this.$route.query.id;
            return { ...e }
          });
          // this.editForm.salesOrderBId = [... new Set(this.orderSkuList.map(e => e.salesOrderBId))].join(',');
          // this.editForm.netTotalAmount = this.orderMoneyTotal;
          this.editForm.inquiryQuantity = this.totalInquiryQuantity;
          this.editForm.quotedNetAmount = this.totalInquiryAmount;

          // 这里需要传供应商bid
          /**
           * 这里需要传供应商bid
           * 这里需要传sku_code---sku编码
           * 这里需要传sku_b_id---SKU 业务BID
           * 这里需要传sku_remark---商品SKU备注
           */
          /**
           * 需要传 运费、总询价量、采购总量、SKU 数、报价单总金额(不包含运费)、采购总金额(不包含运费)
           *
           * `order_freight` decimal(18,4) DEFAULT NULL COMMENT '运费',
           `inquiry_quantity` decimal(18,4) DEFAULT NULL COMMENT '总询价量',
           `sku_number` int(11) DEFAULT NULL COMMENT 'SKU 数',
           `quoted_net_amount` decimal(18,4) DEFAULT NULL COMMENT '报价单总金额(不包含运费)',
           `purchase_quantity` decimal(18,4) DEFAULT NULL COMMENT '采购总量',
           `net_total_amount` decimal(18,4) DEFAULT NULL COMMENT '采购总金额(不包含运费)',
           */
          //  let api = this.$route.query.id
          this.editForm.purchaseInquiryBId = this.$route.query.id;
          // let api = this.id ? updatePurchaseQuotedSingleApi : savePurchaseQuotedSingleApi;
          // 不管是保存还是提交，都要传主键id，不然会报错，应该是后台代码是更新操作
          this.editForm.bid = this.purchaseQuotedSingleBId;
          let api = updatePurchaseQuotedSingleApi;
          api(this.editForm).then(res => {
            this.loading2 = false;
            this.$message.success(quotedStatus === 2 ? '提交成功' : '保存成功');
            this.closePage()
          }).catch(err => {
            this.loading2 = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editPurchase {
    width: 80%;
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
      width: 300px;
    }
    .row-item {
      margin-bottom: 20px;
    }
    .tableSet {
      text-align: center;
      width: 950px !important;
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
    .sale-order-list {
      margin: 20px 0;
      border-bottom: 1px solid $border-light-color;
      .search-div {
        padding: 5px;
        line-height: 38px;
        >div {
          display: inline-block;
          margin-right: 50px;
        }
      }
    }
    .sale-order-sku {
      margin: 20px 0;
      .company-fill {
        text-align: left;
        padding: 5px;
      }
    }
  }
</style>
