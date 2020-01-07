<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item :label="$t('member.activity.activityName')">
            <el-input v-model.trim="postData.name" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.status" clearable style="width: 150px" :placeholder="$t('system.role.status')">
              <!--<el-option-->
              <!--v-for="(item, index) in areaList"-->
              <!--:label="item.label"-->
              <!--:value="item.id"-->
              <!--:key="index"-->
              <!--&gt;</el-option>-->
              <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="$t('member.activity.levelTime')">
          <el-date-picker
            v-model="memberActivityStart"
            type="daterange"
            align="right"
            unlink-panels
            clearable
            range-separator="~"
            :start-placeholder="$t('member.activity.start')"
            :end-placeholder="$t('member.activity.end')"
            style="width: 380px"
            :picker-options="pickerOptions"
            @change="getSearchTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="padding-left: 10px">
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
        <!--<el-form-item label="有下属时不允许删除" label-width="500px"></el-form-item>-->
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" @click="putaway">{{$t('member.activity.onshelf')}}</el-button>
      <el-button type="primary" size="small" @click="soldOut">{{$t('member.activity.offshelf')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportExcelByEasypoiFun">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column
        :label="$t('member.activity.activityName')"
        :prop="language === 'zh' ? 'cnMemberActivityName' : 'enMemberActivityName'"
        show-overflow-tooltip />
      <!--<el-table-column :label="$t('member.activity.enactivityName')" prop="enMemberActivityName" show-overflow-tooltip />-->
      <el-table-column :label="$t('member.activity.start')" prop="memberActivityStart" width="110px" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.memberActivityStart | timeFmt}}
      </template>
      </el-table-column>
      <el-table-column :label="$t('member.activity.end')" prop="memberActivityEnd" width="110px" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.memberActivityEnd | timeFmt}}
      </template>
      </el-table-column>
      <el-table-column align="center" width="90" :label="$t('member.activity.participantNum')" show-overflow-tooltip prop="acountNum"/>
      <el-table-column align="center" width="80" :label="$t('system.role.modifier')" prop="updateUserName" show-overflow-tooltip/>
      <el-table-column align="center" width="110" :label="$t('system.userManage.editTime')" show-overflow-tooltip prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.status')" width="80px" prop="memberActivityStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.memberActivityStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.memberActivityStatus === 1 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" :label="$t('system.role.operation')" :width="isZh ? '190px' : '220px'" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('system.role.view')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            class="export"
            @click="overParticipate(row)"
          >
            {{$t('member.activity.participant')}}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="openDialog('edit', row)"
          >{{$t('system.userManage.editUser')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="postData.total"
      :page.sync="postData.pageNum"
      :limit.sync="postData.pageSize"
      @pagination="getDataList"
    ></Pagination>
      <!--编辑-->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? $t('member.activity.addMembership'):$t('member.activity.editMembership')"
      center
      width="700px"
      @closed="clearForm"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="135px"
        class="demo-ruleForm"
        :rules="rules"
        inline
        label-position="left"
        v-if="dialogVisible"
      >
        <el-form-item :label="$t('member.activity.cnactivityName')" prop="cnMemberActivityName">
          <el-input v-model="ruleForm.cnMemberActivityName" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enactivityName')" prop="enMemberActivityName">
          <el-input v-model="ruleForm.enMemberActivityName" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.start')" prop="memberActivityStart">
          <el-date-picker
            :picker-options="pickerOptionsStart"
            style="width: 175px"
            v-model="ruleForm.memberActivityStart"
            type="date"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.endDate')" prop="memberActivityEnd">
          <el-date-picker
            :picker-options="pickerOptionsEnd"
            style="width: 175px"
            v-model="ruleForm.memberActivityEnd"
            type="date"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
          <!--<el-date-picker-->
            <!--v-model="conultDate"-->
            <!--type="daterange"-->
            <!--range-separator="~"-->
            <!--:start-placeholder="$t('consult.consulting.startDate')"-->
            <!--:end-placeholder="$t('consult.consulting.endDate')"-->
            <!--@change="changeTime"-->
            <!--:picker-options="pickerOptions"-->
          <!--&gt;</el-date-picker>-->
        <el-form-item :label="$t('member.activity.cnlocation')" prop="cnMemberActivityAddress">
          <el-input v-model="ruleForm.cnMemberActivityAddress" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enlocation')" prop="enMemberActivityAddress">
          <el-input v-model="ruleForm.enMemberActivityAddress" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.cnremark')" prop="cnRemark">
          <el-input
            type="textarea"
            style="width: 500px"
            show-word-limit
            v-model="ruleForm.cnRemark"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enremark')" prop="enRemark">
          <el-input
            type="textarea"
            style="width: 500px"
            show-word-limit
            v-model="ruleForm.enRemark"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.cndetail')" prop="cnMemberActivityDetail">
          <!--<el-input-->
            <!--type="textarea"-->
            <!--style="width: 500px"-->
            <!--show-word-limit-->
            <!--v-model="ruleForm.cnMemberActivityDetail"-->
          <!--&gt;-->
          <!--</el-input>-->
          <tinymce ref="cnMemberActivityDetail" v-model="ruleForm.cnMemberActivityDetail"></tinymce>
        </el-form-item>
        <el-form-item :label="$t('member.activity.endetail')" prop="enMemberActivityDetail">
          <!--<el-input-->
            <!--type="textarea"-->
            <!--style="width: 500px"-->
            <!--show-word-limit-->
            <!--v-model="ruleForm.enMemberActivityDetail">-->
          <!--</el-input>-->
          <!--<div class="avatar" style="padding-top: 5px">-->
            <!--<el-upload-->
              <!--class="avatar-uploader"-->
              <!--:headers="upLoadHeaders"-->
              <!--:action="uploadActionUrl"-->
              <!--:show-file-list="false"-->
              <!--:on-success="handleAvatarSuccess"-->
              <!--:before-upload="beforeAvatarUpload">-->
              <!--<img v-if="ruleForm.memberActivityPath" :src="fullUrl(ruleForm.memberActivityPath)" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
            <!--<div slot="tip" class="el-upload__tip">{{$t('member.activity.description')}}</div>-->
            <!--&lt;!&ndash;<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>&ndash;&gt;-->
          <!--</div>-->
          <tinymce ref="enMemberActivityDetail" v-model="ruleForm.enMemberActivityDetail"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="addLoading"
          @click="addMethod('ruleForm')"
        >{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog('ruleForm')">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="overDetails" :title="$t('member.activity.membership')" center width="700px" @closed="clearForm">
      <el-form
        v-model="detailForm"
        status-icon
        ref="ruleForm"
        label-width="135px"
        v-if="overDetails"
        inline
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item :label="$t('member.activity.cnactivityName')" prop="cnMemberActivityName">
          <el-input v-model="detailForm.cnMemberActivityName" readonly style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enactivityName')" prop="enMemberActivityName">
          <el-input v-model="detailForm.enMemberActivityName" readonly style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.start')" >
        <el-date-picker
          style="width: 175px"
          v-model="detailForm.memberActivityStart"
          type="date"
          readonly
          :placeholder="$t('member.activity.selectDate')">
        </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.end')" >
          <el-date-picker
            style="width: 175px"
            v-model="detailForm.memberActivityEnd"
            type="date"
            readonly
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.cnlocation')" prop="cnMemberActivityAddress">
          <el-input v-model="detailForm.cnMemberActivityAddress" readonly style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enlocation')" prop="enMemberActivityAddress">
          <el-input v-model="detailForm.enMemberActivityAddress" readonly style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.cnremark')" prop="cnRemark">
          <el-input
            readonly
            type="textarea"
            style="width: 500px"
            show-word-limit
            v-model="detailForm.cnRemark"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enremark')" prop="enRemark">
          <el-input
            readonly
            type="textarea"
            style="width: 500px"
            show-word-limit
            v-model="detailForm.enRemark"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.cndetail')" prop="cnMemberActivityDetail">
          <!--<el-input-->
            <!--readonly-->
            <!--type="textarea"-->
            <!--style="width: 500px"-->
            <!--show-word-limit-->
            <!--v-model="detailForm.cnMemberActivityDetail"-->
          <!--&gt;-->
          <!--</el-input>-->
          <tinymce ref="cnMemberActivityDetail" v-model="ruleForm.cnMemberActivityDetail"></tinymce>
        </el-form-item>
        <el-form-item :label="$t('member.activity.endetail')" prop="enMemberActivityDetail">
          <!--<el-input-->
            <!--readonly-->
            <!--type="textarea"-->
            <!--style="width: 500px"-->
            <!--show-word-limit-->
            <!--v-model="detailForm.enMemberActivityDetail"-->
          <!--&gt;-->
          <!--</el-input>-->
          <!--<div class="avatar" style="padding-top: 5px">-->
            <!--<el-upload-->
              <!--disabled-->
              <!--class="avatar-uploader"-->
              <!--:headers="upLoadHeaders"-->
              <!--:action="uploadActionUrl"-->
              <!--:show-file-list="false"-->
              <!--:on-success="handleAvatarSuccess"-->
              <!--:before-upload="beforeAvatarUpload">-->
              <!--<img v-if="detailForm.memberActivityPath" :src="fullUrl(detailForm.memberActivityPath)" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
            <!--<div slot="tip" class="el-upload__tip">{{$t('member.activity.description')}}</div>-->
            <!--&lt;!&ndash;<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>&ndash;&gt;-->
          <!--</div>-->
          <tinymce ref="enMemberActivityDetail" v-model="ruleForm.enMemberActivityDetail"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('member.rights.close')}}</el-button>
      </div>
    </el-dialog>
    <!--参与-->
    <el-dialog :visible.sync="participate" :title="$t('member.activity.participantList')" center width="800px">
      <el-form
        v-model="participateForm"
        status-icon
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
        label-position="left"
      >
        <el-form-item :label="$t('member.activity.cnactivityName')" prop="cnMemberActivityName" v-if="language === 'zh' ? true : false">
          <el-input v-model="participateForm.cnMemberActivityName" readonly style="width:590px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.enactivityName')" prop="enMemberActivityName" v-if="language === 'zh' ? false : true">
          <el-input v-model="participateForm.enMemberActivityName" readonly style="width:590px"></el-input>
        </el-form-item>
        <!--<el-form-item :label="$t('member.activity.start')" >-->
          <!--<el-date-picker-->
            <!--style="width:300px"-->
            <!--v-model="participateForm.memberActivityStart"-->
            <!--type="date"-->
            <!--readonly-->
            <!--:placeholder="$t('member.activity.selectDate')">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('member.activity.end')" >-->
          <!--<el-date-picker-->
            <!--style="width:300px"-->
            <!--v-model="participateForm.memberActivityEnd"-->
            <!--type="date"-->
            <!--readonly-->
            <!--:placeholder="$t('member.activity.selectDate')">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('member.activity.cnlocation')" prop="cnMemberActivityAddress">-->
          <!--<el-input v-model="participateForm.cnMemberActivityAddress" readonly style="width:300px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="$t('member.activity.enlocation')" prop="enMemberActivityAddress">-->
          <!--<el-input v-model="participateForm.enMemberActivityAddress" readonly style="width:300px"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('member.activity.participantList')" >
          <div class="topBtns">
          <el-button type="primary" size="small" class="export" @click="exportExcel">{{$t('system.role.export')}}</el-button>
          </div>
        </el-form-item>
          <el-table
            v-loading="listLoading"
            :data="activityList"
            :element-loading-text="$t('system.userManage.lodding')"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">
            <el-table-column
              type="index"
              :label="$t('system.business.index')"
              width="50">
            </el-table-column>
            <el-table-column align="center" :label="$t('system.role.account')" prop="userAccount" show-overflow-tooltip />
            <el-table-column align="center" :label="$t('system.role.name')" prop="userName" show-overflow-tooltip />
            <el-table-column align="center" :label="$t('system.role.contact')" show-overflow-tooltip prop="mobilePhone" />
            <el-table-column align="center" :label="$t('system.userManage.company')" show-overflow-tooltip prop="companyName" />
            <el-table-column align="center" :label="$t('member.activity.registration')" show-overflow-tooltip prop="createTime" >
              <template slot-scope="scope">{{scope.row.createTime | timeFmt}}</template>
            </el-table-column>
          </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import Tinymce from "@/components/Tinymce";
import {
  pagephMemberActivity,
  saveMemberActivity,
  deleteByIds,
  updateMemberActivity,
  updateBatchByIds,
  detailMemberActivity,
  getMembgerActivityMembers,
  activityExportEasypoi,
  exportActivityEnrollEasypoi
} from "@/api/member";
export default {
  components: {
    Pagination,
    Tinymce
  },
  data() {
    return {
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      conultDate: [],
      selectList: [],
      activityBId: "",
      activityList: [],
      textarea: '',
      uploadActionUrl,
      memberActivityStart: "",
      // 详情
      detailForm: {
        enMemberActivityAddress: "",
        cnMemberActivityAddress: "",
        cnMemberActivityDetail: "",
        enMemberActivityDetail: "",
        cnMemberActivityName: "",
        enMemberActivityName: "",
        memberActivityStart: "",
        memberActivityEnd: "",
        memberActivityPath: "",
        cnRemark: "",
        enRemark: ""
      },
      // 参与
      participateForm: {
        cnRemark: "",
        enRemark: "",
        enMemberActivityAddress: "",
        cnMemberActivityAddress: "",
        cnMemberActivityName: "",
        enMemberActivityName: "",
        memberActivityStart: "",
        memberActivityEnd: ""
      },
      // 新增
      ruleForm: {
        enMemberActivityAddress: "",
        cnMemberActivityAddress: "",
        cnMemberActivityDetail: "",
        enMemberActivityDetail: "",
        cnMemberActivityName: "",
        enMemberActivityName: "",
        memberActivityStart: "",
        memberActivityEnd: "",
        memberActivityPath: "",
        cnRemark: "",
        enRemark: ""
      },
      participate: false,
      overDetails: false,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      dialogType: "",
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: "",
        end: "",
        start: "",
        status: "",
        cnMemberActivityName: "",
        enMemberActivityName: "",
        memberActivityEnd: "",
        memberActivityStart: "",
        memberActivityStatus: ""
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
      rules: {
        cnMemberActivityName: [
          { required: true, message: this.$t('member.activity.memberName'), trigger: 'blur' }
        ],
        enMemberActivityName: [
          { required: true, message: this.$t('member.activity.memberName'), trigger: 'blur' }
        ],
        enMemberActivityAddress: [
          { required: true, message: this.$t('member.activity.memberAddress'), trigger: 'blur' }
        ],
        cnMemberActivityAddress: [
          { required: true, message: this.$t('member.activity.memberAddress'), trigger: 'blur' }
        ],
        memberActivityStart: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        memberActivityEnd: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        cnRemark: [
          { required: true, message: this.$t('member.activity.memberRemark'), trigger: 'blur' }
        ],
        enRemark: [
          { required: true, message: this.$t('member.activity.memberRemark'), trigger: 'blur' }
        ]
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.ruleForm.memberActivityEnd) {
            return time.getTime() > this.ruleForm.memberActivityEnd;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.ruleForm.memberActivityStart) {
            return time.getTime() < this.ruleForm.memberActivityStart
          }
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  watch: {
    overDetails(val) {
      if (!val) {
        this.$refs['cnMemberActivityDetail'].setContent('');
        this.$refs['enMemberActivityDetail'].setContent('');
      }
    },
    isZh() {
      this.rules = {
        cnMemberActivityName: [
          { required: true, message: this.$t('member.activity.memberName'), trigger: 'blur' }
        ],
        enMemberActivityName: [
          { required: true, message: this.$t('member.activity.memberName'), trigger: 'blur' }
        ],
        enMemberActivityAddress: [
          { required: true, message: this.$t('member.activity.memberAddress'), trigger: 'blur' }
        ],
        cnMemberActivityAddress: [
          { required: true, message: this.$t('member.activity.memberAddress'), trigger: 'blur' }
        ],
        memberActivityStart: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        memberActivityEnd: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        cnRemark: [
          { required: true, message: this.$t('member.activity.memberRemark'), trigger: 'blur' }
        ],
        enRemark: [
          { required: true, message: this.$t('member.activity.memberRemark'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearForm() {
      this.addLoading = false;
      this.ruleForm.enMemberActivityAddress = "";
      this.ruleForm.cnMemberActivityAddress = "";
      this.ruleForm.cnMemberActivityDetail = "";
      this.ruleForm.enMemberActivityDetail = "";
      this.ruleForm.cnMemberActivityName = "";
      this.ruleForm.enMemberActivityName = "";
      this.ruleForm.memberActivityStart = "";
      this.ruleForm.memberActivityEnd = "";
      this.ruleForm.memberActivityPath = "";
      this.ruleForm.cnRemark = "";
      this.ruleForm.enRemark = "";
      this.detailForm.enMemberActivityAddress = "";
      this.detailForm.cnMemberActivityAddress = "";
      this.detailForm.cnMemberActivityDetail = "";
      this.detailForm.enMemberActivityDetail = "";
      this.detailForm.cnMemberActivityName = "";
      this.detailForm.enMemberActivityName = "";
      this.detailForm.memberActivityStart = "";
      this.detailForm.memberActivityEnd = "";
      this.detailForm.memberActivityPath = "";
      this.detailForm.cnRemark = "";
      this.detailForm.enRemark = "";
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.start = date[0];
        this.postData.end = date[1]
      } else {
        this.postData.start = '';
        this.postData.end = ''
      }
    },
    // changeTime(date) {
    //   if (date && date.length) {
    //     this.ruleForm.memberActivityStart = date[0];
    //     this.ruleForm.memberActivityEnd = date[1]
    //   } else {
    //     this.ruleForm.memberActivityStart = '';
    //     this.ruleForm.memberActivityEnd = ''
    //   }
    // },
    putaway() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      }
      this.$confirm(
        this.$t('member.activity.shelves'),
        this.$t("system.userManage.hint"),
        {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.deleteIdsForm = this.selectList
            .map(e => {
              return e.id;
            })
          let ids = []
          ids.push(this.deleteIdsForm)
          let obj = {
            ids: ids[0],
            status: 1
          }
          updateBatchByIds(obj)
            .then(res => {
              if (res.status === 200) {
                this.$message.success(this.$t('member.activity.shelvesSave'));
              }
              this.getDataList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    soldOut() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].memberActivityStatus === 1) {
            this.getTime()
            if (this.selectList[i].memberActivityEnd.split('T')[0] > this.getTime() || this.selectList[i].memberActivityEnd.split('T')[0] === this.getTime()) {
              this.$confirm(
                this.language === 'zh' ? '该活动在有效期内,是否确认下架?' : 'Is the activity confirmed to be off the shelf within the validity period?',
                this.$t("system.userManage.hint"),
                {
                  confirmButtonClass: 'el-button-confirmClass',
                  cancelButtonClass: 'el-button-cancelClass',
                  confirmButtonText: this.$t("system.role.affirm"),
                  cancelButtonText: this.$t("system.role.return"),
                  type: "warning",
                  center: true
                })
                .then(() => {
                  this.deleteIdsForm = this.selectList
                    .map(e => {
                      return e.id;
                    })
                  let ids = []
                  ids.push(this.deleteIdsForm)
                  let obj = {
                    ids: ids[0],
                    status: 0
                  }
                  updateBatchByIds(obj)
                    .then(res => {
                      if (res.status === 200) {
                        this.$message.success(this.$t('member.activity.soldOutSave'));
                      }
                      this.getDataList();
                    })
                    .catch(err => {
                      this.$message.error(err.message);
                    });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: this.$t("system.userManage.cancel")
                  });
                });
            } else {
              this.$confirm(
                this.$t('member.activity.soldOut'),
                this.$t("system.userManage.hint"),
                {
                  confirmButtonClass: 'el-button-confirmClass',
                  cancelButtonClass: 'el-button-cancelClass',
                  confirmButtonText: this.$t("system.role.affirm"),
                  cancelButtonText: this.$t("system.role.return"),
                  type: "warning",
                  center: true
                }
              )
                .then(() => {
                  this.deleteIdsForm = this.selectList
                    .map(e => {
                      return e.id;
                    })
                  let ids = []
                  ids.push(this.deleteIdsForm)
                  let obj = {
                    ids: ids[0],
                    status: 0
                  }
                  updateBatchByIds(obj)
                    .then(res => {
                      if (res.status === 200) {
                        this.$message.success(this.$t('member.activity.soldOutSave'));
                      }
                      this.getDataList();
                    })
                    .catch(err => {
                      this.$message.error(err.message);
                    });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: this.$t("system.userManage.cancel")
                  });
                });
            }
          }
        }
      }
    },
    // 参与
    overParticipate (row) {
      this.participate = true;
      this.activityBId = row.bid;
      detailMemberActivity({ bid: row.bid }).then(res => {
        this.participateForm = res.data || []
      });
      getMembgerActivityMembers({
        activityBId: row.bid,
        pageNum: 1,
        pageSize: 9999
      }).then(res => {
        this.activityList = res.data.list
      })
    },
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      let obj = {
        pageNum: this.postData.pageNum,
        pageSize: this.postData.pageSize,
        total: 0,
        cnMemberActivityName: this.postData.name,
        enMemberActivityName: this.postData.name,
        memberActivityEnd: this.postData.end,
        memberActivityStart: this.postData.start,
        memberActivityStatus: this.postData.status
      };
      pagephMemberActivity(obj)
        .then(res => {
          this.list = res.data.list || [];
          this.postData.total = res.data.total;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    // 关闭详情模块
    detailDialogClos() {
      this.overDetails = false;
    },
    // 详情模块
    detailDialog(row) {
      this.overDetails = true;
      detailMemberActivity({ bid: row.bid }).then(res => {
        this.detailForm = res.data;
        setTimeout(() => {
          this.$refs['cnMemberActivityDetail'].setContent(this.detailForm.cnMemberActivityDetail);
          this.$refs['enMemberActivityDetail'].setContent(this.detailForm.enMemberActivityDetail);
        }, 500)
      })
    },
    // 编辑模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === "edit") {
        detailMemberActivity({ bid: row.bid }).then(res => {
          this.ruleForm = res.data;
        }).catch(err => {
          this.$message.error(err.message);
        })
      } else {
        setTimeout(() => {
          this.$refs['cnMemberActivityDetail'].setContent('');
          this.$refs['enMemberActivityDetail'].setContent('');
        }, 500)
      }
      this.dialogVisible = true;
    },
    closOPenDialog(formName) {
      this.dialogVisible = false;
      this.overDetails = false;
      this.participate = false
      // this.$refs[formName].resetFields()
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLoading = true
          if (this.ruleForm.id) {
            updateMemberActivity(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.addLoading = false
                this.getDataList();
                this.closOPenDialog();
                // this.$refs[formName].resetFields()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            saveMemberActivity(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.addLoading = false
                this.getDataList();
                this.closOPenDialog();
                // this.$refs[formName].resetFields()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          this.$message.error(this.$t("system.userManage.check"));
        }
      });
    },
    getTime() {
      function timeNum(num) {
        if (num < 10) {
          num = '0' + num
        }
        return num;
      }
      let newDate = new Date()
      let Year = newDate.getFullYear();
      let Month = newDate.getMonth() + 1;
      let Time = newDate.getDate();
      let timeDate = timeNum(Year) + '-' + timeNum(Month) + '-' + timeNum(Time)
      return timeDate
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].memberActivityStatus === 1) {
            return this.$message.warning(this.language === 'zh' ? '活动已上架,无法删除' : 'The event is now on the shelves and cannot be removed')
          }
        }
      }
      this.$confirm(
        this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"),
        {
          confirmButtonClass: 'el-button-confirmClass',
          cancelButtonClass: 'el-button-cancelClass',
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.deleteIdsForm = this.selectList
            .map(e => {
              return e.id;
            })
            .join(",");
          let formData = new FormData();
          formData.append("ids", this.deleteIdsForm);
          deleteByIds(formData)
            .then(res => {
              if (res.status === 200) {
                this.$message.success(this.$t("system.userManage.handle"));
              }
              this.getDataList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    handleAvatarSuccess(res, file) {
      this.detailForm.memberActivityPath = res.data.filePath;
      this.ruleForm.memberActivityPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t("system.userManage.uplode1"));
      }
      if (!isLt3M) {
        this.$message.error(this.$t("system.userManage.uplode2"));
      }
      return isJPG && isLt3M;
    },
    // 导出会员活动操作
    exportExcelByEasypoiFun() {
      let obj = {
        pageNum: '',
        pageSize: '',
        cnMemberActivityName: this.postData.cnMemberActivityName,
        enMemberActivityName: this.postData.enMemberActivityName,
        memberActivityEnd: this.postData.memberActivityEnd,
        memberActivityStart: this.postData.memberActivityStart,
        memberActivityStatus: this.postData.memberActivityStatus
      };
      activityExportEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'MembershipActivity.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 导出活动成员操作
    exportExcel() {
      let obj = {
        pageNum: '',
        pageSize: '',
        activityBId: this.activityBId
      };
      exportActivityEnrollEasypoi(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'MembershipActivity.xls');
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
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

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
      border-color: #409eff;
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
