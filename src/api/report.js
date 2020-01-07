import request from '@/utils/request'

// 客户交易报表
export function queryClientVolume(option) {
  return request.post(`/backend-admin/report/clientVolumeCount`, option)
}

// 产品交易报表
export function queryProductVolume(option) {
  return request.post(`/backend-admin/report/productVolumeCount`, option)
}

// 供应商交易报表
export function querySupplierVolume(option) {
  return request.post(`/backend-admin/report/supplierVolumeCount`, option)
}

// 标准产品交易报表
export function queryStandardProductVolume(option) {
  return request.post(`/backend-admin/report/standardProductsPriceCount`, option)
}
