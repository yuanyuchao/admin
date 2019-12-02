import axios from '@/libs/api.request'
import * as API from '@/config/api'

/**
 * 获取角色列表
 */
export function getRoleList(data) {
    return axios.request({
        url: API.ROLE_LIST,
        method: 'get',
        params:data
    })
}
/**
 * 可分配角色列表
 */
export function getAbleRoleList(data) {
    return axios.request({
        url: API.ABLEROLE_LIST,
        method: 'get',
        params:data
    })
}
/**
 * 新增角色
 * @param data
 */
export function addRole(data) {
    return axios.request({
        url: API.ROLE_ADD,
        method: 'post',
        data
    })
}

/**
 * 获取角色信息
 */
export function getRoleInfo(id) {
    return axios.request({
        url: API.ROLE_INFO,
        method: 'get',
        params: {
            id
        }
    })
}

/**
 * 编辑角色
 */
export function editRole(data) {
    return axios.request({
        url: API.ROLE_EDIT,
        method: 'post',
        data
    })
}

/**
 * 设置角色状态
 */
export function setRoleState(data) {
    return axios.request({
        url: API.ROLE_STATE,
        method: 'post',
        data
    })
}

/**
 * 删除角色
 * @param id
 */
export function delRole(id) {
    return axios.request({
        url: API.ROLE_DEL,
        method: 'post',
        data: {
            id
        }
    })
}
