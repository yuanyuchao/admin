import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
列表
 */
export function getStoneGroupist(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_GROUP_LIST,
        params: data
    })
}

/*
不分页列表
 */
export function getStoneGroupListNp() {
    return axios.request({
        method: 'get',
        url: API.STONE_GROUP_LIST_NP,
    })
}

/*
添加
 */
export function addStoneGroup(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_GROUP_ADD,
        data
    })
}

/*
修改
 */
export function editStoneGroup(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_GROUP_EDIT,
        data
    })
}

/*
删除
 */
export function delStoneGroup(id) {
    return axios.request({
        method: 'post',
        url: API.STONE_GROUP_DEL,
        data: {
            id
        }
    })
}

/*
批量添加删除料类
 */
export function batchStoneGroup(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_GROUP_BATCH,
        data
    })
}
