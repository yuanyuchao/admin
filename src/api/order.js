import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
订单列表
 */
export function getOrderList(data) {
    return axios.request({
        method: 'get',
        url: API.ORDER_LIST,
        params:data
    })
}
/*
APP订单列表
 */
export function getAppOrder(data) {
    return axios.request({
        method: 'get',
        url: API.APP_ORDER,
        params:data
    })
}

/*
作废订单
 */
export function toVoidOrder(data) {
    return axios.request({
        method: 'post',
        url: API.ORDER_TO_VOID,
        data
    })
}

/*
人工结算
 */
export function orderSettlement(data) {
    return axios.request({
        method: 'post',
        url: API.ORDER_SETTLEMENT,
        data
    })
}

/*
查询订单详情
 */
export function getOrderInfo(id) {
    return axios.request({
        method: 'get',
        url: API.ORDER_INFO,
        params:{id}
    })
}

/*
获取料价
 */
export function getObtainStone(data) {
    return axios.request({
        method: 'get',
        url: API.OBTAIN_STONE,
        params:data
    })
}

/*
获取皮重
 */
export function getObtainTare(data) {
    return axios.request({
        method: 'get',
        url: API.OBTAIN_TARE,
        params:data
    })
}

/*
修改订单
 */
export function orderUp(data) {
    return axios.request({
        method: 'post',
        url: API.ORDER_UP,
        data
    })
}

/*
订单修改记录
 */
export function orderEditLog(order_id) {
    return axios.request({
        method: 'get',
        url: API.ORDER_EDIT_LOG,
        params: {
            order_id
        }
    })
}
/*
修改订单全部信息
 */
export function orderEdit(data) {
    return axios.request({
        method: 'post',
        url: API.ORDER_EDIT,
        data
    })
}

/*
补录订单
 */
export function orderSupplement(data) {
    return axios.request({
        method: 'post',
        url: API.ORDER_SUPPLEMENT,
        data
    })
}
