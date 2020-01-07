<template>
  <div class="approval-history">
    <div class="history-title">{{$t('approval.approvalHistory.auditTitle')}}</div>
    <el-table
      :data="list"
      border
      fit
      size="small"
      max-height="200"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        :label="$t('approval.approvalHistory.index')"
        width="55">
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('approval.approvalHistory.processBy')" prop="createUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="180" :label="$t('approval.approvalHistory.auditTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="180" :label="$t('approval.approvalHistory.processStatus')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.processStatus | statusName(language)}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('approval.approvalHistory.processRemarks')" prop="processRemarks" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getApprovalHistoryList } from '@/api/system';
export default {
  name: 'ApprovalFlow',
  data() {
    return {
      loading: false,
      list: []
    }
  },
  created() {
    this.getApprovalHistoryList()
  },
  methods: {
    getApprovalHistoryList() {
      let date = {
        receiptBId: this.$route.query.id
      };
      getApprovalHistoryList(date).then(res => {
        this.list = res.data || [];
      })
    },
    goBack() {
      this.$emit('close')
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
.approval-history {
  margin: 20px 0;
  .history-title {
    line-height: 1.5rem;
  }
}
</style>
