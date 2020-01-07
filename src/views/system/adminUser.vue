<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item :label="$t('system.userManage.account')">
            <el-input v-model.trim="postData.userAccount" style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.name')">
            <el-input v-model.trim="postData.lastName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.accountStatus" clearable style="width: 150px">
              <el-option v-for="(item, index) in areaList" :label="isZh ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('system.role.roleName')">
            <el-select v-model="postData.roleInfoBId" clearable style="width: 200px">
              <el-option
                v-for="item in sysRoleList"
                :key="item.bid"
                :label="item.roleName"
                :value="item.bid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('system.role.contact')">
            <el-input v-model.trim="postData.mobilePhone" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.isLead')">
            <el-select v-model="postData.isLead" :placeholder="$t('system.role.all')" clearable style="width: 150px">
              <el-option v-for="(item, index) in bossList" :label="isZh ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportUser">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.userManage.account')" prop="userAccount" show-overflow-tooltip />

      <el-table-column :label="$t('system.role.name')" show-overflow-tooltip prop="lastName">
        <template slot-scope="scope">
          {{scope.row.lastName}} {{scope.row.firstName }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('system.role.roleName')" prop="rolesStr" show-overflow-tooltip />

      <!--<el-table-column :label="$t('system.userManage.email')" prop="emailAddress" show-overflow-tooltip align="center"/>-->

      <el-table-column :label="$t('system.role.contact')" prop="mobilePhone" show-overflow-tooltip/>

      <el-table-column width="100" align="center" :label="$t('system.role.modifier')" prop="updateUserName" show-overflow-tooltip/>

      <el-table-column width="160" align="center" :label="$t('system.userManage.editTime')" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.updateTime | timeFmt}}</template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="accountStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus
            === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="195" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.accountStatus === 0 ? 'info' : 'danger'" size="mini" @click="changeMethod(row)">
            {{row.accountStatus === 0 ? $t('system.role.disable') : $t('system.role.enable')}}
          </el-button>
          <!--<el-button type="primary" size="mini" @click="unlockPassword(row)">{{$t('system.userManage.unlock')}}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
    <!-- 详情-->
    <el-dialog :visible.sync="detialModel" :title="$t('system.role.userDetails')" class="dialogClass" center width="800px">
      <el-form label-width="120px" label-position="left" size="small">
        <el-row :gutter="28">
          <el-col :span="16">
            <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
              <el-input v-model="sysUserForm.userAccount" readonly />
            </el-form-item>
            <el-form-item :label="$t('system.userManage.employee')" prop="accountId">
              <el-input v-model="sysUserForm.accountId" readonly />
            </el-form-item>
            <!--<el-form-item label="账号id" hidden>-->
              <!--<el-input v-model="sysUserForm.accountBId" readonly/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('system.role.givenName')" prop="firstName">
              <el-input v-model="sysUserForm.firstName" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')" prop="lastName">
              <el-input v-model="sysUserForm.lastName" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex" >
              <el-radio-group v-model="sysUserForm.userSex" disabled>
                <el-radio :label="1">{{$t('system.role.man')}}</el-radio>
                <el-radio :label="2">{{$t('system.role.woman')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="avatar">
              <el-upload
                disabled
                class="avatar-uploader"
                :action="uploadActionUrl"
                :headers="upLoadHeaders"
                :data="{type: 3}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="sysUserForm.photoPath" :src="fullUrl(sysUserForm.photoPath)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.userManage.email')" prop="emailAddress">
          <el-input v-model="sysUserForm.emailAddress" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="contactAddress">
          <el-input v-model="sysUserForm.contactAddress" readonly/>
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="officePhone">
              <el-input v-model="sysUserForm.officePhone" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
              <el-input v-model="sysUserForm.officePhone2" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')" prop="mobilePhone">
              <el-input v-model="sysUserForm.mobilePhone" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
              <el-input v-model="sysUserForm.mobilePhone2" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')">
              <el-select v-model="sysUserForm.usedLanguage" clearable disabled @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="preferedLanguageStr">
              <el-select v-model="sysUserForm.preferedLanguageStr" multiple @change="getcommLanguage" disabled>
                <el-option v-for="(item, index) in languageList1" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.role.roleName')" prop="roles">
          <el-select v-model="sysUserForm.roles" multiple disabled style="width: 100%">
            <el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="初始化账号密码" v-if="dialogType==='add'" prop="password">-->
        <!--<el-input v-model="sysUserForm.password" clearable placeholder="请输入账号初始化密码"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.company')" prop="companyName">
          <el-select v-model="sysUserForm.companyStr" multiple disabled style="width: 100%" @change="getDefaultCompany">
            <el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.default')" prop="usedCompanyName">
          <el-select v-model="sysUserForm.usedCompany" disabled style="width: 100%">
            <el-option v-for="(item, index) in defaultCompanyList" :label="item.companyName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.department')" prop="departments">
          <el-select v-model="sysUserForm.departments" multiple disabled style="width: 100%">
            <el-option v-for="(item, index) in departmentList" :label="item.departmentName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="sysUserForm.position" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.isLead')" >
          <el-radio-group v-model="sysUserForm.isLead" disabled>
            <el-radio :label="1">{{$t('system.role.yes')}}</el-radio>
            <el-radio :label="0">{{$t('system.role.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{sysUserForm.accountStatus === 1 ? $t('system.userManage.inDisable') : $t('system.userManage.inEmploy')}}
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailDialogClos()">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'? $t('system.role.addTheCustomer'):$t('system.role.editTheCustomer')" @close="clearData" center width="800px">
      <el-form :model="sysUserForm" ref="ruleForm" v-if="dialogVisible" label-width="120px" label-position="left" size="small" :rules="sysUserDataRules">
        <el-row :gutter="28">
          <el-col :span="16">
            <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
              <el-input v-model="sysUserForm.userAccount" :disabled="dialogType === 'edit'" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.userManage.employee')" prop="accountId">
              <el-input v-model="sysUserForm.accountId" clearable />
            </el-form-item>
            <!--<el-form-item label="账号id" hidden>-->
              <!--<el-input v-model="sysUserForm.accountBId" clearable/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('system.role.givenName')" prop="firstName">
              <el-input v-model="sysUserForm.firstName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')" prop="lastName">
              <el-input v-model="sysUserForm.lastName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex">
              <el-radio-group v-model="sysUserForm.userSex">
                <el-radio :label="1">{{$t('system.role.man')}}</el-radio>
                <el-radio :label="2">{{$t('system.role.woman')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="avatar">
              <el-upload
                class="avatar-uploader"
                :action="uploadActionUrl"
                :headers="upLoadHeaders"
                :data="{type: 3}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="sysUserForm.photoPath" :src="fullUrl(sysUserForm.photoPath)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.userManage.email')" prop="emailAddress">
          <el-input v-model="sysUserForm.emailAddress" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="contactAddress">
          <el-input v-model="sysUserForm.contactAddress" clearable />
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="mobilePhone">
              <el-input v-model="sysUserForm.mobilePhone" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
              <el-input v-model="sysUserForm.officePhone2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')" prop="officePhone">
              <el-input v-model="sysUserForm.officePhone" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
              <el-input v-model="sysUserForm.mobilePhone2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')">
              <el-select v-model="sysUserForm.usedLanguage" clearable @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="preferedLanguageStr">
              <el-select v-model="sysUserForm.preferedLanguageStr" multiple @change="getcommLanguage">
                <el-option v-for="(item, index) in languageList1" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.role.roleName')" prop="roles">
          <el-select v-model="sysUserForm.roles" multiple clearable style="width: 100%" ref="roles">
            <el-option v-for="(item, index) in sysRoleList" :disabled="item.status === 0" :label="item.roleName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="初始化账号密码" v-if="dialogType==='add'" prop="password">-->
        <!--<el-input v-model="sysUserForm.password" clearable placeholder="请输入账号初始化密码"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.company')" prop="companyStr">
          <el-select v-model="sysUserForm.companyStr" multiple clearable style="width: 100%" @change="getDefaultCompany">
            <el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.default')" prop="usedCompany">
          <el-select v-model="sysUserForm.usedCompany" clearable style="width: 100%">
            <el-option v-for="(item, index) in defaultCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.department')" prop="departments">
          <el-select v-model="sysUserForm.departments" multiple clearable style="width: 100%">
            <el-option v-for="(item, index) in departmentList" :label="item.departmentName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="sysUserForm.position" clearable />
        </el-form-item>
        <!--<el-form-item :label="$t('system.userManage.isLead')">-->
          <!--<el-select v-model="sysUserForm.isLead" multiple clearable style="width: 100%">-->
            <!--<el-option v-for="(item, index) in isLeadList" :label="item.label" :value="item.id" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.isLead')" >
          <el-radio-group v-model="sysUserForm.isLead">
            <el-radio :label="1">{{$t('system.role.yes')}}</el-radio>
            <el-radio :label="0">{{$t('system.role.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{sysUserForm.accountStatus === 1 ? $t('system.userManage.inDisable') : $t('system.userManage.inEmploy')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="unlockPassword">{{$t('system.userManage.unlock')}}</el-button>
        <el-button type="primary" size="small" @click="resetPwdMethod">{{$t('system.userManage.reset')}}</el-button>
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  selectUserAccountList,
  addSysUser,
  editSysUser,
  // deleteSysUser,
  deleteBatchSysUser,
  enableSysUser,
  getDepartmentList,
  getSupplyCompanyList,
  getSysRoleList,
  selectUserBackdetail,
  resetPwd,
  exportBackendUserByEasypoi,
  selectgetDictionaryBykeyApi
  // getRoleList
} from '@/api/system'
import { uploadActionUrl } from '@/api/common'
import { unlockPassword } from '@/api/user'
import treeMenu from '@/mixin/treeMenu'
import { parseTime } from "@/utils/index";
import { validPhone } from '@/utils/validate'
export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('common.tip.emptyMsg')));
      } else if (!validPhone(value)) {
        callback(new Error(this.$t('common.tip.phoneMsg')));
      } else {
        callback();
      }
    };
    return {
      uploadActionUrl,
      listLoading: true,
      addLoading: false,
      detialModel: false,
      dialogVisible: false,
      detailModal: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      sysUserForm: {
        isLead: 1,
        accountBId: '',
        userAccount: '',
        accountId: '',
        firstName: '',
        lastName: '',
        userSex: 1,
        emailAddress: '',
        contactAddress: '',
        officePhone: '',
        officePhone2: '',
        mobilePhone: '',
        mobilePhone2: '',
        usedLanguage: '',
        preferedLanguageStr: [],
        usedCompanyName: '',
        department: '',
        parDepartment: '',
        company: '',
        roles: [],
        usedCompany: '',
        photoPath: '',
        departments: [],
        position: '',
        approvalType: ''
      },
      departmentList: [],
      supplyCompanyList: [],
      sysRoleList: [],
      detailData: {},
      rowData: {},
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        roleName: '',
        accountStatus: '',
        isLead: ''
      },
      departmentData: {
        departmentCode: '',
        departmentName: '',
        departmentStatus: ''
      },
      roleList: [],
      areaList: [
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          label: 'Enabled',
          labelZh: '使用中',
          id: 0
        },
        {
          label: 'Disabled',
          labelZh: '已禁用',
          id: 1
        }
      ],
      bossList: [
        {
          labelZh: '全部',
          label: 'All',
          id: ''
        },
        {
          label: 'Yes',
          labelZh: '是',
          id: 0
        },
        {
          label: 'No',
          labelZh: '否',
          id: 1
        }
      ],
      isLeadList: [
        {
          label: this.$t("system.role.yes"),
          id: 1
        },
        {
          label: this.$t("system.role.no"),
          id: 0
        }
      ],
      languageList: [],
      languageList1: [],
      list: [],
      defaultCompanyList: [],
      sysUserDataRules: {
        userAccount: [
          { required: true, message: this.$t('system.userManage.userAccount'), trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: this.$t('system.userManage.lastName'), trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: this.$t('system.userManage.firstName'), trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: this.$t('system.userManage.userGender'), trigger: ['blur'] }
        ],
        emailAddress: [
          { required: true, message: this.$t('system.userManage.userEmail'), trigger: 'blur' },
          { type: 'email', message: this.$t('system.userManage.userEmail'), trigger: 'blur' }
        ],
        contactAddress: [
          { required: true, message: this.$t('system.userManage.userAddress'), trigger: 'blur' }
        ],
        mobilePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        officePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        preferedLanguage: [
          { required: true, message: this.$t('system.userManage.userLanguage'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('system.userManage.userPassword'), trigger: 'blur' }
        ],
        departments: [
          { required: true, message: this.$t('system.userManage.userDepartment'), trigger: 'blur' }
        ],
        companyStr: [
          { required: true, message: this.$t('system.userManage.userCompany'), trigger: 'blur' }
        ],
        usedCompany: [
          { required: true, message: this.$t('system.userManage.defaultCompany'), trigger: 'blur' }
        ],
        roles: [
          { required: true, message: this.$t('system.userManage.userPart'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getLanguageList()
    this.getDataList();
    this.getDepartmentListMethod(); // 部门列表
    this.getSupplyCompanyListMethod();// 公司列表
    this.getSysRoleListMethod();// 角色列表
  },
  methods: {
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    clearData() {
      this.$refs['ruleForm'].resetFields();
      this.addLoading = false
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectUserAccountList(obj).then(res => {
        this.list = (res.data.list || []).map(e => {
          if (e.rolesStr) {
            e.rolesStr = e.rolesStr.split(',').filter(e => e).join(',')
          }
          return { ...e }
        })
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getParentId(arr) {
      if (arr.length) {
        this.sysUserForm.department = arr[arr.length - 1];
        this.sysUserForm.parDepartment = arr.join(',')
      } else {
        this.sysUserForm.department = '';
        this.sysUserForm.parDepartment = ''
      }
    },
    // 数据字典,获取常用语言
    getLanguageList() {
      selectgetDictionaryBykeyApi({ key: 'UserLanguage' }).then(res => {
        this.languageList = res.data.map(e => {
          return { ...e }
        });
        this.languageList1 = res.data.map(e => {
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    setOtherList(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.value !== val
      });
      if (this.sysUserForm.preferedLanguageStr.includes(val)) {
        this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    getcommLanguage(arr) {
      if (arr.length) {
        this.sysUserForm.preferedLanguage = arr.join(',')
      } else {
        this.sysUserForm.preferedLanguage = ''
      }
    },
    getDefaultCompany(arr) {
      if (arr.length) {
        this.sysUserForm.company = arr.join(',')
      } else {
        this.sysUserForm.company = arr.join(',')
      }
      this.defaultCompanyList = this.supplyCompanyList.filter(e => {
        return arr.includes(e.bid)
      })
    },
    // 关闭详情模块
    detailDialogClos() {
      this.detialModel = false;
    },
    // 详情模块
    detailDialog(row) {
      this.getSysRoleListMethod();
      selectUserBackdetail({ accountCode: row.accountBId }).then(res => {
        this.sysUserForm = Object.assign(this.sysUserForm, res.data);
        if (this.sysUserForm.preferedLanguage) {
          this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguage.split(',')
        } else {
          this.sysUserForm.preferedLanguageStr = []
        }
        if (this.sysUserForm.company) {
          this.sysUserForm.companyStr = this.sysUserForm.company.split(',')
          this.defaultCompanyList = this.supplyCompanyList.filter(e => {
            return this.sysUserForm.companyStr.includes(e.bid)
          })
        } else {
          this.sysUserForm.companyStr = []
        }
        this.languageList1 = this.languageList.filter(e => {
          return e.value !== this.sysUserForm.usedLanguage
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
      // 回显上级
      this.detialModel = true;
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        selectUserBackdetail({ accountCode: row.accountBId }).then(res => {
          this.sysUserForm = Object.assign(this.sysUserForm, res.data);
          this.sysUserForm.mobilePhone = parseInt(this.sysUserForm.mobilePhone)
          this.getSysRoleListMethod()
          if (this.sysUserForm.preferedLanguage) {
            this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguage.split(',')
          } else {
            this.sysUserForm.preferedLanguageStr = []
          }
          if (this.sysUserForm.company) {
            this.sysUserForm.companyStr = this.sysUserForm.company.split(',')
            this.defaultCompanyList = this.supplyCompanyList.filter(e => {
              return this.sysUserForm.companyStr.includes(e.bid)
            })
          } else {
            this.sysUserForm.companyStr = []
          }
          this.languageList1 = this.languageList.filter(e => {
            return e.value !== this.sysUserForm.usedLanguage
          });
        }).catch(err => {
          this.$message.error(err.message)
        });
      } else {
        this.sysUserForm = {
          preferedLanguageStr: [],
          departments: [],
          roles: [],
          companyStr: [],
          userSex: 1,
          isLead: 1,
          photoPath: ''
        };
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.dialogVisible = false;
    },
    // openDetail(row) {
    //   this.detailData = deepClone(row);
    //   if (this.detailData.parDepartment) {
    //     this.detailData.departments = this.detailData.parDepartment.split(',')
    //   }
    //   this.detailModal = true;
    // },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.sysUserForm.accountBId) {
            this.addLoading = true
            editSysUser(this.sysUserForm).then(res => {
              this.$message.success(this.$t('system.userManage.updata'));
              this.postData.pageNum = 1;
              this.dialogVisible = false;
              this.addLoading = false
              this.getDataList();
              this.closOPenDialog();
            }).catch(err => {
              this.addLoading = false
              this.$message.error(err.message);
            });
          } else {
            this.addLoading = true
            addSysUser(this.sysUserForm).then(res => {
              this.$message.success(this.$t('system.userManage.addSuccess'));
              this.postData.pageNum = 1;
              this.dialogVisible = false;
              this.addLoading = false
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.addLoading = false
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error(this.$t('system.userManage.check'))
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message.warning(this.$t('system.userManage.option'));
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].accountStatus !== 1) {
            return this.$message.warning(this.$t("system.role.userStatus"))
          }
        }
      }
      this.$confirm(this.$t('system.userManage.whether'), this.$t('system.userManage.hint'), {
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
        formData.append('accountBIds', this.deleteIdsForm)
        deleteBatchSysUser(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.role.handle"));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // deleteMethod(row) {
    //   this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
    // confirmButtonClass: 'el-button-confirmClass',
    // cancelButtonClass: 'el-button-cancelClass',
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     let obj = { accountCode: row.accountCode };
    //     deleteSysUser(obj).then(res => {
    //       this.searchData();
    //       this.$message.success('删除成功');
    //     }).catch(err => {
    //       this.$message.error(err.message)
    //     });
    //   }).catch(() => {
    //   });
    // },
    // 获取部门列表
    getDepartmentListMethod() {
      getDepartmentList().then(res => {
        this.departmentList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    resetPwdMethod() {
      resetPwd({ accountBid: this.sysUserForm.accountBId }).then(res => {
        this.$message.success(this.$t('system.userManage.resetSuccess'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 解锁密码
    unlockPassword(row) {
      unlockPassword({ accountBid: this.sysUserForm.accountBId || row.accountBId }).then(res => {
        this.$message.success(this.$t('system.userManage.unlocked'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取国家列表
    getSupplyCompanyListMethod() {
      getSupplyCompanyList({}).then(res => {
        this.supplyCompanyList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取角色列表
    getSysRoleListMethod() {
      getSysRoleList({ type: 1 }).then(res => {
        this.sysRoleList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 禁用或启用
    changeMethod(row) {
      let obj = {
        type: row.accountStatus === 1 ? 0 : 1,
        accountBId: row.accountBId
      };
      enableSysUser(obj).then(res => {
        this.searchData();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    handleAvatarSuccess(res, file) {
      this.sysUserForm.photoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t('system.userManage.loading1'));
      }
      if (!isLt3M) {
        this.$message.error(this.$t('system.userManage.loading2'));
      }
      return isJPG && isLt3M;
    },
    exportUser() {
      let obj = {
        pageSize: "",
        pageNum: ""
      };
      exportBackendUserByEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'adminUser.xls');
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
        return parseTime(val);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

  .avatar {
    width: 60%;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
