<template>
  <div class="addProduct">
    <div class="detailContent">
        <!--基本属性-->
        <el-tabs v-model="activeName" :before-leave="changeTab">
          <el-tab-pane :label="$t('product.product.basicInformation')" name="1">
            <div class="panel-item">
              <el-form ref="productBaseInfo" :model="ModalForm" label-width="120px" label-position="left" size="small" :rules="formRules" :key="productKey">
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.product.productCode')" prop="productCode">
                      <el-input v-model="ModalForm.productCode" clearable maxlength="100" :placeholder="$t('product.product.productCode')"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-left: 5px!important;">
                    <el-form-item :label="$t('product.product.customsCode')" prop="customsCode">
                      <el-input v-model="ModalForm.customsCode" clearable maxlength="30" :placeholder="$t('product.product.customsCode')"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.product.productNameEn')" prop="enProductName">
                      <el-input v-model="ModalForm.enProductName" clearable maxlength="200" :placeholder="$t('product.product.productNameEn')" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-left: 5px!important;">
                    <el-form-item :label="$t('product.product.productNameZh')" prop="cnProductName">
                      <el-input v-model="ModalForm.cnProductName" clearable maxlength="200" :placeholder="$t('product.product.productName')" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.categoryTemplate.category')" prop="cascaderArr">
                      <el-cascader
                        :key="isZh"
                        ref="catalogBName"
                        style="width: 100%"
                        v-model="ModalForm.cascaderArr"
                        :options="categoryList"
                        :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
                        filterable
                        clearable
                        :placeholder="$t('common.search')"
                        change-on-select
                        @change="getParentId"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="padding-left: 5px!important;">
                    <el-form-item :label="$t('product.categoryTemplate.categoryTemplate')" prop="templateBId">
                      <el-select v-model="ModalForm.templateBId" clearable :disabled="editable" :placeholder="$t('product.product.selectTemplate')" style="width: 100%">
                        <el-option v-for="(item, index) in modalList" :label="isZh ? item.cnTemplateName : item.enTemplateName" :value="item.bid" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item :label="$t('product.product.promotionTitleEn')" prop="enProductHeadline">
                  <el-input v-model="ModalForm.enProductHeadline" clearable maxlength="200" :placeholder="$t('product.product.promotionTitleEn')" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="$t('product.product.promotionTitleZh')" prop="cnProductHeadline">
                  <el-input v-model="ModalForm.cnProductHeadline" clearable maxlength="200" :placeholder="$t('product.product.promotionTitleZh')" style="width: 100%" />
                </el-form-item>
                <el-form-item :label="$t('common.status')" prop="enProductHeadline">
                    {{productStatus === 0 ? isZh ? '已禁用' : 'Disabled' : isZh ? '使用中' : 'Enabled'}}
                  <!--{{$t('common.table.inUse')}}-->
                </el-form-item>
              </el-form>
              <div class="product-footer">
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveProductBase('productBaseInfo', 1)">{{$t('common.buttonText.save')}}</el-button>
                <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
                <!--<el-button type="primary" size="small" :loading="saveLoading" @click="saveProductBase('productBaseInfo', 2)">提交</el-button>-->
              </div>
            </div>
          </el-tab-pane>
          <!--类目属性-->
          <el-tab-pane :label="$t('product.categoryTemplate.categoryParameter')" name="2">
            <div class="panel-item">
              <el-form ref="productCategoryAttr" label-width="150px" label-position="left" size="small">
                <el-form-item :label="isZh ? item.cnAttributeName : item.enAttributeName" required v-for="(item, index) in categoryAttrList" :key="index">
                  <el-radio-group v-model="item.attrValue" v-if="item.attributeType === 1">
                    <el-radio :label="item1.id" v-for="(item1, index1) in item.pcavlist" :key="index1">
                      {{isZh ? item1.cnAttributeValue : item1.enAttributeValue}}
                    </el-radio>
                  </el-radio-group>
                  <el-checkbox-group v-model="item.check2" v-if="item.attributeType === 2">
                    <el-checkbox :label="item1.id" v-for="(item1, index1) in item.pcavlist" :key="index1">
                      {{isZh ? item1.cnAttributeValue : item1.enAttributeValue}}
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-select v-model="item.attrValue" clearable :placeholder="`${item.attributeName}`" v-if="item.attributeType === 3" style="width: 60%">
                    <el-option v-for="(item1, index1) in item.pcavlist" :label="isZh ? item1.cnAttributeValue : item1.enAttributeValue" :value="item1.id" :key="index1"></el-option>
                  </el-select>
                  <el-input v-if="item.attributeType === 4" v-model="item.attrValue" size="small" clearable style="width: 60%" />
                  <el-input v-if="item.attributeType === 5" v-model="item.attrValue" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" size="small" clearable style="width: 80%" />
                </el-form-item>
              </el-form>
              <div class="product-footer">
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveCategoryAttr">{{$t('common.buttonText.save')}}</el-button>
                <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
              </div>
            </div>
          </el-tab-pane>
          <!--销售属性-->
          <el-tab-pane :label="$t('product.categoryTemplate.sellingParameter')" name="3">
            <div class="panel-item">
              <el-form ref="productSaleAttr" :model="ModalForm" label-width="150px" label-position="left" size="small">
                <div v-for="(item, index) in categorySaleList" :key="index">
                  <el-form-item :label="isZh ? item.cnAttributeName : item.enAttributeName">
                    <el-input v-model="item.enAttrValue" size="mini" clearable
                              :placeholder="$t('product.product.definedValue')"
                              style="width: 200px"
                              maxlength="20"
                              @keyup.enter.native="addChecks(index+1, item, item.enAttributeName)" />
                    <el-input v-model="item.cnAttrValue" size="mini" clearable
                              :placeholder="$t('product.product.definedValueZh')"
                              style="width: 200px;margin: 0 16px"
                              maxlength="20"
                              @keyup.enter.native="addChecks(index+1, item, item.enAttributeName)" />
                    <el-button type="primary" :disabled="addLoading" size="mini"
                               @click="addChecks(index+1, item, item.enAttributeName)">
                      {{$t('product.categoryTemplate.valueAdded')}}
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox-group v-model="item.checks" @change="setSkuList">
                      <el-checkbox :label="item1.bid" v-for="(item1, index1) in saleList['saleList-' + item.enAttributeName]" :key="index1">
                        <svg-icon icon-class="left-arrow" size="20" class-name="arrowClass" @click.prevent.native="moveOne(saleList['saleList-' + item.enAttributeName],index1,1)"></svg-icon>
                        <svg-icon icon-class="right-arrow" size="20" class-name="arrowClass" @click.prevent.native="moveOne(saleList['saleList-' + item.enAttributeName],index1,-1)"></svg-icon>
                        <el-tag type="info" size="small" closable @close.prevent="closeChecks(index+1, index1, item1,item.enAttributeName)">
                          {{item1.enSellAttrValue}}---{{item1.cnSellAttrValue}}
                        </el-tag>
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
                <div class="sale-batch">
                  <div style="display: inline;float: left;;line-height: 36px;height: 36px;font-size: 15px">{{$t('product.product.listDisplay')}}:</div>
                  {{$t('product.product.batch')}}：
                  <el-select v-model="tableAttr" clearable style="width: 180px">
                    <el-option v-for="(item, index) in tableAttrList" :label="isZh?item.labelZh:item.label" :value="item.value" :key="index"></el-option>
                  </el-select>
                  <el-input v-model="tableAttrValue" size="small" style="width: 150px;margin-left: 20px"/>
                  <el-button type="primary" size="small" @click="addProductSkuAttr">{{$t('common.buttonText.confirm')}}</el-button>
                </div>
                <el-table :data="skuList2" border fit size="mini" max-height="500" style="width: 100%" :header-cell-style="{background: '#a7bfee'}">
                    <el-table-column align="center" type="index" width="50" :label="$t('common.table.id')" show-overflow-tooltip/>

                    <el-table-column v-if="!isZh" min-width="150" :label="$t('product.product.skuAttributesEn')" prop="enAttrValueList" show-overflow-tooltip/>

                    <el-table-column v-else min-width="150" :label="$t('product.product.skuAttributesZh')" prop="cnAttrValueList" show-overflow-tooltip/>

                    <el-table-column align="center" min-width="100" :label="$t('product.product.skuCode')" prop="skuCode" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.skuCode" size="small"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" :label="$t('product.product.minimumOrderQuantity')" prop="miniOrderNumber">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.miniOrderNumber" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" :label="$t('product.product.unit')" prop="skuUnit">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.skuUnit" size="small" align="center" class="input-center"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" :label="$t('product.product.decimal')" prop="skuDecimalPlaces">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuDecimalPlaces" :precision="0" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" :label="$t('product.product.quantityPackage')" prop="skuSinglePackage">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuSinglePackage" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('product.product.skuVolume')" prop="skuVolume">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuVolume" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" :label="$t('product.product.skuWeight')" prop="skuWeight">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuWeight" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" width="80" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="delProductSkuAttr(scope)">{{$t('common.table.delete')}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-form>
              <div class="product-footer">
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveSaleAttr">{{$t('common.buttonText.save')}}</el-button>
                <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
              </div>
            </div>
          </el-tab-pane>
          <!--图文描述-->
          <el-tab-pane :label="$t('product.product.graphicDescription')" name="4">
            <el-form ref="productTextImg" :model="textImgForm" size="small" :rules="textImgRules">
              <div style="margin-bottom: 20px;">
                {{$t('product.product.pcroductPicture')}}
              </div>
              <el-form-item required>
                <!--<span class="form-tips">700*700</span>以上的图片上传后宝贝详情页自动提供放大镜功能。-->
                <!--第五张图发商品白底图可增加手淘首页曝光机会。-->
                <div>
                  <el-upload
                    :action="uploadActionUrl"
                    :data="{type: 1}"
                    :headers="upLoadHeaders"
                    list-type="picture-card"
                    :file-list="imgList"
                    :limit="5"
                    :on-exceed="handleExceed"
                    :before-upload="beforeUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                    <span class="el-upload__text" style="position: absolute;top: 25px;left: 25px;">400*400 JPG/PNG</span>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="fullUrl(dialogImageUrl)" alt="">
                  </el-dialog>
                </div>
              </el-form-item>
              <div style="margin-bottom: 20px;">
                {{$t('product.product.appProductPicture')}}
              </div>
              <el-form-item required>
                <!--<span class="form-tips">700*700</span>以上的图片上传后宝贝详情页自动提供放大镜功能。-->
                <!--第五张图发商品白底图可增加手淘首页曝光机会。-->
                <div>
                  <el-upload
                    :action="uploadActionUrl"
                    list-type="picture-card"
                    :file-list="imgList2"
                    :data="{type: 1}"
                    :limit="5"
                    :headers="upLoadHeaders"
                    :on-exceed="handleExceed2"
                    :before-upload="beforeUpload2"
                    :on-preview="handlePictureCardPreview2"
                    :on-remove="handleRemove2"
                    :on-success="handleSuccess2">
                    <i class="el-icon-plus"></i>
                    <span class="el-upload__text" style="position: absolute;top: 25px;left: 25px;">200*200 JPG/PNG</span>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible2">
                    <img width="100%" :src="fullUrl(dialogImageUrl2)" alt="">
                  </el-dialog>
                </div>
              </el-form-item>
              <div style="margin-bottom: 20px;">
                {{$t('product.product.pcEnDescription')}}
              </div>
              <el-form-item prop="enDetPcPage">
                <tinymce v-model="textImgForm.enDetPcPage" style="width: 99%" />
              </el-form-item>
              <div style="margin-bottom: 20px;">
                {{$t('product.product.pcCnDescription')}}
              </div>
              <el-form-item prop="cnDetPcPage">
                <tinymce v-model="textImgForm.cnDetPcPage" style="width: 99%" />
              </el-form-item>
              <div style="margin-bottom: 20px;">
                {{$t('product.product.appEnDescription')}}
              </div>
              <el-form-item prop="enDetAppPage">
                <tinymce v-model="textImgForm.enDetAppPage" style="width: 99%" />
              </el-form-item>
              <div style="margin-bottom: 20px;">
                {{$t('product.product.appCnDescription')}}
              </div>
              <el-form-item prop="cnDetAppPage">
                <tinymce v-model="textImgForm.cnDetAppPage" style="width: 99%" />
              </el-form-item>
            </el-form>
            <div class="product-footer">
              <el-button type="primary" size="small" :loading="saveLoading" @click="saveTextImg('productTextImg')">{{$t('common.buttonText.save')}}</el-button>
              <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
    <!--<div class="product-footer">-->
      <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
      <!--<el-button type="warning" size="small" :loading="saveLoading" @click="saveProduct('productForm', 1)">保存</el-button>-->
      <!--<el-button type="primary" size="small" :loading="saveLoading" @click="saveProduct('productForm', 2)">提交</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common'
import Tinymce from '@/components/Tinymce'
import { getCascaderObj } from '@/utils/index'
import {
  getAllPublicCategory,
  detailCategoryModal,
  getAllCategoryModalList,
  addProduct,
  editProduct,
  getCategoryAttr,
  getProductDetail,
  addCategoryAttr,
  editCategoryAttr,
  updateProductTemplate,
  getTextImgInfo,
  addTextImgInfo,
  editTextImgInfo,
  deleteTextImg,
  saveTextImg,
  getSaleAttr,
  addSaleAttr,
  editSaleAttr,
  getProductImgList,
  saveAttrValue,
  getProductSaleAttrValue,
  deleteProductSaleAttrValue,
  sortProductSaleAttrValue
} from '@/api/product'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      uploadActionUrl,
      productStatus: '',
      activeName: '1',
      productKey: 0,
      dialogImageUrl: '',
      dialogImageUrl2: '',
      saveLoading: false,
      addLoading: false,
      dialogVisible: false,
      dialogVisible2: false,
      firstSave: false,
      editable: false,
      categoryList: [],
      modalList: [],
      categoryAttrList: [],
      categorySaleList: [],
      saleList: {
        saleList1: [],
        saleList2: [],
        saleList3: []
      },
      skuList: [],
      skuList1: [],
      skuList2: [],
      columns: [],
      imgList: [],
      imgList2: [],
      templateBId: '',
      catalogBId: '',
      // imgList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      ModalForm: {
        cascaderArr: [],
        productCode: '',
        enProductName: '',
        cnProductName: '',
        customsCode: '',
        catalogBId: '',
        catalogBIds: '',
        enCatalogBName: '',
        cnCatalogBName: '',
        templateBId: '',
        productUnit: '',
        singleWeight: '',
        singleBulk: '',
        singlePackage: '',
        bulkUnit: '1',
        weightUnit: '1',
        enProductHeadline: '',
        cnProductHeadline: '',
        decimalPlaces: 0
      },
      formRules: {
        cnProductName: [
          { required: true, message: this.$t('product.tip.addCnProductTip'), trigger: 'blur' }
        ],
        enProductName: [
          { required: true, message: this.$t('product.tip.addEnProductTip'), trigger: 'blur' }
        ],
        customsCode: [{ required: true, message: this.$t('product.tip.addCustomCodeTip'), trigger: 'blur' }],
        productCode: [
          { required: true, message: this.$t('product.tip.addProductCode'), trigger: 'blur' }
        ],
        cascaderArr: [
          { type: 'array', required: true, message: this.$t('product.tip.addCategoryTip'), trigger: 'change' }
        ],
        productUnit: [
          { required: true, message: this.$t('product.tip.addUnitTip'), trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: this.$t('product.tip.addSelectModelTip'), trigger: 'change' }
        ],
        cnProductHeadline: [
          { required: false, message: this.$t('product.tip.addCnTitleTip'), trigger: 'blur' },
          { min: 1, max: 60, message: this.$t('product.tip.addLengthTip'), trigger: 'blur' }
        ],
        enProductHeadline: [
          { required: false, message: this.$t('product.tip.addEnTitleTip'), trigger: 'blur' },
          { min: 1, max: 60, message: this.$t('product.tip.addLengthTip'), trigger: 'blur' }
        ]
      },
      textImgForm: {
        detAppPage: '',
        enDetPcPage: '',
        cnDetPcPage: '',
        enDetAppPage: '',
        cnDetAppPage: ''
      },
      textImgRules: {
        enDetPcPage: [{ required: true, message: this.$t('product.tip.addEnPcImgTip'), trigger: 'blur' }],
        cnDetPcPage: [{ required: true, message: this.$t('product.tip.addCnPcImgTip'), trigger: 'blur' }],
        enDetAppPage: [{ required: true, message: this.$t('product.tip.addEnAppImgTip'), trigger: 'blur' }],
        cnDetAppPage: [{ required: true, message: this.$t('product.tip.addCnAppImgTip'), trigger: 'blur' }]
      },
      tableAttrList: [
        {
          label: 'Minimum Order Quantity',
          labelZh: '起订量',
          value: 'miniOrderNumber'
        },
        {
          label: 'Unit',
          labelZh: '单位',
          value: 'skuUnit'
        },
        {
          label: 'Decimal',
          labelZh: '小数位',
          value: 'skuDecimalPlaces'
        },
        {
          label: 'Quantity Package',
          labelZh: '单包装数量',
          value: 'skuSinglePackage'
        },
        {
          label: 'Volume(Cube)',
          labelZh: '单包装体积(立方米)',
          value: 'skuVolume'
        },
        {
          label: 'Weight(Kilogram)',
          labelZh: '单包装重量(kg)',
          value: 'skuWeight'
        }
      ],
      tableAttr: '',
      tableAttrValue: 0
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
  watch: {
    isZh(val) {
      this.productKey++;
      this.setOption()
    },
    'ModalForm.templateBId' (val) {
      if (val) {
        this.getCategoryModalDetail(val)
      } else {
        this.categoryAttrList = [];
        this.categorySaleList = [];
        // this.saleList.saleList1 = [];
        // this.saleList.saleList2 = [];
        // this.saleList.saleList3 = [];
        this.saleList = {}
      }
    },
    skuList(arr) {
      arr = [].concat(arr);
      let arrInLength = arr.filter(e => {
        return !e.checks.length
      }).length;
      if (arrInLength === arr.length) {
        this.skuList2 = []
      } else {
        let arr1 = arr.map(e => {
          e.checks1 = this.saleList['saleList-' + e.enAttributeName].filter(t => e.checks.includes(t.bid));
          return e.checks1
        });
        let result = this.getComposeByArrays(arr1).map(e => {
          e.productBId = this.ModalForm.bid;
          e.skuCode = '';
          e.miniOrderNumber = 0;
          e.skuUnit = '';
          e.skuDecimalPlaces = 0;
          e.skuSinglePackage = 0;
          this.skuList1.forEach(t => {
            if (e.enAttrValueList === t.enAttrValueList) {
              e = t;
            }
          });
          return { ...e };
        });
        this.skuList2 = result;
      }
    }
  },
  created() {
    this.noEnbledCategoryModalList();
    this.getAllCategoryList();
    if (this.$route.query.id) {
      this.editable = true;
      this.getProductDetail()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/product/productList'
        })
      })
    },
    setOption() {
      this.formRules = {
        cnProductName: [
          { required: true, message: this.$t('product.tip.addCnProductTip'), trigger: 'blur' }
        ],
        enProductName: [
          { required: true, message: this.$t('product.tip.addEnProductTip'), trigger: 'blur' }
        ],
        customsCode: [{ required: true, message: this.$t('product.tip.addCustomCodeTip'), trigger: 'blur' }],
        productCode: [
          { required: true, message: this.$t('product.tip.addProductCode'), trigger: 'blur' }
        ],
        cascaderArr: [
          { type: 'array', required: true, message: this.$t('product.tip.addCategoryTip'), trigger: 'change' }
        ],
        productUnit: [
          { required: true, message: this.$t('product.tip.addUnitTip'), trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: this.$t('product.tip.addSelectModelTip'), trigger: 'change' }
        ],
        cnProductHeadline: [
          { required: false, message: this.$t('product.tip.addCnTitleTip'), trigger: 'blur' },
          { min: 1, max: 60, message: this.$t('product.tip.addLengthTip'), trigger: 'blur' }
        ],
        enProductHeadline: [
          { required: false, message: this.$t('product.tip.addEnTitleTip'), trigger: 'blur' },
          { min: 1, max: 60, message: this.$t('product.tip.addLengthTip'), trigger: 'blur' }
        ]
      }
    },
    getParentId(arr) {
      if (arr.length) {
        this.ModalForm.catalogBId = arr.join(',');
        this.ModalForm.catalogBIds = arr[arr.length - 1];
        let objArr = getCascaderObj(arr, this.categoryList, 'bid');
        this.ModalForm.cnCatalogBName = objArr.map(e => e.cnCatalogName).join('/');
        this.ModalForm.enCatalogBName = objArr.map(e => e.enCatalogName).join('/');
      } else {
        this.ModalForm.catalogBId = '';
        this.ModalForm.catalogBIds = '';
        this.ModalForm.cnCatalogBName = '';
        this.ModalForm.enCatalogBName = '';
      }
      if (!this.ModalForm.bid) {
        this.noEnbledCategoryModalList(this.ModalForm.catalogBId);
        this.ModalForm.templateBId = ''
      }
    },
    addProductSkuAttr() {
      if (!this.tableAttrValue || !this.tableAttr) {
        return this.$message.warning(this.$t('common.tip.isdataFill'));
      }
      this.skuList2.forEach(e => {
        e[this.tableAttr] = this.tableAttrValue
      });
      this.tableAttr = '';
      this.tableAttrValue = 0
    },
    delProductSkuAttr(scope) {
      this.skuList2.splice(scope.$index, 1)
    },
    changeTab(name) {
      if (name !== '1' && !this.ModalForm.bid) {
        this.$message.warning(this.$t('product.tip.filldataTip'));
        return false
      }
      if (!this.ModalForm.templateBId) {
        this.$message.warning(this.$t('product.tip.selectModelTip'));
        return false
      }
      switch (Number(name)) {
        case 2: this.getCategoryAttr(); break;
        case 3: this.getSaleAttr(); break;
        case 4: this.getTextImg(); this.getProductImgList(); break;
        default: break;
      }
    },
    getCategoryAttr() {
      getCategoryAttr({ productBId: this.ModalForm.bid }).then(res => {
        if (res.data && res.data.length) {
          this.firstSave = false;
          this.categoryAttrList = this.categoryAttrList.map(e => {
            e.cnAttrName = e.cnAttributeName;
            e.enAttrName = e.enAttributeName;
            e.createTime = '';
            e.updateTime = '';
            res.data.forEach(t => {
              e.id = t.id;
              e.productBId = t.productBId;
              if (e.enAttributeName === t.enAttrName) {
                e.attrValue = isNaN(t.attrValue) ? t.attrValue : Number(t.attrValue);
                if (e.attributeType === 2) {
                  e.check2 = t.attrValue.split(',').map(e => Number(e));
                }
              }
            });
            return { ...e }
          })
        } else {
          this.firstSave = true;
          this.categoryAttrList = this.categoryAttrList.map(e => {
            e.cnAttrName = e.cnAttributeName;
            e.enAttrName = e.enAttributeName;
            e.attrValue = '';
            e.createTime = '';
            e.updateTime = '';
            return { ...e }
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSaleAttr() {
      getSaleAttr({ bid: this.ModalForm.bid }).then(res => {
        if (res.data.skuList && res.data.skuList.length) {
          this.firstSave = false;
          this.categorySaleList = this.categorySaleList.map(e => {
            (res.data.productSellAttributeList || []).forEach((t, index) => {
              if (e.enAttributeName === t.enAttributeValue) {
                e.checks = t.psabvList.filter(n => n.isDelete).map(n => { return n.bid; });
              }
            });
            return { ...e }
          });
          this.skuList1 = res.data.skuList.map(e => { return { ...e } });
          this.skuList2 = res.data.skuList.map(e => { return { ...e } });
        } else {
          this.categorySaleList = this.categorySaleList.map(e => {
            e.checks = [];
            return { ...e }
          });
          this.firstSave = true;
          this.skuList2 = []
        }
        this.getProductSaleAttrValue()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getProductSaleAttrValue() {
      getProductSaleAttrValue({ productBId: this.ModalForm.bid }).then(res => {
        if (res.data.productSellAttributeList && res.data.productSellAttributeList.length) {
          res.data.productSellAttributeList.forEach((e, index) => {
            this.saleList['saleList-' + e.enAttributeValue] = e.psabvList
          });
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveSaleAttr() {
      if (!this.skuList2.length) {
        return this.$message.warning(this.$t('product.tip.noSku'));
      }
      for (let i = 0; i < this.skuList2.length; i++) {
        if (!this.skuList2[i].skuCode) {
          return this.$message.warning(this.$t('product.tip.skuCode'));
        }
        if (!this.skuList2[i].skuUnit) {
          return this.$message.warning(this.$t('product.tip.skuUnit'));
        }
      }
      let api = '';
      let obj = {};
      if (this.firstSave) {
        api = addSaleAttr
      } else {
        api = editSaleAttr
      }
      this.categorySaleList.forEach((e, index) => {
        e.attributeSequ = index + 1;
        e.productBId = this.ModalForm.bid;
        e.psabvList = this.saleList['saleList-' + e.enAttributeName].map(n => {
          if (e.checks.includes(n.bid)) {
            n.isDelete = 1;
          } else {
            n.isDelete = 0;
          }
          return { ...n }
        })
      });
      obj.productBId = this.ModalForm.bid;
      obj.skuList = this.skuList2.map(e => {
        e.checks = e.enAttrValueList.split('/');
        let arr = [];
        for (let key in this.saleList) {
          arr = arr.concat(this.saleList[key].filter(t => e.checks.includes(t.enSellAttrValue)))
        }
        e.attrBIdList = e.attrBIdList || arr.map(n => n.bid).join(',');
        return { ...e }
      });
      obj.productSellAttributeList = this.categorySaleList;
      this.saveLoading = true;
      api(obj).then(res => {
        this.firstSave = false;
        this.saveLoading = false;
        this.getSaleAttr();
        this.$message.success(this.$t('common.tip.saveTip'));
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message)
      })
    },
    moveOne(arr, index, move) {
      if (index === 0 && move === 1) {
        return false
      } else if (index === arr.length - 1 && move === -1) {
        return false
      } else {
        let obj = {
          oneBid: arr[index].bid,
          twoBid: arr[index - move].bid
        };
        sortProductSaleAttrValue(obj).then(res => {
          arr[index] = arr.splice(index - move, 1, arr[index])[0];
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    getProductImgList() {
      getProductImgList({ bid: this.ModalForm.bid, imageBelongs: 0 }).then(res => {
        if (res.data.pcImg) {
          this.imgList = res.data.pcImg.map(e => {
            e.name = e.imageName;
            e.url = this.uploadFileHttp + e.imagePath;
            return { ...e }
          });
        }
        if (res.data.appImg) {
          this.imgList2 = res.data.appImg.map(e => {
            e.name = e.imageName;
            e.url = this.uploadFileHttp + e.imagePath;
            return { ...e }
          });
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getTextImg() {
      getTextImgInfo({ bid: this.ModalForm.bid }).then(res => {
        if (res.data) {
          this.firstSave = false;
          this.textImgForm = res.data;
        } else {
          this.firstSave = true;
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveCategoryAttr() {
      let api = '';
      if (this.firstSave) {
        api = addCategoryAttr
      } else {
        api = editCategoryAttr
      }
      for (let i = 0; i < this.categoryAttrList.length; i++) {
        if (this.categoryAttrList[i].attributeType === 2 && !this.categoryAttrList[i].check2.length) {
          return this.$message.error(this.$t('product.tip.fillModalTip'));
        } else if (!this.categoryAttrList[i].attrValue && this.categoryAttrList[i].attributeType !== 2) {
          return this.$message.error(this.$t('product.tip.fillModalTip'));
        }
      }
      this.categoryAttrList.forEach(e => {
        e.productBId = this.ModalForm.bid;
        if (e.attributeType === 2) {
          e.attrValue = e.check2.join(',');
        }
        return { ...e };
      });
      this.saveLoading = true;
      api({ productAttributeList: this.categoryAttrList }).then(res => {
        this.firstSave = false;
        this.saveLoading = false;
        this.$message.success(this.$t('common.tip.saveTip'));
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message)
      })
    },
    saveTextImg(name) {
      let api = '';
      if (this.firstSave) {
        api = addTextImgInfo
      } else {
        api = editTextImgInfo
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          this.textImgForm.productBId = this.ModalForm.bid;
          api(this.textImgForm).then(res => {
            this.firstSave = false;
            this.saveLoading = false;
            this.$message.success(this.$t('common.tip.saveTip'))
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.error(this.$t('common.tip.isdataFill'))
        }
      })
    },
    getProductDetail() {
      getProductDetail({ bid: this.$route.query.id }).then(res => {
        this.ModalForm = Object.assign(this.ModalForm, res.data);
        this.productStatus = this.ModalForm.productType;
        this.ModalForm.cascaderArr = this.ModalForm.catalogBId.split(',') || [];
        this.catalogBId = this.ModalForm.catalogBId;
        this.templateBId = this.ModalForm.templateBId;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getComposeByArrays(arrays) {
      let arr = [{ enAttrValueList: '', cnAttrValueList: '' }];
      for (let i = 0; i < arrays.length; i++) {
        arr = this.two_compose(arr, arrays[i], i)
      }
      return arr
    },
    two_compose(arr1, arr2, index) {
      let arr = [];
      if (!arr2.length) {
        arr2 = [{ enSellAttrValue: '', cnSellAttrValue: '' }];
      }
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          let arrObj = Object.assign({}, arr1[i]);
          arrObj.enAttrValueList = arrObj.enAttrValueList + (arrObj.enAttrValueList && arr2[j].enSellAttrValue ? `/` : '') + arr2[j].enSellAttrValue;
          arrObj.cnAttrValueList = arrObj.cnAttrValueList + (arrObj.cnAttrValueList && arr2[j].cnSellAttrValue ? `/` : '') + arr2[j].cnSellAttrValue;
          arr.push(arrObj);
        }
      }
      return arr
    },
    addChecks(index, item, label) {
      if (!item.cnAttrValue || !item.enAttrValue) {
        return this.$message.error(this.$t('product.tip.addEmptyTip'));
      }
      if (this.saleList['saleList-' + label].findIndex(e => e.enSellAttrValue === item.enAttrValue) > -1) {
        return this.$message.error(this.$t('product.tip.addDuplicateTip'));
      }
      // 调用接口新增
      this.addLoading = true;
      let params = {
        productBId: this.ModalForm.bid,
        enAttributeValue: item.enAttributeName,
        cnAttributeValue: item.cnAttributeName,
        productSellAttributeValue: { enSellAttrValue: item.enAttrValue, cnSellAttrValue: item.cnAttrValue }
      };
      saveAttrValue(params).then(res => {
        this.getProductSaleAttrValue();
        this.addLoading = false;
      }).catch(err => {
        this.addLoading = false;
        this.$message.error(err.message)
      });
      this.categorySaleList[index - 1].cnAttrValue = '';
      this.categorySaleList[index - 1].enAttrValue = '';
    },
    closeChecks(index, tagIndex, item, label) {
      deleteProductSaleAttrValue({ psavBid: item.bid }).then(res => {
        this.saleList['saleList-' + label].splice(tagIndex, 1);
        if (this.categorySaleList[index - 1].checks.indexOf(item.bid) > -1) {
          let spliceIndex = this.categorySaleList[index - 1].checks.indexOf(item.bid);
          this.categorySaleList[index - 1].checks.splice(spliceIndex, 1)
          this.setSkuList()
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    setSkuList() {
      this.skuList = this.categorySaleList.map(e => {
        return {
          enAttributeName: e.enAttributeName,
          checks: e.checks
        }
      });
    },
    getAllCategoryList() {
      getAllPublicCategory().then(res => {
        this.categoryList = res.data || [];
      })
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      let obj = {
        productBId: this.ModalForm.bid,
        imagePath: res.data.filePath,
        imageUuid: res.data.UUID,
        imageName: file.name,
        imageType: 1,
        imageBelongs: 0
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
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('product.tip.addImgCntTip'));
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t('product.tip.imgTypeTip'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('product.tip.imgSizeLength'));
      }
      return isJPG && isLt2M;
    },
    handleRemove2(file, fileList) {
      if (file.id) {
        deleteTextImg({ id: file.id }).then(res => {
          this.$message.success(this.$t('common.tip.deleteTip'))
        }).catch(err => {
          this.$message.error(err.message)
        });
      }
    },
    handlePictureCardPreview2(file) {
      this.dialogImageUrl2 = file.url;
      this.dialogVisible2 = true;
    },
    handleSuccess2(res, file, fileList) {
      let obj = {
        productBId: this.ModalForm.bid,
        imagePath: res.data.filePath,
        imageUuid: res.data.UUID,
        imageName: file.name,
        imageType: 2,
        imageBelongs: 0
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
    handleExceed2(files, fileList) {
      this.$message.warning(this.$t('product.tip.addImgCntTip'));
    },
    beforeUpload2(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t('product.tip.imgTypeTip'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('product.tip.imgSizeLength'));
      }
      return isJPG && isLt2M;
    },
    noEnbledCategoryModalList(val) {
      getAllCategoryModalList({ bid: val }).then(res => {
        this.modalList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getCategoryModalDetail(val) {
      detailCategoryModal({ bid: val }).then(res => {
        this.categoryAttrList = (res.data ? res.data.basePctd : []).map(e => {
          if (!e.pcabvlist) {
            e.pcabvlist = []
          }
          if (e.attributeType === 2) {
            e.check2 = [];
          }
          e.attrValue = '';
          return { ...e }
        });
        this.categorySaleList = (res.data ? res.data.sellPctd : []).map((e, index) => {
          e.cnAttributeValue = e.cnAttributeName;
          e.enAttributeValue = e.enAttributeName;
          e.checks = [];
          e.cnAttrValue = '';
          e.enAttrValue = '';
          this.$set(this.saleList, 'saleList-' + e.enAttributeName, []);
          return { ...e }
        });
        if (this.templateBId !== val && this.ModalForm.bid) {
          this.updateProductTemplate()
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    updateProductTemplate() {
      let obj = {
        templateBId: this.ModalForm.templateBId,
        bid: this.ModalForm.bid,
        catalogBId: this.ModalForm.catalogBId,
        catalogBName: this.ModalForm.catalogBName
      };
      updateProductTemplate(obj).then(res => {
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveProductBase(name, type) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let api = '';
          this.saveLoading = true;
          this.ModalForm.productType = type;
          if (this.ModalForm.bid) {
            api = editProduct
          } else {
            api = addProduct
          }
          api(this.ModalForm).then(res => {
            if (res.data.cnt === 1) {
              this.$message.success(this.$t('common.tip.saveTip'));
              if (!this.editable) {
                this.ModalForm.bid = res.data.bid;
                this.catalogBId = res.data.catalogBId;
                this.templateBId = res.data.templateBId;
              }
            } else if (res.data.cnt === -1) {
              this.$message.error(this.$t('product.tip.alreadCodeTip'));
            } else if (res.data.cnt === -2) {
              this.$message.error(this.$t('product.tip.alreadNameTip'));
            }
            setTimeout(() => {
              this.saveLoading = false;
            }, 200);
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.error(this.$t('common.tip.isdataFill'));
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
.addProduct {
  width: 90%;
  margin: 0 auto;
  padding-top: 20px;
  .panel-item {
    min-height: 70%;
    overflow: auto;
    overflow-x: hidden;
    padding: 20px 20px 0 20px;
    border: 1px solid $border-light-color;
    .noModal {
      text-align: center;
      padding: 15px 0;
      color: red;
    }
  }
  .sale-batch {
    text-align: right;
    padding: 10px 20px;
  }
  .product-footer {
    text-align: center;
    margin: 20px 0;
    button {
      margin:  0 20px;
    }
  }
  .arrowClass {
    vertical-align: -0.25em;
    color: #EAAF10;
  }
  .el-upload--picture-card {
    position: relative;
  }
}
</style>

