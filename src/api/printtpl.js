import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
订单列表
 */
export function getPrinttpl(data) {
    return axios.request({
        method: 'get',
        url: API.PRINTTPL_GET,
        params:data
    })
}


/*
补录订单
 */
export function udpatePrinttpl(data) {
    return axios.request({
        method: 'post',
        url: API.PRINTTPL_UPDATE,
        data
    })
}
