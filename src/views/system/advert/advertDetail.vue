<!--suppress ALL -->
<template>
  <div class="app-container form-test">
    <div class="search-box">
      <el-form :label-width="isZh ? '100px' : '130px'" inline size="small">
        <el-form-item :label="$t('system.ad.adTitle')">
          <el-input v-model.trim="postData.adTitle" clearable :placeholder="$t('system.ad.adTitle')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.adStatus" clearable :placeholder="$t('common.status')" style="width: 150px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.adStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="disableClick()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="outportData">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist"
      element-loading-text="loading。。。"
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
      <el-table-column property="adImgPath" width="100px" :label="$t('system.ad.img')">
        <template slot-scope="scope">
          <img v-if="scope.row.adImgPath" :src="fullUrl(scope.row.adImgPath)" style="border-style: none;width: 70px;height: 70px;">
        </template>
      </el-table-column>

      <el-table-column :label="$t('system.ad.adTitle')" prop="adTitle" show-overflow-tooltip />

      <el-table-column :label="$t('system.ad.positionName')" prop="positionName" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('common.table.updateBy')" width="80px" prop="updateUserIdName" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('system.ad.updateTime')" width="150px" prop="updateTime" >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="adStatus">
        <template slot-scope="{row}">
          <el-tag :type="row.adStatus === 1 ? 'primary' : 'danger'" size="mini">
            {{ row.adStatus ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.adStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.adStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.ad.addContent'): $t('system.ad.editContent')"
               center @closed="clearData" width="840px">
      <el-form ref="addCompany" v-if="dialogVisible" :model="menuData" label-width="140px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.ad.adTitle')" prop="adTitle">
          <el-input v-model="menuData.adTitle" clearable maxlength="30" :placeholder="$t('system.ad.adTitle')" style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('system.ad.positionName')" prop="positionBId">
          <el-select v-model="menuData.positionBId" clearable :placeholder="$t('system.ad.positionName')" style="width: 500px">
            <el-option v-for="(item, index) in positionNameList" :label="item.positionName" :value="item.bid" :key="index" >
              {{item.positionName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.positionTag')" prop="positionTag">
          <el-select v-model="menuData.positionTag" clearable :placeholder="$t('system.ad.positionTag')" style="width: 500px">
            <el-option v-for="(item, index) in positionTagList" :label="language === 'zh' ?item.label :item.labelEn" :value="item.value" :key="index" >
              {{language === 'zh' ?item.label :item.labelEn}}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('common.table.status')" prop="adStatus" style="width: 500px">
          {{ menuData.adStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>

        <el-form-item :label="$t('system.ad.uploadImg')" prop="adImgPath">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            style="border: 1px dashed #d9d9d9;!important;height: 178px;width: 178px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <img v-if="menuData.adImgPath" :src="fullUrl(menuData.adImgPath)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">{{$t('system.ad.explain')}}</div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('system.ad.contentDetail')" center @closed="clearData" width="840px">
      <el-form ref="addCompany" :model="menuData" label-width="140px" label-position="right" inline size="small">
        <el-form-item :label="$t('system.ad.adTitle')" prop="adTitle">
          <el-input v-model="menuData.adTitle" clearable :placeholder="$t('system.ad.adTitle')" style="width: 500px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.ad.positionName')" prop="positionBId">
          <el-select v-model="menuData.positionBId" clearable disabled style="width: 300px" readonly>
            <el-option v-for="(item, index) in positionNameList" :disabled="true" :label="item.positionName" :value="item.bid" :key="index" style="width: 250px" >
              {{item.positionName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.positionTag')" prop="positionTag">
          <el-select v-model="menuData.positionTag" clearable placeholder="广告轮播图" style="width: 300px">
            <el-option v-for="(item, index) in positionTagList" :label="language === 'zh' ?item.label :item.labelEn" :value="item.value" :key="index" >
              {{language === 'zh' ?item.label :item.labelEn}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="adStatus">
          {{ menuData.adStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>

        <el-form-item :label="$t('system.ad.uploadImg')" prop="adImgPath">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            style=" border: 1px dashed #d9d9d9;!important;height: 178px;width: 178px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            disabled>
            <img v-if="menuData.adImgPath" :src="fullUrl(menuData.adImgPath)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">{{$t('system.ad.explain')}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { selectAdvertListApi, getAdvertPositionListApi, saveAdvertApi, updateAdvertApi, updateAdvertStatusApi, delectByAdvertIdApi, exportBySysAdDetailExcel, selectgetDictionaryBykeyApi } from '@/api/system';
import { deepClone } from '@/utils/index'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common';
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      uploadActionUrl,
      dialogImageUrl: '',
      datalist: [],
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogVisible2: false,
      detailModal: false,
      dialogType: '',
      indent: 20,
      selectList: [],
      positionTagList: [],
      reviewForm: {
        positionIds: ''
      },
      expandArr: [1036013, 1036014],
      menuData: {
        adTitle: '',
        positionBId: '',
        positionName: '',
        adImgPath: '',
        adImgUuid: '',
        adStatus: 1,
        positionTag: ''
      },
      showRecordList: [],
      menuDataRules: {
        adTitle: [
          { required: true, message: this.$t('system.ad.adTitleHint'), trigger: 'blur' }
        ],
        positionBId: [
          { required: true, message: this.$t('system.ad.positionBIdHint'), trigger: 'change' }
        ],
        positionTag: [
          { required: true, message: this.$t('system.ad.positionTagHint'), trigger: 'change' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        adTitle: '',
        adStatus: ''
      },
      areaList: [
        {
          labelZh: '全部',
          label: 'All',
          adStatus: ''
        },
        {
          labelZh: '使用中',
          label: 'Enabled',
          adStatus: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          adStatus: 0
        }
      ],
      positionNameList: []
    }
  },
  watch: {
    isZh() {
      this.menuDataRules = {
        adTitle: [
          { required: true, message: this.$t('system.ad.adTitleHint'), trigger: 'blur' }
        ],
        positionBId: [
          { required: true, message: this.$t('system.ad.positionBIdHint'), trigger: 'change' }
        ],
        positionTag: [
          { required: true, message: this.$t('system.ad.positionTagHint'), trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
    this.selectgetDictionaryBykeyFun();
  },
  methods: {
    clearData() {
      this.menuData.adTitle = '';
      this.menuData.positionBId = '';
      this.menuData.positionName = '';
      this.menuData.adStatus = 1;
      this.menuData.adImgPath = '';
      this.menuData.positionTag = '';
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() { // 广告内容列表
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectAdvertListApi(obj).then(res => {
        this.listLoading = false;
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    getPositionNameList(typeNo) { // 广告位置列表
      getAdvertPositionListApi({ typeNo: typeNo }).then(res => {
        this.positionNameList = res.data || [];
      })
    },
    openDetail(row) {
      this.menuData = deepClone(row);
      this.getPositionNameList(2);
      this.detailModal = true;
      for (let i = 0; i < this.positionTagList.length; i++) {
        if (this.menuData.positionTag + "" === this.positionTagList[i].value) {
          this.positionTagList[i].value = this.menuData.positionTag
        }
      }
    },
    openDialog(type, row) {
      this.dialogType = type;
      this.getPositionNameList(1);
      if (type === 'edit') {
        this.menuData = deepClone(row);
        // this.selectgetDictionaryBykeyFun()
        for (let i = 0; i < this.positionTagList.length; i++) {
          if (this.menuData.positionTag + "" === this.positionTagList[i].value) {
            this.positionTagList[i].value = this.menuData.positionTag
          }
        }
      }
      this.dialogVisible = true;
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            saveAdvertApi(this.menuData).then(res => {
              this.$message.success(this.$t("system.userManage.addSuccess"));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateAdvertApi(this.menuData).then(res => {
              this.$message.success(this.$t("system.userManage.updata"));
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning(this.$t('common.tip.isdataFill'))
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        adStatus: row.adStatus === 1 ? 0 : 1,
        id: row.id
      };
      updateAdvertStatusApi(obj).then(res => {
        this.$message.success(res.message)
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    disableClick() {
      if (!this.selectList.length) {
        return this.$message(this.$t('query.formMessage.PleaseSelectData'));
      }
      this.$confirm(this.$t('query.formMessage.isDelete'), this.$t('system.userManage.hint'), {
        confirmButtonClass: 'el-button-confirmClass',
        cancelButtonClass: 'el-button-cancelClass',
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.adIds = this.selectList.map(e => {
          return e.id;
        }).join(',');
        delectByAdvertIdApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t('common.tip.deleteTip'));
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
    // 导出操作
    outportData() {
      let obj = {
        pageNum: '',
        pageSize: '',
        adTitle: this.postData.adTitle,
        adStatus: this.postData.adStatus
      };
      exportBySysAdDetailExcel(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'SysAdDetail.xls');
        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 数据字典,获取广告轮播图
    selectgetDictionaryBykeyFun() {
      let data = {};
      data.key = 'BannerPosition';
      selectgetDictionaryBykeyApi(data).then(res => {
        this.positionTagList = res.data;
        this.menuData.positionTag = res.data.value;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.menuData.adImgUuid = res.data.UUID;
      this.menuData.adImgPath = res.data.filePath;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.menuData.adImgUuid = '';
      this.menuData.adImgPath = '';
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error(this.$t('common.tip.uploadHint'));
      }
      // if (!isLt2M) {
      //   this.$message.error(this.$t('common.tip.uploadSizeHint'));
      // }
      return isJPG || isPNG
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .form-test {
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
    .avatar-uploader .el-upload {
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
  }
</style>

