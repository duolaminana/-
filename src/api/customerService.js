import request from '@/utils/request';
import { uploadBaseApi } from '@/api/common'
import axios from "axios";
import { getToken } from '@/utils/auth'

// 分页查找客服人员分页数据,PageHelper版,返回PageInfo
export function getPageCstaffInfo(option) {
  return request.post(`/backend-cs/cs/staffInfo/pageCstaffInfoFullVO`, option);
}

// 通过账号获取客服用户信息
export function getUserBackendAccountByUserAccount(option) {
  return request.get(`/backend-cs/cs/staffInfo/getUserBackendAccountByUserAccount`, { params: option });
}

// 获取有效的分组作为选项
export function queryGroupChooseList(option) {
  return request.get(`/backend-cs/cs/staffInfo/queryGroupChooseList`, { params: option });
}

// 获取客服服务的公司信息
export function getCompanyInfoByCsAccountBid(option) {
  return request.get(`/backend-cs/cs/staffInfo/getCompanyInfoByCsAccountBid`, { params: option });
}

// 根据客服人员的BID和客服账号获取客服详情信息
export function getCsStaffInfoByBidAndCsAccount(option) {
  return request.get(`/backend-cs/cs/staffInfo/getCsStaffInfoByBidAndCsAccount`, { params: option });
}

// 模糊查询用户账号
export function getUserAccountLike(option) {
  return request.get(`/backend-cs/cs/staffInfo/getUserAccountLike`, { params: option });
}

// 创建客服人员信息以及客服分组成员表
export function creatCstaffInfoAndGroup(option) {
  return request.post(`/backend-cs/cs/staffInfo/creatCstaffInfoAndGroup`, option);
}

// 更新客服人员信息以及客服分组成员表
export function updateCstaffInfoAndGroup(option) {
  return request.post(`/backend-cs/cs/staffInfo/updateCstaffInfoAndGroup`, option);
}

// 启用、停用、作废客服
export function updateStatus(option) {
  return request.request({
    url: `/backend-cs/cs/staffInfo/updateStatus`,
    method: 'post',
    params: option
  });
}

/**
 * -导出
 */
export function exportExcelProductList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-cs/cs/staffInfo/exportStaffInfoExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

// 分页查找客服分组列表查询
export function getGroupInfoFullVO(option) {
  return request.post(`/backend-cs/cs/group/getGroupInfoFullVO`, option);
}

// 新建分组
export function creatGroup(option) {
  return request.request({
    url: `/backend-cs/cs/group/creatGroup`,
    method: 'post',
    params: option
  });
}

// 查询客服分组基本信息
export function getGroupInfoFullGroupBID(option) {
  return request.get(`/backend-cs/cs/group/getGroupInfoFullGroupBID`, { params: option });
}

// 查询客服分组成员
export function getAccountBidListByGroupBID(option) {
  return request.get(`/backend-cs/cs/group/getAccountBidListByGroupBID`, { params: option });
}

// 启用、停用、作废分组
export function updateGroupStatus(option) {
  return request.request({
    url: `/backend-cs/cs/group/updateStatus`,
    method: 'post',
    params: option
  });
}

// 修改分组
export function updateGroup(option) {
  return request.request({
    url: `/backend-cs/cs/group/updateGroup`,
    method: 'post',
    params: option
  });
}

// 分页查找客服人员分页数据,PageHelper版,返回PageInfo
export function getCsPreferedLanguageList(option) {
  return request.post(`/backend-cs/cs/language/getCsPreferedLanguageList`, option);
}

// 创建常用语言
export function addLanguage(option) {
  return request.post(`/backend-cs/cs/language/addLanguage`, option);
}

// 获取当前语言的个数
export function getLanguageNum(option) {
  return request.get(`/backend-cs/cs/language/getLanguageNum`, { params: option });
}

// 获取常用语言基本信息
export function getLanguageById(option) {
  return request.get(`/backend-cs/cs/language/getLanguageById`, { params: option });
}

// 修改常用语言
export function updateLanguage(option) {
  return request.request({
    url: `/backend-cs/cs/language/updateLanguage`,
    method: 'post',
    params: option
  });
}

// 作废常用语言
export function updateStatusToDel(option) {
  return request.request({
    url: `/backend-cs/cs/language/updateStatusToDel`,
    method: 'post',
    params: option
  });
}

// 查询客服列表（客服服务记录管理）
export function getCstaffInfoForRecord(option) {
  return request.get(`/backend-cs/cs/staffInfo/getCstaffInfoForRecord`, { params: option });
}

// 查询客服在线记录
export function getCsOnlineRecord(option) {
  return request.post(`/backend-cs/cs/chatRecord/getCsOnlineRecord`, option);
}

// 查询客服服务记录
export function getServiceRecord(option) {
  return request.post(`/backend-cs/cs/chatRecord/getServiceRecord`, option);
}
