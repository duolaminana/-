<script>
import { mapState, mapGetters } from "vuex";
import { parseTime } from "@/utils/index";
import * as Util from "./../csUtil";
import { pageNumber } from "./../cs.config.js";
import ImageViewer from "./ImageViewer";
export default {
  components: { ImageViewer },
  data() {
    return {
      imageViewer: {
        result: [],
        active: {
          index: -1
        },
        show: false
      },
      imageViewerVisible: false,
      activeImage: {}
    };
  },
  computed: {
    ...mapState("cs", ["active", "messageList"]),
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
    },
    fileName(fileName, length) {
      return Util.transformFileName(fileName, length);
    },
    fileSize(fileSize) {
      return Util.transformFileSize(fileSize);
    }
  },
  directives: {
    // 发送消息后滚动到底部
    "scroll-bottom": function(el, binding, vnode) {
      vnode.context.$nextTick(() => {
        el.scrollTop = el.scrollHeight - el.clientHeight;
      });
    }
  },
  methods: {
    // 图片预览
    imageViewerShow(item) {
      for (let i = 0; i < this.msgs.length; i++) {
        const msgIdFlag = item.msg_id && this.msgs[i].msg_id === item.msg_id;
        if (msgIdFlag) {
          this.activeImage = Util.deepCopyObj(this.msgs[i].content.msg_body);
          break;
        }
      }
      this.imageViewerVisible = true;
    }
  }
};
</script>

<template>
  <div v-if="msgs" class="chat-panel-board">
    <ImageViewer :visible.sync="imageViewerVisible" :image="activeImage" />
    <div class="chat-panel-message-borad" v-scroll-bottom>
      <div class="chat-panel-content">
        <div class="chat-panel-wrap" v-for="i in msgs" :key="i.msg_id">
          <p class="chat-panel-time">
            <span>{{ i.ctime_ms | time }}</span>
          </p>
          <div class="chat-panel-msg" :class="{ self: i.content.from_id === userInfo.userAccount }">
            <img
              class="chat-panel-from chat-panel-avatar"
              :src="fullUrl(i.content.from_id === userInfo.userAccount? userInfo.photoPath : i.content.avatarUrl)"
            >
            <div v-if="i.content.msg_type==='text'">
              <div class="chat-panel-from">
                <div
                  v-if="i.content.from_id !== userInfo.userAccount"
                  class="chat-panel-username"
                >{{ i.content.from_id }}</div>
                <div
                  class="chat-panel-from-msgtext chat-panel-msg-text"
                >{{ i.content.msg_body.text }}</div>
              </div>
            </div>
            <div v-if="i.content.msg_type==='image'">
              <div class="chat-panel-from">
                <div
                  v-if="i.content.from_id !== userInfo.userAccount"
                  class="chat-panel-username"
                >{{ i.content.from_id }}</div>
                <div
                  :class="{'chat-panel-msg-img': !i.content.msg_body.loading}"
                  :style="{'width': i.content.msg_body.width > 219 || i.content.msg_body.height > 300 ? (i.content.msg_body.width/i.content.msg_body.height > 219/300 ? 219 + 'px' : i.content.msg_body.width/i.content.msg_body.height * 300 + 'px') : i.content.msg_body.width + 'px', 'height': i.content.msg_body.width > 219 || i.content.msg_body.height > 300 ? (i.content.msg_body.width/i.content.msg_body.height < 219/300 ? 300 + 'px' : i.content.msg_body.height/i.content.msg_body.width * 219 + 'px') : i.content.msg_body.height + 'px'}"
                >
                  <img
                    @load="i.content.msg_body.loading = true"
                    title="点击查看大图"
                    @click="imageViewerShow(i)"
                    class="chat-panel-msg-img"
                    :src="fullUrl(i.content.msg_body.media_url)"
                    alt
                  >
                </div>
              </div>
            </div>
            <div v-if="i.content.msg_type==='file'">
              <div class="chat-panel-from">
                <div
                  v-if="i.content.from_id !== userInfo.userAccount"
                  class="chat-panel-username"
                >{{ i.content.from_id }}</div>
                <div class="chat-panel-from-file chat-panel-msg-file">
                  <div class="chat-panel-file-icon">
                    <i class="el-icon-document"></i>
                    <span>{{i.content.msg_body.fname | fileName(12)}}</span>
                  </div>
                  <div class="chat-panel-range">
                    <span>{{i.content.msg_body.fsize | fileSize}}</span>
                    <span v-if="i.content.from_id === userInfo.userAccount">已发送</span>
                    <span
                      v-else
                      class="chat-panel-download-file"
                      @click="downFile(i.content.msg_body.media_url)"
                    >下载文件</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      .chat-panel-msg-img {
        max-width: 219px;
        max-height: 300px;
        cursor: -webkit-zoom-in;
        cursor: zoom-in;
        border-radius: 5px;
        display: block;
      }
      .chat-panel-from-file {
        &:before {
          content: " ";
          position: absolute;
          top: 9px;
          right: 100%;
          border: 6px solid transparent;
          border-right-color: #f5f3f3;
        }
      }
      .chat-panel-msg-file {
        background-color: #f5f3f3;
        width: 236px;
        height: 120px;
        border: 1px solid #f5f3f3;
        border-radius: 5px 0 5px 5px;
        position: relative;
        .chat-panel-file-icon {
          padding: 16px;
          display: flex;
          i {
            font-size: 40px;
            color: #fff;
            margin-right: 18px;
            border-radius: 5px;
            padding: 5px;
            background: #f1b167;
          }
          span {
            font-size: 18px;
            overflow: hidden;
          }
        }
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
      .chat-panel-download-file {
        cursor: pointer;
        color: rgb(69, 160, 245);
        &:hover {
          color: rgb(11, 132, 245);
        }
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
      .chat-panel-from-file {
        &:before {
          content: " ";
          left: 100%;
          border-right-color: transparent;
          border-left-color: #f5f3f3;
        }
      }
    }
  }
}
</style>
