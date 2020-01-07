<template>
  <div class="approval-flow">
    <div class="history-title">{{$t('approval.approvalHistory.auditTitle')}}</div>
    <el-table
      :data="list"
      border
      fit
      size="small"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        :label="$t('approval.approvalHistory.index')"
        width="55">
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('approval.approvalHistory.processBy')" prop="processBy" />

      <el-table-column align="center" width="180" :label="$t('approval.approvalHistory.auditTime')">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="180" :label="$t('approval.approvalHistory.processStatus')">
        <template slot-scope="scope">
          {{scope.row.processStatus | statusName(language)}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('approval.approvalHistory.processRemarks')" prop="processRemarks"/>
    </el-table>
    <el-form ref="opinionForm" :model="opinionForm" :rules="opinionFormRules" label-width="150px" size="small" style="margin: 30px 0">
      <el-form-item :label="$t('approval.approvalHistory.processRemarks')" prop="opinion">
        <el-input v-model="opinionForm.opinion" type="textarea" :autosize="{ minRows: 5, maxRows: 6}" :maxlength="300" clearable :placeholder="$t('approval.approvalHistory.processRemarks')" style="width: 85%"/>
      </el-form-item>
      <el-form-item style="text-align: center;margin: 30px 0">
        <el-button type="primary" :loading="loading" @click="onSubmit('opinionForm', 1)">{{$t('common.buttonText.pass')}}</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit('opinionForm', 0)">{{$t('common.buttonText.reject')}}</el-button>
        <el-button type="danger" @click="goBack">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getApprovalHistoryList, approvalFlow } from '@/api/system';
export default {
  name: 'ApprovalFlow',
  data() {
    return {
      loading: false,
      opinionForm: {
        opinion: ''
      },
      opinionFormRules: {
        opinion: [{ required: true, message: this.isZh ? '请输入审批意见' : 'Please fill in the approval opinion', trigger: 'blur' }]
      },
      list: []
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getApprovalHistoryList()
  },
  methods: {
    getApprovalHistoryList() {
      let date = {
        receiptBId: this.$route.query.id || this.id
      };
      getApprovalHistoryList(date).then(res => {
        this.list = res.data || [];
      })
    },
    goBack() {
      this.$emit('close')
    },
    onSubmit(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let obj = {
            processRemarks: this.opinionForm.opinion,
            processStatus: status,
            approvalBId: this.$route.query.approvalBid,
            receiptBId: this.$route.query.id,
            nodeBId: this.$route.query.approvalNodeBid,
            approvalProcessBid: this.$route.query.processBid
          };
          approvalFlow(obj).then(res => {
            this.$message.success(this.language === 'zh' ? '审计操作完成' : 'Audit operation completed');
            this.loading = false;
            this.$emit('close')
          }).catch(err => {
            this.loading = false;
            this.$message.error(err.message)
          })
        }
      })
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusName(val, language) {
      switch (Number(val)) {
        case 0: return language === 'zh' ? '驳回修改' : 'Reject';
        case 1: return language === 'zh' ? '审核通过' : 'Audit passed';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
.approval-flow {
  margin: 20px 0;
  .history-title {
    border-top: 1px solid $border-light-color;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
}
</style>
