import request from '@/utils/request'
import axios from "axios";
import { uploadBaseApi } from '@/api/common'
import { getToken } from '@/utils/auth'

// 销售调价单列表分页
export function getSaleModifyPriceList(option) {
  return request.get(`/backend-price/productPriceAdjust/pageph`, { params: option });
}

// 新增销售调价单
export function addModifyPrice(option) {
  return request.post(`/backend-price/productPriceAdjust/saveUpdate`, option);
}

// 更新销售调价单
export function updateModifyPrice(option) {
  return request.post(`/backend-price/productPriceAdjust/update`, option);
}
// 删除销售调价单
export function deleteModifyPrice(option) {
  return request.post(`/backend-price/productPriceAdjust/delete`, option);
}

// 销售调价单详情
export function getModifyPriceDetail(option) {
  return request.get(`/backend-price/productPriceAdjust/detailByBId`, { params: option });
}

// 销售调价单sku列表
export function getModifyPriceSkuList(option) {
  return request.get(`backend-price/productPriceAdjustSku/detailPageList`, { params: option });
}

// 销售调价单sku列表
export function getModifySalePriceList(option) {
  return request.get(`backend-price/productPriceAdjustSku/detailEditPageList`, { params: option });
}

// 批量添加调价SKU
export function addBatchModifyPrice(option) {
  return request.post(`/backend-price/productPriceAdjustSku/saveBatch`, option);
}

// 查询SKU阶梯
export function serarchSkuLadder(option) {
  return request.get(`/backend-price/productPriceAdjustSku/listAdjustPrice`, { params: option });
}

// 查询编辑中的SKU阶梯
export function searchEditSkuLadder(option) {
  return request.get(`/backend-price/productPriceAdjustSku/listEditAdjustPrice`, { params: option });
}

// 删除调价单商品
export function deleteModifyPriceSku(option) {
  return request.delete(`/backend-price/productPriceAdjustSku/delete`, { params: option });
}

// 调价单梯度编辑
export function updateSkuSalePrice(option) {
  return request.post(`/backend-price/productPriceAdjustSku/saveUpdate`, option);
}

// 销售价格管理分页
export function getSalePriceList(option) {
  return request.post(`/backend-price/productPriceGradient/pageph`, option);
}

// 销售价格管理sku列表
export function getSalePriceSkuList(option) {
  return request.get(`/backend-price/productPriceGradient/list`, { params: option });
}

// 供应商调价单列表分页
export function getSupplierModifyPriceList(option) {
  return request.post(`/backend-price/supplierPriceAdjust/pageph`, option);
}

// 新增供应商调价单
export function addSupplierModifyPrice(option) {
  return request.post(`/backend-price/supplierPriceAdjust/save`, option);
}

// 更新供应商调价单
export function updateSupplierModifyPrice(option) {
  return request.post(`/backend-price/supplierPriceAdjust/update`, option);
}
// 删除供应商调价单
export function deleteSupplierModifyPrice(option) {
  return request.post(`/backend-price/supplierPriceAdjust/batchDelete`, option);
}

// 供应商调价单详情
export function getSupplierModifyPriceDetail(option) {
  return request.post(`/backend-price/supplierPriceAdjust/selectById`, option);
}

// 供应商调价单sku列表分页
export function getSupplierModifyPriceSkuList(option) {
  return request.get(`/backend-price/supplierAdjustSku/pageph`, { params: option });
}

// 供应商调价单sku列表不分页
export function getAllSupplierModifyPriceSkuList(option) {
  return request.get(`/backend-price/supplierAdjustSku/selectByAdjustBid`, { params: option });
}

// 供应商批量添加调价SKU
export function addSupplierBatchModifyPrice(option) {
  return request.post(`/backend-price/supplierAdjustSku/batchSave`, option);
}

// 销售价格调价历史记录
export function getSalePriceSkuHistoryList(option) {
  return request.get(`/backend-price/productPriceAdjustSku/priceAdjustSkuPageList`, { params: option });
}

// 供应商调价商品修改
export function updateSkuSupplierPrice(option) {
  return request.post(`/backend-price/supplierAdjustSku/update`, option);
}

// 供应商调价商品批量修改
export function updateBatchSkuSupplierPrice(option) {
  return request.post(`/backend-price/supplierAdjustSku/batchUpdateById`, option);
}

// 删除供应商调价单商品
export function deleteSupplierModifyPriceSku(option) {
  return request.post(`/backend-price/supplierAdjustSku/batchDelete`, option);
}

// -----------------------------------价格管理--供应商价格管理-------------------------------------------
// 查询供应商调价历史
export function getAdjustSkuBySkuIdApi(option) {
  return request.get(`/backend-price/supplierAdjustSku/getAdjustSkuBySkuId`, { params: option });
}

// 查询供应商调价历史
export function getAdjustSkuBySkuIdAndSupplierId(option) {
  return request.get(`/backend-price/supplierAdjustSku/getAdjustSkuBySkuIdAndSupplierId`, { params: option });
}

// 供应商价格分页查询
export function selectPageSupplierListApi(option) {
  return request.get(`/backend-price/supplierPriceAdjust/selectPageSupplier`, { params: option });
}
// -----------------------------------价格管理--商品供应价格查询-------------------------------------------
// 商品供应价格查询
export function selectPageProductSku(option) {
  return request.get(`/backend-price/supplierPriceAdjust/selectPageProductSku`, { params: option });
}

// 通过商品sku查询商品报价明细
export function selectSupplierDetailBySkuBid(option) {
  return request.get(`/backend-price/supplierPriceAdjust/selectSupplierDetailBySkuBid`, { params: option });
}

// 通过商品bid查询商品报价明细
export function selectSupplierDetailByProductBid(option) {
  return request.get(`/backend-price/supplierPriceAdjust/selectSupplierDetailByProductBid`, { params: option });
}

export function getSupplierDetailBySkuBid(option) {
  return request.get(`/backend-price/supplierPriceAdjust/	selectSupplierDetailBySkuBid`, { params: option });
}

export function getSupplierDetailByProductBid(option) {
  return request.get(`/backend-price/supplierPriceAdjust/	selectSupplierDetailByProductBid`, { params: option });
}

export function getProductSkuList(option) {
  return request.post(`/backend-product/productSkuShelf/selectSkuPageInfo`, option);
}
// 查询商品成本价列表(分页)
export function getCostPriceChildList(option) {
  return request.post(`/backend-price/productCostPrice/pagephProductCostPrice`, option);
}
// 获取SKU
export function selectProductSkuList(option) {
  return request.post(`/backend-price/productCostPrice/selectProductSkuList`, option);
}
// 修改
export function updateProductCostPrice(option) {
  return request.post(`/backend-price/productCostPrice/updateProductCostPrice`, option);
}

// 新增
export function saveProductCostPrice(option) {
  return request.post(`/backend-price/productCostPrice/saveProductCostPrice`, option);
}
// -----------------------------------价格管理--可售价格管理-------------------------------------------
// 可售列表
export function getSaleableList(option) {
  return request.get(`/backend-price/sellablePriceAdjust/pagephSellablePriceAdjust`, { params: option });
}

// 可售删除
export function deleteSaleable(option) {
  return request.delete(`/backend-price/sellablePriceAdjust/deleteSellablePriceAdjust`, { params: option });
}

// 可售新增/修改
export function addSaleable(option) {
  return request.post(`/backend-price/sellablePriceAdjust/saveUpdate`, option);
}

// 可售详情
export function saleableDetail(option) {
  return request.get(`/backend-price/sellablePriceAdjust/detailByBId`, { params: option });
}

// 可售调价单商品新增
export function addSaleableProduct(option) {
  return request.post(`/backend-price/sellableAdjustSku/saveBatchSellableAdjustSku`, option);
}
// 可售调价单商品修改
export function updateSaleableProduct(option) {
  return request.post(`/backend-price/sellableAdjustSku/updateSellableAdjustSku`, option);
}

// 可售调价单商品批量修改
export function updateBatchSaleableProduct(option) {
  return request.post(`/backend-price/sellableAdjustSku/updateBatchSellableAdjustSkuById`, option);
}

// 可售调价单商品列表
export function saleableProductList(option) {
  return request.get(`/backend-price/sellableAdjustSku/selectSKUList`, { params: option });
}

// 可售调价单商品删除
export function deleteSaleableProduct(option) {
  return request.delete(`/backend-price/sellableAdjustSku/deleteBatchSellableAdjustSku`, { params: option });
}

// 客户可售商品列表
export function customerSaleableProductList(option) {
  return request.post(`/backend-price/sellableAdjustSku/pageInfoProductSkuVoList`, option);
}

// 可售商品调价记录列表
export function saleableModifyPriceList(option) {
  return request.post(`/backend-price/sellablePrice/pagephSellablePrice`, option);
}

// 可售商品调价历史
export function saleableModifyPriceHistory(option) {
  return request.get(`/backend-price/sellableAdjustSku/listSellableAdjustSku`, { params: option });
}

// 销售调价管理列表导出
export function exportExcelPriceAdjustList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-price/productPriceAdjust/exportProductPriceAdjustExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

// 可售价格调整记录列表导出
export function exportExcelSellablePriceList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-price/sellablePrice/exportSellablePriceExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

// 可售产品调价单管理列表导出
export function exportExcelSellablePriceAdjustList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${uploadBaseApi}/backend-price/sellablePriceAdjust/exportExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}
