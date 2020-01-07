<template>
  <div class="app-container userInfo">
    <div class="userForm">
      <el-form ref="editForm" :model="userInfo" label-width="90px" label-position="left" size="small" :rules="userRules">
        <div class="user-item">
          <div class="user-right">
            <el-form-item :label="$t('common.personal.firstName')">
              {{userInfo.firstName}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.lastName')">
              {{userInfo.lastName}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.sex')">
              {{userInfo.userSex===1?$t('common.personal.male'):$t('common.personal.female')}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.account')">
              {{userInfo.userAccount}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.department')">
              {{userInfo.departmentStr}}
            </el-form-item>
          </div>
          <div class="avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :data="{ type: 3 }"
              :headers="upLoadHeaders"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="image" :src="fullUrl(image)" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div style="font-size: 10px;text-align: center;color: red;padding-bottom: 5px;">{{$t('common.personal.tips')}}</div>
          </div>
        </div>
        <el-form-item :label="$t('common.personal.email')" prop="emailAddress">
          <el-input v-model="userInfo.emailAddress" clearable :placeholder="$t('common.personal.emailTips')"/>
        </el-form-item>
        <el-form-item :label="$t('common.personal.telephone')" prop="mobilePhone">
          <el-input v-model="userInfo.mobilePhone" clearable :placeholder="$t('common.personal.phoneTips')"/>
        </el-form-item>
        <el-form-item :label="$t('common.personal.address')">
          <el-input v-model="userInfo.contactAddress" clearable placeholder="Address"/>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="small" :loading="confirmLoading" @click="saveUserInfo('editForm')">{{$t('common.buttonText.save')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common'
import { updateUserInfo } from '@/api/user';
import { validPhone } from '@/utils/validate'
export default {
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
      confirmLoading: false,
      image: '',
      userRules: {
        emailAddress: [
          { required: true, message: this.$t('common.personal.emailMsg'), trigger: 'blur' },
          { type: 'email', message: this.$t('common.personal.emailMsg'), trigger: 'blur' }
        ],
        mobilePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }]
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  watch: {
    userInfo: {
      handler(arr) {
        this.image = this.userInfo.photoPath
      },
      immediate: true
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.image = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error(this.$t('common.tip.uploadImgFmt'));
      }
      if (!isLt2M) {
        this.$message.error(this.$t('common.tip.uploadSize') + '2MB');
      }
      return isJPG && isLt2M;
    },
    saveUserInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          this.userInfo.photoPath = this.image;
          updateUserInfo(this.userInfo).then(res => {
            this.$message.success(this.$t('common.tip.updateTip'));
            this.$store.commit('SET_USERINFO', res.data)
            this.confirmLoading = false;
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.userInfo {
  width: 90%;
  margin: 0 auto;

  .userForm {
    width: 700px;
    margin: 0 auto;
    position: relative;
    border: 1px solid $border-light-color;
    padding: 20px;

    .user-item {
      display: flex;
      display: -webkit-flex;

      .avatar {
        /*width: 40%;*/

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
      }

      .user-right {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
  }
}
</style>

