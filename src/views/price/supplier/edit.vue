<template>
  <div class="app-container saleSupplierModifyPrice">
    <div class="search-box">
      <el-form ref="editForm" :model="editForm" label-width="170px" size="small" :rules="editRules">
        <el-form-item :label="$t('price.supplierEdit.adjustName')" prop="adjustName">
          <el-input v-model="editForm.adjustName" clearable :placeholder="$t('price.supplierEdit.adjustName')" style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.supplierEdit.supplierName')" prop="supplierBId">
          <el-select
            v-model="editForm.supplierBId"
            :clearable="!editType"
            :disabled="editType"
            filterable
            style="width: 300px"
            @change="getLabel">
            <el-option v-for="(item,index) in supplierList" :key="index" :label="item.supplierName" :value="item.bid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('price.supplierEdit.effectTime')" prop="effectTime">
          <el-date-picker
            v-model="editForm.effectTime"
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
        <el-form-item :label="$t('price.supplierEdit.fileList')" style="width: 550px">
          <el-upload
            :action="uploadActionUrl"
            :limit="5"
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
        <el-form-item :label="$t('price.supplierEdit.remark')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" maxlength="200" :autosize="{ minRows: 3, maxRows: 5}" clearable :placeholder="$t('price.supplierEdit.remark')" style="width: 500px" />
        </el-form-item>
        <!--<el-form-item v-if="!editType">-->
          <!--<el-button type="primary" size="small" :loading="confirmLoading" v-if="!editForm.adjustStatus" @click="confirmAdd('editForm', 0, editType)">保存</el-button>-->
          <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div>
      <div class="topBtns" v-if="editType">
        <!-- <div class="batch-change">
          调整价格：<el-input-number size="small" v-model="batchPrice" :min="-minPrice" style="margin-right: 15px"/>
          调整起订量：<el-input-number size="small" v-model="batchNumber" :min="-minNumber"/>
          <el-button style="margin: 0 15px" type="warning" size="small" @click="changeBatch">批量调整</el-button>
          <el-button type="primary" size="small" @click="saveBatch">保存调价</el-button>
        </div> -->
        <el-button type="primary" size="small" @click="openDialog">{{$t('common.add')}}</el-button>
        <el-button type="primary" size="small" @click="delSkuModifyPrice">{{$t('common.delete')}}</el-button>
        <el-button type="primary" size="small">{{$t('system.role.toLead')}}</el-button>
        <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        element-loading-text="loading。。。"
        border
        fit
        size="mini"
        max-height="300px"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">

        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.catalogBName')" prop="catalogBName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.attrValueList')" prop="attrValueList">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.originalPrice')" prop="originalPrice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.originalPrice || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('price.supplierEdit.priceNumber')" prop="priceNumber">
          <template slot-scope="scope">
            <span v-if="scope.row.editable">
              <el-input-number size="small" v-model="scope.row.priceNumber" :min="-scope.row.originalPrice" @change="setChangePrice(scope.row)"/>
            </span>
            <span v-else>{{scope.row.priceNumber || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.adjustRatio')" prop="adjustRatio" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.adjustRatio || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.afterPrice')" prop="afterPrice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.afterPrice || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.originalMinimum')" prop="originalMinimum" show-overflow-tooltip >
          <template slot-scope="scope">
            {{scope.row.originalMinimum || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" :label="$t('price.supplierEdit.minimunNumber')" prop="minimunNumber">
          <template slot-scope="scope">
            <span v-if="scope.row.editable">
              <el-input-number size="small" v-model="scope.row.minimunNumber" :min="-scope.row.originalMinimum" @change="setChangeMininum(scope.row)"/>
            </span>
            <span v-else>{{scope.row.minimunNumber || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.afterMinimum')" prop="afterMinimum" show-overflow-tooltip >
          <template slot-scope="scope">
            {{scope.row.afterMinimum || 0}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.editable" type="warning" size="mini" @click="changeEdit(scope.row)">{{$t('common.table.edit')}}</el-button>
            <el-button v-else type="primary" size="mini" @click="updateSkuSupplierPrice(scope.row)">{{$t('common.buttonText.save')}}</el-button>
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

    <el-dialog :visible.sync="dialogVisible" :title="$t('price.supplierEdit.SKUTitle')" width="900px" center close-on-click-modal>
      <el-form ref="editForm" :model="searchObj" label-width="110px" label-position="right" inline size="small">
        <el-form-item :label="$t('price.supplierEdit.productCode')" prop="productCode">
          <el-input v-model.trim="searchObj.productCode" clearable :placeholder="$t('price.supplierEdit.productCode')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.supplierEdit.productName')" prop="productName">
          <el-input v-model.trim="searchObj.productName" clearable :placeholder="$t('price.supplierEdit.productName')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.supplierEdit.attrValueList')" prop="attrValueList">
          <el-input v-model.trim="searchObj.attrValueList" clearable :placeholder="$t('price.supplierEdit.attrValueList')" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="productSkuList"
        element-loading-text="loading。。。"
        border
        fit
        size="small"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect1">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.productCode')" prop="productCode" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.supplierEdit.attrValueList')" prop="attrValueList" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.supplierEdit.catalogBName')" prop="catalogBName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getSupplierProductSkuList"></Pagination>
      <!-- <div class="sku-price-reset">
        <div class="reset-title">设置初始价格和起订量</div>
        <el-form ref="addSkuObj" :model="addSkuObj" label-width="100px" label-position="right" inline size="small" :rules="addSkuObjRules">
          <el-form-item label="初始价格" prop="price">
            <el-input-number v-model="addSkuObj.price" controls-position="right" placeholder="初始价格" :min="0" style="width: 200px;" />
          </el-form-item>
          <el-form-item label="初始起订量" prop="number">
            <el-input-number v-model="addSkuObj.number" controls-position="right" placeholder="初始起订量" :min="0" style="width: 200px;" />
          </el-form-item>
        </el-form>
      </div> -->
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
import { getSupplierList, getSupplierProductSkuList } from '@/api/supplier';
import { approvalSelectList } from '@/api/system';
import {
  getAllSupplierModifyPriceSkuList,
  getSupplierModifyPriceDetail,
  addSupplierBatchModifyPrice,
  addSupplierModifyPrice,
  updateSupplierModifyPrice,
  updateSkuSupplierPrice,
  updateBatchSkuSupplierPrice,
  deleteSupplierModifyPriceSku
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
      supplierList: [],
      saveFiles: [],
      productSkuList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editForm: {
        adjustName: '',
        effectTime: '',
        adjustStatus: '',
        supplierBId: '',
        supplierName: '',
        ifAudit: 1,
        approvalBId: '',
        remark: ''
      },
      editRules: {
        adjustName: [{ required: true, message: 'Price adjustment name', trigger: 'blur' }],
        effectTime: [{ required: true, message: 'The effective time', trigger: 'change' }],
        supplierBId: [{ required: true, message: 'Supplier', trigger: 'change' }]
        // approvalBId: [{ required: true, message: 'Please select the approval process', trigger: 'change' }]
      },
      searchObj: {
        productCode: '',
        productName: '',
        attrValueList: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      addSkuObj: {
        price: 0,
        number: 0
      },
      // addSkuObjRules: {
      //   price: [{ required: true, message: '请输入初始价格', trigger: 'blur' }],
      //   number: [{ required: true, message: '请输入初始起订量', trigger: 'blur' }]
      // },
      approvalSelectList: [],
      dataList: [],
      batchPrice: 0,
      batchNumber: 0,
      minPrice: 0,
      minNumber: 0,
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
      this.getSupplierModifyPriceDetail();
      this.getDataList();
    }
    this.getSupplierList();
    this.getApprovalSelectList()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/price/supplier/list'
        })
      })
    },
    getLabel(val) {
      if (val) {
        let obj = this.supplierList.filter(e => {
          return e.bid === val
        })[0];
        this.editForm.supplierName = obj.supplierName
      } else {
        this.editForm.supplierName = ''
      }
    },
    setChangePrice(item) {
      item.adjustRatio = (item.priceNumber / (item.originalPrice || 1) * 100).toFixed(2) + '%';
      item.afterPrice = (item.originalPrice * 1000 + item.priceNumber * 1000) / 1000
    },
    setChangeMininum(item) {
      item.afterMinimum = (item.originalMinimum * 1000 + item.minimunNumber * 1000) / 1000
    },
    getSupplierList() {
      getSupplierList().then(res => {
        this.supplierList = res.data || [];
      })
    },
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getSupplierProductSkuList();
    },
    getSupplierProductSkuList() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      obj.supplierBid = this.editForm.supplierBId;
      this.listLoading1 = true;
      getSupplierProductSkuList(obj).then(res => {
        this.productSkuList = res.data.list || [];
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    getSupplierModifyPriceDetail() {
      getSupplierModifyPriceDetail({ bid: this.$route.query.id || localStorage.getItem('id') }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (res.data.supplierPriceAdjustAnnexList) {
          this.fileList = res.data.supplierPriceAdjustAnnexList.map(e => {
            e.name = e.annexName;
            e.url = e.annexPath;
            return {
              ...e
            }
          });
        }
        localStorage.setItem('id', this.editForm.bid)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getDataList() {
      let obj = { adjustBId: this.$route.query.id || localStorage.getItem('id') };
      this.listLoading = true;
      getAllSupplierModifyPriceSkuList(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.map(e => {
          e.editable = false;
          e.afterPrice = e.afterPrice || e.originalPrice;
          e.afterMinimum = e.afterMinimum || e.originalMinimum
          return { ...e }
        });
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    updateSkuSupplierPrice(item) {
      item.firstAfterPrice = (Number(this.dataList[0].originalPrice) * 1000 + Number(this.dataList[0].priceNumber) * 1000) / 1000;
      updateSkuSupplierPrice(item).then(res => {
        this.$message.success('save successfully!');
        item.editable = !item.editable;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    changeEdit(item) {
      item.editable = !item.editable;
      this.editList = this.dataList.filter(e => {
        return e.editable;
      });
      this.minPrice = Math.min.apply(null, this.editList.map(e => e.originalPrice));
      this.minNumber = Math.min.apply(null, this.editList.map(e => e.originalMinimum));
    },
    changeBatch() {
      if (!this.editList.length) {
        return this.$message.warning('Set the price adjustment product to edit state first！')
      }
      this.dataList.forEach(e => {
        if (e.editable) {
          e.priceNumber = this.batchPrice;
          e.minimunNumber = this.batchNumber;
          e.adjustRatio = (e.priceNumber / (e.originalPrice || 1) * 100).toFixed(2) + '%';
          e.afterPrice = (e.originalPrice * 1000 + e.priceNumber * 1000) / 1000;
          e.afterMinimum = (e.originalMinimum * 1000 + e.minimunNumber * 1000) / 1000;
        }
      });
      this.batchPrice = 0;
      this.batchNumber = 0;
    },
    saveBatch() {
      if (!this.editList.length) {
        return this.$message.warning('There are no adjustable commodities to keep！')
      }
      let arr = this.editList.map(e => {
        e.firstAfterPrice = (Number(this.dataList[0].originalPrice) * 100 + Number(this.dataList[0].priceNumber) * 100) / 100;
        return { ...e }
      });
      updateBatchSkuSupplierPrice(arr).then(res => {
        this.$message.success('Batch price adjustment is successful！');
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
        return this.$message.warning(this.$t('common.tip.deleteDataTip'))
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let formData = new FormData();
        let ids = this.selectList.map(e => e.id);
        formData.append('ids', ids);
        deleteSupplierModifyPriceSku(formData).then(res => {
          this.getDataList();
          this.$message.success('successfully delete！');
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
    openDialog() {
      this.searchProductSku();
      this.addSkuObj.number = 0;
      this.addSkuObj.price = 0;
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
        return this.$message.warning('Commodity SKU！');
      }
      // this.$refs[formName].validate((valid) => {
      // if (valid) {
      let arr = this.selectList1.map(e => {
        return {
          adjustBId: this.$route.query.id || localStorage.getItem('id'),
          productBId: e.productBId,
          skuBId: e.skuBId,
          originalMinimum: e.minimum || 0,
          originalPrice: e.unitPrice || 0
        }
      });
      this.confirmLoading = true;
      addSupplierBatchModifyPrice(arr).then(res => {
        this.$message.success('successfully added');
        this.confirmLoading = false;
        this.dialogVisible = false;
        this.postData.pageNum = 1;
        this.getDataList();
      }).catch(err => {
        this.confirmLoading = false;
        this.$message.error(err.message)
      })
      // } else {
      //   this.$message.warning('请填写完整')
      // }
      // });
    },
    handleRemove(file, fileList) {
      this.saveFiles = fileList.map(e => {
        e.annexName = e.name;
        e.annexPath = e.url || e.response.data.filePath;
        return { ...e }
      });
    },
    onSuccess(res, file, fileList) {
      this.saveFiles = fileList.map(e => {
        e.annexName = e.name;
        e.annexPath = e.url || e.response.data.filePath;
        return { ...e }
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`Upload up to 5 files！`);
    },
    onPreview(file) {
      this.downFile(file.annexPath)
    },
    confirmAdd(formName, status, type) {
      if (status && !this.dataList.length) {
        return this.$message.warning('There is no commodity to adjust the price, please add the commodity to adjust the price first！')
      } else if (status && this.dataList.length) {
        for (let i = 0; i < this.dataList.length; i++) {
          if (!this.dataList[i].priceNumber) {
            return this.$message.warning(this.$t('price.tip.priceAdjust'));
          }
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          let api = type ? updateSupplierModifyPrice : addSupplierModifyPrice;
          this.editForm.adjustStatus = status;
          this.editForm.supplierPriceAdjustAnnexList = this.saveFiles;
          api(this.editForm).then(res => {
            this.editType = true;
            this.confirmLoading = false;
            this.getDataList();
            if (type) {
              this.$message.success(this.$t('common.tip.submitTip'));
              this.closePage();
            } else {
              this.editForm.bid = res.data.bid;
              this.editForm.id = res.data.id;
              localStorage.setItem('id', res.data.bid || this.editForm.bid);
              this.$message.success(this.$t('common.tip.saveTip'));
            }
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.warning(err.message)
          })
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'))
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
  .saleSupplierModifyPrice {
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
