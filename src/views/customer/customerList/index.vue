<template>
  <div class="app-container customer-container">
    <div class="search-box">
      <el-form :label-width="isZh ? '70px' : '115px'" inline size="small">
        <div>
          <el-form-item :label="$t('customer.record.client')">
            <el-input v-model.trim="postData.companyName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.category')">
            <el-cascader
              placeholder=""
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'sortName', children: 'children'}"
              filterable
              clearable
              change-on-select
              @change="getParentId1"
            ></el-cascader>
          </el-form-item>
          <el-form-item :label="$t('customer.record.level')" >
            <el-select v-model="postData.memberBId" clearable style="width: 200px" placeholder="">
              <el-option v-for="(item, index) in gradeList" :label="language === 'zh' ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('customer.record.clientCode')">
            <el-input v-model.trim="postData.customerCode" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.country')" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable placeholder="" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.record.contactNo')">
            <el-input v-model.trim="postData.mobilePhone" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.customerStatus" clearable style="width: 150px">
              <el-option v-for="(item, index) in areaList2" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item :label="$t('customer.record.contactNo')">-->
            <!--<el-input v-model.trim="postData.mobilePhone" clearable style="width: 200px" />-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteCustomer()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportExcel">{{$t('system.role.export')}}</el-button>
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
        width="55">
      </el-table-column>

      <el-table-column :label="$t('customer.record.client')" prop="companyName" show-overflow-tooltip/>

      <el-table-column :label="$t('customer.record.clientCode')" prop="customerCode" show-overflow-tooltip/>

      <!--<el-table-column label="客户公司" prop="companyName" show-overflow-tooltip/>-->

      <el-table-column :label="$t('customer.record.country')" :prop="language === 'zh' ? 'cnCountryName' : 'enCountryName'" show-overflow-tooltip/>

      <el-table-column :label="$t('customer.record.contactNo')" prop="mobilePhone" show-overflow-tooltip />

      <!--<el-table-column label="分类" prop="sortName" show-overflow-tooltip />-->

      <el-table-column :label="$t('customer.record.level')" prop="gradeName" show-overflow-tooltip />

      <el-table-column align="center" width="100px" :label="$t('system.role.modifier')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="140px" :label="$t('system.userManage.editTime')" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="customerStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.customerStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.customerStatus === 1 ? $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('system.role.operation')" width="275" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openHistory(scope.row)">{{$t('customer.customerList.hist')}}</el-button>
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row.bid)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button
            :type="scope.row.customerStatus === 1 ? 'info' : 'danger'"
            size="mini"
            @click="changeMethod(scope.row)"
          >{{scope.row.customerStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" :title="$t('customer.customerList.clientDetail')" width="1000px" center @closed="clearDialog">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
          <el-form ref="customerData" :model="customerData" :label-width="isZh?'135px': '140px'" inline label-position="left" size="small">
            <!--<el-form-item :label="$t('customer.collect.companyName')" prop="customerCode" >-->
              <!--<el-input v-model="customerData.customerCode" readonly placeholder="客户编码" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="客户名称" prop="customerName">-->
              <!--<el-input v-model="customerData.customerName" readonly placeholder="客户名称" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.collect.companyName')" prop="companyName">
              <el-input v-model="customerData.companyName" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.companyAbbr')" prop="shortName">
              <el-input v-model="customerData.shortName" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.record.clientCode')" prop="customerCode" >
              <el-input v-model="customerData.customerCode" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.record.country')" prop="countryCode" >
              <el-select
                v-model="customerData.countryCode"
                disabled
                filterable
                remote
                :remote-method="getCountryList"
                :loading="loading1"
                class="form-dialog-width"
                style="width: 620px"
              >
                <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
              <el-input v-model="customerData.registerAddress" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
              <el-input v-model="customerData.officeAddress" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <!--<el-form-item label="其他地址" prop="otherAddress">-->
              <!--<el-input v-model="customerData.otherAddress" readonly placeholder="其他地址" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
              <el-input v-model="customerData.postalCode" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
              <el-input v-model="customerData.provinceCode" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
              <el-input v-model.number="customerData.officePhone" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
              <el-input v-model="customerData.officePhone2" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
              <el-input v-model="customerData.mobilePhone" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
              <el-input v-model="customerData.mobilePhone2" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo">
              <el-input v-model="customerData.facsimileNo" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
              <el-input v-model="customerData.facsimileNo2" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
              <el-input v-model="customerData.emailAddress" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
              <el-input v-model="customerData.taxNo" readonly class="form-dialog-width" style="width: 620px"/>
            </el-form-item>

<!--            <el-form-item label="首选语言" prop="preferredLanguage">-->
<!--              <el-select v-model="customerData.preferredLanguage" readonly placeholder="请选择语言" class="form-dialog-width" style="width: 230px">-->
<!--                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.label" :key="index"></el-option>-->
<!--              </el-select>-->
<!--              &lt;!&ndash;                  <el-input v-model="customerData.preferredLanguage" clearable placeholder="首选语言" class="form-dialog-width" style="width: 230px"/>&ndash;&gt;-->
<!--            </el-form-item>-->
<!--            <el-form-item label="常用语言" prop="commLanguageList">-->
<!--              &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--              <el-select v-model="customerData.commLanguageList" readonly multiple placeholder="请选择语言,多选." class="form-dialog-width" @change="getcommLanguage" style="width: 237px">-->
<!--                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="收货港口" prop="deliveryPortArr">-->
<!--              &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--              <el-select v-model="customerData.deliveryPortArr" readonly multiple placeholder="请选择港口,多选" class="form-dialog-width" @change="getdeliveryPort" style="width: 600px;">-->
<!--                &lt;!&ndash;<el-option v-for="(item, index) in portList" :label="item.gradeName" :value="item.bid" :key="index"></el-option>&ndash;&gt;-->
<!--                <el-option value="1" label="港口1"></el-option>-->
<!--                <el-option value="2" label="港口2"></el-option>-->
<!--                <el-option value="3" label="港口3"></el-option>-->
<!--                <el-option value="4" label="港口4"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->

            <!--              <el-form-item label="主要负责人" prop="chargeBy">-->
            <!--                <el-input v-model="customerData.chargeBy" clearable placeholder="联系电话" class="form-dialog-width" />-->
            <!--              </el-form-item>-->

            <el-form-item :label="$t('customer.collect.clientCategory')" prop="sortName">
              <el-cascader
                class="form-dialog-width"
                v-model="customerData.sortName"
                :options="sortList"
                :props="{value: 'bid', label: 'sortName', children: 'children'}"
                filterable
                disabled
                change-on-select
                @change="getParentId"
                style="width: 240px"
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('customer.record.level')" prop="memberBId">
              <el-select v-model="customerData.memberBId" disabled class="form-dialog-width" style="width: 240px">
                <el-option v-for="(item, index) in gradeList" :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.clientStatus')" prop="transaStatus">
              <el-radio-group v-model="customerData.transaStatus" style="width: 600px;" disabled>
                <el-radio :label="1">{{$t('customer.collect.complete')}}</el-radio>
                <el-radio :label="0">{{$t('customer.collect.noComplete')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
              <el-radio-group v-model="customerData.customerSource" style="width: 620px;" disabled>
                <el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{language === 'zh' ? item.label : item.enLabel}}</el-radio>
                <!--                  <el-radio :label="1">自助开发</el-radio>-->
                <!--                  <el-radio :label="2">询盘</el-radio>-->
                <!--                  <el-radio :label="3">展会</el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList">
              <el-checkbox-group v-model="customerData.ownFieldList" style="width: 620px;" disabled @change="getownField">
                <el-checkbox v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{language === 'zh' ? item.label : item.labelEn}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
              <el-input v-model="customerData.reservedField1" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
              <el-input v-model="customerData.reservedField2" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
              <el-input v-model="customerData.reservedField3" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
              <el-input v-model="customerData.reservedField4" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
              <el-input v-model="customerData.reservedField5" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
              <el-input v-model="customerData.reservedField6" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
              <el-input v-model="customerData.reservedField7" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
              <el-input v-model="customerData.reservedField8" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
              <el-input v-model="customerData.reservedField9" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
              <el-input v-model="customerData.reservedField10" readonly class="form-dialog-width" style="width: 240px"/>
            </el-form-item>

            <el-form-item :label="$t('system.role.status')" prop="customerStatus" style="width: 240px">
              {{ customerData.customerStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
              <!--<el-select v-model="customerData.customerStatus" disabled class="form-dialog-width" style="width: 240px">-->
                <!--&lt;!&ndash;<el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>&ndash;&gt;-->
                <!--<el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>-->
              <!--</el-select>-->
            </el-form-item>
            <!--<el-form-item label="备注" prop="remarks">-->
              <!--<el-input v-model="customerData.remarks" type="textarea" :rows="5" readonly placeholder="税号" class="form-dialog-width" style="width: 600px"/>-->
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
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column :label="$t('customer.customerList.accountNo')" prop="bankAccount" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.bankName')" prop="bankName" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.branchName')" prop="branchName" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.address')" prop="bankAddress" show-overflow-tooltip>
            </el-table-column>

            <!--<el-table-column :label="$t('customer.customerList.accountNo')" prop="reservedPhone" show-overflow-tooltip>-->
            <!--</el-table-column>-->

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
              <el-radio-group v-model="spt.paymentType" disabled>
                <el-radio :label="1">{{isZh ? '离岸价': 'FOB'}}</el-radio>
                <el-radio :label="2">{{isZh ? '到岸价': 'CIF'}}</el-radio>
                <el-radio :label="3">{{isZh? '出厂价':'EXW'}}</el-radio>
                <!--                <el-radio :label="3">EXW</el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultPort')" prop="deliveryPort">
              <el-input v-model="spt.deliveryPort" readonly class="form-dialog-width" style="width: 500px"/>
<!--              <el-select v-model="spt.sendPortBId" disabled placeholder="送货港口">-->
<!--                <el-option v-for="(item, index) in portList" :label="item.label" :value="item.bid" :key="index"></el-option>-->
<!--              </el-select>-->
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultMethod')" prop="shipmentType">
              <!--<el-checkbox-group v-model="spt.shipmentTypeArr" disabled>-->
                <!--<el-checkbox v-for="(item,index) in transportList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>-->
              <!--</el-checkbox-group>-->
              <el-select v-model="spt.shipmentType" disabled >
                <el-option v-for="(item,index) in transportList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultTool')" prop="paymentMethod">
              <el-select v-model="spt.paymentMethod" disabled >
                <el-option v-for="(item,index) in paymentList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.customerList.defaultTerms')">
              <table border="0" cellspacing="0" cellpadding="0" class="form-table" style="width: 700px">
                <thead>
                <tr style="background-color: #a7bfee;">
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
                  <!--<td>-->
                    <!--<el-input v-model.number="item.paymentRatio" type="number" clearable style="width: 200px" >-->
                      <!--<template slot="append">%</template>-->
                    <!--</el-input>-->
                  <!--</td>-->
                  <!--<td>-->
                    <!--<el-input v-model.number="item.dayNum" type="number" :min="0" :precision="0" clearable style="width: 200px" >-->
                      <!--<template slot="append">{{isZh ? '天': 'Day'}}</template>-->
                    <!--</el-input>-->
                  <!--</td>-->
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
            size="small"
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
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              type="index"
              :label="$t('system.business.index')"
              align="center"
              width="50">
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.name')" show-overflow-tooltip >
              <template slot-scope="scope">
                <!--<a href="javascript:void (0)">{{scope.row.contactName}}</a>-->
                <a style="text-decoration:underline" @click="addLinkModal('detail', scope.row)">{{scope.row.contactName}}</a>
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.customerList.contactNo')" prop="contactPhone" show-overflow-tooltip />

            <el-table-column :label="$t('customer.customerList.accountNo')" prop="emailAddress" show-overflow-tooltip />

            <el-table-column :label="isZh?'职位':'Designation'" prop="customerJob" show-overflow-tooltip />

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

            <el-table-column :label="$t('customer.customerList.serviceStaff')" prop="servingName" show-overflow-tooltip />

            <el-table-column :label="$t('customer.customerList.designation')" prop="csJob" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{row.csJob | designation(designationList, language)}}
              </template>
            </el-table-column>

            <!--<el-table-column :label="isZh?'账号':'UserAccpunt'" show-overflow-tooltip>-->
              <!--<template slot-scope="{row}">-->
                <!--{{row | AUserAccount}}-->
              <!--</template>-->
            <!--</el-table-column>-->

            <!--<el-table-column :label="isZh?'电话':'MobilePhone'" show-overflow-tooltip>-->
              <!--<template slot-scope="{row}">-->
                <!--{{row | AMobilePhone}}-->
              <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </el-tab-pane>
        <!--客户商品类目-->
        <!--<el-tab-pane :label="$t('customer.customerList.productCategory')" name="7">-->
          <!--<div class="category-form">-->
            <!--<div>-->
              <!--{{$t('customer.customerList.tiers')}}&nbsp;&nbsp;-->
              <!--<el-select v-model="categoryForm.gradientBId" disabled placeholder="select" style="width: 200px">-->
                <!--<el-option v-for="(item, index) in gradientList" :label="isZh ? item.name : item.labelEn" :value="item.id" :key="index"></el-option>-->
              <!--</el-select>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="category-form">-->
            <!--{{$t('customer.customerList.select')}}-->
          <!--</div>-->
          <!--<el-table-->
            <!--style="width:90%;margin: 10px auto"-->
            <!--:data="categoryList"-->
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

            <!--<el-table-column align="center" :label="$t('customer.customerList.productItems')" prop="productNumber" />-->

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
        <el-button type="danger" size="small" @click="detailVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" :close-on-click-modal="false"
               :title="dialogType==='add'?$t('customer.customerList.addClientInformation'):$t('customer.customerList.editClientInformation')" center
               width="1000px" @closed="clearDialog" >
        <el-tabs v-model="activeName" :before-leave="changeTabs">
          <!--基础信息-->
          <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
                <el-form ref="customerData" :model="customerData" v-if="editVisible" :label-width="isZh?'135px': '140px'" inline label-position="left" :rules="gradeDataRules" size="small">
                  <!--<el-form-item :label="$t('customer.collect.companyName')" prop="customerCode" >-->
                  <!--<el-input v-model="customerData.customerCode" readonly placeholder="客户编码" class="form-dialog-width" style="width: 600px"/>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item label="客户名称" prop="customerName">-->
                  <!--<el-input v-model="customerData.customerName" readonly placeholder="客户名称" class="form-dialog-width" style="width: 600px"/>-->
                  <!--</el-form-item>-->
                  <el-form-item :label="$t('customer.collect.companyName')" prop="companyName">
                    <el-input v-model="customerData.companyName" class="form-dialog-width" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\.]/g,'')" :maxlength="character20" style="width: 620px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.companyAbbr')" prop="shortName">
                    <el-input v-model="customerData.shortName" class="form-dialog-width" :maxlength="character16" style="width: 620px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.record.clientCode')" prop="customerCode" >
                    <el-input v-model="customerData.customerCode" class="form-dialog-width" onkeyup="value=value.replace(/[\W]/g,'')" :maxlength="character30" style="width: 620px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.record.country')" prop="countryCode" >
                    <el-select
                      placeholder=""
                      v-model="customerData.countryCode"
                      filterable
                      remote
                      :remote-method="getCountryList"
                      :loading="loading1"
                      class="form-dialog-width"
                      style="width: 620px"
                    >
                      <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
                    <el-input v-model="customerData.registerAddress" :maxlength="200" class="form-dialog-width" style="width: 620px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
                    <el-input v-model="customerData.officeAddress" class="form-dialog-width" :maxlength="200" style="width: 620px"/>
                  </el-form-item>
                  <!--<el-form-item label="其他地址" prop="otherAddress">-->
                  <!--<el-input v-model="customerData.otherAddress" class="form-dialog-width" style="width: 600px"/>-->
                  <!--</el-form-item>-->
                  <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
                    <el-input v-model="customerData.postalCode" class="form-dialog-width" :maxlength="14" style="width: 240px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
                    <el-input v-model="customerData.provinceCode" class="form-dialog-width" :maxlength="50" style="width: 240px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
                    <el-input v-model="customerData.officePhone" class="form-dialog-width" onkeyup="value=value.replace(/[^\d\-]/g,'')" :maxlength="character16" style="width: 240px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
                    <el-input v-model="customerData.officePhone2" class="form-dialog-width" onkeyup="value=value.replace(/[^\d\-]/g,'')" :maxlength="character16" style="width: 240px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
                    <el-input v-model="customerData.mobilePhone" class="form-dialog-width" onkeyup="value=value.replace(/[^\d\-]/g,'')" :maxlength="character16" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
                    <el-input v-model="customerData.mobilePhone2" class="form-dialog-width" onkeyup="value=value.replace(/[^\d\-]/g,'')" :maxlength="character16" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo">
                    <el-input v-model="customerData.facsimileNo" class="form-dialog-width" onkeyup="value=value.replace(/[^\d\-]/g,'')" :maxlength="character16" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
                    <el-input v-model="customerData.facsimileNo2" class="form-dialog-width" onkeyup="value=value.replace(/[^\d\-]/g,'')" :maxlength="character16" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
                    <el-input v-model="customerData.emailAddress" class="form-dialog-width" :maxlength="50" style="width: 620px"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
                    <el-input v-model="customerData.taxNo" class="form-dialog-width" :maxlength="50" style="width: 620px"/>
                  </el-form-item>

<!--              <el-form-item label="首选语言" prop="preferredLanguage">-->
<!--                <el-select v-model="customerData.preferredLanguage" clearable placeholder="请选择语言" class="form-dialog-width" style="width: 230px">-->
<!--                    <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.label" :key="index"></el-option>-->
<!--                  </el-select>-->
<!--&lt;!&ndash;                  <el-input v-model="customerData.preferredLanguage" clearable placeholder="首选语言" class="form-dialog-width" style="width: 230px"/>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--              <el-form-item label="常用语言" prop="commLanguageList">-->
<!--                &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--                <el-select v-model="customerData.commLanguageList" multiple placeholder="请选择语言,多选." class="form-dialog-width" @change="getcommLanguage" style="width: 237px">-->
<!--                  <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="收货港口" prop="deliveryPortArr">-->
<!--                &lt;!&ndash;<el-input v-model="customerData.deliveryPort" clearable placeholder="收货港口" class="form-dialog-width" />&ndash;&gt;-->
<!--                <el-select v-model="customerData.deliveryPortArr" multiple placeholder="请选择港口,多选" class="form-dialog-width" @change="getdeliveryPort" style="width: 600px;">-->
<!--                  &lt;!&ndash;<el-option v-for="(item, index) in portList" :label="item.gradeName" :value="item.bid" :key="index"></el-option>&ndash;&gt;-->
<!--                  <el-option value="1" label="港口1"></el-option>-->
<!--                  <el-option value="2" label="港口2"></el-option>-->
<!--                  <el-option value="3" label="港口3"></el-option>-->
<!--                  <el-option value="4" label="港口4"></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->

<!--              <el-form-item label="主要负责人" prop="chargeBy">-->
<!--                <el-input v-model="customerData.chargeBy" clearable placeholder="联系电话" class="form-dialog-width" />-->
<!--              </el-form-item>-->

                  <el-form-item :label="$t('customer.collect.clientCategory')" prop="sortName">
                    <el-cascader
                      placeholder=""
                      class="form-dialog-width"
                      v-model="customerData.sortName"
                      :options="sortList"
                      :props="{value: 'bid', label: 'sortName', children: 'children'}"
                      filterable
                      change-on-select
                      @change="getParentId"
                      style="width: 240px"
                    ></el-cascader>
                  </el-form-item>
                  <el-form-item :label="$t('customer.record.level')" prop="memberBId">
                    <el-select v-model="customerData.memberBId" class="form-dialog-width" placeholder="" style="width: 240px">
                      <el-option v-for="(item, index) in gradeList" :disabled="item.levelStatus === 0" :label="isZh ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.clientStatus')" prop="transaStatus">
                    <el-radio-group v-model="customerData.transaStatus" style="width: 620px;">
                      <el-radio :label="1">{{$t('customer.collect.complete')}}</el-radio>
                      <el-radio :label="0">{{$t('customer.collect.noComplete')}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
                    <el-radio-group v-model="customerData.customerSource" style="width: 620px;">
                      <el-radio v-for="(item, index) in customerSourceList" :label="item.id" :key="index">{{language === 'zh' ? item.label : item.enLabel}}</el-radio>
                      <!--                  <el-radio :label="1">自助开发</el-radio>-->
                      <!--                  <el-radio :label="2">询盘</el-radio>-->
                      <!--                  <el-radio :label="3">展会</el-radio>-->
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList" >
                    <el-checkbox-group v-model="customerData.ownFieldList" style="width: 620px;" @change="getownField">
                      <el-checkbox v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{language === 'zh' ? item.label : item.labelEn}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
                    <el-input v-model="customerData.reservedField1" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
                    <el-input v-model="customerData.reservedField2" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
                    <el-input v-model="customerData.reservedField3" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
                    <el-input v-model="customerData.reservedField4" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
                    <el-input v-model="customerData.reservedField5" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
                    <el-input v-model="customerData.reservedField6" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
                    <el-input v-model="customerData.reservedField7" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
                    <el-input v-model="customerData.reservedField8" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
                    <el-input v-model="customerData.reservedField9" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
                    <el-input v-model="customerData.reservedField10" class="form-dialog-width" style="width: 240px"/>
                  </el-form-item>

                  <el-form-item :label="$t('system.role.status')" prop="customerStatus" style="width: 240px">
                    {{ customerData.customerStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
                    <!--<el-select v-model="customerData.customerStatus" class="form-dialog-width" style="width: 240px">-->
                      <!--&lt;!&ndash;<el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>&ndash;&gt;-->
                      <!--<el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>-->
                    <!--</el-select>-->
                  </el-form-item>
              <div style="text-align: center">
                <el-form-item>
                  <el-button type="primary" size="small" :loading="confirmLoading" @click="saveBasicMsg('customerData')">{{$t('system.role.seave')}}</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          <!--银行账户信息-->
          <el-tab-pane :label="$t('customer.customerList.bankList')" name="2">
            <div class="divleft">
              <el-button type="primary" size="mini" @click="openBankDialog('add')">{{$t('system.role.add')}}</el-button>
              <el-button type="primary" size="mini" @click="removeBankAccount">{{$t('system.role.delete')}}</el-button>
            </div>
            <el-table
              style="margin: 10px 0"
              :data="sbalist"
              border
              fit
              size="small"
              :header-cell-style="{background: '#a7bfee'}"
              @selection-change="getBankSelect">

              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>

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

              <el-table-column align="center" :label="$t('system.role.operation')" width="80" class-name="small-padding fixed-width">
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
              <el-form ref="bankForm" :model="bankForm" v-if="addBankVisible" label-width="135px" label-position="left" size="mini" :rules="bankFormRules">
                <!--<el-form-item label="银行账号" prop="bankAccount">-->
                  <!--<el-input v-model="bankForm.bankAccount" clearable placeholder="银行账号" class="form-dialog-width" />-->
                <!--</el-form-item>-->
                <el-form-item :label="$t('customer.customerList.bankName')" prop="bankName">
                  <el-input type="tel" v-model.number="bankForm.bankName" :maxlength="30" clearable class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.branchName')" prop="branchName">
                  <el-input v-model="bankForm.branchName" clearable :maxlength="50" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.address')" prop="bankAddress">
                  <el-input v-model="bankForm.bankAddress" clearable :maxlength="200" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.accountNo')" prop="bankAccount">
                  <el-input v-model="bankForm.bankAccount" clearable :maxlength="30" class="form-dialog-width" />
                </el-form-item>
<!--                <el-form-item label="账户类型" prop="accountType">-->
<!--                  <el-radio-group v-model="bankForm.accountType">-->
<!--                    <el-radio :label="1">企业</el-radio>-->
<!--                    <el-radio :label="2">个人</el-radio>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
                <el-form-item :label="$t('customer.customerList.accountCurrency')" prop="accountCurrency">
                  <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="bankForm.accountCurrency" clearable class="form-dialog-width">
                    <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.swiftCode')" prop="swiftCode">
                  <el-input v-model="bankForm.swiftCode" clearable :maxlength="30" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('customer.customerList.isDefault')" prop="defaultValue">
                  <el-radio-group v-model="bankForm.defaultValue" clearable style="width: 600px;">
                    <el-radio :label="1">{{isZh ? '是' : 'Yes'}}</el-radio>
                    <el-radio :label="0">{{isZh ? '否' : 'No'}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="addBankAccount('bankForm')">{{$t('system.role.seave')}}</el-button>
                <el-button type="danger" size="small" @click="addBankVisible=false">{{$t('common.buttonText.cancel')}}</el-button>

              </div>
            </el-dialog>
          </el-tab-pane>
          <!--付款条件-->
          <el-tab-pane :label="$t('customer.customerList.generalOrder')" name="3">
            <el-form ref="spt" :model="spt" :label-width="isZh ? '150px': '210px'" label-position="left" size="small" :rules="sptRules">
              <el-form-item :label="$t('customer.customerList.defaultBase')" prop="paymentType">
                <el-radio-group v-model="spt.paymentType">
                  <el-radio :label="1">{{isZh ? '离岸价': 'FOB'}}</el-radio>
                  <el-radio :label="2">{{isZh ? '到岸价': 'CIF'}}</el-radio>
                  <el-radio :label="3">{{isZh ? '出厂价':'EXW'}}</el-radio>
                  <!--                  <el-radio :label="3">EXW</el-radio>-->
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.defaultPort')" prop="deliveryPort">
                <el-input v-model="spt.deliveryPort" class="form-dialog-width" :maxlength="character300" style="width: 500px"/>
                <!--              <el-select v-model="spt.sendPortBId" disabled placeholder="送货港口">-->
                <!--                <el-option v-for="(item, index) in portList" :label="item.label" :value="item.bid" :key="index"></el-option>-->
                <!--              </el-select>-->
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.defaultMethod')" prop="shipmentType">
                <!--<el-checkbox-group v-model="spt.shipmentTypeArr" @change="getCheckBoxVal">-->
                  <!--<el-checkbox v-for="(item,index) in transportList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <el-select v-model="spt.shipmentType" style="width: 500px">
                  <el-option v-for="(item,index) in transportList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.defaultTool')" prop="paymentMethod">
                <el-select v-model="spt.paymentMethod" clearable style="width: 500px">
                  <el-option v-for="(item,index) in paymentList" :label="isZh ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
<!--              <el-form-item label="币种" prop="accountCurrency">-->
<!--                <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="bankForm.currencyCode" clearable placeholder="币种中文名或者币种编码" class="form-dialog-width">-->
<!--                  <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.currencyCode" :key="index">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
              <el-form-item :label="$t('customer.customerList.defaultTerms')">
                <table border="0" cellspacing="0" cellpadding="0" class="form-table" style="width: 700px">
                  <thead>
                  <tr style="background-color: #a7bfee;">
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
                  <el-button type="primary" size="small" :loading="confirmLoading" @click="savePayment('spt')">{{$t('system.role.seave')}}</el-button>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          <!--合作详情-->
          <el-tab-pane :label="$t('customer.customerList.partenership2')" name="4">
            <el-form ref="cooperObj" :model="cooperObj" label-width="150px" label-position="left" size="small">
              <el-form-item :label="$t('customer.customerList.schema')">
                <el-select v-model="cooperObj.cooperMode" clearable placeholder="">
                  <el-option v-for="(item, index) in cooperTypeList" :label="language === 'zh' ? item.label : item.enLabel" :value="item.label" :key="index"></el-option>
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
            <!--<div class="divleft">-->
              <!--<el-button type="primary" size="mini" @click="addPactFileList">添加</el-button>-->
              <!--&lt;!&ndash;<el-button type="primary" size="mini" class="export">查看协议</el-button>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-button type="primary" size="mini">上传协议</el-button>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-button type="primary" size="mini">下载协议</el-button>&ndash;&gt;-->
            <!--</div>-->
            <el-table
              :data="scplist"
              border
              fit
              style="margin: 10px 0"
              size="small"
              :header-cell-style="{background: '#a7bfee'}">

              <el-table-column :label="$t('customer.customerList.schema')" prop="cooperMode" show-overflow-tooltip />

              <el-table-column :label="$t('customer.customerList.commencementDate')" prop="beginTime" show-overflow-tooltip >
                <template slot-scope="scope">
                  {{scope.row.beginTime | timeFmt}}~{{scope.row.endTime | timeFmt}}
                </template>
              </el-table-column>

              <el-table-column :label="$t('customer.customerList.agreementName')" prop="pactFile" show-overflow-tooltip />
              <el-table-column align="center" :label="$t('system.role.operation')" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('customer.customerList.download')}}</el-button>
                  <el-button type="primary" size="mini" @click="removeFile(scope)">{{$t('system.role.delete')}}</el-button>
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

              <el-table-column :label="$t('customer.customerList.name')" show-overflow-tooltip >
                <template slot-scope="scope">
                  <a style="text-decoration:underline" @click="addLinkModal('detail', scope.row)">{{scope.row.contactName}}</a>
                </template>
              </el-table-column>

              <el-table-column :label="$t('customer.customerList.contactNo')" prop="contactPhone" show-overflow-tooltip />

              <el-table-column :label="$t('customer.customerList.accountNo')" prop="emailAddress" show-overflow-tooltip />

              <el-table-column :label="isZh?'职位':'Designation'" prop="customerJob" show-overflow-tooltip />

              <el-table-column align="center" :label="$t('customer.customerList.default')" prop="defaultStatus">
                <template slot-scope="scope">
                  <el-radio v-model="scope.row.defaultStatus" :label="1" @change="radioButton(scope.row.id)">{{null}}</el-radio>
                </template>
                </el-table-column>

              <el-table-column align="center" :label="$t('system.role.operation')" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" v-if="!scope.row.accountBId" @click="addLinkModal('add', scope.row)">{{isZh?'创建账户':'Create Account'}}</el-button>
                  <el-button type="warning" size="mini" @click="editDetail(scope.row)">{{$t('system.userManage.editUser')}}</el-button>
                  <el-button type="primary" size="mini" @click="deleteLinkPeople(scope.row)">{{$t('system.role.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-dialog
            width="800px"
            center
            :title="$t('customer.customerList.userAdd')"
            :close-on-click-modal="false"
            :visible.sync="selectLinkVisible"
            append-to-body>
            <div class="search-box" style="padding-bottom: 10px">
              {{$t('customer.customerList.userInformation')}}
              <el-input v-model="userListPrams.searchKey" clearable size="mini" class="form-dialog-width" />
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
                width="50">
              </el-table-column>

              <el-table-column
                :label="$t('customer.customerList.no')"
                align="center"
                type="index"
                width="50">
              </el-table-column>

              <el-table-column align="center" :label="$t('customer.customerList.name')" prop="linkName" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.lastName}}{{scope.row.firstName}}
                </template>
              </el-table-column>

              <!--<el-table-column align="center" :label="$t('customer.customerList.contactNo')" prop="officePhone" show-overflow-tooltip />-->

              <!--<el-table-column align="center" :label="$t('customer.customerList.accountNo')" prop="userAccount" show-overflow-tooltip />-->

              <el-table-column align="center" :label="isZh?'邮箱':'Email'" prop="emailAddress" show-overflow-tooltip />

            </el-table>

            <Pagination :total="userListPrams.total" :page.sync="userListPrams.pageIndex" :limit.sync="userListPrams.pageSize" @pagination="getSelectUserList" />

            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="addLinkFromList">{{$t('system.role.seave')}}</el-button>
              <el-button type="danger" size="small" @click="selectLinkVisible=false">{{$t('common.buttonText.cancel')}}</el-button>

            </div>
          </el-dialog>

          <el-dialog
            width="400px"
            center
            :title="$t('customer.customerList.addContact')"
            :close-on-click-modal="false"
            :visible.sync="addClientContact"
            @close="clearLinkForm"
            append-to-body>
            <el-form ref="ClientlinkForm" :model="ClientlinkForm" :label-width="isZh?'100px': '150px'" label-position="left" size="small" :rules="linkFormRules">
                  <el-form-item :label="$t('customer.customerList.firstName')" prop="contactFirstName">
                    <el-input v-model="ClientlinkForm.contactFirstName" :maxlength="character20" clearable style="width: 200px;"/>
                  </el-form-item>
                  <el-form-item :label="$t('customer.customerList.lastName')" prop="contactLastName">
                    <el-input v-model="ClientlinkForm.contactLastName" :maxlength="character20" clearable style="width: 200px;"/>
                  </el-form-item>
              <el-form-item :label="$t('customer.customerList.emailAddress')" prop="emailAddress">
                <el-input v-model="ClientlinkForm.emailAddress" clearable style="width: 200px;" :maxlength="50" @blur="isEmailAddress"/>
              </el-form-item>
                  <el-form-item :label="$t('customer.customerList.officePhone')" prop="contactPhone">
                    <el-input v-model.number="ClientlinkForm.contactPhone" :min="0" :maxlength="16" clearable style="width: 200px;"/>
                  </el-form-item>
              <!--<el-form-item :label="isZh?'职位':'designation'" prop="customerJob">-->
                <!--<el-input v-model="ClientlinkForm.customerJob" clearable style="width: 200px;"/>-->
              <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" :loading="linkLoading" @click="addLinkPeople('ClientlinkForm')">{{$t('system.role.seave')}}</el-button>
              <el-button type="danger" size="small" @click="addClientContact=false">{{$t('common.buttonText.cancel')}}</el-button>
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
            <el-form ref="linkForm" :model="linkForm" v-if="addLinkVisible" :label-width="isZh?'100px': '150px'" label-position="left" size="small" :rules="linkFormRules">
              <el-row :gutter="28">
                <el-col :span="16">
                  <el-form-item :label="$t('customer.customerList.accountNo')" prop="userAccount">
                    <el-input disabled v-model="linkForm.userAccount" clearable />
                  </el-form-item>
                  <el-form-item :label="$t('customer.customerList.firstName')" prop="firstName">
                    <el-input :disabled="isDetail" v-model="linkForm.firstName" :maxlength="character20" clearable />
                  </el-form-item>
                  <el-form-item :label="$t('customer.customerList.lastName')" prop="lastName">
                    <el-input :disabled="isDetail" v-model="linkForm.lastName" :maxlength="character20" clearable />
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
                      :disabled="isDetail"
                      class="avatar-uploader"
                      :action="uploadActionUrl"
                      :headers="upLoadHeaders"
                      :data="{type: 3}"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="linkForm.photoPath" :src="fullUrl(linkForm.photoPath)" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                </el-col>
              </el-row>
              <el-form-item :label="$t('customer.customerList.emailAddress')" prop="emailAddress">
                <el-input :disabled="isDetail" v-model="linkForm.emailAddress" :maxlength="50" clearable />
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.address')" prop="contactAddress">
                <el-input :disabled="isDetail" v-model="linkForm.contactAddress" clearable />
              </el-form-item>
              <el-row :gutter="28">
                <el-col :span="12">
                  <el-form-item :label="$t('customer.customerList.officePhone')" prop="officePhone">
                    <el-input :disabled="isDetail" v-model.number="linkForm.officePhone" :maxlength="16" :min="0" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('customer.customerList.officePhone2')" prop="officePhone2">
                    <el-input :disabled="isDetail" v-model="linkForm.officePhone2" :maxlength="16" :min="0" clearable />
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
                      <el-option v-for="(item, index) in languageList" :label="language === 'zh' ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('customer.customerList.preferdLanguage')">
                    <el-select :disabled="isDetail" v-model="linkForm.preferedLanguageStr" multiple style="width: 100%" @change="getcommLanguage1">
                      <el-option v-for="(item, index) in languageList1" :label="language === 'zh' ? item.label : item.labelEn" :value="item.value" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$t('customer.record.country')" prop="countryCode">
                <el-select :disabled="isDetail" filterable remote :remote-method="getCountryList" :loading="loading1"
                           v-model="linkForm.countryCode" clearable style="width: 100%">
                  <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item :label="$t('customer.customerList.conpanyName')" prop="companyName">-->
                <!--<el-input v-model="linkForm.companyName" :disabled="isCompanyName" />-->
              <!--</el-form-item>-->
              <el-form-item :label="isZh?'职位':'designation'" prop="position">
                <el-input :disabled="isDetail" v-model="linkForm.position" :maxlength="100" clearable />
              </el-form-item>
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
                    <el-input v-model="editForm.firstName" :maxlength="character20" clearable />
                  </el-form-item>
                  <el-form-item :label="$t('customer.customerList.lastName')" prop="lastName">
                    <el-input v-model="editForm.lastName" :maxlength="character20" clearable />
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
                    <el-select v-model="editForm.preferedLanguageStr" multiple style="width: 100%" @change="getcommLanguage1">
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

              <el-table-column :label="$t('customer.customerList.name')" prop="servingName" show-overflow-tooltip />

              <el-table-column :label="$t('customer.customerList.designation')" show-overflow-tooltip>
                <template slot-scope="{row}">
                  {{row.csJob | designation(designationList, isZh)}}
                </template>
                <!--<el-option v-for="(item, index) in designationList" :key="index" :label="language === 'zh' ? item.label : item.labelEn" :value="item.value"></el-option>-->
              </el-table-column>

              <!--<el-table-column :label="isZh?'账号':'UserAccpunt'" show-overflow-tooltip>-->
                <!--<template slot-scope="{row}">-->
                  <!--{{row | AUserAccount}}-->
                <!--</template>-->
              <!--</el-table-column>-->

              <!--<el-table-column :label="isZh?'电话':'MobilePhone'" show-overflow-tooltip>-->
                <!--<template slot-scope="{row}">-->
                  <!--{{row | AMobilePhone}}-->
                <!--</template>-->
              <!--</el-table-column>-->

              <el-table-column align="center" :label="$t('system.role.operation')" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="deleteService(scope.row)">{{$t('system.role.delete')}}</el-button>
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
            <el-form ref="serviceForm" :model="serviceForm" v-if="addServiceVisible" :label-width="isZh ? '100px' : '130px'" label-position="left" size="small" :rules="serviceFormRules">
              <el-form-item :label="$t('customer.customerList.name')" prop="accountBId">
                <el-select
                  v-model="serviceForm.accountBId"
                  :remote-method="getAccountUserList"
                  clearable
                  filterable
                  class="form-dialog-width">
                  <el-option v-for="(item, index) in accountUserListSelect" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('customer.customerList.designation')" prop="csJob">
                <el-select v-model="serviceForm.csJob" clearable class="form-dialog-width">
                  <el-option v-for="(item, index) in designationList" :key="index" :label="language === 'zh' ? item.label : item.labelEn" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" :loading="linkLoading" @click="addServicePeople('serviceForm')">{{$t('system.role.seave')}}</el-button>
              <el-button type="danger" size="small" @click="addServiceVisible=false">{{$t('common.buttonText.cancel')}}</el-button>

            </div>
          </el-dialog>

          <!--客户商品类目-->
          <!--<el-tab-pane :label="$t('customer.customerList.productCategory')" name="7">-->
            <!--<div class="category-form">-->
              <!--<div>-->
                <!--{{$t('customer.customerList.tiers')}}&nbsp;&nbsp;-->
                <!--<el-select v-model="categoryForm.gradientBId" clearable style="width: 200px" placeholder="">-->
                  <!--<el-option v-for="(item, index) in gradientList" :label="isZh ? item.name : item.labelEn" :value="item.id" :key="index"></el-option>-->
                <!--</el-select>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div class="category-form">-->
              <!--{{$t('customer.customerList.select')}}-->
            <!--</div>-->
            <!--<el-table-->
              <!--style="width:90%;margin: 10px auto"-->
              <!--:data="categoryList"-->
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

              <!--<el-table-column align="center" :label="$t('customer.customerList.productItems')" prop="productNumber" />-->

              <!--<el-table-column align="center">-->
                <!--<template slot="header" slot-scope="scope">-->
                  <!--<el-checkbox v-model="checked1" @change="checkAll1">{{$t('customer.customerList.selectAll')}}</el-checkbox>-->
                <!--</template>-->
                <!--<template slot-scope="scope">-->
                  <!--<el-checkbox v-model="scope.row.check" @change="changeCheck1(scope.row,scope.row.check)">{{$t('customer.customerList.sellable')}}</el-checkbox>-->
                <!--</template>-->
              <!--</el-table-column>-->

              <!--<el-table-column align="center" :label="$t('customer.customerList.default')" prop="defaultValue">-->
                <!--<template slot="header" slot-scope="scope">-->
                  <!--<el-checkbox v-model="checked2" @change="checkAll2">{{$t('customer.customerList.selectAll')}}</el-checkbox>-->
                <!--</template>-->
                <!--<template slot-scope="scope">-->
                  <!--<el-checkbox v-model="scope.row.check2" @change="changeCheck2(scope.row, scope.row.check2)">{{isZh?'可见':'Visible'}}</el-checkbox>-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
            <!--<div style="text-align: center">-->
              <!--<el-button type="primary" size="small" :loading="confirmLoading" @click="saveProductCategory">{{$t('system.role.seave')}}</el-button>-->
            <!--</div>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      <!--<div slot="footer" class="dialog-footer" style="border-top: 1px solid #f4f4f4">-->
        <!--&lt;!&ndash;<el-button type="primary" size="small" :loading="confirmLoading" @click="saveBasicMsg()">保存</el-button>&ndash;&gt;-->
        <!--<el-button type="danger" size="small" @click="editVisible=false">关闭</el-button>-->
      <!--</div>-->
    </el-dialog>

    <el-dialog
      width="900px"
      center
      :title="$t('customer.customerList.clientRecord')"
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

        <el-table-column align="center" :label="$t('customer.customerList.clientName')" prop="customerName" show-overflow-tooltip >
          <template slot-scope="scope">
            {{historyParams.companyName}}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('customer.customerList.clientCode')" prop="customerCode" show-overflow-tooltip >
          <template slot-scope="scope">
            {{historyParams.customerCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="160" :label="$t('customer.customerList.modifiedTime')" prop="updateTime">
          <template slot-scope="scope">
            {{scope.row.updateTime | timeFmt1}}
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

    <history-detail :value.sync="historyDetailVisible" :id="historyId" :sort-list="sortList" :grade-list="gradeList" :own-filed-list="ownFiledList" :job-list="designationList"></history-detail>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import HistoryDetail from './components/HistoryDetail'
import {
  listCustomerInfo,
  saveCustomerInfo,
  updateCustomerInfo,
  getCustomerInfoByBId,
  listSort,
  deleteCustomer,
  listCustomerBank,
  saveCustomerBank,
  updateCustomerBank,
  deleteCustomerBankByIds,
  getPaymentDetailByBId,
  saveCustomerPaymentTerms,
  // updateCustomerPaymentTerms,
  listCustomerCooperPact,
  saveCustomerCooperPact,
  deleteCustomerCooperPact,
  listCustomerContact,
  saveCustomerContact,
  // updateCustomerContact,
  deleteCustomerContact,
  listCustomerServing,
  saveCustomerServing,
  deleteCustomerServing,
  exportCustomer,
  getCustomerCategory,
  saveCustomerCategory,
  customerHistoryList,
  customerupdateStatus,
  selectWorkflowNodeListNodeType,
  findContact,
  setDefaultValue
  // historyDetail
} from '@/api/customer';
import { listMemberLevel } from '@/api/member'
import { uploadActionUrl } from '@/api/common';
import { selectCountryListApi, selectCurrencyCodeListApi, selectgetDictionaryBykeyApi, selectUserFrontDetail, getUserFrontendByUserAccount, addUserFrontend, editUser } from '@/api/system'
import { getClientUserList, getAdminUserList, selectUserListAllApi } from '@/api/user'
import { parseTime, deepClone } from '@/utils/index'
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
      currencyCodeList: [],
      uploadActionUrl,
      activeName: '1',
      isShowEmailAddress: false,
      isAddLinkModal: false,
      editLinkVisible: false,
      listLoading: true,
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
      loading1: false,
      Loading1: false,
      loading2: false,
      userLoading: false,
      checked1: false,
      checked2: false,
      dialogType: '',
      customerDataTemp: {},
      categoryForm: {
        gradientBId: ''
      },
      customerData: {
        customerStatus: 1,
        transaStatus: 0,
        ownField: '',
        ownFieldList: [],
        commLanguageList: [],
        commLanguage: '',
        customerName: '',
        shortName: '',
        customerCode: '',
        countryCode: '',
        memberBId: '',
        companyName: '',
        chargeBy: '',
        provinceCode: '',
        registerAddress: '',
        emailAddress: '',
        mobilePhone: '',
        facsimileNo: '',
        deliveryPort: '',
        deliveryPortArr: [],
        sortBId: '',
        gradeBId: '',
        sortName: [],
        customerSource: '',
        preferredLanguage: '',
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
        reservedField10: ''
      },
      isCompanyName: false,
      areaList2: [
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
      ],
      gradeDataRules: {
        customerName: [
          { required: true, message: this.$t('customer.customerList.inputClientName'), trigger: 'blur' }
        ],
        customerCode: [
          { required: true, message: this.$t('customer.customerList.inputClientCode'), trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: this.$t('customer.customerList.inputCompany'), trigger: 'blur' }
        ],
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
        mobilePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        mobilePhone1: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        officePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        officePhone2: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        taxNo: [
          {
            pattern: /^\w+$/,
            message: this.$t('customer.customerList.inputEin'),
            trigger: 'blur'
          }
        ],
        chargeBy: [
          { required: true, message: this.$t('customer.customerList.inputHead'), trigger: 'blur' }
        ],
        deliveryPortArr: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inputPort'), trigger: 'change' }
        ],
        commLanguageList: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inputUsedLanguage'), trigger: 'change' }
        ],
        preferredLanguage: [
          { required: true, message: this.$t('customer.customerList.inputUsedLanguage'), trigger: 'change' }
        ],
        memberBId: [
          { required: true, message: this.$t('customer.customerList.inputClientLevel'), trigger: 'change' }
        ],
        customerStatus: [
          { required: true, message: this.$t('customer.customerList.inputClientStatus'), trigger: 'blur' }
        ],
        sortName: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inpputClientCategory'), trigger: 'change' }
        ]
      },
      controlTowerList: [],
      spt: {
        paymentMethod: '',
        shipmentType: "",
        paymentType: '',
        deliveryPort: ''
      },
      sptRules: {
        deliveryPort: [{ required: true, message: this.$t('customer.customerList.inputPort'), trigger: 'change' }],
        shipmentType: [{ required: true, message: this.$t('customer.customerList.inputTransportation'), trigger: 'change' }],
        paymentMethod: [{ required: true, message: this.$t('customer.customerList.inputPayment'), trigger: 'change' }],
        paymentType: [{ required: true, message: this.$t('customer.customerList.inputOffer'), trigger: 'change' }]
      },
      // 银行列表
      sbalist: [],
      userAccount: '',
      mobilePhone: '',
      // sbalist: [{ bankAccount: '', bankName: '', reservedPhone: '', swiftCode: '' }],
      scplist: [],
      sclist: [],
      sslist: [],
      categoryList: [],
      historyList: [],
      historyParams: {
        pageNum: 1,
        pageSize: 10,
        modifyCustomerBId: ''
      },
      ClientlinkForm: {
        firstName: '',
        lastName: '',
        emailAddress: '',
        position: '',
        userAccount: '',
        mobilePhone: '',
        mobilePhone2: '',
        officePhone: '',
        officePhone2: ''
      },
      historyId: '',
      linkForm: {
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
      linkFormRules: {
        userAccount: [
          { required: true, message: this.$t('customer.customerList.inputAccount'), trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: this.$t('customer.customerList.inputFirstName'), trigger: 'blur' }
        ],
        contactFirstName: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'blur' }
        ],
        contactLastName: [
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
        csJob: '1'
      },
      serviceFormRules: {
        accountBId: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'change' }
        ],
        csJob: [
          { required: true, message: this.$t('customer.customerList.inputDesignation'), trigger: 'change' }
        ]
      },
      bankDialogType: 'add',
      bankSelectList: [],
      bankForm: {
        bankAccount: '',
        bankName: '',
        reservedPhone: '',
        swiftCode: '',
        branchName: '',
        bankAddress: '',
        accountCurrency: '',
        accountType: 1,
        defaultValue: 0
      },
      bankFormRules: {
        bankAccount: [
          { required: true, message: this.$t('customer.customerList.inputreservedPhone'), trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: this.$t('customer.customerList.inputBankName'), trigger: 'blur' }
        ],
        branchName: [
          { required: true, message: this.$t('customer.customerList.inputBranchName'), trigger: 'blur' }
        ],
        bankAddress: [
          { required: true, message: this.$t('customer.customerList.inputBankAddress'), trigger: 'blur' }
        ],
        swiftCode: [
          { required: true, message: this.$t('customer.customerList.inputSwiftCode'), trigger: 'blur' }
        ],
        accountCurrency: [
          { required: true, message: this.$t('customer.customerList.inputCurrency'), trigger: 'change' }
        ]
      },
      userListPrams: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      selectLinkPeople: [],
      selectLink: '',
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
      countryList: [],
      selectList: [],
      sortList: [],
      gradeList: [],
      linkList: [],
      accountUserList: [],
      accountUserListSelect: [],
      jobList: [],
      searchSortName: [],
      postData: {
        companyName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        customerName: '',
        custSortBId: '',
        customerGradeId: '',
        memberBId: '',
        customerCode: '',
        countryCode: '',
        telephone: '',
        customerStatus: ''
      },
      reviewForm: {
        idlist: '',
        customerStatus: 0
      },
      languageList: [],
      languageList1: [],
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
      // statusList: [
      //   {
      //     id: 1,
      //     label: '有效'
      //   },
      //   {
      //     id: 2,
      //     label: '无效'
      //   }
      // ],
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
      // customerStatusList: [
      //   {
      //     label: '启用',
      //     id: 1
      //   },
      //   {
      //     label: '禁用',
      //     id: 0
      //   }
      // ],
      adminUserList: [],
      dataList: [],
      contactType: '',
      isDetail: false,
      customerStatus: [],
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
      firstPayment: false,
      addClientContact: false,
      character300: 300,
      character20: 20,
      character30: 30,
      character16: 16,
      designationList: []
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
  watch: {
    isZh() {
      this.setOption()
    }
  },
  created() {
    this.getDataList();
    this.getGradeList();
    this.getSortList();
    this.getOwnFieldList();
    this.getLanguageList();
    this.getUserAccountList();
    this.getCountryAllList();
    this.getCurrencyCodeListFun();
    this.dictionary();
  },
  methods: {
    setOption() {
      this.sptRules = {
        deliveryPort: [{ required: true, message: this.$t('customer.customerList.inputPort'), trigger: 'change' }],
        shipmentType: [{ required: true, message: this.$t('customer.customerList.inputTransportation'), trigger: 'change' }],
        paymentMethod: [{ required: true, message: this.$t('customer.customerList.inputPayment'), trigger: 'change' }],
        paymentType: [{ required: true, message: this.$t('customer.customerList.inputOffer'), trigger: 'change' }]
      };
      this.gradeDataRules = {
        customerName: [
          { required: true, message: this.$t('customer.customerList.inputClientName'), trigger: 'blur' }
        ],
        customerCode: [
          { required: true, message: this.$t('customer.customerList.inputClientCode'), trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: this.$t('customer.customerList.inputCompany'), trigger: 'blur' }
        ],
        countryCode: [
          { required: true, message: this.$t('customer.customerList.inputCountry'), trigger: 'change' }
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
        // mobilePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        // mobilePhone1: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        // officePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        // officePhone2: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        mobilePhone: [
          { required: true, message: this.$t('system.userManage.userPhone'), trigger: 'blur' },
          // { type: 'number', message: this.$t('system.userManage.userPhone'), trigger: 'blur' },
          { pattern: /^\d+$/, message: this.$t('system.userManage.userPhone') }
        ],
        taxNo: [
          {
            pattern: /^\w+$/,
            message: this.$t('customer.customerList.inputEin'),
            trigger: 'blur'
          }
        ],
        chargeBy: [
          { required: true, message: this.$t('customer.customerList.inputHead'), trigger: 'blur' }
        ],
        deliveryPortArr: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inputPort'), trigger: 'change' }
        ],
        commLanguageList: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inputUsedLanguage'), trigger: 'change' }
        ],
        preferredLanguage: [
          { required: true, message: this.$t('customer.customerList.inputUsedLanguage'), trigger: 'change' }
        ],
        memberBId: [
          { required: true, message: this.$t('customer.customerList.inputClientLevel'), trigger: 'change' }
        ],
        customerStatus: [
          { required: true, message: this.$t('customer.customerList.inputClientStatus'), trigger: 'blur' }
        ],
        sortName: [
          { type: 'array', required: true, message: this.$t('customer.customerList.inpputClientCategory'), trigger: 'change' }
        ]
      };
      this.bankFormRules = {
        bankAccount: [
          { required: true, message: this.$t('customer.customerList.inputreservedPhone'), trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: this.$t('customer.customerList.inputBankName'), trigger: 'blur' }
        ],
        branchName: [
          { required: true, message: this.$t('customer.customerList.inputBranchName'), trigger: 'blur' }
        ],
        bankAddress: [
          { required: true, message: this.$t('customer.customerList.inputBankAddress'), trigger: 'blur' }
        ],
        swiftCode: [
          { required: true, message: this.$t('customer.customerList.inputSwiftCode'), trigger: 'blur' }
        ],
        accountCurrency: [
          { required: true, message: this.$t('customer.customerList.inputCurrency'), trigger: 'change' }
        ]
      };
      this.linkFormRules = {
        userAccount: [
          { required: true, message: this.$t('customer.customerList.inputAccount'), trigger: 'blur' }
        ], firstName: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'blur' }
        ], lastName: [
          { required: true, message: this.$t('customer.customerList.inputFirstName'), trigger: 'blur' }
        ], emailAddress: [
          { required: true, message: this.$t('system.userManage.userEmail'), trigger: 'blur' },
          { type: 'email', message: this.$t('customer.customerList.inputEmailSave'), trigger: 'blur' }
        ], contactAddress: [
          { required: true, message: this.$t('customer.customerList.inputAddress'), trigger: 'blur' }
        ],
        // mobilePhone: [
        //   { required: true, validator: checkPhone, trigger: 'blur' }
        // ],
        officePhone: [
          { required: true, message: this.$t('customer.customerList.inputOfficePhone'), trigger: 'blur' }
        ], countryCode: [{ required: true, message: this.$t('customer.customerList.inputName'), trigger: 'change' }
        ], usedLanguage: [
          { required: true, message: this.$t('customer.customerList.inputUsedLanguage'), trigger: 'change' }
        ]
      };
      this.serviceForm = {
        accountBId: '',
        accountName: '',
        csJob: this.$t('customer.customerList.serviceStaff2')
      };
      this.serviceFormRules = {
        accountBId: [
          { required: true, message: this.$t('customer.customerList.inputName'), trigger: 'change' }
        ],
        csJob: [
          { required: true, message: this.$t('customer.customerList.inputDesignation'), trigger: 'change' }
        ]
      }
    },
    addCustomerRecord(id, customerName) {
      this.$router.push({
        query: {
          id, customerName
        },
        path: '/customer/communication'
      })
    },
    clearLinkForm() {
      this.linkForm = {
        firstName: '',
        lastName: '',
        emailAddress: '',
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
      }
    },
    clearDialog() {
      // this.$refs['customerData'].resetFields();
      this.customerData.bid = '';
      this.customerData.ownField = '';
      this.customerData.deliveryPort = '';
      this.customerData.ownFielList = [];
      this.customerData.commLanguageList = [];
      this.confirmLoading = false;
      this.customerData.customerStatus = 1;
      this.customerData.transaStatus = 0;
      this.customerData.ownField = '';
      this.customerData.ownFieldList = [];
      this.customerData.commLanguageList = [];
      this.customerData.commLanguage = '';
      this.customerData.customerName = '';
      this.customerData.shortName = '';
      this.customerData.customerCode = '';
      this.customerData.countryCode = '';
      this.customerData.memberBId = '';
      this.customerData.companyName = '';
      this.customerData.chargeBy = '';
      this.customerData.provinceCode = '';
      this.customerData.registerAddress = '';
      this.customerData.emailAddress = '';
      this.customerData.mobilePhone = '';
      this.customerData.facsimileNo = '';
      this.customerData.deliveryPort = '';
      this.customerData.deliveryPortArr = [];
      this.customerData.sortBId = '';
      this.customerData.gradeBId = '';
      this.customerData.sortName = [];
      this.customerData.customerSource = '';
      this.customerData.preferredLanguage = '';
      this.customerData.taxNo = '';
      this.customerData.facsimileNo2 = '';
      this.customerData.mobilePhone2 = '';
      this.customerData.officePhone = '';
      this.customerData.officePhone2 = '';
      this.customerData.registerPhone = '';
      this.customerData.postalCode = '';
      this.customerData.otherAddress = '';
      this.customerData.officeAddress = '';
      this.customerData.remarks = '';
      this.customerData.reservedField1 = '';
      this.customerData.reservedField2 = '';
      this.customerData.reservedField3 = '';
      this.customerData.reservedField4 = '';
      this.customerData.reservedField5 = '';
      this.customerData.reservedField6 = '';
      this.customerData.reservedField7 = '';
      this.customerData.reservedField8 = '';
      this.customerData.reservedField9 = '';
      this.customerData.reservedField10 = ''
      // this.customerData = [];
    },
    // 服务人员字典
    dictionary() {
      selectgetDictionaryBykeyApi({
        key: 'servicePersonal'
      }).then(res => {
        this.designationList = res.data || []
      })
    },
    // 弹窗类别转化字符串
    getParentId(arr) {
      if (arr.length) {
        this.customerData.custSortBId = arr.join(',')
      } else {
        this.customerData.custSortBId = ''
      }
    },
    // 付款节点
    getPaymentNode() {
      selectWorkflowNodeListNodeType({
        nodeType: 2
      }).then(res => {
        this.controlTowerList = res.data
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    // 主列表数组转为字符串搜索
    getParentId1(arr) {
      if (arr.length) {
        this.postData.custSortBId = arr.join(',')
      } else {
        this.postData.custSortBId = ''
      }
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
    getcommLanguage1(arr) {
      if (arr.length) {
        this.linkForm.preferedLanguage = arr.join(',');
        this.editForm.preferedLanguage = arr.join(',');
      } else {
        this.linkForm.preferedLanguage = '';
        this.editForm.preferedLanguage = '';
      }
    },
    // 港口id数组转为字符
    getdeliveryPort(arr) {
      if (arr.length) {
        this.customerData.deliveryPort = arr.join(',')
      } else {
        this.customerData.deliveryPort = ''
      }
    },
    // 常用语言转为字符
    getcommLanguage(arr) {
      if (arr.length) {
        this.customerData.commLanguageString = arr.join(',')
      } else {
        this.customerData.commLanguageString = ''
      }
    },
    // 详情
    // openDetail(row) {
    //   // this.getSysRoleListMethod()
    //   selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
    //     this.entityForm = Object.assign(this.entityForm, res.data);
    //     if (this.entityForm.preferedLanguage) {
    //       this.entityForm.preferedLanguageStr = this.entityForm.preferedLanguage.split(',')
    //     } else {
    //       this.entityForm.preferedLanguageStr = []
    //     }
    //     if (this.entityForm.roles) {
    //       this.entityForm.roles = this.entityForm.roles
    //     } else {
    //       this.entityForm.roles = []
    //     }
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   });
    //   this.languageList1 = this.languageList.filter(e => {
    //     return e.value !== this.entityForm.usedLanguage
    //   });
    //   // 回显上级
    //   this.detailModal3 = true;
    // },
    // 所属领域转为字符
    getownField(arr) {
      if (arr.length) {
        this.customerData.ownField = arr.join(',')
      } else {
        this.customerData.ownField = ''
      }
    },
    // 点击切换tabs
    changeTabs(name) {
      if (name !== '1' && !this.customerData.bid) {
        this.$message.warning(this.$t('customer.customerList.hintPerfect'));
        return false
      }
      switch (Number(name)) {
        case 2: this.getCustomerBankList(); break;
        case 3: this.getPayments(); break;
        case 4: this.getCooperFile(); break;
        case 5: this.getLinkPeople(); break;
        case 6: this.getServiceList(); break;
        case 7: this.getCustomerCategoryList(); break;
        default: break;
      }
    },
    // 获取银行卡列表
    getCustomerBankList() {
      listCustomerBank({ customerBId: this.customerData.bid, pageNum: 1, pageSize: 999 }).then(res => {
        this.sbalist = res.data.list;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取付款信息
    getPayments() {
      this.getPaymentNode()
      getPaymentDetailByBId({ customerBId: this.customerData.bid }).then(res => {
        this.spt = Object.assign(this.spt, res.data);
        if (res.data.sysOrderPayNodeList && res.data.sysOrderPayNodeList.length) {
          // this.spt.shipmentTypeArr = res.data.shipmentType ? res.data.shipmentType.split(',') : [];
          // this.spt.shipmentTypeArr = res.data.shipmentType;
          this.firstPayment = false;
          // this.controlTowerList = res.data.customerOrderPayNodeList || []
        } else {
          this.controlTowerList = (res.data.controlTowerList || []).map(e => {
            e.dayNum = 0;
            e.paymentRatio = 0;
            e.customerBId = this.customerData.bid;
            e.controlNodeBId = e.bid;
            e.nodeLevel = e.sequence;
            return { ...e }
          });
          // this.controlTowerList = res.data.sysOrderPayNodeList || []
          this.firstPayment = true;
        }
        if (res.data.customerOrderPayNodeList.length === 0) {
          this.controlTowerList = res.data.sysOrderPayNodeList
        } else {
          this.controlTowerList = res.data.customerOrderPayNodeList
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = saveCustomerPaymentTerms;
          // let api = this.firstPayment ? saveCustomerPaymentTerms : updateCustomerPaymentTerms;
          this.confirmLoading = true;
          this.spt.customerBId = this.customerData.bid;
          this.spt.customerOrderPayNodeList = this.controlTowerList;
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
      listCustomerCooperPact({ customerBId: this.customerData.bid, pageNum: 1, pageSize: 999 }).then(res => {
        this.scplist = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    changeMethod(row) {
      customerupdateStatus({
        bid: row.bid
      }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取联系人列表
    getLinkPeople() {
      listCustomerContact({ customerBId: this.customerData.bid }).then(res => {
        this.sclist = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取服务人员列表
    getServiceList() {
      listCustomerServing({ pageNum: 1, pageSize: 999, customerBId: this.customerData.bid }).then(res => {
        this.sslist = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取类目商品
    getCustomerCategoryList() {
      getCustomerCategory({ customerBId: this.customerData.bid }).then(res => {
        this.categoryForm = res.data;
        this.categoryList = res.data.productCatalogVos.map(e => {
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSelectCategoryList(arr) {
      let arr1 = [];
      arr.forEach(e => {
        if (e.check || e.check2) {
          arr1.push(e)
        }
        if (e.children && e.children.length) {
          arr1 = arr1.concat(this.getSelectCategoryList(e.children))
        }
      });
      return arr1
    },
    saveProductCategory() {
      if (!this.categoryForm.gradientBId) {
        return this.$message.warning(this.$t('customer.customerList.gradient'))
      }
      this.categoryForm.customerBId = this.customerData.bid;
      this.categoryForm.customerProductSpecFormList = this.getSelectCategoryList(this.categoryList).map(e => {
        e.visibleType = e.check ? 1 : 0;
        e.visibleStatus = e.check2 ? 1 : 0;
        e.customerBId = this.customerData.bid;
        e.catalogBId = e.bid;
        return { ... e }
      });
      this.confirmLoading = true;
      saveCustomerCategory(this.categoryForm).then(res => {
        this.confirmLoading = false;
        this.$message.success(this.$t("system.userManage.handle"))
      }).catch(err => {
        this.confirmLoading = false;
        this.$message.error(err.message);
      });
    },
    changeCheck1(item, check) {
      if (check) {
        item.check2 = false;
        if (item.children && item.children.length) {
          this.checkChildren(item.children, true)
        }
      } else {
        if (item.children && item.children.length) {
          this.checkFalseChildren(item.children, true)
        }
      }
    },
    changeCheck2(item, check) {
      if (check) {
        item.check = false;
        if (item.children && item.children.length) {
          this.checkChildren(item.children, false)
        }
      } else {
        if (item.children && item.children.length) {
          this.checkFalseChildren(item.children, false)
        }
      }
    },
    checkAll1(flag) {
      this.checked2 = false;
      if (flag) {
        this.categoryList.forEach(e => {
          e.check = flag;
          e.check2 = !flag;
          if (e.children && e.children.length) {
            this.checkChildren(e.children, true)
          }
        })
      } else {
        this.categoryList.forEach(e => {
          e.check = false;
          if (e.children && e.children.length) {
            this.checkFalseChildren(e.children, true)
          }
        })
      }
    },
    checkAll2(flag) {
      this.checked1 = false;
      if (flag) {
        this.categoryList.forEach(e => {
          e.check = !flag;
          e.check2 = flag;
          if (e.children && e.children.length) {
            this.checkChildren(e.children, false)
          }
        })
      } else {
        this.categoryList.forEach(e => {
          e.check2 = false;
          if (e.children && e.children.length) {
            this.checkFalseChildren(e.children, false)
          }
        })
      }
    },
    checkChildren(arr, flag) {
      arr.findIndex(e => {
        e.check = flag;
        e.check2 = !flag;
        if (e.children && e.children.length) {
          this.checkChildren(e.children, flag)
        }
      })
    },
    checkFalseChildren(arr, flag) {
      arr.findIndex(e => {
        if (flag) {
          e.check = false;
        } else {
          e.check2 = false;
        }
        if (e.children && e.children.length) {
          this.checkFalseChildren(e.children, flag)
        }
      })
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
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      listCustomerInfo(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    // 获取等级列表
    getGradeList() {
      listMemberLevel().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      listSort({ pageNum: 1, pageSize: 999, sortStatus: 1 }).then(res => {
        this.sortList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
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
    // 查询后台用户
    getAccountUserList(val) {
      const _this = this;
      if (val !== '') {
        this.userLoading = true;
        selectUserListAllApi(val).then(res => {
          _this.accountUserListSelect = res.data;
          _this.userLoading = false;
        });
      } else {
        this.accountUserListSelect = [];
      }
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
    getCountryAllList() {
      selectCountryListApi().then(res => {
        this.countryList = res.data || []
      })
    },
    // 获取后台用户
    getUserAccountList() {
      getAdminUserList().then(res => {
        this.accountUserList = res.data || []
      })
    },
    // 打开新增编辑弹窗
    openEdit(type, bid) {
      this.activeName = '1';
      if (type === 'edit') {
        let obj = {
          bid: bid
        };
        this.isCompanyName = true
        getCustomerInfoByBId(obj).then(res => {
          this.customerData = Object.assign(this.customerData, res.data);
          if (this.customerData.custSortBId) {
            this.customerData.sortName = this.customerData.custSortBId.split(',');
          } else {
            this.customerData.sortName = []
          }
          if (res.data.deliveryPort) {
            this.customerData.deliveryPortArr = this.customerData.deliveryPort.split(',');
          } else {
            this.customerData.deliveryPortArr = []
          }
          if (res.data.ownField) {
            this.customerData.ownFieldList = this.customerData.ownField.split(',');
          } else {
            this.customerData.ownFieldList = []
          }
          if (res.data.commLanguage) {
            this.customerData.commLanguageList = this.customerData.commLanguage.split(',');
          } else {
            this.customerData.commLanguageList = []
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      } else {
        this.isCompanyName = false
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    // 打开修改历史弹窗
    openHistory(row) {
      this.historyParams.customerCode = row.customerCode;
      this.historyParams.companyName = row.companyName;
      this.historyParams.pageNum = 1;
      this.historyParams.modifyCustomerBId = row.bid;
      this.getHistoryList()
    },
    getHistoryList() {
      customerHistoryList(this.historyParams).then(res => {
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
    // 打开详情弹窗
    openDetail(id) {
      this.activeName = '1';
      this.detailVisible = true;
      let obj = {
        bid: id
      };
      getCustomerInfoByBId(obj).then(res => {
        this.customerData = Object.assign(this.customerData, res.data);
        if (this.customerData.custSortBId) {
          this.customerData.sortName = this.customerData.custSortBId.split(',');
        } else {
          this.customerData.sortName = []
        }
        if (res.data.deliveryPort) {
          this.customerData.deliveryPortArr = this.customerData.deliveryPort.split(',');
        } else {
          this.customerData.deliveryPortArr = []
        }
        if (res.data.ownField) {
          this.customerData.ownFieldList = this.customerData.ownField.split(',');
        } else {
          this.customerData.ownFieldList = []
        }
        if (res.data.deliveryPort) {
          this.customerData.commLanguageList = this.customerData.commLanguage.split(',');
        } else {
          this.customerData.commLanguageList = []
        }
        this.getCustomerBankList();
        this.getPayments();
        this.getCooperFile();
        this.getLinkPeople();
        this.getServiceList();
        this.getCustomerCategoryList();
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 客户列表多选
    getSelect(selects) {
      this.selectList = selects;
    },
    // 打开用户列表
    addFromUserList() {
      this.selectLinkVisible = true;
      this.getSelectUserList()
    },
    // 从用户列表别获取联系人
    getSelectUserList() {
      let obj = {};
      for (let key in this.userListPrams) {
        if (this.userListPrams[key]) {
          obj[key] = this.userListPrams[key]
        }
      }
      obj.accountStatus = 0;
      getClientUserList(obj).then(res => {
        this.linkList = res.data.list || [];
        this.userListPrams.total = res.data.total
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    radioButton(id) {
      setDefaultValue({
        id: id
      }).then(res => {
        this.getLinkPeople();
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 选中用户
    singleSelectUser(selects) {
      this.selectLinkPeople = selects
      if (selects.length > 1) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(selects.pop())
      }
      // this.isEmailAddress(this.selectLinkPeople[0].userAccount)
      // this.selectLink = this.selectLinkPeople.filter(e => {
      //   let obj = {
      //     emailAddress: e.userAccount,
      //     customerBId: this.customerData.bid
      //   };
      //   findContact(obj).then(res => {
      //     this.isShowEmailAddress = res.data;
      //     if (res.data) {
      //       this.$message.warning(this.language === 'zh' ? '存在相同账户' : 'Same account exists')
      //     } else {
      //       this.isShowEmailAddress = false
      //     }
      //   }).catch(err => {
      //     this.$message.error(err.message)
      //   })
      // })
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
        contactName: this.selectLinkPeople[0].lastName + ' ' + this.selectLinkPeople[0].firstName,
        contactPhone: this.selectLinkPeople[0].mobilePhone,
        emailAddress: this.selectLinkPeople[0].userAccount,
        customerJob: this.selectLinkPeople[0].position,
        customerBId: this.customerData.bid
      };
      let obj1 = {
        emailAddress: obj.emailAddress,
        customerBId: this.customerData.bid
      };
      findContact(obj1).then(res => {
        this.isShowEmailAddress = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
      if (this.isShowEmailAddress) {
        return this.$message.warning(this.language === 'zh' ? '存在相同账户' : 'Same account exists')
      }
      // this.sclist.push(deepClone(obj));
      saveCustomerContact(deepClone(obj)).then(res => {
        this.$message.success(this.$t('customer.customerList.saveSuccess'));
        this.getLinkPeople();
        this.selectLinkPeople = [];
        this.$refs.multipleTable.clearSelection();
        this.selectLinkVisible = false
      }).catch(err => {
        this.$message.warning(err.message);
      });
    },
    addContactList() {
      this.addClientContact = true;
    },
    // 打开新增联系人弹窗
    addLinkModal(type, row) {
      // this.linkForm.companyName = this.customerData.companyName;
      this.contactType = type;
      if (type === 'detail') {
        this.isDetail = true;
        selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
          if (res.data) {
            this.linkForm = Object.assign(this.linkForm, res.data);
          }
          if (this.customerData.custSortBId) {
            this.linkForm.sortName = this.customerData.custSortBId.split(',');
          } else {
            this.linkForm.sortName = []
          }
          if (this.linkForm.preferedLanguage) {
            this.linkForm.preferedLanguageStr = this.linkForm.preferedLanguage.split(',')
          } else {
            this.linkForm.preferedLanguageStr = []
          }
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
          this.addLinkVisible = true;
        }).catch(err => {
          this.$message.error(err.message);
        });
      } else {
        this.linkForm.userAccount = row.emailAddress;
        this.linkForm.firstName = row.contactFirstName;
        this.linkForm.lastName = row.contactLastName;
        this.linkForm.officePhone = row.contactPhone;
        this.linkForm.emailAddress = row.emailAddress;
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
              customerBId: this.customerData.bid
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
              saveCustomerContact(obj).then(res => {
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
    isEmailAddress(val) {
      let obj = {
        emailAddress: this.ClientlinkForm.emailAddress || val,
        customerBId: this.customerData.bid
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
    // 新增联系人
    addLinkPeople(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isShowEmailAddress) {
            return this.$message.warning(this.language === 'zh' ? '存在相同账户' : 'Same account exists')
          }
          this.ClientlinkForm.customerBId = this.customerData.bid;
          this.ClientlinkForm.contactName = this.ClientlinkForm.contactFirstName + ' ' + this.ClientlinkForm.contactLastName;
          this.linkLoading = true;
          saveCustomerContact(this.ClientlinkForm).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.$refs[formName].resetFields();
            this.getLinkPeople();
            this.linkLoading = false;
            this.addClientContact = false;
          }).catch(err => {
            this.linkLoading = false;
            this.$message.error(err.message);
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
          this.linkForm.businessBid = this.customerData.bid;
          // this.ClientlinkForm.contactName = this.ClientlinkForm.contactFirstName + ' ' + this.ClientlinkForm.contactLastName;
          this.linkLoading = true;
          this.linkForm.addType = 2;
          addUserFrontend(this.linkForm).then(res => {
            this.$message.success(this.$t('customer.customerList.saveSuccess'));
            this.$refs[formName].resetFields();
            this.linkForm.photoPath = '';
            this.getLinkPeople();
            this.linkLoading = false;
            this.addLinkVisible = false;
          }).catch(err => {
            this.linkLoading = false;
            this.$message.error(err.message);
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    editDetail(row) {
      selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
        if (res.data) {
          this.editForm = Object.assign(this.editForm, res.data);
        }
        if (this.customerData.custSortBId) {
          this.editForm.sortName = this.customerData.custSortBId.split(',');
        } else {
          this.editForm.sortName = []
        }
        if (this.editForm.preferedLanguage) {
          this.editForm.preferedLanguageStr = this.editForm.preferedLanguage.split(',')
        } else {
          this.editForm.preferedLanguageStr = []
        }
        // if (res.data.deliveryPort) {
        //   this.editForm.deliveryPortArr = this.editForm.deliveryPort.split(',');
        // } else {
        //   this.editForm.deliveryPortArr = []
        // }
        // if (res.data.ownField) {
        //   this.editForm.ownFieldList = this.editForm.ownField.split(',');
        // } else {
        //   this.editForm.ownFieldList = []
        // }
        // if (res.data.commLanguage) {
        //   this.editForm.commLanguageList = this.editForm.commLanguage.split(',');
        // } else {
        //   this.editForm.commLanguageList = []
        // }
        this.editLinkVisible = true;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    editAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.linkForm.customerBId = this.customerData.bid;
          this.editForm.businessBid = this.customerData.bid;
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
    // 删除联系人
    deleteLinkPeople(row) {
      deleteCustomerContact({ id: row.id }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getLinkPeople();
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    // 新增服务人员
    addServicePeople(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.serviceForm.customerBId = this.customerData.bid;
          this.linkLoading = true;
          saveCustomerServing(this.serviceForm).then(res => {
            this.$message.success(this.$t("system.userManage.handle"));
            this.$refs[formName].resetFields();
            this.getServiceList();
            this.linkLoading = false;
            this.addServiceVisible = false
          }).catch(err => {
            this.linkLoading = false;
            this.$message.warning(err.message);
          })
        } else {
          return this.$message.warning(this.$t('customer.customerList.complete'));
        }
      });
    },
    // 删除服务人员
    deleteService(row) {
      deleteCustomerServing({ id: row.id }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getServiceList();
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    // 打开服务人员弹窗
    addServiceModal() {
      this.getAccountUserList()
      this.addServiceVisible = true
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    // 获取币种列表
    getCurrencyCodeListFun() {
      selectCurrencyCodeListApi().then(res => {
        this.currencyCodeList = res.data || [];
      });
    },
    // 新增银行账号
    addBankAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.bankForm.customerBId = this.customerData.bid;
          let api = this.bankDialogType === 'add' ? saveCustomerBank : updateCustomerBank;
          api(this.bankForm).then(res => {
            this.$refs[formName].resetFields();
            this.getCustomerBankList();
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
    removeBankAccount() {
      if (!this.bankSelectList.length) {
        return this.$message.warning(this.$t("system.userManage.option"))
      }
      let formData = new FormData();
      formData.append('ids', this.bankSelectList.map(e => e.id).join(','));
      deleteCustomerBankByIds(formData).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getCustomerBankList();
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    arrSplice(arr, index) {
      arr.splice(index, 1)
    },
    // 把多选框选的值由数组转换为字符串
    // getCheckBoxVal(arr) {
    //   this.spt.shipmentType = arr.join(',')
    // },
    // 删除主列表数据，可批量删除
    deleteCustomer(id) {
      let obj = {};
      if (id) {
        obj = {
          bid: id,
          delFlag: 2
        }
      } else {
        if (!this.selectList.length) {
          return this.$message.error(this.$t("system.userManage.option"));
        }
        obj = {
          bid: this.selectList.map(e => e.bid).join(','),
          delFlag: 2
        }
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
        deleteCustomer(obj).then(res => {
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
          // this.customerData.ownField = this.customerData.ownField;
          this.customerData.commLanguage = this.customerData.commLanguageString;
          if (this.customerData.bid) {
            updateCustomerInfo(this.customerData).then(res => {
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
            this.customerData.commLanguage = this.customerData.commLanguageString;
            saveCustomerInfo(this.customerData).then(res => {
              this.$message.success(this.$t("system.userManage.handle"));
              this.customerData.bid = res.data;
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
      this.cooperObj.customerBId = this.customerData.bid
      saveCustomerCooperPact(this.cooperObj).then(res => {
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
      deleteCustomerCooperPact({ id: scope.row.id }).then(res => {
        this.$message.success(this.$t("system.userManage.handle"));
        this.getCooperFile()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    exportExcel() {
      exportCustomer().then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'customer.xls')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 下载协议
    exportPactFile(row) {
      this.downFile(row.pactFilePath)
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
      //
      for (let i = 0; i < this.scplist.length; i++) {
        if (this.scplist[i].pactFile === file.name) {
          this.$message.error(this.$t('customer.customerList.fileUpload'));
          return false
        }
      }
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
      return extension || extension2 || extension3 || extension4 && isLt2M
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
    timeFmt1(val) {
      if (val) {
        return parseTime(val)
      }
    },
    designation(val, arr, isZh) {
      let objArr = arr.filter(e => e.value === val);
      if (objArr.length) {
        return isZh ? objArr[0].label : objArr[0].labelEn
      } else {
        return val
      }
    }
    // AUserAccount(val) {
    //   return val.userBackendPoly.userAccount
    // },
    // AMobilePhone(val) {
    //   return val.userBackendPoly.mobilePhone
    // }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .customer-container {
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
  .table-btn-width {
    width: 50px;
  }
</style>
