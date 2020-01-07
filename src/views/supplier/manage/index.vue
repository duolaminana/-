<template>
  <div class="app-container supplier-container">
    <div class="search-box">
      <el-form :label-width="isZh ? '80px' : '100px'" inline size="small">
        <div>
          <el-form-item :label="$t('supplier.record.supplierName')">
            <el-input v-model.trim="postData.supplierName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.classification')">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
              filterable
              clearable
              change-on-select
              @change="getParentId1"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.level')">
            <el-select v-model="postData.supplierGradeBId" clearable style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('supplier.record.supplierCode')">
            <el-input v-model.trim="postData.supplierCode" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('customer.record.country')">
            <el-select
              v-model="postData.countryCode"
              filterable
              remote
              clearable
              :remote-method="getCountryList"
              :loading="loading1"
              style="width: 200px"
            >
              <el-option v-for="(item, index) in countryList" clearable :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.record.contactNo')">
            <el-input v-model.trim="postData.officePhone" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.supplierStatus" clearable style="width: 150px">
              <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteSupplier()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="dataList"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        :label="$t('common.table.id')"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('supplier.record.supplierName')" prop="supplierName" show-overflow-tooltip/>

      <el-table-column :label="$t('supplier.record.supplierCode')" prop="supplierCode" show-overflow-tooltip/>

      <el-table-column :label="$t('customer.record.country')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{isZh ? scope.row.cnCountryName : scope.row.enCountryName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('customer.record.contactNo')" prop="officePhone" show-overflow-tooltip/>

      <el-table-column align="center" width="100" :label="$t('system.role.modifier')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('system.userManage.editTime')" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="supplierStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.supplierStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.supplierStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="255" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openHistory(scope.row)">{{$t('customer.customerList.hist')}}</el-button>
          <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row.bid)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openEdit('edit',scope.row.bid)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button
            :type="scope.row.supplierStatus === 1 ? 'info' : 'danger'"
            size="mini"
            @click="changeMethod(scope.row)"
          >{{scope.row.supplierStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="detailVisible" :title="$t('supplier.manage.supplierDetail')" width="1000px" center @close="clearDialog">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
          <el-form ref="supplierData" :model="supplierData" :label-width="isZh?'160px': '170px'" inline label-position="left"
                   size="small">
            <el-form-item :label="$t('supplier.record.supplierCode')" prop="supplierCode">
              <el-input v-model="supplierData.supplierCode" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierName')" prop="supplierName">
              <el-input v-model="supplierData.supplierName" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <!--<el-form-item label="公司名称" prop="companyName">-->
            <!--<el-input v-model="supplierData.companyName" readonly placeholder="公司名称" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('supplier.record.supplierAbbr')" prop="shortName">
              <el-input v-model="supplierData.shortName" readonly class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.record.country')" prop="countryCode">
              <el-select
                v-model="supplierData.countryCode"
                disabled
                readonly
                filterable
                remote
                :remote-method="getCountryList"
                :loading="Loading1"
                class="form-dialog-width"
                style="width: 600px"
              >
                <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option></el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
              <el-input v-model="supplierData.registerAddress" readonly class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
              <el-input v-model="supplierData.officeAddress" readonly class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <!--<el-form-item label="其他地址" prop="otherAddress">-->
              <!--<el-input v-model="supplierData.otherAddress" readonly placeholder="其他地址" class="form-dialog-width"-->
                        <!--style="width: 600px"/>-->
            <!--</el-form-item>-->

            <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
              <el-input v-model="supplierData.postalCode" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
              <el-input v-model="supplierData.provinceCode" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
              <el-input v-model="supplierData.officePhone" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
              <el-input v-model="supplierData.officePhone2" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
              <el-input v-model="supplierData.mobilePhone" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
              <el-input v-model="supplierData.mobilePhone2" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo">
              <el-input v-model="supplierData.facsimileNo" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
              <el-input v-model="supplierData.facsimileNo2" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
              <el-input v-model="supplierData.emailAddress" readonly class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
              <el-input v-model="supplierData.taxNo" readonly class="form-dialog-width"
                        style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierCategory')" prop="supplierSortName">
              <el-cascader
                class="form-dialog-width"
                v-model="supplierData.supplierSortName"
                :options="sortList"
                :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
                filterable
                disabled
                change-on-select
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierLevel')" prop="supplierGradeBId">
              <el-select v-model="supplierData.supplierGradeBId" disabled
                         class="form-dialog-width">
                <el-option v-for="(item, index) in gradeList" :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierStatus')" prop="transaStatus">
              <el-radio-group v-model="supplierData.transaStatus" style="width: 600px;">
                <el-radio disabled :label="1">{{$t('customer.collect.complete')}}</el-radio>
                <el-radio disabled :label="2">{{$t('customer.collect.noComplete')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
              <el-radio-group v-model="supplierData.customerSource" style="width: 600px;">
                <el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{language === 'zh' ? item.label : item.enLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList">
              <el-checkbox-group v-model="supplierData.ownFieldList" style="width: 600px;" @change="getownField">
                <el-checkbox v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
              <el-input v-model="supplierData.reservedField1" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
              <el-input v-model="supplierData.reservedField2" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
              <el-input v-model="supplierData.reservedField3" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
              <el-input v-model="supplierData.reservedField4" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
              <el-input v-model="supplierData.reservedField5" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
              <el-input v-model="supplierData.reservedField6" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
              <el-input v-model="supplierData.reservedField7" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
              <el-input v-model="supplierData.reservedField8" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
              <el-input v-model="supplierData.reservedField9" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
              <el-input v-model="supplierData.reservedField10" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <div>
              <el-form-item :label="$t('system.role.status')" prop="supplierStatus">
                {{supplierData.supplierStatus === 1 ? $t('system.role.active') : $t('system.role.inactive')}}
              </el-form-item>
            </div>
            <el-form-item :label="$t('supplier.manage.supplierType')" prop="supplierType">
              <el-select v-model="supplierData.supplierType" disabled class="form-dialog-width">
                 <el-option v-for="(item, index) in supplierTypeList" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="备注" prop="remarks">-->
              <!--<el-input v-model="supplierData.remarks" type="textarea" readonly placeholder="备注" style="width: 600px"/>-->
            <!--</el-form-item>-->
          </el-form>
        </el-tab-pane>
        <!--银行账户信息-->
        <el-tab-pane :label="$t('customer.customerList.bankList')" name="2">
          <el-table
            style="margin: 10px 0"
            :data="sbalist"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <!--<el-table-column align="center" label="银行账号" prop="bankAccount" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" label="开户银行" prop="bankName" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" label="开户行地址" prop="bankAddress" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" label="预留电话" prop="reservedPhone" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" label="账户币种" prop="accountCurrency" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" label="switf编码" prop="swiftCode" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" label="默认账户" prop="defaultValue">-->
              <!--<template slot-scope="scope">-->
                <!--<el-radio v-model="scope.row.defaultValue" disabled :label="1">{{null}}</el-radio>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column :label="$t('customer.customerList.bankName')" prop="bankName" show-overflow-tooltip >
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.branchName')" prop="branchName" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.address')" prop="bankAddress" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.accountNo')" prop="bankAccount" show-overflow-tooltip>
            </el-table-column>

            <el-table-column width="130" :label="$t('customer.customerList.accountCurrency')" prop="accountCurrency" show-overflow-tooltip >
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.swiftCode')" prop="swiftCode" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" :label="$t('customer.customerList.default')" prop="defaultValue">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.defaultValue" disabled :label="1">{{null}}</el-radio>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--一般订单参数 付款条件-->
        <el-tab-pane :label="$t('customer.customerList.generalOrder')" name="3">
          <el-form ref="spt" :model="spt" :label-width="isZh ? '150px': '210px'" label-position="right" size="small">
            <el-form-item :label="$t('customer.customerList.defaultBase')" prop="paymentType">
                <el-radio-group v-model="spt.paymentType" disabled>
                  <el-radio :label="1">{{isZh?'离岸价':'FOB'}}</el-radio>
                  <el-radio :label="2">{{isZh?'到岸价':'CIF'}}</el-radio>
                  <el-radio :label="3">{{isZh?'出厂价':'EXW'}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultPort')" prop="deliveryPort">
              <el-input v-model="spt.deliveryPort" readonly class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <!--<el-form-item :label="$t('system.business.priceGradient')" prop="gradientLevel">-->
              <!--<el-select v-model="spt.gradientLevel" disabled clearable style="width: 230px">-->
                <!--<el-option v-for="(item, index) in priceGradientList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.customerList.defaultMethod')" prop="shipmentType">
              <el-select v-model="spt.shipmentType" style="width: 500px">
                <el-option v-for="(item,index) in transportList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultTool')" prop="paymentMethod">
              <el-select v-model="spt.paymentMethod" disabled style="width: 230px;">
                <el-option v-for="(item,index) in paymentList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="货币编码" prop="currencyCode">-->
              <!--<el-input v-model="spt.currencyCode" placeholder="货币编码" readonly class="form-dialog-width" style="width: 230px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.customerList.defaultTerms')">
              <table border="0" cellspacing="0" cellpadding="0" class="form-table" style="width: 700px">
                <thead>
                <tr style="background-color: #a7bfee">
                  <th>{{$t('customer.customerList.no')}}</th>
                  <th>{{$t('customer.customerList.paymentNode')}}</th>
                  <th>{{$t('customer.customerList.paymentPercentage')}}</th>
                  <th>{{$t('customer.customerList.paymentPerlod')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in controlTowerList" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.nodeName}}</td>
                  <td>
                    {{item.paymentRatio}}%
                  </td>
                  <td>
                    {{item.dayNum}}{{isZh ? '天': 'Day'}}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" v-if="!controlTowerList.length">{{isZh ? '暂无数据': 'No Data'}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--合作详情-->
        <el-tab-pane :label="$t('customer.customerList.partenership2')" name="4">
          <el-table
            :data="scplist"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column :label="$t('customer.customerList.schema')" prop="cooperMode" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.commencementDate')" prop="beginTime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.beginTime | timeFmt}}~{{scope.row.endTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.agreement')" prop="pactFile" show-overflow-tooltip/>
            <el-table-column align="center" width="110" :label="$t('system.role.operation')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('customer.customerList.download')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--联系人-->
        <el-tab-pane :label="$t('customer.customerList.contact')" name="5">
          <el-table
            :data="sclist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              type="index"
              align="center"
              :label="$t('common.table.id')"
              width="50">
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.name')" show-overflow-tooltip>
              <template slot-scope="scope">
                <!--<a href="javascript:void (0)">{{scope.row.contactName}}</a>-->
                <a style="text-decoration:underline" @click="addLinkModal('detail', scope.row)">{{scope.row.contactName}}</a>
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.contactNo')" prop="contactPhone" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.accountNo')" prop="emailAddress" show-overflow-tooltip/>

            <el-table-column :label="isZh?'职位':'Designation'" prop="supplierJob" show-overflow-tooltip/>

            <el-table-column align="center" :label="$t('customer.customerList.default')" prop="defaultStatus">
              <template slot-scope="scope">
                <el-radio disabled v-model="scope.row.defaultStatus" :label="1">{{null}}</el-radio>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--服务人员-->
        <el-tab-pane :label="$t('customer.customerList.serviceStaff')" name="6">
          <el-table
            :data="sslist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column :label="$t('customer.customerList.serviceStaff')" prop="accountBId" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.designation')" prop="csJob" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.csJob | jobFmt(jobList, isZh)}}
              </template>
            </el-table-column>

            <!--<el-table-column :label="isZh?'账号':'UserAccpunt'" show-overflow-tooltip prop="userAccount"></el-table-column>-->

            <!--<el-table-column :label="isZh?'电话':'MobilePhone'" show-overflow-tooltip prop="mobilePhone"></el-table-column>-->
          </el-table>
        </el-tab-pane>

      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="clearDetailDialog">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" :close-on-click-modal="false" :title="dialogType==='add'? $t('supplier.manage.addSupplier'): $t('supplier.manage.editSupplier')"
               center width="1000px" @close="clearDialog">
      <!--基础信息-->
      <el-tabs v-model="activeName" :before-leave="changeTabs">
        <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
          <el-form ref="supplierData" :model="supplierData" :label-width="isZh?'160px': '170px'" inline label-position="left" size="small" :rules="supplierFormRules">
            <el-form-item :label="$t('supplier.record.supplierCode')" prop="supplierCode">
              <el-input v-model="supplierData.supplierCode" :maxlength="30" clearable class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierName')" prop="supplierName">
              <el-input v-model="supplierData.supplierName" clearable :maxlength="20" class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <!--<el-form-item label="公司名称" prop="companyName">-->
            <!--<el-input v-model="supplierData.companyName" clearable placeholder="公司名称" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('supplier.record.supplierAbbr')" prop="shortName">
              <el-input v-model="supplierData.shortName" clearable :maxlength="16" class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.record.country')" prop="countryCode">
              <el-select
                v-model="supplierData.countryCode"
                clearable
                filterable
                remote
                :remote-method="getCountryList"
                :loading="Loading1"
                class="form-dialog-width"
                style="width: 620px"
              >
                <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
              <el-input v-model="supplierData.registerAddress" clearable :maxlength="200" class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
              <el-input v-model="supplierData.officeAddress" clearable :maxlength="200" class="form-dialog-width"
                        style="width: 620px"/>
            </el-form-item>
            <!--<el-form-item label="公司地址" prop="otherAddress">-->
              <!--<el-input v-model="supplierData.otherAddress" clearable placeholder="公司地址" class="form-dialog-width"-->
                        <!--style="width: 600px"/>-->
            <!--</el-form-item>-->

            <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
              <el-input v-model="supplierData.postalCode" clearable :maxlength="50" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
              <el-input v-model="supplierData.provinceCode" clearable :maxlength="14" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
              <el-input v-model="supplierData.officePhone" clearable :maxlength="16" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
              <el-input v-model="supplierData.officePhone2" clearable :maxlength="16" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
              <el-input v-model="supplierData.mobilePhone" clearable :maxlength="16" class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
              <el-input v-model="supplierData.mobilePhone2" clearable :maxlength="16" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo">
              <el-input v-model="supplierData.facsimileNo" clearable :maxlength="16" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
              <el-input v-model="supplierData.facsimileNo2" clearable :maxlength="16" class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
              <el-input v-model="supplierData.emailAddress" clearable :maxlength="50" class="form-dialog-width"
                        style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
              <el-input v-model="supplierData.taxNo" clearable :maxlength="50" class="form-dialog-width"
                        style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierCategory')" prop="supplierSortName">
              <el-cascader
                class="form-dialog-width"
                style="width: 230px;"
                v-model="supplierData.supplierSortName"
                :options="sortList"
                :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
                filterable
                clearable
                change-on-select
                @change="getParentId">
              </el-cascader>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierLevel')" prop="supplierGradeBId">
              <el-select v-model="supplierData.supplierGradeBId" style="width: 230px;" clearable class="form-dialog-width">
                <el-option v-for="(item, index) in gradeList" :disabled="item.levelStatus === 0" :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('supplier.record.supplierStatus')" prop="transaStatus">
              <el-radio-group v-model="supplierData.transaStatus" style="width: 620px;">
                <el-radio :label="1">{{$t('customer.collect.complete')}}</el-radio>
                <el-radio :label="0">{{$t('customer.collect.noComplete')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
              <el-radio-group v-model="supplierData.customerSource" style="width: 620px;">
                <el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{language === 'zh' ? item.label : item.enLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList">
              <el-checkbox-group v-model="supplierData.ownFieldList" style="width: 620px;" @change="getownField">
                <el-checkbox v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
              <el-input v-model="supplierData.reservedField1" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
              <el-input v-model="supplierData.reservedField2" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
              <el-input v-model="supplierData.reservedField3" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
              <el-input v-model="supplierData.reservedField4" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
              <el-input v-model="supplierData.reservedField5" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
              <el-input v-model="supplierData.reservedField6" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
              <el-input v-model="supplierData.reservedField7" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
              <el-input v-model="supplierData.reservedField8" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
              <el-input v-model="supplierData.reservedField9" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
              <el-input v-model="supplierData.reservedField10" clearable class="form-dialog-width"
                        style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('supplier.manage.supplierType')" prop="supplierType">
              <el-select v-model="supplierData.supplierType" class="form-dialog-width" style="width: 230px">
                <el-option v-for="(item, index) in supplierTypeList" :label="language === 'zh' ? item.label : item.enLabel" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <div>
              <el-form-item :label="$t('system.role.status')" prop="supplierStatus">
                {{supplierData.supplierStatus === 1 ?$t('system.role.active') : $t('system.role.inactive') }}
              </el-form-item>
            </div>
            <!--<el-form-item label="备注" prop="remarks">-->
              <!--<el-input v-model="supplierData.remarks" type="textarea" clearable placeholder="备注" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <div style="text-align: center">
              <el-form-item>
                <el-button type="primary" size="small" :loading="confirmLoading" @click="saveBasicMsg('supplierData')">{{$t('system.role.seave')}}</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <!--银行账户信息-->
        <el-tab-pane :label="$t('customer.customerList.bankList')" name="2">
          <div class="divleft">
            <el-button type="primary" size="mini" @click="openBankDialog('add')">{{$t('system.role.add')}}</el-button>
            <el-button type="primary" size="mini" @click="removeBankAccount()">{{$t('system.role.delete')}}</el-button>
          </div>
          <el-table
            style="margin: 10px 0"
            :data="sbalist"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getBankSelect">
            <el-table-column
              align="center"
              type="selection"
              :label="$t('common.table.id')"
              width="55">
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.bankName')" prop="bankName" show-overflow-tooltip >
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.branchName')" prop="branchName" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.address')" prop="bankAddress" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.accountNo')" prop="bankAccount" show-overflow-tooltip>
            </el-table-column>

            <el-table-column width="130" :label="$t('customer.customerList.accountCurrency')" prop="accountCurrency" show-overflow-tooltip >
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.swiftCode')" prop="swiftCode" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" :label="$t('customer.customerList.default')" prop="defaultValue">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.defaultValue" disabled :label="1">{{null}}</el-radio>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('system.role.operation')" width="90" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <!--<el-button type="danger" size="mini" @click="removeBankAccount(sbalist, scope)">删除</el-button>-->
                <el-button type="primary" size="mini" @click="openBankDialog('edit', scope.row)">{{$t('system.userManage.editUser')}}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog
            width="600px"
            center
            :title="bankDialogType === 'add' ? $t('customer.customerList.addBankAccount') : $t('customer.customerList.editBankAccount')"
            :close-on-click-modal="false"
            :visible.sync="addBankVisible"
            append-to-body>
            <el-form ref="bankForm" :model="bankForm" label-width="150px" label-position="right" size="mini"
                     :rules="bankFormRules">
              <!--<el-form-item label="银行账号" prop="bankAccount">-->
                <!--<el-input v-model="bankForm.bankAccount" clearable placeholder="银行账号" class="form-dialog-width"/>-->
              <!--</el-form-item>-->
              <el-form-item :label="$t('customer.customerList.bankName')" prop="bankName">
                <el-input type="tel" v-model.number="bankForm.bankName" :maxlength="30" clearable
                          class="form-dialog-width"/>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.branchName')" prop="branchName">
                <el-input type="tel" v-model.number="bankForm.branchName" :maxlength="50" clearable
                          class="form-dialog-width"/>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.address')" prop="bankAddress">
                <el-input type="tel" v-model.number="bankForm.bankAddress" :maxlength="200" clearable
                          class="form-dialog-width"/>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.accountNo')" prop="reservedPhone">
                <el-input v-model="bankForm.bankAccount" clearable class="form-dialog-width"/>
              </el-form-item>
              <!--<el-form-item label="账户类型" prop="accountType">-->
              <!--<el-radio-group v-model="bankForm.accountType">-->
              <!--<el-radio :label="1">企业</el-radio>-->
              <!--<el-radio :label="2">个人</el-radio>-->
              <!--</el-radio-group>-->
              <!--</el-form-item>-->
              <el-form-item :label="$t('customer.customerList.accountCurrency')" prop="accountCurrency">
                <el-select filterable v-model="bankForm.accountCurrency" clearable
                           class="form-dialog-width">
                  <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr"
                             :value="item.currencyCode" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.swiftCode')" prop="swiftCode">
                <el-input v-model="bankForm.swiftCode" clearable :maxlength="30" class="form-dialog-width"/>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.isDefault')" prop="defaultValue">
                <el-radio-group v-model="bankForm.defaultValue">
                  <el-radio :label="1">{{isZh ? '是' : 'Yes'}}</el-radio>
                  <el-radio :label="0">{{isZh ? '否' : 'No'}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="addBankAccount('bankForm')">{{$t('system.role.seave')}}</el-button>
              <el-button type="danger" size="small" @click="addBankVisible=false">{{$t('system.role.return')}}</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <!--付款条件-->
        <el-tab-pane :label="$t('customer.customerList.generalOrder')" name="3">
          <el-form ref="spt" :model="spt" :label-width="isZh ? '150px': '210px'" label-position="right" size="small"
                   :rules="sptRules">
            <el-form-item :label="$t('customer.customerList.defaultBase')" prop="paymentType">
              <el-radio-group v-model="spt.paymentType" @change="radioJudge">
                <el-radio :label="1">{{isZh?'离岸价':'FOB'}}</el-radio>
                <el-radio :label="2">{{isZh?'到岸价':'CIF'}}</el-radio>
                <el-radio :label="3">{{isZh?'出厂价':'EXW'}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultPort')">
              <el-input v-model="spt.deliveryPort" class="form-dialog-width" :maxlength="300" style="width: 230px"/>
            </el-form-item>
            <!--<el-form-item :label="$t('system.business.priceGradient')" prop="gradientLevel">-->
                <!--<el-select v-model="spt.gradientLevel" clearable style="width: 230px">-->
                  <!--<el-option v-for="(item, index) in priceGradientList" :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.customerList.defaultMethod')">
              <!--<el-checkbox-group v-model="spt.shipmentTypeArr" @change="getCheckBoxVal">-->
                <!--<el-option v-for="(item,index) in transportList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>-->
              <!--</el-checkbox-group>-->
              <el-select v-model="spt.shipmentType" clearable style="width: 500px">
                <el-option v-for="(item,index) in transportList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultTool')" prop="paymentMethod">
              <el-select v-model="spt.paymentMethod" clearable style="width: 230px">
                <el-option v-for="(item,index) in paymentList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="货币编码" prop="currencyCode">-->
              <!--<el-input v-model="spt.currencyCode" placeholder="货币编码" class="form-dialog-width" style="width: 230px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.customerList.defaultTerms')">
              <table border="0" cellspacing="0" cellpadding="0" class="form-table" style="width: 700px">
                <thead>
                <tr style="background-color: #a7bfee">
                  <th>{{$t('customer.customerList.no')}}</th>
                  <th>{{$t('customer.customerList.paymentNode')}}</th>
                  <th>{{$t('customer.customerList.paymentPercentage')}}</th>
                  <th>{{$t('customer.customerList.paymentPerlod')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in controlTowerList" :key="index">
                  <td>{{index + 1}}</td>
                  <!--<td>{{ isZh? item.nodeNameCh : item.nodeName}}</td>-->
                  <td>{{item.nodeName}}</td>
                  <td>
                    <el-input-number v-model="item.paymentRatio" :min="0" :max="100" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;%
                  </td>
                  <td>
                    <el-input-number v-model="item.dayNum" :min="0" clearable style="width: 120px" class="hidden-control input-center"/>&nbsp;{{$t('system.business.day')}}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" v-if="!controlTowerList.length">{{isZh ? '暂无数据': 'No Data'}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
            <div style="text-align: center">
              <el-form-item>
                <el-button type="primary" size="small" :loading="confirmLoading" @click="savePayment('spt')">{{$t('system.role.seave')}}
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <!--合作详情-->
        <el-tab-pane :label="$t('customer.customerList.partenership2')" name="4">
          <el-form ref="cooperObj" :model="cooperObj" label-width="150px" label-position="right" size="small">
            <el-form-item :label="$t('customer.customerList.schema')">
              <el-select v-model="cooperObj.cooperMode" clearable style="width: 350px">
                <el-option v-for="(item, index) in cooperTypeList" :label="isZh ? item.label : item.enLabel" :value="isZh ? item.label : item.enLabel" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.commencementDate')">
              <el-date-picker
                @change="getRangeTime"
                v-model="cooperObj.rangeTime"
                type="daterange"
                range-separator="~"
                :start-placeholder="$t('customer.customerList.startDate')"
                :end-placeholder="$t('customer.customerList.endDate')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.partenership')">
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="uploadActionUrl"
                :headers="upLoadHeaders"
                :data="{type: 3}"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :limit="1"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">{{$t('customer.customerList.upload')}}</el-button>
                <span slot="tip" class="el-upload__tip" style="margin-left: 5%;">{{$t('customer.record.restrictions')}}</span>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <div class="topBtns">
                <el-button type="primary" size="small" @click="addPactFileList">{{$t('supplier.manage.supplierAdd')}}</el-button>
              </div>
            </el-form-item>
          </el-form>
          <el-table
            :data="scplist"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column :label="$t('customer.customerList.schema')" prop="cooperMode" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.commencementDate')" prop="beginTime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.beginTime | timeFmt}}~{{scope.row.endTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.agreementName')" prop="pactFile" show-overflow-tooltip/>
            <el-table-column align="center" :label="$t('system.role.operation')">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('customer.customerList.download')}}</el-button>
                <el-button type="danger" size="mini" @click="removeFile(scope)">{{$t('system.role.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--联系人-->
        <el-tab-pane :label="$t('customer.customerList.contact')" name="5">
          <div class="divleft">
            <el-button type="primary" size="mini" @click="addContactList">{{$t('system.role.add')}}</el-button>
            <el-button type="warning" size="mini" @click="addFromUserList">{{$t('customer.customerList.userAdd')}}</el-button>
          </div>
          <el-table
            :data="sclist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              type="index"
              align="center"
              :label="$t('common.table.id')"
              width="50">
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.name')" show-overflow-tooltip>
              <template slot-scope="scope">
                <a style="text-decoration:underline" @click="addLinkModal('detail', scope.row)">{{scope.row.contactName}}</a>
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.contactNo')" prop="contactPhone" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.accountNo')" prop="emailAddress" show-overflow-tooltip/>

            <el-table-column :label="isZh?'职位':'Designation'" prop="supplierJob" show-overflow-tooltip/>

            <el-table-column align="center" :label="$t('customer.customerList.default')" prop="defaultStatus">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.defaultStatus" :label="1" @change="radioButton(scope.row.id)">{{null}}</el-radio>
              </template>
            </el-table-column>

            <el-table-column align="center" width="200" :label="$t('system.role.operation')">
              <template slot-scope="scope">
                <!--<el-button type="primary" size="mini" v-if="!scope.row.accountBId" @click="addLinkModal(scope.row)">编辑</el-button>-->
                <!--<el-button type="primary" size="mini" @click="addLinkModal('add', scope.row)">{{$t('system.role.add')}}</el-button>-->
                <el-button type="primary" size="mini" v-if="!scope.row.accountBId" @click="addLinkModal('add', scope.row)">{{isZh?'创建账户':'Create Account'}}</el-button>
                <el-button type="warning" size="mini" @click="editDetail(scope.row)">{{$t('system.userManage.editUser')}}</el-button>
                <el-button type="danger" size="mini" @click="deleteLinkPeople(scope.row)">{{$t('system.role.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!--<el-dialog-->
          <!--width="400px"-->
          <!--center-->
          <!--:title="$t('customer.customerList.addContact')"-->
          <!--:close-on-click-modal="false"-->
          <!--:visible.sync="addClientContact"-->
          <!--@close="clearLinkForm"-->
          <!--append-to-body>-->
          <!--<el-form ref="linkForm" :model="linkForm" :label-width="isZh?'100px': '150px'" label-position="right" size="small" :rules="linkFormRules">-->
            <!--<el-form-item :label="$t('customer.customerList.lastName')" prop="firstName">-->
              <!--<el-input v-model="linkForm.firstName" clearable style="width: 200px;"/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('customer.customerList.firstName')" prop="lastName">-->
              <!--<el-input v-model="linkForm.lastName" clearable style="width: 200px;"/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('customer.customerList.emailAddress')" prop="emailAddress">-->
              <!--<el-input v-model="linkForm.emailAddress" clearable style="width: 200px;"/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="$t('customer.customerList.officePhone')" prop="officePhone">-->
              <!--<el-input v-model.number="linkForm.officePhone" :min="0" clearable style="width: 200px;"/>-->
            <!--</el-form-item>-->
            <!--<el-form-item :label="isZh?'职位':'designation'" prop="position">-->
              <!--<el-input v-model="linkForm.position" clearable style="width: 200px;"/>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
          <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button type="primary" size="small" :loading="linkLoading" @click="addLinkPeople('linkForm')">{{$t('system.role.seave')}}</el-button>-->
            <!--<el-button type="danger" size="small" @click="addClientContact=false">{{$t('system.role.return')}}</el-button>-->
          <!--</div>-->
        <!--</el-dialog>-->

        <el-dialog
          width="800px"
          center
          :title="$t('customer.customerList.userAdd')"
          :close-on-click-modal="false"
          :visible.sync="selectLinkVisible"
          append-to-body>
          <div class="search-box">
            {{$t('customer.customerList.userInformation')}}
            <el-input v-model="userListPrams.searchKey" clearable size="mini" class="form-dialog-width"/>
            <el-button type="primary" size="small" class="export" @click="getSelectUserList">{{$t('system.role.search')}}</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="linkList"
            border
            fit
            highlight-current-row
            style="margin: 10px 0"
            size="mini"
            @selection-change="singleSelectUser"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="selection"
              :label="$t('common.table.id')"
              width="55">
            </el-table-column>

            <el-table-column
              :label="$t('customer.customerList.no')"
              type="index"
              align="center"
              width="50">
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.name')" prop="linkName" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.lastName}}{{scope.row.firstName}}
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.contactNo')" prop="mobilePhone" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.accountNo')" prop="userAccount" show-overflow-tooltip />

            <el-table-column :label="isZh?'邮箱':'Email'" prop="emailAddress" show-overflow-tooltip />

          </el-table>

          <Pagination :total="userListPrams.total" :page.sync="userListPrams.pageIndex"
                      :limit.sync="userListPrams.pageSize" @pagination="getSelectUserList"/>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="addLinkFromList">{{$t('system.role.seave')}}</el-button>
            <el-button type="danger" size="small" @click="selectLinkVisible=false">{{$t('system.role.return')}}</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="400px"
          center
          :title="$t('customer.customerList.addContact')"
          :close-on-click-modal="false"
          :visible.sync="addSupplierContact"
          @close="clearLinkForm"
          append-to-body>
          <el-form ref="ClientlinkForm" :model="ClientlinkForm" :label-width="isZh?'100px': '150px'" label-position="right" size="small" :rules="linkFormRules">
            <el-form-item :label="$t('customer.customerList.firstName')" prop="contactFirstName">
              <el-input v-model="ClientlinkForm.contactFirstName" :maxlength="20" clearable style="width: 200px;"/>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.lastName')" prop="contactLastName">
              <el-input v-model="ClientlinkForm.contactLastName" clearable :maxlength="20" style="width: 200px;"/>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.emailAddress')" prop="emailAddress">
              <el-input v-model="ClientlinkForm.emailAddress" clearable style="width: 200px;" :maxlength="50" @blur="isEmailAddress"/>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.officePhone')" prop="contactPhone">
              <el-input v-model.number="ClientlinkForm.contactPhone" :maxlength="16" :min="0" clearable style="width: 200px;"/>
            </el-form-item>
            <!--<el-form-item :label="isZh?'职位':'designation'" prop="customerJob">-->
            <!--<el-input v-model="ClientlinkForm.customerJob" clearable style="width: 200px;"/>-->
            <!--</el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" :loading="linkLoading" @click="addSupplierPeople('ClientlinkForm')">{{$t('system.role.seave')}}</el-button>
            <el-button type="danger" size="small" @click="addSupplierContact=false">{{$t('system.role.return')}}</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="800px"
          center
          :title="contactType === 'add' ? $t('customer.customerList.addContact') : isZh ? '联系人详情' : 'Contact detail'"
          :close-on-click-modal="false"
          :visible.sync="addLinkVisible"
          @close="clearLinkForm"
          append-to-body>
          <el-form ref="linkForm" :model="linkForm" :label-width="isZh?'100px': '150px'" label-position="right" size="small" :rules="linkFormRules">
            <el-row :gutter="28">
              <el-col :span="16">
                <el-form-item :label="$t('customer.customerList.accountNo')" prop="userAccount">
                  <el-input disabled v-model="linkForm.userAccount" clearable />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.firstName')" prop="firstName">
                  <el-input :disabled="isDetail" v-model="linkForm.firstName" :maxlength="20" clearable />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.lastName')" prop="lastName">
                  <el-input :disabled="isDetail" v-model="linkForm.lastName" :maxlength="20" clearable />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.gender')" prop="userSex">
                  <el-radio-group :disabled="isDetail" v-model="linkForm.userSex">
                    <el-radio :label="1">{{isZh ? '男' : 'Male'}}</el-radio>
                    <el-radio :label="2">{{isZh ? '女' : 'Female'}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="avatar">
                  <el-upload
                    :headers="upLoadHeaders"
                    :disabled="isDetail"
                    :data="{type: 3}"
                    class="avatar-uploader"
                    :action="uploadActionUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="linkForm.photoPath" :src="fullUrl(linkForm.photoPath)" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
                </div>
              </el-col>
            </el-row>
            <el-form-item :label="$t('customer.customerList.emailAddress')" prop="emailAddress">
              <el-input :disabled="isDetail" v-model="linkForm.emailAddress" :maxlength="50" clearable/>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.address')" prop="contactAddress">
              <el-input :disabled="isDetail" v-model="linkForm.contactAddress" clearable />
            </el-form-item>
            <el-row :gutter="28">
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.officePhone')" prop="officePhone" required>
                  <el-input :disabled="isDetail" v-model="linkForm.officePhone" :maxlength="16" :min="0" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.officePhone2')" prop="officePhone2">
                  <el-input :disabled="isDetail" v-model="linkForm.officePhone2" :maxlength="16" :min="0" clearable/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.mobilePhone')" prop="mobilePhone">
                  <el-input :disabled="isDetail" v-model="linkForm.mobilePhone" :maxlength="16" :min="0" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.mobilePhone2')" prop="mobilePhone2">
                  <el-input :disabled="isDetail" v-model="linkForm.mobilePhone2" :maxlength="16" :min="0" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.usedLanguage')">
                  <el-select :disabled="isDetail" v-model="linkForm.usedLanguage" clearable style="width: 100%" @change="setOtherList">
                    <el-option v-for="(item, index) in languageList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.preferdLanguage')" >
                  <el-select :disabled="isDetail" v-model="linkForm.preferedLanguageStr" multiple style="width: 100%" @change="getcommLanguage">
                    <el-option v-for="(item, index) in languageList1" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('customer.record.country')" prop="countryCode">
              <el-select :disabled="isDetail" filterable remote :remote-method="getLinkFormCountryList" :loading="loading1" v-model="linkForm.countryCode" clearable style="width: 100%">
                <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item :label="$t('customer.customerList.conpanyName')" prop="companyName">-->
              <!--<el-input v-model="linkForm.companyName" disabled />-->
            <!--</el-form-item>-->
            <el-form-item :label="isZh?'职位':'Designation'" prop="position">
              <el-input :disabled="isDetail" v-model="linkForm.position" clearable/>
            </el-form-item>
            <!--<el-form-item :label="$t('customer.customerList.isDefault')" prop="defaultStatus">-->
              <!--<el-radio-group v-model="linkForm.defaultStatus" clearable style="width: 600px;">-->
                <!--<el-radio :label="1">{{isZh ? '是' : 'Yes'}}</el-radio>-->
                <!--<el-radio :label="0">{{isZh ? '否' : 'No'}}</el-radio>-->
              <!--</el-radio-group>-->
            <!--</el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" v-show="!isDetail" :loading="linkLoading" @click="addAccount('linkForm')">{{$t('system.role.seave')}}</el-button>
            <el-button type="danger" size="small" @click="addLinkVisible=false">{{$t('system.role.return')}}</el-button>
          </div>
        </el-dialog>
        <!--编辑-->
        <el-dialog
          width="800px"
          center
          :title="isZh?'编辑联系人':'Edit Contact'"
          :close-on-click-modal="false"
          :visible.sync="editLinkVisible"
          @close="clearLinkForm"
          append-to-body>
          <el-form ref="editForm" :model="editForm" v-if="editLinkVisible" :label-width="isZh?'100px': '150px'" label-position="left" size="small" :rules="linkFormRules">
            <el-row :gutter="28">
              <el-col :span="16">
                <el-form-item :label="$t('customer.customerList.accountNo')" prop="userAccount">
                  <el-input disabled v-model="editForm.userAccount" clearable />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.firstName')" prop="firstName">
                  <el-input v-model="editForm.firstName" :maxlength="20" clearable />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.lastName')" prop="lastName">
                  <el-input v-model="editForm.lastName" :maxlength="20" clearable />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.gender')" prop="userSex">
                  <el-radio-group v-model="editForm.userSex">
                    <el-radio :label="1">{{isZh ? '男' : 'Male'}}</el-radio>
                    <el-radio :label="2">{{isZh ? '女' : 'Female'}}</el-radio>
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
                </div>
              </el-col>
            </el-row>
            <el-form-item :label="$t('customer.customerList.emailAddress')" prop="emailAddress">
              <el-input v-model="editForm.emailAddress" :maxlength="50" clearable />
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.address')" prop="contactAddress">
              <el-input v-model="editForm.contactAddress" clearable />
            </el-form-item>
            <el-row :gutter="28">
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.officePhone')" prop="officePhone">
                  <el-input v-model.number="editForm.officePhone" :maxlength="16" :min="0" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.officePhone2')" prop="officePhone2">
                  <el-input v-model="editForm.officePhone2" :maxlength="16" :min="0" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.mobilePhone')" prop="mobilePhone">
                  <el-input v-model="editForm.mobilePhone" :maxlength="16" :min="0" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.mobilePhone2')" prop="mobilePhone2">
                  <el-input v-model="editForm.mobilePhone2" :maxlength="16" :min="0" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.usedLanguage')">
                  <el-select v-model="editForm.usedLanguage" clearable style="width: 100%" @change="setOtherList">
                    <el-option v-for="(item, index) in languageList" :label="language === 'zh' ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('customer.customerList.preferdLanguage')">
                  <el-select v-model="editForm.preferedLanguageStr" multiple style="width: 100%" @change="getcommLanguage">
                    <el-option v-for="(item, index) in languageList1" :label="language === 'zh' ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item :label="$t('customer.record.country')" prop="countryCode">
              <el-select filterable remote :remote-method="getCountryList" :loading="loading1"
                         v-model="editForm.countryCode" clearable style="width: 100%">
                <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item :label="$t('customer.customerList.conpanyName')" prop="companyName">-->
            <!--<el-input v-model="linkForm.companyName" :disabled="isCompanyName" />-->
            <!--</el-form-item>-->
            <el-form-item :label="isZh?'职位':'designation'" prop="position">
              <el-input v-model="editForm.position" :maxlength="100" clearable />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" :loading="linkLoading" @click="editAccount('editForm')">{{$t('system.role.seave')}}</el-button>
            <el-button type="danger" size="small" @click="editLinkVisible=false">{{$t('system.role.return')}}</el-button>

          </div>
        </el-dialog>
        <!--服务人员-->
        <el-tab-pane :label="$t('customer.customerList.serviceStaff')" name="6">
          <div class="divleft">
            <el-button type="primary" size="mini" style="margin: 0 20px" @click="addServiceModal">{{$t('system.role.add')}}</el-button>
          </div>
          <el-table
            :data="sslist"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column :label="$t('customer.customerList.name')" prop="accountBId" show-overflow-tooltip/>

            <el-table-column :label="$t('customer.customerList.designation')" prop="csJob" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.csJob | jobFmt(jobList, isZh)}}
              </template>
            </el-table-column>

            <!--<el-table-column :label="isZh?'账号':'UserAccpunt'" show-overflow-tooltip prop="userAccount">-->
            <!--</el-table-column>-->

            <!--<el-table-column :label="isZh?'电话':'MobilePhone'" show-overflow-tooltip prop="mobilePhone">-->
            <!--</el-table-column>-->

            <el-table-column align="center" :label="$t('system.role.operation')">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteService(scope.row)">{{$t('system.role.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-dialog
          width="600px"
          center
          :title="$t('customer.customerList.addServiceStaff')"
          :close-on-click-modal="false"
          :visible.sync="addServiceVisible"
          append-to-body>
          <el-form ref="serviceForm" v-if="addServiceVisible" :model="serviceForm" label-width="130px" label-position="right" size="small"
                   :rules="serviceFormRules">
            <el-form-item :label="$t('customer.customerList.name')" prop="accountBId">
              <el-select
                v-model="serviceForm.accountBId"
                remote
                :remote-method="getAccountUserList"
                clearable
                filterable
                :loading="loading1"
                class="form-dialog-width">
                <el-option v-for="(item, index) in accountUserList" :label="item.userName" :value="item.accountBId"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.designation')" prop="csJob">
              <el-select v-model="serviceForm.csJob" clearable class="form-dialog-width">
                <el-option v-for="(item, index) in jobList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="addServicePeople('serviceForm')">{{$t('system.role.seave')}}</el-button>
            <el-button type="danger" size="small" @click="addServiceVisible=false">{{$t('system.role.return')}}</el-button>
          </div>
        </el-dialog>
      </el-tabs>
    </el-dialog>

    <el-dialog
      width="700px"
      center
      :title="$t('supplier.manage.supplierHist')"
      :close-on-click-modal="false"
      :visible.sync="historyVisible">
      <!--<div class="search-box">-->
        <!--{{$t('customer.customerList.record')}}-->
      <!--</div>-->
      <el-table
        :data="historyList"
        border
        fit
        style="margin: 10px 0"
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column
          :label="$t('customer.customerList.no')"
          type="index"
          align="center"
          width="50">
        </el-table-column>

        <el-table-column align="center" :label="$t('supplier.record.supplierName')" show-overflow-tooltip >
          <template slot-scope="scope">
            {{historyParams.supplierName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('supplier.record.supplierCode')" show-overflow-tooltip >
          <template slot-scope="scope">
            {{historyParams.supplierCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="160" :label="$t('customer.customerList.modifiedTime')" prop="updateTime">
          <template slot-scope="scope">
            {{scope.row.updateTime | timeFmt}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" :label="$t('customer.customerList.modifier')" prop="updateUserName"/>

        <el-table-column align="center" :label="$t('system.role.operation')" width="80" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export" @click="openHistoryDetail(scope.row.modifyNo)">{{$t('common.table.view')}}</el-button>
          </template>
        </el-table-column>

      </el-table>

      <Pagination :total="historyParams.total" :page.sync="historyParams.pageNum" :limit.sync="historyParams.pageSize" @pagination="getHistoryList" />

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="historyVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <history-detail :value.sync="historyDetailVisible" :id="historyId" :sort-list="sortList"
                    :grade-list="gradeList" :gradient-list="priceGradientList" :job-list="jobList"
                    :own-filed-list="ownFiledList">
    </history-detail>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HistoryDetail from './components/HistoryDetail'
import {
  addCooperFile,
  addLinkPeople,
  addPayment,
  addService,
  deleteCooperFile,
  deleteLinkPeople,
  deleteService,
  deleteSupplier,
  getAllSortList,
  getCooperFileList,
  getLinkList,
  getPaymentDetail,
  getServiceList,
  gradeList,
  supplierBankDelete,
  supplierBankList,
  supplierBankSave,
  supplierBankUpdate,
  supplierDetailById,
  supplierPageList,
  supplierSave,
  supplierStatusById,
  supplierStatusUpdate,
  // updateLinkPeople,
  updatePayment,
  exportExcelSupplierList,
  supplierHistoryList,
  findContact,
  updateContactById
} from '@/api/supplier';
import { uploadActionUrl } from '@/api/common'
import { selectCountryListApi, selectCurrencyCodeListApi, selectgetDictionaryBykeyApi, selectUserFrontDetail, addUserFrontend, getUserFrontendByUserAccount, editUser } from '@/api/system'
import { getAdminUserList, selectUserListAllApi, getClientUserList } from '@/api/user'
import { deepClone, parseTime } from '@/utils/index'
import { validPhone } from '@/utils/validate'
export default {
  components: {
    Pagination,
    HistoryDetail
  },
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
      supplierContactType: '',
      addClientContact: false,
      addSupplierContact: false,
      Judge: true,
      isDetail: false,
      contactType: '',
      activeName: '1',
      listLoading: true,
      loading1: false,
      confirmLoading: false,
      linkLoading: false,
      editVisible: false,
      detailVisible: false,
      historyVisible: false,
      historyDetailVisible: false,
      addLinkVisible: false,
      selectLinkVisible: false,
      addServiceVisible: false,
      addBankVisible: false,
      Loading1: false,
      isShowEmailAddress: false,
      priceGradientList: [],
      dialogType: '',
      supplierData: {
        ownField: '',
        ownFieldList: [],
        // commLanguageList: [],
        commLanguage: '',
        supplierName: '',
        shortName: '',
        supplierCode: '',
        countryCode: '',
        // companyName: '',
        supplierStatus: 1,
        chargeBy: '',
        provinceCode: '',
        registerAddress: '',
        emailAddress: '',
        mobilePhone: '',
        facsimileNo: '',
        deliveryPort: '',
        deliveryPortArr: [],
        supplierSortBId: '',
        supplierGradeBId: '',
        supplierSortName: [],
        customerSource: '',
        transaStatus: '',
        // preferredLanguage: '',
        taxNo: '',
        facsimileNo2: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: '',
        registerPhone: '',
        postalCode: '',
        otherAddress: '',
        officeAddress: '',
        remarks: '',
        reservedField1: '',
        reservedField2: '',
        reservedField3: '',
        reservedField4: '',
        reservedField5: '',
        reservedField6: '',
        reservedField7: '',
        reservedField8: '',
        reservedField9: '',
        reservedField10: '',
        supplierType: 1,
        updateTime: ''
      },
      editForm: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        customerJob: '',
        position: '',
        photoPath: '',
        usedLanguage: '',
        userAccount: '',
        contactAddress: '',
        userSex: 1,
        preferedLanguage: '',
        mobilePhone: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: '',
        userType: 1,
        countryCode: '',
        preferedLanguageStr: []
      },
      editLinkVisible: false,
      supplierFormRules: {
        supplierName: [
          { required: true, message: this.$t('supplier.manage.inputSupplierName'), trigger: 'blur' }
        ],
        supplierCode: [
          { required: true, message: this.$t('supplier.manage.inputSupplierCode'), trigger: 'blur' }
        ],
        // companyName: [
        //   { required: true, message: '请填写公司名称', trigger: 'blur' }
        // ],
        countryCode: [
          { required: true, message: this.$t('system.userManage.userCountry'), trigger: 'change' }
        ],
        postalCode: [
          {
            pattern: /^\d+(\.{1}\d+)?$/,
            message: this.$t('customer.customerList.inputEmail')
          }
        ],
        emailAddress: [
          { required: true, message: this.$t('system.userManage.userEmail'), trigger: 'blur' },
          { type: 'email', message: this.$t('customer.customerList.inputEmailSave'), trigger: 'blur' }
        ],
        taxNo: [
          {
            pattern: /^\w+$/,
            message: this.$t('customer.customerList.inputEin'),
            trigger: 'blur'
          }
        ],
        mobilePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        mobilePhone1: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        officePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        officePhone2: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        chargeBy: [
          { required: true, message: this.$t('customer.customerList.inputHead'), trigger: 'blur' }
        ],
        deliveryPortArr: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inputPort'), trigger: 'change' }
        ],
        // commLanguageList: [
        //   { type: 'array', required: true, message: '请选择首选语言', trigger: 'change' }
        // ],
        // preferredLanguage: [
        //   { required: true, message: '请选择首选语言', trigger: 'change' }
        // ],
        supplierGradeBId: [
          { required: true, message: this.$t('supplier.manage.inputSupplierLevel'), trigger: 'change' }
        ],
        supplierSortName: [
          { type: 'array', required: true, message: this.$t('supplier.manage.inputSupplierCategory'), trigger: 'change' }
        ],
        supplierType: [
          { required: true, message: this.$t('supplier.manage.supplierTypeHint'), trigger: 'change' }
        ]
      },
      spt: {
        paymentMethod: '',
        gradientLevel: '1',
        shipmentType: '',
        paymentType: '',
        deliveryPort: '',
        currencyCode: ''
      },
      sptRules: {
        gradientLevel: [{ required: true, message: this.$t('customer.customerList.inputGradient'), trigger: 'change' }],
        deliveryPort: [{ required: true, message: this.$t('customer.customerList.inputPort'), trigger: 'change' }],
        shipmentType: [{ required: true, message: this.$t('customer.customerList.inputTransportation'), trigger: 'change' }],
        paymentMethod: [{ required: true, message: this.$t('customer.customerList.inputPayment'), trigger: 'change' }],
        paymentType: [{ required: true, message: this.$t('customer.customerList.inputOffer'), trigger: 'change' }],
        currencyCode: [{ required: true, message: this.$t('supplier.manage.inputCurrency'), trigger: 'change' }]
      },
      controlTowerList: [],
      sbalist: [{ bankAccount: '', bankName: '', reservedPhone: '', swiftCode: '' }],
      scplist: [],
      sclist: [],
      sslist: [],
      linkForm: {
        defaultStatus: 0,
        firstName: '',
        lastName: '',
        emailAddress: '',
        supplierJob: '',
        position: '',
        photoPath: '',
        usedLanguage: '',
        userAccount: '',
        contactAddress: '',
        userSex: 1,
        companyName: '',
        preferedLanguage: '',
        mobilePhone: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: '',
        userType: 2,
        countryCode: '',
        preferedLanguageStr: []
      },
      linkFormRules: {
        userAccount: [
          { required: true, message: this.$t('customer.customerList.inputAccount'), trigger: 'blur' }
        ],
        contactFirstName: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'blur' }
        ],
        contactLastName: [
          { required: true, message: this.$t('customer.customerList.inputFirstName'), trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: this.$t('customer.customerList.inputFirstName'), trigger: 'blur' }
        ],
        emailAddress: [
          { required: true, message: this.$t('system.userManage.userEmail'), trigger: 'blur' },
          { type: 'email', message: this.$t('customer.customerList.inputEmailSave'), trigger: 'blur' }
        ],
        contactAddress: [
          { required: true, message: this.$t('customer.customerList.inputAddress'), trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        officePhone: [
          { required: true, message: this.$t('customer.customerList.inputOfficePhone'), trigger: 'blur' }
        ],
        countryCode: [
          { required: true, message: this.$t('system.userManage.userCountry'), trigger: 'change' }
        ],
        usedLanguage: [
          { required: true, message: this.$t('customer.customerList.inputUsedLanguage'), trigger: 'change' }
        ]
      },
      serviceForm: {
        accountBId: '',
        accountName: '',
        csJob: this.$t('customer.customerList.serviceStaff')
      },
      serviceFormRules: {
        accountBId: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'change' }
        ],
        csJob: [
          { required: true, message: this.$t('customer.customerList.inputDesignation'), trigger: 'change' }
        ]
      },
      bankSelectList: [],
      bankDialogType: 'add',
      bankForm: {
        bankAccount: '',
        bankName: '',
        reservedPhone: '',
        swiftCode: '',
        bankAddress: '',
        branchName: '',
        accountType: 1,
        defaultValue: 0,
        accountCurrency: ''
      },
      bankFormRules: {
        bankAccount: [
          { required: true, message: this.$t('customer.customerList.inputBankName'), trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: this.$t('customer.customerList.inputBankName'), trigger: 'blur' }
        ],
        swiftCode: [
          { required: true, message: this.$t('customer.customerList.inputSwiftCode'), trigger: 'blur' }
        ],
        accountCurrency: [
          { required: true, message: this.$t('supplier.manage.inputCurrency'), trigger: 'change' }
        ],
        bankAddress: [
          { required: true, message: this.$t('customer.customerList.inputBankAddress'), trigger: 'blur' }
        ]
      },
      userListPrams: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      selectLinkPeople: [],
      // labelList: [
      //   {
      //     id: '1',
      //     name: '需重点关注',
      //     color: 'red'
      //   },
      //   {
      //     id: '2',
      //     name: '特别难缠',
      //     color: 'green'
      //   },
      //   {
      //     id: '3',
      //     name: '价格敏感',
      //     color: 'blue'
      //   },
      //   {
      //     id: '4',
      //     name: '资金紧张',
      //     color: 'orange'
      //   }
      // ],
      checkAll: false,
      isShowSupplierEmail: false,
      countryList: [],
      ClientlinkForm: {},
      currencyCodeList: [],
      selectList: [],
      sortList: [],
      gradeList: [],
      linkList: [],
      accountUserList: [],
      jobList: [],
      searchSortName: [],
      languageList1: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        supplierSortId: '',
        supplierGradeId: '',
        supplierCode: '',
        countryCode: '',
        officePhone: '',
        supplierStatus: ''
      },
      reviewForm: {
        idlist: '',
        supplierStatus: 0
      },
      languageList: [],
      ownFiledList: [],
      customerSourceList: [
        {
          id: "1",
          label: '自主研发',
          enLabel: 'Self-developed'
        },
        {
          id: "2",
          label: '询价',
          enLabel: 'Inquiry'
        },
        {
          id: "3",
          label: '展览会',
          enLabel: 'Exhibition'
        }
      ],
      cooperTypeList: [
        {
          label: '代理',
          enLabel: 'Agency',
          id: 1
        },
        {
          label: '分销',
          enLabel: 'Distribution',
          id: 2
        },
        {
          label: '直营',
          enLabel: 'Directly',
          id: 3
        },
        {
          label: '代销',
          enLabel: 'Consignment ',
          id: 4
        }
      ],
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
      supplierTypeList: [
        {
          label: '标准产品供应商',
          enLabel: 'Standard Product Supplier',
          id: 1
        },
        {
          label: '物流供应商',
          enLabel: 'Logistics supplier',
          id: 2
        },
        {
          label: '金融供应商',
          enLabel: 'Financial suppliers',
          id: 3
        }
      ],
      // portList: [
      //   {
      //     label: '港口1',
      //     bid: '1'
      //   },
      //   {
      //     label: '港口2',
      //     bid: '2'
      //   },
      //   {
      //     label: '港口3',
      //     bid: '3'
      //   },
      //   {
      //     label: '港口4',
      //     bid: '4'
      //   }
      // ],
      historyList: [],
      historyParams: {
        pageNum: 1,
        pageSize: 10,
        modifyCustomerBId: ''
      },
      historyId: '',
      adminUserList: [],
      dataList: [],
      supplierStatus: [],
      cooperObj: {
        cooperMode: '',
        rangeTime: '',
        beginTime: '',
        endTime: '',
        pactFile: '',
        pactFileUuid: '',
        pactFilePath: ''
      },
      fileList: [],
      firstPayment: false
    }
  },
  computed: {
    transportList() {
      return this.$store.state.order.transportList
    },
    paymentList() {
      return this.$store.state.order.paymentList
    },
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val
    }
  },
  created() {
    this.getDataList();
    this.getGradeList();
    // this.getUserAccountList();
    this.getSortList();
    this.getCountryAllList();
    this.getCurrencyCodeListFun();
    this.selectgetDictionaryPriceGradientFun(); // 数据字典， 获取梯度值
    this.getJobList();
    this.getLanguageList();
    this.getOwnFieldList()
  },
  methods: {
    // 数据字典，获取梯度值
    selectgetDictionaryPriceGradientFun() {
      selectgetDictionaryBykeyApi({ key: 'grads' }).then(res => {
        this.priceGradientList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    radioJudge(val) {
      if (val === 1) {
        this.Judge = true
      } else {
        this.Judge = false
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
    // 获取所属领域字典
    getOwnFieldList() {
      selectgetDictionaryBykeyApi({ key: 'belonged_area' }).then(res => {
        this.ownFiledList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 数据字典，获取职务
    getJobList() {
      selectgetDictionaryBykeyApi({ key: 'servicePersonal' }).then(res => {
        this.jobList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    clearDetailDialog() {
      this.$refs['supplierData'].resetFields();
      this.supplierData.bid = ''
      this.supplierData.ownField = '';
      this.supplierData.deliveryPort = '';
      this.supplierData.countryCode = '';
      this.supplierData.ownFielList = [];
      this.supplierData.updateTime = '';
      // this.supplierData.commLanguageList = [];
      this.detailVisible = false;
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    addSupplierRecord(id, supplierName) {
      this.$router.push({
        query: {
          id, supplierName
        },
        path: '/supplier/communication'
      })
    },
    clearLinkForm() {
      this.linkForm = {
        defaultStatus: 0,
        firstName: '',
        lastName: '',
        emailAddress: '',
        supplierJob: '',
        position: '',
        photoPath: '',
        usedLanguage: '',
        userAccount: '',
        contactAddress: '',
        userSex: 1,
        companyName: '',
        preferedLanguage: '',
        mobilePhone: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: '',
        userType: 2,
        countryCode: '',
        preferedLanguageStr: []
      }
    },
    clearDialog() {
      this.$refs['supplierData'].resetFields();
      this.supplierData.bid = '';
      this.supplierData.ownField = '';
      this.supplierData.deliveryPort = '';
      this.supplierData.countryCode = '';
      this.supplierData.ownFielList = [];
      // this.supplierData.commLanguageList = [];
    },
    setOtherList(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.value !== val
      });
      if (this.linkForm.preferedLanguageStr.includes(val)) {
        this.linkForm.preferedLanguageStr = this.linkForm.preferedLanguageStr.filter(e => e !== val)
      }
      if (this.editForm.preferedLanguageStr.includes(val)) {
        this.editForm.preferedLanguageStr = this.editForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    // 常用语言转为字符
    getcommLanguage(arr) {
      if (arr.length) {
        this.linkForm.preferedLanguage = arr.join(',');
        this.editForm.preferedLanguage = arr.join(',');
      } else {
        this.linkForm.preferedLanguage = '';
        this.editForm.preferedLanguage = '';
      }
    },
    getCountryAllList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || []
      })
    },
    // 弹窗类别转化字符串
    getParentId(arr) {
      if (arr.length) {
        this.supplierData.supplierSortBId = arr.join(',')
      } else {
        this.supplierData.supplierSortBId = ''
      }
    },
    // 主列表数组转为字符串搜索
    getParentId1(arr) {
      if (arr.length) {
        this.postData.supplierSortBId = arr.join(',')
      } else {
        this.postData.supplierSortBId = ''
      }
    },
    // 港口id数组转为字符
    getPortIds(arr) {
      if (arr.length) {
        this.supplierData.deliveryPort = arr.join(',')
      } else {
        this.supplierData.deliveryPort = ''
      }
    },
    // 所属领域转为字符
    getownField(arr) {
      if (arr.length) {
        this.supplierData.ownFieldString = arr.join(',')
      } else {
        this.supplierData.ownFieldString = ''
      }
    },
    // 点击切换tabs
    changeTabs(name) {
      if (name !== '1' && !this.supplierData.bid) {
        this.$message.warning(this.$t('customer.customerList.hintPerfect'));
        return false
      }
      switch (Number(name)) {
        case 2:
          this.getSupplierBankList();
          break;
        case 3:
          this.getPayments();
          break;
        case 4:
          this.getCooperFile();
          break;
        case 5:
          this.getLinkPeople();
          break;
        case 6:
          this.getServiceList();
          break;
        default:
          break;
      }
    },
    radioButton(id) {
      updateContactById({
        id: id,
        supplierBId: this.supplierData.bid
      }).then(res => {
        this.getLinkPeople();
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取银行卡列表
    getSupplierBankList() {
      supplierBankList({ supplierBId: this.supplierData.bid }).then(res => {
        this.sbalist = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取付款信息
    getPayments() {
      getPaymentDetail({ supplierBId: this.supplierData.bid }).then(res => {
        this.spt = Object.assign(this.spt, res.data);
        if (res.data.gradientLevel) {
          this.spt.gradientLevel = res.data.gradientLevel.toString();
        }
        if (res.data.sopnList && res.data.sopnList.length) {
          this.firstPayment = false;
          this.controlTowerList = res.data.sopnList || []
        } else {
          this.controlTowerList = (res.data.controlTowerList || []).map(e => {
            e.dayNum = 0;
            e.paymentRatio = 0;
            e.supplierBId = this.supplierData.bid;
            e.controlNodeBId = e.bid;
            e.nodeLevel = e.sequence;
            return { ...e }
          });
          this.firstPayment = true;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 保存付款信息
    savePayment(formName) {
      if (this.totalSum !== 100) {
        return this.$message.warning(this.$t('customer.customerList.proportion'))
      }
      if (!this.Judge) {
        if (this.spt.shipmentType === '') {
          return this.$message.warning(this.$t('customer.customerList.complete'))
        } else if (this.spt.deliveryPort === '') {
          return this.$message.warning(this.$t('customer.customerList.complete'))
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.firstPayment ? addPayment : updatePayment;
          this.confirmLoading = true;
          this.spt.supplierBId = this.supplierData.bid;
          this.spt.sopnList = this.controlTowerList;
          api(this.spt).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.firstPayment = false;
            this.confirmLoading = false;
          }).catch(err => {
            this.$message.error(err.message);
            this.confirmLoading = false;
          });
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    // 获取合作协议列表
    getCooperFile() {
      getCooperFileList({ supplierBId: this.supplierData.bid }).then(res => {
        this.scplist = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取联系人列表
    getLinkPeople() {
      getLinkList({ supplierBId: this.supplierData.bid }).then(res => {
        this.sclist = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取服务人员列表
    getServiceList() {
      getServiceList({ supplierBId: this.supplierData.bid }).then(res => {
        this.sslist = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 禁用或者启用
    changeMethod(row) {
      supplierStatusUpdate({
        id: row.id,
        supplierStatus: row.supplierStatus ? 0 : 1
      }).then(res => {
        this.$message.success(this.$t("system.userManage.updata"));
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 获取主页菜单
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      supplierPageList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    // 获取等级列表
    getGradeList() {
      gradeList().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      if (this.dialogType === '') {
        getAllSortList({
          supplierSortStatus: 1
        }).then(res => {
          this.sortList = res.data || []
        }).catch(err => {
          this.$message.error(err.message);
        });
      } else {
        getAllSortList().then(res => {
          this.sortList = res.data || []
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    // 查询获取国家
    getLinkFormCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 获取币种列表
    getCurrencyCodeListFun() {
      selectCurrencyCodeListApi().then(res => {
        this.currencyCodeList = res.data || [];
      });
    },
    // 获取后台用户
    getUserAccountList() {
      getAdminUserList().then(res => {
        this.accountUserList = res.data || []
      })
    },
    getAccountUserList(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectUserListAllApi(val).then(res => {
          _this.accountUserList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.accountUserList = [];
      }
    },
    // 打开修改历史弹窗
    openHistory(row) {
      this.historyParams.supplierCode = row.supplierCode;
      this.historyParams.supplierName = row.supplierName;
      this.historyParams.pageNum = 1;
      this.historyParams.modifySupplierBId = row.bid;
      this.getHistoryList()
    },
    getHistoryList() {
      supplierHistoryList(this.historyParams).then(res => {
        this.historyVisible = true;
        this.historyList = res.data.list || [];
        this.historyParams.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 历史详情弹窗
    openHistoryDetail(id) {
      this.historyId = id;
      this.historyDetailVisible = true;
    },
    // 打开新增编辑弹窗
    openEdit(type, id) {
      this.getSortList();
      this.activeName = '1';
      if (type === 'edit') {
        let obj = {
          bid: id
        };
        supplierDetailById(obj).then(res => {
          this.supplierData = Object.assign(this.supplierData, res.data);
          this.supplierContactType = this.supplierData.supplierType;
          this.supplierData.supplierSortName = this.supplierData.supplierSortBId.split(',');
          if (res.data.deliveryPort) {
            this.supplierData.deliveryPortArr = this.supplierData.deliveryPort.split(',');
          } else {
            this.supplierData.deliveryPortArr = []
          }
          if (res.data.ownField) {
            this.supplierData.ownFieldList = this.supplierData.ownField.split(',');
          } else {
            this.supplierData.ownFieldList = []
          }
          // if (res.data.commLanguage) {
          //   this.supplierData.commLanguageList = this.supplierData.commLanguage.split(',');
          // } else {
          //   this.supplierData.commLanguageList = []
          // }
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    // 打开详情弹窗
    openDetail(id) {
      this.getSortList();
      this.activeName = '1';
      this.detailVisible = true;
      let obj = {
        bid: id
      };
      supplierDetailById(obj).then(res => {
        this.supplierData = Object.assign(this.supplierData, res.data);
        this.supplierData.supplierSortName = this.supplierData.supplierSortBId.split(',');
        if (res.data.deliveryPort) {
          this.supplierData.deliveryPortArr = this.supplierData.deliveryPort.split(',');
        } else {
          this.supplierData.deliveryPortArr = []
        }
        if (res.data.ownField) {
          this.supplierData.ownFieldList = this.supplierData.ownField.split(',');
        } else {
          this.supplierData.ownFieldList = []
        }
        // if (res.data.commLanguage) {
        //   this.supplierData.commLanguageList = this.supplierData.commLanguage.split(',');
        // } else {
        //   this.supplierData.commLanguageList = []
        // }
        this.getSupplierBankList();
        this.getPayments();
        this.getCooperFile();
        this.getLinkPeople();
        this.getServiceList();
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 供应商列表多选
    getSelect(selects) {
      this.selectList = selects;
    },
    // 打开用户列表
    addFromUserList() {
      this.selectLinkVisible = true;
      this.getSelectUserList()
    },
    // 从用户列表获取联系人
    getSelectUserList() {
      let obj = {};
      for (let key in this.userListPrams) {
        if (this.userListPrams[key]) {
          obj[key] = this.userListPrams[key]
        }
      }
      obj.accountStatus = 0
      getClientUserList(obj).then(res => {
        this.linkList = res.data.list || [];
        this.userListPrams.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 选中用户，单选
    singleSelectUser(arr) {
      this.selectLinkPeople = arr;
      console.log(arr)
      if (arr.length > 1) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(arr.pop())
      }
    },
    // 从用户列表添加联系人
    addLinkFromList() {
      if (!this.selectLinkPeople.length) {
        return this.$message.error(this.$t('customer.customerList.selectUser'))
      }
      if (this.selectLinkPeople.length !== 1) {
        return this.$message.error(this.$t('customer.customerList.addSelectUser'))
      }
      let obj = {
        accountBId: this.selectLinkPeople[0].accountBId,
        // contactName: this.selectLinkPeople[0].lastName + ' ' + this.selectLinkPeople[0].firstName,
        contactLastName: this.selectLinkPeople[0].lastName,
        contactFirstName: this.selectLinkPeople[0].firstName,
        contactPhone: this.selectLinkPeople[0].mobilePhone,
        emailAddress: this.selectLinkPeople[0].userAccount,
        supplierJob: this.selectLinkPeople[0].position,
        supplierBId: this.supplierData.bid,
        supplierType: this.supplierContactType
      };
      let obj1 = {
        emailAddress: obj.emailAddress,
        supplierBId: this.supplierData.bid
      };
      findContact(obj1).then(res => {
        // this.isShowSupplierEmail = res.data;
        if (res.data) {
          return this.$message.warning(this.language === 'zh' ? '存在相同账户' : 'Same account exists')
        }
        addLinkPeople(deepClone(obj)).then(res => {
          if (res.status === 200) {
            this.sclist.push(deepClone(obj));
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.getLinkPeople();
            this.selectLinkPeople = [];
            this.$refs.multipleTable.clearSelection();
            this.selectLinkVisible = false
          }
        }).catch(err => {
          this.$message.warning(err.message);
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    addContactList() {
      this.addSupplierContact = true;
    },
    isEmailAddress() {
      let obj = {
        emailAddress: this.ClientlinkForm.emailAddress,
        supplierBId: this.supplierData.bid
      };
      findContact(obj).then(res => {
        this.isShowEmailAddress = res.data;
        if (res.data) {
          this.$message.warning(this.language === 'zh' ? '存在相同账户' : 'Same account exists')
        } else {
          this.isShowEmailAddress = false
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 打开新增联系人弹窗
    addLinkModal(type, row) {
      this.linkForm.companyName = this.supplierData.supplierName;
      this.contactType = type;
      if (type === 'detail') {
        this.isDetail = true;
        selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
          if (res.data) {
            this.linkForm = Object.assign(this.linkForm, res.data);
          }
          // this.linkForm.sortName = this.customerData.custSortBId.split(',');
          // if (res.data.deliveryPort) {
          //   this.linkForm.deliveryPortArr = this.linkForm.deliveryPort.split(',');
          // } else {
          //   this.linkForm.deliveryPortArr = []
          // }
          // if (res.data.ownField) {
          //   this.linkForm.ownFieldList = this.linkForm.ownField.split(',');
          // } else {
          //   this.linkForm.ownFieldList = []
          // }
          // if (res.data.commLanguage) {
          //   this.linkForm.commLanguageList = this.linkForm.commLanguage.split(',');
          // } else {
          //   this.linkForm.commLanguageList = []
          // }
        }).catch(err => {
          this.$message.error(err.message);
        });
        this.addLinkVisible = true;
      } else {
        this.linkForm.emailAddress = row.emailAddress;
        this.linkForm.firstName = row.contactFirstName;
        this.linkForm.lastName = row.contactLastName;
        this.linkForm.officePhone = row.contactPhone;
        this.linkForm.userAccount = row.emailAddress;
        this.isDetail = false;
        getUserFrontendByUserAccount({
          userAccount: row.emailAddress
        }).then(res => {
          if (res.data) {
            let obj = {
              accountBId: res.data.accountBId,
              contactName: res.data.userName,
              contactPhone: res.data.mobilePhone,
              emailAddress: res.data.userAccount,
              supplierBId: this.supplierData.bid,
              contactFirstName: row.contactFirstName,
              contactLastName: row.contactLastName
            };
            this.$confirm(
              this.language === 'zh' ? '是否与用户关联?' : 'Associated with user?',
              this.$t("system.userManage.hint"), {
                confirmButtonClass: 'el-button-confirmClass',
                cancelButtonClass: 'el-button-cancelClass',
                confirmButtonText: this.$t("system.role.affirm"),
                cancelButtonText: this.$t("system.role.return"),
                type: 'warning',
                center: true
              }).then(() => {
              addLinkPeople(obj).then(res => {
                if (res.status === 200) {
                  this.$message.success(this.$t("system.userManage.handle"));
                }
                this.getLinkPeople();
              }).catch(err => {
                this.$message.error(err.message);
              });
            }).catch(() => {
              this.$message({
                type: "info",
                message: this.$t("system.userManage.cancel")
              });
            });
          } else {
            this.addLinkVisible = true;
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    editDetail(row) {
      selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
        if (res.data) {
          this.editForm = Object.assign(this.editForm, res.data);
        }
        if (this.editForm.preferedLanguage) {
          this.editForm.preferedLanguageStr = this.editForm.preferedLanguage.split(',')
        } else {
          this.editForm.preferedLanguageStr = []
        }
        this.editLinkVisible = true;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    editAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.linkForm.customerBId = this.customerData.bid;
          this.editForm.supplierBId = this.supplierData.bid;
          // this.ClientlinkForm.contactName = this.ClientlinkForm.contactFirstName + ' ' + this.ClientlinkForm.contactLastName;
          this.linkLoading = true;
          this.editForm.addType = 2;
          editUser(this.editForm).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.$refs[formName].resetFields();
            this.editForm.photoPath = '';
            this.getLinkPeople();
            this.linkLoading = false;
            this.editLinkVisible = false
          }).catch(err => {
            this.linkLoading = false;
            this.$message.error(err.message);
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    // 新增联系人
    addSupplierPeople(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.linkLoading = true;
          this.ClientlinkForm.supplierBId = this.supplierData.bid;
          // this.ClientlinkForm.addType = 2;
          if (this.isShowEmailAddress) {
            return this.$message.warning(this.language === 'zh' ? '存在相同账户' : 'Same account exists')
          }
          addLinkPeople(this.ClientlinkForm).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.$refs[formName].resetFields();
            this.getLinkPeople();
            this.addLinkVisible = false;
            this.linkLoading = false;
            this.addSupplierContact = false;
          }).catch(err => {
            this.linkLoading = false;
            this.$message.warning(err.message);
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    // 创建账户
    addAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.linkForm.customerBId = this.customerData.bid;
          this.linkForm.supplierType = this.supplierContactType;
          this.linkForm.businessBid = this.supplierData.bid;
          // this.ClientlinkForm.contactName = this.ClientlinkForm.contactFirstName + ' ' + this.ClientlinkForm.contactLastName;
          this.linkLoading = true;
          this.linkForm.addType = 2;
          addUserFrontend(this.linkForm).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.$refs[formName].resetFields();
            this.linkForm.photoPath = '';
            this.getLinkPeople();
            this.linkLoading = false;
            this.addLinkVisible = false
          }).catch(err => {
            this.linkLoading = false;
            this.$message.error(err.message);
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    // 删除联系人
    deleteLinkPeople(row) {
      deleteLinkPeople({ id: row.id }).then(res => {
        this.$message.success(this.$t('customer.customerList.saveSuccess'));
        this.getLinkPeople();
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    // 新增服务人员
    addServicePeople(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.serviceForm.supplierBId = this.supplierData.bid;
          addService(this.serviceForm).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.$refs[formName].resetFields();
            this.getServiceList();
            this.addServiceVisible = false;
          }).catch(err => {
            this.$message.warning(err.message);
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    // 删除服务人员
    deleteService(row) {
      deleteService({ id: row.id }).then(res => {
        this.$message.success(this.$t('customer.customerList.saveSuccess'));
        this.getServiceList();
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    // 打开服务人员弹窗
    addServiceModal() {
      this.getAccountUserList();
      this.addServiceVisible = true
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelSupplierList(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'supplierDetailList.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 新增、编辑银行账号
    addBankAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.bankDialogType === 'add' ? supplierBankSave : supplierBankUpdate;
          this.bankForm.supplierBId = this.supplierData.bid;
          api(this.bankForm).then(res => {
            this.$refs[formName].resetFields();
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.getSupplierBankList();
            this.addBankVisible = false
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    openBankDialog(type, row) {
      if (type === 'edit') {
        this.bankForm = deepClone(row)
      } else {
        this.bankForm = {
          bankAccount: '',
          bankName: '',
          reservedPhone: '',
          swiftCode: '',
          bankAddress: '',
          branchName: '',
          accountType: 1,
          defaultValue: 0,
          accountCurrency: ''
        }
      }
      this.bankDialogType = type;
      this.addBankVisible = true;
    },
    getBankSelect(selects) {
      this.bankSelectList = selects
    },
    // 删除银行账户
    removeBankAccount(arr, scope) {
      if (!this.bankSelectList.length) {
        return this.$message.warning(this.$t("system.userManage.option"))
      }
      supplierBankDelete({ ids: this.bankSelectList.map(e => e.id).join(',') }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getSupplierBankList();
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    arrSplice(arr, index) {
      arr.splice(index, 1)
    },
    // 把多选框选的值由数组转换为字符串
    getCheckBoxVal(arr) {
      this.spt.shipmentType = arr.join(',')
    },
    // 删除主列表数据，可批量删除
    deleteSupplier(id) {
      let obj = {};
      if (id) {
        obj = {
          bid: id,
          delFlag: 2
        }
      } else {
        if (!this.selectList.length) {
          return this.$message.error(this.$t("system.userManage.option"));
        } else {
          for (let i = 0; i < this.selectList.length; i++) {
            if (this.selectList[i].supplierStatus === 1) {
              return this.$message.warning(this.language === 'zh' ? '使用中的用户无法删除' : 'Users in use cannot be deleted')
            }
          }
        }
        obj = {
          bid: this.selectList.map(e => e.bid).join(','),
          delFlag: 2
        }
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
        deleteSupplier(obj).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.getDataList();
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
    // 保存基础信息
    saveBasicMsg(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          this.supplierData.ownField = this.supplierData.ownFieldString;
          this.supplierData.commLanguage = this.supplierData.commLanguageString;
          this.supplierContactType = this.supplierData.supplierType;
          if (this.supplierData.bid) {
            supplierStatusById(this.supplierData).then(res => {
              this.$message.success(this.$t("system.userManage.handle"));
              this.postData.pageNum = 1;
              this.getDataList();
              // this.editVisible = false;
              this.confirmLoading = false;
            }).catch(err => {
              this.confirmLoading = false;
              this.$message.error(err.message);
            });
          } else {
            this.supplierData.ownField = this.supplierData.ownFieldString;
            this.supplierData.commLanguage = this.supplierData.commLanguageString;
            supplierSave(this.supplierData).then(res => {
              this.$message.success(this.$t("system.userManage.handle"));
              this.supplierData.bid = res.data;
              this.postData.pageNum = 1;
              this.getDataList();
              // this.editVisible = false;
              this.confirmLoading = false;
            }).catch(err => {
              this.confirmLoading = false;
              this.$message.error(err.message);
            });
          }
        } else {
          this.$message.warning(this.$t("system.userManage.check"))
          return false;
        }
      });
    },
    // 获取时间范围拆分
    getRangeTime(arr) {
      if (arr && arr.length) {
        this.cooperObj.beginTime = arr[0];
        this.cooperObj.endTime = arr[1]
      } else {
        this.cooperObj.beginTime = '';
        this.cooperObj.endTime = ''
      }
    },
    // 新增协议
    addPactFileList() {
      if (!this.cooperObj.cooperMode || !this.cooperObj.rangeTime || !this.cooperObj.pactFile) {
        return this.$message.warning(this.$t('customer.customerList.complete'));
      }
      // this.scplist.push({ ...this.cooperObj });
      this.cooperObj.supplierBId = this.supplierData.bid
      addCooperFile(this.cooperObj).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.cooperObj.cooperMode = '';
        this.cooperObj.beginTime = '';
        this.cooperObj.endTime = '';
        this.cooperObj.rangeTime = null;
        this.cooperObj.pactFile = '';
        this.cooperObj.pactFileUuid = '';
        this.cooperObj.pactFilePath = '';
        this.$refs.upload.clearFiles();
        this.getCooperFile()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 删除协议
    removeFile(scope) {
      deleteCooperFile({ id: scope.row.id }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getCooperFile()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 下载协议
    exportPactFile(row) {
      this.downFile(row.pactFilePath);
    },
    // 上传文件删除
    handleRemove(file, fileList) {
      this.cooperObj.pactFile = '';
      this.cooperObj.pactFileUuid = '';
      this.cooperObj.pactFilePath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.cooperObj.pactFile = file.name;
      this.cooperObj.pactFileUuid = res.data.UUID;
      this.cooperObj.pactFilePath = res.data.filePath;
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('customer.customerList.fileLimit'));
    },
    // 上传之前限制
    beforeUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: this.$t('customer.record.fileFormat'),
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: this.$t('customer.record.fileSize'),
          type: 'warning'
        });
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.linkForm.photoPath = res.data.filePath;
      this.editForm.photoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t("system.userManage.uplode1"));
      }
      if (!isLt3M) {
        this.$message.error(this.$t("system.userManage.uplode2"));
      }
      return isJPG && isLt3M;
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    jobFmt(val, arr, isZh) {
      let objArr = arr.filter(e => e.value === val);
      if (objArr.length) {
        return isZh ? objArr[0].label : objArr[0].labelEn
      } else {
        return val
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';

  .supplier-container {
    .divleft {
      text-align: right;
    }
  }
  .avatar {
    text-align: center;
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
</style>
