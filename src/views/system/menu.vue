<template>
  <div class="app-container menu-page">
    <!--<div class="search-box">-->
      <!--<el-form label-width="170px" inline size="small">-->
        <!--<el-form-item :label="$t('system.menu.menuName')">-->
          <!--<el-input v-model="postData.menuName" clearable placeholder="approval name" style="width: 200px"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('system.approvalFlow.status')">-->
          <!--<el-select v-model="postData.status" clearable placeholder=" status" style="width: 200px">-->
            <!--<el-option v-for="(item, index) in statusList" :label="isZh ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</div>-->
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
      border
      fit
      size="mini"
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
      @select="setChildSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column width="300" :label="$t('system.menu.menuName')" prop="menuTitle">
        <template slot-scope="scope">
          {{language === 'zh' ? scope.row.menuTitleZh : scope.row.menuTitle}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('system.menu.menuPath')" prop="menuPath"/>

      <el-table-column :label="$t('system.menu.menuSign')" prop="menuSign"/>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="menuStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.menuStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.menuStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.menuStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.menuStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.menu.addMenu'):$t('system.menu.editMenu')" width="500px" center :close-on-click-modal="false" @closed="clearData">
      <el-form ref="addMenu" v-if="dialogVisible" :model="menuData" label-width="145px" label-position="left" size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.menu.parentMenu')">
          <el-cascader
            class="form-dialog-width"
            v-model="menuData.parentsName"
            :options="disabledList"
            :props="{value: 'bid', label: language === 'zh' ? 'menuTitleZh' : 'menuTitle', children: 'children'}"
            filterable
            clearable
            placeholder="search"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuName')" prop="menuTitle">
          <el-input v-model="menuData.menuTitle" clearable placeholder="name" maxlength="50" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuNameZh')" prop="menuTitleZh">
          <el-input v-model="menuData.menuTitleZh" placeholder="chinese name" maxlength="25" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuSign')" prop="menuSign">
          <el-input v-model="menuData.menuSign" clearable placeholder="sign" maxlength="25" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuIcon')">
          <el-input v-model="menuData.menuIcon" clearable placeholder="icon" maxlength="25" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuAdmin')" prop="menuAdmin" v-if="!menuData.parentBId || menuData.parentBId === '0'">
          <el-select filterable v-model="menuData.menuAdmin" clearable placeholder="module administrator" class="form-dialog-width">
            <el-option v-for="(itemUser, index) in userInfoList" :label="itemUser.userName" :value="itemUser.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuPath')" prop="menuPath">
          <el-input v-model="menuData.menuPath" clearable placeholder="menu path" maxlength="150" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuPagePath')" prop="component">
          <el-input v-model="menuData.component" clearable placeholder="page Path" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.menu.menuDisplay')" prop="menuShow">
          <el-radio-group v-model="menuData.menuShow">
            <el-radio :label="1">Yes</el-radio>
            <el-radio :label="0">No</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="menuStatus">
          {{ menuData.menuStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('addMenu', dialogType === 'add' ? 1 : 2)">
          {{$t('common.buttonText.save')}}
        </el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('system.menu.menuView')" width="500px" center :close-on-click-modal="false">
      <el-tabs value="1" style="margin-top: -20px">
        <el-tab-pane :label="$t('system.menu.menuDetail')" name="1">
          <el-form ref="addMenu" :model="menuDetail" label-width="145px" label-position="left" size="small">
            <el-form-item :label="$t('system.menu.parentMenu')">
              <el-cascader
                class="form-dialog-width"
                v-model="menuDetail.parentsName"
                :options="dataList"
                :props="{value: 'bid', label: 'menuTitle', children: 'children'}"
                filterable
                disabled
                placeholder=""
                change-on-select
                @change="getParentId"
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuName')">
              <el-input v-model="menuDetail.menuTitle" readonly class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuNameZh')">
              <el-input v-model="menuDetail.menuTitleZh" readonly class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuSign')">
              <el-input v-model="menuDetail.menuSign" readonly class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuIcon')">
              <el-input v-model="menuDetail.menuIcon" readonly class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuAdmin')" prop="menuAdmin">
              <el-select filterable v-model="menuDetail.menuAdmin" disabled placeholder="module administrator" class="form-dialog-width">
                <el-option v-for="(itemUser, index) in userInfoList" :label="itemUser.userName" :value="itemUser.accountBId" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuPath')">
              <el-input v-model="menuDetail.menuPath" readonly class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuPagePath')">
              <el-input v-model="menuDetail.component" readonly class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('system.menu.menuDisplay')">
              <el-radio-group v-model="menuDetail.menuShow" disabled>
                <el-radio :label="1">Yes</el-radio>
                <el-radio :label="0">No</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('common.status')">
              {{ menuDetail.menuStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('system.menu.menuRole')" name="2">
          <el-table
            :data="menuRoleList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column :label="$t('system.menu.roleName')" prop="roleName"/>

            <el-table-column align="center" :label="$t('common.table.status')" prop="menuStatus">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger' " size="mini">
                  {{ scope.row.status === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="sortVisible" :title="$t('system.menu.menuSort')" width="500px" center :close-on-click-modal="false" @close="closeSortDialog">
      <el-tree
        v-if="sortVisible"
        ref="tree"
        style="height: 400px;overflow: auto"
        :data="sortDataList"
        node-key="id"
        :props="{label: language === 'zh' ? 'menuTitleZh' : 'menuTitle', children: 'children'}"
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
      <div slot="footer">
        <el-button type="danger" size="small" @click="sortVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList, getMenuTwoList, addMenu, changeMenuStatus, editMenu, deleteMenu, getMenuRole, menuMoveOne, menuMoveMast, selectUserListAllApi, exportByMenuList } from '@/api/system'
import { deepClone } from '@/utils/index'

export default {
  data() {
    return {
      dataList: [],
      disabledList: [],
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      sortVisible: false,
      canClick: false,
      dialogType: '',
      menuDetail: {},
      menuRoleList: [],
      selectList: [],
      sortDataList: [],
      userInfoList: [],
      menuData: {
        parentsName: [],
        menuTitle: '',
        menuTitleZh: '',
        parentBId: '',
        menuSign: '',
        menuIcon: '',
        component: '',
        menuStatus: 1,
        menuShow: 1,
        menuAdmin: '',
        menuPath: ''
      },
      menuDataRules: {
        menuTitle: [
          { required: true, message: this.$t('system.menu.nameTipEn'), trigger: 'blur' }
        ],
        menuTitleZh: [
          { required: true, message: this.$t('system.menu.nameTipZh'), trigger: 'blur' }
        ],
        menuAdmin: [
          { required: true, message: this.$t('system.menu.adminTip'), trigger: 'change' }
        ],
        menuSign: [
          { required: true, message: this.$t('system.menu.signTip'), trigger: 'blur' }
        ],
        menuPath: [
          { required: true, message: this.$t('system.menu.pathTip'), trigger: 'blur' }
        ],
        component: [
          { required: true, message: this.$t('system.menu.pagePathTip'), trigger: 'blur' }
        ]
      },
      dataTwoList: {},
      postData: {
        menuName: '',
        status: ''
      },
      statusList: [
        {
          label: 'Enabled',
          labelZh: '使用中',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ]
    }
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  created() {
    this.getDataList();
    this.selectUserListAllFun();
    this.getDataTwoList();
  },
  methods: {
    clearData() {
      this.menuData.parentsName = [];
      this.menuData.menuTitle = '';
      this.menuData.menuTitleZh = '';
      this.menuData.menuSign = '';
      this.menuData.menuIcon = '';
      this.menuData.menuPath = '';
      this.menuData.menuAdmin = '';
      this.menuData.component = '';
      this.menuData.menuStatus = 1;
      this.menuData.parentBId = '';
      this.menuData.id = '';
      this.menuData.menuShow = 1;
    },
    setOption() {
      this.menuDataRules = {
        menuTitle: [
          { required: true, message: this.$t('system.menu.nameTipEn'), trigger: 'blur' }
        ],
        menuTitleZh: [
          { required: true, message: this.$t('system.menu.nameTipZh'), trigger: 'blur' }
        ],
        menuAdmin: [
          { required: true, message: this.$t('system.menu.adminTip'), trigger: 'change' }
        ],
        menuSign: [
          { required: true, message: this.$t('system.menu.signTip'), trigger: 'blur' }
        ],
        menuPath: [
          { required: true, message: this.$t('system.menu.pathTip'), trigger: 'blur' }
        ],
        component: [
          { required: true, message: this.$t('system.menu.pagePathTip'), trigger: 'blur' }
        ]
      }
    },
    searchData() {
      // this.$refs.listTable.filter(this.postData);
      this.getDataList()
    },
    getDataList() {
      getMenuList(this.postData).then(res => {
        this.listLoading = false;
        this.dataList = res.data
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getDataTwoList() {
      getMenuTwoList(this.postData).then(res => {
        this.dataTwoList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.menuData = deepClone(row);
        if (row.parentIds) {
          this.menuData.parentsName = this.menuData.parentIds.split(',').map(e => {
            return e;
          })
        } else {
          this.menuData.parentsName = []
        }
        let cloneArr = deepClone(this.dataTwoList);
        this.disabledList = this.setDisabledList(cloneArr, row.bid);
      } else {
        this.disabledList = deepClone(this.dataTwoList)
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
    getParentId(arr) {
      if (arr.length) {
        this.menuData.parentBId = arr[arr.length - 1]
      } else {
        this.menuData.parentBId = ''
      }
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          if (type === 1) {
            addMenu(this.menuData).then(res => {
              this.$message.success(this.$t("system.userManage.addSuccess"));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.getDataTwoList()
              this.confirmLoading = false;
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.confirmLoading = false;
              this.$message.error(err.message)
            });
          } else {
            editMenu(this.menuData).then(res => {
              this.$message.success(this.$t('common.tip.saveTip'));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.getDataTwoList()
              this.dialogVisible = false;
              this.confirmLoading = false;
            }).catch(err => {
              this.listLoading = false;
              this.confirmLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'))
          return false;
        }
      });
    },
    detailDialog(row) {
      this.dialogVisible1 = true;
      this.menuDetail = row;
      if (this.menuDetail.parentIds) {
        this.menuDetail.parentsName = this.menuDetail.parentIds.split(',').map(e => {
          return e;
        })
      } else {
        this.menuData.parentsName = []
      }
      getMenuRole({ menuBid: row.bid }).then(res => {
        this.menuRoleList = res.data || [];
      }).catch(err => {
        this.$message.error(err.manager)
      })
    },
    setArrDisabled(arr = []) {
      arr.forEach(e => {
        e.menuStatus = 0;
        if (e.children && e.children.length) {
          this.setArrDisabled(e.children)
        }
      })
    },
    changeStatus(row) {
      let obj = {
        menuStatus: row.menuStatus === 1 ? 0 : 1,
        id: row.id
      };
      changeMenuStatus(obj).then(res => {
        this.$message.success(this.$t('common.tip.updateTip'));
        // this.getDataList();
        row.menuStatus = row.menuStatus === 1 ? 0 : 1;
        if (row.children && row.children.length && row.menuStatus === 0) {
          this.setArrDisabled(row.children)
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteMenu() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('query.formMessage.PleaseSelectData'));
      }
      if (this.selectList.length > 1) {
        return this.$message.warning(this.$t('common.tip.only'));
      }
      this.$confirm(this.$t('common.tip.deletData'), this.$t('common.tip.tip'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: this.selectList[0].id };
        deleteMenu(obj).then(res => {
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
    selectUserListAllFun() {
      selectUserListAllApi().then(res => {
        this.userInfoList = res.data || [];
      });
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
    openSortDialog() {
      this.sortDataList = deepClone(this.dataList);
      this.sortVisible = true;
    },
    closeSortDialog() {
      this.getDataList()
    },
    // 置顶
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning(this.$t('product.tip.topTip'));
      }
      this.canClick = true;
      menuMoveMast({ id: data.id, type: 1 }).then(res => {
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
      menuMoveMast({ id: data.id, type: 2 }).then(res => {
        let end = deepClone(arr.splice(rowIndex, 1)[0]);
        arr.push(end);
        this.canClick = false;
      }).catch(err => {
        this.canClick = false;
        this.$message.error(err.message)
      })
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, data, move) {
      this.canClick = true;
      menuMoveOne({ id: data.id, type: move === 1 ? 1 : 2 }).then(res => {
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
    // 导出操作
    outportData() {
      let obj = {};
      exportByMenuList(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'backendMenuList.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
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

<style lang="scss">
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
}
</style>
