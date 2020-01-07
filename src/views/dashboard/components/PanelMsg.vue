<template>
  <div class="panel-msg">
    <div class="panel-title">
      {{title}}&nbsp;<el-badge v-if="total" :value="total" type="primary"></el-badge>
    </div>
    <div class="panel-list">
      <div class="panel-item" v-for="(item, index) in list" :key="index">
        <div class="panel-index">{{index + 1}}</div>
        <div class="panel-content">
          <div>
            <!--<div>类&emsp;型：{{item.businessType | businessName}}</div>-->
            <div class="left"><div>{{$t('common.dashboard.type')}}：</div><div class="content">{{item.businessType | businessName(approvalTypeList,isZh)}}</div></div>
          </div>
          <div>
            <div class="left"><div :style="{'width': isZh? '': '62px'}">{{$t('common.dashboard.orderNo')}}：</div><div class="content">{{item.businessBid || 'null'}}</div></div>
            <div class="right"><div class="label">{{$t('common.dashboard.time')}}：</div><div class="content">{{item.updateTime | timeFmt}}</div></div>
          </div>
          <div>
            <div class="left"><div>{{$t('common.dashboard.abstract')}}：</div><div class="content">{{isZh?item.cnRemark:item.enRemark}}</div></div>
          </div>
        </div>
        <div class="panel-event">
          <el-button type="primary" size="mini" v-if="type" @click="dealWith(item)">处理</el-button>
          <el-button type="primary" size="mini" v-if="item.processStatus === 1" class="export" @click="goRouter(item)">{{$t('common.table.view')}}</el-button>
        </div>
      </div>
      <div v-if="!list.length" class="no-data">{{$t('common.noData')}}</div>
      <div class="more-data" @click="goMoreDataPath">{{$t('common.more')}}>>></div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index';
import { updateAgendaItem, selectgetDictionaryBykeyApi } from '@/api/system';
export default {
  data() {
    return {
      userInfo1: {},
      approvalTypeList: [],
      list1: []
    }
  },
  created() {
    this.getApporvalTypeList()
  },
  props: {
    title: {
      type: String,
      default: 'Message'
    },
    list: {
      type: Array,
      default: () => []
    },
    pathType: {
      type: Number,
      default: 1
    },
    type: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    dealWith(item) {
      console.log(item)
    },
    getApporvalTypeList() {
      selectgetDictionaryBykeyApi({ key: 'approval_type' }).then(res => {
        this.approvalTypeList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    goMoreDataPath() {
      let path = '';
      switch (this.pathType) {
        case 1: path = '/approval/approval'; break;
        case 2: path = '/personal/remind'; break;
      }
      if (path) {
        this.$router.push({ path: path })
      }
    },
    goRouter(item) {
      let path = '';
      switch (Number(item.businessType)) {
        case 1: path = '/price/supplier/approval'; break;
        case 2: path = '/price/sale/approval'; break;
        case 3: path = '/query/quoteApproval'; break;
        case 4: path = '/order/sale/saleOrderApproval'; break;
        case 5: path = '/order/purchase/buyOrderApproval'; break;
        case 6: path = '/settlementFinance/sale/editPayRecord'; break;
        case 7: path = '/settlementFinance/payment/paymentMGT'; break;
        case 8: path = '/settlementFinance/payment/editLogistics?type=3'; break;
        case 9: path = '/logistics/approvalLogistics'; break;
        case 10: path = '/price/saleable/approval'; break;
        case 11: path = '/MarketIntelligence/approvalNews'; break;
        case 12: path = '/order/purchase/checkApproval'; break;
        case 13: path = '/order/sale/saleReceivingAudit'; break;
        case 14: path = '/order/transitrade/transitradeOrderApproval'; break;
        case 15: path = '/order/transitrade/orderTransitradeReceivingAudit'; break;
        case 16: path = '/settlementFinance/sale/editPayRecord?saleType=1'; break;
        case 17: path = '/settlementFinance/payment/transferPayment'; break;
      }
      if (path) {
        this.$router.push({
          path: path,
          query: {
            id: item.businessBid,
            approvalBid: item.approvalBid,
            agendaBid: item.bid,
            approvalNodeBid: item.approvalNodeBid,
            processBid: item.processBid,
            purchaseType: 3
          }
        });
        if (Number(item.businessType) === 6 || Number(item.businessType) === 16 || (Number(item.businessType) > 20)) {
          let obj = {
            id: item.id,
            processStatus: 2
          };
          // 做更新操作
          updateAgendaItem(obj).then(res => {
          }).catch(err => {
            this.$message.error(err.message)
          });
        }
      }
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    businessName(val, typeList, isZh) {
      let arr = typeList.filter(e => Number(e.value) === Number(val));
      if (arr.length) {
        return isZh ? arr[0].label : arr[0].labelEn
      } else {
        return ''
      }
      // switch (Number(val)) {
      //   case 1: return '供应商调价';
      //   case 2: return '销售调价';
      //   case 3: return '报价单审核';
      //   case 4: return '销售订单审核';
      //   case 5: return '采购订单审核';
      //   case 6: return '销售订单收款确认';
      //   case 7: return '采购订单付款申请审核';
      //   case 8: return '物流订单付款申请审核';
      //   case 9: return '物流订单审核';
      //   case 10: return '可售商品调价单审核';
      //   case 11: return '资讯审核';
      //   case 12: return '采购订单确认收货审核';
      //   case 13: return '销售订单确认收货审核';
      //   case 14: return '转单订单审核';
      //   case 15: return '转单订单确认收货审核';
      //   case 16: return '转单订单收款确认';
      // }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
.panel-msg{
  width: 100%;
  .panel-title {
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #a7bfee;
  }
  .panel-list {
    .panel-item {
      display: -webkit-flex;
      display: flex;
      height: 100px;
      border-bottom: 1px solid #ccc;
      border-right: 1px solid #ccc;
      border-left: 1px solid #ccc;
      .panel-index {
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        /*background: #adb8f7;*/
        border-right: 1px solid #ccc;
        width: 30px;
        padding: 5px;
      }
      .panel-content {
        flex: 1;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 5px;
        font-size: 12px;
        >div {
          display: flex;
          display: -webkit-flex;
          >div {
            flex: 1;
            display: flex;
            display: -webkit-flex;
            .label {
              width: 63px;
              min-width: 63px;
              text-align: right;
            }
            .content {
              flex: 1;
              text-align: left;
            }
          }
        }
        .text-red {
          color: #ff9800;
        }
        .text-green {
          color: #259b24;
        }
      }
      .panel-event {
        width: 90px;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 5px;
        text-align: center;
        button {
          display: block;
          width: 50px;
          margin: 0 auto;
        }
      }
    }
    .no-data {
      border: 1px solid #ccc;
      border-top: none;
      font-size: 12px;
      /*background: #f6f7fb;*/
      text-align: center;
      line-height: 36px;
    }
    .more-data {
      border: 1px solid #ccc;
      border-top: none;
      /*background: #f6f7fb;*/
      text-align: right;
      font-size: 12px;
      padding-right: 16px;
      line-height: 36px;
      cursor: pointer;
    }
    .more-data:hover {
      text-decoration: underline;
    }
  }
}
</style>
