<template>
  <el-dialog :visible.sync="show" :title="$t('supplier.manage.supplierHist')" width="1000px" center append-to-body class="customer-history">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
        <el-form ref="basicData" :model="basicData" :label-width="isZh?'140px': '160px'" inline label-position="right" size="small">
          <el-form-item :label="$t('supplier.record.supplierCode')" prop="supplierCode" >
            <el-tooltip :content="basicData1.supplierCode + ' ->> '+ basicData.supplierCode" placement="top" effect="light" :disabled="!bankChange('supplierCode')">
              <el-input v-model="basicData.supplierCode" readonly :class="{'has-change': bankChange('supplierCode')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.supplierName')" prop="customerName">
            <el-tooltip :content="basicData1.supplierName + ' ->> '+ basicData.supplierName" placement="top" effect="light" :disabled="!bankChange('supplierName')">
              <el-input v-model="basicData.supplierName" readonly :class="{'has-change': bankChange('supplierName')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <!--<el-form-item label="公司名称" prop="companyName">-->
            <!--<el-tooltip :content="basicData1.companyName + ' ->> '+ basicData.companyName" placement="top" effect="light" :disabled="!bankChange('companyName')">-->
              <!--<el-input v-model="basicData.companyName" readonly placeholder="公司名称" :class="{'has-change': bankChange('companyName')}" style="width: 600px"/>-->
            <!--</el-tooltip>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('supplier.record.supplierAbbr')" prop="shortName">
            <el-tooltip :content="basicData1.shortName + ' ->> '+ basicData.shortName" placement="top" effect="light" :disabled="!bankChange('shortName')">
              <el-input v-model="basicData.shortName" readonly :class="{'has-change': bankChange('shortName')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.record.country')" prop="countryCode" >
            <el-tooltip :content="basicData1.countryCode + ' ->> '+ basicData.countryCode" placement="top" effect="light" :disabled="!bankChange('countryCode')">
              <el-select v-model="basicData.countryCode" :class="{'has-change': bankChange('countryCode')}" style="width: 600px">
                <el-option v-for="(item, index) in countryList" disabled :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
            <el-tooltip :content="basicData1.registerAddress + ' ->> '+ basicData.registerAddress" placement="top" effect="light" :disabled="!bankChange('registerAddress')">
              <el-input v-model="basicData.registerAddress" readonly :class="{'has-change': bankChange('registerAddress')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
            <el-tooltip :content="basicData1.officeAddress + ' ->> '+ basicData.officeAddress" placement="top" effect="light" :disabled="!bankChange('officeAddress')">
              <el-input v-model="basicData.officeAddress" readonly :class="{'has-change': bankChange('officeAddress')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <!--<el-form-item label="其他地址" prop="otherAddress">-->
            <!--<el-tooltip :content="basicData1.otherAddress + ' ->> '+ basicData.otherAddress" placement="top" effect="light" :disabled="!bankChange('otherAddress')">-->
              <!--<el-input v-model="basicData.otherAddress" readonly placeholder="其他地址" :class="{'has-change': bankChange('otherAddress')}" style="width: 600px"/>-->
            <!--</el-tooltip>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
            <el-tooltip :content="basicData1.postalCode + ' ->> '+ basicData.postalCode" placement="top" effect="light" :disabled="!bankChange('postalCode')">
              <el-input v-model="basicData.postalCode" readonly :class="{'has-change': bankChange('postalCode')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
            <el-tooltip :content="basicData1.provinceCode + ' ->> '+ basicData.provinceCode" placement="top" effect="light" :disabled="!bankChange('provinceCode')">
              <el-input v-model="basicData.provinceCode" readonly :class="{'has-change': bankChange('provinceCode')}" style="width: 237px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
            <el-tooltip :content="basicData1.officePhone + ' ->> '+ basicData.officePhone" placement="top" effect="light" :disabled="!bankChange('officePhone')">
              <el-input v-model="basicData.officePhone" readonly :class="{'has-change': bankChange('officePhone')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
            <el-tooltip :content="basicData1.officePhone2 + ' ->> '+ basicData.officePhone2" placement="top" effect="light" :disabled="!bankChange('officePhone2')">
              <el-input v-model="basicData.officePhone2" readonly :class="{'has-change': bankChange('officePhone2')}" style="width: 237px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
            <el-tooltip :content="basicData1.mobilePhone + ' ->> '+ basicData.mobilePhone" placement="top" effect="light" :disabled="!bankChange('mobilePhone')">
              <el-input v-model="basicData.mobilePhone" readonly :class="{'has-change': bankChange('mobilePhone')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
            <el-tooltip :content="basicData1.mobilePhone2 + ' ->> '+ basicData.mobilePhone2" placement="top" effect="light" :disabled="!bankChange('mobilePhone2')">
              <el-input v-model="basicData.mobilePhone2" readonly :class="{'has-change': bankChange('mobilePhone2')}" style="width: 237px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo">
            <el-tooltip :content="basicData1.facsimileNo + ' ->> '+ basicData.facsimileNo" placement="top" effect="light" :disabled="!bankChange('facsimileNo')">
              <el-input v-model="basicData.facsimileNo" readonly :class="{'has-change': bankChange('facsimileNo')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
            <el-tooltip :content="basicData1.facsimileNo2 + ' ->> '+ basicData.facsimileNo2" placement="top" effect="light" :disabled="!bankChange('facsimileNo2')">
              <el-input v-model="basicData.facsimileNo2" readonly :class="{'has-change': bankChange('facsimileNo2')}" style="width: 237px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
            <el-tooltip :content="basicData1.emailAddress + ' ->> '+ basicData.emailAddress" placement="top" effect="light" :disabled="!bankChange('emailAddress')">
              <el-input v-model="basicData.emailAddress" readonly :class="{'has-change': bankChange('emailAddress')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
            <el-tooltip :content="basicData1.taxNo + ' ->> '+ basicData.taxNo" placement="top" effect="light" :disabled="!bankChange('taxNo')">
              <el-input v-model="basicData.taxNo" readonly :class="{'has-change': bankChange('taxNo')}" style="width: 600px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.supplierCategory')" prop="sortName">
            <el-cascader
              class="form-dialog-width"
              v-model="basicData.sortName"
              :options="sortList"
              :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
              filterable
              change-on-select
              :class="{'has-change': bankChange('supplierSortBId')}"
              style="width: 230px"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('supplier.record.supplierLevel')" prop="supplierGradeBId">
            <el-select v-model="basicData.supplierGradeBId" :class="{'has-change': bankChange('supplierGradeBId')}" style="width: 237px">
              <el-option v-for="(item, index) in gradeList" disabled :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('supplier.record.supplierStatus')" prop="transaStatus">
            <el-radio-group v-model="basicData.transaStatus" style="width: 600px;" :class="{'has-change': bankChange('transaStatus')}">
              <el-radio disabled :label="1">{{$t('customer.collect.complete')}}</el-radio>
              <el-radio disabled :label="2">{{$t('customer.collect.noComplete')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
            <!--<el-radio-group v-model="basicData.customerSource" style="width: 600px;" disabled>-->
              <!--&lt;!&ndash;<el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{item.label}}</el-radio>&ndash;&gt;-->
                                <!--<el-radio label="1">自助开发</el-radio>-->
                                <!--<el-radio label="2">询盘</el-radio>-->
                                <!--<el-radio label="3">展会</el-radio>-->
            <!--</el-radio-group>-->
            <el-radio-group v-model="basicData.customerSource" style="width: 600px;" :class="{'has-change': bankChange('customerSource')}">
              <el-radio v-for="(item, index) in customerSourceList" :label="item.id" disabled :key="index">{{language === 'zh' ? item.label : item.enLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList">
            <el-checkbox-group v-model="basicData.ownFieldList" style="width: 600px;" disabled :class="{'has-change': bankChange('ownField')}">
              <el-checkbox v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
            <el-tooltip :content="basicData1.reservedField1 + ' ->> '+ basicData.reservedField1" placement="top" effect="light" :disabled="!bankChange('reservedField1')">
              <el-input v-model="basicData.reservedField1" readonly :class="{'has-change': bankChange('reservedField1')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
            <el-tooltip :content="basicData1.reservedField2 + ' ->> '+ basicData.reservedField2" placement="top" effect="light" :disabled="!bankChange('reservedField2')">
              <el-input v-model="basicData.reservedField2" readonly :class="{'has-change': bankChange('reservedField2')}" style="width: 230px"/>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
            <el-input v-model="basicData.reservedField3" readonly :class="{'has-change': bankChange('reservedField3')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
            <el-input v-model="basicData.reservedField4" readonly :class="{'has-change': bankChange('reservedField4')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
            <el-input v-model="basicData.reservedField5" readonly :class="{'has-change': bankChange('reservedField5')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
            <el-input v-model="basicData.reservedField6" readonly :class="{'has-change': bankChange('reservedField6')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
            <el-input v-model="basicData.reservedField7" readonly :class="{'has-change': bankChange('reservedField7')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
            <el-input v-model="basicData.reservedField8" readonly :class="{'has-change': bankChange('reservedField8')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
            <el-input v-model="basicData.reservedField9" readonly :class="{'has-change': bankChange('reservedField9')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
            <el-input v-model="basicData.reservedField10" readonly :class="{'has-change': bankChange('reservedField10')}" style="width: 230px"/>
          </el-form-item>

          <el-form-item :label="$t('supplier.manage.supplierType')" prop="supplierType">
            <el-tooltip :content="basicData1.supplierType + '->>'+ basicData1.supplierType" placement="top" effect="light" :disabled="!bankChange('supplierType')">
              <el-select v-model="basicData.supplierType" :class="{'has-change': bankChange('supplierType')}" style="width: 230px">
                <el-option v-for="(item, index) in supplierTypeList" disabled :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-form-item :label="$t('system.role.status')" prop="customerStatus">
            <el-select v-model="basicData.supplierStatus" :class="{'has-change': bankChange('customerStatus')}" style="width: 230px">
              <el-option disabled :label="$t('system.role.active')" :value="1"></el-option>
              <el-option disabled :label="$t('system.role.inactive')" :value="0"></el-option>
            </el-select>
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

          <!--<el-table-column align="center" label="开户银行" prop="bankName" show-overflow-tooltip>-->
          <!--</el-table-column>-->

          <!--<el-table-column align="center" label="开户行地址" prop="bankAddress" show-overflow-tooltip>-->
          <!--</el-table-column>-->

          <!--<el-table-column align="center" label="预留电话" prop="reservedPhone" show-overflow-tooltip>-->
          <!--</el-table-column>-->

          <!--<el-table-column align="center" label="账户币种" prop="accountCurrency" show-overflow-tooltip >-->
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
      <!--付款条件-->
      <el-tab-pane :label="$t('customer.customerList.generalOrder')" name="3">
        <el-form :model="spt" :label-width="isZh?'140px': '200px'" inline label-position="right" size="small">
          <el-form-item :label="$t('customer.customerList.defaultBase')" prop="paymentType">
            <el-radio-group v-model="spt.paymentType" disabled style="width: 400px" :class="{'has-change': paymentChange('paymentType')}">
              <el-radio :label="1">{{isZh ? '离岸价': 'FOB'}}</el-radio>
              <el-radio :label="2">{{isZh ? '到岸价': 'CIF'}}</el-radio>
              <el-radio :label="3">{{isZh ? '出厂价': 'EXW'}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.customerList.defaultPort')" prop="deliveryPort">
            <el-tooltip :content="spt1.deliveryPort + '->>'+ spt.deliveryPort" placement="top" effect="light" :disabled="!paymentChange('deliveryPort')">
              <el-input v-model="spt.deliveryPort" readonly :class="{'has-change': paymentChange('deliveryPort')}" style="width: 400px"/>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('system.business.priceGradient')" prop="gradientBId">
            <el-select v-model="spt.gradientBId" style="width: 400px" :class="{'has-change': paymentChange('gradientBId')}">
              <el-option v-for="(item, index) in gradientList" disabled :label="isZh?item.label:item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.customerList.defaultMethod')" prop="shipmentType">
            <!--<el-checkbox-group v-model="spt.shipmentTypeArr" disabled>-->
              <!--<el-checkbox v-for="(item,index) in transportList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <el-select v-model="spt.shipmentType" style="width: 500px" :class="{'has-change': paymentChange('shipmentType')}">
              <el-option v-for="(item,index) in transportList" disabled :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.customerList.defaultTool')" prop="paymentMethod">
            <el-select v-model="spt.paymentMethod" :class="{'has-change': paymentChange('paymentMethod')}" style="width: 400px">
              <el-option v-for="(item,index) in paymentList" disabled :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
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
            align="center"
            width="50">
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.name')" show-overflow-tooltip >
            <template slot-scope="scope">
              <a href="javascript:void (0)">{{scope.row.contactName}}</a>
            </template>
          </el-table-column>

          <el-table-column :label="$t('customer.customerList.contactNo')" prop="contactPhone" show-overflow-tooltip/>

          <el-table-column :label="$t('customer.customerList.accountNo')" prop="emailAddress" show-overflow-tooltip/>

          <el-table-column :label="$t('customer.customerList.designation')" prop="supplierJob" show-overflow-tooltip/>
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

          <el-table-column :label="$t('customer.customerList.serviceStaff')" prop="serviceName" show-overflow-tooltip/>

          <el-table-column :label="$t('customer.customerList.designation')" prop="csJob" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.csJob | jobFmt(jobList, isZh)}}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" size="small" @click="show=false">{{$t('common.buttonText.close')}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils/index'
import { supplierHistoryDetail } from '@/api/supplier';
import { selectCountryListApi } from '@/api/system'
export default {
  data() {
    return {
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
      newBankList: [],
      newCooperList: [],
      newContactList: [],
      newServiceList: [],
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
    gradientList: {
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
    this.getCountryList()
  },
  methods: {
    // 查询获取国家
    getCountryList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || []
      })
    },
    getDetail() {
      supplierHistoryDetail({ modifyNo: this.id }).then(res => {
        this.changeActiveName = res.data.supplierModifyRecord.modifyModuleType;
        this.newData = res.data.newSupplierModifyRecordVo;
        this.oldData = res.data.oldSupplierModifyRecordVo;

        this.basicData = this.newData.supplierInfoVo;
        this.sbalist = this.newData.supplierBankAccountList || [];
        this.scplist = this.newData.supplierCooperPactList || [];
        this.sclist = this.newData.supplierContactList || [];
        this.spt = this.newData.supplierPaymentTerms || {};
        this.controlTowerList = this.spt ? (this.spt.sopnList || []) : [];
        this.sslist = this.newData.supplierServingVoList || [];
        this.basicData.sortName = this.basicData.supplierSortBId.split(',');
        if (this.basicData.ownField) {
          this.basicData.ownFieldList = this.basicData.ownField.split(',');
        } else {
          this.basicData.ownFieldList = []
        }

        this.basicData1 = this.oldData.supplierInfoVo;
        this.sbalist1 = this.oldData.supplierBankAccountList || [];
        this.scplist1 = this.oldData.supplierCooperPactList || [];
        this.sclist1 = this.oldData.supplierContactList || [];
        this.spt1 = this.oldData.supplierPaymentTerms || {};
        this.controlTowerList1 = this.spt1 ? (this.spt1.sopnList || []) : [];
        this.sslist1 = this.oldData.supplierServingVoList || [];

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
      color: #DD4A68;
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
