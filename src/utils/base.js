import qs from 'qs'
import numeral from 'numeral'
// import Auth from './auth'

// 常用 GET 请求参数
export const baseParams = {
  num: 1,
  size: 10
}
export const defaultImg = "/static/images/product/product.jpg";

/**
 * 序列化 GET 请求地址
 * 
 * @param {String} url API 地址
 * @param {Object} data GET Request Params
 */
export function serializeGetUrl(url = '', data = {}) {
  let params = qs.stringify(data);
  if (params) {
    url += `?${qs.stringify(data)}`;
  }
  return url;
}

export function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

export function numberFormat(number) {
  return numeral(number).format('$ 0,0.00');
}

export function numberFormatCNY(number) {
  return '￥'+numeral(number).format(' 0,0.00');
}

export function numberFormatTwo(number) {
  return numeral(number).format('0,0.00');
}

export function concatArray(){
  let newArr = Array.prototype.concat.apply([], arguments)//没有去重复的新数组
  return Array.from(new Set(newArr))
}