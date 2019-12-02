import axios from '@/libs/api.request'
import * as API from '@/config/api'


/**
 * 检测系统状态
 */
export function getSysInfo() {
    return axios.request({
        url: API.SYSTEM_INFO,
        method: 'get'
    })
}

/**
 * 激活
 */
export function active(data) {
    return axios.request({
        url: API.ACTIVE,
        method: 'post',
        data
    })
}
/**
 * 延期
 */
export function expire(data) {
    return axios.request({
        url: API.EXPIRE,
        method: 'post',
        data
    })
}
