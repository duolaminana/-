<script>
import ChatPanel from "./components/ChatPanel";
import ConversationList from "./components/ConversationList";
import InputBox from "./components/InputBox";
import ClientInformation from "./components/ClientInformation";
import GroupMembers from "./components/GroupMembers";
import OnlineMembers from "./components/OnlineMembers";
import LoginMenu from "./components/LoginMenu";
import { mapState, mapActions, mapGetters } from "vuex";
import * as apiService from "./jmApiService.js";
import { getAuthPayLoad } from "./cs1.js";
import * as Util from "./csUtil";
import { defaultPayload, JIM_PASSWORD, flag } from "./cs.config.js";
import { parseTime } from "@/utils/index";
import md5 from "js-md5";
import moment from "moment";

export default {
  components: {
    ChatPanel,
    ConversationList,
    InputBox,
    ClientInformation,
    GroupMembers,
    OnlineMembers,
    LoginMenu
  },
  data() {
    return {
      isLoaded: false,
      hasOffline: 0,
      noLoadedMessage: [],
      eventArr: [],
      communicationTime: ""
    };
  },
  computed: {
    ...mapState("cs", [
      "onlineStatus",
      "messageList",
      "active",
      "status",
      "csInfo"
    ]),
    ...mapGetters(["userInfo"]),
    ...mapGetters("cs", ["activeMsgList"])
  },
  methods: {
    ...mapActions("cs", [
      "setConversation",
      "setMessageList",
      "receiveMessageSuccess",
      "getGroupMembers",
      "afterExitGroup",
      "changeMemberSilence",
      "setOnlineStatus",
      "initActive"
    ]),
    async init() {
      if (!apiService.isInit()) {
        await this.jimInit();
      }
      const loginObj = {
        username: this.userInfo.userAccount,
        password: md5(JIM_PASSWORD),
        is_md5: true
      };
      await apiService.login(loginObj).catch(err => {
        this.$message.error("Failed to login JIM: " + err.message);
      });
      apiService.JIM.onMsgReceive(data => {
        if (!this.isLoaded) {
          this.noLoadedMessage.push(data);
          return;
        }
        this.receiveGroupMessage(data);
      });
      // 异常断线监听
      apiService.JIM.onDisconnect(() => {
        this.$alert("网络断线，请检查网络或重新登陆", "提示", {
          confirmButtonText: "确定",
          callback: this.logoutConsole
        });
      });
      // 监听在线事件消息
      apiService.JIM.onEventNotification(data => {
        data.isOffline = false;
        if (!this.isLoaded) {
          this.eventArr.push(data);
        } else {
          this.asyncEvent(data);
        }
      });
      // 监听离线事件消息
      apiService.JIM.onSyncEvent(data => {
        if (!this.isLoaded) {
          this.eventArr = data;
        } else {
          for (let item of data) {
            item.isOffline = true;
            this.asyncEvent(item);
          }
        }
      });
      // 离线消息同步监听
      apiService.JIM.onSyncConversation(data => {
        // 限制只触发一次
        if (this.hasOffline === 0) {
          this.hasOffline++;
          this.loadConversation(data);
        }
      });
      setTimeout(() => {
        if (this.hasOffline === 0) {
          console.log("===如果8秒内没有加载离线消息则手动触发===触发==>");
          this.loadConversation();
        }
      }, 8000);
    },
    async jimInit() {
      const res = await getAuthPayLoad({ platForm: defaultPayload.platForm });
      if (res.status === 200 && !res.message) {
        const initObj = {
          appkey: res.data.appkey,
          random_str: res.data.randomStr,
          signature: res.data.signature,
          timestamp: res.data.timestamp,
          flag
        };
        await apiService.init(
          initObj,
          null,
          err => {
            this.$message.error("JIM init failed：" + err.message);
          },
          () => {
            this.$message.error("JIM init failed： connection timeout.");
          }
        );
      } else {
        throw new Error("Fail to invoke function: " + res.message);
      }
    },
    async loadConversation(data) {
      const res = await apiService.getConversation();
      if (res.code) {
        this.$message.error("Failed to getConversation：" + res.message);
      } else {
        const grConvr = res.conversations.filter(item => item.type === 4);
        for (let conversation of grConvr) {
          const groupObj = { gid: conversation.key };
          await apiService.getGroupInfo(groupObj).then(res => {
            if (res.code) {
              conversation.name = "#群名获取失败？？";
            } else {
              Object.assign(conversation, res.group_info);
            }
          });
        }
        this.loadConversationSuccess({
          conversation: grConvr,
          messageList:
            data !== undefined && data.length > 0
              ? data.filter(item => item.msg_type === 4)
              : []
        });
      }
      this.isLoaded = true;
    },
    loadConversationSuccess(payload) {
      this.filterRecentMsg(payload);
      this.setConversation(payload.conversation);
      if (payload.messageList.length > 0) {
        this.setMessageList(payload.messageList);
      }
    },
    // 添加最近一条聊天消息
    filterRecentMsg(payload) {
      for (let conversation of payload.conversation) {
        for (let messageList of payload.messageList) {
          if (Number(conversation.key) === Number(messageList.key)) {
            let msgs = messageList.msgs;
            if (msgs.length > 0) {
              msgs[msgs.length - 1].conversation_time_show = Util.reducerDate(
                msgs[msgs.length - 1].ctime_ms
              );
              conversation.recentMsg = msgs[msgs.length - 1];
            }
            messageList.ctime = conversation.ctime;
            break;
          }
        }
      }
      this.sortConversationByRecentMsg(payload);
    },
    sortConversationByRecentMsg(payload) {
      for (let conversation of payload.conversation) {
        if (conversation.recentMsg) {
          conversation.lastMsgTime = conversation.recentMsg.ctime_ms;
        } else {
          conversation.lastMsgTime = 0;
        }
      }
      let len = payload.conversation.length;
      let maxIndex;
      let temp;
      let topIndex = 0;

      for (let i = topIndex; i < len - 1; i++) {
        maxIndex = i;
        for (let j = i + 1; j < len; j++) {
          if (
            payload.conversation[j].lastMsgTime >
            payload.conversation[maxIndex].lastMsgTime
          ) {
            maxIndex = j;
          }
        }
        temp = Util.deepCopyObj(payload.conversation[i]);
        payload.conversation[i] = Util.deepCopyObj(
          payload.conversation[maxIndex]
        );
        payload.conversation[maxIndex] = temp;
      }
    },
    async receiveGroupMessage(data) {
      let promises = [];
      const messages = data.messages[0];
      const messageList = this.messageList;
      let avatarLoaded = false;
      if (data.messages[0].content.from_id === this.userInfo.userAccount) {
        return;
      }
      // 如果接收的是图片或者文件
      this.getMediaUrl(data, promises);
      // 判断是否消息列表中已经加载过头像
      for (let list of messageList) {
        if (Number(list.key) === Number(messages.key) && list.msgs.length > 0) {
          for (let i = list.msgs.length - 1; i >= 0; i--) {
            const hasLoadAvatar = list.msgs[i].content.hasOwnProperty(
              "avatarUrl"
            );
            if (
              list.msgs[i].content.from_id === messages.content.from_id &&
              hasLoadAvatar
            ) {
              messages.content.avatarUrl = list.msgs[i].content.avatarUrl;
              avatarLoaded = true;
              break;
            }
          }
          break;
        }
      }
      if (!avatarLoaded) {
        this.getMsgAvatarUrl(messages, promises);
      }
      await Promise.all(promises);
      this.receiveMessageSuccess(data);
      const notifyMsg =
        messages.content.msg_type === "text"
          ? messages.content.msg_body.text
          : messages.content.msg_type === "image"
            ? "[图片]"
            : messages.content.msg_type === "file"
              ? "[文件]"
              : "";
      this.$notify({
        title: "New Message",
        dangerouslyUseHTMLString: true,
        message: `<p> Name： ${messages.content.from_id} <br> ${notifyMsg} </p>`,
        position: "bottom-right"
      });
    },
    getMediaUrl(data, promises) {
      if (data.messages[0].content.msg_body.media_id) {
        const urlObj = { media_id: data.messages[0].content.msg_body.media_id };
        const pro = apiService.getResource(urlObj).then(res => {
          if (res.code) {
            data.messages[0].content.msg_body.media_url = "";
          } else {
            data.messages[0].content.msg_body.media_url = res.url;
          }
        });
        if (promises) {
          promises.push(pro);
        }
      }
    },
    async getMsgAvatarUrl(messages) {
      const username =
        messages.content.from_id !== this.userInfo.userAccount
          ? messages.content.from_id
          : messages.content.target_id;
      const userObj = {
        username,
        appkey: messages.content.from_appkey
      };
      const data = await apiService.getUserInfo(userObj);
      if (!data.user_info.avatar || data.user_info.avatar === "") {
        messages.content.avatarUrl = "";
      } else {
        const urlObj = { media_id: data.user_info.avatar };
        const res = await apiService.getResource(urlObj);
        if (res.code) {
          messages.content.avatarUrl = "";
        } else {
          messages.content.avatarUrl = res.url;
        }
      }
    },
    // 事件消息
    asyncEvent(data) {
      const msgIndex = this.messageList.findIndex(
        i => Number(i.key) === Number(data.gid)
      );
      switch (data.event_type) {
        // 账号在其他地方登陆web jchat
        case 1:
          this.$alert("您的账号在其他设备登录", "提示", {
            confirmButtonText: "确定",
            callback: this.logoutConsole
          });
          break;
        // 密码被其他设备修改的同步事件
        case 2:
          this.$alert("您的密码已在其他设备修改，请重新登录", "提示", {
            confirmButtonText: "确定",
            callback: this.logoutConsole
          });
          break;
        case 9:
          // 退群事件
          if (msgIndex !== -1) {
            if (!data.to_usernames) {
              console.log("====解散群组====");
              this.afterExitGroup(data.gid);
              this.$notify({
                title: "notify",
                message: "End of session" + data.group_name,
                position: "bottom-right"
              });
            } else if (
              data.to_usernames &&
              data.to_usernames[0].username !== this.userInfo.userAccount &&
              this.messageList[msgIndex].hasOwnProperty("memberList")
            ) {
              this.getGroupMembers({ key: data.gid });
            } else {
              // 自己退群
              this.afterExitGroup(data.gid);
            }
          }
          break;
        case 10:
          // 添加群成员事件
          if (data.extra === 0 || data.extra === 1 || data.extra === 2) {
            if (
              msgIndex !== -1 &&
              this.messageList[msgIndex].hasOwnProperty("memberList")
            ) {
              this.getGroupMembers({ key: data.gid });
            }
          }
          break;
        // 删除群成员
        case 11:
          if (data.to_usernames[0].username !== this.userInfo.userAccount) {
            if (
              msgIndex !== -1 &&
              this.messageList[msgIndex].hasOwnProperty("memberList")
            ) {
              this.getGroupMembers({ key: data.gid });
            }
          } else {
            this.afterExitGroup(data.gid);
          }
          break;
        case 65:
          if (!data.isOffline) {
            // 禁言事件
            if (data.extra === 1) {
              this.changeMemberSilence({
                gid: data.gid,
                to_usernames: data.to_usernames,
                isKeepSilence: true
              });
              // 取消禁言事件
            } else if (data.extra === 2) {
              this.changeMemberSilence({
                gid: data.gid,
                to_usernames: data.to_usernames,
                isKeepSilence: false
              });
            }
          }
          break;
        default:
      }
    },
    logoutConsole() {
      this.setOnlineStatus(0)
        .then(() => {
          this.$message.success(`Offline Successful!`);
        })
        .catch(err => {
          this.$message.error("Offline Failed： " + err.message);
        });
    },
    afterLogout() {
      this.isLoaded = false;
      this.hasOffline = 0;
    },
    duration() {
      const mstime = this.activeMsgList.ctime * 1000;
      const hours = moment().diff(moment(mstime), "hours");
      const minutes = moment().diff(moment(mstime), "minutes");
      return hours + ":" + (minutes % 60);
    }
  },
  created() {
    this.isLoaded = this.onlineStatus;
    if (this.activeMsgList) {
      this.communicationTime = this.duration();
    }
    const timer = setInterval(() => {
      if (this.activeMsgList) {
        this.communicationTime = this.duration();
      }
    }, 60000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  watch: {
    isLoaded(val) {
      if (val) {
        for (let message of this.noLoadedMessage) {
          this.receiveGroupMessage(message);
        }
        this.noLoadedMessage = [];
        for (let item of this.eventArr) {
          item.isOffline = true;
          this.asyncEvent(item);
        }
        this.eventArr = [];
      }
    },
    onlineStatus(val) {
      if (val) {
        this.init();
      } else {
        this.afterLogout();
      }
    },
    active(val) {
      if (val.activeIndex) {
        this.communicationTime = this.duration();
      }
    }
  },
  filters: {
    time(mtime) {
      return parseTime(mtime);
    }
  }
};
</script>

<template>
  <div>
    <div class="cs-console-container">
      <div class="cs-console-top-container">
        <span
          class="cs-console-top-title"
        >Online CS Console-{{userInfo.userAccount + (onlineStatus===0?'Offline':'Online')}}</span>
        <LoginMenu />
      </div>
      <div class="cs-console-main-container" v-if="onlineStatus">
        <div class="cs-console-left-container">
          <div class="cs-console-left-info">
            <p>Serverd Client Number：{{csInfo.cusNme}}</p>
            <p>Online Time：{{csInfo.hourtotal + parseInt(csInfo.minutetotal/60)}}Hour {{csInfo.minutetotal%60}}Minute</p>
          </div>
          <ConversationList class="cs-left-conversation-list" v-loading="!isLoaded" />
        </div>
        <div class="cs-console-center-container">
          <div class="cs-console-center-userInfo">
            <span>Name: {{userInfo.userName}}</span>
            <span>Gender: {{userInfo.userSex===1? 'Male' : 'Female'}}</span>
            <span>Account: {{userInfo.userAccount}}</span>
            <span>Contact No: {{userInfo.officePhone}}</span>
          </div>
          <div v-if="active.activeIndex !== -1">
            <div class="cs-console-center-chatInfo">
              <span>Chat Created Time: {{activeMsgList? activeMsgList.ctime*1000 : '' | time}}</span>
              <span>Commutication Time: {{communicationTime}}</span>
            </div>
            <ChatPanel />
            <InputBox />
          </div>
        </div>
        <div class="cs-console-right-container">
          <ClientInformation v-if="active.activeIndex !== -1" />
          <OnlineMembers />
          <GroupMembers v-if="active.activeIndex !== -1" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cs-console-container {
  display: table;
  width: 100%;
  height: 100%;
  min-width: 900px;
  // margin: 0 20px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgb(204, 204, 204);
  .cs-console-top-container {
    display: flex;
    height: 70px;
    background: rgb(79, 144, 241);
    justify-content: space-between;
    align-items: center;
    padding: 0 25px;
    .cs-console-top-title {
      color: #fff;
      font-size: 20px;
    }
  }
  .cs-console-left-container {
    display: table-cell;
    float: left;
    width: 250px;
    height: 100%;
    border-right: 1px solid #ddd;
    .cs-console-left-info {
      border: 1px solid #ddd;
      background: rgb(245, 243, 243);
      padding: 8px;
      line-height: 15px;
      height: 95px;
    }
    .cs-console-left-conversation-list {
      height: 787px;
    }
  }
  .cs-console-right-container {
    display: table-cell;
    width: 250px;
    height: 882px;
    border-left: 1px solid #ddd;
  }
  .cs-console-center-container {
    width: calc(100% - 500px);
    min-width: 400px;
    height: 100%;
    display: table-cell;
    position: relative;
    float: left;
    .cs-console-center-userInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #ddd;
      height: 40px;
    }
    .cs-console-center-chatInfo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: rgb(245, 243, 243);
      padding: 8px;
      border-bottom: 1px solid #ddd;
      height: 40px;
    }
  }
}
</style>
