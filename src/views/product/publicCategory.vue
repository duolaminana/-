<template>
  <div class="app-container category">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '100px'" inline size="small">
          <el-form-item :label="$t('product.category.name')">
            <el-input v-if="isZh" v-model.trim="postData.cnCatalogName" clearable :placeholder="$t('product.category.nameZh')" style="width: 200px" />
            <el-input v-else v-model.trim="postData.enCatalogName" clearable :placeholder="$t('product.category.name')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('product.category.code')">
            <el-input v-if="isZh" v-model.trim="postData.catalogCode" clearable :placeholder="$t('product.category.code')" style="width: 200px" />
            <el-input v-else v-model.trim="postData.catalogCode" clearable placeholder="Catalog Code" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.catalogStatus" :placeholder="$t('common.status')" style="width: 150px">
              <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchDataList">{{$t('common.search')}}</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openSequenceCategory">{{$t('common.sort')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteCategory">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      row-key="id"
      :indent="indent"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
      @select="setChildSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('product.category.name')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{language === 'zh' ? scope.row.cnCatalogName : scope.row.enCatalogName}}
        </template>
      </el-table-column>

      <el-table-column width="120px" :label="$t('product.category.code')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.catalogCode}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="110px" :label="$t('product.category.projectName')" prop="productNumber" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.productNumber}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="110px" :label="$t('common.table.updateTime')" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="90" :label="$t('common.status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.catalogStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.catalogStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.catalogStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.catalogStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>-->

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('product.category.addCategory'):$t('product.category.editCategory')"
               center width="500px" @closed="clearData">
      <el-form ref="category" :model="formLine" v-if="dialogVisible" label-width="150px" label-position="left" size="small" :rules="formLineRules">
        <el-form-item :label="$t('product.category.parentCategory')" prop="parentsName">
          <el-cascader
            :key="isZh"
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="categoryList"
            :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('product.category.search')"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.category.code')" prop="catalogCode">
          <el-input v-model="formLine.catalogCode" maxlength="20" clearable :placeholder="$t('product.category.code')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.nameEn')" prop="enCatalogName">
          <el-input v-model="formLine.enCatalogName" clearable maxlength="20" :placeholder="$t('product.category.nameEn')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.nameZh')" prop="cnCatalogName">
          <el-input v-model="formLine.cnCatalogName" clearable maxlength="20" :placeholder="$t('product.category.nameZh')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.img')" prop="catalogImgUrl">
          <div class="avatar">
            <el-upload
              class="avatar-uploader"
              :headers="upLoadHeaders"
              :action="uploadActionUrl"
              :data="{type: 1}"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload">
              <img v-if="formLine.catalogImgUrl" :src="fullUrl(formLine.catalogImgUrl)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div style="font-size: 10px;text-align: center;color: red;padding-bottom: 5px;line-height: 1.25rem">{{$t('product.category.tips')}}</div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status" style="margin-top: 40px">
          {{ formLine.catalogStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('category')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('product.category.categoryDetail')" center width="500px">
      <el-form ref="category" :model="formLine1" label-width="150px" label-position="left" size="small" :rules="formLineRules" @closed="clearData">
        <el-form-item :label="$t('product.category.parentCategory')" prop="parentsName">
          <el-cascader
            :key="isZh"
            class="form-dialog-width"
            v-model="formLine1.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
            disabled
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.category.code')" prop="catalogCode">
          <el-input v-model="formLine1.catalogCode" readonly :placeholder="$t('product.category.code')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.nameEn')" prop="enCatalogName">
          <el-input v-model="formLine1.enCatalogName" readonly class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.nameZh')" prop="cnCatalogName">
          <el-input v-model="formLine1.cnCatalogName" readonly class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.img')">
            <img :src="fullUrl(formLine1.catalogImgUrl)" class="avatar">
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          {{ formLine1.catalogStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="sortVisible" :title="$t('product.category.sortTitle')" width="500px" center :close-on-click-modal="false" @close="closeSortDialog">
      <div style="height: 400px;overflow: auto">
        <el-tree
          :key="isZh"
          ref="tree"
          v-if="sortVisible"
          :data="sortDataList"
          node-key="id"
          :props="{label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
          :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveFirst(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveOne(node, data, 1)">
            <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveOne(node, data, -1)">
            <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveLast(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
          </el-button>
        </span>
      </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeSortDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { uploadActionUrl } from '@/api/common'
import {
  getPublicCategory,
  addPublicCategory,
  deletePublicCategory,
  changePublicCategory,
  catalogSortMove,
  catalogSortMoveMost,
  exportExcelProductCatalogList
} from '@/api/product'
import { parseTime, deepClone } from '@/utils/index'
export default {
  components: {
    // Pagination
  },
  data() {
    return {
      uploadActionUrl,
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      canClick: false,
      dialogType: '',
      indent: 20,
      selectList: [],
      sortDataList: [],
      categoryList: [],
      sortVisible: false,
      formLine: {
        parentsName: [],
        parentBId: '',
        enCatalogName: '',
        cnCatalogName: '',
        catalogCode: '',
        catalogStatus: 1,
        parentBIds: '',
        catalogImgUrl: ''
      },
      formLine1: {
      },
      formLineRules: {
        enCatalogName: [
          { required: true, message: this.$t('product.tip.categoryEName'), trigger: 'blur' }
        ],
        cnCatalogName: [
          { required: true, message: this.$t('product.tip.categoryCName'), trigger: 'blur' }
        ],
        catalogCode: [
          { required: true, message: this.$t('product.tip.categoryCode'), trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 9999,
        total: 0,
        catalogStatus: ''
      },
      statusList: [
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          label: 'Active',
          labelZh: '使用中',
          id: 1
        },
        {
          label: 'Disabled',
          labelZh: '禁用中',
          id: 2
        }
      ],
      dataList: [],
      cloneList: [],
      addDataList: []
    }
  },
  watch: {
    isZh() {
      this.formLineRules = {
        enCatalogName: [
          { required: true, message: this.$t('product.tip.categoryEName'), trigger: 'blur' }
        ],
        cnCatalogName: [
          { required: true, message: this.$t('product.tip.categoryCName'), trigger: 'blur' }
        ],
        catalogCode: [
          { required: true, message: this.$t('product.tip.categoryCode'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getAllDataList();
    this.getDataList();
  },
  methods: {
    clearData() {
      this.formLine.parentsName = [];
      this.formLine.enCatalogName = '';
      this.formLine.cnCatalogName = '';
      this.formLine.catalogCode = '';
      this.formLine.parentBId = '';
      this.formLine.catalogStatus = 1;
      this.formLine.parentBIds = '';
      this.formLine.catalogImgUrl = ''
    },
    filterSort(data, name, code, status) {
      let arr = [];
      let str = this.isZh ? 'cnCatalogName' : 'enCatalogName';
      data.forEach(e => {
        if (
          ((name !== '' && name !== undefined) ? e[str].indexOf(name) > -1 : true) &&
          ((code !== '' && code !== undefined) ? e.catalogCode.indexOf(code) > -1 : true) &&
          (status === '' ? true : e.catalogStatus === status)
        ) {
          arr.push(e)
        } else if (e.children && e.children.length) {
          let child = this.filterSort(e.children, name, code, status);
          let obj = {
            ...e,
            children: child
          };
          if (child && child.length) {
            arr.push(obj)
          }
        }
      });
      return arr
    },
    searchDataList() {
      let name = this.isZh ? this.postData.cnCatalogName : this.postData.enCatalogName;
      if ((this.postData.catalogCode !== '' && this.postData.catalogCode !== undefined) ||
        (name !== '' && name !== undefined) ||
        this.postData.catalogStatus !== '') {
        this.dataList = this.filterSort(this.cloneList, name, this.postData.catalogCode, this.postData.catalogStatus)
        console.log(this.cloneList, name, this.postData.catalogCode, this.postData.catalogStatus)
      } else {
        this.postData.pageNum = 1;
        this.getDataList();
      }
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getPublicCategory(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list;
        this.cloneList = deepClone(res.data.list);
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
        this.listLoading = false;
      })
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelProductCatalogList(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '产品类目管理列表.xlsx');
        } else {
          link.setAttribute('download', 'Product Catalog management list.xlsx');
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.addDataList = res.data.list;
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.formLine.parentBId = arr[arr.length - 1];
        this.formLine.parentBIds = arr.join(',')
      } else {
        this.formLine.parentBId = '';
        this.formLine.parentBIds = ''
      }
    },
    openDetail(row) {
      this.dialogVisible1 = true;
      this.formLine1 = deepClone(row);
      if (row.parentBIds) {
        this.formLine1.parentsName = this.formLine1.parentBIds.split(',').map(e => {
          return e;
        })
      } else {
        this.formLine1.parentsName = []
      }
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.formLine = deepClone(row);
        if (row.parentBIds) {
          this.formLine.parentsName = this.formLine.parentBIds.split(',').map(e => {
            return e;
          })
        } else {
          this.formLine.parentsName = []
        }
        let cloneArr = deepClone(this.addDataList);
        this.categoryList = this.setDisabledList(cloneArr, row.bid);
      } else {
        this.categoryList = deepClone(this.addDataList)
      }
      this.dialogVisible = true;
    },
    setDisabledList(arr, bId) {
      arr.forEach(e => {
        if (e.bid === bId) {
          e.disabled = true
        } else if (e.children && e.children.length) {
          this.setDisabledList(e.children, bId)
        } else if (e.children && !e.children.length) {
          e.children = null
        }
      });
      return arr
    },
    openSequenceCategory() {
      getPublicCategory({ pageSize: 9999, pageNum: 1 }).then(res => {
        this.sortDataList = JSON.parse(JSON.stringify(res.data.list));
        this.sortVisible = true;
      })
    },
    closeSortDialog() {
      this.searchDataList();
      this.sortVisible = false;
    },
    // 置顶
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning(this.$t('product.tip.topTip'));
      }
      this.canClick = true;
      catalogSortMoveMost({ id: data.id, type: 1 }).then(res => {
        let top = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.unshift(top);
      }).catch(err => {
        this.canClick = false;
        this.$message.error(err.message)
      })
    },
    // 移到尾部
    moveLast(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === arr.length - 1) {
        return this.$message.warning(this.$t('product.tip.bottomTip'));
      }
      this.canClick = true;
      catalogSortMoveMost({ id: data.id, type: 2 }).then(res => {
        let end = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.push(end);
      }).catch(err => {
        this.canClick = false;
        this.$message.error(err.message)
      })
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, data, move) {
      this.canClick = true;
      catalogSortMove({ id: data.id, type: move === 1 ? 1 : 2 }).then(res => {
        arr[curIndex] = deepClone(arr.splice(nextIndex, 1, arr[curIndex])[0]);
        this.canClick = false;
        return arr;
      }).catch(err => {
        this.$message.error(err.message);
        this.canClick = false;
        return arr;
      })
    },
    // 上下移动一格
    moveOne(node, data, move) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0 && move === 1) {
        return this.$message.warning(this.$t('product.tip.topTip'));
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning(this.$t('product.tip.bottomTip'));
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move, data, move);
      }
    },
    handleSuccess(res, file) {
      this.formLine.catalogImgUrl = res.data.filePath;
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error(this.$t('product.tip.imgTypeTip'));
      }
      if (!isLt1M) {
        this.$message.error(this.$t('product.tip.imgSizeLength'));
      }
      return isJPG && isLt1M;
    },
    confirmAdd(formName) {
      if (this.dialogType === 'add') {
        this.formLine.id = '';
        this.formLine.bid = '';
      }
      // if (!this.formLine.catalogImgUrl) {
      //   return this.$message.warning('请上传类目图片')
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          addPublicCategory(this.formLine).then(res => {
            if (res.data === 200) {
              this.$message.success(this.$t('common.tip.operation'));
              this.dialogVisible = false;
              this.postData.pageNum = 1;
              this.getDataList();
            } else if (res.data === 101) {
              this.$message.warning(this.$t('product.tip.existName'));
            } else if (res.data === 102) {
              this.$message.warning(this.$t('product.tip.existCode'));
            }
            this.getAllDataList();
            this.confirmLoading = false;
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning(this.$t('common.tip.notvalid'));
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        catalogStatus: row.catalogStatus === 1 ? 2 : 1
      };
      changePublicCategory(obj).then(res => {
        this.getDataList();
        this.$message.success(this.$t('common.tip.operation'));
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    deleteCategory() {
      if (this.selectList.length === 0) {
        return this.$message.warning(this.$t('common.tip.deleteDataTip'))
      }
      if (this.selectList.length !== 1) {
        return this.$message.warning(this.$t('product.tip.delOneData'))
      }
      let row = this.selectList[0];
      if (row.children && row.children.length) {
        return this.$message.error(this.$t('product.tip.haveCategory'));
      }
      if (row.catalogStatus === 1) {
        return this.$message.warning(this.$t('product.tip.dataIsUseTip'))
      }
      this.$confirm(this.$t('product.tip.deleteCategoryTip'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: row.id };
        deletePublicCategory(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t('common.tip.deleteTip'));
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: "error",
          message: this.$t("system.userManage.cancel")
        });
      })
    },
    getSelect(selects) {
      this.selectList = selects
    },
    setChildSelect(section, row) {
      if (section.indexOf(row) > -1) {
        this.setCheckTable([row], true)
      } else {
        this.setCheckTable([row], false)
      }
    },
    setCheckTable(arr = [], flag) {
      arr.forEach(e => {
        if (e.children && e.children.length) {
          e.children.forEach(e => {
            this.$refs.listTable.toggleRowSelection(e, flag);
          });
          this.setCheckTable(e.children, flag)
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
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .category {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .no-can-click {
      pointer-events: none;
      cursor: default;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 120px;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 130px;
      height: 130px;
      line-height: 130px;
      text-align: center;
    }

    .avatar {
      width: 130px;
      height: 130px;
      display: block;
    }
  }
</style>
