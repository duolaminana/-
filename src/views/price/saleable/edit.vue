<template>
  <div class="app-container saleable-edit">
    <div class="search-box">
      <el-form ref="editForm" :model="editForm" label-width="170px" size="small" :rules="editRules">
        <el-form-item :label="$t('price.saleablePriceEdit.priceAdjustName')" prop="priceAdjustName">
          <el-input v-model="editForm.priceAdjustName" clearable :placeholder="$t('price.saleablePriceEdit.priceAdjustName')" style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceEdit.customerName')" prop="customerBId">
          <el-select
            v-model="editForm.customerBId"
            :clearable="!editType"
            :disabled="editType"
            filterable
            style="width: 300px"
            @change="getLabel">
            <el-option v-for="(item,index) in customerInfoList" :key="index" :label="item.customerName" :value="item.bid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceEdit.effectiveDate')" prop="effectiveDate">
          <el-date-picker
            v-model="editForm.effectiveDate"
            type="datetime"
            clearable>
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="是否审核" prop="ifAudit">-->
          <!--<el-radio-group v-model="editForm.ifAudit">-->
            <!--<el-radio :label="1">是</el-radio>-->
            <!--<el-radio :label="0">否</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="选择审批流程" prop="approvalBId" v-if="editForm.ifAudit">-->
          <!--<el-select v-model="editForm.approvalBId" clearable filterable placeholder="请选择" style="width: 222px">-->
            <!--<el-option v-for="(item,index) in approvalSelectList" :key="index" :label="item.approvalName" :value="item.bid">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('price.saleablePriceEdit.fileList')" style="width: 550px">
          <el-upload
            :action="uploadActionUrl"
            :limit="1"
            :headers="upLoadHeaders"
            :on-remove="handleRemove"
            :on-success="onSuccess"
            :on-preview="onPreview"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">{{$t('common.table.upload')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('price.supplierEdit.UploadExplain')}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceEdit.remark')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" clearable :placeholder="$t('price.saleablePriceEdit.remark')" style="width: 500px" />
        </el-form-item>
        <!--<el-form-item v-if="!editType">-->
          <!--<el-button type="primary" size="small" :loading="confirmLoading" v-if="!editForm.adjustStatus" @click="confirmAdd('editForm', 0, editType)">保存</el-button>-->
          <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div>
      <div class="topBtns" v-if="editType">
        <!--<div class="batch-change">-->
          <!--{{$t('price.saleablePriceEdit.revisePrice')}}<el-input-number size="small" v-model="batchPrice" :min="-minPrice" style="margin-right: 15px"/>-->
          <!--<el-button style="margin: 0 15px" type="primary" size="small" @click="changeBatch">{{$t('common.batchAdjustment')}}</el-button>-->
          <!--<el-button type="primary" size="small" @click="saveBatch">{{$t('common.saveAdjustPrice')}}</el-button>-->
        <!--</div>-->
        <el-button type="primary" size="small" @click="openDialog">{{$t('common.addProduct')}}</el-button>
        <el-button type="primary" size="small" @click="delSkuModifyPrice">{{$t('common.delete')}}</el-button>
        <el-button type="primary" size="small">{{$t('system.role.toLead')}}</el-button>
        <!--<el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>-->
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="loading。。。"
        border
        fit
        size="mini"
        max-height="400"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">

        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.catalogBName')" prop="catalogBName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.attrValueList')" prop="attrValueList" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.priceBeforeAdj')" prop="priceBeforeAdj" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.priceAdjustmentValue')" prop="priceAdjustmentValue">
          <template slot-scope="scope">
            <span v-if="scope.row.editable">
              <el-input-number size="small" v-model="scope.row.priceAdjustmentValue" :min="-scope.row.priceBeforeAdj" @change="setChangePrice(scope.row)"/>
            </span>
            <span v-else>{{scope.row.priceAdjustmentValue || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.adjustmentPercentage')" prop="adjustmentPercentage">
          <template slot-scope="scope">
            {{scope.row.adjustRatio || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.priceAfterAdj')" prop="priceAfterAdj">
          <template slot-scope="scope">
            {{scope.row.priceAfterAdj || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.editable" type="warning" size="mini" @click="changeEdit(scope.row)">{{$t('common.table.edit')}}</el-button>
            <el-button v-else type="primary" size="mini" @click="updatePrice(scope.row)">{{$t('common.buttonText.save')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>-->
      <div class="edit-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" v-if="!editForm.adjustStatus" @click="confirmAdd('editForm', 0, editType)">{{$t('common.buttonText.save')}}</el-button>
        <el-button v-if="editType" type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('editForm', 1, editType)">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="$t('price.saleablePriceEdit.skuTitle')" width="900px" center close-on-click-modal>
      <el-form ref="editForm" :model="searchObj" label-width="110px" label-position="right" inline size="small">
        <el-form-item :label="$t('price.saleablePriceEdit.catalogBName')">
          <el-input v-model.trim="searchObj.catalogBName" clearable :placeholder="$t('price.saleablePriceEdit.catalogBName')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceEdit.productCode')" prop="productCode">
          <el-input v-model.trim="searchObj.productCode" clearable :placeholder="$t('price.saleablePriceEdit.productCode')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceEdit.productName')" prop="productName">
          <el-input v-model.trim="searchObj.productName" clearable :placeholder="$t('price.saleablePriceEdit.productName')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.saleablePriceEdit.attrValueList')" prop="attrValueList">
          <el-input v-model.trim="searchObj.attrValueList" clearable :placeholder="$t('price.saleablePriceEdit.attrValueList')" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="productSkuList"
        :element-loading-text="$t('common.search')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect1">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.productCode')" prop="productCode" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.attrValueList')" prop="attrValueList" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleablePriceEdit.catalogBName')" prop="catalogBName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getCustomerSaleableProduct"></Pagination>
      <!--<div class="sku-price-reset">-->
        <!--<div class="reset-title">{{$t('price.saleablePriceEdit.setInitialValue')}}</div>-->
        <!--<el-form ref="addSkuObj" :model="addSkuObj" label-width="100px" label-position="right" inline size="small" :rules="addSkuObjRules">-->
          <!--<el-form-item :label="$t('price.saleablePriceEdit.initialPrice')" prop="price">-->
            <!--<el-input-number v-model="addSkuObj.price" controls-position="right" :placeholder="$t('price.saleablePriceEdit.initialPrice')" :min="0" style="width: 200px;" />-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</div>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="addModifyPriceSku('addSkuObj')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { listCustomerInfoContactApi } from '@/api/customer';
import { approvalSelectList } from '@/api/system';
import {
  saleableProductList,
  saleableDetail,
  addSaleableProduct,
  addSaleable,
  updateSaleableProduct,
  updateBatchSaleableProduct,
  deleteSaleableProduct,
  customerSaleableProductList
} from '@/api/price';
export default {
  components: {
    Pagination
  },
  data() {
    return {
      uploadActionUrl,
      list: null,
      listLoading: false,
      listLoading1: false,
      confirmLoading: false,
      dialogVisible: false,
      editType: false,
      checkList: [],
      parentsName: [],
      rangeTime: [],
      selectList: [],
      selectList1: [],
      fileList: [],
      customerInfoList: [],
      saveFiles: [],
      productSkuList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editForm: {
        priceAdjustName: '',
        effectiveDate: '',
        adjustStatus: 0,
        customerBId: '',
        customerName: '',
        ifAudit: 1,
        approvalBId: '',
        remark: '',
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: ''
      },
      editRules: {
        priceAdjustName: [{ required: true, message: this.$t('price.tip.adjustmentName'), trigger: 'blur' }],
        effectiveDate: [{ required: true, message: this.$t('price.tip.effectiveTime'), trigger: 'change' }],
        customerBId: [{ required: true, message: this.$t('price.tip.selectCustTip'), trigger: 'change' }]
      },
      searchObj: {
        productCode: '',
        productName: '',
        attrValueList: '',
        catalogBName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      addSkuObj: {
        customerBId: ''
      },
      approvalSelectList: [],
      dataList: [],
      batchPrice: 0,
      minPrice: 0,
      editList: []
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    if (this.$route.query.id || localStorage.getItem('id')) {
      this.editType = true;
      this.getSaleableDetail();
      // this.getDataList();
    }
    this.getCustomerInfoListFun();
    this.getApprovalSelectList()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/price/saleable/list'
        })
      })
    },
    getLabel(val) {
      if (val) {
        let obj = this.customerInfoList.filter(e => {
          return e.bid === val
        })[0];
        this.editForm.customerName = obj.customerName
      } else {
        this.editForm.customerName = ''
      }
    },
    setChangePrice(item) {
      item.adjustmentPercentage = Number(item.priceAdjustmentValue / (item.priceBeforeAdj || 1).toFixed(4));
      item.adjustRatio = (item.priceAdjustmentValue / (item.priceBeforeAdj || 1) * 100).toFixed(2) + '%';
      item.priceAfterAdj = (item.priceAdjustmentValue * 1000 + item.priceBeforeAdj * 1000) / 1000
    },
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getCustomerSaleableProduct();
    },
    getCustomerSaleableProduct() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      obj.customerBId = this.editForm.customerBId;
      this.listLoading1 = true;
      customerSaleableProductList(obj).then(res => {
        this.productSkuList = res.data.list || [];
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    getSaleableDetail() {
      saleableDetail({ bid: this.$route.query.id || localStorage.getItem('id') }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (this.editForm.attachmentPath) {
          this.fileList = [{ url: this.editForm.attachmentPath, name: this.editForm.attachmentName }];
        }
        localStorage.setItem('id', this.editForm.bid);
        this.dataList = res.data.sellableAdjustSkuVoList.map(e => {
          e.editable = false;
          e.priceAfterAdj = e.priceAfterAdj || e.priceBeforeAdj || 0;
          e.adjustRatio = (e.adjustmentPercentage || 0) + '%';
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getDataList() {
      let obj = { sellablePriceAdjustBId: this.$route.query.id || localStorage.getItem('id') };
      this.listLoading = true;
      saleableProductList(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.map(e => {
          e.editable = false;
          e.adjustRatio = (e.adjustmentPercentage * 1000) / 10 + '%';
          return { ...e }
        });
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    updatePrice(item) {
      updateSaleableProduct(item).then(res => {
        this.$message.success(this.$t('common.tip.saveTip'));
        item.editable = !item.editable;
        this.editList = this.dataList.filter(e => {
          return e.editable;
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    changeEdit(item) {
      item.editable = !item.editable;
      this.editList = this.dataList.filter(e => {
        return e.editable;
      });
      this.minPrice = Math.min.apply(null, this.editList.map(e => e.priceBeforeAdj));
    },
    changeBatch() {
      if (!this.editList.length) {
        return this.$message.warning(this.$t('price.tip.priceEditTip'))
      }
      this.dataList.forEach(e => {
        if (e.editable) {
          e.priceAdjustmentValue = this.batchPrice;
          e.adjustmentPercentage = Number(e.priceAdjustmentValue / (e.priceBeforeAdj || 1).toFixed(4));
          e.adjustRatio = (e.priceAdjustmentValue / (e.priceBeforeAdj || 1) * 100).toFixed(2) + '%';
          e.priceAfterAdj = (e.priceAdjustmentValue * 1000 + e.priceBeforeAdj * 1000) / 1000;
        }
      });
      this.batchPrice = 0;
    },
    saveBatch() {
      if (!this.editList.length) {
        return this.$message.warning(this.$t('price.tip.priceAdjustTip'))
      }
      let obj = {
        sellableAdjustSkuList: this.editList.map(e => e)
      };
      updateBatchSaleableProduct(obj).then(res => {
        this.$message.success(this.$t('price.tip.batchPriceTip'));
        this.dataList.forEach(e => {
          if (e.editable) {
            e.editable = false;
          }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    delSkuModifyPrice() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('price.tip.commodityTip'))
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
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
        deleteSaleableProduct(obj).then(res => {
          this.getSaleableDetail();
          this.$message.success(this.$t('common.tip.deleteTip'));
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    openDialog() {
      this.searchProductSku();
      this.addSkuObj.customerBId = this.editForm.customerBId;
      this.dialogVisible = true;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect1(selects) {
      this.selectList1 = selects;
    },
    addModifyPriceSku(formName) {
      if (!this.selectList1.length) {
        return this.$message.warning(this.$t('price.tip.commodityTip'));
      }
      let arr = this.selectList1.map(e => {
        return {
          sellablePriceAdjustBId: this.$route.query.id || localStorage.getItem('id'),
          productBId: e.productBId,
          skuBId: e.bid
        }
      });
      this.confirmLoading = true;
      let obj = {
        customerBId: this.addSkuObj.customerBId,
        sellableAdjustSkuList: arr
      };
      addSaleableProduct(obj).then(res => {
        this.$message.success(this.$t('common.tip.addsuccess'));
        this.confirmLoading = false;
        this.dialogVisible = false;
        this.postData.pageNum = 1;
        this.getSaleableDetail();
      }).catch(err => {
        this.confirmLoading = false;
        this.$message.error(err.message)
      })
    },
    handleRemove(file, fileList) {
      this.editForm.attachmentName = '';
      this.editForm.attachmentPath = '';
      this.editForm.attachmentUuid = '';
    },
    onSuccess(res, file, fileList) {
      this.editForm.attachmentName = file.name;
      this.editForm.attachmentPath = res.data.filePath;
      this.editForm.attachmentUuid = res.data.UUID;
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('price.tip.uploadOneTip'));
    },
    onPreview(file) {
      this.downFile(file.annexPath)
    },
    confirmAdd(formName, status, type) {
      if (status && !this.dataList.length) {
        return this.$message.warning(this.$t('price.tip.addTip'));
      } else if (status && this.dataList.length) {
        for (let i = 0; i < this.dataList.length; i++) {
          if (!this.dataList[i].priceAdjustmentValue) {
            return this.$message.warning(this.$t('price.tip.priceAdjust'));
          }
        }
      }
      if (this.editList.length) {
        return this.$message.warning(this.$t('price.tip.saveBeforeTip'));
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          // let api = type ? updateSupplierModifyPrice : addSupplierModifyPrice;
          this.editForm.adjustStatus = status;
          addSaleable(this.editForm).then(res => {
            this.confirmLoading = false;
            if (type) {
              this.$message.success(this.$t('common.tip.sumbitTip'));
              this.closePage();
            } else {
              this.editForm.bid = res.data;
              localStorage.setItem('id', res.data.bid || this.editForm.bid);
              this.$message.success(this.$t('common.tip.saveTip'));
            }
            this.editType = true;
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.warning(err.message)
          })
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'));
        }
      });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== this.$router.path) {
      localStorage.removeItem('id')
    }
    next();
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .saleable-edit {
    .search-box {
      margin-bottom: 25px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      .batch-change {
        float: right;
        margin: 0 50px;
      }
      margin-bottom: 10px;
      /*text-align: right;*/
      button {
        margin: 0 10px;
      }
    }
    .sku-price-reset {
      .reset-title {
        height: 35px;
        line-height: 35px;
        font-weight: bold;
        background: #F5F5F5;
        padding-left: 20px;
        margin-bottom: 20px;
      }
    }
    .edit-footer {
      text-align: center;
      margin-top: 40px;
      button {
        margin: 0 10px;
      }
    }
  }
</style>
