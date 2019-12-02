import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
卡列表
 */
export function getLogList(data) {
    return axios.request({
        method: 'get',
        url: API.LOG_LIST,
        params:data
    })
}
