<template>
  <div class="app-container email-setting">

    <div class="form-title">{{$t('system.mailSettings.notificationSettings')}}</div>
    <el-form ref="form1" :model="entity" label-width="135px" size="small" label-position="left" style="margin-top: 20px" :rules="entityRules">
      <el-form-item :label="$t('system.mailSettings.systemEmail')" style="margin-bottom: 70px!important;" prop="systemEmailAddress">
        <el-input v-model="entity.systemEmailAddress" maxlength="32" :placeholder="$t('system.mailSettings.systemEmail')" class="form-dialog-width"/>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.sysHost')">
        <el-input v-model="entity.sysHost" maxlength="32" :placeholder="$t('system.mailSettings.sysHost')" class="form-dialog-width"/>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.username')">
        <el-input v-model="entity.username" maxlength="32" :placeholder="$t('system.mailSettings.username')" class="form-dialog-width">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.password')">
        <div style="display: inline-block">
          <el-input v-model="entity.password" type="password" maxlength="32" :placeholder="$t('system.mailSettings.code')" class="form-dialog-width" />
        </div>
        <div style="display: inline-block">
          <span class="email-tips">{{$t('system.mailSettings.explain1')}}</span>
        </div>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.smtpProtocol')">
        <el-input v-model="entity.smtpProtocol" maxlength="32" :placeholder="$t('system.mailSettings.smtpProtocol')" class="form-dialog-width">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.smtpPort')">
        <div style="display: inline-block">
          <el-input v-model.number="entity.smtpPort" maxlength="8" :placeholder="$t('system.mailSettings.smtpPort')" class="form-dialog-width" />
        </div>
        <div style="display: inline-block">
          <span class="email-tips">{{$t('system.mailSettings.explain2')}}</span>
        </div>
      </el-form-item>
      <div style="margin-top: 70px!important;margin-bottom: 10px;font-size: 13px;">{{$t('system.mailSettings.sendTest')}}</div>
      <el-form-item :label="$t('system.mailSettings.emailTest')">
        <el-input v-model="entity.testEmail" :min="0" :placeholder="$t('system.mailSettings.emailTest')" class="form-dialog-width"/>
        <el-button type="primary" @click="onTest">{{$t('common.buttonText.send')}}</el-button>
      </el-form-item>
      <el-form-item style="margin: 30px 100px">
        <el-button type="primary" @click="onSubmit">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="primary" class="export" @click="backHome" >{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOneSysNoticeEmailConfig, saveOrUpdateSysNoticeEmailConfig, testSysNoticeEmailConfig } from '@/api/system';

export default {
  data() {
    return {
      entity: {
        systemEmailAddress: '',
        sysHost: '',
        username: '',
        password: '',
        smtpProtocol: '',
        smtpPort: '',
        testEmail: ''
      },
      entityRules: {
        systemEmailAddress: [
          { required: true, message: this.$t('customer.customerList.inputEmailSave'), trigger: 'blur' },
          { type: 'email', message: this.$t('customer.customerList.inputEmailSave'), trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getConfigSetFun()
  },
  methods: {
    getConfigSetFun() {
      getOneSysNoticeEmailConfig({}).then(res => {
        if (res.data) {
          this.entity = res.data;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    onSubmit() {
      saveOrUpdateSysNoticeEmailConfig(this.entity).then(res => {
        this.$message.success(this.$t("common.tip.saveTip"));
        this.getConfigSetFun();
      }).catch(err => {
        this.$message(err.message);
      });
    },
    // 返回首页
    backHome() {
      this.$router.push({ path: '/' });
    },
    onTest() {
      if (this.entity.testEmail === '' || this.entity.testEmail == null) {
        this.$message(this.$t("common.tip.sendEmail"));
        return;
      }
      testSysNoticeEmailConfig(this.entity).then(res => {
        this.$message.success(this.$t('common.tip.sendTip'));
        this.getConfigSetFun();
      }).catch(err => {
        this.$message.error(err.message);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.email-setting {
  width: 1000px;
  /*width: 90%;*/
  margin: 0 auto;

  .form-title {
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
  }
  .email-tips {
    font-size: 12px;
    font-style: italic;
    color: #5686e7;
  }
}
</style>

