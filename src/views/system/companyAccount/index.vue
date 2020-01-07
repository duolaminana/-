<template>
  <div class="app-container companySetting">
    <el-tabs v-model="setType" :before-leave="changeTabs">
      <!--企业参数-->
      <el-tab-pane :label="$t('system.business.enterpriseParameter')" name="0">
        <companySet v-if="setType === '0'"/>
      </el-tab-pane>

      <!--原材料销售订单参数-->
      <!--<el-tab-pane :label="$t('system.business.rawParameter')" name="1">-->
        <!--<materialSet v-if="setType === '1'" />-->
      <!--</el-tab-pane>-->

      <!--标准产品销售订单参数-->
      <el-tab-pane :label="$t('system.business.salesOrderParameter')" name="2">
        <productSale v-if="setType === '2'" />
      </el-tab-pane>

      <!--标准产品采购订单参数-->
      <el-tab-pane :label="$t('system.business.purchaseOrderParameter')" name="3">
        <productBuy v-if="setType === '3'" />
      </el-tab-pane>

      <!--促销订单参数-->
      <el-tab-pane label="促销订单参数" name="4">
        <promotionalOrder v-if="setType === '4'" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

import companySet from './companySet'
// import materialSet from './materialSet'
import productSale from './productSale'
import productBuy from './productBuy'
import promotionalOrder from './promotionalOrder'
export default {
  components: {
    companySet,
    productSale,
    productBuy,
    promotionalOrder
  },
  data() {
    return {
      setType: '0'
    }
  },
  methods: {
    // 点击切换tabs
    changeTabs(name) {
      // switch (Number(name)) {
      // case 0: this.getDataList(); break;
      // case 1: this.selectSysOrderParameterFun(); break;
      // case 2: this.selectSysOrderParameterFun2(); break;
      // case 3: this.selectSysOrderParameterFun3(); break;
      // default: break;
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .companySetting {
    /*width: 1000px;*/
    width: 100%;
    min-width: 900px;
    overflow: auto;
    margin: 0 auto;
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
  }
</style>

