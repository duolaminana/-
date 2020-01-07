<template>
  <div class="app-container newsDetail">
    <div class="edit-title">{{$t('consult.consulting.AuditInformation')}}</div>
    <el-form label-position="left" label-width="165px" size="small" inline :model="detailForm">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item :label="$t('consult.consulting.title')">
            <el-input v-model="detailForm.intelligenceTitle" style="width:350px" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('consult.consulting.category')">
            <el-select v-model="detailForm.newsCategoryBId" style="width:300px" disabled>
              <el-option
                v-for="(item, index) in categoryList"
                :label="item.categoryName"
                :value="item.bid"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('consult.consulting.alidTermv')">
            <el-date-picker
              disabled
              v-model="conultDate"
              type="daterange"
              range-separator="~"
              :start-placeholder="$t('consult.consulting.startDate')"
              :end-placeholder="$t('consult.consulting.endDate')"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('consult.consulting.medium')" v-model="detailForm.intermediary">
            <el-checkbox disabled v-model="detailForm.checked1">PC</el-checkbox>
            <el-checkbox disabled v-model="detailForm.checked2">APP</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('consult.consulting.playMode')">
            <el-checkbox disabled v-model="detailForm.carouselFlag">{{$t('consult.consulting.carousel')}}</el-checkbox>
            <el-checkbox disabled v-model="detailForm.interCutFlag">{{$t('consult.consulting.interstitial')}}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('system.role.status')"
            v-model="detailForm.intelligencStatus"
          >{{detailForm.intelligencStatus | conultStatus(language)}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('consult.consulting.headerImage')" prop="rightName">
            <el-tabs type="border-card" v-model="TabsValue" style="height: 500px;width: 610px;">
              <!--PC-->
              <el-tab-pane label="PC" name="1" :disabled="isPCDetail">
                <el-upload
                  disabled
                  :headers="upLoadHeaders"
                  class="avatar-uploader"
                  :action="uploadActionUrl"
                  :show-file-list="false">
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
                  :show-file-list="false">
                  <img v-if="appImg.carouselPhotoPath" :src="fullUrl(appImg.carouselPhotoPath)" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!--富文本--------------------------------------->
          <el-form-item :label="$t('consult.consulting.content')">
            <el-tabs type="border-card" v-model="editableTabsValue">
              <el-tab-pane label="PC" name="1" :disabled="isPCDetail" >
                <tinymce ref="pc" v-model="pcContent.consultContent" style="pointer-events:none" />
              </el-tab-pane>
              <!--APP-->
              <el-tab-pane label="APP" name="2" :disabled="isAppDetail">
                <tinymce ref="app" v-model="appContent.consultContent" style="pointer-events:none" />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ApprovalFlow @close="closePage"></ApprovalFlow>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import { parseTime, deepClone } from "@/utils/index";
import { selectNewsInfoById, selectNewsCategoryList } from '@/api/news'
import { uploadActionUrl } from "@/api/common";
import Tinymce from "@/components/Tinymce";
export default {
  components: {
    ApprovalFlow,
    Tinymce
  },
  data() {
    return {
      isAppDetail: false,
      isPCDetail: false,
      editableTabsValue: '1',
      TabsValue: '1',
      conultDate: [],
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
        intelligencStatus: "",
        interCutFlag: true,
        carouselFlag: true,
        consultContent: ""
      },
      isPcShow: false,
      isAppShow: false,
      uploadActionUrl,
      categoryList: [],
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
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    this.getCatalogueList(2);
    this.getNewsDettail();
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
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
    // 资讯详情
    getNewsDettail () {
      selectNewsInfoById({ bId: this.$route.query.id }).then(res => {
        this.detailForm = res.data;
        this.conultDate = [this.detailForm.startTime, this.detailForm.endTime];
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
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
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
    }
  }
};
</script>

<style lang="scss">
  @import "~@/styles/variables.scss";
  .newsDetail {
    width: 90%;
    margin: 0 auto;
    .edit-title {
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
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
    .payment-box {
      >div {
        margin: 20px 0;
      }
      .payment-order {
        &-item {
          display: flex;
          line-height: 28px;
          >div {
            flex: 1;
            display: flex;
            .item-label {
              width: 130px;
            }
            .item-text {
              flex: 1;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
      .payment-supplier {
        display: flex;
        border-top: 1px solid $border-light-color;
        padding-top: 10px;
        >div {
          flex: 1;
          .payment-supplier-item {
            padding-left: 100px;
            flex: 1;
            display: flex;
            line-height: 35px;
            .item-label {
              width: 130px;
            }
            .item-text {
              flex: 1;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
