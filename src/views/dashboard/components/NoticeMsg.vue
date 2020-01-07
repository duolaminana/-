<template>
  <div class="notice-msg">
    <div class="panel-title">
      {{title}}&nbsp;<el-badge v-if="total" :value="total" type="primary"></el-badge>
    </div>
    <div class="panel-list">
      <div class="panel-item" v-for="(item, index) in list" :key="index">
        <div class="panel-index">{{index + 1}}</div>
        <div class="panel-content">
          <!--<div>-->
            <!--<div>{{$t('common.dashboard.title')}}：{{item.remindTitle}}</div>-->
          <!--</div>-->
          <div>
            <div>{{$t('common.dashboard.title')}}：{{item.noticeTitle}}</div>
            <div>{{$t('common.dashboard.time')}}：{{item.triggerTime | timeFmt}}</div>
            <!--<div>状&emsp;态：<span :class="Number(item.disposeStatus) === 1 ? 'text-red' : 'text-green'">{{item.disposeStatus | statusName}}</span></div>-->
          </div>
          <div>
            <div>{{$t('common.dashboard.remindContent')}}：<span :title="item.noticeContent">{{item.noticeContent}}</span></div>
          </div>
        </div>
        <div class="panel-event">
          <el-button type="primary" size="mini" v-if="item.readStatus === '0'" @click="dealWith(item)">{{$t('common.buttonText.confirm')}}</el-button>
        </div>
      </div>
      <div v-if="!list.length" class="no-data">{{$t('common.noData')}}</div>
      <div class="more-data" @click="goMoreDataPath">{{$t('common.more')}}>>></div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { readMyNotice } from '@/api/system';
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      addMemoRemind: {
        remindTitle: '',
        disposeUsersIds: [],
        remindUserName: '',
        remindContent: '',
        sysMemoRemindUserList: []
      },
      userInfoList: [],
      addMemoRemindRules: {
        remindTitle: [
          { required: true, message: this.$t('common.dashboard.remindTitleHint'), trigger: 'blur' }
        ],
        remindContent: [
          { required: true, message: this.$t('common.dashboard.remindContentHint'), trigger: 'blur' }
        ],
        sysMemoRemindUserList: [
          { required: true, message: this.$t('common.dashboard.sysMemoRemindUserListHint'), trigger: 'change' }
        ]
      }
    }
  },
  props: {
    title: {
      type: String,
      default: '消息'
    },
    list: {
      type: Array,
      default: () => []
    },
    pathType: {
      type: Number,
      default: 1
    },
    type: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 进行状态处理
    dealWith(item) {
      let data = {
        id: item.id
      };
      readMyNotice(data).then(res => {
        this.$message.success(this.$t('common.tip.deal'));
        this.$emit('reLoad')
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    goMoreDataPath() {
      let path = '';
      switch (this.pathType) {
        case 1: path = '/approval/approval'; break;
        case 2: path = '/personal/remind'; break;
        case 3: path = '/personal/myNotice'; break;
      }
      if (path) {
        this.$router.push({ path: path })
      }
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusName(val) {
      switch (Number(val)) {
        case 1: return '待处理';
        case 2: return '已处理';
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .notice-msg{
    width: 100%;
    .panel-title {
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-color: #a7bfee;
    }
    .panel-list {
      .panel-item {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        height: 100px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        .panel-index {
          display: flex;
          display: -webkit-flex;
          justify-content: center;
          align-items: center;
          /*background: #adb8f7;*/
          border-right: 1px solid #ccc;
          width: 30px;
          padding: 5px;
        }
        .panel-content {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 5px;
          font-size: 12px;
          >div {
            display: flex;
            display: -webkit-flex;
            line-height: 1.25rem;
            overflow: hidden;
            >div {
              flex: 1;
              margin-right: 10px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .panel-label {
              max-width: 100px;
              margin-right: 0;
            }
          }
          .text-red {
            color: #ff9800;
          }
          .text-green {
            color: #259b24;
          }
        }
        .panel-event {
          width: 90px;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 5px;
          text-align: center;
          button {
            display: block;
            width: 50px;
            margin: 0 auto;
          }
        }
      }
      .no-data {
        border: 1px solid #ccc;
        border-top: none;
        font-size: 12px;
        /*background: #f6f7fb;*/
        text-align: center;
        line-height: 36px;
      }
      .more-data {
        border: 1px solid #ccc;
        border-top: none;
        /*background: #f6f7fb;*/
        text-align: right;
        font-size: 12px;
        padding-right: 16px;
        line-height: 36px;
        cursor: pointer;
      }
      .more-data:hover {
        text-decoration: underline;
      }
    }
    .form-dialog-width{
      width: 490px;
    }
    .el-dialog__header {
      padding: 5px !important;
    }
  }
</style>
