import  axios from '@/libs/api.request'
import * as API from '@/config/api'

export const login = ({ userName, password }) => {
    const data = {
        admin_name: userName,
        password:password
    }
    return axios.request({
        url: API.LOGIN_URL,
        method: 'post',
        data
    })
}

export function validataPsw(data) {
    return axios.request({
        url: API.LOGIN_URL,
        method: 'post',
        data
    })
}

export function changePsw(data) {
    return axios.request({
        url: API.CHANGE_PSW,
        method: 'post',
        data
    })
}

export const getUserInfo = () => {
    return axios.request({
        url: API.USER_INFO,
        method: 'get'
    })
}

export const logout = (token) => {
    return axios.request({
        url: 'logout',
        method: 'post'
    })
}

export const getUnreadCount = () => {
    return axios.request({
        url: 'message/count',
        method: 'get'
    })
}

export const getMessage = () => {
    return axios.request({
        url: 'message/init',
        method: 'get'
    })
}

export const getContentByMsgId = msg_id => {
    return axios.request({
        url: 'message/content',
        method: 'get',
        params: {
            msg_id
        }
    })
}

export const hasRead = msg_id => {
    return axios.request({
        url: 'message/has_read',
        method: 'post',
        data: {
            msg_id
        }
    })
}

export const removeReaded = msg_id => {
    return axios.request({
        url: 'message/remove_readed',
        method: 'post',
        data: {
            msg_id
        }
    })
}

export const restoreTrash = msg_id => {
    return axios.request({
        url: 'message/restore',
        method: 'post',
        data: {
            msg_id
        }
    })
}
