<template>
  <el-dialog :visible.sync="show" :title="$t('customer.customerList.clientRecord')" width="1000px" center append-to-body class="customer-history">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
        <el-form ref="basicData" :model="basicData" :label-width="isZh?'126px': '140px'" inline label-position="left" size="small">
          <!--<el-form-item label="客户编码" prop="customerCode" >-->
            <!--<el-tooltip :content="basicData1.customerCode + ' ->> '+ basicData.customerCode" placement="top" effect="light" :disabled="!bankChange('customerCode')">-->
              <!--<el-input v-model="basicData.customerCode" readonly placeholder="客户编码" :class="{'has-change': bankChange('customerCode')}" style="width: 600px"/>-->
            <!--</el-tooltip>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="客户名称" prop="customerName">-->
            <!--<el-tooltip :content="basicData1.customerName + ' ->> '+ basicData.customerName" placement="top" effect="light" :disabled="!bankChange('customerName')">-->
              <!--<el-input v-model="basicData.customerName" readonly placeholder="客户名称" :class="{'has-change': bankChange('customerName')}" style="width: 600px"/>-->
            <!--</el-tooltip>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('customer.collect.companyName')" prop="companyName">
            <el-tooltip :content="basicData1.companyName + ' ->> '+ basicData.companyName" placement="top" effect="light" :disabled="!bankChange('companyName')">
              <el-input v-model="basicData.companyName" readonly :class="{'has-change': bankChange('companyName')}" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.companyAbbr')" prop="shortName">
            <el-tooltip :content="basicData1.shortName + ' ->> '+ basicData.shortName" placement="top" effect="light" :disabled="!bankChange('shortName')">
              <el-input v-model="basicData.shortName" readonly :class="{'has-change': bankChange('shortName')}" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.record.clientCode')" prop="customerCode" >
            <el-tooltip :content="basicData1.customerCode + ' ->> '+ basicData.customerCode" placement="top" effect="light" :disabled="!bankChange('customerCode')">
              <el-input v-model="basicData.customerCode" readonly :class="{'has-change': bankChange('customerCode')}" class="form-dialog-width" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.record.country')" prop="countryCode" >
            <el-tooltip :content="basicData1.countryCode + ' ->> '+ basicData.countryCode" placement="top" effect="light" :disabled="!bankChange('countryCode')">
              <el-select v-model="basicData.countryCode" :class="{'has-change': bankChange('countryCode')}" style="width: 620px">
                <el-option v-for="(item, index) in countryList" disabled :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
            <el-tooltip :content="basicData1.registerAddress + ' ->> '+ basicData.registerAddress" placement="top" effect="light" :disabled="!bankChange('registerAddress')">
              <el-input v-model="basicData.registerAddress" readonly :class="{'has-change': bankChange('registerAddress')}" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
            <el-tooltip :content="basicData1.officeAddress + ' ->> '+ basicData.officeAddress" placement="top" effect="light" :disabled="!bankChange('officeAddress')">
              <el-input v-model="basicData.officeAddress" readonly :class="{'has-change': bankChange('officeAddress')}" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <!--<el-form-item label="其他地址" prop="otherAddress">-->
            <!--<el-tooltip :content="basicData1.otherAddress + ' ->> '+ basicData.otherAddress" placement="top" effect="light" :disabled="!bankChange('otherAddress')">-->
              <!--<el-input v-model="basicData.otherAddress" readonly placeholder="其他地址" :class="{'has-change': bankChange('otherAddress')}" style="width: 600px"/>-->
            <!--</el-tooltip>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
            <el-tooltip :content="basicData1.postalCode + ' ->> '+ basicData.postalCode" placement="top" effect="light" :disabled="!bankChange('postalCode')">
              <el-input v-model="basicData.postalCode" readonly :class="{'has-change': bankChange('postalCode')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
            <el-tooltip :content="basicData1.provinceCode + ' ->> '+ basicData.provinceCode" placement="top" effect="light" :disabled="!bankChange('provinceCode')">
              <el-input v-model="basicData.provinceCode" readonly :class="{'has-change': bankChange('provinceCode')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
            <el-tooltip :content="basicData1.officePhone + ' ->> '+ basicData.officePhone" placement="top" effect="light" :disabled="!bankChange('officePhone')">
              <el-input v-model="basicData.officePhone" readonly :class="{'has-change': bankChange('officePhone')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
            <el-tooltip :content="basicData1.officePhone2 + ' ->> '+ basicData.officePhone2" placement="top" effect="light" :disabled="!bankChange('officePhone2')">
              <el-input v-model="basicData.officePhone2" readonly :class="{'has-change': bankChange('officePhone2')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
            <el-tooltip :content="basicData1.mobilePhone + ' ->> '+ basicData.mobilePhone" placement="top" effect="light" :disabled="!bankChange('mobilePhone')">
              <el-input v-model="basicData.mobilePhone" readonly :class="{'has-change': bankChange('mobilePhone')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
            <el-tooltip :content="basicData1.mobilePhone2 + ' ->> '+ basicData.mobilePhone2" placement="top" effect="light" :disabled="!bankChange('mobilePhone2')">
              <el-input v-model="basicData.mobilePhone2" readonly :class="{'has-change': bankChange('mobilePhone2')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo">
            <el-tooltip :content="basicData1.facsimileNo + ' ->> '+ basicData.facsimileNo" placement="top" effect="light" :disabled="!bankChange('facsimileNo')">
              <el-input v-model="basicData.facsimileNo" readonly :class="{'has-change': bankChange('facsimileNo')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
            <el-tooltip :content="basicData1.facsimileNo2 + ' ->> '+ basicData.facsimileNo2" placement="top" effect="light" :disabled="!bankChange('facsimileNo2')">
              <el-input v-model="basicData.facsimileNo2" readonly :class="{'has-change': bankChange('facsimileNo2')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
            <el-tooltip :content="basicData1.emailAddress + ' ->> '+ basicData.emailAddress" placement="top" effect="light" :disabled="!bankChange('emailAddress')">
              <el-input v-model="basicData.emailAddress" readonly :class="{'has-change': bankChange('emailAddress')}" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
            <el-tooltip :content="basicData1.taxNo + ' ->> '+ basicData.taxNo" placement="top" effect="light" :disabled="!bankChange('taxNo')">
              <el-input v-model="basicData.taxNo" readonly :class="{'has-change': bankChange('taxNo')}" style="width: 620px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.clientCategory')" prop="custSortBId">
            <el-cascader
              disabled
              class="form-dialog-width"
              v-model="basicData.sortName"
              :options="sortList"
              :props="{value: 'bid', label: 'sortName', children: 'children'}"
              filterable
              :class="{'has-change': bankChange('custSortBId')}"
              change-on-select
              style="width: 240px"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('customer.record.level')" prop="memberBId">
            <el-select v-model="basicData.memberBId" :class="{'has-change': bankChange('memberBId')}" disabled style="width: 237px">
              <el-option v-for="(item, index) in gradeList" disabled :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.clientStatus')" prop="transaStatus" :class="{'has-change': bankChange('transaStatus')}">
            <el-radio-group v-model="basicData.transaStatus" style="width: 620px;" disabled :class="{'has-change': bankChange('transaStatus')}">
              <el-radio :label="1">{{$t('customer.collect.complete')}}</el-radio>
              <el-radio :label="0">{{$t('customer.collect.noComplete')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
            <el-radio-group v-model="basicData.customerSource" style="width: 620px;" disabled :class="{'has-change': bankChange('customerSource')}">
              <!--<el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{item.label}}</el-radio>-->
                                <el-radio label="1">{{isZh ? '自主研发' : 'Self-developed'}}</el-radio>
                                <el-radio label="2">{{isZh ? '询价' : 'Inquiry'}}</el-radio>
                                <el-radio label="3">{{isZh ? '展览会' : 'Exhibition'}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList">
            <el-checkbox-group v-model="basicData.ownFieldList" style="width: 620px;" disabled :class="{'has-change': bankChange('ownField')}">
              <el-checkbox disabled v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
            <el-tooltip :content="basicData1.reservedField1 + ' ->> '+ basicData.reservedField1" placement="top" effect="light" :disabled="!bankChange('reservedField1')">
              <el-input v-model="basicData.reservedField1" readonly :class="{'has-change': bankChange('reservedField1')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
            <el-tooltip :content="basicData1.reservedField2 + ' ->> '+ basicData.reservedField2" placement="top" effect="light" :disabled="!bankChange('reservedField2')">
              <el-input v-model="basicData.reservedField2" readonly :class="{'has-change': bankChange('reservedField2')}" style="width: 240px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
            <el-input v-model="basicData.reservedField3" readonly :class="{'has-change': bankChange('reservedField3')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
            <el-input v-model="basicData.reservedField4" readonly :class="{'has-change': bankChange('reservedField4')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
            <el-input v-model="basicData.reservedField5" readonly :class="{'has-change': bankChange('reservedField5')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
            <el-input v-model="basicData.reservedField6" readonly :class="{'has-change': bankChange('reservedField6')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
            <el-input v-model="basicData.reservedField7" readonly :class="{'has-change': bankChange('reservedField7')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
            <el-input v-model="basicData.reservedField8" readonly :class="{'has-change': bankChange('reservedField8')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
            <el-input v-model="basicData.reservedField9" readonly :class="{'has-change': bankChange('reservedField9')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
            <el-input v-model="basicData.reservedField10" readonly :class="{'has-change': bankChange('reservedField10')}" style="width: 240px"/>
          </el-form-item>

          <el-form-item :label="$t('system.role.status')" prop="customerStatus" style="width: 240px">
            {{ basicData.customerStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
            <!--<el-select v-model="basicData.customerStatus" disabled :class="{'has-change': bankChange('customerStatus')}">-->
              <!--<el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <!--<el-form-item label="备注" prop="remarks">-->
            <!--<el-tooltip :content="basicData1.remarks + '->>'+ basicData1.remarks" placement="top" effect="light" :disabled="bankChange('remarks')">-->
              <!--<el-input v-model="basicData.remarks" type="textarea" :rows="5"-->
                        <!--readonly placeholder="remark"-->
                        <!--:class="{'has-change': bankChange('remarks')}" style="width: 600px"/>-->
            <!--</el-tooltip>-->
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
          size="small"
          :row-class-name="tableRowClassName"
          :header-cell-style="{background: '#a7bfee'}">
          <!--<el-table-column align="center" label="银行账号" prop="bankAccount" show-overflow-tooltip >-->
          <!--</el-table-column>-->

          <el-table-column :label="$t('customer.customerList.accountNo')" prop="bankAccount" show-overflow-tooltip>
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.bankName')" prop="bankName" show-overflow-tooltip >
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.branchName')" prop="branchName" show-overflow-tooltip>
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.address')" prop="bankAddress" show-overflow-tooltip>
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
      <!--付款条件-->
      <el-tab-pane :label="$t('customer.customerList.generalOrder')" name="3">
        <el-form :model="spt" :label-width="isZh ? '150px': '210px'" label-position="left" size="small">
          <el-form-item :label="$t('customer.customerList.defaultBase')" prop="paymentType">
            <el-radio-group v-model="spt.paymentType">
              <el-radio disabled :label="1">{{isZh ? '离岸价': 'FOB'}}</el-radio>
              <el-radio disabled :label="2">{{isZh ? '到岸价': 'CIF'}}</el-radio>
              <el-radio disabled :label="3">{{isZh ? '出厂价':'EXW'}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.customerList.defaultPort')" prop="deliveryPort">
            <el-tooltip :content="spt1.deliveryPort + '->>'+ spt.deliveryPort" placement="top" effect="light" :disabled="!paymentChange('deliveryPort')">
              <el-input v-model="spt.deliveryPort" readonly :class="{'has-change': paymentChange('deliveryPort')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.customerList.defaultMethod')" prop="shipmentType">
            <!--<el-checkbox-group v-model="spt.shipmentTypeArr" disabled>-->
              <!--<el-checkbox v-for="(item,index) in transportList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <el-select v-model="spt.shipmentType" :class="{'has-change': paymentChange('shipmentType')}">
              <el-option v-for="(item,index) in transportList" disabled :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.customerList.defaultTool')" prop="paymentMethod">
            <el-select v-model="spt.paymentMethod" :class="{'has-change': paymentChange('paymentMethod')}">
              <el-option v-for="(item,index) in paymentList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
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
                <td :class="{'table-change': paymentTable()}">
                  {{item.paymentRatio}}%
                </td>
                <td :class="{'table-change': paymentTable1()}">
                  {{item.dayNum}}{{isZh ? '天': ' days'}}
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
          :row-class-name="tableRowClassName1"
          :header-cell-style="{background: '#a7bfee'}">

          <el-table-column :label="$t('customer.customerList.schema')" prop="cooperMode" show-overflow-tooltip />

          <el-table-column :label="$t('customer.customerList.commencementDate')" prop="beginTime" show-overflow-tooltip >
            <template slot-scope="scope">
              {{scope.row.beginTime | timeFmt}}~{{scope.row.endTime | timeFmt}}
            </template>
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.agreement')" prop="pactFile" show-overflow-tooltip />
          <el-table-column align="center" :label="$t('system.role.operation')" >
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
          :row-class-name="tableRowClassName2"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column
            type="index"
            :label="$t('system.business.index')"
            align="center"
            width="50">
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.name')" show-overflow-tooltip >
            <template slot-scope="scope">
              <a href="javascript:void (0)">{{scope.row.contactName}}</a>
            </template>
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.contactNo')" prop="contactPhone" show-overflow-tooltip />

          <el-table-column :label="$t('customer.customerList.accountNo')" prop="emailAddress" show-overflow-tooltip />

          <el-table-column :label="$t('customer.customerList.designation')" prop="customerJob" show-overflow-tooltip/>
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
          :row-class-name="tableRowClassName3"
          :header-cell-style="{background: '#a7bfee'}">

          <el-table-column :label="$t('customer.customerList.serviceStaff')" prop="servingName" show-overflow-tooltip />

          <el-table-column :label="$t('customer.customerList.designation')" prop="csJob" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.csJob | jobFmt(jobList, isZh)}}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--客户商品类目-->
      <!--<el-tab-pane :label="$t('customer.customerList.productCategory')" name="7">-->
        <!--<div class="category-form">-->
          <!--<div>-->
            <!--{{$t('customer.customerList.tiers')}}&nbsp;&nbsp;-->
            <!--<el-select v-model="categoryInfo.gradientBId" disabled placeholder="select" style="width: 200px">-->
              <!--<el-option v-for="(item, index) in gradientList" :label="isZh ? item.name : item.labelEn" :value="item.id" :key="index"></el-option>-->
            <!--</el-select>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="category-form">{{$t('customer.customerList.select')}}</div>-->
        <!--<el-table-->
          <!--style="width:90%;margin: 10px auto"-->
          <!--:data="categoryInfo.productCatalogVos"-->
          <!--border-->
          <!--fit-->
          <!--size="mini"-->
          <!--row-key="id"-->
          <!--max-height="500"-->
          <!--:header-cell-style="{background: '#a7bfee'}">-->

          <!--<el-table-column header-align="center" :label="$t('customer.customerList.categoryCode')">-->
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.catalogCode}}/{{isZh ? scope.row.cnCatalogName : scope.row.enCatalogName}}-->
            <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column align="center" :label="$t('customer.customerList.productItems')" prop="bankName" />-->

          <!--<el-table-column align="center" :label="$t('customer.customerList.selectAll')">-->
            <!--<template slot-scope="scope">-->
              <!--<el-checkbox v-model="scope.row.check" disabled>{{$t('customer.customerList.sellable')}}</el-checkbox>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <!--<el-table-column align="center" :label="$t('customer.customerList.selectAll')" prop="defaultValue">-->
            <!--<template slot-scope="scope">-->
              <!--<el-checkbox v-model="scope.row.check2" disabled>{{isZh?'可见':'Visible'}}</el-checkbox>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</el-tab-pane>-->
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" size="small" @click="show=false">{{$t('common.buttonText.close')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { parseTime, deepClone } from '@/utils/index'
import { historyDetail } from '@/api/customer';
import { selectCountryListApi, selectgetDictionaryBykeyApi } from '@/api/system'
export default {
  data() {
    return {
      priceGradientList: [],
      show: false,
      activeName: '1',
      changeActiveName: 1,
      countryList: [],
      newData: {},
      oldData: {},
      basicData: {},
      sbalist: [],
      spt: {},
      scplist: [],
      sclist: [],
      sslist: [],
      controlTowerList: [],
      categoryInfo: {
        gradientBId: '',
        productCatalogVos: []
      },
      basicData1: {},
      sbalist1: [],
      spt1: {},
      scplist1: [],
      sclist1: [],
      sslist1: [],
      controlTowerList1: [],
      categoryInfo1: {
        gradientBId: '',
        productCatalogVos: []
      },
      gradientList: [
        {
          id: '1',
          name: '梯度1',
          labelEn: 'Gradient 1'
        },
        {
          id: '2',
          name: '梯度2',
          labelEn: 'Gradient 2'
        },
        {
          id: '3',
          name: '梯度3',
          labelEn: 'Gradient 3'
        },
        {
          id: '4',
          name: '梯度4',
          labelEn: 'Gradient 4'
        },
        {
          id: '5',
          name: '梯度5',
          labelEn: 'Gradient 5'
        }
      ],
      newBankList: [],
      newCooperList: [],
      newContactList: [],
      newServiceList: [],
      // ownFiledList: [
      //   {
      //     id: '1',
      //     label: 'IVD',
      //     enLabel: 'IVD'
      //   },
      //   {
      //     id: '2',
      //     label: '消耗品',
      //     enLabel: 'Consumable Items'
      //   },
      //   {
      //     id: '3',
      //     label: '实验装置',
      //     enLabel: 'Experiment Equipment'
      //   },
      //   {
      //     id: '4',
      //     label: '护理与监测',
      //     enLabel: 'Nursing&Monitoring'
      //   }
      // ],
      areaList: [
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
      ]
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    sortList: {
      type: Array,
      default: () => []
    },
    gradeList: {
      type: Array,
      default: () => []
    },
    jobList: {
      type: Array,
      default: () => []
    },
    ownFiledList: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.getCountryList();
    this.selectgetDictionaryPriceGradientFun()
  },
  methods: {
    // 查询获取国家
    getCountryList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || []
      })
    },
    selectgetDictionaryPriceGradientFun() {
      selectgetDictionaryBykeyApi({ key: 'grads' }).then(res => {
        this.priceGradientList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getDetail() {
      historyDetail({ modifyNo: this.id }).then(res => {
        this.changeActiveName = res.data.customerModifyRecord.modifyModuleType;
        this.newData = res.data.newCustomerModifyRecordVo;
        this.oldData = res.data.oldCustomerModifyRecordVo;

        this.basicData = this.newData.customerInfoVo;
        this.sbalist = this.newData.customerBankAccountList || [];
        this.scplist = this.newData.customerCooperPactList || [];
        this.sclist = this.newData.customerContactList || [];
        this.spt = this.newData.customerPaymentTerms || {};
        // this.spt.shipmentTypeArr = this.spt.shipmentType ? this.spt.shipmentType.split(',') : [];
        // this.spt.shipmentTypeArr = this.spt.shipmentType
        this.controlTowerList = this.spt ? (this.spt.customerOrderPayNodeList || []) : [];
        this.sslist = this.newData.customerServingVoList || [];
        this.categoryInfo = deepClone(this.newData.customerProductSpecVo);
        if (this.basicData.custSortBId) {
          this.basicData.sortName = this.basicData.custSortBId.split(',');
        } else {
          this.basicData.sortName = []
        }
        if (this.basicData.ownField) {
          this.basicData.ownFieldList = this.basicData.ownField.split(',');
        } else {
          this.basicData.ownFieldList = []
        }

        this.basicData1 = this.oldData.customerInfoVo;
        this.sbalist1 = this.oldData.customerBankAccountList || [];
        this.scplist1 = this.oldData.customerCooperPactList || [];
        this.sclist1 = this.oldData.customerContactList || [];
        this.spt1 = this.oldData.customerPaymentTerms || {};
        // this.spt1.shipmentTypeArr = this.spt1.shipmentType ? this.spt1.shipmentType.split(',') : [];
        // this.spt1.shipmentTypeArr = this.spt1.shipmentType
        this.controlTowerList1 = this.spt1 ? (this.spt1.customerOrderPayNodeList || []) : [];
        this.sslist1 = this.oldData.customerServingVoList || [];
        this.categoryInfo1 = deepClone(this.oldData.customerProductSpecVo);

        this.newBankList = this.sbalist.filter(e => {
          return !this.sbalist1.map(e => e.id).includes(e.id)
        }).map(e => e.id);
        this.newCooperList = this.scplist.filter(e => {
          return !this.scplist1.map(e => e.id).includes(e.id)
        }).map(e => e.id);
        this.newContactList = this.sclist.filter(e => {
          return !this.sclist1.map(e => e.id).includes(e.id)
        }).map(e => e.id);
        this.newServiceList = this.sslist.filter(e => {
          return !this.sslist1.map(e => e.id).includes(e.id)
        }).map(e => e.id)
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    bankChange(str) {
      if (this.basicData[str] !== this.basicData1[str]) {
        return true
      }
      return false
    },
    paymentChange(str) {
      if (this.spt[str] !== this.spt1[str]) {
        return true
      }
      return false
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.newBankList.includes(row.id)) {
        return 'change-tips';
      }
      return '';
    },
    tableRowClassName1({ row, rowIndex }) {
      if (this.newCooperList.includes(row.id)) {
        return 'change-tips';
      }
      return '';
    },
    tableRowClassName2({ row, rowIndex }) {
      if (this.newContactList.includes(row.id)) {
        return 'change-tips';
      }
      return '';
    },
    tableRowClassName3({ row, rowIndex }) {
      if (this.newServiceList.includes(row.id)) {
        return 'change-tips';
      }
      return '';
    },
    paymentTable() {
      let hasChange = false;
      this.controlTowerList.forEach(e => {
        this.controlTowerList1.forEach(t => {
          if (e.id === t.id && e.paymentRatio !== t.paymentRatio) {
            hasChange = true
          }
        })
      });
      return hasChange
    },
    paymentTable1() {
      let hasChange = false;
      this.controlTowerList.forEach(e => {
        this.controlTowerList1.forEach(t => {
          if (e.id === t.id && e.dayNum !== t.dayNum) {
            hasChange = true
          }
        })
      });
      return hasChange
    }
  },
  computed: {
    paymentList() {
      return this.$store.state.order.paymentList
    },
    transportList() {
      return this.$store.state.order.transportList
    }
  },
  watch: {
    show(val) {
      this.$emit('update:value', val);
      if (val) {
        this.getDetail()
      }
    },
    value(val) {
      this.show = val;
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
.customer-history {
  .has-change {
    input,textarea,.el-checkbox__label,.el-radio__label,.el-cascader__label {
      color: #DD4A68 !important;
    }
  }
  .table-change {
    color: #DD4A68;
  }
  .el-table .change-tips {
    color: #1e9b37;
  }
  .category-form {
    display: flex;
    display: -webkit-flex;
    width: 86%;
    margin: 10px auto;
    >div {
      flex: 1;
      line-height: 32px;
    }
  }
}
</style>
