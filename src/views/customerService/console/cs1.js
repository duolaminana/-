import request from '@/utils/request'

// 获取IM鉴权信息PCWEB用
export function getAuthPayLoad(params) {
  return request.get(`/backend-cs/cs/getAuthPayLoad`, { params });
}
// 返回客服在线状态
export function getCsOnlineList() {
  return request.get(`/backend-cs/cs/getCsOnlineList`);
}
// 获取聊天明细
export function getRecordList(data) {
  return request.post(`/backend-cs/cs/getRecordList`, data);
}
// 发送文本消息
export function sendTextMessage(data) {
  return request.post(`/backend-cs/cs/sendTextMessage`, data);
}
// 设置在线离线状态，返回小时在线总和、分钟在线总和、服务的客户数
export function maintenanceOnline(params) {
  return request.get(`/backend-cs/cs/chatRecord/maintenanceOnline`, { params });
}
// 增加群成员
export function addGroupMember(data) {
  return request.post(`/backend-cs/cs/addGroupMember`, data);
}
// 通过账号获取客户信息
export function getUserFrontendByUserAccount(params) {
  return request.get(`/backend-cs/cs/staffInfo/getUserFrontendByUserAccount`, { params });
}
// 退群
export function exitGroup(data) {
  return request.post(`/backend-cs/cs/outGroup`, data)
}
// 客服监控管理列表查询
export function getCsChatRecordForMonitor(data) {
  return request.post(`/backend-cs/cs/chatRecord/getCsChatRecordForMonitor`, data);
}
