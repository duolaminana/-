<template>
  <div class="app-container menu-page">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <div>
          <el-form-item :label="$t('system.department.departmentCode')">
            <el-input v-model.trim="postData.departmentCode" clearable :placeholder="$t('system.department.departmentCode')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.department.departmentName')">
            <el-input v-model.trim="postData.departmentName" clearable :placeholder="$t('system.department.departmentName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.department.departmentStatus')">
            <el-select v-model="postData.departmentStatus" clearable :placeholder="$t('system.department.departmentStatus')" style="width: 150px">
              <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="getDataList">{{$t('common.search')}}</el-button>
        </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openSortDialog">{{$t('common.sort')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteMenu()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
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

      <el-table-column :label="$t('system.department.departmentName')" prop="departmentName" show-overflow-tooltip/>

      <el-table-column :label="$t('system.department.departmentCode')" width="150px" prop="departmentCode" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('system.department.departmentUserBy')" width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.lastName}} {{scope.row.firstName}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.department.employeeNums')" width="135px" prop="employeeNums"/>

      <el-table-column align="center" width="100" :label="$t('system.department.departmentStatus')" prop="departmentStatus">
        <template slot-scope="{row}">
          <el-tag :type="row.departmentStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{row.departmentStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.departmentStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">{{row.departmentStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sortVisible" :title="$t('system.department.sequenceDepartment')" width="500px" center>
      <!--<div style="overflow: auto;height: 400px">-->
        <!--<el-tree-->
          <!--ref="tree"-->
          <!--v-if="sortVisible"-->
          <!--:data="sortDataList"-->
          <!--node-key="id"-->
          <!--:default-expand-all="false"-->
          <!--:props="{label: 'departmentName', children: 'children'}"-->
          <!--:expand-on-click-node="false">-->
        <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
        <!--<span>{{ node.label }}</span>-->
        <!--<span>-->
          <!--<el-button-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--@click="moveFirst(node, data)">-->
            <!--<svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--@click="moveOne(node, data, 1)">-->
            <!--<svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--@click="moveOne(node, data, -1)">-->
            <!--<svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--type="text"-->
            <!--size="mini"-->
            <!--@click="moveLast(node, data)">-->
            <!--<svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />-->
          <!--</el-button>-->
        <!--</span>-->
      <!--</span>-->
        <!--</el-tree>-->
      <!--</div>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--&lt;!&ndash;<el-button type="primary" size="small" @click="saveSort">{{$t('common.buttonText.save')}}</el-button>&ndash;&gt;-->
        <!--<el-button type="danger" size="small" @click="sortVisible=false">{{$t('common.buttonText.cancel')}}</el-button>-->
      <!--</div>-->
      <el-table
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        v-loading="listLoading"
        fit
        size="mini"
        v-if="sortVisible"
        :data="dataList"
        node-key="id"
        :default-expand-all="false"
        :element-loading-text="$t('system.userManage.lodding')"
        :tree-props="{label: 'departmentName', children: 'children'}">
        <!--<el-table-column align="center" type="selection" width="55"></el-table-column>-->
        <el-table-column prop="departmentName" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button size="mini" @click="stick(row)">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
            </el-button>
            <el-button size="mini" @click="shiftUp(row)">
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
            </el-button>
            <el-button size="mini" @click="moveDown(row)">
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
            </el-button>
            <el-button size="mini" @click="profileMode(row)">
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" @click="saveSort">{{$t('common.buttonText.save')}}</el-button>-->
        <el-button type="danger" size="small" @click="sortVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.department.addDepartment'):$t('system.department.editDepartment')" width="620px" center @closed="clearData">
      <el-form ref="addDepartment" v-if="dialogVisible" :model="menuData" :label-width="isZh ? '100px' : '125px'" label-position="left" size="mini" :rules="menuDataRules">
        <el-form-item :label="$t('system.department.parentDepartment')">
          <el-cascader
            style="width: 355px"
            v-model="menuData.parentsName"
            :options="disabledList"
            :props="{value: 'bid', label: 'departmentName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('common.search')"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentCode')" prop="departmentCode">
          <el-input v-model="menuData.departmentCode" clearable :maxlength="20" :placeholder="$t('system.department.departmentCode')" style="width: 355px" />
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentName')" prop="departmentName">
          <el-input v-model="menuData.departmentName" clearable :maxlength="30" :placeholder="$t('system.department.departmentName')" style="width: 355px" />
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentUserBy')">
          <el-select filterable remote :remote-method="selectUserListAllFun" :loading="loading1" v-model="menuData.userBackendInfoId" clearable :placeholder="$t('system.department.searchName')" style="width: 355px">
            <el-option v-for="(item, index) in userInfoList" :label="item.userName" :value="item.accountBId" :key="index">
              {{item.userName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentStatus')" prop="departmentStatus">
          {{menuData.departmentStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addDepartment', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('system.department.viewDepartment')" width="620px" center @closed="clearData">
      <el-form ref="addDepartment" :model="menuData" :label-width="isZh ? '100px' : '125px'" label-position="left" size="small">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('system.department.basicInformation')" name="1">
            <el-form-item :label="$t('system.department.parentDepartment')">
              <el-cascader
                style="width: 355px"
                v-model="menuData.parentsName"
                :options="dataList"
                :props="{value: 'bid', label: 'departmentName', children: 'children'}"
                filterable
                clearable
                :disabled="true"
                change-on-select
                @change="getParentId"
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentCode')" prop="departmentCode">
              <el-input v-model="menuData.departmentCode" clearable style="width: 355px" readonly />
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentName')" prop="departmentName">
              <el-input v-model="menuData.departmentName" clearable style="width: 355px" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentUserBy')" prop="userBackendInfoId">
              <el-select filterable remote :remote-method="selectUserListAllFun" :loading="loading1" v-model="menuData.userBackendInfoId" disabled style="width: 355px">
                <el-option v-for="(item, index) in userInfoList" disabled :label="item.userName" :value="item.accountBId" :key="index">
                  {{item.userName}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.department.employeeNums')" prop="departmentBId">
              <el-input v-model="menuData.departmentBId" clearable style="width: 355px" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentStatus')" prop="departmentStatus">
              {{menuData.departmentStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.department.departmentStaff')" name="2">
            <el-table
              :data="userDepartmentList"
              border
              fit
              size="small"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" :label="$t('system.department.userName')" prop="userName" show-overflow-tooltip/>
              <el-table-column align="center" :label="$t('system.department.mobilePhone')" prop="mobilePhone" show-overflow-tooltip/>
              <el-table-column align="center" :label="$t('system.department.userAccount')" prop="userAccount" show-overflow-tooltip/>
            </el-table>
            <Pagination :total="userDepartmentForm.total" :page.sync="userDepartmentForm.pageNum" :limit.sync="userDepartmentForm.pageSize" @pagination="selectUserDepartmentListFun"></Pagination>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  selectDepartmentListAllApi,
  saveDepartmentApi,
  updateDepartmentApi,
  updateStatusApi,
  deleteByIdApi,
  selectUserListAllApi,
  selectUserAccountListAllApi,
  selectSysUserDepartmentCountApi,
  selectUserDepartmentListApi,
  updateDepSequenceNew,
  exportDepartmentApi
} from '@/api/system'
import { deepClone } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      activeName: '1',
      dataList: [],
      disabledList: [],
      selectList: [],
      userDepartmentList: [],
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      dialogVisible1: false,
      sortVisible: false,
      dialogType: '',
      indent: 20,
      detailModal: false,
      menuData: {
        parentsName: [],
        departmentCode: '',
        departmentName: '',
        userBackendInfoId: '',
        departmentStatus: 1,
        parentDepIds: '',
        firstName: '',
        lastName: '',
        departmentBId: ''
      },
      postData: {
        departmentCode: '',
        departmentName: '',
        departmentStatus: ''
      },
      menuDataRules: {
        departmentCode: [
          { required: true, message: this.$t('system.department.departmentCodeHint'), trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: this.$t('system.department.departmentNameHint'), trigger: 'blur' }
        ],
        userBackendInfoId: [
          { required: true, message: this.$t('system.department.userBackendInfoIdHint'), trigger: 'blur' }
        ]
      },
      areaList: [
        // 部门状态：0无效、1有效
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          labelZh: '使用中',
          label: 'Enabled',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ],
      sub: '',
      userListPrams: {
        pageSize: 9999,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      userDepartmentForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        departmentBId: ''
      },
      linkList: [],
      sortDataList: [],
      userInfoList: ''
    }
  },
  watch: {
    isZh() {
      this.menuDataRules = {
        departmentCode: [
          { required: true, message: this.$t('system.department.departmentCodeHint'), trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: this.$t('system.department.departmentNameHint'), trigger: 'blur' }
        ],
        userBackendInfoId: [
          { required: true, message: this.$t('system.department.userBackendInfoIdHint'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.menuData.parentsName = [];
      this.menuData.departmentCode = '';
      this.menuData.departmentName = '';
      this.menuData.userBackendInfoId = '';
      this.menuData.depSequence = '';
      this.menuData.departmentStatus = 1;
      this.menuData.parentDepIds = '';
      this.menuData.id = '';
      this.menuData.parentBId = '';
      this.menuData.departmentBId = '';
    },
    getDataList() {
      selectDepartmentListAllApi(this.postData).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
      this.listLoading = false;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.menuData = deepClone(row);
        // 回显上级
        if (row.parentDepIds) {
          this.menuData.parentsName = this.menuData.parentDepIds.split(',').map(e => {
            return e;
          })
        } else {
          this.menuData.parentsName = []
        }
        let cloneArr = deepClone(this.dataList)
        this.disabledList = this.setDisabledList(cloneArr, row.bid);
      } else {
        this.disabledList = deepClone(this.dataList)
      }
      this.selectUserListAllFun(); // 获取后台人员
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
    getParentId(arr) {
      if (arr.length) {
        this.menuData.parentBId = arr[arr.length - 1];
        this.menuData.parentDepIds = arr.join(',')
      } else {
        this.menuData.parentBId = '';
        this.menuData.parentDepIds = ''
      }
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            saveDepartmentApi(this.menuData).then(res => {
              this.$message.success(res.message);
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateDepartmentApi(this.menuData).then(res => {
              this.$message.success(res.message);
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'));
          return false;
        }
      });
    },
    openSortDialog() {
      this.sortDataList = JSON.parse(JSON.stringify(this.dataList));
      this.sortVisible = true;
    },
    stick(row) {
      updateDepSequenceNew({
        id: row.id,
        type: 1
      }).then(res => {
        this.getDataList();
      });
    },
    shiftUp(row) {
      updateDepSequenceNew({
        id: row.id,
        type: 2
      }).then(res => {
        this.getDataList();
      });
    },
    moveDown(row) {
      updateDepSequenceNew({
        id: row.id,
        type: 3
      }).then(res => {
        this.getDataList();
      });
    },
    profileMode(row) {
      updateDepSequenceNew({
        id: row.id,
        type: 4
      }).then(res => {
        this.getDataList();
      });
    },
    // 置顶部门
    // moveFirst(node, data) {
    //   let arr = node.parent.data.children || node.parent.data;
    //   let rowIndex = arr.findIndex(e => e.id === data.id);
    //   if (rowIndex === 0) {
    //     return this.$message.warning('To the top!');
    //   }
    //   let newAttrSequ = arr[0].depSequence;
    //   arr[rowIndex].depSequence = newAttrSequ - 1;
    //   let top = deepClone(arr.splice(rowIndex, 1)[0]);
    //   arr.unshift(top);
    // },
    // // 移到尾部部门
    // moveLast(node, data) {
    //   let arr = node.parent.data.children || node.parent.data;
    //   let rowIndex = arr.findIndex(e => e.id === data.id);
    //   if (rowIndex === arr.length - 1) {
    //     return this.$message.warning('To the bottom!');
    //   }
    //   let newAttrSequ = arr[arr.length - 1].depSequence;
    //   arr[rowIndex].depSequence = newAttrSequ + 1;
    //   let end = deepClone(arr.splice(rowIndex, 1)[0]);
    //   arr.push(end);
    // },
    // // 替换
    // moveComm(arr, curIndex, nextIndex) {
    //   let oldAttrSequ = arr[curIndex].depSequence;
    //   let newAttrSequ = arr[nextIndex].depSequence;
    //   arr[curIndex].depSequence = newAttrSequ;
    //   arr[nextIndex].depSequence = oldAttrSequ;
    //   arr[curIndex] = deepClone(arr.splice(nextIndex, 1, arr[curIndex])[0]);
    //   return arr;
    // },
    // // 上下移动
    // moveOne(node, data, move) {
    //   let arr = node.parent.data.children || node.parent.data;
    //   let rowIndex = arr.findIndex(e => e.id === data.id);
    //   if (rowIndex === 0 && move === 1) {
    //     return this.$message.warning('To the top!');
    //   } else if (rowIndex === arr.length - 1 && move === -1) {
    //     return this.$message.warning('To the bottom!');
    //   } else {
    //     arr = this.moveComm(arr, rowIndex, rowIndex - move);
    //   }
    // },
    // saveSort() {
    //   departmentSort(this.sortDataList).then(res => {
    //     this.sortVisible = false;
    //     this.getDataList();
    //     this.$message.success(this.$t("system.userManage.updata"))
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   })
    // },
    detailDialog(row) {
      this.menuData = deepClone(row);
      this.activeName = '1';
      // 回显上级
      console.log(this.menuData)
      if (row.parentDepIds) {
        this.menuData.parentsName = this.menuData.parentDepIds.split(',').map(e => {
          return e;
        })
        console.log(this.menuData.parentsName)
      } else {
        this.menuData.parentsName = []
      }
      // 根据departmentBId来统计部门现有人数
      selectSysUserDepartmentCountApi({ departmentBId: row.bid }).then(res => {
        this.detailModal = true;
        this.menuData.departmentBId = res.data;
      });
      // 查看部门现有成员人数列表
      this.userDepartmentForm.departmentBId = row.bid;
      this.selectUserDepartmentListFun(this.userDepartmentForm);
      this.selectUserListAllFun(); // 获取后台人员
    },
    // 查看部门现有成员人数列表
    selectUserDepartmentListFun() {
      selectUserDepartmentListApi(this.userDepartmentForm).then(res => {
        this.userDepartmentList = res.data.list;
        this.userDepartmentForm.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    changeStatus(row) {
      let obj = {
        departmentStatus: row.departmentStatus === 1 ? 0 : 1,
        id: row.id
      };
      if (row.sub === 0 && row.sub !== '') {
        updateStatusApi(obj).then(res => {
          this.$message.success(this.$t("system.userManage.updata"));
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message)
        });
      } else {
        this.$message.error(this.$t('system.userManage.subseries2'))
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
    },
    deleteMenu() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      }
      if (this.selectList.length > 1) {
        return this.$message(this.$t("system.userManage.only"));
      }
      this.$confirm(this.$t("system.userManage.whether"), this.$t("system.userManage.hint"), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: this.selectList[0].id };
        this.sub = this.selectList[0].sub;
        if (this.sub === 0 && this.sub !== '') {
          deleteByIdApi(obj).then(res => {
            this.getDataList();
            this.$message.success(res.message);
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.error(this.$t('system.userManage.subseries'))
        }
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // 导出操作
    outportData() {
      let obj = {
        departmentCode: this.postData.departmentCode,
        departmentName: this.postData.departmentName,
        departmentStatus: this.postData.departmentStatus
      };
      exportDepartmentApi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'department.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 从用户列表别获取联系人
    getSelectUserList(val) {
      selectUserAccountListAllApi(val).then(res => {
        this.linkList = res.data
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    selectUserListAllFun(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectUserListAllApi(val).then(res => {
          _this.userInfoList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.userInfoList = [];
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status]
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .menu-page {
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
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
  }
</style>
