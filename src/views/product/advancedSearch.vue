<template>
  <div class="app-container productList">
    <el-form label-width="70px" label-position="left" :model="seniorForm" ref="seniorForm">
      <div class="topBtns">
        <el-button
          type="primary"
          size="small"
          @click="addCategorySale"
        >{{$t('common.add')}}</el-button>
      </div>
      <el-form-item label-width="0">
        <el-table :data="categorySaleList" size="small">
          <el-table-column align="left" :label="$t('product.search.nature')" width="300">
            <template slot-scope="scope">
              <el-select v-model="scope.row.key" clearable style="width:200px" @change="Prohibit">
                <el-option v-for="(item, index) in queryAttribute" :disabled="selectKey.includes(item.value)" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('product.search.means')" width="300">
            <template slot-scope="scope">
              <el-select v-model="scope.row.op" clearable style="width:200px">
                <el-option value="query" :label="isZh?'查询':'Query'"></el-option>
                <!--<el-option value="1" :label="isZh?'支持定制':'Support customization'"></el-option>-->
                <!--<el-option value="2" :label="isZh?'不支持定制':'Customization not supported'"></el-option>-->
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="left" :label="$t('product.search.value')" width="300">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" style="width:200px" clearable size="small" />
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('common.table.actions')">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="removeCategorySale(categorySaleList, scope.$index, scope.row)"
              >{{$t('common.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="10px">
        <el-select v-model="seniorForm.searchTimeList.key" clearable style="width:200px;margin-right: 96px;">
          <el-option value="update_time" :label="$t('system.userManage.editTime')"></el-option>
          <el-option value="create_time" :label="$t('product.search.releaseTime')"></el-option>
        </el-select>
        <el-select v-model="seniorForm.searchTimeList.op" clearable style="width:200px;margin-right: 96px;">
          <el-option value="lt" label="<"></el-option>
          <el-option value="gt" label=">"></el-option>
          <el-option value="eq" label="="></el-option>
        </el-select>
        <el-date-picker
          style="width:200px"
          v-model="seniorForm.searchTimeList.value"
          type="date"
          :placeholder="$t('member.activity.selectDate')"
        ></el-date-picker>
      </el-form-item>
        <el-form-item :label="$t('product.search.sequence')"></el-form-item>
        <el-form-item label-width="10px" style="margin-top: 20px;">
        <el-select style="width: 200px;margin-right: 60px;" clearable v-model="seniorForm.orderField" v-if="isZh">
          <el-option v-for="(item, index) in queryAttribute" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
        </el-select>
        <el-select style="width: 200px;margin-left: 40px;" clearable v-model="seniorForm.orderType">
          <el-option :value="'ASC'" label="ASC">ASC</el-option>
          <el-option :value="'DESC'" label="DESC">DESC</el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="topBtns">
        <el-button type="primary" class="export" @click="seniorSearchModal">{{$t('common.search')}}</el-button>
      </el-form-item>
      <el-form-item :label="$t('product.search.ResultHeader')" label-width="100px">
        <el-checkbox-group v-model="seniorForm.checkBox">
          <el-checkbox v-for="(item, index) in headers" :label="item.id" :key="index">{{isZh?item.label:item.labelEn}}</el-checkbox>
          <!--<el-checkbox :label="1">{{$t('product.category.name')}}</el-checkbox>-->
          <!--<el-checkbox :label="2">{{$t('product.search.productCode')}}</el-checkbox>-->
          <!--<el-checkbox :label="3">{{$t('product.search.productName')}}</el-checkbox>-->
          <!--<el-checkbox :label="4">{{$t('system.userManage.editTime')}}</el-checkbox>-->
          <!--<el-checkbox :label="5">模板编码</el-checkbox>-->
          <!--<el-checkbox :label="6">模板名称</el-checkbox>-->
          <!--<el-checkbox :label="7">{{$t('product.search.customsCode')}}</el-checkbox>-->
          <!--<el-checkbox :label="8">{{$t('product.search.headline')}}</el-checkbox>-->
          <!--<el-checkbox :label="9">产地</el-checkbox>-->
          <!--<el-checkbox :label="9">{{$t('system.role.modifier')}}</el-checkbox>-->
          <!--<el-checkbox :label="23">{{$t('product.search.singlepackage')}}</el-checkbox>-->
          <!--<el-checkbox :label="10">商品状态</el-checkbox>-->
          <!--<el-checkbox :label="11">{{$t('product.search.releaseTime')}}</el-checkbox>-->
          <!--<el-checkbox :label="12">{{$t('product.search.customize')}}</el-checkbox>-->
          <!--<el-checkbox :label="13">{{$t('product.search.productUnit')}}</el-checkbox>-->
          <!--<el-checkbox :label="14">{{$t('product.search.singleBulk')}}</el-checkbox>-->
          <!--<el-checkbox :label="15">{{$t('product.search.bulkUnit')}}</el-checkbox>-->
          <!--<el-checkbox :label="16">{{$t('product.search.singleWeight')}}</el-checkbox>-->
          <!--<el-checkbox :label="17">{{$t('product.search.weightUnit')}}</el-checkbox>-->
          <!--<el-checkbox :label="18">Link</el-checkbox>-->
          <!--<el-checkbox :label="19">PC文字描述</el-checkbox>-->
          <!--<el-checkbox :label="20">APP文字描述</el-checkbox>-->
        </el-checkbox-group>
      </el-form-item>
      <div class="topBtns">
        <el-button type="primary" size="small" class="export" @click="exportSku">{{$t('system.role.export')}}</el-button>
      </div>
      <el-table
        border
        :data="hightSearchList"
        fit
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column v-if="seniorForm.checkBox.includes(1)" align="center" :prop="isZh?'cnCatalogBName':'enCatalogBName'" show-overflow-tooltip :label="$t('product.category.name')"></el-table-column>
        <el-table-column v-if="seniorForm.checkBox.includes(2)" align="center" prop="productCode" show-overflow-tooltip :label="$t('product.search.productCode')"></el-table-column>
        <el-table-column v-if="seniorForm.checkBox.includes(3)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip :label="$t('product.search.productName')"></el-table-column>
        <!--<el-table-column v-if="seniorForm.checkBox.includes(5)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="模板编码"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(6)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="模板名称"></el-table-column>-->
        <el-table-column v-if="seniorForm.checkBox.includes(7)" align="center" prop="customsCode" show-overflow-tooltip :label="$t('product.search.customsCode')"></el-table-column>
        <el-table-column v-if="seniorForm.checkBox.includes(8)" align="center" :prop="isZh?'cnProductHeadline':'enProductHeadline'" show-overflow-tooltip :label="$t('product.search.headline')"></el-table-column>
        <!--<el-table-column v-if="seniorForm.checkBox.includes(9)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="产地"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(10)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="商品状态"></el-table-column>-->
        <el-table-column v-if="seniorForm.checkBox.includes(10)" align="center" prop="createTime" show-overflow-tooltip :label="$t('product.search.releaseTime')">
          <template slot-scope="{row}">{{row.createTime | timeFmt}}</template>
        </el-table-column>
        <el-table-column v-if="seniorForm.checkBox.includes(9)" align="center" prop="updateTime" show-overflow-tooltip :label="$t('system.userManage.editTime')">
          <template slot-scope="{row}">{{row.updateTime | timeFmt}}</template>
        </el-table-column>
        <el-table-column v-if="seniorForm.checkBox.includes(11)" align="center" prop="updateUserId" show-overflow-tooltip :label="$t('system.role.modifier')"></el-table-column>
        <!--<el-table-column v-if="seniorForm.checkBox.includes(23)" align="center" prop="singlePackage" show-overflow-tooltip :label="$t('product.search.singlepackage')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(12)" align="center" prop="isCustomize" show-overflow-tooltip :label="$t('product.search.customize')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(13)" align="center" prop="productUnit" show-overflow-tooltip :label="$t('product.search.productUnit')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(14)" align="center" prop="singleBulk" show-overflow-tooltip :label="$t('product.search.singleBulk')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(15)" align="center" prop="bulkUnit" show-overflow-tooltip :label="$t('product.search.bulkUnit')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(16)" align="center" prop="singleWeight" show-overflow-tooltip :label="$t('product.search.singleWeight')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(17)" align="center" prop="weightUnit" show-overflow-tooltip :label="$t('product.search.weightUnit')"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(18)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="Link"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(19)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="PC文字描述"></el-table-column>-->
        <!--<el-table-column v-if="seniorForm.checkBox.includes(20)" align="center" :prop="isZh?'cnProductName':'enProductName'" show-overflow-tooltip label="APP文字描述"></el-table-column>-->
      </el-table>
      <Pagination :total="seniorForm.total" :page.sync="seniorForm.pageNum" :limit.sync="seniorForm.pageSize" @pagination="seniorSearchModal"></Pagination>
    </el-form>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils/index";
import {
  pageByAdvanceQueryForm,
  exportExcelByAdvanceQueryForm
} from "@/api/product";
export default {
  components: {
    // ElPager,
    Pagination
  },
  data() {
    return {
      categorySaleList: [{ op: "", value: "", key: "" }],
      seniorForm: {
        checkBox: [1, 2, 3, 4, 9],
        orderField: "",
        orderType: "",
        searchTimeList: {
          key: "",
          op: "",
          value: ""
        },
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      queryAttribute: [
        {
          label: '商品名称',
          value: 'product_name',
          labelEn: 'product Name',
          id: 3
        },
        {
          label: '商品编码',
          value: 'product_code',
          labelEn: 'product Code',
          id: 2
        },
        {
          label: '类目名称',
          value: 'en_catalog_b_name',
          labelEn: 'Category Name',
          id: 1
        },
        // {
        //   label: '是否支持定制',
        //   value: 'is_customize',
        //   labelEn: 'is Customize'
        // },
        {
          label: '推广标题',
          value: 'en_product_headline',
          labelEn: 'product Headline',
          id: 8
        },
        {
          label: '海关编码',
          value: 'customs_code',
          labelEn: 'customs Code',
          id: 7
        },
        {
          label: '修改人',
          value: 'update_user_id',
          labelEn: 'modifier',
          id: 22
        }
        // {
        //   label: '产品单位',
        //   value: 'product_unit',
        //   labelEn: 'product Unit',
        //   id: 13
        // },
        // {
        //   label: '单件体积',
        //   value: 'single_bulk',
        //   labelEn: 'single Bulk',
        //   id: 14
        // },
        // {
        //   label: '体积单位',
        //   value: 'bulk_unit',
        //   labelEn: 'bulk Unit',
        //   id: 15
        // },
        // {
        //   label: '单包装数量',
        //   value: 'single_package',
        //   labelEn: 'single Package',
        //   id: 23
        // },
        // {
        //   label: '包裹重量',
        //   value: 'single_weight',
        //   labelEn: 'single Weight',
        //   id: 16
        // },
        // {
        //   label: '重量单位',
        //   value: 'weight_unit',
        //   labelEn: 'weight Unit',
        //   id: 17
        // }
      ],
      headers: [
        {
          label: '商品名称',
          value: 'enProductName',
          labelEn: 'product Name',
          id: 3
        },
        {
          label: '商品编码',
          value: 'productCode',
          labelEn: 'product Code',
          id: 2
        },
        {
          label: '类目名称',
          value: 'enCatalogBName',
          labelEn: 'Category Name',
          id: 1
        },
        {
          label: '海关编码',
          value: 'customsCode',
          labelEn: 'customs Code',
          id: 7
        },
        {
          label: '推广标题',
          value: 'enProductHeadline',
          labelEn: 'product Headline',
          id: 8
        },
        {
          label: '创建时间',
          value: 'createTime',
          labelEn: 'create Time',
          id: 11
        },
        {
          label: '修改时间',
          value: 'updateTime',
          labelEn: 'Modified Time',
          id: 9
        },
        {
          label: '修改人',
          value: 'updateUserId',
          labelEn: 'modifier',
          id: 10
        }
      ],
      hightSearchList: [],
      searchDataList: [],
      dataList: [],
      selectKey: []
    };
  },
  watch: {
    isZh(val) {
      this.queryAttribute.forEach(e => {
        if (e.label === '商品名称') {
          e.value = val ? 'cn_product_name' : 'en_product_name'
        }
        if (e.label === '类目名称') {
          e.value = val ? 'cn_catalog_b_name' : 'en_catalog_b_name'
        }
        if (e.label === '推广标题') {
          e.value = val ? 'cn_product_headline' : 'en_product_headline'
        }
      });
      this.headers.forEach(e => {
        if (e.label === '商品名称') {
          e.value = val ? 'cnProductName' : 'enProductName'
        }
        if (e.label === '类目名称') {
          e.value = val ? 'enCatalogBName' : 'enCatalogBName'
        }
        if (e.label === '推广标题') {
          e.value = val ? 'cnProductHeadline' : 'enProductHeadline'
        }
      })
    }
  },
  created() {
    // this.seniorSearchModal()
  },
  methods: {
    clearData() {
      this.seniorForm.orderType = "";
      this.seniorForm.orderField = "";
      this.seniorForm.searchTimeList.key = "";
      this.seniorForm.searchTimeList.op = "";
      this.seniorForm.searchTimeList.value = "";
      this.categorySaleList = [
        {
          key: "",
          op: "",
          value: ""
        }
      ];
    },
    exportSku() {
      let arr = [];
      let tableHeaders = [];
      arr = this.categorySaleList.map(e => {
        return { ...e };
      });
      tableHeaders = this.headers.filter(e => {
        return this.seniorForm.checkBox.includes(e.id)
      });
      if (!tableHeaders.length) return;
      arr.push(this.seniorForm.searchTimeList);
      this.seniorForm.advanceQueryList = arr;
      this.seniorForm.fields = tableHeaders.map(e => e.value);
      this.seniorForm.headers = tableHeaders.map(e => {
        if (this.isZh) {
          return e.label
        } else {
          return e.labelEn
        }
      });
      exportExcelByAdvanceQueryForm(this.seniorForm).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        if (this.isZh) {
          link.setAttribute('download', '产品列表.xls')
        } else {
          link.setAttribute('download', 'Product list.xls')
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    seniorSearchModal() {
      let arr = [];
      arr = this.categorySaleList.map(e => {
        return { ...e };
      });
      arr.push(this.seniorForm.searchTimeList);
      this.seniorForm.advanceQueryList = arr;
      pageByAdvanceQueryForm(this.seniorForm)
        .then(res => {
          this.hightSearchList = res.data.list;
          this.seniorForm.total = res.data.total
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    Prohibit(val) {
      this.selectKey = this.categorySaleList.filter(e => e.key).map(e => e.key);
    },
    addCategorySale() {
      this.categorySaleList.push({ op: "", value: "", key: "" });
    },
    removeCategorySale(arr, index, item) {
      if (this.categorySaleList.length <= 1) {
        return this.$message.warning(this.language === 'zh' ? '最少保留一条搜索条件' : 'Keep at least one search term');
      } else {
        arr.splice(index, 1);
      }
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val);
      }
    }
  }
};
</script>
