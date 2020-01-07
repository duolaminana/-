<template>
  <div class="app-container clientUser">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item :label="$t('system.userManage.account')">
            <el-input v-model.trim="postData.userAccount" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.name')">
            <el-input v-model.trim="postData.lastName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.accountStatus" clearable :placeholder="$t('system.role.all')" style="width: 150px">
              <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('system.userManage.country')">
            <!--<el-input v-model="postData.countryCode" clearable style="width: 200px" />-->
            <el-select v-model="postData.countryCode" filterable clearable :placeholder="$t('system.role.all')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('system.userManage.company')">
            <el-input v-model.trim="postData.companyName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchRole">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="addClientSupplier">{{$t('system.role.add')}}</el-button>-->
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
      </el-table-column>menu
      <el-table-column :label="$t('system.userManage.account')" prop="userAccount" show-overflow-tooltip/>
      <el-table-column :label="$t('system.role.name')" show-overflow-tooltip prop="lastName" >
        <template slot-scope="scope">
          {{scope.row.lastName}}{{scope.row.firstName }}
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('system.role.roleName')" width="90" prop="rolesStr" show-overflow-tooltip>-->
        <!--<el-select v-model="list.roles" multiple clearable style="width: 100%" >-->
          <!--<el-option v-for="(item, index) in roles" :label="item.roleName" :value="item.bid" :key="index"></el-option>-->
        <!--</el-select>-->
      <!--</el-table-column>-->
      <el-table-column :label="$t('system.role.contact')" prop="mobilePhone" show-overflow-tooltip/>
      <el-table-column :label="$t('system.userManage.country')" width="80" :prop="language === 'zh' ? 'countryChName' : 'countryEnName'" show-overflow-tooltip/>
      <el-table-column :label="$t('system.userManage.company')" prop="companyName" show-overflow-tooltip/>
      <el-table-column width="100" align="center" :label="$t('system.role.modifier')" prop="updateUserName" show-overflow-tooltip/>
      <el-table-column width="160" align="center" :label="$t('system.userManage.editTime')" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="accountStatus" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--{{scope.row.accountStatus | statusFmt(isZh)}}-->
          <el-tag :type="scope.row.accountStatus === 1 ? 'danger' : 'primary' " size="mini">
            {{scope.row.accountStatus | statusFmt(isZh)}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="195" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="warning" size="mini" @click="editDetail(row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.accountStatus === 0 ? 'info' : 'danger'" v-if="row.accountStatus !== 2" size="mini" @click="changeStatus(row)">{{row.accountStatus === 0 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    <!-- 详情-->
    <el-dialog :visible.sync="detailModal3" :title="$t('system.userManage.userDetails')" center width="800px">
      <el-form label-width="120px" label-position="left" size="small" :model="entityForm">
          <div class="divinline">
            <el-form-item :label="$t('system.userManage.account')">
              <el-input v-model="entityForm.userAccount" clearable class="form-dialog-width2" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.givenName')">
              <el-input v-model="entityForm.firstName" clearable class="form-dialog-width2" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')">
              <el-input v-model="entityForm.lastName" clearable class="form-dialog-width2" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex" >
              <el-radio-group v-model="entityForm.userSex" disabled>
                <el-radio :label="1">{{$t('system.role.man')}}</el-radio>
                <el-radio :label="2">{{$t('system.role.woman')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

        <div class="divinline">
          <el-form-item>
            <el-upload
              class="avatar-uploader"
              :headers="upLoadHeaders"
              :action="uploadActionUrl"
              :data="{type: 3}"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="entityForm.photoPath" :src="fullUrl(entityForm.photoPath)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div></div>
        <el-form-item :label="$t('system.userManage.emailAddress')">
          <el-input v-model="entityForm.emailAddress" clearable readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')">
          <el-input v-model="entityForm.contactAddress" clearable readonly/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')">
              <el-input v-model="entityForm.officePhone" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')">
              <el-input v-model="entityForm.officePhone2" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')">
              <el-input v-model="entityForm.mobilePhone" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')">
              <el-input v-model="entityForm.mobilePhone2" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')">
              <el-select v-model="entityForm.usedLanguage" clearable disabled >
                <el-option v-for="(item, index) in languageList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')">
              <el-select v-model="entityForm.preferedLanguageStr" multiple disabled>
                <el-option v-for="(item, index) in languageList1" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-form-item :label="$t('system.role.roleName')">-->
          <!--<el-select v-model="entityForm.roles" multiple disabled style="width: 100%">-->
            <!--<el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('system.userManage.company')">-->
          <!--<el-input v-model="entityForm.companyName" clearable readonly/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.country')" prop="countryCode">
          <!--<el-input v-model="sysUserForm.countryCode" :min="0" clearable />-->
          <el-select v-model="entityForm.countryCode" clearable filterable :placeholder="$t('system.role.all')" disabled style="width: 200px">
            <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')">
          <el-input v-model="entityForm.position" clearable readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          {{entityForm.accountStatus === 0 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>

      </el-form>
      <el-table
        v-loading="listLoading"
        :data="clientList"
        :element-loading-text="$t('system.userManage.lodding')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" :label="isZh?'公司':'Company'" prop="orgBidName" show-overflow-tooltip/>
        <el-table-column align="center" :label="isZh?'类别':'Type'" show-overflow-tooltip prop="accountType" >
          <template slot-scope="scope">
            {{scope.row.accountType | clientType }}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="getClientSupplierList.total" :page.sync="getClientSupplierList.pageNum" :limit.sync="getClientSupplierList.pageSize" @pagination="getClientSupplier" ></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal3=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
      </el-dialog>
      <!--新增-->
      <el-dialog :visible.sync="clientSupplier" :title="isZh?'添加用户':'Add Frontend User Information'" center width="800px" @close="clearData">
        <el-radio-group v-model="clientRadio" style="margin-bottom: 20px" @change="switchClient">
          <el-radio label="0">{{isZh?'客户公司': 'Client Company'}}</el-radio>
          <el-radio label="1">{{isZh?'商品供应商': 'Standard Product Supplier'}}</el-radio>
          <el-radio label="2">{{isZh?'物流供应商': 'Logistics supplier'}}</el-radio>
          <el-radio label="3">{{isZh?'金融供应商': 'Financial suppliers'}}</el-radio>
        </el-radio-group>
        <el-form label-width="100px" label-position="right" inline size="small" v-if="!isShow">
          <el-form-item :label="$t('customer.record.client')">
            <el-input v-model.trim="addUserList.companyName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('customer.record.clientCode')">
            <el-input v-model.trim="addUserList.customerCode" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.contact')">
            <el-input v-model.trim="addUserList.mobilePhone" clearable style="width: 200px"/>
          </el-form-item>
          <!--<el-form-item :label="$t('system.role.userPhone')">-->
          <!--<el-input v-model="userListParam.mobilePhone" clearable :placeholder="$t('system.role.inputPhone')" style="width: 200px"/>-->
          <!--</el-form-item>-->
          <el-form-item style="float:right;">
            <el-button type="primary" class="export" @click="searchUser">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </el-form>
        <el-form label-width="100px" label-position="right" inline size="small" v-if="isShow">
          <el-form-item :label="$t('supplier.record.supplierName')">
            <el-input v-model="addSupplierUserList.supplierName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.supplierCode')">
            <el-input v-model="addSupplierUserList.supplierCode" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.contact')">
            <el-input v-model="addSupplierUserList.mobilePhone" clearable style="width: 200px"/>
          </el-form-item>
          <!--<el-form-item :label="$t('system.role.userPhone')">-->
          <!--<el-input v-model="userListParam.mobilePhone" clearable :placeholder="$t('system.role.inputPhone')" style="width: 200px"/>-->
          <!--</el-form-item>-->
          <el-form-item style="float:right;">
            <el-button type="primary" class="export" @click="searchUser">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-if="!isShow"
          v-loading="listLoading"
          :data="ClientDataList"
          :element-loading-text="$t('system.userManage.lodding')"
          border
          fit
          ref="Table"
          size="mini"
          :header-cell-class-name="cellClass"
          :header-cell-style="{background: '#a7bfee'}" @selection-change="getClientSelect">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column :label="$t('customer.record.client')" prop="companyName" show-overflow-tooltip/>
          <el-table-column :label="$t('customer.record.clientCode')" width="120" prop="customerCode" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('system.role.contact')" width="120" prop="mobilePhone" show-overflow-tooltip/>
          <el-table-column :label="$t('system.userManage.country')" width="120" :prop="language === 'zh' ? 'cnCountryName' : 'enCountryName'" show-overflow-tooltip/>
          <!--<el-table-column :label="$t('system.userManage.company')" prop="companyName" show-overflow-tooltip/>-->
          <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="customerStatus" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.customerStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.customerStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <Pagination v-if="!isShow" :total="addUserList.total" :page.sync="addUserList.pageNum" :limit.sync="addUserList.pageSize" @pagination="addClientSupplier" ></Pagination>
        <el-table
          v-if="isShow"
          v-loading="listLoading"
          :data="SupplierDataList"
          :element-loading-text="$t('system.userManage.lodding')"
          border
          fit
          ref="Table"
          size="mini"
          :header-cell-class-name="cellClass"
          :header-cell-style="{background: '#a7bfee'}" @selection-change="getClientSelect">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column :label="$t('supplier.record.supplierName')" prop="supplierName" show-overflow-tooltip/>
          <el-table-column :label="$t('supplier.record.supplierCode')" width="120" prop="supplierCode" show-overflow-tooltip></el-table-column>
          <el-table-column :label="$t('system.role.contact')" width="120" prop="officePhone" show-overflow-tooltip/>
          <el-table-column :label="$t('system.userManage.country')" width="120" :prop="language === 'zh' ? 'cnCountryName' : 'enCountryName'" show-overflow-tooltip/>
          <!--<el-table-column :label="$t('system.userManage.company')" prop="companyName" show-overflow-tooltip/>-->
          <el-table-column align="center" width="80" :label="$t('system.role.status')" prop="customerStatus" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.supplierStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.supplierStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <Pagination v-if="isShow" :total="addSupplierUserList.total" :page.sync="addSupplierUserList.pageNum" :limit.sync="addSupplierUserList.pageSize" @pagination="getSuplier" ></Pagination>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" :loading="addLoading" @click="addMethod">{{$t('system.role.seave')}}</el-button>
          <el-button type="danger" size="small" @click="clientSupplier = false">{{$t('system.role.return')}}</el-button>
        </div>
      </el-dialog>
    <!--编辑-->
    <el-dialog :visible.sync="editUser" :title="$t('system.role.editUserForm')" center width="800px" @close="clearData1">
      <el-form :model="editForm" ref="ruleForm" label-width="120px" label-position="left" size="small" :rules="sysUserDataRules1">
        <el-row :gutter="28" style="margin-bottom: 20px">
          <el-col :span="16">
            <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
              <el-input v-model="editForm.userAccount" :disabled="dialogType === 'edit'" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.givenName')" prop="firstName">
              <el-input v-model="editForm.firstName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')" prop="lastName">
              <el-input v-model="editForm.lastName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex">
              <el-radio-group v-model="editForm.userSex">
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
                <img v-if="editForm.photoPath" :src="fullUrl(editForm.photoPath)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.userManage.emailAddress')" prop="emailAddress">
          <el-input v-model="editForm.emailAddress" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="contactAddress">
          <el-input v-model="editForm.contactAddress" clearable />
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="officePhone">
              <el-input v-model="editForm.officePhone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
              <el-input v-model="editForm.officePhone2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')" prop="mobilePhone">
              <el-input v-model="editForm.mobilePhone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
              <el-input v-model="editForm.mobilePhone2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')" prop="preferedLanguageStr">
              <el-select v-model="editForm.usedLanguage" clearable @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="usedLanguage">
              <el-select v-model="editForm.preferedLanguageStr" multiple @change="getcommLanguage">
                <el-option v-for="(item, index) in languageList1" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-form-item :label="$t('system.role.roleName')" prop="roles">-->
          <!--<el-select v-model="editForm.roles" multiple clearable style="width: 100%" @change="getRoleBId">-->
            <!--<el-option v-for="(item, index) in sysRoleList" :disabled="item.status === 0" :label="item.roleName" :value="item.bid" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
          <!--<el-form-item :label="$t('system.userManage.company')" prop="companyName">-->
            <!--<el-input v-model="editForm.companyName" :min="0" clearable />-->
          <!--</el-form-item>-->
        <!--<el-form-item :label="$t('system.userManage.company')" prop="companyName">-->
          <!--<el-select v-model="editForm.companyName" multiple clearable style="width: 100%" @change="getDefaultCompany">-->
            <!--<el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.country')" prop="countryCode">
          <!--<el-input v-model="editForm.countryCode" :min="0" clearable />-->
          <el-select v-model="editForm.countryCode" clearable filterable :placeholder="$t('system.role.all')" style="width: 200px">
            <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="editForm.position" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{editForm.accountStatus === 0 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>
      </el-form>
      <div class="topBtns">
        <el-button type="primary" size="small" @click="addClientSupplier">{{$t('system.role.add')}}</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="clientList"
        :element-loading-text="$t('system.userManage.lodding')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" :label="isZh?'公司':'Company'" prop="orgBidName" show-overflow-tooltip/>
        <el-table-column align="center" :label="isZh?'类别':'Type'" show-overflow-tooltip prop="accountType" >
          <template slot-scope="scope">
            {{scope.row.accountType | clientType(isZh) }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="deleteClient(row)">{{$t('system.role.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="getClientSupplierList.total" :page.sync="getClientSupplierList.pageNum" :limit.sync="getClientSupplierList.pageSize" @pagination="getClientSupplier" ></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="unlockPassword">{{$t('system.userManage.unlock')}}</el-button>
        <el-button type="primary" size="small" @click="resetPwdMethod">{{$t('system.userManage.reset')}}</el-button>
        <el-button type="primary" size="small" :loading="addLoading" @click="editMethod('ruleForm')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="editUser = false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog >
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { unlockPassword } from '@/api/user'
import { listCustomerInfo } from '@/api/customer'
import { supplierPageList } from '@/api/supplier'
import {
  selectUserFrontAccountList,
  enableUserFront,
  // addUser,
  editUser,
  // getSysRoleList,
  deleteUser,
  selectUserFrontDetail,
  selectCountryListApi,
  exportFrontendUserByEasypoi,
  selectgetDictionaryBykeyApi,
  UserresetPwd,
  selectCustomerOrAccountList,
  saveCustomerOrAccountBody,
  deleteCustomerOrAccountById
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
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
      searchVal: '',
      supplyCompanyList: [],
      // departmentList: [],
      sysRoleList: [],
      sysUserDataRules1: {
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
          { required: true, message: this.$t('system.userManage.userGender'), trigger: 'change' }
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
          { required: true, message: this.$t('system.userManage.userPart'), trigger: 'blur' }
        ],
        roles: [
          { required: true, message: this.$t('system.userManage.userPart'), trigger: 'change' }
        ],
        companyName: [
          { required: true, message: this.$t('system.userManage.userCompanyName'), trigger: 'blur' }
        ],
        countryCode: [
          { required: true, message: this.$t('system.userManage.userCountry'), trigger: 'change' }
        ]
      },
      dialogType: '',
      uploadActionUrl,
      addLoading: false,
      countryList: [],
      editForm: {
        userAccount: '',
        accountId: '',
        firstName: '',
        lastName: '',
        userSex: '',
        emailAddress: '',
        contactAddress: '',
        officePhone: '',
        officePhone2: '',
        mobilePhone: '',
        mobilePhone2: '',
        usedLanguage: '',
        preferedLanguageStr: [],
        companyName: '',
        department: '',
        parDepartment: '',
        company: '',
        // roles: [],
        rolesStr: '',
        roles: [],
        usedCompany: '',
        photoPath: '',
        departments: [],
        position: '',
        approvalType: '',
        countryCode: '',
        preferedLanguage: ''
      },
      sysUserForm: {
        countryCode: '',
        preferedLanguage: '',
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
        companyName: '',
        department: '',
        parDepartment: '',
        company: '',
        // roles: [],
        roles: [],
        rolesStr: "",
        usedCompany: '',
        photoPath: '',
        departments: [],
        position: '',
        approvalType: '',
        accountStatus: 0
      },
      openAdd: false,
      imageUrl: '',
      listLoading: true,
      detailModal3: false,
      entityForm: {},
      detailData: {},
      clientRadio: '0',
      addUserList: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        companyName: '',
        customerCode: '',
        mobilePhone: ''
      },
      addSupplierUserList: {
        supplierType: '',
        pageSize: 10,
        pageNum: 1,
        total: 0,
        supplierName: '',
        supplierCode: '',
        officePhone: ''
      },
      getClientSupplierList: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      ClientAccountBId: '',
      selectListValue: '',
      isShow: false,
      ClientDataList: [],
      SupplierDataList: [],
      clientList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        custAccount: '',
        firstName: '',
        lastName: '',
        countryCode: '',
        companyName: '',
        accountStatus: ''
      },
      areaList: [
        {
          labelZh: '全部',
          label: 'All',
          inquiryStatus: ''
        },
        {
          label: 'Active',
          labelZh: '使用中',
          inquiryStatus: 0
        },
        {
          label: 'Disabled',
          labelZh: '已禁用',
          inquiryStatus: 1
        },
        {
          label: 'Verification',
          labelZh: '验证中',
          inquiryStatus: 2
        },
        {
          label: 'Approval',
          labelZh: '审核中',
          inquiryStatus: 3
        }
      ],
      languageList: [],
      languageList1: [],
      list: [],
      selectList: [],
      defaultCompanyList: [],
      editUser: false,
      clientSupplier: false
      // editForm: ''
    }
  },
  created() {
    this.getLanguageList();
    this.getDataList();
    // this.getSysRoleListMethod();// 角色列表
    // this.getSupplyCompanyListMethod()
    this.getCountryList();
  },
  watch: {
    isZh() {
      this.setOption()
    }
  },
  methods: {
    addClientSupplier() {
      this.clientSupplier = true;
      this.getClientList()
    },
    cellClass(row) {
      if (row.columnIndex === 0) {
        return 'className'
      }
    },
    getClientSelect(val) {
      this.selectListValue = val;
      if (val.length > 1) {
        this.$refs.Table.clearSelection();
        this.$refs.Table.toggleRowSelection(val.pop())
      }
    },
    searchUser() {
      // this.getDataUserList();
      if (this.searchVal === '') {
        this.searchVal = '0'
      }
      if (this.searchVal === '0') {
        this.getClientList();
      } else {
        this.getSuplier();
      }
    },
    addMethod() {
      if (this.selectListValue.length === 0) {
        return this.$message.warning(this.$t('system.userManage.option'))
      }
      let obj = {
        accountBId: this.editForm.accountBId,
        accountType: Number(this.clientRadio),
        contactFirstName: this.editForm.firstName,
        contactLastName: this.editForm.lastName,
        contactName: this.editForm.userName,
        contactPhone: String(this.editForm.mobilePhone),
        emailAddress: this.editForm.emailAddress,
        userAccount: this.editForm.userAccount,
        job: this.editForm.position,
        orgId: this.selectListValue[0].bid
      };
      this.addLoading = true;
      saveCustomerOrAccountBody(obj).then(res => {
        if (res.status === 200) {
          this.$message.success(this.$t("system.userManage.handle"));
          this.addLoading = false;
          this.clientSupplier = false;
          this.getClientSupplier()
        }
      }).catch(err => {
        this.$message.error(err.message)
        this.addLoading = false;
      })
    },
    deleteClient(row) {
      this.$confirm(this.$t('system.userManage.whether'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning',
        center: true
      }).then(() => {
        deleteCustomerOrAccountById({ id: row.id }).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message);
          }
          this.getClientSupplier();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t("system.userManage.cancel")
        })
      })
    },
    getClientList() {
      let obj = {};
      for (let key in this.addUserList) {
        if (this.addUserList[key]) {
          obj[key] = this.addUserList[key]
        }
      }
      listCustomerInfo(obj).then(res => {
        this.ClientDataList = res.data.list;
        this.addUserList.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSuplier() {
      let obj = {};
      for (let key in this.addSupplierUserList) {
        if (this.addSupplierUserList[key]) {
          obj[key] = this.addSupplierUserList[key]
        }
      }
      obj.supplierType = Number(obj.supplierType)
      supplierPageList(obj).then(res => {
        this.SupplierDataList = res.data.list;
        this.addSupplierUserList.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    switchClient(val) {
      this.isShow = false;
      this.searchVal = val;
      if (val === '0') {
        this.getClientList();
        this.isShow = false;
      } else {
        this.addSupplierUserList.supplierType = val;
        this.getSuplier();
        this.isShow = true;
      }
    },
    clearData() {
      // this.$refs['addForm'].resetFields();
      this.addLoading = false
    },
    clearData1() {
      this.$refs['ruleForm'].resetFields();
      this.addLoading = false
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.editForm.photoPath = res.data.filePath;
    },
    // 上传图片
    handleAvatarSuccess1(res, file) {
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
    getCountryList(query) {
      if (query !== '') {
        setTimeout(() => {
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 编辑
    editMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editForm.accountBId) {
            this.addLoading = true;
            editUser(this.editForm).then(res => {
              this.addLoading = false;
              this.$message.success(this.$t('system.userManage.updata'));
              this.postData.pageNum = 1;
              this.editUser = false;
              this.getDataList();
              this.closOPenDialog();
            }).catch(err => {
              this.addLoading = false;
              this.$message.error(err.message);
            });
          }
        } else {
          this.$message.error(this.$t('system.userManage.check'))
        }
      })
    },
    getRoleBId(arr) {
      if (arr.length) {
        this.sysUserForm.rolesStr = arr.join(',');
        this.editForm.rolesStr = arr.join(',');
      } else {
        this.sysUserForm.rolesStr = '';
        this.editForm.rolesStr = '';
      }
    },
    // getSupplyCompanyListMethod() {
    //   getSupplyCompanyList({}).then(res => {
    //     this.supplyCompanyList = res.data;
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   });
    // },
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
    getDefaultCompany(arr) {
      if (arr.length) {
        this.sysUserForm.company = arr.join(',')
      } else {
        this.sysUserForm.company = ''
      }
      this.defaultCompanyList = this.supplyCompanyList.filter(e => {
        return arr.includes(e.bid)
      })
    },
    getSelect(selects) {
      this.selectList = selects;
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
        deleteUser(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t("system.userManage.cancel")
        })
      })
    },
    setOtherList(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.value !== val
      });
      if (this.editForm.preferedLanguageStr.includes(val)) {
        this.editForm.preferedLanguageStr = this.editForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    // 删除
    getcommLanguage(arr) {
      if (arr.length) {
        this.editForm.preferedLanguage = arr.join(',')
      } else {
        this.editForm.preferedLanguage = ''
      }
    },
    setOtherList1(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.value !== val
      });
      if (this.sysUserForm.preferedLanguageStr.includes(val)) {
        this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    // 删除
    getcommLanguage1(arr) {
      if (arr.length) {
        this.sysUserForm.preferedLanguage = arr.join(',')
      } else {
        this.sysUserForm.preferedLanguage = ''
      }
    },
    resetPwdMethod() {
      UserresetPwd({ accountBid: this.editForm.accountBId }).then(res => {
        this.$message.success(this.$t('system.userManage.resetSuccess'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 解锁密码
    unlockPassword() {
      unlockPassword({ accountBid: this.editForm.accountBId }).then(res => {
        this.$message.success(this.$t('system.userManage.unlocked'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 角色列表
    // getSysRoleListMethod() {
    //   getSysRoleList({ type: 2 }).then(res => {
    //     this.sysRoleList = res.data;
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   });
    // },
    // 编辑模块
    editDetail(row) {
      this.editUser = true;
      this.ClientAccountBId = row.accountBId;
      this.getClientSupplier();
      selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        // this.getSysRoleListMethod()
        this.editForm.mobilePhone = parseInt(this.editForm.mobilePhone);
        if (this.editForm.preferedLanguage) {
          this.editForm.preferedLanguageStr = this.editForm.preferedLanguage.split(',')
        } else {
          this.editForm.preferedLanguageStr = []
        }
        this.languageList1 = this.languageList.filter(e => {
          return e.value !== this.editForm.usedLanguage
        });
        if (this.editForm.roles) {
          this.editForm.roles = this.editForm.roles
        } else {
          this.editForm.roles = []
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getClientSupplier() {
      // bid = this.ClientAccountBId
      selectCustomerOrAccountList({
        accountBId: this.ClientAccountBId,
        pageNum: this.getClientSupplierList.pageNum,
        pageSize: this.getClientSupplierList.pageSize,
        total: this.getClientSupplierList.total
      }).then(res => {
        this.clientList = res.data.list;
        this.getClientSupplierList.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // addMethod(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       if (this.sysUserForm.accountBId) {
    //         editUser(this.sysUserForm).then(res => {
    //           this.$message.success(this.$t('system.userManage.updata'));
    //           this.postData.pageNum = 1;
    //           this.dialogVisible = false;
    //           this.getDataList();
    //           this.closOPenDialog();
    //         }).catch(err => {
    //           this.$message.error(err.message);
    //         });
    //       } else {
    //         addUser(this.sysUserForm).then(res => {
    //           this.$message.success(this.$t('system.userManage.addSuccess'));
    //           this.postData.pageNum = 1;
    //           this.openAdd = false;
    //           this.getDataList();
    //           this.closOPenDialog()
    //         }).catch(err => {
    //           this.$message.error(err.message)
    //         });
    //       }
    //     } else {
    //       this.$message.error(this.$t('system.userManage.check'))
    //     }
    //   });
    // },
    closOPenDialog() {
      this.dialogVisible = false;
    },
    addDialog() {
      this.openAdd = true
      // this.rolesList()
    },
    changeStatus(row) {
      let obj = {
        type: row.accountStatus !== 0 ? 0 : 1,
        accountBId: row.accountBId
      };
      enableUserFront(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchRole() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    // 获取列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectUserFrontAccountList(obj).then(res => {
        if (res.data.list) {
          this.list = res.data.list || [];
          this.postData.total = res.data.total;
        }
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 详情模块
    openDetail(row) {
      this.ClientAccountBId = row.accountBId;
      this.getClientSupplier();
      selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
        this.entityForm = Object.assign(this.entityForm, res.data);
        if (this.entityForm.preferedLanguage) {
          this.entityForm.preferedLanguageStr = this.entityForm.preferedLanguage.split(',')
        } else {
          this.entityForm.preferedLanguageStr = []
        }
        if (this.entityForm.roles) {
          this.entityForm.roles = this.entityForm.roles
        } else {
          this.entityForm.roles = []
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
      this.languageList1 = this.languageList.filter(e => {
        return e.value !== this.entityForm.usedLanguage
      });
      // 回显上级
      this.detailModal3 = true;
    },
    exportUser() {
      let obj = {
        pageSize: "",
        pageNum: ""
      };
      exportFrontendUserByEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'clientUser.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    statusFmt(status, flag) {
      switch (status) {
        case 0: return flag ? '使用中' : 'Active';
        case 1: return flag ? '禁用中' : 'Disabled';
        case 2: return flag ? '验证中' : 'Verification';
        case 3: return flag ? '审核中' : 'Approval';
        default: break;
      }
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    clientType(val, isZh) {
      switch (val) {
        case 0: return isZh ? '客户公司' : 'Customer';
        case 1: return isZh ? '商品供应商' : 'Product supplier';
        case 2: return isZh ? '物流供应商' : 'Logistics supplier';
        case 3: return isZh ? '金融供应商' : 'Financial supplier'
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .clientUser {
    .divleft{
      text-align: right;
    }
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
    .form-dialog-width2{
      width: 300px !important;
    }
    .form-dialog-width{
      width: 540px !important;
    }
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
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .divinline{
      width: 350px !important;
      float: left;
    }
    .el-table /deep/.className .cell .el-checkbox__inner{
      display: none;
    }
    .el-table /deep/.className .cell:before {
      content: '';
    }
  }
</style>
