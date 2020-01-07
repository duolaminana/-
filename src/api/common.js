import request from '@/utils/request'
const baseUrl = require('@/api/config.js');

let uploadApi = '';
if (process.env.NODE_ENV === 'development') {
  uploadApi = baseUrl.baseUrl
} else {
  uploadApi = process.env.VUE_APP_UPLOAD_API
}

export const uploadBaseApi = uploadApi;

/* 公共的接口api */

// 下载文件
export function downloadFile1(option) {
  return request.get(`/backend-oss/oss/downLoad`, { params: option });
}

export const downloadFile = uploadApi + '/backend-oss/oss/downLoad';

// 上传图片路径
// export const uploadActionUrl = process.env.VUE_APP_UPLOAD_API + '/supplier/upload/uploadFile';

export const uploadActionUrl = uploadApi + '/backend-oss/oss/upload';

// // 多附件打包下载
// export function downloadFilesList(option) {
//   return request.get(`/supplier/upload/downloadFilesList`, { params: option });
// }
