<template>
  <div class="detailProduct">
    <div class="detailContent">
      <!--基本属性-->
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('product.product.basicInformation')" name="1">
          <div class="panel-item">
            <el-form ref="productBaseInfo" :model="ModalForm" label-width="120px" label-position="left" size="small">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('product.product.productCode')" prop="productCode">
                    <el-input v-model="ModalForm.productCode" readonly :placeholder="$t('product.product.productCode')"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-left: 5px!important;">
                  <el-form-item :label="$t('product.product.customsCode')" prop="customsCode">
                    <el-input v-model="ModalForm.customsCode" readonly :placeholder="$t('product.product.customsCode')"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('product.product.productName')" prop="enProductName">
                    <el-input v-if="isZh" v-model="ModalForm.cnProductName" readonly :placeholder="$t('product.product.productName')" />
                    <el-input v-else v-model="ModalForm.enProductName" readonly :placeholder="$t('product.product.productName')" />
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-left: 5px!important;">
                  <el-form-item :label="$t('product.product.productNameZh')" prop="cnProductName">
                    <el-input v-model="ModalForm.cnProductName" clearable :placeholder="$t('product.product.productName')" />
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
                      :options="searchDataList"
                      :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
                      filterable
                      disabled
                      placeholder="search"
                      change-on-select
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-left: 5px!important;">
                  <el-form-item :label="$t('product.categoryTemplate.categoryTemplate')" prop="templateBId">
                    <el-select v-model="ModalForm.templateBId" disabled placeholder="select" style="width: 100%">
                      <el-option v-for="(item, index) in modalList" :label="isZh ? item.cnTemplateName : item.enTemplateName" :value="item.bid" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$t('product.product.promotionTitle')" prop="enProductHeadline">
                <el-input v-if="isZh" v-model="ModalForm.cnProductHeadline" clearable :placeholder="$t('product.product.promotionTitle')" style="width: 100%" />
                <el-input v-else v-model="ModalForm.enProductHeadline" clearable :placeholder="$t('product.product.promotionTitle')" style="width: 100%" />
              </el-form-item>
              <el-form-item :label="$t('common.status')" prop="enProductHeadline">
                {{productStatus === 0 ? isZh ? '已禁用' : 'Disabled' : isZh ? '使用中' : 'Enabled'}}
                <!--{{$t('common.table.inUse')}}-->
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--类目属性-->
        <el-tab-pane :label="$t('product.categoryTemplate.categoryAttribute')" name="2">
          <div class="panel-item">
            <el-form ref="productCategoryAttr" label-width="150px" label-position="left" size="small">
              <el-form-item :label="isZh ? item.cnAttributeName : item.enAttributeName" v-for="(item, index) in categoryAttrList" :key="index">
                <el-radio-group v-model="item.attrValue" disabled v-if="item.attributeType === 1">
                  <el-radio :label="item1.id" v-for="(item1, index1) in item.pcavlist" :key="index1">
                    {{isZh ? item1.cnAttributeValue : item1.enAttributeValue}}
                  </el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="item.check2" disabled v-if="item.attributeType === 2">
                  <el-checkbox :label="item1.id" v-for="(item1, index1) in item.pcavlist" :key="index1">
                    {{isZh ? item1.cnAttributeValue : item1.enAttributeValue}}
                  </el-checkbox>
                </el-checkbox-group>
                <el-select v-model="item.attrValue" disabled :placeholder="`select {item.attributeName}`" v-if="item.attributeType === 3" style="width: 60%">
                  <el-option v-for="(item1, index1) in item.pcavlist" :label="isZh ? item1.cnAttributeValue : item1.enAttributeValue" :value="item1.id" :key="index1"></el-option>
                </el-select>
                <el-input v-if="item.attributeType === 4" v-model="item.attrValue" size="small" readonly :placeholder="`${item.enAttributeName}`" style="width: 60%" />
                <el-input v-if="item.attributeType === 5" v-model="item.attrValue" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" size="small" readonly :placeholder="`${item.enAttributeName}`" style="width: 80%" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--销售属性-->
        <el-tab-pane :label="$t('product.categoryTemplate.sellingParameter')" name="3">
          <div class="panel-item">
            <el-form ref="productSaleAttr" :model="ModalForm" label-width="150px" label-position="left" size="small" :rules="formRules">
              <div v-for="(item, index) in categorySaleList" :key="index">
                <el-form-item :label="isZh ? item.cnAttributeName : item.enAttributeName">
                  <el-checkbox-group v-model="item.checks" disabled>
                    <el-checkbox :label="item1.bid" v-for="(item1, index1) in saleList['saleList-' + item.enAttributeName]" :key="index1">
                      <el-tag type="info" size="small">{{item1.enSellAttrValue}}---{{item1.cnSellAttrValue}}</el-tag>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="sale-batch">
                <div style="display: inline;float: left;;line-height: 36px;height: 36px;font-size: 15px">{{$t('product.product.listDisplay')}}:</div>
              </div>
              <el-table :data="skuList2" border fit size="mini" :header-cell-style="{background: '#a7bfee'}">
                <el-table-column align="center" type="index" :label="$t('common.table.id')" width="50"/>
                <el-table-column align="center" min-width="150" :label="$t('product.product.skuAttributes')" prop="enAttrValueList" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="100" :label="$t('product.product.skuCode')" prop="skuCode" show-overflow-tooltip/>
                <el-table-column align="center" :label="$t('product.product.minimumOrderQuantity')" prop="miniOrderNumber"/>
                <el-table-column align="center" :label="$t('product.product.unit')" prop="skuUnit"/>
                <el-table-column align="center" :label="$t('product.product.decimal')" prop="skuDecimalPlaces"/>
                <el-table-column align="center" :label="$t('product.product.quantityPackage')" prop="skuSinglePackage"/>
                <el-table-column align="center" :label="$t('product.product.skuVolume')" prop="skuVolume"/>
                <el-table-column align="center" :label="$t('product.product.skuWeight')" prop="skuWeight"/>
              </el-table>
            </el-form>
          </div>
        </el-tab-pane>
        <!--图文描述-->
        <el-tab-pane :label="$t('product.product.graphicDescription')" name="4">
          <el-form ref="productTextImg" :model="textImgForm" size="small" :rules="textImgRules">
            <div>
              {{$t('product.product.pcroductPicture')}}
            </div>
            <el-form-item required>
              <!--{{$t('product.product.pictureNoMoreThan')}}<span class="form-tips">  3MB </span>。-->
              <!--<span class="form-tips">700*700</span>以上的图片上传后宝贝详情页自动提供放大镜功能。-->
              <!--第五张图发商品白底图可增加手淘首页曝光机会。-->
              <div class="imgPreview">
                <el-upload
                  :action="uploadActionUrl"
                  :headers="upLoadHeaders"
                  :data="{type: 1}"
                  list-type="picture-card"
                  :file-list="imgList"
                  :on-preview="handlePictureCardPreview">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="fullUrl(dialogImageUrl)" alt="">
                </el-dialog>
              </div>
            </el-form-item>
            <div>
              {{$t('product.product.appProductPicture')}}
            </div>
            <el-form-item required>
              <!--{{$t('product.product.pictureNoMoreThan')}}<span class="form-tips">  3MB </span>。-->
              <div class="imgPreview">
                <el-upload
                  :action="uploadActionUrl"
                  :headers="upLoadHeaders"
                  :data="{type: 1}"
                  list-type="picture-card"
                  :file-list="imgList2"
                  :on-preview="handlePictureCardPreview">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="fullUrl(dialogImageUrl)" alt="">
                </el-dialog>
              </div>
            </el-form-item>
            <div style="margin-bottom: 10px">
              {{$t('product.product.pcEnDescription')}}
            </div>
            <el-form-item prop="enDetPcPage">
              <tinymce v-model="textImgForm.enDetPcPage" style="width: 99%;pointer-events: none;" />
            </el-form-item>
            <div style="margin-bottom: 10px">
              {{$t('product.product.pcCnDescription')}}
            </div>
            <el-form-item prop="cnDetPcPage">
              <tinymce v-model="textImgForm.cnDetPcPage" style="width: 99%;pointer-events: none;" />
            </el-form-item>
            <div style="margin-bottom: 10px">
              {{$t('product.product.appEnDescription')}}
            </div>
            <el-form-item prop="enDetAppPage">
              <tinymce v-model="textImgForm.enDetAppPage" style="width: 99%;pointer-events: none;" />
            </el-form-item>
            <div style="margin-bottom: 10px">
              {{$t('product.product.appCnDescription')}}
            </div>
            <el-form-item prop="cnDetAppPage">
              <tinymce v-model="textImgForm.cnDetAppPage" style="width: 99%;pointer-events: none;" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="product-footer">
    <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.close')}}</el-button>
    </div>
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common'
import Tinymce from '@/components/Tinymce'
import {
  getAllPublicCategory,
  detailCategoryModal,
  getAllCategoryModalList,
  getCategoryAttr,
  getProductDetail,
  getTextImgInfo,
  getSaleAttr,
  getProductImgList,
  getProductSaleAttrValue
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
      dialogImageUrl: '',
      saveLoading: false,
      dialogVisible: false,
      firstSave: false,
      editable: false,
      searchDataList: [],
      modalList: [],
      categoryAttrList: [],
      categorySaleList: [],
      saleList: {},
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
        productName: '',
        customsCode: '',
        catalogBId: '',
        catalogBName: '',
        templateBId: '',
        productUnit: '',
        singleWeight: '',
        singleBulk: '',
        singlePackage: '',
        bulkUnit: '1',
        weightUnit: '1',
        productHeadline: '',
        decimalPlaces: 0
      },
      formRules: {
        cnProductName: [
          { required: true, message: this.$t('product.tip.addCnProductTip'), trigger: 'blur' }
        ],
        enProductName: [
          { required: true, message: this.$t('product.tip.addEnProductTip'), trigger: 'blur' }
        ],
        productCode: [
          { required: true, message: this.$t('product.tip.addProductCode'), trigger: 'blur' }
        ],
        cascaderArr: [
          { type: 'array', required: true, message: this.$t('product.tip.addCategoryTip'), trigger: 'blur' }
        ],
        productUnit: [
          { required: true, message: this.$t('product.tip.addUnitTip'), trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: this.$t('product.tip.addSelectModelTip'), trigger: 'change' }
        ]
      },
      textImgForm: {
        detAppPage: '',
        detPcPage: '',
        productImgeList: []
      },
      textImgRules: {
        enDetPcPage: [{ required: true, message: this.$t('product.tip.addEnPcImgTip'), trigger: 'blur' }],
        cnDetPcPage: [{ required: true, message: this.$t('product.tip.addCnPcImgTip'), trigger: 'blur' }],
        enDetAppPage: [{ required: true, message: this.$t('product.tip.addEnAppImgTip'), trigger: 'blur' }],
        cnDetAppPage: [{ required: true, message: this.$t('product.tip.addCnAppImgTip'), trigger: 'blur' }]
      }
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
    'ModalForm.templateBId' (val) {
      if (val) {
        this.getCategoryModalDetail(val)
      } else {
        this.categoryAttrList = [];
        this.categorySaleList = [];
      }
    },
    skuList(arr) {
      arr = [].concat(arr);
      let arrInLength = arr.filter(e => {
        return !e.length
      }).length;
      if (arrInLength === arr.length) {
        this.skuList2 = []
      } else {
        let result = this.getComposeByArrays(arr).map(e => {
          e.productBId = this.ModalForm.bid;
          this.skuList1.forEach(t => {
            if (e.attrValueList === t.attrValueList) {
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
                  e.check2 = t.attrValue.split(',').map(e => Number(e))
                }
              }
            });
            return { ...e }
          })
        } else {
          this.firstSave = true;
          this.categoryAttrList = this.categoryAttrList.map(e => {
            e.attrName = e.attributeName;
            e.productBId = this.ModalForm.bid;
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
        if (res.data.productSellAttributeList && res.data.productSellAttributeList.length) {
          this.firstSave = false;
          this.categorySaleList = this.categorySaleList.map(e => {
            res.data.productSellAttributeList.forEach((t, index) => {
              if (e.enAttributeName === t.enAttributeValue) {
                e.checks = t.psabvList.filter(n => n.isDelete).map(n => { return n.bid; });
              }
            });
            return { ...e }
          });
          this.skuList1 = (res.data.skuList || []).map(e => { return { ...e } });
          this.skuList2 = (res.data.skuList || []).map(e => { return { ...e } });
        } else {
          this.categorySaleList = this.categorySaleList.map(e => {
            e.checks = [];
            return { ...e }
          });
          this.firstSave = true;
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
    getProductImgList() {
      getProductImgList({ bid: this.ModalForm.bid }).then(res => {
        if (res.data.pcImg) {
          this.imgList = res.data.pcImg.map(e => {
            e.name = e.imageName;
            e.url = this.uploadFileHttp + e.imagePath;
            return { ...e }
          })
        }
        if (res.data.appImg) {
          this.imgList2 = res.data.appImg.map(e => {
            e.name = e.imageName;
            e.url = this.uploadFileHttp + e.imagePath;
            return { ...e }
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
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
    getProductDetail() {
      getProductDetail({ bid: this.$route.query.id }).then(res => {
        this.ModalForm = Object.assign(this.ModalForm, res.data);
        this.productStatus = this.ModalForm.productType;
        this.ModalForm.cascaderArr = this.ModalForm.catalogBId.split(',') || []
        this.catalogBId = this.ModalForm.catalogBId;
        this.templateBId = this.ModalForm.templateBId;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getComposeByArrays(arrays) {
      let arr = [{ attrValueList: '' }];
      for (let i = 0; i < arrays.length; i++) {
        arr = this.two_compose(arr, arrays[i], i)
      }
      return arr
    },
    two_compose(arr1, arr2, index) {
      let arr = [];
      if (!arr2.length) {
        arr2 = [''];
      }
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          let arrObj = Object.assign({}, arr1[i]);
          arrObj.attrValueList = arrObj.attrValueList + (arrObj.attrValueList && arr2[j] ? `/` : '') + arr2[j];
          arr.push(arrObj);
        }
      }
      return arr
    },
    getAllCategoryList() {
      getAllPublicCategory().then(res => {
        this.searchDataList = res.data || [];
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
        if (res.data !== null) {
          this.categoryAttrList = (res.data.basePctd || []).map(e => {
            if (!e.pcabvlist) {
              e.pcabvlist = []
            }
            if (e.attributeType === 2) {
              e.check2 = [];
            }
            e.attrValue = '';
            return { ...e }
          });
        }
        if (res.data !== null) {
          this.categorySaleList = (res.data.sellPctd || []).map((e, index) => {
            e.cnAttributeValue = e.cnAttributeName;
            e.enAttributeValue = e.enAttributeName;
            e.checks = [];
            e.cnAttrValue = '';
            e.enAttrValue = '';
            this.$set(this.saleList, 'saleList-' + e.enAttributeName, []);
            return { ...e }
          });
        }
        this.getCategoryAttr();
        this.getSaleAttr();
        this.getTextImg();
        this.getProductImgList();
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .detailProduct {
    width: 90%;
    margin: 0 auto;
    padding-top: 20px;
    .panel-item {
      min-height: 70%;
      overflow: auto;
      overflow-x: hidden;
      padding: 20px;
      border: 1px solid $border-light-color;
      .noModal {
        text-align: center;
        padding: 15px 0;
        color: red;
      }
    }
    .product-footer {
      text-align: center;
      margin: 20px 0;
      button {
        margin:  0 20px;
      }
    }
    .imgPreview {
      .el-upload--picture-card {
        display: none;
      }
      .el-icon-delete{
        display: none;
      }
    }
  }
</style>

