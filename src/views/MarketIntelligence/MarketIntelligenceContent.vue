<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '70px'" inline size="small">
        <el-form-item :label="$t('consult.consulting.title')">
          <el-input v-model.trim="postData.intelligenceTitle" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select
            v-model="postData.intelligencStatus"
            :placeholder="$t('system.role.all')"
            clearable
            style="width: 150px">
            <!--<el-option-->
              <!--v-for="(item, index) in areaList"-->
              <!--:label="item.label"-->
              <!--:value="item.id"-->
              <!--:key="index"-->
            <!--&gt;</el-option>-->
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.inquiryStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('system.role.export')}}</el-button>
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
        :label="$t('consult.consulting.title')"
        prop="intelligenceTitle"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('consult.consulting.category')"
        prop="newsCategoryBIdName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('consult.consulting.medium')"
        prop="intermediary"
        show-overflow-tooltip
        align="center"
        width="80"
      >
        <template slot-scope="scope">{{scope.row.intermediary | intermediaryFmt}}</template>
      </el-table-column>
      <el-table-column
        :label="$t('consult.consulting.alidTermv')"
        prop="startTime"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">{{scope.row.startTime | timeFmt}}~{{scope.row.endTime | timeFmt}}</template>
      </el-table-column>
      <!--<el-table-column-->
        <!--:label="$t('consult.consulting.alidTermv')"-->
        <!--prop="endTime"-->
        <!--show-overflow-tooltip-->
        <!--align="center"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">{{scope.row.endTime | timeFmt}}</template>-->
      <!--</el-table-column>-->
      <el-table-column
        align="center"
        width="100"
        :label="$t('system.role.status')"
        prop="categoryStatus"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.intelligencStatus | typeStstus"
            size="mini"
          >{{ scope.row.intelligencStatus | conultStatus(language)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        :label="$t('system.role.operation')"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            class="export"
            @click="detailDialog(row)"
          >{{$t('system.role.view')}}</el-button>
          <!--<el-button-->
            <!--:type="row.intelligencStatus === 5 ? 'info' : 'danger'"-->
            <!--size="mini"-->
            <!--@click="changeMethod(row)"-->
            <!--:disabled="row.intelligencStatus === 0 ? true : false"-->
          <!--&gt;{{row.intelligencStatus === 5 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>-->
          <el-button
            v-if="row.intelligencStatus === 5"
            type="info"
            size="mini"
            @click="changeMethod(row)"
          >{{ $t('system.role.disable')}}</el-button>
          <el-button
            v-if="row.intelligencStatus === 2 || row.intelligencStatus === 4"
            type="danger"
            size="mini"
            @click="changeMethod(row)"
          >{{$t('system.role.enable')}}</el-button>
          <el-button
            v-if="row.intelligencStatus === 0 || row.intelligencStatus === 3"
            type="primary"
            size="mini"
            @click="openDialog('edit', row)"
          >{{$t('system.userManage.editUser')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
        <!-- 新增编辑 ---------------------------------->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? $t('consult.consulting.addConsulting') : $t('consult.consulting.editConsulting')"
      center
      width="900px"
      @closed="clearData">
      <el-form
        :rules="rules"
        :model="ruleForm"
        status-icon
        v-if="dialogVisible"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm">
        <el-form-item :label="$t('consult.consulting.title')" prop="intelligenceTitle">
          <el-input v-model="ruleForm.intelligenceTitle" :maxlength="30" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.category')" prop="newsCategoryBId">
          <el-select v-model="ruleForm.newsCategoryBId" style="width:300px">
            <el-option
              v-for="(item, index) in categoryList"
              :label="item.categoryName"
              :value="item.bid"
              :disabled="item.categoryStatus === 0"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item :label="$t('consult.consulting.alidTermv')" prop="Date">-->
          <!--<el-date-picker-->
            <!--v-model="conultDate"-->
            <!--type="daterange"-->
            <!--range-separator="~"-->
            <!--:start-placeholder="$t('consult.consulting.startDate')"-->
            <!--:end-placeholder="$t('consult.consulting.endDate')"-->
            <!--@change="getSearchTime"-->
            <!--:picker-options="pickerOptions"-->
          <!--&gt;</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('member.activity.start')" prop="startTime">
          <el-date-picker
            :picker-options="pickerOptionsStart"
            style="width:300px"
            v-model="ruleForm.startTime"
            type="datetime"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.endDate')" prop="endTime">
          <el-date-picker
            :picker-options="pickerOptionsEnd"
            style="width:300px"
            v-model="ruleForm.endTime"
            type="datetime"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.medium')">
          <el-checkbox v-model="ruleForm.checked1" @change="Carousel">PC</el-checkbox>
          <el-checkbox v-model="ruleForm.checked2" @change="interCut">APP</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.playMode')">
          <el-checkbox v-model="ruleForm.carouselFlag">{{$t('consult.consulting.carousel')}}</el-checkbox>
          <el-checkbox v-model="ruleForm.interCutFlag">{{$t('consult.consulting.interstitial')}}</el-checkbox>
        </el-form-item>
        <el-form-item
          :label="$t('system.role.status')"
          v-model="ruleForm.intelligencStatus"
        >{{ruleForm.intelligencStatus | conultStatus(language)}}</el-form-item>
        <el-form-item :label="$t('consult.consulting.headerImage')" prop="HeaderImage">
          <el-tabs type="border-card" value="1" v-model="TabsValue" style="height: 500px;">
            <!--PC-->
            <el-tab-pane label="PC" name="1" :disabled="isPcShow">
              <div>{{$t('consult.consulting.advicePC')}}</div>
              <el-upload
                :headers="upLoadHeaders"
                :disabled="isPcShow"
                class="avatar-uploader"
                :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="PChandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="pcImg.carouselPhotoPath" :src="fullUrl(pcImg.carouselPhotoPath)" class="avatar" >
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-tab-pane>
            <!--APP-->
            <el-tab-pane label="APP" name="2" :disabled="isAppShow">
              <div>{{$t('consult.consulting.adviceAPP')}}</div>
              <el-upload
                :headers="upLoadHeaders"
                :disabled="isAppShow"
                class="avatar-uploader"
                :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="APPhandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="appImg.carouselPhotoPath" :src="fullUrl(appImg.carouselPhotoPath)" class="avatar" >
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <!--富文本----------------------------------->
        <el-form-item :label="$t('consult.consulting.content')" prop="content">
          <el-tabs type="border-card" value="1" v-model="editableTabsValue">
            <!--PC-->
            <el-tab-pane label="PC" name="1" :disabled="isPcShow">
              <tinymce ref="pc" v-model="pcContent.consultContent"></tinymce>
            </el-tab-pane>
            <!--APP-->
            <el-tab-pane label="APP" name="2" :disabled="isAppShow">
              <tinymce ref="app" v-model="appContent.consultContent"></tinymce>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="addLoading"
          @click="addMethod('ruleForm')"
        >{{$t('system.role.seave')}}</el-button>
        <el-button type="primary" size="small" :loading="addLoading" @click="conultSubmit('ruleForm')">{{$t('consult.consulting.submit')}}</el-button>
        <el-button type="danger" size="small" @click="closeOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!--详情---------------------------------------->
    <el-dialog :visible.sync="overDetails" :title="$t('consult.consulting.detailConsulting')" center width="1000px">
      <el-form
        :model="detailForm"
        status-icon
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
        @closed="clearData"
      >
        <el-form-item :label="$t('consult.consulting.title')" prop="intelligenceTitle" >
          <el-input v-model="detailForm.intelligenceTitle" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.category')" prop="status">
          <el-select v-model="detailForm.newsCategoryBId" style="width:300px" disabled>
            <el-option
              v-for="(item, index) in categoryList"
              :label="item.categoryName"
              :value="item.bid"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('member.activity.start')">
          <el-date-picker
            disabled
            :picker-options="pickerOptionsStart"
            style="width:300px"
            v-model="detailForm.startTime"
            type="datetime"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.endDate')">
          <el-date-picker
            disabled
            :picker-options="pickerOptionsEnd"
            style="width:300px"
            v-model="detailForm.endTime"
            type="datetime"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.medium')" v-model="detailForm.intermediary">
          <el-checkbox disabled v-model="detailForm.checked1" @change="Carousel">PC</el-checkbox>
          <el-checkbox disabled v-model="detailForm.checked2" @change="interCut">APP</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('consult.consulting.playMode')">
          <el-checkbox disabled v-model="detailForm.carouselFlag">{{$t('consult.consulting.carousel')}}</el-checkbox>
          <el-checkbox disabled v-model="detailForm.interCutFlag">{{$t('consult.consulting.interstitial')}}</el-checkbox>
        </el-form-item>
        <el-form-item
          :label="$t('system.role.status')"
          v-model="detailForm.intelligencStatus"
        >{{detailForm.intelligencStatus | conultStatus(language)}}</el-form-item>
        <el-form-item :label="$t('consult.consulting.headerImage')" prop="rightName">
          <el-tabs type="border-card" v-model="TabsValue" style="height: 500px;">
            <!--PC-->
            <el-tab-pane label="PC" name="1" :disabled="isPCDetail">
              <el-upload
                disabled
                :headers="upLoadHeaders"
                class="avatar-uploader"
                :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="PChandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="pcImg.carouselPhotoPath" :src="fullUrl(pcImg.carouselPhotoPath)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-tab-pane>
            <!--APP-->
            <el-tab-pane label="APP" name="2" :disabled="isAppDetail">
              <el-upload
                disabled
                :headers="upLoadHeaders"
                class="avatar-uploader"
                :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="APPhandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="appImg.carouselPhotoPath" :src="fullUrl(appImg.carouselPhotoPath)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <!--富文本--------------------------------------->
        <el-form-item :label="$t('consult.consulting.content')">
          <el-tabs type="border-card" v-model="editableTabsValue">
            <el-tab-pane label="PC" name="1" :disabled="isPCDetail" >
              <tinymce ref="pc" v-model="pcContent.consultContent" style="pointer-events: none;" />
              <!--<el-input v-model="pcContent.consultContent" style="width:300px" readonly></el-input>-->
            </el-tab-pane>
            <!--APP-->
            <el-tab-pane label="APP" name="2" :disabled="isAppDetail">
              <tinymce ref="app" v-model="appContent.consultContent" style="pointer-events: none;" />
              <!--<el-input v-model="appContent.consultContent" style="width:300px" readonly></el-input>-->
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <!--审核记录-->
      <div class="approval-history">
        <div class="history-title">{{$t('consult.consulting.auditRecord')}}</div>
        <el-table
          :data="approvalList"
          border
          fit
          size="small"
          max-height="200"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column
            align="center"
            type="index"
            width="55">
          </el-table-column>
          <el-table-column align="center" width="150" :label="$t('consult.consulting.auditName')" prop="createUserName" show-overflow-tooltip/>
          <el-table-column align="center" width="180" :label="$t('consult.consulting.auditTime')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.createTime | timeFmt}}
            </template>
          </el-table-column>
          <el-table-column align="center" width="180" :label="$t('consult.consulting.auditResults')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.processStatus | statusName}}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('consult.consulting.auditOpinion')" prop="processRemarks" show-overflow-tooltip/>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeOPenDialog">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import ApprovalHistory from '@/components/ApprovalHistory'
import { getApprovalHistoryList } from '@/api/system';
import Pagination from "@/components/Pagination";
import { uploadActionUrl } from "@/api/common";
import { parseTime } from "@/utils/index";
import Tinymce from "@/components/Tinymce";
import { deepClone } from '@/utils/index'
import {
  selectNewsCategoryList,
  selectNewsInfoList,
  saveNewsInfo,
  updateNewsInfo,
  deleteNewsInfoByIds,
  updateNewsInfoStatus,
  selectNewsInfoById,
  exportByNewsInfoExcel
} from "@/api/news";
export default {
  components: {
    Pagination,
    Tinymce
    // ApprovalHistory
  },
  data() {
    return {
      editableTabsValue: '1',
      TabsValue: '1',
      conultDate: [],
      isAppDetail: false,
      isPCDetail: false,
      detailForm: {
        intelligenceTitle: "",
        id: "",
        checked1: false,
        checked2: false,
        textarea: "",
        newsCarouselList: [
          {
            carouselPhotoPath: '',
            mediumType: 1
          },
          {
            carouselPhotoPath: '',
            mediumType: 2
          }
        ],
        newsContentList: [
          {
            consultContent: '',
            mediumType: 1
          },
          {
            consultContent: '',
            mediumType: 2
          }
        ],
        newsCategoryBId: "",
        validPeriod: "",
        intelligencStatus: 0,
        interCutFlag: true,
        carouselFlag: true,
        consultContent: ""
      },
      isPcShow: false,
      isAppShow: false,
      isSubmit: false,
      uploadActionUrl,
      categoryList: [],
      dialogType: "",
      pcImg: {
        carouselPhotoPath: '',
        mediumType: 1
      },
      appImg: {
        carouselPhotoPath: '',
        mediumType: 2
      },
      pcContent: {
        consultContent: '',
        mediumType: 1
      },
      appContent: {
        consultContent: '',
        mediumType: 2
      },
      ruleForm: {
        intelligenceTitle: "",
        id: "",
        checked1: true,
        checked2: true,
        textarea: "",
        newsCarouselList: [
          {
            carouselPhotoPath: '',
            mediumType: 1
          },
          {
            carouselPhotoPath: '',
            mediumType: 2
          }
        ],
        newsContentList: [
          {
            consultContent: '',
            mediumType: 1
          },
          {
            consultContent: '',
            mediumType: 2
          }
        ],
        newsCategoryBId: "",
        validPeriod: "",
        intelligencStatus: 0,
        interCutFlag: true,
        carouselFlag: true
      },
      overDetails: false,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      isFirst: true,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        intelligenceTitle: "",
        intelligencStatus: ""
      },
      areaList: [
        // 资讯信息状态 (0-编辑中、1-审核中、2-审核通过、3-审核失败，4-禁用、5-可用（发布）)
        {
          labelZh: '全部',
          label: 'All',
          inquiryStatus: ''
        },
        {
          label: 'Editing',
          labelZh: '编辑中',
          inquiryStatus: 0
        },
        {
          label: 'To Approve',
          labelZh: '审核中',
          inquiryStatus: 1
        },
        {
          label: 'Audit Pass',
          labelZh: '审核通过',
          inquiryStatus: 2
        },
        {
          label: 'Audit Failed',
          labelZh: '审核失败',
          inquiryStatus: 3
        },
        {
          label: 'Disabled',
          labelZh: '已禁用',
          inquiryStatus: 4
        },
        {
          label: 'Enabled',
          labelZh: '使用中',
          inquiryStatus: 5
        }
      ],
      list: [],
      approvalList: [],
      rules: {
        intelligenceTitle: [{ required: true, message: this.$t('consult.consulting.importTitle'), trigger: "blur" }
        ],
        startTime: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        // conultDate: [{ required: true, message: this.$t('consult.consulting.importDate'), trigger: "blur" }
        // ],
        // Date: [
        //   { required: true, message: this.$t('consult.consulting.importDate'), trigger: 'change' }
        // ],
        // equipment: [{ required: true, message: "请选择设备", trigger: "blur" }
        // ],
        // model: [{ required: true, message: "请选择播放模式", trigger: "blur" }
        // ],
        newsCategoryBId: [{ required: true, message: this.$t('consult.consulting.importCategory'), trigger: "blur" }
        ]
      },
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.ruleForm.endTime) {
            return time.getTime() > this.ruleForm.endTime;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.ruleForm.startTime) {
            return time.getTime() < this.ruleForm.startTime
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
    }
  },
  watch: {
    dialogVisible(val) {
      console.log(val)
      if (!val) {
        this.$refs['pc'].setContent('');
        this.$refs['app'].setContent('');
        this.isFirst = true
      }
    },
    isZh() {
      this.rules = {
        intelligenceTitle: [{ required: true, message: this.$t('consult.consulting.importTitle'), trigger: "blur" }
        ],
        startTime: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        newsCategoryBId: [{ required: true, message: this.$t('consult.consulting.importCategory'), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.ruleForm.intelligenceTitle = "";
      this.ruleForm.newsCategoryBId = "";
      this.ruleForm.validPeriod = "";
      this.ruleForm.intelligencStatus = 0;
      this.ruleForm.id = '';
      this.ruleForm.startTime = '';
      this.ruleForm.endTime = '';
      this.detailForm.endTime = '';
      this.detailForm.intelligenceTitle = "";
      this.detailForm.newsCategoryBId = "";
      this.detailForm.validPeriod = "";
      this.detailForm.intelligencStatus = 0;
      this.detailForm.id = '';
      this.detailForm.startTime = '';
      this.detailForm.endTime = '';
      this.pcImg.carouselPhotoPath = '';
      this.appImg.carouselPhotoPath = '';
      this.pcContent.consultContent = '';
      this.appContent.consultContent = '';
      this.conultDate = [];
    },
    // getSearchTime(date) {
    //   if (date && date.length) {
    //     this.ruleForm.startTime = date[0];
    //     this.ruleForm.endTime = date[1]
    //   } else {
    //     this.ruleForm.startTime = '';
    //     this.ruleForm.endTime = ''
    //   }
    // },
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    Carousel(e) {
      if (e) {
        this.isPcShow = false;
      } else {
        this.isPcShow = true;
      }
    },
    interCut(e) {
      if (e) {
        this.isAppShow = false;
      } else {
        this.isAppShow = true;
      }
    },
    // 获取分类列表
    getCatalogueList(typeNo) {
      selectNewsCategoryList({ typeNo: typeNo }).then(res => {
        this.categoryList = res.data || [];
      });
    },
    //  禁用启用
    changeMethod(row) {
      let obj = {
        intelligencStatus: row.intelligencStatus === 5 ? 4 : 5,
        id: row.id
      };
      updateNewsInfoStatus(obj).then(res => {
        this.$message.success(res.message);
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    PChandleAvatarSuccess(res, file) {
      this.pcImg.carouselPhotoPath = res.data.filePath;
    },
    APPhandleAvatarSuccess(res, file) {
      this.appImg.carouselPhotoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error(this.$t('consult.consulting.format'));
      }
      if (!isLt3M) {
        this.$message.error(this.$t('consult.consulting.headSize'));
      }
      return isLt3M
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== "") {
          obj[key] = this.postData[key];
        }
      }
      selectNewsInfoList(obj)
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
    // 详情模块
    detailDialog(row) {
      this.overDetails = true;
      this.detailForm = deepClone(row);
      this.getApprovalHistoryList(row);
      this.getCatalogueList(2);
      selectNewsInfoById({
        bId: row.bid
      }).then(res => {
        this.detailForm = res.data;
        // this.conultDate = [this.detailForm.startTime, this.detailForm.endTime];
        this.detailForm.carouselFlag = this.detailForm.carouselFlag === 1;
        this.detailForm.interCutFlag = this.detailForm.interCutFlag === 1;
        this.detailForm.checked2 = this.detailForm.intermediary !== 1 || this.detailForm.intermediary === 0;
        this.isAppDetail = !this.detailForm.checked2;
        this.detailForm.checked1 = this.detailForm.intermediary === 1 || this.detailForm.intermediary === 0;
        this.isPCDetail = !this.detailForm.checked1;
        this.pcImg = this.detailForm.newsCarouselList[0];
        this.appImg = this.detailForm.newsCarouselList[1];
        this.pcContent = deepClone(this.detailForm.newsContentList[0]);
        this.$refs['pc'].setContent(this.detailForm.newsContentList[0].consultContent);
        this.appContent = this.detailForm.newsContentList[1];
        this.$refs['app'].setContent(this.detailForm.newsContentList[1].consultContent);
      });
    },
    // 编辑模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === "edit") {
        selectNewsInfoById({
          bId: row.bid
        }).then(res => {
          this.ruleForm = res.data;
          // this.conultDate = [this.ruleForm.startTime, this.ruleForm.endTime];
          this.ruleForm.carouselFlag = this.ruleForm.carouselFlag === 1;
          this.ruleForm.interCutFlag = this.ruleForm.interCutFlag === 1;
          this.ruleForm.checked2 = this.ruleForm.intermediary !== 1 || this.ruleForm.intermediary === 0;
          this.ruleForm.checked1 = this.ruleForm.intermediary === 1 || this.ruleForm.intermediary === 0;
          this.pcImg = this.ruleForm.newsCarouselList[0];
          this.appImg = this.ruleForm.newsCarouselList[1];
          this.pcContent = deepClone(this.ruleForm.newsContentList[0]);
          this.appContent = this.ruleForm.newsContentList[1];
          if (!this.isFirst) {
            this.$refs['pc'].setContent(this.ruleForm.newsContentList[0].consultContent);
            this.$refs['app'].setContent(this.ruleForm.newsContentList[1].consultContent);
          }
        });
        this.getCatalogueList(2);
        // this.isSubmit = false;
      } else {
        this.getCatalogueList(1);
        // this.isSubmit = true;
        this.ruleForm.carouselFlag = true;
        this.ruleForm.interCutFlag = true;
        this.ruleForm.checked2 = true;
        this.ruleForm.checked1 = true;
        if (!this.isFirst) {
          this.$refs['pc'].setContent('');
          this.$refs['app'].setContent('');
        }
        this.pcImg.carouselPhotoPath = '';
        this.appImg.carouselPhotoPath = '';
        this.conultDate = []
      }
      this.dialogVisible = true;
    },
    closeOPenDialog() {
      this.overDetails = false;
      this.dialogVisible = false;
      this.pcContent.consultContent = "";
      this.appContent.consultContent = ""
    },
    // 提交
    conultSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交
          this.ruleForm.carouselFlag === true ? this.ruleForm.carouselFlag = 1 : this.ruleForm.carouselFlag = 0
          this.ruleForm.interCutFlag === true ? this.ruleForm.interCutFlag = 1 : this.ruleForm.interCutFlag = 0
          if (
            this.ruleForm.checked2 === false &&
            this.ruleForm.checked1 === true
          ) {
            this.ruleForm.intermediary = 1;
          } else {
            this.ruleForm.intermediary = 2;
          }
          if (this.ruleForm.checked2 && this.ruleForm.checked1) {
            this.ruleForm.intermediary = 0;
          }
          this.ruleForm.newsCarouselList = [this.pcImg, this.appImg];
          this.ruleForm.newsContentList = [this.pcContent, this.appContent];
          if (this.ruleForm.checked1 === true && this.ruleForm.interCutFlag === 1 && this.ruleForm.checked2 === false && this.ruleForm.carouselFlag === 0
          ) {
            this.$message.warning(this.$t('consult.consulting.interstitialHint'))
            return
          }
          if (this.ruleForm.checked2 && this.ruleForm.carouselFlag && this.ruleForm.checked1 === false && this.ruleForm.interCutFlag === 0) {
            this.$message.warning(this.$t('consult.consulting.carouselHint'))
            return
          }
          this.addLoading = true;
          if (this.ruleForm.id) {
            this.ruleForm.intelligencStatus = 1;
            updateNewsInfo(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t('consult.consulting.success'));
                this.postData.pageNum = 1;
                this.addLoading = false;
                this.dialogVisible = false;
                this.getDataList();
                this.$refs[formName].resetFields();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            this.ruleForm.intelligencStatus = 1;
            saveNewsInfo(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageNum = 1;
                this.addLoading = false;
                this.dialogVisible = false;
                this.getDataList();
                this.$refs[formName].resetFields();
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
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.carouselFlag === true ? this.ruleForm.carouselFlag = 1 : this.ruleForm.carouselFlag = 0;
          this.ruleForm.interCutFlag === true ? this.ruleForm.interCutFlag = 1 : this.ruleForm.interCutFlag = 0;
          if (
            this.ruleForm.checked2 === false &&
            this.ruleForm.checked1 === true
          ) {
            this.ruleForm.intermediary = 1;
          } else {
            this.ruleForm.intermediary = 2;
          }
          if (this.ruleForm.checked2 && this.ruleForm.checked1) {
            this.ruleForm.intermediary = 0;
          }
          if (this.ruleForm.checked1 === true && this.ruleForm.interCutFlag === 1 && this.ruleForm.checked2 === false && this.ruleForm.carouselFlag === 0) {
            this.$message.warning(this.$t('consult.consulting.interstitialHint'));
            return
          }
          if (this.ruleForm.checked2 && this.ruleForm.carouselFlag && this.ruleForm.checked1 === false && this.ruleForm.interCutFlag === 0) {
            this.$message.warning(this.$t('consult.consulting.carouselHint'));
            return
          }
          this.ruleForm.intelligencStatus = 0;
          this.ruleForm.newsCarouselList = [this.pcImg, this.appImg];
          this.ruleForm.newsContentList = [this.pcContent, this.appContent];
          this.addLoading = true;
          // 编辑
          if (this.ruleForm.id) {
            updateNewsInfo(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.addLoading = false;
                this.getDataList();
                this.$refs[formName].resetFields();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            // 新增
            saveNewsInfo(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageNum = 1;
                this.addLoading = false;
                this.dialogVisible = false;
                this.getDataList();
                this.$refs[formName].resetFields();
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
    // 删除
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
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
          deleteNewsInfoByIds(formData)
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
    outportData() {
      let obj = {
        pageNum: '',
        pageSize: '',
        intelligenceTitle: this.postData.intelligenceTitle,
        intelligencStatus: this.postData.intelligencStatus
      };
      exportByNewsInfoExcel(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'NewsInfo.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 审核记录
    getApprovalHistoryList(row) {
      let date = {
        receiptBId: row.bid
      };
      getApprovalHistoryList(date).then(res => {
        this.approvalList = res.data || [];
      })
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
        return parseTime(val);
      }
    },
    intermediaryFmt(intermediary) {
      switch (intermediary) {
        case 0:
          return 'PC,APP';
        case 1:
          return 'PC';
        case 2:
          return 'APP';
        default:
          return '';
      }
    },
    typeStstus(val) {
      switch (val) {
        case 0:
          return 'primary';
        case 1:
          return 'primary';
        case 2:
          return 'primary';
        case 3:
          return 'danger';
        case 4:
          return 'danger';
        case 5:
          return 'primary';
      }
    },
    conultStatus(val, language) {
      // 资讯信息状态 (0-编辑中、1-审核中、2-审核通过、3-审核失败，4-禁用、5-可用（发布）)
      switch (val) {
        case 0:
          return language === 'zh' ? '编辑中' : 'Editing';
        case 1:
          return language === 'zh' ? '审核中' : 'To Approve';
        case 2:
          return language === 'zh' ? '审核通过' : 'Audit Pass';
        case 3:
          return language === 'zh' ? '审核失败' : 'Audit Failed';
        case 4:
          return language === 'zh' ? '禁用' : 'Inactive';
        case 5:
          return language === 'zh' ? '可用' : 'Active';
      }
    },
    statusName(val) {
      switch (Number(val)) {
        case 0: return '驳回修改';
        case 1: return '审核通过';
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
  .approval-history {
    margin: 20px 0;
    .history-title {
      line-height: 1.5rem;
    }
  }
}
</style>
