import axios from '@/libs/api.request'
import * as API from '@/config/api'
import {RETAIL_CUSTOMER} from "@/config/custom";

/*
客户列表
 */
export function getCustomerList(data) {
    return axios.request({
        method: 'get',
        url: API.CUSTOMER_LIST,
        params: data
    })
}

/*
客户分组列表 不分页
 */
export function getCustomerAllGroupList(data) {
    return axios.request({
        method: 'get',
        url: API.CUSTOMER_ALL_GROUP_LIST,
        params: data
    })
}

/*
易购客户列表
 */
export function getYigouList(data) {
    return axios.request({
        method: 'post',
        url: API.YIGOU_LIST,
        data
    })
}
/*
客户名称列表
 */
export function getCustomerNameList(data) {
    return axios.request({
        method: 'get',
        url: API.CUSTOMER_NAME_LIST,
        params: data
    })
}

/*
客户名称列表带散户
 */
export async function getCustomerNameListWr() {
    let data = []
    let res = await getCustomerNameList()
    if (res.status) {
        data.push(RETAIL_CUSTOMER)
        data.push(...res.data)
        res.data = data
    }
    return res
}
/*
添加客户
 */
export function addCustomer(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_ADD,
        data
    })
}

/*
编辑客户
 */
export function delCustomer(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_DEL,
        data
    })
}

/*
禁用/修改客户信息
 */
export function udpateCustomer(data) {
    return axios.request({
        method: 'post',
        url: API.CUSTOMER_UDPATE,
        data
    })
}
/**
 * 信用 额度调整
 * @param {*} data  customer_id credit exp_time
 */
export function creditAdd(data) {
    return axios.request({
        method: 'post',
        url: API.CREDIT_ADD,
        data
    })
}

/**
 * 通过易购账户id获取客户信息，用来快速充值或添加客户
 * @param user_no
 */
export function getInfoUserNo(user_no) {
    return axios.request({
        method: 'get',
        url: API.CUSTOMER_USER_NO,
        params: {
            user_no
        }
    })
}

//客户对账单
export function recCount(params) {
    return axios.request({
        method: 'get',
        url: API.CUSTOMER_COUNT,
        params
    })
}
