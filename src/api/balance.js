
import axios from '@/libs/api.request'
import * as API from '@/config/api'

/**
 * 获取账户列表
 */
export function getBalacneList(data) {
    return axios.request({
        url: API.BALANCE_LIST,
        method: 'get',
        params: data
    })
}
/**
 * 资金充值
 * data    customer_id money pay_type remark trade_no
 */

export function balanceRecharge(data) {
    return axios.request({
        method: 'post',
        url: API.BALANCE_RECHARGE,
        data
    })
}
/**
 *
 * 客户退款
 * data   customer_id money pay_type remark trade_no
 */
export function balanceRefund(data) {
    return axios.request({
        method: 'post',
        url: API.BALANCE_REFUND,
        data
    })
}

/**
 *
 * 客户账单
 * data   customer_id money pay_type remark trade_no
 */
export function summaryList(data) {
    return axios.request({
        method: 'get',
        url: API.SUMMARY_LIST,
        params: data
    })
}


/**
 *
 * 删除流水
 * data   customer_id money pay_type remark trade_no
 */
export function update_log(data) {
    return axios.request({
        method: 'post',
        url: API.UPDATE_LOG,
        data
    })
}
