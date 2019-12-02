import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
获取地磅波动数据
 */
export function getPoundRoundData(params) {
    return axios.request({
        url: API.POUND_ROUND_DATA,
        method: 'get',
        params
    })
}
