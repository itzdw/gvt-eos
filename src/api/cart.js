import http from "@/utils/http"
import { serializeGetUrl } from '@/utils/base'

/**
 * 商品加入购物车或修改采购数量
 * @param {*} data 
 */
export function addMobileShoppingCart(data = {}) {
  return http({
    method: "post",
    url: "/mobileStore/addMobileShoppingCart",
    data
  });
}

/**
 * 获取购物车详情
 * @param {*} data 
 */
export function getShopCart(data = {}) {
  let url = "/tenant/shop/getShopCart";
  // let url = serializeGetUrl(api,data);
  return http({
    method: "get",
    url,
    data
  });
}

/**
 * 清空，删除购物车
 * @param {*} data 
 */
export function removeShopCart(data = {}) {
  return http({
    method: "delete",
    url: "/tenant/shop/removeShopCart",
    data
  });
}

/**
 * 购物车结算
 * @param {*} data 
 */
export function checkOutShoppingCart(data = {}) {
  return http({
    method: "post",
    url: "/mobileStore/checkOutShoppingCart",
    data
  });
}

/**
 * 查询订单
 * @param {*} data 
 */
export function getMobilePurchaseList(data = {}) {
  return http({
    method: "post",
    url: "/mobileStore/getMobilePurchaseList",
    data
  });
}
/**
 * 保存购物车
 * @param {*} data 
 */
export function saveShopCart(data = {}) {
  return http({
    method: "post",
    url: "/tenant/shop/saveShopCart",
    data
  });
}
//购物车生成订单
export function createPurchaseOrder(data) {
  return http({
    method: "post",
    url: "/tenant/shop/createPurchaseOrder",
    data,
  });
}

//生成发票
export function generatePuachseInvoice(data) {
  return http({
    method: 'post',
    url: '/purchaseOrder/generatePuachseInvoice',
    data,
    timeout:100000
  })
}