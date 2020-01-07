<script>
import { mapState, mapActions, mapGetters } from "vuex";
import * as Util from "./../csUtil";
import { exitGroup } from "./../cs1.js";
import ChatRecord from "./ChatRecord";

export default {
  components: { ChatRecord },
  data() {
    return {
      draft: "",
      content: "",
      chatRecordVisible: false
    };
  },
  computed: {
    ...mapState("cs", ["active", "preferedLanguage"]),
    ...mapGetters("cs", ["memberList"]),
    ...mapGetters(["userInfo"]),
    isKeepSilence() {
      if (this.memberList) {
        return this.memberList.find(
          i => i.username === this.userInfo.userAccount
        ).keep_silence;
      } else {
        return null;
      }
    },
    convPreferedLanguage() {
      if (this.preferedLanguage) {
        return this.preferedLanguage.filter(i => i.languages === "en"); // 先写死，以后可根据当前会话（active）语种filter常用语
      } else {
        return null;
      }
    }
  },
  methods: {
    ...mapActions("cs", ["sendGroupMsg", "sendGroupPic", "sendGroupFile"]),
    async sendTextMsg(e) {
      const msg = {
        content: {
          msg_type: "text",
          from_id: this.userInfo.userAccount,
          msg_body: {
            text: this.content
          },
          target_id: this.active.key
        },
        ctime_ms: new Date().getTime(),
        success: 1,
        unread_count: 0,
        msg_type: 4
      };
      if (
        ((e.ctrlKey && e.keyCode === 13) || e.type === "click") &&
        this.content.length
      ) {
        this.sendGroupMsg(msg)
          .then(() => {
            this.draft = "";
          })
          .catch(err => {
            this.content = this.draft;
            console.log("=============sendGroupMsg Error======", err.message);
            this.$message.error(err.message);
          });
        this.draft = this.content;
        this.content = "";
      }
    },
    // 发送图片
    sendPicAction(event) {
      if (!event.target.files[0]) {
        return;
      }
      let img = Util.getFileFormData(event.target);
      const isNotImage = "Invalid picture format";
      Util.imgReader(
        this.$refs.sendPic,
        () => this.selectImageError(isNotImage),
        value => this.sendPicContent(value, img)
      );
      event.target.value = "";
    },
    sendPicContent(value, data) {
      let msgs = {
        content: {
          from_id: this.userInfo.userAccount,
          msg_type: "image",
          msg_body: {
            media_url: value.src,
            width: value.width,
            height: value.height
          }
        },
        ctime_ms: new Date().getTime(),
        success: 1
      };
      // 发送群聊图片
      const groupPicFormData = {
        target_gid: this.active.key,
        image: data,
        need_receipt: false
      };
      msgs.groupPicFormData = groupPicFormData;
      msgs.msg_type = 4;
      this.sendGroupPic({
        groupPicFormData: groupPicFormData,
        msgs: msgs
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    selectImageError() {
      this.$alert("Invalid Picture Format", "Info", {
        confirmButtonText: "OK"
      });
    },
    sendFileAction() {
      if (!event.target.files[0]) {
        return;
      }
      let file = Util.getFileFormData(event.target);
      let fileData = event.target.files[0];
      let msgs;
      const ext = Util.getExt(fileData.name);
      msgs = {
        content: {
          msg_type: "file",
          from_id: this.userInfo.userAccount,
          from_name: this.userInfo.userAccount,
          msg_body: {
            fname: fileData.name,
            fsize: fileData.size,
            extras: {
              fileSize: fileData.size,
              fileType: ext
            }
          }
        },
        ctime_ms: new Date().getTime(),
        success: 1,
        unread_count: 0
      };
      const groupFile = {
        file: file,
        target_gid: this.active.key,
        extras: {
          fileSize: fileData.size,
          fileType: ext
        },
        need_receipt: true
      };
      msgs.groupFile = groupFile;
      msgs.msg_type = 4;
      this.sendGroupFile({
        msgs,
        groupFile
      }).catch(err => {
        this.$message.error(err.message);
      });
      event.target.value = "";
    },
    endSession() {
      this.$confirm("Please confirm whether to end the session", "Tips", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          exitGroup({
            csAccount: this.userInfo.userAccount,
            groupId: this.active.key,
            recodeBid: this.active.desc.split("#")[1]
          })
            .then(res => {
              if (res.code === 200 && !res.message) {
                this.$message.success("Exit Group Successful！");
              }
            })
            .catch(error => {
              this.$message.error(error.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Operation Canceled"
          });
        });
    },
    fastReply(command) {
      const msg = {
        content: {
          msg_type: "text",
          from_id: this.userInfo.userAccount,
          msg_body: {
            text: command
          },
          target_id: this.active.key
        },
        ctime_ms: new Date().getTime(),
        success: 1,
        unread_count: 0,
        msg_type: 4
      };
      this.sendGroupMsg(msg)
        .then()
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>

<template>
  <div v-if="active.activeIndex !== -1" class="chat-panel-message-input">
    <ChatRecord :visible.sync="chatRecordVisible" :chat-record-b-id="active.desc.split('#')[1]" />
    <div class="chat-panel-toolbar">
      <input
        class="chat-panel-singlePic"
        type="file"
        id="sendPic"
        ref="sendPic"
        @change="sendPicAction"
        :disabled="isKeepSilence"
      >
      <label class="chat-panel-singlePic-label" title="picture" for="sendPic">
        <i class="el-icon-picture-outline"></i>
      </label>
      <input
        class="chat-panel-singlePic"
        type="file"
        id="sendFile"
        @change="sendFileAction"
        :disabled="isKeepSilence"
      >
      <label class="chat-panel-singlePic-label" title="file" for="sendFile">
        <i class="el-icon-document"></i>
      </label>
      <div class="chat-panel-quick-reply-label">
        <el-dropdown trigger="click" placement="top-end" @command="fastReply">
          <i class="el-icon-circle-plus-outline"></i>
          <el-dropdown-menu slot="dropdown">
            <div v-for=" i in convPreferedLanguage" :key="i.id">
              <el-dropdown-item :command="i.preferedLanguageContent" :disabled="isKeepSilence">{{i.preferedLanguageContent}}</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="chat-panel-text-container" >
      <textarea v-model="content" @keyup="sendTextMsg" maxlength="500" :disabled="isKeepSilence"></textarea>
      <div class="chat-panel-btns">
        <el-button type="primary" @click="endSession">End Session</el-button>
        <el-button type="primary" @click="sendTextMsg" :disabled="isKeepSilence">Send</el-button>
        <el-button type="success" @click="chatRecordVisible=true">Chat Record</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-panel-message-input {
  height: 200px;
  position: relative;
  border-top: solid 1px #ddd;
  .chat-panel-toolbar {
    height: 50px;
    font-size: 25px;
    padding: 8px 16px;
  }
  .chat-panel-text-container {
    height: 100px;
    width: 100%;
    textarea {
      padding: 0 16px;
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      font-family: "Micrsofot Yahei";
      resize: none;
    }
  }
  .chat-panel-btns {
    position: absolute;
    bottom: 10px;
    right: 20px;
  }
  .chat-panel-singlePic {
    display: none;
  }
  .chat-panel-singlePic-label {
    cursor: pointer;
    float: left;
    margin-right: 30px;
    &:hover {
      color: rgb(69, 160, 245);
    }
  }
  .chat-panel-quick-reply-label {
    cursor: pointer;
    float: right;
    i {
      &:hover {
        color: rgb(69, 160, 245);
      }
    }
    >>> .el-dropdown {
      font-size: 25px;
    }
  }
}
</style>
