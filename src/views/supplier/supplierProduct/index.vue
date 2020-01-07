<template>
  <div class="app-container supplierProduct">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('supplier.product.supplier')">
            <el-input v-model.trim="postData.supplierName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('supplier.product.productCategory')">
            <el-cascader
              :key="isZh"
              style="width: 200px"
              v-model="parentsName"
              :options="searchDataList"
              :props="{value: 'bid', label: isZh ? 'cnCatalogName' : 'enCatalogName', children: 'children'}"
              filterable
              clearable
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('supplier.product.productName')">
            <el-input v-model.trim="postData.productName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="SKU">
            <el-input v-model.trim="postData.attrValueList" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="delSupplierProduct()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getDataSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('supplier.product.supplierName')" prop="supplierName" show-overflow-tooltip/>

      <el-table-column :label="$t('supplier.product.productCategory')" prop="catalogBName" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('supplier.product.productName')" prop="productName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>

      <el-table-column label="SKU" prop="attrValueList" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('supplier.category.modifier')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('supplier.category.modifiedTime')">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="labelStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.priceStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.priceStatus === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :type="scope.row.priceStatus === 1 ? 'info' : 'primary'" size="mini" @click="changeStatus(scope.row)">
            {{scope.row.priceStatus === 1 ? $t('supplier.product.stopPurchasing') : $t('supplier.product.startPurchasing')}}</el-button>
          <!--<el-button type="danger" v-if="scope.row.priceStatus !== 1" size="mini" @click="delSupplierProduct(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="editVisible" :title="$t('supplier.product.addProduct')" center class="menuDialog" width="840px">
      <el-form :model="dialogForm" label-width="110px" label-position="right" inline size="small" >
        <el-form-item :label="$t('supplier.product.productCode')">
          <el-input v-model="dialogForm.productCode" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item :label="$t('supplier.product.productName')">
          <el-input v-model="dialogForm.productName" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSkuList">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0">
        {{$t('supplier.product.productSKU')}}
        <el-table
          :data="productSkuList"
          border
          fit
          size="small"
          style="margin-top: 10px"
          :header-cell-style="{background: '#a7bfee'}"
          @selection-change="getSelect">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column align="center" :label="$t('supplier.product.productCode')" prop="productCode" show-overflow-tooltip/>

          <el-table-column align="center" :label="$t('supplier.product.productName')" prop="productName" show-overflow-tooltip>
            <template slot-scope="scope">
              {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="SKU" prop="attrValueList" show-overflow-tooltip>
            <template slot-scope="scope">
              {{isZh ? scope.row.cnAttrValueList : scope.row.enAttrValueList}}
            </template>
          </el-table-column>
        </el-table>
        <div style="border-top: 1px dashed #F4F4F4;">
          <el-form :model="addForm" label-width="110px" label-position="right" size="small" style="margin: 10px 0">
            <el-form-item :model="addForm" label-width="110px" label-position="right" :label="$t('system.role.status')" size="small" style="margin: 10px 0">
              {{$t('common.table.inUse')}}
            </el-form-item>
            <el-form-item :label="$t('supplier.product.supplier')">
              <el-select v-model="addForm.supplierBId" clearable filterable style="width: 240px">
                <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <Pagination :total="dialogForm.total" :page.sync="dialogForm.pageNum" :limit.sync="dialogForm.pageSize" @pagination="getProductSkuList" ></Pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory, getProductSkuList } from '@/api/product'
import { getSupplierProductList, addSupplierProduct, updateSupplierProduct, delSupplierProduct, getSupplierList, exportExcelSupplierProductSkuList } from '@/api/supplier';
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      saveLoading: false,
      editVisible: false,
      detailVisible: false,
      selectList: [],
      parentsName: [],
      searchDataList: [],
      productSkuList: [],
      supplierList: [],
      selectDataList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        catalogBId: '',
        attrValueList: '',
        productName: ''
      },
      dataList: [],
      dialogForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: ''
      },
      addForm: {
        supplierBId: '',
        priceStatus: 1
      }
    }
  },
  created() {
    this.getDataList();
    this.getAllSupplierList();
    this.getAllDataList();
  },
  methods: {
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    searchProductSkuList() {
      this.dialogForm.pageNum = 1;
      this.getProductSkuList();
    },
    getProductSkuList() {
      let obj = {};
      for (let key in this.dialogForm) {
        if (this.dialogForm[key]) {
          obj[key] = this.dialogForm[key]
        }
      }
      getProductSkuList(obj).then(res => {
        this.productSkuList = res.data.list || [];
        this.dialogForm.total = res.data.total;
      })
    },
    getAllSupplierList() {
      getSupplierList().then(res => {
        this.supplierList = res.data;
      })
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelSupplierProductSkuList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'SupplierList.xlsx');
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getSupplierProductList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    openEdit() {
      this.dialogForm.pageNum = 1;
      this.dialogForm.productName = '';
      this.dialogForm.productCode = '';
      this.addForm.supplierBId = '';
      this.getProductSkuList();
      this.editVisible = true;
    },
    // 单选
    getSelect(selects) {
      this.selectList = selects;
    },
    getDataSelect(selects) {
      this.selectDataList = selects;
    },
    delSupplierProduct() {
      let obj = {};
      if (!this.selectDataList.length) {
        return this.$message.error(this.$t("system.userManage.option"))
      } else {
        for (let i = 0; i < this.selectDataList.length; i++) {
          if (this.selectDataList[i].priceStatus === 1) {
            return this.$message.error(this.$t('supplier.category.noDeletes'))
          }
        }
        obj = { ids: this.selectDataList.map(e => e.id).join(',') }
      }
      this.$confirm(this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"), {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: 'warning',
          center: true
        }).then(() => {
        delSupplierProduct(obj).then(res => {
          this.postData.pageNum = 1;
          this.getDataList();
          this.$message.success(this.$t('customer.category.operationSuccessful'))
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
    changeStatus(row) {
      let obj = {
        id: row.id,
        priceStatus: row.priceStatus === 1 ? 2 : 1
      };
      updateSupplierProduct(obj).then(res => {
        this.getDataList();
        this.$message.success(this.$t('customer.category.operationSuccessful'));
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    clearForm() {
      this.dialogForm.productCode = '';
      this.dialogForm.productName = '';
      this.productSkuList = [];
      this.addForm.supplierBId = '';
    },
    confirmAdd() {
      if (!this.selectList.length) {
        return this.$message.error(this.$t('supplier.product.selectSKU'))
      }
      if (!this.addForm.supplierBId) {
        return this.$message.error(this.$t('supplier.product.selectSupplier'))
      }
      this.saveLoading = true;
      this.addForm.productSkuList = this.selectList;
      addSupplierProduct(this.addForm).then(res => {
        if (res.status === 200) {
          this.$message(this.$t('common.tip.saveTip'))
        }
        this.editVisible = false;
        this.saveLoading = false;
        this.getDataList();
        this.clearForm();
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message);
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
  .supplierProduct {
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
    .menuDialog {
      .el-dialog {
        width: 700px;
      }
    }
  }
</style>
