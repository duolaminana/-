<template>
  <el-steps :active="0" align-center class="order-step">
    <el-step
      v-for="(item, index) in list"
      :key="index"
      :title="isZh ? item.nodeNameCh : item.nodeName"
      :description="`${item.currentCompletion}%`"
      :class="Number(item.currentCompletion) | className"
      @click.native="clickGoRouter(item, index)">
    </el-step>
  </el-steps>
</template>

<script>
export default {
  name: 'OrderStep',
  data() {
    return {
      nodeActive: 100,
      forceArr: []
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: 0
    },
    canClick: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    saleType: {
      type: Number,
      default: 0
    }
  },
  watch: {
    list: {
      handler(arr) {
        let forceArr = [];
        arr.forEach((e, index) => {
          if (e.currentNodeFlag) {
            this.nodeActive = index
          }
          if (e.mandatoryFlag) {
            forceArr.push(index)
          }
        });
        this.forceArr = forceArr;
      },
      immediate: true
    }
  },
  filters: {
    className(val) {
      if (val === 0) {
        return 'step-wait';
      } else if (val === 100) {
        return 'step-finish';
      } else {
        return 'step-precess';
      }
    }
  },
  methods: {
    clickGoRouter(item, index) {
      if (!this.canClick) return false;
      let arr = this.forceArr.filter(e => e >= this.nodeActive);
      if (arr.length && (arr[0] < index)) {
        return false
      }
      let path = '';
      if (item.nodeType === 2) {
        path = this.type === 1 ? '/order/purchase/orderPayment?isApply=2' : '/order/sale/orderReceivables?saleType=' + this.saleType;
      } else if (item.triggerPointCode === 'logisticsFlow01') {
        path = this.type === 1 ? '/logistics/purchaseCarriage' : (this.saleType ? '/logistics/transferCarriage' : '/logistics/carriage');
      } else if (item.triggerPointCode === 'logisticsFlow02') {
        path = this.type === 1 ? '/logistics/purchaseArrival' : (this.saleType ? '/logistics/transferArrival' : '/logistics/arrival');
      } else if (item.triggerPointCode === 'orderFlow02') {
        path = this.type === 1 ? '/order/purchase/purchaseOrderStock' : '/order/sale/saleOrderStock?saleType=' + this.saleType;
      } else if (item.triggerPointCode === 'orderFlow03') {
        path = this.type === 1 ? '/order/purchase/purchaseOrderDelivery' : '/order/sale/saleOrderDelivery?saleType=' + this.saleType;
      } else if (item.triggerPointCode === 'orderFlow04') {
        path = this.type === 1 ? ('/order/purchase/purchaseOrderCheck?percent=' + item.currentCompletion)
          : (this.saleType ? '/order/transitrade/transitradeOrderCheck?percent=' + item.currentCompletion : '/order/sale/saleOrderCheck?percent=' + item.currentCompletion);
      } else if (item.triggerPointCode === 'orderFlow05') {
        path = this.type === 1 ? '/order/purchase/purchaseOrderSignFor' : '/order/sale/saleOrderSignFor?saleType=' + this.saleType;
      }

      this.$router.push({
        path: path,
        query: {
          id: item.orderBId, // 销售订单bid
          nodeId: item.id, // 订单主键id
          bId: item.bid, // 订单节点的bid
          workflowId: item.workflowNodeBId, // 流程控制台节点bid
          type: item.nodeType, // 流程控制塔类型
          purchaseType: this.type
        }
      });
    }
  }
}
</script>

<style lang="scss">
.order-step {
  margin: 30px 0;
  padding-top: 50px;
  .el-steps--horizontal {
    padding-top: 20px;
  }
  .el-step.is-horizontal .el-step__line {
    top: 17px;
    border-color: #8c97d3 !important;
  }
  .el-step__icon {
    width: 36px;
    height: 36px;
    cursor: pointer;
  }
  .el-step__icon-inner {
    color: white;
  }
  .el-step__title {
    position: absolute;
    top: -55px;
    text-align: center;
    width: 100%;
    font-size: 12px;
    line-height: 1.15rem;
    color: #2f4be1 !important;
    /*font-weight: bold;*/
  }
  .el-step__description {
    margin-top: 5px;
    color: #2f4be1 !important;
    font-weight: bold;
  }
  /*.is-finish {
    color: #3f51b5 !important;
    border-color: #3f51b5 !important;
    .el-step__icon {
      background: #3f51b5 !important;
    }
  }
  .is-process {
    color: #9393ec;
    border-color: #9393ec;
    .el-step__icon {
      background: #9393ec !important;
    }
  }
  .is-wait{
    color: #e3e4e8;
    border-color: #e3e4e8;
    .el-step__icon {
      background: #e3e4e8 !important;
    }
  }*/
  .step-finish {
    .el-step__icon {
      background: #3f51b5 !important;
      border-color: #3f51b5;
    }
  }

  .step-wait {
    .el-step__icon {
      background: #e3e4e8 !important;
      border-color: #e3e4e8;
    }
  }

  .step-precess {
    .el-step__icon {
      background: #9393ec !important;
      border-color: #9393ec;
    }
  }
}
</style>
