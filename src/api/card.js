import axios from '@/libs/api.request'
import * as API from '@/config/api'

/*
卡列表
 */
export function getCardList(data) {
    return axios.request({
        method: 'get',
        url: API.CARD_LIST,
        params:data
    })
}

/*
制卡
 */
export function addCard(data) {
    return axios.request({
        method: 'post',
        url: API.CARD_ADD,
        data
    })
}

/*
修改卡信息
 */
export function updateCard(data) {
    return axios.request({
        method: 'post',
        url: API.CARD_UDPATE,
        data
    })
}

/*
查询卡信息
 */
export function getCardInfo(data) {
    return axios.request({
        method: 'get',
        url: API.CARD_INFO,
        data
    })
}

/*
验证卡密
 */
export function verfyCard(data) {
    return axios.request({
        method: 'post',
        url: API.VERIFY_CARD,
        data
    })
}

/*
修改卡密
 */
export function changeCardPass(data) {
    return axios.request({
        method: 'post',
        url: API.CHANGE_CARD_PASS,
        data
    })
}

/*
无密挂失
 */
export function lossCard(data) {
    return axios.request({
        method: 'post',
        url: API.CARD_RLOSS,
        data
    })
}

/*
有密挂失
 */
export function lossCardFpwd(data) {
    return axios.request({
        method: 'post',
        url: API.CARD_RLOSSFPWD,
        data
    })
}
/*
退卡
 */
export function cardDel(data) {
    return axios.request({
        method:'post',
        url:API.CARD_DEL,
        data
    })
}

/*
卡列表
 */
export function getElecCardList(data) {
    return axios.request({
        method: 'post',
        url: API.ELECCARD_LIST,
        data
    })
}

/*
制卡
 */
export function addElecCard(data) {
    return axios.request({
        method: 'post',
        url: API.ELECCARD_ADD,
        data
    })
}

/*
车辆列表
 */
export function elecCarList(data) {
    return axios.request({
        method: 'post',
        url: API.ELECCAR_LIST,
        data
    })
}

