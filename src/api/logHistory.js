import request from '@/utils/request'
import axios from "axios";
import { uploadBaseApi } from '@/api/common'
import { getToken } from '@/utils/auth'

// --------------------------日志管理-----------------------------

// 分页查询-用户登录历史
export function selectUserLoginHistoryListApi(option) {
  return request.post(`/backend-admin/userLoginHistory/selectUserLoginHistoryList`, option)
}

/**
 *
 * 导出用户登录表-导出
 */
export function exportByUserLoginHistoryByApi(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-auth/rest/userHistory/exportLoginHistory`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}
