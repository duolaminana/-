export const JIM = new window.JMessage({ debug: true });
const timeoutData = { code: -2 };

export function init(initObj, success, error, timeout) {
  return callback(JIM.init(initObj), success, error, timeout);
}
// 发送或者转发单聊文本
export function sendSingleMsg(singleMsg, success, error, timeout) {
  return msgCallback(JIM.sendSingleMsg(singleMsg), success, error, timeout);
}
export function login(loginObj, success, error, timeout) {
  return callback(JIM.login(loginObj), success, error, timeout);
}
export function sendGroupMsg(groupleMsg, success, error, timeout) {
  return msgCallback(JIM.sendGroupMsg(groupleMsg), success, error, timeout);
}
// 发送或者转发群聊图片
export function sendGroupPic(groupPic, success, error, timeout) {
  return msgCallback(JIM.sendGroupPic(groupPic), success, error, timeout);
}
// 发送或者转发群聊文件
export function sendGroupFile(groupFile, success, error, timeout) {
  return msgCallback(JIM.sendGroupFile(groupFile), success, error, timeout);
}
// 获取会话列表
export function getConversation(success, error, timeout) {
  return callback(JIM.getConversation(), success, error, timeout);
}
// 获取群组信息
export function getGroupInfo(groupObj, success, error, timeout) {
  return callback(JIM.getGroupInfo(groupObj), success, error, timeout);
}
// 获取群列表
export function getGroups(success, error, timeout) {
  return callback(JIM.getGroups(), success, error, timeout);
}
// 获取静态资源路径
export function getResource(urlObj, success, error, timeout) {
  return callback(JIM.getResource(urlObj), success, error, timeout);
}
// 获取群成员
export function getGroupMembers(groupObj, success, error, timeout) {
  return callback(JIM.getGroupMembers(groupObj), success, error, timeout);
}
// 获取用户资料
export function getUserInfo(userObj, success, error, timeout) {
  return callback(JIM.getUserInfo(userObj), success, error, timeout);
}
export function isInit() {
  return JIM.isInit();
}
export function isLogin() {
  return JIM.isLogin();
}
export function loginOut(success) {
  return new Promise((resolve) => {
    JIM.loginOut();
    if (success && success instanceof Function) {
      success();
    }
    resolve();
  });
}

// 回调函数
function callback(obj, ...args) {
  return new Promise((resolve) => {
    if (obj && obj.onSuccess) {
      obj.onSuccess((successData) => {
        if (successData.code) {
          delete successData.code;
        }
        if (args[0] && args[0] instanceof Function) {
          args[0](successData);
        }
        resolve(successData);
      }).onFail((errorData) => {
        if (args[1] && args[1] instanceof Function) {
          args[1](errorData);
        }
        resolve(errorData);
      }).onTimeout(() => {
        if (args[2] && args[2] instanceof Function) {
          args[2]();
        }
        resolve(timeoutData);
      });
    }
  });
}
// 发送消息回调函数
function msgCallback(obj, ...args) {
  return new Promise((resolve) => {
    if (obj && obj.onSuccess) {
      obj.onSuccess((successData, msgs) => {
        if (successData.key) {
          msgs.key = successData.key;
        }
        msgs.unread_count = successData.unread_count || 0;
        if (args[0] && args[0] instanceof Function) {
          args[0](msgs);
        }
        resolve(msgs);
      }).onFail((errorData) => {
        if (args[1] && args[1] instanceof Function) {
          args[1](errorData);
        }
        resolve(errorData);
      }).onTimeout(() => {
        if (args[2] && args[2] instanceof Function) {
          args[2]();
        }
        resolve(timeoutData);
      });
    }
  });
}
