import http from "@/utils/http"
import { serializeGetUrl } from '@/utils/base'

/**
 * 首页
 * @param {*} data 
 */
export function getIndexInfo(data = {}) {
  let api = "/mobileStore/getIndexInfo";
  let url = serializeGetUrl(api, data);
  return http({
    method: "get",
    url
  });
}

/**
 * 通过分类Code查询热销商品列表
 * @param {*} data 
 */
export function getHotSaleProductListByClass(data = {}) {
  return http({
    method: "post",
    url: "/mobileStore/getHotSaleProductListByClass",
    data
  });
}

/**
 * 通过关键字查询商品
 * @param {*} keyword 
 */
export function searchHotSaleProductByKeyword(data = {}) {
  return http({
    method: "post",
    url: '/mobileStore/searchHotSaleProductByKeyword',
    data
  });
}