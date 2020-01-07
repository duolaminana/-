<template>
  <div class="app-container saleModifyPrice">
    <div class="search-box">
      <el-form ref="editForm" :model="editForm" label-width="170px" size="small" :rules="editRules">
        <el-form-item :label="$t('price.saleEdit.adjustName')" prop="adjustName">
          <el-input v-model="editForm.adjustName" clearable :disabled="editType" :placeholder="$t('price.saleEdit.adjustName')" style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.productType')" prop="productType">
          <el-select v-model="editForm.productType" :disabled="editType" :placeholder="$t('price.saleEdit.productType')">
            <el-option :label="$t('price.saleEdit.standardProduct')" :value="1"></el-option>
            <el-option :label="$t('price.saleEdit.rawMaterial')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.effectTime')" prop="effectTime">
            <el-date-picker
              v-model="editForm.effectTime" type="datetime" :placeholder="$t('price.tip.selectDateTip')">
            </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.fileList')" style="width: 550px">
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
            <!--<div slot="tip" class="el-upload__tip">只能上传pdf或doc文件，且不超过10M</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.remark')" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" clearable style="width: 500px" />
        </el-form-item>
        <!--<el-form-item v-if="!editType">-->
          <!--<el-button type="primary" size="small" :loading="confirmLoading" v-if="!editForm.adjustStatus" @click="confirmAdd('editForm', 0, editType)">保存</el-button>-->
          <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
          <!--&lt;!&ndash;<p v-if="!editType" class="tips">保存成功之后才能进行调价</p>&ndash;&gt;-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div>
      <div class="topBtns" v-if="editType">
        <el-button type="primary" size="small" @click="openDialog">{{$t('common.addProduct')}}</el-button>
        <el-button type="primary" size="small" @click="delSkuModifyPrice">{{$t('common.delete')}}</el-button>
        <el-button type="primary" size="small">{{$t('system.role.toLead')}}</el-button>
        <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        :element-loading-text="$t('common.search')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        :span-method="arraySpanMethod"
        :cell-class-name="cellMethod"
        :header-cell-class-name="cellMethod"
        @selection-change="getSelect">
        <!--@expand-change="expandTable">-->

        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column type="expand">
          <template slot-scope="props">
              <div class="table-expand" v-for="(item, childIndex) in props.row.childs" :key="childIndex">
                <div class="expand-box"></div>
                <div class="expand-box"></div>
                <div class="table-flex">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>{{$t('price.saleEdit.tier')}}{{childIndex+1}}</div>
                  <div>{{item.originalPrice}}</div>
                  <div>
                    <span v-if="item.editable"><el-input-number size="small" v-model="item.priceNumber" :min="-item.originalPrice" @change="setChangePrice(item)"/></span>
                    <span v-else>{{item.priceNumber}}</span>
                  </div>
                  <div>{{item.adjustRatio}}</div>
                  <div>{{item.afterPrice}}</div>
                  <div>{{item.originalMinimum}}</div>
                  <div>
                    <span v-if="item.editable"><el-input-number size="small" v-model="item.minimunNumber" :min="-item.originalMinimum" @change="setChangeMininum(item)"/></span>
                    <span v-else>{{item.minimunNumber}}</span>
                  </div>
                  <div>
                    <el-button v-if="!item.editable" type="warning" size="mini" @click="item.editable = !item.editable">{{$t('common.table.edit')}}</el-button>
                    <el-button v-else type="primary" size="mini" @click="updateSkuSalePrice(props.row.childs, item)">{{$t('common.buttonText.save')}}</el-button>
                  </div>
                </div>
              </div>
          </template>
        </el-table-column>

        <el-table-column header-align="center" :label="$t('price.saleEdit.catalogBName')" prop="catalogBName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleEdit.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleEdit.skuCode')" prop="skuCode" show-overflow-tooltip/>

        <el-table-column header-align="center" :label="$t('price.saleEdit.attrValueList')" prop="attrValueList">
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleEdit.originalPrice')" prop="name" show-overflow-tooltip />

        <el-table-column align="center" :label="$t('price.saleEdit.priceNumber')" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleEdit.adjustRatio')" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleEdit.afterPrice')" prop="name" show-overflow-tooltip/>

         <el-table-column align="center" label="调整前起订量" prop="name" show-overflow-tooltip />

        <el-table-column align="center" label="调整量" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('common.table.actions')" class-name="small-padding fixed-width"/>
      </el-table>
      <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
      <div class="edit-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" v-if="!editForm.adjustStatus" @click="confirmAdd('editForm', 0, editType)">{{$t('common.buttonText.save')}}</el-button>
        <el-button v-if="editType" type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('editForm', 1, editType)">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="$t('price.saleEdit.SKUViewTitile')" width="900px" center close-on-click-modal>
      <el-form ref="editForm" :model="searchObj" label-width="110px" label-position="right" inline size="small">
        <el-form-item :label="$t('price.saleEdit.catalogBName')">
          <el-cascader
            :key="isZh"
            style="width: 240px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('common.search')"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.productCode')" prop="productCode">
          <el-input v-model.trim="searchObj.productCode" clearable :placeholder="$t('price.saleEdit.productCode')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.productName')" prop="productName">
          <el-input v-model.trim="searchObj.productName" clearable :placeholder="$t('price.saleEdit.productName')" style="width: 240px"/>
        </el-form-item>
        <el-form-item :label="$t('price.saleEdit.attrValueList')" prop="attrValueList">
          <el-input v-model.trim="searchObj.attrValueList" clearable :placeholder="$t('price.saleEdit.attrValueList')" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="productSkuList"
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

        <el-table-column align="center" :label="$t('price.saleEdit.productName')" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleEdit.productCode')" prop="productCode" show-overflow-tooltip/>

        <el-table-column align="center" :label="$t('price.saleEdit.attrValueList')" prop="attrValueList" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('price.saleEdit.catalogBName')" prop="catalogBName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getProductSkuList"></Pagination>
      <!--<div class="sku-price-reset">-->
        <!--<div class="reset-title">设置初始价格和起订量</div>-->
        <!--<el-form ref="addSkuObj" :model="addSkuObj" label-width="100px" label-position="right" inline size="small" :rules="addSkuObjRules">-->
          <!--<el-form-item label="初始价格" prop="price">-->
              <!--<el-input-number v-model="addSkuObj.price" controls-position="right" placeholder="初始价格" :min="0" style="width: 200px;" />-->
            <!--&lt;!&ndash;<el-input v-model.number="addSkuObj.price" type="number" min=0 clearable placeholder="调价单名称" style="width: 240px"/>&ndash;&gt;-->
          <!--</el-form-item>-->
          <!--<el-form-item label="初始起订量" prop="number">-->
            <!--<el-input-number v-model="addSkuObj.number" controls-position="right" placeholder="初始起订量" :min="0" style="width: 200px;" />-->
            <!--&lt;!&ndash;<el-input v-model.number="addSkuObj.number" type="number" min=0 placeholder="调价单名称" style="width: 240px"/>&ndash;&gt;-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</div>-->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="addModifyPriceSku()">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory } from '@/api/product'
import { getProductSkuList } from '@/api/price'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { approvalSelectList } from '@/api/system';
import {
  getModifySalePriceList,
  getModifyPriceDetail,
  addBatchModifyPrice,
  searchEditSkuLadder,
  addModifyPrice,
  updateSkuSalePrice,
  deleteModifyPriceSku
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
      approvalSelectList: [],
      searchDataList: [],
      parentsName: [],
      rangeTime: [],
      selectList: [],
      selectList1: [],
      fileList: [],
      saveFiles: [],
      productSkuList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      editForm: {
        adjustName: '',
        productType: 1,
        effectTime: '',
        adjustStatus: '',
        isApproval: 1,
        fileUrl: '',
        fileName: '',
        remark: ''
      },
      editRules: {
        adjustName: [{ required: true, message: this.$t('price.tip.adjustmentName'), trigger: 'blur' }],
        effectTime: [{ required: true, message: this.$t('price.tip.effectiveTime'), trigger: 'change' }]
      },
      searchObj: {
        catalogBId: '',
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
      dataList: []
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
      this.getModifyPriceDetail();
      this.getDataList();
    }
    this.getAllDataList();
    this.getApprovalSelectList()
  },
  methods: {
    clearModelData() {
      this.addSkuObj.price = 0;
      this.addSkuObj.number = 0;
      this.productSkuList = [];
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/price/sale/list'
        })
      });
    },
    getParentId(arr) {
      if (arr.length) {
        this.searchObj.catalogBId = arr.join(',');
      } else {
        this.searchObj.catalogBId = '';
      }
    },
    setChangePrice(item) {
      item.adjustRatio = (item.priceNumber / (item.originalPrice || 1) * 100).toFixed(2) + '%';
      item.afterPrice = (item.originalPrice * 1000 + item.priceNumber * 1000) / 1000
    },
    setChangeMininum(item) {
      item.afterMinimum = (item.originalMinimum * 1000 + item.minimunNumber * 1000) / 1000
    },
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      // let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag) {
        searchEditSkuLadder({ adjustBId: this.$route.query.id || localStorage.getItem('id'), skuBId: row.skuBId }).then(res => {
          if (res.data) {
            this.dataList[rowIndex].childs = res.data.map(e => {
              e.editable = false;
              e.afterPrice = e.afterPrice || e.originalPrice || 0;
              return { ...e }
            })
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        return [1, 6];
      } else if (columnIndex > 5 && columnIndex < 11) {
        return [0, 0]
      }
    },
    cellMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'table-expand-border'
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getProductSkuList();
    },
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    getProductSkuList() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      obj.productType = this.editForm.productType
      this.listLoading1 = true;
      getProductSkuList(obj).then(res => {
        this.productSkuList = res.data.list || [];
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    getModifyPriceDetail() {
      getModifyPriceDetail({ BId: this.$route.query.id || localStorage.getItem('id') }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (res.data.adjustAnnexList) {
          this.fileList = res.data.adjustAnnexList.map(e => {
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
      this.listLoading = true;
      this.postData.BId = this.$route.query.id || localStorage.getItem('id');
      getModifySalePriceList(this.postData).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list.map(e => {
          e.childs = (e.ppaslist || []).map(t => {
            t.editable = false;
            t.afterPrice = t.afterPrice || t.originalPrice || 0;
            return { ...t }
          });
          return { ...e }
        });
        this.postData.total = res.data.total
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    updateSkuSalePrice(arr, item) {
      item.appoveIsStatus = this.editForm.isApproval;
      item.firstAfterPrice = (arr[0].originalPrice * 1000 + arr[0].priceNumber * 1000) / 1000;
      if (item.priceNumber !== 0) {
        item.productType = this.editForm.productType;
        updateSkuSalePrice(item).then(res => {
          this.$message.success(this.$t('common.tip.saveTip'));
          item.editable = !item.editable;
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.$message.warning(this.language === 'zh' ? '价格调整量不能为0' : 'The price adjustment cannot be 0')
      }
    },
    delSkuModifyPrice() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('price.tip.commodityTip'));
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
          adjustIdlist: this.editForm.bid,
          skuIdlist: this.selectList.map(e => e.skuBId).join(',')
        };
        deleteModifyPriceSku(obj).then(res => {
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
    openDialog() {
      this.searchProductSku();
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
    addModifyPriceSku() {
      if (!this.selectList1.length) {
        return this.$message.warning(this.$t('price.tip.commodityTip'));
      }
      let arr = this.selectList1.map(e => {
        return {
          adjustBId: this.$route.query.id || localStorage.getItem('id'),
          productBId: e.productBId,
          skuBId: e.bid,
          skuCode: e.skuCode,
          originalMinimum: e.minimum || 0,
          originalPrice: e.unitPrice || 0
        }
      });
      this.confirmLoading = true;
      addBatchModifyPrice({ productPriceAdjustSkuList: arr }).then(res => {
        this.$message.success(this.$t('common.tip.addsuccess'));
        this.confirmLoading = false;
        this.dialogVisible = false;
        this.postData.pageNum = 1;
        this.clearModelData();
        this.getDataList();
      }).catch(err => {
        this.confirmLoading = false;
        this.$message.error(err.message)
      });
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
      this.$message.warning(this.$t('price.tip.uploadMaxTip'));
    },
    onPreview(file) {
      this.downFile(file.annexPath)
    },
    confirmAdd(formName, status, type) {
      if (status && !this.dataList.length) {
        return this.$message.warning(this.$t('price.tip.addTip'));
      }

      for (let i = 0; i < this.dataList.length; i++) {
        for (let j = 0; j < this.dataList[i].childs.length; j++) {
          if (this.dataList[i].childs[j].editable) {
            return this.$message.warning(this.$t('price.tip.saveBeforeTip'));
          }
          if (!this.dataList[i].childs[j].priceNumber) {
            return this.$message.warning(this.$t('price.tip.priceAdjust'));
          }
        }
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          // let api = type ? updateModifyPrice : addModifyPrice;
          this.editForm.adjustStatus = status;
          this.editForm.adjustAnnexList = this.saveFiles;
          addModifyPrice(this.editForm).then(res => {
            this.editForm.bid = res.data;
            localStorage.setItem('id', res.data || this.editForm.bid);
            this.editType = true;
            this.getDataList();
            this.confirmLoading = false;
            if (status) {
              this.$message.success(this.$t('common.tip.sumbitTip'));
              this.closePage();
            } else {
              this.$message.success(this.$t('common.tip.saveTip'));
            }
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.warning(err.message);
          });
        }
      })
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
  .saleModifyPrice {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
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
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 51px;
        text-align: center;
        padding: 0 10px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        line-height: 38px;
        font-size: 12px;
        .sku-attr {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            height: 38px;
            line-height: 38px;
            text-align: center;
            padding: 0 10px;
          }
        }
        .sku-msg {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            height: 38px;
            line-height: 38px;
            text-align: center;
            padding: 0 10px;
          }
        }
        >div {
          flex: 1;
          text-align: center;
          padding: 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          word-wrap: break-word;
          word-break: normal;
          height: 38px;
          line-height: 1.25rem;
        }
      }
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .edit-footer {
      text-align: center;
      margin-top: 40px;
      button {
        margin: 0 10px;
      }
    }
    .table-expand-border {
      border-right: none;
    }
  }
</style>
