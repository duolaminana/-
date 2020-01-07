<template>
  <div class="app-container materialSet">
    <el-form ref="formMaterial" :model="formMaterial" :rules="formMaterialRules" :label-width="isZh?'100px':'190px'" size="small" label-position="left">
      <el-row :gutter="28">
        <el-col>
          <el-form-item :label="$t('system.business.currencyCode')" prop="currencyCode2">
            <el-select filterable remote :remote-method="selectCurrencyCodeListFun" :loading="loading1" v-model="formMaterial.currencyCode2" clearable :placeholder="$t('system.business.searchCurrencyCode')" style="width: 250px">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('system.business.priceGradient')" prop="priceGradient">
            <el-select v-model="formMaterial.priceGradient" clearable style="width: 250px">
              <el-option v-for="(item, index) in priceGradientList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('system.business.displayPrice')" prop="displayPrice">
            <el-select v-model="formMaterial.displayPrice" clearable style="width: 200px">
              <el-option v-for="(item, index) in displayPriceList" :disabled="Number(formMaterial.priceGradient) < Number(item.value)" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('system.business.baseType')" prop="baseType">
            <el-radio-group v-model="formMaterial.baseType">
              <el-radio :label="0">EXW</el-radio>
              <el-radio :label="1">FOB</el-radio>
              <el-radio :label="2">CIF</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="formMaterial.baseType == 1">
          <el-form-item :label="$t('system.business.basePort')" prop="basePort">
            <el-input v-model="formMaterial.basePort" clearable :placeholder="$t('system.business.basePort')" style="width: 200px" />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('system.business.toleranceNumber')" prop="toleranceNumber">
            <el-input v-model.number="formMaterial.toleranceNumber" :min="0" :precision="0" clearable :placeholder="$t('system.business.toleranceNumber')" style="width: 250px"/>&nbsp;%
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('system.business.validityPeriod')" prop="validityPeriod">
            <el-input v-model.number="formMaterial.validityPeriod" :min="1" :precision="0" clearable :placeholder="$t('system.business.validityPeriod')" style="width: 200px" />&nbsp;{{$t('system.business.day')}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item :label="$t('system.business.dataOfDelivery')" prop="dataOfDelivery">
            <el-input v-model="formMaterial.dataOfDelivery" style="width: 760px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="13">
          <el-form-item :label="$t('system.business.transportModeArr')" prop="transportModeArr">
            <el-checkbox-group v-model="formMaterial.transportModeArr" @change="getCheckBoxVal">
              <el-checkbox :label="1">{{$t('system.business.car')}}</el-checkbox>
              <el-checkbox :label="2">{{$t('system.business.railway')}}</el-checkbox>
              <el-checkbox :label="3">{{$t('system.business.sea')}}</el-checkbox>
              <el-checkbox :label="4">{{$t('system.business.airParcel')}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('system.business.transportModeDefault')" prop="transportModeDefault">
            <el-select v-model="formMaterial.transportModeDefault" clearable style="width: 200px">
              <el-option v-for="(item, index) in transportModeList" :label="language === 'zh' ? item.labelCh :item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('system.business.payModeArr')" prop="payModeArr">
            <el-checkbox-group v-model="formMaterial.payModeArr" @change="getPayModeVal">
              <el-checkbox :label="1">T/T</el-checkbox>
              <el-checkbox :label="2">L/C</el-checkbox>
              <el-checkbox :label="3">P/A</el-checkbox>
              <el-checkbox :label="4">D/A</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('system.business.payModeDefault')" prop="payModeDefault">
            <el-select v-model="formMaterial.payModeDefault" clearable style="width: 200px">
              <el-option v-for="(item, index) in payModeDefaultList" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('system.business.paymentDefault')">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
            <tr style="background-color: #a7bfee">
              <th>{{$t('system.business.indexCode')}}</th>
              <th>{{$t('system.business.nodeName')}}</th>
              <th>{{$t('system.business.paymentRatio')}}</th>
              <th>{{$t('system.business.dayNum')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in controlTowerList" :key="index">
              <td>{{index + 1}}</td>
              <!--<td>{{item.nodeName}}</td>-->
              <td>{{ isZh? item.nodeNameCh : item.nodeName}}</td>
              <td>
                <el-input-number v-model="item.paymentRatio" :min="0" :max="100" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;%
              </td>
              <td>
                <el-input-number v-model="item.dayNum" :min="0" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;{{$t('system.business.day')}}
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
      <el-form-item :label="$t('system.business.fileTypeCheck')">
        <el-checkbox-group v-model="fileTypeCheck" @change="getFileCheckBox">
          <el-checkbox v-for="(item, index) in fileTypeList" :label="item.value" :key="index">
            <!--<span>{{item.label}}</span>-->
            <span>{{language === 'zh' ? item.label : item.labelEn}}</span>
            <!--<span v-if="item.value === '8' && showFileType"><el-input v-model="newFileType" placeholder="自定义类型" size="mini" clearable style="width: 200px" /></span>-->
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="onSubmit('formMaterial')">{{$t('common.buttonText.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { selectCurrencyCodeListApi,
  selectgetDictionaryBykeyApi,
  selectSysOrderParameterApi,
  updateSysOrderParameterApi,
  selectControlTowerListApi
} from '@/api/system';
export default {
  data() {
    return {
      setType: '1',
      postData: {
        setType: 1
      },
      loading1: false,
      showFileType: false,
      newFileType: '',
      fileTypeList: [],
      priceGradientList: [],
      displayPriceList: [],
      fileTypeCheck: [],
      controlTowerList: [],
      formMaterial: {
        currencyCode2: '',
        baseType: 0,
        basePort: '',
        priceGradient: '',
        displayPrice: '',
        toleranceNumber: 0,
        validityPeriod: '',
        transportMode: '',
        transportModeArr: [],
        payModeArr: [],
        payMode: '',
        sysOrderParameterAnnexList: [],
        sysOrderPayNodeList: [],
        sysOrderTradeCurrencyList: [],
        fileType: [],
        bId: '',
        dictCode: '',
        isAllow: '',
        customizeName: '',
        dataOfDelivery: 0,
        transportModeDefault: '',
        payModeDefault: ''
      },
      formMaterialRules: {
        currencyCode2: [{ required: true, message: this.$t('system.business.currencyCode2Hint'), trigger: 'change' }],
        priceGradient: [{ required: true, message: this.$t('system.business.priceGradientHint'), trigger: 'change' }],
        displayPrice: [{ required: true, message: this.$t('system.business.displayPriceHint'), trigger: 'change' }],
        toleranceNumber: [{ type: 'number', required: true, message: this.$t('system.business.toleranceNumberHint'), trigger: 'blur' }],
        validityPeriod: [{ type: 'number', required: true, message: this.$t('system.business.validityPeriodHint'), trigger: 'blur' }],
        dataOfDelivery: [{ required: true, message: this.$t('system.business.dataOfDeliveryHint'), trigger: 'blur' }],
        transportModeArr: [{ type: 'array', required: true, message: this.$t('system.business.transportModeArrHint'), trigger: 'change' }],
        transportModeDefault: [{ required: true, message: this.$t('system.business.transportModeDefaultHint'), trigger: 'change' }],
        payModeArr: [{ type: 'array', required: true, message: this.$t('system.business.payModeArrHint'), trigger: 'change' }],
        payModeDefault: [{ required: true, message: this.$t('system.business.payModeDefaultHint'), trigger: 'change' }],
        basePort: [{ required: true, message: this.$t('system.business.basePortHint'), trigger: 'change' }]
      },
      currencyCodeList: '',
      transportModeList: [],
      payModeDefaultList: []
    }
  },
  computed: {
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val;
    }
  },
  watch: {
    isZh() {
      this.formMaterialRules = {
        currencyCode2: [{ required: true, message: this.$t('system.business.currencyCode2Hint'), trigger: 'change' }],
        priceGradient: [{ required: true, message: this.$t('system.business.priceGradientHint'), trigger: 'change' }],
        displayPrice: [{ required: true, message: this.$t('system.business.displayPriceHint'), trigger: 'change' }],
        toleranceNumber: [{ type: 'number', required: true, message: this.$t('system.business.toleranceNumberHint'), trigger: 'blur' }],
        validityPeriod: [{ type: 'number', required: true, message: this.$t('system.business.validityPeriodHint'), trigger: 'blur' }],
        dataOfDelivery: [{ required: true, message: this.$t('system.business.dataOfDeliveryHint'), trigger: 'blur' }],
        transportModeArr: [{ type: 'array', required: true, message: this.$t('system.business.transportModeArrHint'), trigger: 'change' }],
        transportModeDefault: [{ required: true, message: this.$t('system.business.transportModeDefaultHint'), trigger: 'change' }],
        payModeArr: [{ type: 'array', required: true, message: this.$t('system.business.payModeArrHint'), trigger: 'change' }],
        payModeDefault: [{ required: true, message: this.$t('system.business.payModeDefaultHint'), trigger: 'change' }],
        basePort: [{ required: true, message: this.$t('system.business.basePortHint'), trigger: 'change' }]
      }
    }
  },
  created() {
    this.selectSysOrderParameterFun(); // 根据类型获取数据
    this.selectgetDictionaryBykeyFun(); // 数据字典， 获取允许附件列表值
    this.selectgetDictionaryPriceGradientFun(); // 数据字典， 获取梯度值
    this.selectgetDictionaryVisiblePriceFun(); // 数据字典，获取默认显示价格值
    this.selectCurrencyCodeListFun(); // 币种列表
  },
  methods: {
    selectSysOrderParameterFun() {
      selectSysOrderParameterApi({ orderParameterType: 1 }).then(res => {
        this.selectControlTowerListFun(); // 根据类型查询流程控制列表
        if (res.data !== null) {
          this.formMaterial = Object.assign(this.formMaterial, res.data);
        } else {
          return;
        }
        if (res.data.transportMode) {
          this.formMaterial.transportModeArr = res.data.transportMode.toString().split(',').map(e => Number(e));
          this.transportModeList = this.formMaterial.transportModeArr.map(e => {
            return {
              value: e.toString(),
              label: this.getWayName(e),
              labelCh: this.getWayNameCh(e)
            }
          });
        }
        if (res.data.payMode) {
          this.formMaterial.payModeArr = res.data.payMode.toString().split(',').map(e => Number(e));
          this.payModeDefaultList = this.formMaterial.payModeArr.map(e => {
            return {
              value: e.toString(),
              label: this.getPayModeName(e)
            }
          });
        }
        this.fileTypeCheck = res.data.sysOrderParameterAnnexList.filter(e => {
          if (e.dictCode === '8' && e.isAllow) {
            this.showFileType = true;
            this.newFileType = e.customizeName
          }
          return e.isAllow
        }).map(t => {
          return t.dictCode
        });
        this.formMaterial.bId = res.data.bid;
        // this.selectControlTowerListFun(); // 根据类型查询流程控制列表
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    selectCurrencyCodeListFun(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectCurrencyCodeListApi(val).then(res => {
          _this.currencyCodeList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.currencyCodeList = [];
      }
    },
    // 数据字典,获取允许附件值
    selectgetDictionaryBykeyFun() {
      let data = {};
      data.key = 'allowable attachment';
      selectgetDictionaryBykeyApi(data).then(res => {
        this.fileTypeList = res.data;
        this.formMaterial.dictCode = res.data.value;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 数据字典，获取梯度值
    selectgetDictionaryPriceGradientFun() {
      selectgetDictionaryBykeyApi({ key: 'grads' }).then(res => {
        this.priceGradientList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 数据字典，获取默认显示价格值
    selectgetDictionaryVisiblePriceFun() {
      let data = {};
      data.key = 'VisiblePrice';
      selectgetDictionaryBykeyApi(data).then(res => {
        this.displayPriceList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 根据类型查询流程控制列表
    selectControlTowerListFun() {
      selectControlTowerListApi({ nodeType: 2 }).then(res => {
        this.controlTowerList = res.data.map(e => {
          if (this.formMaterial.sysOrderPayNodeList && this.formMaterial.sysOrderPayNodeList.length) {
            this.formMaterial.sysOrderPayNodeList.forEach(t => {
              if (e.nodeName === t.nodeName) {
                e.paymentRatio = t.paymentRatio;
                e.dayNum = t.dayNum;
              }
            });
          }
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 把多选框选的值由数组转换为字符串
    getCheckBoxVal(arr) {
      this.formMaterial.transportMode = arr.join(',');
      this.formMaterial.transportModeDefault = '';
      this.transportModeList = arr.map(e => {
        return {
          value: e.toString(),
          label: this.getWayName(e),
          labelCh: this.getWayNameCh(e)
        }
      });
    },
    getWayName(val) {
      switch (val) {
        case 1: return 'By Truck';
        case 2: return 'By Train';
        case 3: return 'By Ship';
        case 4: return 'By Air';
      }
    },
    getWayNameCh(val) {
      switch (val) {
        case 1: return '汽运';
        case 2: return '铁路';
        case 3: return '海运';
        case 4: return '空运';
      }
    },
    getPayModeVal(arr) {
      this.formMaterial.payMode = arr.join(',');
      this.formMaterial.payModeDefault = '';
      this.payModeDefaultList = arr.map(e => {
        return {
          value: e.toString(),
          label: this.getPayModeName(e)
        }
      });
    },
    getPayModeName(val) {
      switch (val) {
        case 1: return 'T/T';
        case 2: return 'L/C';
        case 3: return 'P/A';
        case 4: return 'D/A';
      }
    },
    getFileCheckBox(arr) {
      if (arr.indexOf('8') > -1) {
        this.showFileType = true;
      } else {
        this.showFileType = false;
        this.newFileType = ''
      }
    },
    addFileType() {
      if (!this.newFileType) {
        return this.$message.error('Please fill in file type')
      }
      this.fileTypeList.push(this.newFileType);
      this.newFileType = ''
    },
    onSubmit(formName) {
      if (this.totalSum !== 100) {
        return this.$message.warning(this.$t('common.tip.paymentHint'));
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formMaterial.orderParameterType = 1;
          this.formMaterial.sysOrderParameterAnnexList = this.fileTypeList.map(e => {
            return {
              dictCode: e.value,
              isAllow: this.fileTypeCheck.indexOf(e.value) > -1,
              customizeName: e.value === '8' && this.fileTypeCheck.indexOf('8') > -1 ? this.newFileType : null
            }
          });
          this.formMaterial.sysOrderPayNodeList = this.controlTowerList.map(e => {
            e.controlNodeBId = e.bid;
            e.nodeLevel = e.sequence;
            return { ...e }
          });
          updateSysOrderParameterApi(this.formMaterial).then(res => {
            this.$message.success(res.message);
            this.selectSysOrderParameterFun();
          }).catch(err => {
            this.$message(err.message);
          });
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'))
        }
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .materialSet {
    width: 1045px;
    .tableSet {
      text-align: center;
      width: 680px !important;
      thead {
        tr {
          th {
            font-weight: 400;
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
  }
</style>

