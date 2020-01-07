<template>
  <div class="app-container change-password">
    <el-form ref="form" :model="form" label-width="140px" size="small" :rules="formRules" class="change-form">
      <el-form-item :label="$t('common.personal.account')" prop="account">
        <el-input v-model="userInfo.userAccount" disabled style="width: 400px"/>
      </el-form-item>
      <el-form-item :label="$t('common.personal.oldPassword')" prop="oldPwd">
        <el-input v-model="form.oldPwd" type="password" placeholder="Old password" style="width: 400px"/>
      </el-form-item>
      <el-form-item :label="$t('common.personal.newPassword')" prop="newPwd">
        <el-input v-model="form.newPwd" type="password" placeholder="New password" style="width: 400px"/>
      </el-form-item>
      <el-form-item :label="$t('common.personal.checkPassword')" prop="newPwd1">
        <el-input v-model="form.newPwd1" type="password" placeholder="Confirm password." style="width: 400px"/>
      </el-form-item>
      <el-form-item style="margin-top: 30px;margin-left: 180px">
        <el-button size="small" type="primary" @click="submit('form')">{{$t('common.buttonText.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePassword } from '@/api/user';
import { getPwdSetApi } from '@/api/system'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import md5 from 'js-md5';
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      let reg =
        new RegExp("^" + (this.isNumber ? "(?=.*?[0-9]+)" : "") +
        (this.isLowercase ? "(?=.*?[a-z]+)" : "") +
        (this.isCapital ? "(?=.*?[A-Z]+)" : "") +
        ".{" + this.passwordSetting.pwdMin + "," + this.passwordSetting.pwdMax + "}$");

      if (!value) {
        callback(new Error(this.$t('common.tip.newPasswordMsg')));
      } else if (!reg.test(value)) {
        callback(new Error(this.$t('common.tip.newPasswordTip') + (this.isNumber ? this.$t('common.tip.numbers') : "") +
          (this.isLowercase ? this.$t('common.tip.lowercase') : "") +
          (this.isCapital ? this.$t('common.tip.uppercase') : "") + "," +
          this.$t('common.tip.length') + this.passwordSetting.pwdMin + "~" + this.passwordSetting.pwdMax + this.$t('common.tip.bytes')))
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.tip.confirmPasswordTip')));
      } else if (value !== this.form.newPwd) {
        callback(new Error(this.$t('common.tip.confirmPasswordMsg')));
      } else {
        callback();
      }
    };
    return {
      confirmLoading: false,
      form: {
        oldPwd: '',
        newPwd: '',
        newPwd1: ''
      },
      passwordSetting: {},
      isNumber: false,
      isLowercase: false,
      isCapital: false,
      formRules: {
        oldPwd: [
          { required: true, message: this.$t('common.tip.oldPasswordTip'), trigger: 'blur' }
        ],
        newPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPwd1: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getPasswordSetting()
  },
  methods: {
    getPasswordSetting() {
      getPwdSetApi({ setType: 1 }).then(res => {
        this.passwordSetting = res.data;
        this.isNumber = this.passwordSetting.isNumeral === '1';
        this.isLowercase = this.passwordSetting.isLowercase === '1';
        this.isCapital = this.passwordSetting.isCapital === '1';
        if (!this.isNumber && !this.isLowercase && !this.isCapital) {
          this.isNumber = true
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    async logout() {
      await this.$store.dispatch('delAllViews');
      this.$store.commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          formData.append('oldPwd', md5(this.form.oldPwd));
          formData.append('newPwd', md5(this.form.newPwd));
          let { oldPwd, newPwd } = this.form;
          let obj = {
            oldPwd: md5(oldPwd),
            newPwd: md5(newPwd)
          };
          changePassword(obj).then(res => {
            this.logout();
            this.$message.success(this.$t('common.tip.changePasswordTip'))
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.change-password {
  width: 90%;
  margin: 0 auto;
  .change-form {
    width: 800px;
    margin: 100px auto;
  }
}
</style>

