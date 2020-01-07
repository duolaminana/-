<template>
  <div class="app-container supplierCategory">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '120px'" inline size="small">
        <el-form-item :label="$t('supplier.category.categoryCode')">
          <el-input v-model.trim="postData.supplierSortCode" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('supplier.category.categoryName')">
          <el-input v-model.trim="postData.supplierSortName" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.supplierSortStatus" clearable style="width: 150px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openSortDialog">{{$t('member.level.sequence')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteCategory">{{$t('system.role.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      type="expand"
      border
      fit
      size="mini"
      row-key="bid"
      :indent="indent"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
      :default-sort="{prop: 'date'}"
      @select="setChildSelect">
      <el-table-column
      align="center"
      type="selection"
      width="55">
      </el-table-column>

      <el-table-column :label="$t('supplier.category.categoryName')" prop="supplierSortName" show-overflow-tooltip/>

      <el-table-column :label="$t('supplier.category.categoryCode')" prop="supplierSortCode" show-overflow-tooltip/>

      <el-table-column align="center" width="135" :label="$t('supplier.category.supplierNumber')" prop="sumNumber">
        <template slot-scope="scope">
          {{scope.row.sumNumber | sumNumberFmt }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('supplier.category.modifier')" prop="updateUserIdName" show-overflow-tooltip>
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.updateUserId }}-->
        <!--</template>-->
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('supplier.category.modifiedTime')" prop="updateTime" sortable>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.supplierSortStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.supplierSortStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.supplierSortStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.supplierSortStatus !== 1 ? $t('system.role.enable') : $t('system.role.disable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('supplier.category.addCategory'):$t('supplier.category.editCategory')" center width="500px" @closed="clearData">
      <el-form ref="supplierCategory" :model="formLine" v-if="dialogVisible" label-width="140px" label-position="right" size="small" :rules="formLineRules" >
        <el-form-item :label="$t('supplier.category.parentCategory')" prop="parentsName">
          <el-cascader
            ref="cascader"
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="disabledList"
            :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
            filterable
            clearable
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('supplier.category.categoryCode')" prop="supplierSortCode">
          <el-input v-model="formLine.supplierSortCode" clearable class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('supplier.category.categoryName')" prop="supplierSortName">
          <el-input v-model="formLine.supplierSortName" clearable class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="status">
          {{Number(formLine.supplierSortStatus) === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('supplierCategory')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="detailModal" :title="$t('supplier.category.detailCategory')" width="500px" center @closed="clearData">
      <el-form ref="supplierCategory" :model="formLine" label-width="140px" label-position="right" size="small" :rules="formLineRules">
        <el-form-item :label="$t('supplier.category.parentCategory')" prop="parentsName">
          {{formLine.parentBNames}}
        </el-form-item>
        <el-form-item :label="$t('supplier.category.categoryCode')" prop="supplierSortCode">
          <el-input v-model="formLine.supplierSortCode" readonly class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('supplier.category.categoryName')" prop="supplierSortName">
          <el-input v-model="formLine.supplierSortName" readonly class="form-dialog-width" />
        </el-form-item>

        <el-form-item :label="$t('supplier.category.supplierNumber')" prop="sumNumber">
          <el-input v-model="formLine.sumNumber" readonly class="form-dialog-width" />
        </el-form-item>

        <el-form-item :label="$t('system.role.status')" prop="status">
          {{Number(formLine.supplierSortStatus) === 1 ? $t('system.role.enable') : $t('system.role.disable')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="sortVisible" :title="$t('supplier.category.editSequence')" width="500px" center :close-on-click-modal="false" @close="closeSortDialog">
      <div style="height: 400px;overflow: auto">
        <el-tree
          ref="tree"
          v-if="sortVisible"
          :data="sortDataList"
          node-key="id"
          :props="{label: 'supplierSortName', children: 'children'}"
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
        <el-button type="danger" size="small" @click="sortVisible=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  listSort,
  saveSort,
  updateSort,
  deleteSort,
  updateSupplierSortStatus,
  supplierSortMove,
  supplierSortMoveMost
} from '@/api/supplier'
import { parseTime } from '@/utils/index'
import { deepClone } from "@/utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      detailModal: false,
      sortVisible: false,
      canClick: false,
      dialogType: '',
      indent: 20,
      selectList: [],
      sortDataList: [],
      formLine: {
        parentsName: [],
        parentBId: '',
        supplierSortName: '',
        supplierSortCode: '',
        supplierSortStatus: 1,
        parentBIds: '',
        parentBNames: ''
      },
      formLineRules: {
        supplierSortName: [
          { required: true, message: this.$t('supplier.category.inputSupplierName'), trigger: 'blur' }
        ],
        supplierSortCode: [
          { required: true, message: this.$t('supplier.category.inputSupplierCode'), trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: '',
        supplierSortStatus: ''
      },
      areaList: [
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
          inquiryStatus: 2
        }
      ],
      dataList: [],
      disabledList: [],
      addDataList: [],
      sub: '',
      cloneList: []
    }
  },
  watch: {
    isZh() {
      this.formLineRules = {
        supplierSortName: [
          { required: true, message: this.$t('supplier.category.inputSupplierName'), trigger: 'blur' }
        ],
        supplierSortCode: [
          { required: true, message: this.$t('supplier.category.inputSupplierCode'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.formLine.parentsName = [];
      this.formLine.supplierSortName = '';
      this.formLine.supplierSortCode = '';
      this.formLine.parentBId = '';
      this.formLine.supplierSortStatus = 1;
      this.formLine.parentBIds = '';
      this.formLine.parentBNames = ''
    },
    filterSort(data, name, code, status) {
      let arr = [];
      data.forEach(e => {
        if (
          ((name !== '' && name !== undefined) ? e.supplierSortName.indexOf(name) > -1 : true) &&
          ((code !== '' && code !== undefined) ? e.supplierSortCode.indexOf(code) > -1 : true) &&
          (status === '' ? true : e.supplierSortStatus === status)
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
    searchData() {
      if ((this.postData.supplierSortCode !== '' && this.postData.supplierSortCode !== undefined) ||
        (this.postData.supplierSortName !== '' && this.postData.supplierSortName !== undefined) ||
        this.postData.supplierSortStatus !== '') {
        this.dataList = this.filterSort(this.cloneList, this.postData.supplierSortName, this.postData.supplierSortCode, this.postData.supplierSortStatus)
      } else {
        this.postData.pageNum = 1;
        this.getDataList();
      }
    },
    getDataList() {
      // let obj = {};
      // for (let key in this.postData) {
      //   if (this.postData[key] !== '') {
      //     obj[key] = this.postData[key]
      //   }
      // }
      this.listLoading = true;
      listSort({ pageSize: 999, pageNum: 1 }).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list;
        this.cloneList = deepClone(res.data.list);
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
        this.listLoading = false;
      })
    },
    getAllDataList() {
      listSort({ pageSize: 9999, pageNum: 1 }).then(res => {
        this.addDataList = res.data.list || [];
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.formLine.parentBId = arr[arr.length - 1];
        this.formLine.parentBIds = arr.join(',');
        this.formLine.parentBNames = this.$refs['cascader'].currentLabels.join('/');
      } else {
        this.formLine.parentBId = '';
        this.formLine.parentBIds = '';
        this.formLine.parentBNames = ''
      }
    },
    openSortDialog() {
      listSort({ pageSize: 9999, pageNum: 1 }).then(res => {
        this.sortDataList = JSON.parse(JSON.stringify(res.data.list));
        this.sortVisible = true;
      })
    },
    closeSortDialog() {
      this.getDataList()
    },
    openDetail(row) {
      this.getAllDataList();
      this.formLine = deepClone(row);
      // 回显上级
      if (row.parentBIds) {
        this.formLine.parentsName = this.formLine.parentBIds.split(',').map(e => {
          return e;
        })
      } else {
        this.formLine.parentsName = []
      }
      this.detailModal = true;
    },
    openDialog(type, row) {
      this.getAllDataList();
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
        let cloneArr = deepClone(this.dataList)
        this.disabledList = this.setDisabledList(cloneArr, row.bid);
      } else {
        listSort({ pageSize: 9999, pageNum: 1 }).then(res => {
          this.disabledList = JSON.parse(JSON.stringify(res.data.list));
        })
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
    confirmAdd(formName) {
      let api = '';
      if (this.dialogType === 'add') {
        api = saveSort
      } else {
        api = updateSort
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          api(this.formLine).then(res => {
            if (res.data === 200) {
              this.$message.success(this.$t('customer.category.operationSuccessful'));
              this.dialogVisible = false;
              this.postData.pageNum = 1;
              this.clearData();
            } else if (res.data === 100) {
              this.$message.warning(this.$t('supplier.manage.existName'));
            } else if (res.data === 101) {
              this.$message.warning(this.$t('supplier.manage.existCode'));
            } else if (res.data === 102) {
              this.$message.warning(this.$t('supplier.manage.sameName'));
            }
            this.getDataList();
            this.dialogVisible = false;
            this.confirmLoading = false;
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning(this.$t("system.userManage.check"))
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        supplierSortStatus: row.supplierSortStatus === 1 ? 2 : 1
      };
      if (row.sumNumber !== 0 && row.supplierSortStatus === 1) {
        return this.$message.warning(this.language === 'zh' ? '存在供应商数量,无法禁用' : 'The number of suppliers exists and cannot be disabled')
      }
      updateSupplierSortStatus(obj).then(res => {
        this.getDataList();
        this.$message.success(this.$t('customer.category.operationSuccessful'));
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteCategory() {
      if (this.selectList.length !== 1) {
        return this.$message.warning(this.isZh ? '每次只能个删除一条数据' : 'Only one data can be deleted at a time')
      }
      let row = this.selectList[0];
      if (row.children && row.children.length) {
        return this.$message.error(this.$t('supplier.category.noDelete'));
      }
      if (row.supplierSortStatus === 1) {
        return this.$message.warning(this.$t('supplier.category.noDeletes'))
      }
      this.$confirm(
        this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"), {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: 'warning',
          center: true
        }).then(() => {
        let obj = {
          id: row.id
        };
        this.sub = row.sub;
        if (this.sub === 0 && this.sub !== '') {
          deleteSort(obj).then(res => {
            this.getDataList();
            this.$message.success(this.$t('customer.category.operationSuccessful'));
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.error(this.$t('supplier.category.children'))
        }
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      })
    },
    // 勾选触发 selects为选择的数据数组
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
    },
    // 置顶
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning(this.$t('customer.category.top'));
      }
      this.canClick = true;
      supplierSortMoveMost({ id: data.id, type: 1 }).then(res => {
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
        return this.$message.warning(this.$t('customer.category.bottom'));
      }
      this.canClick = true;
      supplierSortMoveMost({ id: data.id, type: 2 }).then(res => {
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
      supplierSortMove({ id: data.id, type: move === 1 ? 1 : 2 }).then(res => {
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
        return this.$message.warning(this.$t('customer.category.top'));
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning(this.$t('customer.category.bottom'));
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move, data, move);
      }
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    sumNumberFmt(val) {
      if (val) {
        return val;
      } else {
        return '-';
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .supplierCategory {
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
        width: 500px;
      }
    }
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
  }
</style>
