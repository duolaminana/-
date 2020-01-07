<template>
  <div class="addCategoryModal">
    <div class="mainContent">
      <div class="topPanel">
        <!--<div class="edit-title">{{$t('product.categoryTemplate.editCategoryTemplate')}}</div>-->
        <el-form ref="ModalForm" label-width="180px" :model="ModalForm" size="small" label-position="left" :rules="formRules" inline style="margin-top: 20px">
          <el-form-item :label="$t('product.categoryTemplate.code')" prop="templateCode">
            <el-input v-model="ModalForm.templateCode" clearable maxlength="20" :placeholder="$t('product.categoryTemplate.code')" style="width: 260px" />
          </el-form-item>
          <el-form-item :label="$t('product.categoryTemplate.category')" required>
            <el-cascader
              :key="isZh"
              ref="catalogName"
              style="width: 300px"
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
          <el-form-item :label="$t('product.categoryTemplate.nameEn')" prop="enTemplateName">
            <el-input v-model="ModalForm.enTemplateName" clearable maxlength="20" :placeholder="$t('product.categoryTemplate.nameEn')" style="width: 260px" />
          </el-form-item>
          <el-form-item :label="$t('product.categoryTemplate.nameZh')" prop="cnTemplateName">
            <el-input v-model="ModalForm.cnTemplateName" clearable maxlength="20" :placeholder="$t('product.categoryTemplate.nameZh')" style="width: 300px" />
          </el-form-item>
          <!--<el-form-item :label="$t('common.status')">-->
            <!--{{ModalForm.templateStatus === 1 || ModalForm.templateStatus == null ? $t('common.table.inUse') : $t('common.table.disabled')}}-->
          <!--</el-form-item>-->
        </el-form>
      </div>
      <div class="modal-item">
        <div class="label-top">
          {{$t('product.categoryTemplate.categoryParameter')}}：<el-button type="primary" size="mini" style="margin-left: 50px" @click="addCategoryAttr">{{$t('common.add')}}</el-button>
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
                    <el-input v-model="item.enAttributeValue" clearable size="mini" :placeholder="$t('product.categoryTemplate.addAttrValue')" />
                  </div>
                  <div>
                    <el-input v-model="item.cnAttributeValue" clearable size="mini" :placeholder="$t('product.categoryTemplate.addAttrValue')" />
                  </div>
                  <div></div>
                  <div>
                    <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" @click.native="moveFirst(props.row.pcavlist, childIndex, 2)" />
                    <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(props.row.pcavlist, childIndex, 1, 2)" />
                    <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(props.row.pcavlist, childIndex, -1, 2)" />
                    <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" @click.native="moveLast(props.row.pcavlist, childIndex, 2)" />
                  </div>
                  <!--<div>-->
                    <!--<el-select v-model="item.attrState" clearable placeholder="请选择状态">-->
                      <!--<el-option v-for="(status, index) in statusList" :label="status.label" :value="status.id" :key="index"></el-option>-->
                    <!--</el-select>-->
                  <!--</div>-->
                  <div>
                    <el-button type="primary" size="mini" @click="removeAttrValue(props.$index, childIndex, item)">{{$t('common.delete')}}</el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('product.categoryTemplate.categoryAttributeName')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.enAttributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.categoryAttributeName')" />
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('product.categoryTemplate.categoryAttributeNameZh')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.cnAttributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.categoryAttributeNameZh')" />
            </template>
          </el-table-column>

          <el-table-column header-align="center" :label="$t('product.categoryTemplate.attributeType')">
            <template slot-scope="scope">
              <el-select v-model="scope.row.attributeType" @change="changeAttrType(scope)">
                <el-option :value="1" :label="$t('product.categoryTemplate.radio')">{{$t('product.categoryTemplate.radio')}}</el-option>
                <el-option :value="2" :label="$t('product.categoryTemplate.multipleSelection')">{{$t('product.categoryTemplate.multipleSelection')}}</el-option>
                <el-option :value="3" :label="$t('product.categoryTemplate.dropdown')">{{$t('product.categoryTemplate.dropdown')}}</el-option>
                <el-option :value="4" :label="$t('product.categoryTemplate.textbox')">{{$t('product.categoryTemplate.textbox')}}</el-option>
                <el-option :value="5" :label="$t('product.categoryTemplate.textfield')">{{$t('product.categoryTemplate.textfield')}}</el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.sort')" prop="templateName">
            <template slot-scope="scope">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" @click.native="moveFirst(categoryAttrList, scope.$index, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(categoryAttrList, scope.$index, 1, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(categoryAttrList, scope.$index, -1, 1)" />
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" @click.native="moveLast(categoryAttrList, scope.$index, 1)" />
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="状态">-->
            <!--<template slot-scope="scope">-->
              <!--<el-select v-model="scope.row.attrState" placeholder="请选择状态">-->
                <!--<el-option v-for="(status, index) in statusList" :label="status.label" :value="status.id" :key="index"></el-option>-->
              <!--</el-select>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" :label="$t('common.table.actions')">
            <template slot-scope="scope">
              <el-button :type="scope.row.attributeType === 4 || scope.row.attributeType === 5 ? 'info' : 'primary'" size="mini" :disabled="scope.row.attributeType === 4 || scope.row.attributeType === 5" @click="addAttrValue(scope.$index)">{{$t('product.categoryTemplate.valueAdded')}}</el-button>
              <el-button type="primary" size="mini" @click="removeCategoryAttr(categoryAttrList, scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="modal-item">
        <div class="label-top">
          {{$t('product.categoryTemplate.sellingParameter')}}：<el-button type="primary" size="mini" style="margin-left: 50px" @click="addCategorySale">{{$t('common.add')}}</el-button>
        </div>
        <el-table
          :data="categorySaleList"
          border
          fit
          size="small"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" :label="$t('product.categoryTemplate.salesAttributeName')" prop="roleName" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.enAttributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.salesAttributeName')" />
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('product.categoryTemplate.salesAttributeNameZh')" prop="roleName" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.cnAttributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.salesAttributeNameZh')" />
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('product.categoryTemplate.attributeType')">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.attributeType" size="mini">
                <el-radio :label="1">{{$t('product.categoryTemplate.datasheets')}}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.sort')">
            <template slot-scope="scope">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" @click.native="moveFirst(categorySaleList, scope.$index, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(categorySaleList, scope.$index, 1, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(categorySaleList, scope.$index, -1, 1)" />
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" @click.native="moveLast(categorySaleList, scope.$index, 1)" />
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="状态">-->
            <!--<template slot-scope="scope">-->
              <!--<el-select v-model="scope.row.attrState" clearable placeholder="请选择状态">-->
                <!--<el-option v-for="(status, index) in statusList" :label="status.label" :value="status.id" :key="index"></el-option>-->
              <!--</el-select>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" :label="$t('common.table.actions')">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="removeCategorySale(categorySaleList, scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="category-footer">
        <el-button type="primary" size="small" @click="saveCategoryModal('ModalForm')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import { getCascaderObj } from '@/utils'
import {
  getAllPublicCategory,
  editCategoryModal,
  addCategoryModal,
  detailCategoryModal,
  deleteAttrName,
  deleteAttrValue
} from '@/api/product'

export default {
  components: {
    SvgIcon
  },
  data() {
    return {
      saveLoading: false,
      categoryList: [],
      cascaderArr: [],
      ModalForm: {
        templateCode: '',
        cnTemplateName: '',
        enTemplateName: '',
        catalogBIdList: '',
        cnCatalogName: '',
        enCatalogName: '',
        cascaderArr: []
      },
      formRules: {
        enTemplateName: [
          { required: true, message: this.$t('product.tip.writeEnModalTip'), trigger: 'blur' }
        ],
        cnTemplateName: [
          { required: true, message: this.$t('product.tip.writeCnModalTip'), trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: this.$t('product.tip.writeModalCode'), trigger: 'blur' }
        ],
        cascaderArr: [
          { type: 'array', required: true, message: this.$t('product.tip.addSelectModelTip'), trigger: 'change' }
        ]
      },
      categoryAttrList: [{ enAttributeName: '', cnAttributeName: '', attributeType: 1, attributeState: 1, pcavlist: [{ enAttributeValue: '', cnAttributeValue: '', attrState: 1 }] }],
      categorySaleList: [{ enAttributeName: '', cnAttributeName: '', attributeType: 1, attributeState: 1 }],
      statusList: [
        {
          label: this.$t('common.table.enable'),
          id: 1
        },
        {
          label: this.$t('common.table.disable'),
          id: 2
        }
      ]
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
    language() {
      this.setOption()
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
    setOption() {
      this.formRules = {
        enTemplateName: [
          { required: true, message: this.$t('product.tip.writeEnModalTip'), trigger: 'blur' }
        ],
        cnTemplateName: [
          { required: true, message: this.$t('product.tip.writeCnModalTip'), trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: this.$t('product.tip.writeModalCode'), trigger: 'blur' }
        ],
        cascaderArr: [
          { type: 'array', required: true, message: this.$t('product.tip.addSelectModelTip'), trigger: 'change' }
        ]
      };
    },
    getParentId(arr) {
      if (arr.length) {
        this.ModalForm.catalogBIdList = arr.join(',');
        let objArr = getCascaderObj(arr, this.categoryList, 'bid');
        this.ModalForm.cnCatalogName = objArr.map(e => e.cnCatalogName).join('/');
        this.ModalForm.enCatalogName = objArr.map(e => e.enCatalogName).join('/');
      } else {
        this.ModalForm.catalogBIdList = '';
        this.ModalForm.cnCatalogName = '';
        this.ModalForm.enCatalogName = '';
      }
    },
    getAllDataList() {
      getAllPublicCategory().then(res => {
        this.categoryList = res.data || [];
      })
    },
    getCategoryModalDetail() {
      detailCategoryModal({ bid: this.$route.query.id }).then(res => {
        this.ModalForm = Object.assign(this.ModalForm, res.data);
        this.ModalForm.cascaderArr = res.data.catalogBIdList.split(',');
        this.categoryAttrList = res.data.basePctd.map(e => {
          e.cloneType = e.attributeType;
          if (!e.pcavlist) {
            e.pcavlist = []
          } else {
            e.cloneList = e.pcavlist.map(e => {
              return { ...e }
            })
          }
          return { ...e }
        });
        this.categorySaleList = res.data.sellPctd || [];
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveCategoryModal(formName) {
      if (!this.categoryAttrList.length) {
        return this.$message.error(this.$t('product.tip.leastOneTip'));
      } else {
        for (let i = 0; i < this.categoryAttrList.length; i++) {
          if ((this.categoryAttrList[i].attributeType !== 4 && this.categoryAttrList[i].attributeType !== 5) && this.categoryAttrList[i].pcavlist.length < 2) {
            return this.$message.error(this.$t('product.tip.templateAttrValue'));
          }
          if (!this.categoryAttrList[i].enAttributeName || !this.categoryAttrList[i].cnAttributeName) {
            return this.$message.error(this.$t('product.tip.emptyCategoryNameTip'));
          }
          for (let j = 0; j < this.categoryAttrList[i].pcavlist.length; j++) {
            if (!this.categoryAttrList[i].pcavlist[j].enAttributeValue || !this.categoryAttrList[i].pcavlist[j].cnAttributeValue) {
              return this.$message.error(this.$t('product.tip.emptyCategoryValueTip'));
            }
          }
        }
      }
      for (let n = 0; n < this.categorySaleList.length; n++) {
        if (!this.categorySaleList[n].enAttributeName || !this.categorySaleList[n].cnAttributeName) {
          return this.$message.error(this.$t('product.tip.emptySaleNameTip'));
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ModalForm.basePctd = this.categoryAttrList;
          this.ModalForm.sellPctd = this.categorySaleList;
          let api = '';
          if (this.$route.query.id) {
            api = editCategoryModal
          } else {
            this.ModalForm.templateStatus = 1;
            api = addCategoryModal
          }
          this.saveLoading = true;
          api(this.ModalForm).then(res => {
            this.$message.success(this.$t('common.tip.saveTip'));
            setTimeout(() => {
              this.saveLoading = false;
              this.closePage();
            }, 300)
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        }
      })
    },
    changeAttrType(scope) {
      if (scope.row.id && (scope.row.cloneType === scope.row.attributeType)) {
        scope.row.pcavlist = (scope.row.cloneList || []).map(e => {
          return { ...e }
        })
      } else {
        if (scope.row.attributeType === 4 || scope.row.attributeType === 5) {
          scope.row.pcavlist = []
        } else {
          scope.row.pcavlist = [{ enAttributeValue: '', cnAttributeValue: '', attrState: 1 }, { enAttributeValue: '', cnAttributeValue: '', attrState: 1 }]
        }
      }
    },
    addCategoryAttr() {
      this.categoryAttrList.push({ enAttributeName: '', cnAttributeName: '', attributeType: 1, attributeState: 1, pcavlist: [{ enAttributeValue: '', cnAttributeValue: '', attrState: 1 }] })
    },
    addCategorySale() {
      this.categorySaleList.push({ enAttributeName: '', cnAttributeName: '', attributeType: 1, attributeState: 1 })
    },
    addAttrValue(index) {
      this.categoryAttrList[index].pcavlist.push({ enAttributeValue: '', cnAttributeValue: '', attrState: 1 })
    },
    removeCategoryAttr(arr, index, item) {
      if (item.id) {
        let obj = {
          bid: this.categoryAttrList[index].bid
        };
        deleteAttrName(obj).then(res => {
          this.$message.success(this.$t('common.tip.deleteTip'));
          arr.splice(index, 1)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        arr.splice(index, 1)
      }
    },
    removeCategorySale(arr, index, item) {
      if (this.categorySaleList.length <= 1) {
        return this.$message.warning(this.$t('product.tip.leastOneSalesTip'));
      }
      if (item.id) {
        let obj = {
          bid: this.categorySaleList[index].bid
        };
        deleteAttrName(obj).then(res => {
          this.$message.success(this.$t('common.tip.deleteTip'));
          arr.splice(index, 1)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        arr.splice(index, 1)
      }
    },
    removeAttrValue(index, cIndex, item) {
      if (item.id) {
        let obj = {
          dictId: this.categoryAttrList[index].pcavlist[cIndex].id
        };
        deleteAttrValue(obj).then(res => {
          this.$message.success(this.$t('common.tip.deleteTip'));
          this.categoryAttrList[index].pcavlist.splice(cIndex, 1)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.categoryAttrList[index].pcavlist.splice(cIndex, 1)
      }
    },
    // 置顶类目属性
    moveFirst(arr, rowIndex, type) {
      let sequ = type === 1 ? 'attributeSequence' : 'valueSequence';
      if (rowIndex === 0) {
        return this.$message.warning(this.$t('product.tip.topTip'));
      }
      if (arr[rowIndex][sequ] && arr[0][sequ]) {
        // let oldAttrSequ = arr[rowIndex][sequ];
        let newAttrSequ = arr[0][sequ];
        arr[rowIndex][sequ] = (newAttrSequ - 10).toString();
        // arr[0][sequ] = oldAttrSequ;
      }
      let top = arr.splice(rowIndex, 1)[0];
      arr.unshift(top);
    },
    // 移到尾部类目属性
    moveLast(arr, rowIndex, type) {
      let sequ = type === 1 ? 'attributeSequence' : 'valueSequence';
      if (rowIndex === arr.length - 1) {
        return this.$message.warning(this.$t('product.tip.bottomTip'));
      }
      if (arr[rowIndex][sequ] && arr[arr.length - 1][sequ]) {
        // let oldAttrSequ = arr[rowIndex][sequ];
        let newAttrSequ = arr[arr.length - 1][sequ];
        arr[rowIndex][sequ] = (newAttrSequ + 10).toString();
        // arr[arr.length - 1][sequ] = oldAttrSequ;
      }
      let end = arr.splice(rowIndex, 1)[0];
      arr.push(end);
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, type) {
      let sequ = type === 1 ? 'attributeSequence' : 'valueSequence';
      if (arr[curIndex][sequ] && arr[nextIndex][sequ]) {
        let oldAttrSequ = arr[curIndex][sequ];
        let newAttrSequ = arr[nextIndex][sequ];
        arr[curIndex][sequ] = newAttrSequ;
        arr[nextIndex][sequ] = oldAttrSequ;
      }
      arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0];
      return arr;
    },
    // 上下移动
    moveOne(arr, rowIndex, move, type) {
      if (rowIndex === 0 && move === 1) {
        return this.$message.warning(this.$t('product.tip.topTip'));
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning(this.$t('product.tip.bottomTip'));
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move, type);
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
.addCategoryModal {
  width: 80%;
  min-width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  border: 1px solid $border-light-color;
  .topPanel {
    width: 100%;
    border-bottom: 1px solid $border-light-color;
  }
  .edit-title {
    position: relative;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid $border-light-color;
  }
  .modal-item {
    margin: 10px;
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
    margin: 50px 0;
    button {
      margin:  0 20px;
    }
  }
}
</style>

