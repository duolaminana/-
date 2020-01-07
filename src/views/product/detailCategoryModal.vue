<template>
  <div class="addCategoryModal">
    <div class="mainContent">
      <div class="topPanel">
        <el-form label-width="180px" inline label-position="left" size="small">
          <el-form-item :label="$t('product.categoryTemplate.code')">
            <el-input v-model="ModalForm.templateCode" readonly size="small" clearable style="width: 260px" />
          </el-form-item>
          <el-form-item :label="$t('product.categoryTemplate.category')">
            <el-cascader
              :key="isZh"
              v-model="cascaderArr"
              :options="searchDataList"
              :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
              filterable
              disabled
              :placeholder="$t('common.search')"
              change-on-select
              style="width: 260px"
            ></el-cascader>
          </el-form-item>
          <!--<el-form-item :label="$t('product.categoryTemplate.name')">-->
            <!--<el-input v-if="isZh" v-model="ModalForm.cnTemplateName" readonly size="small" clearable style="width: 260px" />-->
            <!--<el-input v-else v-model="ModalForm.enTemplateName" readonly size="small" clearable style="width: 260px" />-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('product.categoryTemplate.nameEn')" prop="enTemplateName">
            <el-input v-model="ModalForm.enTemplateName" clearable readonly size="small" style="width: 260px" />
          </el-form-item>
          <el-form-item :label="$t('product.categoryTemplate.nameZh')" prop="cnTemplateName">
            <el-input v-model="ModalForm.cnTemplateName" clearable readonly size="small" style="width: 300px" />
          </el-form-item>
          <!--<el-form-item :label="$t('common.status')">-->
            <!--{{ModalForm.templateStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}-->
          <!--</el-form-item>-->
        </el-form>
      </div>
      <div class="modal-item">
          <div class="label-top">
            {{$t('product.categoryTemplate.categoryParameter')}}：
          </div>
        <el-table
          :data="categoryAttrList"
          border
          fit
          default-expand-all
          size="mini"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="table-expand" v-for="(item, childIndex) in props.row.pcavlist" :key="childIndex">
                <div class="expand-box"></div>
                <div class="table-flex">
                  <div>
                    {{isZh ? item.cnAttributeValue : item.enAttributeValue}}
                  </div>
                  <div></div>
                  <div>
                    {{item.attrState === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('product.categoryTemplate.detailAttributeName')" prop="enAttributeName">
            <template slot-scope="scope">
            {{isZh ? scope.row.cnAttributeName : scope.row.enAttributeName}}
            </template>
          </el-table-column>
          <el-table-column header-align="center" :label="$t('product.categoryTemplate.attributeType')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.attributeType" disabled @change="changeAttrType(scope)">
                  <el-option :value="1" :label="$t('product.categoryTemplate.radio')">{{$t('product.categoryTemplate.radio')}}</el-option>
                  <el-option :value="2" :label="$t('product.categoryTemplate.multipleSelection')">{{$t('product.categoryTemplate.multipleSelection')}}</el-option>
                  <el-option :value="3" :label="$t('product.categoryTemplate.dropdown')">{{$t('product.categoryTemplate.dropdown')}}</el-option>
                  <el-option :value="4" :label="$t('product.categoryTemplate.textbox')">{{$t('product.categoryTemplate.textbox')}}</el-option>
                  <el-option :value="5" :label="$t('product.categoryTemplate.textfield')">{{$t('product.categoryTemplate.textfield')}}</el-option>
                </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.status')">
            <template slot-scope="scope">
              {{ scope.row.attributeState === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="modal-item">
        <div class="label-top">
          {{$t('product.categoryTemplate.sellingParameter')}}：
        </div>
        <el-table
          :data="categorySaleList"
          border
          fit
          size="small"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" :label="$t('product.categoryTemplate.salesAttributeName')">
            <template slot-scope="scope">
            {{isZh ? scope.row.cnAttributeName:scope.row.enAttributeName}}
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('product.categoryTemplate.attributeType')">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.attributeType" disabled size="mini">
                <el-radio :label="1">{{$t('product.categoryTemplate.datasheets')}}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.status')">
            <template slot-scope="scope">
              {{scope.row.attributeState === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="category-footer">
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPublicCategory,
  detailCategoryModal
} from '@/api/product'

export default {
  data() {
    return {
      saveLoading: false,
      searchDataList: [],
      cascaderArr: [],
      ModalForm: {
        templateCode: '',
        templateName: '',
        ownSpecNo: ''
      },
      categoryAttrList: [{ attrName: '', attrType: 1, attrState: 1, specAttrDicList: [{ attrDictValue: '', attrState: 1 }] }],
      categorySaleList: [{ attrName: '', attrType: 1, attrState: 1 }]
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
    this.getAllDataList();
    if (this.$route.query.id) {
      this.getCategoryModalDetail()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/product/categoryModal'
        })
      })
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    getCategoryModalDetail() {
      detailCategoryModal({ bid: this.$route.query.id }).then(res => {
        this.ModalForm = res.data;
        this.cascaderArr = res.data.catalogBIdList.split(',');
        this.categoryAttrList = res.data.basePctd.map(e => {
          if (!e.specAttrDicList) {
            e.specAttrDicList = []
          }
          return { ...e }
        });
        this.categorySaleList = res.data.sellPctd || [];
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
.addCategoryModal {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  border: 1px solid $border-light-color;
  .topPanel {
    width: 100%;
    border-bottom: 1px solid $border-light-color;
  }
  .modal-item {
    margin: 10px 0;
    .label-top {
      height: 36px;
      line-height: 36px;
      padding-left: 15px;
    }
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 50px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        >div {
          flex: 1;
          height: 36px;
          line-height: 36px;
          text-align: center;
          padding: 0 10px;
        }
      }
    }
  }
  .table-expand + .table-expand {
    border-top: 1px solid $border-light-color;
  }
  .svgClass {
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 0 !important;
  }
  .el-radio {
    margin-right: 20px;
  }
  .category-footer {
    text-align: center;
    margin: 30px 0;
    button {
      margin:  0 20px;
    }
  }
}
</style>

