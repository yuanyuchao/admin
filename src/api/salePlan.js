import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
列表
 */
export function getPlanList(data) {
    return axios.request({
        method: 'get',
        url: API.PLAN_LIST,
        params: data
    })
}

/*
删除销售计划
 */
export function delSalePlan(data) {
    return axios.request({
        method: 'get',
        url: API.PLAN_DEL,
        params: data
    })
}

/*
发布销售计划
 */
export function addSalePlan(data) {
    return axios.request({
        method: 'post',
        url: API.PLAN_ADD,
        data
    })
}

/*
编辑销售计划
 */
export function editSalePlan(data) {
    return axios.request({
        method: 'post',
        url: API.PLAN_UPDATE,
        data
    })
}

