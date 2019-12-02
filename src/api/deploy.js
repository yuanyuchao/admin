import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
厂区配置
 */
export function deploy_list() {
    return axios.request({
        method: 'get',
        url: API.DEPLOY_LIST,
    })
}
export function deploy_update(data) {
    return axios.request({
        method: 'post',
        url: API.DEPLOY_UPDATE,
        data
    })
}
