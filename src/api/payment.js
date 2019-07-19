import http from "@/utils/http"
import { serializeGetUrl } from '@/utils/base'

/**
 * 查询订单支付详情
 * @param {*} data 
 */
export function getMobilePurchasePayment(data = {}) {
  return http({
    method: "post",
    url: "/mobileStore/getMobilePurchasePayment",
    data
  });
}

/**
 * 转账截图支付
 * @param {*} data 
 */
export function transferPay(data = {}) {
  return http({
    method: "post",
    url: "/payment/orderPay",
    data,
    timeout:50000
  });
}

/**
 * 查询银行转账账户信息
 * @param {*} data 
 */
export function getPaymentBankInfo(data = {}) {
  let url = '/payment/getPaymentBankInfo';
  if (url) {
    url += `/${data}`;
  }
  return http({
      method: "get",
      url
  });
}

/**
 * 采购单付款-钱包支付-根据币种查询余额
 * @param {*} data 
 */
export function walletBalance(data = {}) {
  return http({
    method: "post",
    url: "/wallet/walletBalance",
    data
  });
}

//采购单-确认入库
export function confirmPilingStock(data) {
  return http({
      method: "post",
      url: "/stock/confirmPilingStock",
      data
  });
} 

/**
 * 查询 supay 支付结果
 * @param {Object} data 
 */
export function getSupayPayResult(params = {}) {
  return http({
    method: 'get',
    url: '/payment/getSupayPayResult',
    params
  })
}

/**
 * 获取 supay 二维码
 * @param {Object} data 
 */
export function getSupayPaymentQRCode(data = {}) {
  return http({
    method: 'post',
    url: '/payment/getSupayPaymentQRCode',
    data
  })
}