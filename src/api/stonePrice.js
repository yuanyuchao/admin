import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
列表
 */
export function getStonePriceList(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_PRICE_LIST,
        params: data
    })
}

/*
添加
 */
export function addStonePrice(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_PRICE_ADD,
        data
    })
}

/*
修改
 */
export function editStonePrice(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_PRICE_EDIT,
        data
    })
}

/*
批量修改料价
 */
export function editStonePriceAll(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_PRICE_EDIT_ALL,
        data
    })
}

/*
删除
 */
export function delStonePrice(id) {
    return axios.request({
        method: 'post',
        url: API.STONE_PRICE_DEL,
        data: {
            id
        }
    })
}

/*
历史料价
 */
export function stoneLists(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_LISTS,
        params: data
    })
}

/*
料类查询客户列表
 */
export function stoneCustomerLists(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_CUSTOMER_LIST,
        params: data
    })
}

/*
根据料类和客户获取价格
 */
export function stoneCusPrice(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_CUS_PRICE,
        params: data
    })
}
