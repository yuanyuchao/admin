import axios from '@/libs/api.request'
import * as API from '@/config/api'

/**
 * 获取账户列表
 */
export function getTruckList(data) {
    return axios.request({
        url: API.TRUCK_LIST,
        method: 'get',
        params: data
    })
}
export function updateTruck(data) {
    return axios.request({
        url: API.TRUCK_UPDATE,
        method: 'post',
        data
    })
}

export function addTruck(data) {
    return axios.request({
        url: API.TRUCK_ADD,
        method: 'post',
        data
    })
}
export function delTruck(data) {
    return axios.request({
        url: API.TRUCK_DEL,
        method: 'post',
        data
    })
}
export function plateList(data) {
    return axios.request({
        url:API.PLATE_LIST,
        method:'get',
        data
    })
}
