<template>
  <div class="app-container productList">
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
          <el-form-item :label="$t('product.product.productCode')">
            <el-input v-model.trim="postData.productCode" clearable :placeholder="$t('product.product.productCode')" style="width: 200px" />
          </el-form-item>
        </div>
        <el-form-item v-if="isZh" :label="$t('product.product.productName')">
          <el-input v-model.trim="postData.cnProductName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item v-else :label="$t('product.product.productName')">
          <el-input v-model.trim="postData.enProductName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.productType" clearable :placeholder="$t('common.status')" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchModal">{{$t('common.search')}}</el-button>
          <el-button type="primary" class="export" @click="hightSearchModal">{{$t('common.bigSearch')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addModal"><!--新增-->{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteModal"><!--删除-->{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('product.categoryTemplate.category')" prop="catalogBName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCatalogBName : scope.row.enCatalogBName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('product.product.productCode')" prop="productCode" show-overflow-tooltip/>

      <el-table-column :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnProductName : scope.row.enProductName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.table.updateBy')" align="center" width="100px" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column :label="$t('common.table.updateTime')" align="center" width="160px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="productType"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.productType === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.productType === 1 ? $t('consult.classify.active') : $t('consult.classify.inactive') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="200" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="goDetail(row.bid, 'detail')"><!--详情-->{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="goDetail(row.bid, 'edit')"><!--编辑-->{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.productType === 1 ? 'info' : 'danger'" size="mini" @click="changeMethod(row)">
            {{row.productType === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    <!-- 高级搜索 -->
    <!--<el-dialog :visible.sync="hightSearch" title="高级搜索" center class="menuDialog" width="700px" @closed="clearData">-->
        <!--<el-form label-width="70px" label-position="left" :model="seniorForm" ref="seniorForm">-->
        <!--<div class="topBtns">-->
          <!--<el-button type="primary" size="mini" style="margin-left: 50px" @click="addCategorySale">{{$t('common.add')}}</el-button>-->
        <!--</div>-->
          <!--<el-form-item label-width="0">-->
            <!--<el-table-->
              <!--:data="categorySaleList"-->
              <!--size="small">-->
              <!--<el-table-column align="left" label="性质" width="170">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-select v-model="scope.row.key" style="width: 147px">-->
                    <!--<el-option value="product_code" label="产品代码">产品代码</el-option>-->
                    <!--<el-option value="cn_product_name" label="产品名称">产品名称</el-option>-->
                    <!--<el-option value="cn_catalog_b_name" label="类别">类别</el-option>-->
                  <!--</el-select>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column align="left" label="方法" width="170">-->
                <!--<template slot-scope="scope">-->
                  <!--&lt;!&ndash;<el-input v-model="scope.row.enAttributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.salesAttributeName')" />&ndash;&gt;-->
                  <!--<el-select v-model="scope.row.op" style="width: 147px">-->
                    <!--<el-option value="query" label="查询">查询</el-option>-->
                  <!--</el-select>-->
                <!--</template>-->
              <!--</el-table-column>-->

              <!--<el-table-column align="left" label="值" width="170">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-input v-model="scope.row.value" style="width: 147px" clearable size="small" />-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column align="left" :label="$t('common.table.actions')">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-button type="primary" size="mini" @click="removeCategorySale(categorySaleList, scope.$index, scope.row)">{{$t('common.delete')}}</el-button>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</el-form-item>-->
          <!--<el-form-item label-width="10px">-->
            <!--<el-select v-model="seniorForm.searchTimeList.key" style="width:147px;margin-right: 20px;">-->
              <!--<el-option value="update_time" label="修改时间">修改时间</el-option>-->
            <!--</el-select>-->
            <!--<el-select v-model="seniorForm.searchTimeList.op" style="width:145px;margin-right: 20px;">-->
              <!--<el-option value="lt" label="<"></el-option>-->
              <!--<el-option value="gt" label=">"></el-option>-->
              <!--<el-option value="eq" label="="></el-option>-->
            <!--</el-select>-->
            <!--<el-date-picker-->
              <!--style="width:147px"-->
              <!--v-model="seniorForm.searchTimeList.value"-->
              <!--type="date"-->
              <!--:placeholder="$t('member.activity.selectDate')">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
        <!--<el-form-item label="排序" style="margin-top: 20px;">-->
          <!--<el-select style="width: 147px;margin-right: 20px;" v-model="seniorForm.orderField">-->
            <!--<el-option :value="'update_time'" label="修改时间">修改时间</el-option>-->
          <!--</el-select>-->
          <!--<el-select style="width: 147px" v-model="seniorForm.orderType">-->
            <!--<el-option :value="'ASC'" label="ASC">ASC</el-option>-->
            <!--<el-option :value="'DESC'" label="DESC">DESC</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item class="topBtns">-->
          <!--<el-button type="primary" class="export" @click="seniorSearchModal">{{$t('common.search')}}</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="结果">-->
          <!--<el-checkbox-group v-model="seniorForm.checkBox">-->
            <!--<el-checkbox :label="1">分类</el-checkbox>-->
            <!--<el-checkbox :label="2">商品编码</el-checkbox>-->
            <!--<el-checkbox :label="3">商品名称</el-checkbox>-->
            <!--<el-checkbox :label="4">修改时间</el-checkbox>-->
          <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
          <!--<div class="topBtns">-->
            <!--<el-button type="primary" size="small" class="export" >{{$t('system.role.export')}}</el-button>-->
          <!--</div>-->
        <!--<el-table-->
          <!--border-->
          <!--:data="hightSearchList"-->
          <!--fit-->
          <!--size="small"-->
          <!--:header-cell-style="{background: '#a7bfee'}">-->
          <!--<el-table-column-->
            <!--align="center"-->
            <!--type="selection"-->
            <!--width="55">-->
          <!--</el-table-column>-->
          <!--<el-table-column v-if="seniorForm.checkBox.includes(1)" align="center" :prop="isZh?'cnCatalogBName':'enCatalogBName'" show-overflow-tooltip label="分类"></el-table-column>-->
          <!--<el-table-column v-if="seniorForm.checkBox.includes(2)" align="center" prop="productCode" show-overflow-tooltip label="商品编码"></el-table-column>-->
          <!--<el-table-column v-if="seniorForm.checkBox.includes(3)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="商品名称"></el-table-column>-->
          <!--<el-table-column v-if="seniorForm.checkBox.includes(4)" align="center" prop="updateTime" show-overflow-tooltip label="修改时间">-->
            <!--<template slot-scope="{row}">-->
              <!--{{row.updateTime | timeFmt}}-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
          <!--<Pagination :total="seniorForm.total" :page.sync="seniorForm.pageNum" :limit.sync="seniorForm.pageSize" @pagination="seniorSearchModal"></Pagination>-->
      <!--</el-form>-->
    <!--</el-dialog>-->

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import {
  getPublicCategory,
  getProductList,
  deleteProduct,
  exportExcelProductList,
  updateProductTypeByIds
  // pageByAdvanceQueryForm
} from '@/api/product'
// import ElPager from "element-ui/packages/pagination/src/pager";
export default {
  components: {
    // ElPager,
    Pagination
  },
  data() {
    return {
      categorySaleList: [{ op: '', value: '', key: '' }],
      listLoading: true,
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        cnProductName: '',
        enProductName: '',
        productCode: '',
        specNo: ''
      },
      seniorForm: {
        checkBox: [1, 2],
        orderField: '',
        orderType: '',
        searchTimeList: {
          key: '',
          op: '',
          value: ''
        },
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      hightSearchList: [],
      hightSearch: false,
      isShowDate: false,
      parentsName: [],
      selectList: [],
      statusList: [
        {
          labelZh: '全部',
          label: 'All',
          inquiryStatus: ''
        },
        {
          label: 'Enabled',
          labelZh: '使用中',
          inquiryStatus: 1
        },
        {
          label: 'Disabled',
          labelZh: '已禁用',
          inquiryStatus: 0
        }
      ],
      searchDataList: [],
      dataList: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList()
  },
  methods: {
    hightSearchModal() {
      this.$router.push({
        path: '/product/advancedSearch'
      })
    },
    // clearData() {
    //   this.seniorForm.orderType = "";
    //   this.seniorForm.orderField = "";
    //   this.seniorForm.searchTimeList.key = "";
    //   this.seniorForm.searchTimeList.op = "";
    //   this.seniorForm.searchTimeList.value = "";
    //   this.categorySaleList = [{
    //     key: '',
    //     op: '',
    //     value: ''
    //   }]
    // },
    // seniorSearchModal() {
    //   let arr = [];
    //   arr = this.categorySaleList.map(e => {
    //     return { ...e }
    //   });
    //   arr.push(this.seniorForm.searchTimeList);
    //   this.seniorForm.advanceQueryList = arr;
    //   pageByAdvanceQueryForm(this.seniorForm).then(res => {
    //     console.log(res)
    //     this.hightSearchList = res.data.list
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   })
    // },
    // addCategorySale() {
    //   this.categorySaleList.push({ op: '', value: '', key: '' })
    // },
    // removeCategorySale(arr, index, item) {
    //   if (this.categorySaleList.length <= 1) {
    //     return this.$message.warning(this.$t('product.tip.leastOneSalesTip'));
    //   } else {
    //     arr.splice(index, 1)
    //   }
    // },
    changeMethod(row) {
      updateProductTypeByIds({
        ids: row.id,
        productType: row.productType === 1 ? 0 : 1
      }).then(res => {
        if (res.status === 200) {
          this.getDataList();
          this.$message.success(this.$t("system.userManage.handle"))
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    addModal() {
      this.$router.push({
        path: '/product/addProduct'
      })
    },
    goDetail(id, type) {
      let path = '';
      if (type === 'edit') {
        // path = '/product/editProduct'
        path = '/product/addProduct'
      } else {
        path = '/product/detailProduct'
      }
      this.$router.push({
        path,
        query: {
          id: id
        }
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    searchModal() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getProductList(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelProductList(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '产品详情管理列表.xlsx')
        } else {
          link.setAttribute('download', 'Product details management list.xlsx')
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteModal() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('common.tip.deleteDataTip'))
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
          bids: this.selectList.map(e => e.bid).join(','),
          delFlag: 1
        };
        deleteProduct(obj).then(res => {
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
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
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
