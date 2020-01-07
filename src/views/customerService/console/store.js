import * as apiService from './jmApiService.js';
import { getActiveIndex, deepCopyObj } from "./csUtil";
import { getCsOnlineList, sendTextMessage, getUserFrontendByUserAccount, maintenanceOnline } from "./cs1.js";
import { pageNumber, defaultPayload } from "./cs.config.js";
import { getCsPreferedLanguageList } from "@/api/customerService";

const cs = {
  namespaced: true,
  state: {
    onlineStatus: 0,
    conversation: [],
    messageList: [],
    active: {
      name: '',
      key: '',
      activeIndex: -1,
      type: 0,
      appkey: ''
    },
    onlineList: [],
    preferedLanguage: [],
    csInfo: {
      hourtotal: 0,
      minutetotal: 0,
      cusNme: 0
    }
  },
  getters: {
    activeMsgList: state => {
      if (state.messageList.length === 0 || state.active.activeIndex === -1) {
        return null;
      } else {
        return state.messageList.find(item => item.key === state.active.key);
      }
    },
    memberList: (state, getters) => {
      if (state.active.activeIndex === -1) {
        return null;
      } else {
        return getters.activeMsgList.memberList;
      }
    }
  },
  mutations: {
    SET_ONLINE_STATUS(state, value) {
      state.onlineStatus = value;
    },
    SET_CSINFO(state, value) {
      state.csInfo = { ...value };
    },
    INIT_ACTIVE(state) {
      state.active.activeIndex = -1;
    },
    SET_PREFERED_LANGUAGE(state, value) {
      state.preferedLanguage = value;
    },
    SET_CONVERSATION(state, value) {
      state.conversation = value;
    },
    SET_MESSAGELIST(state, value) {
      state.messageList = value;
    },
    SET_MEMBERLIST(state, value) {
      const activeIndex = getActiveIndex(state.messageList, value.item);
      state.messageList.splice(activeIndex, 1, { ...state.messageList[activeIndex], memberList: value.memberList });
    },
    SET_ACTIVE(state, value) {
      state.active = deepCopyObj(value);
      state.active.activeIndex = getActiveIndex(state.messageList, value);
    },
    SPLICE_MESSAGELIST(state, value) {
      state.messageList.splice(value.activeIndex, 1, Object.assign(state.messageList[value.activeIndex], value.messageList));
    },
    ADD_MESSAGE(state, value) {
      if (value.conversationItem) {
        state.messageList.push(value.msg);
        state.conversation.splice(0, 0, value.conversationItem);
      } else {
        for (let messageList of state.messageList) {
          if (Number(messageList.key) === Number(value.key)) {
            messageList.msgs.push(value);
            break;
          }
        }
        for (let i = 0; i < state.conversation.length; i++) {
          if (Number(state.conversation[i].key) === Number(value.key)) {
            state.conversation[i].recentMsg = value;
            // 将当前会话放在第一位
            const item = state.conversation.splice(i, 1);
            state.conversation.splice(0, 0, item[0]);
            break;
          }
        }
      }
    },
    SET_ONLINELIST(state, value) {
      state.onlineList = value;
    },
    REMOVE_MESSAGE(state, index) {
      state.messageList.splice(index, 1);
    },
    REMOVE_CONVERSATION(state, index) {
      state.conversation.splice(index, 1);
    },
    CHANGE_MEMBER_SILENCE(state, { index, isKeepSilence, userAccount, to_usernames }) {
      for (let member of state.messageList[index].memberList) {
        for (let user of to_usernames) {
          if (member.username === user.username) {
            member.keep_silence = isKeepSilence;
          }
        }
        /*         if (userAccount === member.username) {
          member.keep_silence = isKeepSilence;
        } */
      }
    },
    SET_STATUS(state, status) {
      state.status = status;
    }
  },
  actions: {
    async setOnlineStatus({ commit, dispatch, rootGetters }, chatStatus) {
      const res = await maintenanceOnline({
        chatStatus,
        csAccount: rootGetters.userInfo.userAccount
      })
      if (res.status === 200 && !res.message) {
        commit('SET_ONLINE_STATUS', chatStatus);
        if (chatStatus === 1) {
          commit('SET_CSINFO', res.data);
          getCsPreferedLanguageList({
            pageNum: 1,
            pageSize: 999
          }).then(
            result => {
              if (result.status === 200 && !result.message) {
                commit('SET_PREFERED_LANGUAGE', result.data.records);
              } else {
                throw new Error(result.message);
              }
            }
          );
        } else {
          apiService.JIM.loginOut();
          dispatch('initActive');
        }
        return res;
      } else {
        throw new Error(res.message);
      }
    },
    initActive({ commit }) {
      commit('INIT_ACTIVE');
    },
    changeActive({ commit }, data) {
      commit('SET_ACTIVE', data);
    },
    setConversation({ commit }, data) {
      commit('SET_CONVERSATION', data);
    },
    setMessageList({ commit }, data) {
      commit('SET_MESSAGELIST', data);
    },
    getSourceUrl({ commit, state }, data) {
      const msgList = state.messageList;
      const activeIndex = getActiveIndex(state.messageList, data);
      const msgs = msgList[activeIndex].msgs;
      if (msgs.length >= 1) {
        for (let i = msgs.length - 1; i > msgs.length - pageNumber && i >= 0; i--) {
          if (msgs[i].hasLoad) {
            continue;
          }
          msgs[i].hasLoad = true;
          const msgBody = msgs[i].content.msg_body;
          if (msgBody.media_id && !msgBody.media_url) {
            const urlObj = { media_id: msgBody.media_id };
            apiService.getResource(urlObj).then((urlInfo) => {
              if (urlInfo.code) {
                msgs[i].content.msg_body.media_url = "";
              } else {
                msgs[i].content.msg_body.media_url = urlInfo.url;
                commit('SET_MESSAGELIST', msgList);
              }
            });
          }
        }
      }
    },
    // 获取群成员信息
    async getGroupMembers({ commit }, item) {
      const infoObj = { gid: item.key };
      const data = await apiService.getGroupMembers(infoObj);
      if (data.code) {
        this.errorFn(data);
      } else {
        commit('SET_MEMBERLIST', { memberList: data.member_list, item: item });
        for (let member of data.member_list) {
          if (member.avatar !== '') {
            const urlObj = { media_id: member.avatar };
            await apiService.getResource(urlObj).then((result) => {
              if (!result.code) {
                member.avatarUrl = result.url;
                commit('SET_MEMBERLIST', { memberList: data.member_list, item: item });
              }
            });
          }
        }
      }
    },
    getMemberAvatarUrl({ state, commit, rootGetters }, item) {
      let userArr = [];
      const messageList = state.messageList[state.active.activeIndex];

      for (let i = messageList.msgs.length - 1; i > messageList.msgs.length - pageNumber && i >= 0; i--) {
        // 如果是已经加载过头像的用户
        let avatarLoaded = false;
        if (messageList.hasOwnProperty("memberList")) {
          for (let member of messageList.memberList) {
            if (member.username === messageList.msgs[i].content.from_id) {
              messageList.msgs[i].content.avatarUrl = member.avatarUrl;
              avatarLoaded = true;
              break;
            }
          }
        }
        if (avatarLoaded) {
          continue;
        }
        messageList.msgs[i].content.avatarUrl = '';
        // 第一次加载头像的用户
        if (messageList.msgs[i].content.from_id !== rootGetters.userInfo.userAccount &&
          userArr.indexOf(messageList.msgs[i].content.from_id) < 0) {
          userArr.push(messageList.msgs[i].content.from_id);
        }
      }
      for (let user of userArr) {
        const userObj = {
          username: user
          // appKey:
        };
        apiService.getUserInfo(userObj).then((data) => {
          if (!data.code && data.user_info.avatar !== '') {
            const urlObj = { media_id: data.user_info.avatar };
            apiService.getResource(urlObj).then((urlInfo) => {
              if (!urlInfo.code) {
                for (let i = messageList.msgs.length - 1; i > messageList.msgs.length - pageNumber && i >= 0; i--) {
                  if (messageList.msgs[i].content.from_id === user) {
                    messageList.msgs[i].content.avatarUrl = urlInfo.url;
                  }
                }
                commit('SPLICE_MESSAGELIST', { messageList: messageList, activeIndex: getActiveIndex(state.messageList, item) });
              }
            });
          }
        });
      }
    },
    async sendGroupMsg({ commit, state, rootGetters }, msg) {
      await sendTextMessage({
        ...defaultPayload,
        targetId: state.active.key,
        textMessage: msg.content.msg_body.text,
        fromId: rootGetters.userInfo.userAccount,
        chatRecordBId: state.active.desc.split("#")[1]
      }).then((res) => {
        if (res.status === 200 && !res.message) {
          msg.key = state.active.key;
          msg.msg_id = res.data;
          commit('ADD_MESSAGE', msg);
        } else {
          throw new Error(res.message);
        }
      }).catch(err => { throw new Error(err.message); });
      /* const res1 = await apiService.sendGroupMsg({
              target_gid: state.active.key,
              content: msg.content.msg_body.text
            });
            if (!res1.code) {
              res.ctime_ms = ctime_ms;
              commit('ADD_MESSAGE', res);
            } */
    },
    async sendGroupPic({ commit }, img) {
      const res = await apiService.sendGroupPic(img.groupPicFormData);
      if (res.code) {
        throw new Error(res.message);
      } else {
        res.content.msg_body.media_url = img.msgs.content.msg_body.media_url;
        commit('ADD_MESSAGE', { ...res, ctime_ms: img.msgs.ctime_ms, msg_type: 4 });
      }
    },
    async sendGroupFile({ commit }, file) {
      const res = await apiService.sendGroupFile(file.groupFile);
      if (res.code) {
        throw new Error(res.message);
      } else {
        commit('ADD_MESSAGE', { ...res, ctime_ms: file.msgs.ctime_ms, msg_type: 4 });
      }
    },
    receiveMessageSuccess({ dispatch, commit, state }, payload) {
      let message = payload.messages[0];
      message.content.name = message.content.from_id;
      message.content.nickName = message.content.from_name;
      message.content.appkey = message.content.from_appkey;

      let convLoaded = false;
      // 如果发送人在会话列表里
      for (let a = 0; a < state.conversation.length; a++) {
        if (Number(state.conversation[a].key) === Number(message.key)) {
          if (message.content.target_name === '') {
            message.content.target_name = state.conversation[a].name;
          }
          convLoaded = true;
        }
      }
      commit('ADD_MESSAGE', payload.messages[0]);
      // 如果发送人不在会话列表里
      if (!convLoaded) {
        dispatch('addMessageUserNoConversation', { payload, message });
      }
    },
    async addMessageUserNoConversation({ commit, state }, { payload, message }) {
      let msg;
      let conversationItem;
      msg = {
        key: message.key,
        msgs: [
          message
        ],
        content: message.content,
        type: 4
      };
      payload.messages[0].conversation_time_show = 'today';
      payload.messages[0].time_show = 'today';
      conversationItem = {
        key: message.key,
        mtime: message.ctime_ms,
        name: message.content.target_name,
        type: 4,
        extras: {},
        recentMsg: payload.messages[0]
      };
      const res = await apiService.getGroupInfo({ gid: message.key });
      if (res.code) {
        conversationItem.name = "#群名获取失败？？";
      } else {
        Object.assign(conversationItem, res.group_info);
      }
      msg.ctime = conversationItem.ctime;
      commit('ADD_MESSAGE', { msg, conversationItem });
    },
    async getOnlineList({ commit }) {
      const res = await getCsOnlineList();
      if (res.status === 200) {
        commit('SET_ONLINELIST', res.data);
      }
    },
    afterExitGroup({ commit, state }, gid) {
      let msgIndex = state.messageList.findIndex(
        i => Number(i.key) === Number(gid)
      )
      if (msgIndex !== -1) {
        commit('REMOVE_MESSAGE', msgIndex);
      }
      let convIndex = state.conversation.findIndex(
        i => Number(i.key) === Number(gid)
      )
      if (convIndex !== -1) {
        commit('REMOVE_CONVERSATION', convIndex);
      }
      if (convIndex !== state.conversation.length && convIndex !== -1) {
        commit('SET_ACTIVE', state.conversation[convIndex]);
      } else if (convIndex === state.conversation.length && convIndex !== 0) {
        commit('SET_ACTIVE', state.conversation[convIndex - 1]);
      } else {
        commit('SET_ACTIVE', {
          name: '',
          key: '',
          activeIndex: -1,
          type: 0,
          appkey: ''
        });
      }
    },
    changeMemberSilence({ commit, state, rootGetters }, { gid, to_usernames, isKeepSilence }) {
      let index = state.messageList.findIndex(
        i => Number(i.key) === Number(gid)
      )
      if (
        index !== -1 &&
        state.messageList[index].hasOwnProperty("memberList")// && to_usernames.indexOf(rootGetters.userInfo.userAccount)
      ) {
        commit('CHANGE_MEMBER_SILENCE', { index, isKeepSilence, userAccount: rootGetters.userInfo.userAccount, to_usernames });
      }
    },
    getClientInfo(conversation) {
      getUserFrontendByUserAccount();
    }
  }
};

export default cs;
