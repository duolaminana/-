<template>
  <div class="app-container customer-sort">
    <div class="search-box">
      <el-form label-width="120px" inline size="small">
        <el-form-item :label="$t('customer.category.categoryName')">
          <el-input v-model.trim="postData.sortName" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.sortStatus" clearable style="width: 150px" placeholder="">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openSortDialog">{{$t('customer.category.sequence')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteCategory">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      type="expand"
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
      <el-table-column :label="$t('customer.category.categoryName')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sortName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('customer.category.categoryCode')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sortCode}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('customer.category.clientNumber')" prop="customerNum" />
      <el-table-column align="center" :label="$t('customer.category.modifier')" prop="updateUserName" />

      <!--<el-table-column align="center" width="160" label="创建时间" prop="createTime" show-overflow-tooltip>-->
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.createTime | timeFmt}}-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" width="160" :label="$t('customer.category.modifierTime')" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sortStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.sortStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.sortStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.sortStatus !== 1 ? $t('system.role.enable') : $t('system.role.disable')}}</el-button>
          <!--<el-button type="danger" size="mini" @click="deleteCategory(row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--<Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>-->

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'? $t('customer.category.addClient') :$t('customer.category.editClient')" width="500px" @closed="clearData" center>
      <el-form ref="category" :model="formLine" v-if="dialogVisible" label-width="130px" label-position="left" size="small" :rules="formLineRules" >
        <el-form-item :label="$t('customer.category.parentCategory')" prop="parentsName">
          <el-cascader
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="disabledList"
            :props="{value: 'bid', label: 'sortName', children: 'children'}"
            filterable
            clearable
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('customer.category.categoryCode')" prop="sortCode">
          <el-input v-model="formLine.sortCode" clearable class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('customer.category.categoryName')" prop="sortName">
          <el-input v-model="formLine.sortName" clearable class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="status">
          {{Number(formLine.sortStatus) === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('category')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="detailModal" :title="$t('customer.category.clientDetail')" width="500px" center @closed="clearData">
      <el-form ref="category" :model="formLine" label-width="130px" label-position="left" size="small" :rules="formLineRules" >
        <el-form-item :label="$t('customer.category.parentCategory')" prop="parentsName">
          <el-cascader
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: 'sortName', children: 'children'}"
            filterable
            :disabled="true"
            readonly
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('customer.category.categoryCode')" prop="sortCode">
          <el-input v-model="formLine.sortCode" readonly class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('customer.category.categoryName')" prop="sortName">
          <el-input v-model="formLine.sortName" readonly class="form-dialog-width" />
        </el-form-item>
        <!--<el-form-item :label="$t('customer.category.clientNumber')" prop="levelNum">-->
          <!--<el-input v-model="formLine.levelNum" readonly class="form-dialog-width" />-->
        <!--</el-form-item>-->

        <el-form-item :label="$t('system.role.status')" prop="status">
          {{Number(formLine.sortStatus) === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="sortVisible" :title="$t('customer.category.categorySequence')" width="500px" center :close-on-click-modal="false" @close="closeSortDialog">
      <div style="height: 400px;overflow: auto">
        <el-tree
          ref="tree"
          v-if="sortVisible"
          :data="sortDataList"
          node-key="id"
          :props="{label: 'sortName', children: 'children'}"
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
        <el-button type="danger" size="small" @click="sortVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import {
  listSort,
  saveSort,
  updateSort,
  deleteSortById,
  updateByStatus,
  moveSortList
} from '@/api/customer'
import { parseTime, deepClone } from '@/utils/index'

export default {
  components: {
    // Pagination
  },
  data() {
    return {
      selectList: [],
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      detailModal: false,
      sortVisible: false,
      canClick: false,
      dialogType: '',
      indent: 20,
      sortDataList: [],
      disabledList: [],
      formLine: {
        parentsName: [],
        parentBId: '',
        sortName: '',
        sortCode: '',
        sortStatus: 1,
        parentBIds: ''
      },
      formLine1: {
      },
      formLineRules: {
        sortName: [
          { required: true, message: this.$t('customer.category.inputCategoryName'), trigger: 'blur' }
        ],
        sortCode: [
          { required: true, message: this.$t('customer.category.inputCategoryCode'), trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 999,
        total: 0,
        name: '',
        sortStatus: ''
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
          inquiryStatus: 0
        }
      ],
      dataList: [],
      addDataList: [],
      sub: '',
      cloneList: []
    }
  },
  created() {
    this.getDataList();
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  methods: {
    setOption() {
      this.formLineRules = {
        sortName: [
          { required: true, message: this.$t('customer.category.inputCategoryName'), trigger: 'blur' }
        ],
        sortCode: [
          { required: true, message: this.$t('customer.category.inputCategoryCode'), trigger: 'blur' }
        ]
      }
    },
    clearData() {
      this.formLine.parentsName = [];
      this.formLine.sortName = '';
      this.formLine.sortCode = '';
      this.formLine.parentBId = '';
      this.formLine.sortStatus = 1;
      this.formLine.parentBIds = '';
      this.confirmLoading = false
    },
    filterSort(data, name, status) {
      let arr = [];
      data.forEach(e => {
        if (
          ((name !== '' && name !== undefined) ? e.sortName.indexOf(name) > -1 : true) &&
          (status === '' ? true : e.sortStatus === status)
        ) {
          arr.push(e)
        } else if (e.children && e.children.length) {
          let child = this.filterSort(e.children, name, status);
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
      if ((this.postData.sortName !== '' && this.postData.sortName !== undefined) || this.postData.sortStatus !== '') {
        this.dataList = this.filterSort(this.cloneList, this.postData.sortName, this.postData.sortStatus)
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
        this.cloneList = deepClone(res.data.list)
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
        this.listLoading = false;
      })
    },
    getAllDataList() {
      listSort({ pageSize: 999, pageNum: 1, sortStatus: 1 }).then(res => {
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
        // this.disabledList = deepClone(this.dataList)
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
            this.$message.success(this.$t('customer.category.operationSuccessful'));
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.postData.pageNum = 1;
            this.clearData();
            this.getDataList();
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
        sortStatus: row.sortStatus === 1 ? 0 : 1
      };
      // this.sub = row.sub;
      // if (this.sub !== 0 && this.sub !== '' && obj.sortStatus === 0) {
      //   return this.$message.error(this.language === 'zh' ? '当前用户存在子级,无法禁用!' : 'The current user has child level and cannot be disabled!')
      // }
      updateByStatus(obj).then(res => {
        this.getDataList();
        this.$message.success(this.$t('customer.category.operationSuccessful'));
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteCategory() {
      if (this.selectList.length === 0) {
        return this.$message.warning(this.$t("system.userManage.option"))
      } else if (this.selectList.length !== 1) {
        return this.$message.warning(this.$t('customer.category.deleteOne'))
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].sortStatus === 1) {
            return this.$message.warning(this.language === 'zh' ? '使用状态下,无法删除!' : 'Cannot delete in use state!')
          }
        }
      }
      let row = this.selectList[0];
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
          id: row.id,
          delFlag: 1
        };
        this.sub = row.sub;
        if (this.sub === 0 && this.sub !== '') {
          deleteSortById(obj).then(res => {
            if (res.status === 200) {
              if (res.data) {
                this.$message.success(this.$t('customer.category.operationSuccessful'));
              } else {
                this.$message.error(this.$t('customer.category.operationFailure'));
              }
              // this.$message.success('操作成功!');
            }
            this.getDataList();
            this.$message.success(this.$t('customer.category.operationSuccessful'));
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.error(this.$t('customer.category.deleteFailed'))
        }
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      })
    },
    // 置顶
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning(this.$t('customer.category.top'));
      }

      let newAttrSequ = arr[0].sortIndex;
      let oldAttrSequ = data.sortIndex;
      data.sortIndex = newAttrSequ - 1;
      this.canClick = true;
      moveSortList({ customerSortList: [data] }).then(res => {
        let top = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.unshift(top);
      }).catch(err => {
        this.canClick = false;
        data.sortIndex = oldAttrSequ;
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
      let newAttrSequ = arr[arr.length - 1].sortIndex;
      let oldAttrSequ = data.sortIndex;
      data.sortIndex = newAttrSequ + 1;
      this.canClick = true;
      moveSortList({ customerSortList: [data] }).then(res => {
        let end = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.push(end);
      }).catch(err => {
        this.canClick = false;
        data.sortIndex = oldAttrSequ;
        this.$message.error(err.message)
      })
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, data, move) {
      let oldAttrSequ = arr[curIndex].sortIndex;
      let newAttrSequ = arr[nextIndex].sortIndex;
      arr[curIndex].sortIndex = newAttrSequ;
      arr[nextIndex].sortIndex = oldAttrSequ;
      this.canClick = true;
      moveSortList({ customerSortList: [arr[curIndex], arr[nextIndex]] }).then(res => {
        arr[curIndex] = deepClone(arr.splice(nextIndex, 1, arr[curIndex])[0]);
        this.canClick = false;
        return arr;
      }).catch(err => {
        arr[curIndex].sortIndex = oldAttrSequ;
        arr[nextIndex].sortIndex = newAttrSequ;
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
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
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
  .customer-sort {
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
