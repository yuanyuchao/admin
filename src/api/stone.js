import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
列表
 */
export function getStoneList(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_LIST,
        params: data
    })
}

/*
料类名称列表
 */
export function getStoneNameList(data) {
    return axios.request({
        method: 'get',
        url: API.STONE_NAME_LIST,
        params: data
    })
}

/*
添加料类
 */
export function addStone(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_ADD,
        data
    })
}

/*
编辑料类
 */
export function editStone(data) {
    return axios.request({
        method: 'post',
        url: API.STONE_EDIT,
        data
    })
}

// /*
// 设置料类状态
//  */
// export function setStoneState(id) {
//     return axios.request({
//         method: 'post',
//         url: API.STONE_PROHIBIT,
//         data: {
//             id
//         }
//     })
// }

//删除料类
export function delStone(id) {
    return axios.request({
        method: 'post',
        url: API.STONE_DEL,
        data: {
            id
        }
    })
}
