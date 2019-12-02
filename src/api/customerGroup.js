import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
客户分组列表
 */
export function getCustomerGroupList(data) {
    return axios.request({
        method: 'get',
        url: API.CUSTOMER_GROUP_LIST,
        params: data
    })
}

/*
添加客户分组
 */
export function addCustomerGroup(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_GROUP_ADD,
        data
    })
}

/*
删除客户分组
 */
export function delCustomerGroup(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_GROUP_DEL,
        data
    })
}

/*
修改客户分组信息
 */
export function udpateCustomerGroup(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_GROUP_EDIT,
        data
    })
}

/*
修改客户分组信息
 */
export function batchCustomerGroup(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_GROUP_BATCH,
        data
    })
}
