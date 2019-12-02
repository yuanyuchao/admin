import axios from '@/libs/api.request'
import * as API from '@/config/api'

/**
 * 获取报表列表
 */
export function getReportList(data) {
    return axios.request({
        url: API.REPORT_LIST,
        method: 'get',
        params:data
    })
}

/**
 * 获取报表列表
 */
export function getReportShow(data) {
    return axios.request({
        url: API.REPORT_SHOW,
        method: 'get',
        params:data
    })
}

/**
 * 获取报表列表
 */
export function getReportDown(data) {
    return axios.request({
        url: API.REPORT_DOWN,
        method: 'get',
        params:data,
        responseType: 'blob',
    })
}


/**
 * 获取进料报表列表
 */
export function getPurReportList(data) {
    return axios.request({
        url: API.PUR_REPORT_LIST,
        method: 'get',
        params:data
    })
}

/**
 * 获取进料报表列表
 */
export function getPurReportShow(data) {
    return axios.request({
        url: API.PUR_REPORT_SHOW,
        method: 'get',
        params:data
    })
}

/**
 * 获取进料报表列表
 */
export function getPurReportDown(data) {
    return axios.request({
        url: API.PUR_REPORT_DOWN,
        method: 'get',
        params:data,
        responseType: 'blob',
    })
}
