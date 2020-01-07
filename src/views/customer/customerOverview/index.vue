<template>
  <div class="app-container customer-container">
    <div class="search-box">
      <el-form :label-width="isZh ? '70px' : '115px'" inline size="small">
        <div>
          <el-form-item :label="$t('customer.record.client')">
            <el-input v-model.trim="postData.customerName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.category')">
            <el-cascader
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
          <el-form-item :label="$t('customer.record.level')">
            <el-select v-model="postData.memberBId" clearable style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="language === 'zh' ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('customer.record.clientCode')">
            <el-input v-model.trim="postData.customerCode" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.country')" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('customer.record.contactNo')">
            <el-input v-model.trim="postData.mobilePhone" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.customerStatus" clearable style="width: 150px">
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
      <!--<el-button type="primary" size="small" @click="openEdit('add')">新增</el-button>-->
      <!--<el-button type="primary" size="small" @click="deleteCustomer()">删除</el-button>-->
      <el-button class="export" type="primary" @click="exportExcel">{{$t('system.role.export')}}</el-button>
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

      <el-table-column :label="$t('customer.record.country')" :prop="language === 'zh' ? 'cnCountryName' : 'enCountryName'" show-overflow-tooltip/>
      <el-table-column :label="$t('customer.record.level')" prop="gradeName" show-overflow-tooltip />

      <!--<el-table-column label="分类" prop="sortName" show-overflow-tooltip />-->
      <el-table-column align="center" width="100px" :label="$t('system.role.modifier')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="140px" :label="$t('system.userManage.editTime')" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="accountStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.customerStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.customerStatus
            === 1 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row)">{{$t('system.role.view')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" :title="$t('customer.collect.overView')" width="1000px" center @close="clearDialog" destroy-on-close>
      <el-tabs v-model="activeName" :before-leave="changeTabs">
        <el-tab-pane :label="$t('customer.customerList.basicInformation')" name="1">
          <el-form ref="customerData" :model="customerData" label-width="150px" label-position="left" inline size="small" >
            <el-form-item :label="$t('customer.collect.companyName')" prop="companyName">
              <el-input v-model="customerData.companyName" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.companyAbbr')" prop="shortName">
              <el-input v-model="customerData.shortName" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.record.clientCode')" prop="customerCode" >
              <el-input v-model="customerData.customerCode" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.record.country')" prop="countryCode" >
              <el-select
                v-model="customerData.countryCode"
                readonly
                filterable
                remote
                :remote-method="getCountryList"
                :loading="loading1"
                class="form-dialog-width"
                style="width: 600px"
              >
                <el-option v-for="(item, index) in countryList" :label="item.searchStr" :value="item.countryCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.address')" prop="registerAddress">
              <el-input v-model="customerData.registerAddress" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.addressOffice')" prop="officeAddress">
              <el-input v-model="customerData.officeAddress" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <!--<el-form-item label="其他地址" prop="otherAddress">-->
              <!--<el-input v-model="customerData.otherAddress" readonly placeholder="其他地址" class="form-dialog-width" style="width: 600px"/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('customer.collect.postalCode')" prop="postalCode">
              <el-input v-model="customerData.postalCode" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.stateCode')" prop="provinceCode">
              <el-input v-model="customerData.provinceCode" readonly class="form-dialog-width" style="width: 237px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.contactOffice1')" prop="officePhone">
              <el-input v-model="customerData.officePhone" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.contactOffice2')" prop="officePhone2">
              <el-input v-model="customerData.officePhone2" readonly class="form-dialog-width" style="width: 237px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.contactMobile1')" prop="mobilePhone">
              <el-input v-model="customerData.mobilePhone" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.contactMobile2')" prop="mobilePhone2">
              <el-input v-model="customerData.mobilePhone2" readonly class="form-dialog-width" style="width: 237px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile1')" prop="facsimileNo" >
              <el-input v-model="customerData.facsimileNo" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.facsimile2')" prop="facsimileNo2">
              <el-input v-model="customerData.facsimileNo2" readonly class="form-dialog-width" style="width: 237px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.email')" prop="emailAddress">
              <el-input v-model="customerData.emailAddress" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.taxId')" prop="taxNo">
              <el-input v-model="customerData.taxNo" readonly class="form-dialog-width" style="width: 600px"/>
            </el-form-item>

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
                style="width: 230px"
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('customer.record.level')" prop="memberBId">
              <el-select v-model="customerData.memberBId" disabled class="form-dialog-width" style="width: 237px">
                <el-option v-for="(item, index) in gradeList" :label="language === 'zh' ? item.cnLevelName : item.enLevelName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.clientStatus')" prop="transaStatus">
              <el-radio-group v-model="customerData.transaStatus" style="width: 600px;">
                <el-radio disabled :label="1">{{$t('customer.collect.complete')}}</el-radio>
                <el-radio disabled :label="0">{{$t('customer.collect.noComplete')}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.clientSource')" prop="customerSource">
              <el-radio-group v-model="customerData.customerSource" style="width: 600px;">
                <el-radio v-for="(item, index) in customerSourceList" :label="item.id" disabled :key="index">{{language === 'zh' ? item.label : item.enLabel}}</el-radio>
                <!--                  <el-radio :label="1">自助开发</el-radio>-->
                <!--                  <el-radio :label="2">询盘</el-radio>-->
                <!--                  <el-radio :label="3">展会</el-radio>-->
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('customer.collect.belongedArea')" prop="ownFieldList">
              <el-checkbox-group v-model="customerData.ownFieldList" style="width: 600px;" disabled>
                <el-checkbox v-for="(item, index) in ownFiledList" :label="item.value" :key="index">{{isZh ? item.label : item.labelEn}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField1')" prop="reservedField1">
              <el-input v-model="customerData.reservedField1" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField2')" prop="reservedField2">
              <el-input v-model="customerData.reservedField2" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField3')" prop="reservedField3">
              <el-input v-model="customerData.reservedField3" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField4')" prop="reservedField4">
              <el-input v-model="customerData.reservedField4" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField5')" prop="reservedField5">
              <el-input v-model="customerData.reservedField5" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField6')" prop="reservedField6">
              <el-input v-model="customerData.reservedField6" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField7')" prop="reservedField7">
              <el-input v-model="customerData.reservedField7" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField8')" prop="reservedField8">
              <el-input v-model="customerData.reservedField8" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField9')" prop="reservedField9">
              <el-input v-model="customerData.reservedField9" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('customer.collect.reservedField10')" prop="reservedField10">
              <el-input v-model="customerData.reservedField10" readonly class="form-dialog-width" style="width: 230px"/>
            </el-form-item>

            <el-form-item :label="$t('system.role.status')" prop="customerStatus">
              <el-select v-model="customerData.customerStatus" disabled class="form-dialog-width">
                <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--沟通记录-->
        <el-tab-pane :label="$t('customer.collect.record')" name="2">
          <!--<div>{{$t('customer.collect.chatRecord')}}</div>-->
          <!--<el-table-->
            <!--style="margin: 10px 0"-->
            <!--border-->
            <!--fit-->
            <!--size="small"-->
            <!--:header-cell-style="{background: '#a7bfee'}">-->
            <!--<el-table-column :label="$t('customer.collect.chatAccount')" prop="bankAccount" show-overflow-tooltip >-->
            <!--</el-table-column>-->

            <!--<el-table-column :label="$t('customer.record.contactNo')" prop="bankName" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column :label="$t('customer.collect.companyName')" prop="bankAddress" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" :label="$t('customer.record.startDate')" prop="reservedPhone" show-overflow-tooltip>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" :label="$t('customer.record.endDate')" prop="accountCurrency" show-overflow-tooltip >-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row.bid)">{{$t('customer.collect.chitchat')}}</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
          <div>{{$t('customer.collect.offline')}}</div>
          <el-table
            style="margin: 10px 0"
            :data="recordList"
            border
            fit
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column :label="$t('customer.record.client')" prop="customerBId" show-overflow-tooltip >
              <template>
                {{customerName}}
              </template>
            </el-table-column>

            <el-table-column :label="$t('customer.record.contact')" prop="contact" show-overflow-tooltip>
            </el-table-column>

            <el-table-column :label="$t('customer.record.communicationTheme')" prop="commTheme" show-overflow-tooltip>
            </el-table-column>

            <el-table-column align="center" :label="$t('customer.record.communicationMode')" prop="commType" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.commType | commTypeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('customer.record.communicationDate')" prop="commTime" show-overflow-tooltip >
              <template slot-scope="scope">
                {{scope.row.commTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="openRecord(scope.row)">{{$t('system.role.view')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="offlineMore(customBid)">{{$t('customer.collect.more')}}</span>
          </div>
        </el-tab-pane>
        <!--询价记录-->
        <el-tab-pane :label="$t('customer.collect.inquire')" name="4">
          <inquiry :custom-bid="customerBId" ref="reViewInquiry">></inquiry>
        </el-tab-pane>
        <!--报价记录-->
        <el-tab-pane :label="$t('customer.collect.quotation')" name="3">
          <quoted :custom-bid="customerBId" ref="reViewQuoted"></quoted>
        </el-tab-pane>
        <!--交易记录-->
        <el-tab-pane :label="$t('customer.collect.deal')" name="5">
          <div class="topBtns">
            <el-button type="primary" size="small" class="export" @click="exportExcel">{{$t('system.role.export')}}</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="orderList"
            border
            fit
            size="mini"
            row-key="id"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column width="120" :label="$t('customer.collect.orderNo')" prop="orderNo" show-overflow-tooltip/>

            <!--<el-table-column width="120" :label="$t('customer.collect.companyAbbr')" prop="buyerShort" show-overflow-tooltip/>-->

            <el-table-column width="120" :label="$t('customer.collect.countryContact')" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.buyerTelephone}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80" :label="$t('customer.collect.quantity')" prop="prodcutSkuCount" />

            <el-table-column align="center" :label="$t('customer.collect.sum')" prop="totalAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.totalAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" :label="$t('customer.collect.creator')" prop="createUserName" show-overflow-tooltip/>

            <el-table-column align="center" width="150" :label="$t('customer.collect.orderTime')" prop="createTime">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="80px" :label="$t('system.role.status')" prop="statusStr">
              <template slot-scope="scope">
                {{scope.row.statusStr | orderStatusFmt}}
              </template>
            </el-table-column>

            <el-table-column header-align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(scope.row.bid)">{{$t('system.role.view')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="$router.push({path:'/order/saleOrder',query:{customerUserBid:customerBID}})">{{$t('customer.collect.more')}}</span>
          </div>
        </el-tab-pane>
        <!--收付款记录-->
        <el-tab-pane :label="$t('customer.collect.account')" name="6">
          <div>{{$t('customer.collect.gathering')}}</div>
          <div class="topBtns">
            <el-button type="primary" size="small" class="export" @click="exportExcel">{{$t('system.role.export')}}</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="gatheringList"
            border
            fit
            size="mini"
            row-key="id"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <!--<el-table-column label="支付编号" prop="purchaseNo" show-overflow-tooltip/>-->
            <el-table-column :label="$t('customer.collect.orderNo')" prop="orderNo" show-overflow-tooltip/>

            <!--<el-table-column :label="$t('customer.collect.companyAbbr')" prop="buyerShort" show-overflow-tooltip/>-->

            <el-table-column align="center" :label="$t('customer.collect.curency')" width="100" prop="orderCurrency" show-overflow-tooltip/>
            <el-table-column align="center" :label="$t('customer.collect.sum')" prop="netTotalAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.netTotalAmount | moneyFmt}}
              </template>
            </el-table-column>
            <el-table-column align="center" width="170" :label="$t('customer.collect.receiving')" prop="orderTime">
              <template slot-scope="scope">
                {{scope.row.orderTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('system.role.operation')" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export table-btn-width" @click="goPayment(scope.row.bid, scope.row.salesOrderBId)">{{$t('system.role.view')}}</el-button>
                <el-button type="primary" size="mini" class="export table-btn-width" @click="downLoadFile(scope.row.bid)">{{isZh ? '下载' : 'Download'}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin:20px;text-align:right;cursor:pointer">
            <span @click="gatheringMore(customBid, 2)">{{$t('customer.collect.more')}}</span>
          </div>
          <!--<div>{{$t('customer.collect.payment')}}</div>-->
          <!--<div class="topBtns">-->
            <!--<el-button type="primary" size="small" class="export" @click="exportExcel">{{$t('system.role.export')}}</el-button>-->
          <!--</div>-->
          <!--<el-table-->
            <!--v-loading="listLoading"-->
            <!--:data="paymentList"-->
            <!--border-->
            <!--fit-->
            <!--size="mini"-->
            <!--:header-cell-style="{background: '#a7bfee'}"-->
            <!--@selection-change="getSelect">-->
            <!--<el-table-column-->
              <!--align="center"-->
              <!--type="selection"-->
              <!--width="55">-->
            <!--</el-table-column>-->

            <!--<el-table-column :label="$t('customer.collect.orderNo')" prop="orderNo" show-overflow-tooltip/>-->

            <!--<el-table-column :label="$t('customer.collect.companyAbbr')" prop="buyerShort" show-overflow-tooltip/>-->

            <!--<el-table-column align="center" :label="$t('customer.collect.sum')" prop="collectionAmount" show-overflow-tooltip>-->
              <!--<template slot-scope="scope">-->
                <!--{{scope.row.collectionAmount | moneyFmt}}-->
              <!--</template>-->
            <!--</el-table-column>-->

            <!--<el-table-column align="center" width="100" :label="$t('customer.collect.curency')" prop="collectionCurrency" show-overflow-tooltip/>-->

            <!--<el-table-column align="center" width="170" :label="$t('customer.collect.receiving')" prop="collectionTime">-->
              <!--<template slot-scope="scope">-->
                <!--{{scope.row.collectionTime | timeFmt}}-->
              <!--</template>-->
            <!--</el-table-column>-->

            <!--&lt;!&ndash;<el-table-column align="center" width="100" label="状态" prop="orderStatus">&ndash;&gt;-->
            <!--&lt;!&ndash;<template slot-scope="{row}">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-tag :type="(row.orderStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.orderStatus |&ndash;&gt;-->
            <!--&lt;!&ndash;customStatusFmt}}&ndash;&gt;-->
            <!--&lt;!&ndash;</el-tag>&ndash;&gt;-->
            <!--&lt;!&ndash;</template>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->

            <!--<el-table-column align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">-->
              <!--<template slot-scope="scope">-->
                <!--<el-button type="primary" size="mini" class="export table-btn-width" @click="goGathering(scope.row.bid)">{{$t('system.role.view')}}</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
          <!--<div style="margin:20px;text-align:right;cursor:pointer">-->
            <!--<span @click="paymentMore(customBid)">{{$t('customer.collect.more')}}</span>-->
          <!--</div>-->
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">{{isZh ? '返回' : 'Close'}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleDetail" :title="$t('customer.record.detailCommunication')" center width="950px">
      <el-form ref="addCompany" :model="adsPosition" label-width="100px" label-position="right" size="small" >
        <el-form-item :label="$t('customer.record.client')" prop="customerBId">
          <el-select v-model="adsPosition.customerBId" clearable style="width: 330px" disabled>
            <el-option v-for="(item, index) in clientList" :label="item.customerName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item :label="$t('customer.record.contact')" prop="contact">
          <el-input v-model="adsPosition.contact" clearable style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationTheme')" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.participant')" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationDate')" prop="commTime">
          <el-date-picker
            disabled
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationPlace')" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationMode')" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 330px" disabled>
            <el-radio :label="1">{{$t('customer.record.instant')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.mail')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.telephone')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.interview')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.communicationContent')" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commRemarks" style="width: 773px;pointer-events:none"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.evaluate')" prop="commSituation">
          <el-radio-group v-model="adsPosition.commSituation" style="width: 500px" disabled>
            <el-radio :label="1">{{$t('customer.record.veryGood')}}</el-radio>
            <el-radio :label="2">{{$t('customer.record.good')}}</el-radio>
            <el-radio :label="3">{{$t('customer.record.ordinary')}}</el-radio>
            <el-radio :label="4">{{$t('customer.record.bad')}}</el-radio>
            <el-radio :label="5">{{$t('customer.record.veryBad')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('customer.record.actionPlan')" prop="commPlan">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commPlan" style="width: 773px;pointer-events:none"/>
        </el-form-item>
        <el-form-item :label="$t('customer.record.uplode')">
          <el-upload
            disabled
            class="upload-demo"
            :headers="upLoadHeaders"
            :action="uploadActionUrl"
          >
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="filesList"
        border
        fit
        style="margin: 10px 0"
        size="small">
        <el-table-column :label="$t('customer.record.fileName')" prop="filesName">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisibleDetail=false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!--沟通记录-->
    <el-dialog :visible.sync="detailModal" :title="$t('customer.record.detailCommunication')" center width="1000px" @closed="clearData">
      <el-form label-width="90px" inline size="small" v-model="dialogPostData">
        <div>
          <el-form-item :label="$t('customer.record.contact')">
            <el-input v-model.trim="dialogPostData.contact" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.communicationMode')" prop="commType">
            <el-radio-group v-model="dialogPostData.commType" style="width: 500px">
              <el-radio >{{isZh ? '全部' : 'All'}}</el-radio>
              <el-radio :label="1">{{$t('customer.record.instant')}}</el-radio>
              <el-radio :label="2">{{$t('customer.record.mail')}}</el-radio>
              <el-radio :label="3">{{$t('customer.record.telephone')}}</el-radio>
              <el-radio :label="4">{{$t('customer.record.interview')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('customer.record.communicationTheme')">
            <el-input v-model.trim="dialogPostData.commTheme" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('customer.record.communicationDate')">
            <el-date-picker
              v-model="searchTime"
              type="daterange"
              range-separator="~"
              :start-placeholder="$t('order.sale.sDate')"
              :end-placeholder="$t('order.sale.eDate')"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchRecord">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!--<div class="topBtns">-->
        <!--<el-button type="primary" size="small" @click="openDialog('add',dialogPostData)">{{$t('system.role.add')}}</el-button>-->
        <!--<el-button type="danger" size="small" @click="deleteListByIds">{{$t('system.role.delete')}}</el-button>-->
        <!--<el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>-->
      <!--</div>-->
      <el-table
        :data="dialogDataList"
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
        <!--<el-table-column :label="$t('customer.record.client')" show-overflow-tooltip >-->
          <!--<template>-->
            <!--&lt;!&ndash;{{ customerNameNum }}&ndash;&gt;-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column :label="$t('customer.record.contact')" prop="contact" show-overflow-tooltip />
        <el-table-column :label="$t('customer.record.communicationTheme')" prop="commTheme" show-overflow-tooltip/>
        <el-table-column align="center" :label="$t('customer.record.communicationMode')" prop="commType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.commType | commTypeFmt(language)}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('customer.record.communicationDate')" prop="createTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.createTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('system.role.operation')" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export table-btn-width" @click="openRecord(scope.row)">{{$t('system.role.view')}}</el-button>
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit',scope.row)">{{$t('system.userManage.editUser')}}</el-button>-->
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑</el-button>-->
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="addCustomerRecord(scope.row.bid,scope.row.customerName)">沟通记录</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="dialogPostData.total" :page.sync="dialogPostData.pageNum" :limit.sync="dialogPostData.pageSize" @pagination="getDialogDataList" ></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pagephPaymentRecord } from '@/api/finance'
import {
  listCustomerInfo,
  // saveCustomerInfo,
  // updateCustomerInfo,
  getCustomerInfoByBId,
  listSort,
  exportCustomer,
  communicaList,
  listCustomerCommunicationApi,
  listCustomerInfoContactApi
} from '@/api/customer';
import { listMemberLevel } from '@/api/member'
import { getSaleOrderList, downloadProofData } from '@/api/order'
import { uploadActionUrl } from '@/api/common';
import { selectCountryListApi, selectgetDictionaryBykeyApi } from '@/api/system'
import { getClientUserList, getAdminUserList, selectUserListAllApi
} from '@/api/user'
import { parseTime, deepClone } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import inquiry from './inquiry'
import quoted from './quoted'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Pagination,
    inquiry,
    quoted,
    Tinymce
  },
  mixins: [moneyFmt],
  data() {
    return {
      searchTime: [],
      dialogPostData: {
        contact: '',
        commType: '',
        commTheme: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      dialogDataList: [],
      clientList: [],
      filesList: [],
      customerBID: '',
      gatheringList: [],
      financeList: [],
      customBid: '',
      customerBId: '',
      customerName: '',
      paymentList: [],
      collectionList: [],
      orderList: [],
      getOrderDataList: [],
      recordList: [],
      communicationList: [],
      currencyCodeList: [],
      uploadActionUrl,
      activeName: '1',
      detailModal: false,
      dialogVisibleDetail: false,
      listLoading: true,
      confirmLoading: false,
      editVisible: false,
      detailVisible: false,
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
      areaList: [
        {
          label: 'All',
          labelZh: '全部',
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
      controlTowerList: [],
      spt: {
        paymentMethod: '',
        shipmentTypeArr: [],
        shipmentType: '',
        paymentType: '',
        sendPortBId: ''
      },
      scplist: [],
      sclist: [],
      sslist: [],
      categoryList: [],
      linkForm: {
        firstName: '',
        lastName: '',
        emailAddress: '',
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
        userType: 1,
        countryCode: '',
        preferedLanguageStr: []
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
      userListPrams: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      selectLinkPeople: [],
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
      // reviewForm: {
      //   idlist: '',
      //   customerStatus: 0
      // },
      languageList: [
        {
          id: '1',
          label: '英语'
        },
        {
          id: '2',
          label: '简体中文'
        },
        {
          id: '3',
          label: '繁体中文'
        }
      ],
      languageList1: [],
      ownFiledList: [
        {
          id: '1',
          label: 'IVD',
          enLabel: 'IVD'
        },
        {
          id: '2',
          label: '消耗品',
          enLabel: 'Consumable Items'
        },
        {
          id: '3',
          label: '实验装置',
          enLabel: 'Experiment Equipment'
        },
        {
          id: '4',
          label: '护理与监测',
          enLabel: 'Nursing&Monitoring'
        }
      ],
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
      statusList: [
        {
          id: 1,
          label: '有效'
        },
        {
          id: 2,
          label: '无效'
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
      customerStatus: [],
      adsPosition: {
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: ""
      },
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
    this.getSortList();
    this.getUserAccountList();
    this.getCountryAllList();
    this.getOwnFieldList()
  },
  methods: {
    clearData() {
      this.dialogPostData.commTheme = "";
      this.dialogPostData.contact = "";
      this.dialogPostData.commType = "";
      this.dialogPostData.startTime = "";
      this.dialogPostData.endTime = ""
    },
    downLoadFile(id) {
      let salesCollectionRecord = {
        salesOrderBId: id
      };
      downloadProofData(salesCollectionRecord).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: res.headers['content-type'] });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'customer.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // downLoadFile(id) {
    //   let salesCollectionRecord = {
    //     salesOrderBId: id
    //   };
    //   downloadProofData(salesCollectionRecord).then(function(res){
    //     var blob = new Blob([res.data], { type: res.headers['content-type']});
    //     var downloadElement = document.createElement('a');
    //     var href = window.URL.createObjectURL(blob); //创建下载的链接
    //     downloadElement.href = href;
    //     downloadElement.download = 'xxx.zip'; //下载后文件名
    //     document.body.appendChild(downloadElement);
    //     downloadElement.click(); //点击下载
    //     document.body.removeChild(downloadElement); //下载完成移除元素
    //     window.URL.revokeObjectURL(href); //释放掉blob对象
    //   }).catch(function(){
    //   })
    // },
    getSearchTime(date) {
      if (date && date.length) {
        this.dialogPostData.startTime = date[0];
        this.dialogPostData.endTime = date[1]
      } else {
        this.dialogPostData.startTime = '';
        this.dialogPostData.endTime = ''
      }
    },
    goGathering(id) {
      this.$router.push({
        path: '/settlementFinance/sale/editPayRecord',
        query: {
          id
        }
      });
    },
    goPayment(id, salesOrderBId) {
      this.$router.push({
        path: '/settlementFinance/sale/editPayRecord',
        query: {
          id,
          salesOrderBId
        }
      });
    },
    gatheringMore(customerUserBid, apiType) {
      this.$router.push({
        path: '/settlementFinance/sale/paymentProof',
        query: {
          customerUserBid,
          apiType
        }
      })
    },
    paymentMore(customerBId) {
      this.$router.push({
        path: '/settlementFinance/payment/purchaseOrder',
        query: {
          customerBId
        }
      })
    },
    goRouter(id) {
      this.$router.push({
        path: '/order/sale/saleOrderDetail',
        query: {
          id
        }
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
    searchRecord() {
      this.dialogPostData.customerBId = this.customBid;
      this.getDialogDataList(this.dialogPostData)
    },
    offlineMore(bid) {
      this.dialogPostData.customerBId = bid;
      this.getDialogDataList(this.dialogPostData);
      this.detailModal = true;
    },
    getDialogDataList(obj) {
      if (obj) {
        for (let key in this.dialogPostData) {
          if (this.dialogPostData[key]) {
            obj[key] = this.dialogPostData[key]
          }
        }
      }
      listCustomerCommunicationApi(obj).then(res => {
        this.dialogDataList = res.data.list;
        // this.dialogPostData = res.data.list[0]
        this.dialogPostData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 交易记录
    getOrderNumList(bid) {
      let obj = {
        customerUserBid: bid
      };
      getSaleOrderList(obj).then(res => {
        this.orderList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 收款记录
    getGathering(bid) {
      getSaleOrderList({
        customerUserBid: bid,
        pageNum: 1,
        pageSize: 5,
        apiType: 2
      }).then(res => {
        this.gatheringList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 付款记录
    getPaymentList(bid) {
      let obj = {
        customerBId: bid,
        pageNum: 1,
        pageSize: 5
      };
      pagephPaymentRecord(obj).then(res => {
        this.paymentList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    openRecord(row) {
      this.dialogVisibleDetail = true
      this.adsPosition = deepClone(row);
      this.filesList = row.filesList;
      listCustomerInfoContactApi({ pageNum: 1, pageSize: 10 }).then(res => {
        this.clientList = res.data
      })
    },
    // addCustomerRecord(id, customerName) {
    //   this.$router.push({
    //     query: {
    //       id, customerName
    //     },
    //     path: '/customer/communicationRecord'
    //   })
    // },
    clearDialog() {
      this.$refs['customerData'].resetFields();
      this.customerData.bid = '';
      this.customerData.ownField = '';
      this.customerData.deliveryPort = '';
      this.customerData.ownFielList = [];
      this.customerData.commLanguageList = [];
      // this.customerData = [];
    },
    changeTabs(name) {
      switch (Number(name)) {
        case 2: this.getRecord(this.customerBID); break;
        case 5: this.getOrderNumList(this.customerBID); break;
        case 6: this.getPaymentList(this.customerBID)
          this.getGathering(this.customerBID); break;
        default: break;
      }
    },
    // 弹窗类别转化字符串
    getParentId(arr) {
      if (arr.length) {
        this.customerData.custSortBId = arr.join(',')
      } else {
        this.customerData.custSortBId = ''
      }
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
        return e.id !== val
      });
      if (this.linkForm.preferedLanguageStr.includes(val)) {
        this.linkForm.preferedLanguageStr = this.linkForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    // 常用语言转为字符
    getcommLanguage1(arr) {
      if (arr.length) {
        this.linkForm.preferedLanguage = arr.join(',')
      } else {
        this.linkForm.preferedLanguage = ''
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
    // 所属领域转为字符
    getownField(arr) {
      if (arr.length) {
        this.customerData.ownFieldString = arr.join(',')
      } else {
        this.customerData.ownFieldString = ''
      }
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
    checkAll1(flag) {
      this.categoryList.forEach(e => {
        e.check = flag
      })
    },
    checkAll2(flag) {
      this.categoryList.forEach(e => {
        e.check2 = flag
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
      listSort({ pageNum: 1, pageSize: 999 }).then(res => {
        this.sortList = res.data.list || []
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
    // 打开详情弹窗
    openDetail(row) {
      let id = row.bid;
      this.customerBID = row.bid;
      this.customBid = row.bid;
      this.customerName = row.customerName;
      this.activeName = '1';
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.reViewQuoted.getDataList();
        this.$refs.reViewInquiry.getDataList()
      });
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
        if (res.data.commLanguage) {
          this.customerData.commLanguageList = this.customerData.commLanguage.split(',');
        } else {
          this.customerData.commLanguageList = []
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
      communicaList({ Bid: id })
        .then(res => {
        }).catch(err => {
          this.$message({ message: err.message });
        })
      // }
    },
    //  沟通记录
    getRecord(id) {
      listCustomerCommunicationApi({
        customerBId: id,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        this.recordList = res.data.list
      })
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
      this.userListPrams.pageIndex = 1;
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
    singleSelectUser(selects) {
      this.selectLinkPeople = selects;
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
    arrSplice(arr, index) {
      arr.splice(index, 1)
    },
    // 把多选框选的值由数组转换为字符串
    getCheckBoxVal(arr) {
      this.spt.shipmentType = arr.join(',')
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
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        // return parseTime(val, '{y}-{m}-{d}')
        return parseTime(val)
      }
    },
    commTypeFmt(val, language) {
      switch (val) {
        // 沟通方式(1-即时通讯 ,  2-邮件 , 3-电话 , 4-见面)
        case 1: return language === 'zh' ? '即时通讯' : 'Instant';
        case 2: return language === 'zh' ? '邮件' : 'Mail';
        case 3: return language === 'zh' ? '电话' : 'Telephone';
        case 4: return language === 'zh' ? '拜访' : 'Interview';
        default:
          return '不存在';
      }
    },
    orderStatusFmt: function (val) {
      let statusName = '';
      if (val === 0) {
        statusName = '作废';
      } else if (val === 1) {
        statusName = '编辑中';
      } else if (val === 2) {
        statusName = '审核中';
      } else if (val === 3) {
        statusName = '审核驳回';
      } else if (val === 4) {
        statusName = '待确认';
      } else if (val === 5) {
        statusName = '已确认';
      }
      return statusName;
    }
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
      .export {
        background: #42b983;
        border: #42b983;
      }
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
</style>
