import request from '@/utils/request'
import axios from "axios";
import { uploadBaseApi } from '@/api/common'
import { getToken } from '@/utils/auth'

// --------------------------------------------------咨询分类---------------------------------------------------

// 分页查询
export function selectNewsCategoryByPageHelper(option) {
  return request.get('/backend-admin/newsCategory/selectNewsCategoryByPageHelper', { params: option });
}

// 无分页查询
export function selectNewsCategoryList(option) {
  return request.get('/backend-admin/newsCategory/selectNewsCategoryList', { params: option });
}

// 新增
export function saveNewsCategory(option) {
  return request.post('/backend-admin/newsCategory/saveNewsCategory', option);
}

// 批量删除
export function deleteNewsCategoryByIds(option) {
  return request.post('/backend-admin/newsCategory/deleteNewsCategoryByIds', option);
}

// 修改
export function updateNewsCategory(option) {
  return request.post('/backend-admin/newsCategory/updateNewsCategory', option);
}

// 禁用启用
export function updateNewsCategoryStatus(option) {
  return request.get('/backend-admin/newsCategory/updateNewsCategoryStatus', { params: option });
}
/**
 *
 * 导出资讯类别列表-导出
 */
export function exportByNewsCategoryExcel(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-admin/newsCategory/exportByNewsCategory`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

// ---------------------------------------------------咨询内容管理--------------------------------------------
// 分页查询
export function selectNewsInfoList(option) {
  return request.get('/backend-admin/newsInfo/selectNewsInfoList', { params: option });
}

// 新增
export function saveNewsInfo(option) {
  return request.post('/backend-admin/newsInfo/saveNewsInfo', option);
}

// 修改
export function updateNewsInfo(option) {
  return request.post('/backend-admin/newsInfo/updateNewsInfo', option);
}

// 禁用启用
export function updateNewsInfoStatus(option) {
  return request.get('/backend-admin/newsInfo/updateNewsInfoStatus', { params: option });
}

// 批量删除
export function deleteNewsInfoByIds(option) {
  return request.post('/backend-admin/newsInfo/deleteNewsInfoByIds', option);
}

// 详情
export function selectNewsInfoById(option) {
  return request.get('/backend-admin/newsInfo/selectNewsInfoById', { params: option });
}

/**
 *
 * 导出资讯内容列表-导出
 */
export function exportByNewsInfoExcel(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-admin/newsInfo/exportByNewsInfo`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}
