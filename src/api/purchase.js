import axios from '@/libs/api.request'
import * as API from '@/config/api'
import {PURCHASE_SETTLE_STATE} from "@/config/custom";

// 1.供应商相关
/*
供应商列表
 */
export function getSupplierList(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_SUPPLIER_LIST,
        data
    })
}
/*
供应商所有列表
 */
export function getSupplierAllList(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_SUPPLIER_ALLLIST,
        data
    })
}
/*
添加客户
 */
export function addSupplier(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_SUPPLIER_ADD,
        data
    })
}

/*
编辑客户
 */
export function updateSupplier(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_SUPPLIER_UPDATE,
        data
    })
}

/*
禁用/启用供应商
 */
export function changeState(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_SUPPLIER_STATE,
        data
    })
}

/*
删除供应商
 */
export function deleteSuppliuer(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_SUPPLIER_DEL,
        data
    })
}


// 2.原石相关
/*
原石列表
 */
export function getPurchaseStoneList(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_STONE_LIST,
        data
    })
}
/*
原石所有列表
 */
export function getStoneAllList(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_STONE_ALL_LIST,
        data
    })
}
/*
删除原石
 */
export function delStones(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_STONE_DEL,
        data
    })
}
/*
禁用/启用原石
 */
export function changeStoneState(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_STONE_STATE,
        data
    })
}
/*
添加料类
 */
export function addStones(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_STONE_ADD,
        data
    })
}

/*
编辑料类
 */
export function updateStones(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_STONE_UPDATE,
        data
    })
}



// 车辆相关

// 车辆列表

export function getCarsList(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_TRUCK_LIST,
        data
    })
}

/*
删除车辆
 */
export function delCars(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_TRUCK_DEL,
        data
    })
}

/*
添加车辆
 */
export function addCars(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_TRUCK_ADD,
        data
    })
}

/*
编辑车辆
 */
export function updateCars(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_TRUCK_UPDATE,
        data
    })
}

//订单相关
/*
订单列表
 */
export function purchaseOrderList(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_ORDER_LIST,
        data
    })
}

/*
修改订单
 */
export function udpateOrder(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_ORDER_UPDATE,
        data
    })
}

/*
订单详情
 */
export function detailOrder(data) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_ORDER_INFO,
        data
    })
}


/**
 * 补录订单
 * */
export function recordOrder(data){
    return axios.request({
        method:"post",
        url:API.RECORD_PURCHASE_ORDER,
        data
    })
}

/*
结算订单
 */
export function setOrderSettlement(order_no) {
    return axios.request({
        method: 'post',
        url: API.PURCHASE_ORDER_SETTLEMENT,
        data: {
            settlement_status: PURCHASE_SETTLE_STATE.ok,
            order_no
        }
    })
}

/*
获取统计信息
 */
export function countData(data) {
    return axios.request({
        url: API.PURCHASE_COUNT,
        method: 'post',
        data
    })
}

/*
订单修改记录
 */
export function orderEditLog(order_id) {
    return axios.request({
        method: 'get',
        url: API.PURCHASE_ORDER_EDIT_LOG,
        params: {
            order_id
        }
    })
}
