import axios from '@/libs/api.request'
import * as API from '@/config/api'

/**
 * 获取账户列表
 */
export function getAccountList(data) {
    return axios.request({
        url: API.ACCOUNT_LIST,
        method: 'get',
        params:data
    })
}
/**
 * 获取账户列表不分页
 */
export function getAllAccountList(data) {
    return axios.request({
        url: API.ALLACCOUNT_LIST,
        method: 'get',
        params:data
    })
}
/**
 * 新增账户
 */
export function addAccount(data) {
    return axios.request({
        url: API.ACCOUNT_ADD,
        method: 'post',
        data
    })
}

/**
 * 获取账户信息
 */
export function getAccountInfo(id) {
    return axios.request({
        url: API.ACCOUNT_INFO,
        method: 'get',
        params: {
            id
        }
    })
}

/**
 * 修改管理员
 */
export function editAccount(data) {
    return axios.request({
        url: API.ACCOUNT_EDIT,
        method: 'post',
        data
    })
}

/**
 * 重置密码
 */
export function resetAccountPass(data) {
    return axios.request({
        url: API.ACCOUNT_RESET_PASS,
        method: 'post',
        data
    })
}

/**
 * 设置管理员角色
 * @param data
 */
export function setAccountRole(data) {
    return axios.request({
        url: API.ACCOUNT_ROLE_SET,
        method: 'post',
        data
    })
}

/**
 * 删除管理员
 */
export function delAccount(id) {
    return axios.request({
        url: API.ACCOUNT_DEL,
        method: 'post',
        data: {
            id
        }
    })
}

/**
 * 启用禁用管理员
 */
export function setAccountState(data) {
    return axios.request({
        url: API.ACCOUNT_STATE,
        method: 'post',
        data
    })
}
