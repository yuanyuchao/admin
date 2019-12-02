import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
卡列表
 */
export function getHomeInfo() {
    return axios.request({
        method: 'get',
        url: API.HOME_INFO,
    })
}

/*
获取场内排队列表
 */
export function getLineCars() {
    return axios.request({
        method: 'get',
        url: API.LINE_CARS
    })
}
