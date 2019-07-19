import moment from "moment"
import numeral from "numeral"

export function timeFormat(unixTime, full = false) {
    if (full) {
        return moment(unixTime).format("YYYY-MM-DD HH:mm:ss")
    } else {
        return moment(unixTime).format("YYYY-MM-DD")
    }
}

export function timeStampFormat(unixTime,full) {
    let format = "YYYY-MM-DD HH:mm:ss";
    if(full) {
        format = "YYYY-MM-DD";
    }
    if (unixTime) {
        return moment(unixTime,format).valueOf();
    }
}

export function numberFormat(number) {
    return numeral(number).format('$ 0,0.00');
}
  
export function numberFormatCNY(number) {
    return '￥'+numeral(number).format(' 0,0.00');
}