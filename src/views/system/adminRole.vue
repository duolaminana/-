<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <el-form-item :label="$t('system.role.roleName')">
          <el-input v-model.trim="postData.roleName" clearable style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.status" clearable :placeholder="$t('system.role.all')" style="width: 150px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchRole">{{$t("system.role.search")}}</el-button>
        </el-form-item>
        <!--<el-form-item :label="$t('system.role.hintText')" label-width="500px"></el-form-item>-->
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addDialog">{{$t("system.role.add")}}</el-button>
      <el-button type="primary" size="small" @click="deleteRole()">{{$t("system.role.delete")}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportRole">{{$t("system.role.export")}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect1">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.role.roleName')" prop="roleName" show-overflow-tooltip/>

      <!--<el-table-column align="center" width="150" :label="$t('system.role.number')" prop="updateUserName" show-overflow-tooltip/>-->
      <el-table-column align="center" width="150" :label="$t('system.role.number')" prop="userNum" show-overflow-tooltip/>
      <el-table-column width="120" :label="$t('system.role.modifier')" prop="updateUserName" show-overflow-tooltip/>
      <el-table-column width="120" :label="$t('system.userManage.editTime')" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="status" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.status === 1 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" style="width: 70px;" @click="openDialog(row)">{{$t('system.role.editPermission')}}</el-button>
          <el-button :type="row.status === 1 ? 'info' : 'danger'" style="width: 60px;" size="mini" @click="changeStatus(row)">
            {{row.status === 1 ? $t('system.role.disable') : $t('system.role.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  <!-- 新增角色-->
    <el-dialog :visible.sync="addModel" :title="$t('system.role.newRole')" width="500px" center @closed="clearData">
      <el-form label-width="100px" label-position="right" size="mini">
        <el-form-item :label="$t('system.role.roleName')" required>
          <el-input v-model="newRoleName" clearable class="form-dialog-width"/>
          <div class="tips">{{$t('system.role.explain')}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addRole">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="addDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>

     <el-dialog
      width="800px"
      center
      :title="$t('system.role.addUser')"
      :close-on-click-modal="false"
      :visible.sync="addUserModel"
      append-to-body>
      <div class="search-box">
        <el-form label-width="100px" label-position="right" inline size="small">
          <el-form-item :label="$t('system.role.givenName')">
            <el-input v-model.trim="userListParam.firstName" clearable :placeholder="$t('system.role.inputUser')" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.surname')">
            <el-input v-model.trim="userListParam.lastName" clearable :placeholder="$t('system.role.inputName')" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.userAccount')">
            <el-input v-model.trim="userListParam.userAccount" clearable :placeholder="$t('system.role.inputAccount')" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.userPhone')">
            <el-input v-model.trim="userListParam.mobilePhone" clearable :placeholder="$t('system.role.inputPhone')" style="width: 200px"/>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" class="export" @click="searchUser">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="userListData"
        border
        fit
        highlight-current-row
        style="margin: 10px 0"
        size="mini"
        @selection-change="getSelectUserList"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="left" :label="$t('system.role.name')" prop="userName" show-overflow-tooltip>
        </el-table-column>

        <el-table-column align="left" :label="$t('system.role.account')" prop="userAccount" show-overflow-tooltip/>

        <el-table-column align="left" :label="$t('system.role.contact')" prop="mobilePhone" show-overflow-tooltip/>

        <el-table-column align="left" width="80px" :label="$t('system.role.status')" prop="accountStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus
              === 0 ?
              $t('system.role.active') : $t('system.role.disable') }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="userListParam.total" :page.sync="userListParam.pageNum" :limit.sync="userListParam.pageSize" @pagination="searchUser"/>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addUserBatchMethod">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="addUserModel=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!-- 角色详情-->
    <el-dialog :visible.sync="detailModal" :title="$t('system.role.roleDetail')" width="600px" center>
      <el-form :model="detailData" label-width="100px" label-position="right" size="small" inline>
        <el-form-item :label="$t('system.role.roleName')" style="width: 300px">
          <el-input v-model="detailData.roleName" readonly>
            <!--{{detailData.roleName}}-->
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          {{detailData.status === 1 ? $t('system.role.active') : $t('system.role.disable')}}
        </el-form-item>
      </el-form>
      <el-tabs value="1">
        <el-tab-pane :label="$t('system.role.roleMenu')" name="1">
          <div style="max-height: 500px;overflow: auto">
            <el-tree :data="roleTree" :props="{label: language ==='zh' ? 'menuTitleZh' : 'menuTitle'}" check-strictly default-expand-all></el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('system.role.roleMember')" name="2">
          <el-table
            :data="roleUserList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" :label="$t('system.role.name')" prop="userName"/>
            <el-table-column align="center" :label="$t('system.role.contact')" prop="mobilePhone"/>
            <el-table-column align="center" :label="$t('system.role.account')" prop="userAccount">
              <!--<template slot-scope="scope">-->
                <!--<el-tag :type="scope.row.accountStatus === 1 ? 'primary' : 'danger' " size="mini">-->
                  <!--{{scope.row.accountStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}-->
                <!--</el-tag>-->
              <!--</template>-->
            </el-table-column>
          </el-table>
          <Pagination :total="roleUserData.total" :page.sync="roleUserData.pageIndex" :limit.sync="roleUserData.pageSize" @pagination="getRoleUserList"></Pagination>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <!--编辑菜单权限-->
    <el-dialog :visible.sync="dialogVisible" :title="$t('system.role.editRoleAuthorization')" center @closed="clearData">
      <el-form :model="detailData" label-width="100px" label-position="right" size="small" inline style="border-bottom: 1px solid #f4f4f4">
        <el-form-item :label="$t('system.role.roleName')" style="width: 300px">
          <el-input v-model="detailData.roleName" readonly>
            <!--{{detailData.roleName}}-->
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          {{detailData.status === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>
      </el-form>
      <el-tabs value="1">
        <el-tab-pane :label="$t('system.role.roleMenu')" name="1">
          <div style="max-height: 500px;overflow: auto">
            <el-tree ref="allTree" :data="roleAllTree" :props="{label: language ==='zh' ? 'menuTitleZh' : 'menuTitle'}" :default-checked-keys="menuIds" :check-strictly="checkStrictly" show-checkbox node-key="bid"></el-tree>
          </div>
          <div style="text-align: center;margin: 15px 0">
            <el-button type="primary" size="small" @click="saveRoleMenu">{{$t('system.role.seave')}}</el-button>
            <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('system.role.return')}}</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('system.role.roleMember')" name="2">
           <div class="topBtns">
            <el-button type="primary" size="small" @click="addUserDialog">{{$t('system.role.addTheCustomer')}}</el-button>
          </div>
          <el-table
            :data="roleUserList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" :label="$t('system.role.userAccount')" prop="userAccount"/>
            <el-table-column align="center" :label="$t('system.role.userName')" prop="userName"/>
            <el-table-column align="center" width="80px" :label="$t('system.role.status')" prop="prop">
              <template slot-scope="scope">
                <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{
                  scope.row.accountStatus === 0 ? $t('system.role.active') : $t('system.role.inactive') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="80px" :label="$t('system.role.operation')">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="deleteUser(row)">{{$t('system.role.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :total="roleUserData.total" :page.sync="roleUserData.pageIndex" :limit.sync="roleUserData.pageSize" @pagination="getRoleUserList"></Pagination>
          <div style="text-align: center;margin: 15px 0">
            <!--<el-button type="primary" size="small" @click="saveRoleMenu">{{$t('system.role.seave')}}</el-button>-->
            <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('system.role.return')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="danger" size="small" @click="dialogVisible = false">{{$t('system.role.return')}}</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getRoleList,
  // getSysRoleList,
  addRole,
  deleteRole,
  enableRole,
  backendGetMenuByRoleId,
  getRoleUserList,
  getRoleAllTree,
  setRoleMenu,
  selectUserAccountList,
  addRoleMember,
  deleteRoleMember,
  exportBackendRoleByEasypoi
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      checkStrictly: false,
      listLoading: true,
      addLoading: false,
      addModel: false,
      dialogVisible: false,
      detailModal: false,
      addUserModel: false,
      isAddUser: false,
      dialogType: '',
      clientRoleBid: '',
      indent: 20,
      newRoleName: '',
      detailData: {},
      menuIds: [],
      roleUserList: [],
      userListData: [],
      selectList: [],
      selectList1: [],
      userListParam: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        roleName: '',
        status: ''
      },
      roleUserData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      roleData: {
        pageIndex: 1,
        pageSize: 10
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
      list: [],
      roleTree: [],
      roleAllTree: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    clearData() {
      this.addLoading = false;
      this.newRoleName = ''
    },
    changeStatus(row) {
      let obj = {
        enable: row.status === 1 ? 0 : 1,
        id: row.id
      };
      enableRole(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchRole() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    searchUser() {
      this.userListParam.pageIndex = 1;
      this.getDataUserList()
    },
    getDataUserList() {
      // selectUserAccountList
      let obj = {};
      for (let key in this.userListParam) {
        if (this.userListParam[key] !== '') {
          obj[key] = this.userListParam[key]
        }
      }
      if (this.isAddUser) {
        obj.accountStatus = 0
      }
      selectUserAccountList(obj).then(res => {
        if (res.data !== null) {
          this.userListData = res.data.list || [];
          this.userListParam.total = res.data.total;
        }
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      obj.frontBack = 1;
      getRoleList(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    addDialog() {
      this.addModel = !this.addModel;
    },
    addUserDialog() {
      this.addUserModel = !this.addUserModel;
      this.userListData = [];
      this.isAddUser = true;
      this.searchUser();
    },
    openDialog(row) {
      this.detailData = deepClone(row);
      // console.log(this.detailData)
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.getRoleAllTree();
      this.clientRoleBid = this.detailData.bid;
      this.getRoleUserList(this.clientRoleBid);
    },
    confirmAdd() {
      this.addModel = false;
    },
    getSelectUserList(selects) {
      this.selectList = selects;
    },
    addUserBatchMethod() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t("system.userManage.option"));
      }
      // else {
      //   for (let i = 0; i < this.selectList.length; i++) {
      //     for (let j = 0; j < this.roleUserList.length; j++) {
      //       if (this.selectList[i].accountBId === this.roleUserList[j].accountBId) {
      //         return this.$message.warning(this.$t("system.role.repeatAddUser"))
      //       }
      //     }
      //   }
      // }
      this.$confirm(this.$t('system.userManage.wheAdd'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.accountBId;
        }).join(",");
        let formData = new FormData();
        formData.append('accountBids', this.deleteIdsForm);
        formData.append("roleBid", this.detailData.bid);
        addRoleMember(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.addUserModel = false;
          this.getRoleUserList(this.detailData.bid);
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    openDetail(row) {
      this.detailData = deepClone(row);
      this.detailModal = true;
      this.getRoleTree(this.detailData.bid);
      this.clientRoleBid = this.detailData.bid;
      this.getRoleUserList(this.clientRoleBid);
    },
    getRoleTree(bid) {
      backendGetMenuByRoleId({ bId: bid }).then(res => {
        this.roleTree = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getRoleUserList() {
      this.roleUserData.roleBid = this.clientRoleBid;
      getRoleUserList(this.roleUserData).then(res => {
        this.roleUserList = res.data.list || [];
        this.roleUserData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getRoleAllTree() {
      getRoleAllTree({ bId: this.detailData.bid }).then(res => {
        this.roleAllTree = res.data || [];
        // console.log(this.roleAllTree)
        this.menuIds = this.getMenuIds(res.data, 'check');
        this.$store.commit('SET_ROLEROUTES', res.data);
        this.getRoutes();
        this.checkStrictly = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getMenuIds(arr = [], val) {
      let menuId = [];
      arr.forEach(e => {
        e.path = e.menuPath;
        if (e.menuLevel === 0) {
          e.root = true;
        }
        if (e[val]) {
          menuId.push(e.bid);
        }
        if (e.children && e.children.length) {
          menuId = menuId.concat(this.getMenuIds(e.children, val))
        }
      });
      return menuId;
    },
    saveRoleMenu() {
      let obj = {
        menuBIds: this.$refs.allTree.getCheckedKeys().concat(this.$refs.allTree.getHalfCheckedKeys()),
        roleBId: this.detailData.bid,
        accountType: 2
      };
      setRoleMenu(obj).then(res => {
        this.getDataList()
        this.dialogVisible = false;
        this.$message.success(this.$t("system.role.saveSuccess"))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    addRole() {
      if (!this.newRoleName) {
        return this.$message.warning(this.$t("system.role.fillRole"))
      }
      let obj = { roleName: this.newRoleName, status: 1 };
      this.addLoading = true;
      obj.frontBack = 1;
      addRole(obj).then(res => {
        this.$message.success(this.$t("system.role.saveAdd"));
        this.postData.pageIndex = 1;
        this.addLoading = false;
        this.newRoleName = '';
        this.getDataList();
        this.addDialog()
      }).catch(err => {
        this.addLoading = false;
        this.$message.error(err.message)
      });
    },
    deleteRole() {
      if (!this.selectList1.length) {
        return this.$message(this.$t("system.role.selectRows"));
      } else {
        for (let i = 0; i < this.selectList1.length; i++) {
          if (this.selectList1[i].status === 1) {
            return this.$message.warning(this.$t("system.role.userStatus"))
          } else {
            if (this.selectList1[i].userNum !== 0) {
              return this.$message.warning(this.language === 'zh' ? '该角色下存在用户，无法进行删除!' : 'There are users under this role, unable to delete!')
            }
          }
        }
      }
      // if (this.selectList1.length > 1) {
      //   return this.$message(this.$t("system.role.OnlyOne"));
      // }
      this.$confirm(this.$t('system.userManage.whether'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: this.selectList1[0].id };
        deleteRole(obj).then(res => {
          this.getDataList();
          this.$message.success(this.$t("system.role.saveDelete"));
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    deleteUser(row) {
      this.$confirm(this.$t("system.role.deleteRole"), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = new FormData();
        obj.append("id", row.id);
        deleteRoleMember(obj).then(res => {
          this.getRoleUserList(this.detailData.bid);
          this.$message.success(this.$t('system.role.saveDelete'));
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    getSelect1(selects) {
      this.selectList1 = selects
    },
    exportRole() {
      let obj = {
        pageSize: "",
        pageNum: ""
      };
      exportBackendRoleByEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'adminRole.xls');
        document.body.appendChild(link);
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
    },
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

.roleManagement {
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
}
</style>
