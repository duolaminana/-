<template>
  <div class="app-container standardProduct">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <div>
          <el-form-item :label="$t('product.categoryTemplate.category')">
            <el-cascader
              :key="isZh"
              style="width: 200px"
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
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.isShelf" clearable :placeholder="$t('common.status')" style="width: 200px">
              <el-option v-for="(item, index) in isShelfList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('product.product.productName')">
          <el-input v-model.trim="postData.productName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('product.product.productCode')">
          <el-input v-model.trim="postData.productCode" clearable :placeholder="$t('product.product.productCode')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openShelf(1)">{{$t('product.product.onShelf')}}</el-button>
      <el-button type="primary" size="small" @click="openShelf(0)">{{$t('product.product.offShelf')}}</el-button>
      <el-button type="primary" size="small" @click="addNewProduct()">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteNewProduct()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportNewProduct()">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      ref="checkTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Search"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      :cell-class-name="cellMethod"
      :header-cell-class-name="cellMethod"
      @expand-change="expandTable"
      @select-all="getSelectAll"
      @select="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-checkbox-group v-model="checkList">
          <div class="table-expand" v-for="(item, childIndex) in props.row.childs" :key="childIndex">
            <div class="expand-box"></div>
            <div class="expand-box"><el-checkbox :label="item">{{item.null}}</el-checkbox></div>
            <div class="table-flex">
              <div class="sku-attr">
                <div style="width: 160px">SKU</div>
                <div class="sku-text">{{isZh ? item.cnAttrValueList : item.enAttrValueList}}</div>
              </div>
              <div class="sku-msg">
                <div style="width: 80px;" show-overflow-tooltip>{{item.updateUserId}}</div>
                <div style="width: 130px;" show-overflow-tooltip>{{item.updateTime | timeFmt}}</div>
                <div style="width: 80px">
                  <el-tag :type="item.isShelf === 1 ? 'primary' : 'info' " size="mini">{{ item.isShelf === 1 ? 'ON' : 'OFF' }}</el-tag>
                </div>
                <div :style="{width: isZh ? '160px': '180px'}"></div>
              </div>
            </div>
          </div>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.categoryTemplate.category')" min-width="100" :prop="isZh?'cnCategoryName':'enCategoryName'" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCategoryName : scope.row.enCategoryName}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product.productCode')" min-width="100" prop="productCode" sortable show-overflow-tooltip/>
      <el-table-column :label="$t('product.product.productName')" min-width="100" :prop="isZh?'cnProductName':'enProductName'" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>
      <el-table-column align="center" width="130" :label="$t('common.table.updateTime')" prop="updateTime" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('common.status')" show-overflow-tooltip>
      </el-table-column>
      <el-table-column header-align="center" :width="isZh?160:180" :label="$t('common.table.actions')">
        <template slot-scope="scope">
        <el-button type="primary" size="mini" :loading="saveLoading" @click="applyQuantityClick(scope.row.id )">{{$t('common.buttonText.applyQuantity')}}</el-button>
          <el-button type="primary" size="mini" :loading="saveLoading" @click="openImageDialog(scope.row.productBId )">{{$t('common.buttonText.productImage')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('product.product.addNewProduct')" width="800px" center>
      <el-form :model="dialogForm" v-if="dialogVisible" label-width="120px" label-position="left" inline size="mini" >
        <el-form-item :label="$t('product.categoryTemplate.category')">
          <el-cascader
            :key="isZh"
            style="width: 200px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('common.search')"
            change-on-select
            @change="getParentId1"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.product.productCode')">
          <el-input v-model.trim="dialogForm.productCode" clearable :placeholder="$t('product.product.productCode')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')">
          <el-input v-model.trim="dialogForm.productName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductList">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0">
        <el-table
          :data="productList"
          v-loading="listLoading1"
          border
          fit
          size="mini"
          style="margin-top: 10px"
          :header-cell-style="{background: '#a7bfee'}"
          @selection-change="getSelect1">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" :label="$t('product.categoryTemplate.category')" prop="catalogBName" >
            <template slot-scope="scope">
              {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('product.product.productCode')" prop="productCode" />

          <el-table-column align="center" :label="$t('product.product.productName')" prop="productName" >
            <template slot-scope="scope">
              {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="dialogForm.total" :page.sync="dialogForm.pageNum" :limit.sync="dialogForm.pageSize" @pagination="getNewProductList" ></Pagination>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="productSamplesDialog" :title="$t('product.product.applyProductSet')" center width="950px" @closed="clearData">
      <!--基本属性-->
      <el-tabs v-model="activeName" :before-leave="changeTab">
        <el-tab-pane :label="$t('product.product.productSamplesTitle')" name="1">
          <el-form ref="addProductSamples" :model="productSamples" label-position="top" size="small" :rules="productSamplesRules">
            <el-form-item label-width="20px" prop="sampleApply">
              <el-checkbox v-model="productSamples.sampleApply">{{$t('product.product.productSamples')}}</el-checkbox>
            </el-form-item>
            <el-form-item label-width="200px" prop="contact">
              {{$t('product.product.maximumSamples')}}：<el-input v-model="productSamples.sampleMaxPer" clearable :placeholder="$t('product.product.maximumSamples')" style="width: 330px"/>
            </el-form-item>
            <el-form-item :label="$t('product.product.pcEnDescription')" label-position="top" prop="enSamplePcDesc">
              <tinymce v-model="productSamples.enSamplePcDesc" />
            </el-form-item>
            <el-form-item :label="$t('product.product.pcCnDescription')" label-position="top" prop="cnSamplePcDesc">
              <tinymce v-model="productSamples.cnSamplePcDesc" />
            </el-form-item>
            <el-form-item :label="$t('product.product.appEnDescription')" label-position="top" prop="enSampleAppDesc">
              <tinymce v-model="productSamples.enSampleAppDesc" />
            </el-form-item>
            <el-form-item :label="$t('product.product.appCnDescription')" label-position="top" prop="cnSampleAppDesc">
              <tinymce v-model="productSamples.cnSampleAppDesc" />
            </el-form-item>
          </el-form>
          <div style="text-align: center;margin: 25px 0">
            <el-button type="primary" size="small" :loading="addSamplesLoading" @click="confirmProductSamples('addProductSamples')">{{$t('common.buttonText.save')}}</el-button>
            <el-button type="danger" size="small" @click="productSamplesDialog=false">{{$t('common.buttonText.back')}}</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('product.product.productBrochuresTitle')" name="2">
          <el-form ref="addProductBrochure" :model="productBrochure" label-width="200px" label-position="top" size="small" :rules="productBrochureRules">
            <el-form-item label-width="20px" prop="brochureApply">
              <el-checkbox v-model="productSamples.brochureApply">{{$t('product.product.productBrochures')}}</el-checkbox>
            </el-form-item>
            <el-form-item label-width="200px" prop="brochureMaxPer">
              {{$t('product.product.maximumSamples')}}：<el-input v-model="productBrochure.brochureMaxPer" clearable :placeholder="$t('product.product.maximumSamples')" style="width: 330px"/>
            </el-form-item>
            <el-form-item :label="$t('product.product.pcEnDescription')" label-position="top" prop="enBrochurePcDesc">
              <tinymce v-model="productBrochure.enBrochurePcDesc" />
            </el-form-item>
            <el-form-item :label="$t('product.product.pcCnDescription')" label-position="top" prop="cnBrochurePcDesc">
              <tinymce v-model="productBrochure.cnBrochurePcDesc" />
            </el-form-item>
            <el-form-item :label="$t('product.product.appEnDescription')" label-position="top" prop="enBrochureAppDesc">
              <tinymce v-model="productBrochure.enBrochureAppDesc"/>
            </el-form-item>
            <el-form-item :label="$t('product.product.appCnDescription')" label-position="top" prop="cnBrochureAppDesc">
              <tinymce v-model="productBrochure.cnBrochureAppDesc"/>
            </el-form-item>
          </el-form>
          <div style="text-align: center;margin: 25px 0">
            <el-button type="primary" size="small" :loading="addBrochureLoading" @click="confirmProductBrochure('addProductBrochure')">{{$t('common.buttonText.save')}}</el-button>
            <el-button type="danger" size="small" @click="productSamplesDialog=false">{{$t('common.buttonText.back')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="imageVisible" :title="$t('product.product.addNewProductImg')" width="600px" center>
      <el-form label-width="200px" label-position="top" size="small">
        <el-form-item label-position="top" prop="cnBrochureAppDesc">
          <el-upload
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            list-type="picture-card"
            :data="{ type: 1 }"
            :limit="5"
            :file-list="filesImageList"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="previewVisible" append-to-body="">
        <img width="100%" :src="fullUrl(dialogImageUrl)" alt="">
      </el-dialog>
      <div slot="footer">
        <el-button type="danger" size="small" @click="closeImage">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Tinymce from '@/components/Tinymce'
import { getNewProductList,
  getForProductNew,
  getPublicCategory,
  getProductNewSkuList,
  updateProductNewSku,
  saveBatchProductNew,
  deleteProductNewSku,
  updateProductNew,
  getNewProductById,
  exportExcelProductNewList,
  deleteTextImg,
  saveTextImg,
  getNewProductImgList
} from '@/api/product';
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
export default {
  components: {
    Pagination,
    Tinymce
  },
  data() {
    return {
      uploadActionUrl,
      checkList: [],
      listLoading: true,
      listLoading1: true,
      dialogVisible: false,
      productSamplesDialog: false,
      saveLoading: false,
      imageLoading: false,
      addSamplesLoading: false,
      addBrochureLoading: false,
      isbrochureApply: false,
      previewVisible: false,
      imageVisible: false,
      activeName: '1',
      cloneList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: '',
        catalogBId: '',
        isShelf: ''
      },
      reviewForm: {
        preferredIds: '',
        preferredStatus: 0
      },
      dialogForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: '',
        categoryBId: ''
      },
      searchDataList: [],
      parentsName: [],
      selectList: [],
      dataList: [],
      productList: [],
      selectList1: [],
      productSamples: {
        sampleApply: 0,
        sampleMaxPer: 0,
        enSamplePcDesc: '',
        enSampleAppDesc: '',
        cnSamplePcDesc: '',
        cnSampleAppDesc: '',
        id: ''
      },
      productBrochure: {
        brochureApply: 0,
        brochureMaxPer: 0,
        enBrochurePcDesc: '',
        enBrochureAppDesc: '',
        cnBrochurePcDesc: '',
        cnBrochureAppDesc: '',
        id: ''
      },
      isShelfList: [
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          labelZh: '上架',
          label: 'On Shelf',
          id: 1
        },
        {
          labelZh: '下架',
          label: 'Off Shelf',
          id: 0
        }
      ],
      productSamplesRules: {
        sampleMaxPer: [
          { required: true, message: this.$t('product.product.writeSample'), trigger: 'blur' }
        ]
      },
      productBrochureRules: {
        brochureMaxPer: [
          { required: true, message: this.$t('product.product.writeBrochures'), trigger: 'blur' }
        ]
      },
      productBId: '',
      dialogImageUrl: '',
      filesImageList: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList();
  },
  methods: {
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    getParentId1(arr) {
      if (arr.length) {
        this.dialogForm.catalogBId = arr.join(',');
      } else {
        this.dialogForm.catalogBId = '';
      }
    },
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      let hasCheck = this.selectList.indexOf(row) > -1;
      // let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag) {
        getProductNewSkuList({ productBId: row.productBId, isShelf: this.postData.isShelf }).then(res => {
          this.dataList[rowIndex].childs = res.data;
          let delSku = res.data.map(e => e.skuBId);
          if (hasCheck) {
            // this.checkList = [... new Set(this.checkList.concat(res.data))]
            this.$refs.checkTable.toggleRowSelection(row, false);
          }
          this.checkList = this.checkList.filter(e => {
            return !delSku.includes(e.skuBId)
          });
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    cellMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'table-expand-border'
      }
    },
    searchProductList() {
      this.dialogForm.pageNum = 1;
      this.getNewProductList()
    },
    exportNewProduct() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelProductNewList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '新产品列表.xlsx')
        } else {
          link.setAttribute('download', 'New product list.xlsx')
        }
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getNewProductList() {
      let obj = {};
      for (let key in this.dialogForm) {
        if (this.dialogForm[key]) {
          obj[key] = this.dialogForm[key]
        }
      }
      this.listLoading1 = true;
      getNewProductList(obj).then(res => {
        this.productList = res.data.list.map(e => {
          return { ...e }
        });
        this.dialogForm.total = res.data.total;
        this.listLoading1 = false;
      }).catch(err => {
        this.listLoading1 = false;
        this.$message.error(err.message);
      });
    },
    addNewProduct() {
      this.dialogForm.pageNum = 1;
      this.getNewProductList();
      this.dialogVisible = true;
      this.selectList1 = []
    },
    deleteNewProduct() {
      if (!this.checkList.length && !this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.deleteDataTip'))
      } else {
        for (let i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i].isShelf === 1) {
            return this.$message.warning(this.language === 'zh' ? '产品已上架,无法删除!' : 'The product is on the shelves and cannot be removed!')
          }
        }
      }
      this.$confirm(this.$t('product.product.isoption'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          productBId: this.selectList.map(e => e.productBId).join(','),
          skuBId: this.checkList.map(e => e.skuBId).join(',')
        };
        deleteProductNewSku(obj).then(res => {
          this.searchData();
          this.checkList = [];
          this.selectList = [];
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
    openShelf(val) {
      if (!this.checkList.length) {
        return this.$message.warning(this.$t('common.tip.selectSkuTip'));
      }
      let text = '';
      if (val === 1) {
        text = this.$t('product.product.onShelf');
      } else {
        text = this.$t('product.product.offShelf');
      }
      this.$confirm(this.$t('common.tip.okTip') + text + '?', this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let shelfSku = this.checkList.map(e => {
          return {
            productBId: e.productBId,
            bid: e.skuBId,
            delFlag: e.delFlag,
            attrValueList: e.attrValueList,
            attrBIdList: e.attrBIdList,
            id: e.id
          };
        });
        let shelfBId = this.checkList.map(e => {
          return e.skuBId
        });
        this.cloneList = this.dataList.map(e => e);
        updateProductNewSku({ isShelf: val, productSkuList: shelfSku }).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('common.tip.operation'));
          }
          this.checkList = [];
          this.dataList.forEach(e => {
            e.childs.forEach(t => {
              if (shelfBId.includes(t.skuBId)) {
                t.isShelf = val === 1 ? 1 : 0
              }
            })
          })
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
    getSelectAll(selects) {
      this.selectList = selects;
      if (selects.length) {
        selects.forEach(e => {
          e.childs.forEach(t => {
            this.checkList = [... new Set(this.checkList.concat(t))]
          })
        });
      } else {
        this.checkList = [];
      }
    },
    getSelect(selects, row) {
      this.selectList = selects;
      let delSku = row.childs.map(e => e.skuBId);
      if (selects.indexOf(row) > -1) {
        [row].forEach(e => {
          e.childs.forEach(t => {
            this.checkList = [... new Set(this.checkList.concat(t))]
          })
        });
      } else {
        this.checkList = this.checkList.filter(e => {
          return !delSku.includes(e.skuBId)
        });
      }
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getForProductNew(obj).then(res => {
        this.checkList = [];
        this.dataList = (res.data.list || []).map(e => {
          e.childs = [];
          return { ...e }
        });
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    getSelect1(selects) {
      this.selectList1 = selects;
    },
    getCategoryDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    openDialog() {
      this.dialogForm.pageNum = 1;
      this.getNewProductList();
      this.dialogVisible = true;
      this.selectList1 = []
    },
    applyQuantityClick(id) {
      this.productSamples.id = id;
      this.productSamplesDialog = true;
      // 通过id获取详情
      getNewProductById({ id: id }).then(res => {
        this.productSamples = res.data;
        this.productSamples.sampleApply = Number(res.data.sampleApply);
        if (this.productSamples.sampleApply === 1) {
          this.productSamples.sampleApply = true;
        }
      })
    },
    openImageDialog(id) {
      this.productBId = id;
      getNewProductImgList({ bid: id, imageBelongs: 2 }).then(res => {
        this.filesImageList = res.data.map(e => {
          e.name = e.imageName;
          e.url = this.uploadFileHttp + e.imagePath;
          return { ...e }
        });
        this.imageVisible = true
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    closeImage() {
      this.filesImageList = [];
      this.imageVisible = false
    },
    handleRemove(file, fileList) {
      if (file.id) {
        deleteTextImg({ id: file.id }).then(res => {
          this.$message.success(this.$t('common.tip.deleteTip'))
        }).catch(err => {
          this.$message.error(err.message)
        });
      }
    },
    handleSuccess(res, file, fileList) {
      let obj = {
        productBId: this.productBId,
        imagePath: res.data.filePath,
        imageUuid: res.data.UUID,
        imageName: file.name,
        imageType: 1,
        imageBelongs: 2
      };
      saveTextImg(obj).then(res => {
        fileList.forEach(e => {
          if (!e.id) {
            e.id = res.data
          }
        });
        this.$message.success(this.$t('common.tip.uploadSucc'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.previewVisible = true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('product.tip.addImgCntTip'));
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';

      if (!isJPG) {
        this.$message.error(this.$t('product.tip.imgTypeTip'));
      }
      return isJPG
    },
    changeTab(name) {
      switch (Number(name)) {
        case 2: this.getProductBrochureData(); break;
        default: break;
      }
    },
    getProductBrochureData() {
      this.productBrochure.id = this.productSamples.id;
      // 通过id获取详情
      getNewProductById({ id: this.productBrochure.id }).then(res => {
        this.productBrochure = res.data;
        this.productSamples.brochureApply = Number(res.data.brochureApply);
        if (this.productSamples.brochureApply === 1) {
          this.productSamples.brochureApply = true;
        }
      })
    },
    clearData() {
      this.productSamples.sampleApply = 0;
      this.productSamples.sampleMaxPer = 0;
      this.productSamples.enSamplePcDesc = '';
      this.productSamples.enSampleAppDesc = '';
      this.productSamples.id = '';
      this.productBrochure.brochureApply = 0;
      this.productBrochure.brochureMaxPer = 0;
      this.productBrochure.enBrochurePcDesc = '';
      this.productBrochure.enBrochureAppDesc = '';
      this.productBrochure.id = '';
    },
    confirmProductSamples(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productSamples.sampleApply = this.productSamples.sampleApply ? 1 : 0;
          updateProductNew(this.productSamples).then(res => {
            this.$message.success(this.$t('common.tip.saveTip'));
            this.$refs[formName].resetFields();
            this.searchData();
            this.productSamplesDialog = false;
          }).catch(err => {
            this.addSamplesLoading = false;
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning(this.$t('common.tip.isvalid'));
          return false;
        }
      });
    },
    confirmProductBrochure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.productBrochure.brochureApply = this.productBrochure.brochureApply ? 1 : 0;
          updateProductNew(this.productBrochure).then(res => {
            this.$message.success(this.$t('common.tip.saveTip'));
            this.$refs[formName].resetFields();
            this.searchData();
            this.productSamplesDialog = false;
          }).catch(err => {
            this.addBrochureLoading = false;
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning(this.$t('common.tip.isvalid'));
          return false;
        }
      });
    },
    confirmAdd() {
      if (!this.selectList1.length) {
        return this.$message.warning(this.$t('product.product.selectAddProduct'))
      }
      this.saveLoading = true;
      saveBatchProductNew({ productInfoList: this.selectList1 }).then(res => {
        this.$message.success(this.$t('common.tip.addsuccess'))
        this.dialogVisible = false;
        this.saveLoading = false;
        this.searchData();
      }).catch(err => {
        this.saveLoading = false;
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
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .standardProduct {
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
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 51px;
        line-height: 30px;
        text-align: center;
        padding: 0 10px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        font-size: 12px;
        .sku-attr {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 10px;
            word-wrap: break-word;
            word-break: normal;
            line-height: 1.15rem;
          }
          .sku-text {
            flex: 1;
            text-align: left;
          }
        }
        .sku-msg {
          display: -webkit-flex;
          display: flex;
          >div {
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 10px;
            word-wrap: break-word;
            word-break: normal;
            line-height: 1.15rem;
          }
        }
      }
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .table-expand-border {
      border-right: none;
    }
  }
</style>
