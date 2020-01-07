<script>
import { mapGetters } from "vuex";
import { parseTime } from "@/utils/index";
import { pageNumber } from "./../cs.config.js";
import { getRecordList } from "./../cs1.js";

export default {
  data() {
    return {
      isLoading: false,
      params: {
        chatRecordBId: '',
        pageNum: 9999,
        pageSize: pageNumber
      },
      recordList: {
        current: 0,
        pages: 0,
        records: [],
        size: 0,
        total: 0
      }
    };
  },
  props: {
    visible: { type: Boolean, Default: false },
    // eslint-disable-next-line
    chatRecordBId: {
      type: String,
      Default: ''
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    msgs() {
      if (this.messageList.length === 0 || this.active.activeIndex === -1) {
        return null;
      } else {
        const data = this.messageList.find(item => item.key === this.active.key)
          .msgs;
        if (data.length > pageNumber) {
          return data.slice(data.length - pageNumber);
        }
        return data;
      }
    }
  },
  filters: {
    time(mtime) {
      return parseTime(mtime);
    }
  },
  methods: {
    getChatRecords() {
      this.isLoading = true;
      getRecordList({
        ...this.params,
        chatRecordBId: this.chatRecordBId
      })
        .then(res => {
          if (res.status === 200 && !res.message) {
            this.recordList = res.data;
            this.params.pageNum = res.data.current;
          } else {
            this.$message.error(res.message);
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.$message.error(err.message);
          this.isLoading = false;
        });
    },
    updateVisible() {
      this.$emit("update:visible", false);
      this.params.pageNum = 9999;
    }
  }
};
</script>

<template>
  <el-dialog
    title="Chat Record"
    :visible.sync="visible"
    center
    @open="getChatRecords"
    :before-close="updateVisible"
  >
    <div class="chat-panel-board" v-loading="isLoading">
      <div class="chat-panel-message-borad">
        <div class="chat-panel-content">
          <div class="chat-panel-wrap" v-for="i in recordList.records" :key="i.id">
            <p class="chat-panel-time">
              <span>{{ i.createTime | time }}</span>
            </p>
            <div class="chat-panel-msg" :class="{ self: i.account === userInfo.userAccount }">
              <img
                class="chat-panel-from chat-panel-avatar"
                :src="fullUrl(i.account === userInfo.userAccount? userInfo.photoPath : i.photoPath)"
              >
              <div class="chat-panel-from">
                <div
                  v-if="i.account !== userInfo.userAccount"
                  class="chat-panel-username"
                >{{ i.account }}</div>
                <div class="chat-panel-from-msgtext chat-panel-msg-text">{{ i.chatContent }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-pagination
        @current-change="getChatRecords"
        :current-page.sync="params.pageNum"
        :page-size="params.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="recordList.total"
      ></el-pagination>
      <el-button type="success" @click="updateVisible">Return</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.chat-panel-board {
  .chat-panel-message-borad {
    height: 600px;
    overflow: auto;
    .chat-panel-content {
      padding: 0 16px;
    }
    .chat-panel-wrap {
      overflow: hidden;
      margin: 12px 0;
    }
    .chat-panel-time {
      margin: 30px 0 20px 0;
      height: 20px;
      line-height: 20px;
      text-align: center;
      > span {
        display: inline-block;
        font-size: 12px;
        color: #999;
        text-align: center;
        line-height: 17px;
        padding: 2px 9px;
        background: #f2f6fb;
        border-radius: 5px;
      }
    }
    .chat-panel-msg {
      line-height: 40px;
      text-align: left;
      .chat-panel-from {
        float: left;
        margin-right: 12px;
      }
      .chat-panel-username {
        line-height: 12px;
        height: 14px;
        margin-bottom: 2px;
        font-size: 12px;
        color: #999;
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .chat-panel-avatar {
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 3px;
        img {
          width: 100%;
        }
      }
      .chat-panel-from-msgtext {
        background-color: #f5f3f3;
        &:before {
          content: " ";
          position: absolute;
          top: 9px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #f5f3f3;
        }
      }
      .chat-panel-msg-text {
        display: inline-block;
        position: relative;
        padding: 9px 11px;
        max-width: 400px;
        min-height: 30px;
        line-height: 20px;
        border: 1px solid #f5f3f3;
        border-radius: 5px;
        word-break: break-all;
      }
      .chat-panel-range {
        width: 100%;
        height: 28px;
        position: relative;
        border-radius: 0 0 5px 5px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 8px 0 8px;
        border-top: 1px solid #dcdcdc;
      }
    }
    .self {
      text-align: right;
      .chat-panel-from {
        float: right;
        margin-left: 12px;
        margin-right: 0;
      }
      .chat-panel-from-msgtext {
        background-color: #26c5ec;
        border: 1px solid #26c5ec;
        &:before {
          content: " ";
          left: 100%;
          border-right-color: transparent;
          border-left-color: #26c5ec;
        }
      }
    }
  }
}
</style>
