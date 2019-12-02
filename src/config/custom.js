/*
账户状态
 */
import {getImgUrl} from "@/libs/util";

export const ACCOUNT_STATE = {
    enable: 1,
    dis: 0
}

/*
角色状态
 */
export const ROLE_STATE = {
    enable: 1,
    dis: 0
}

/*
读卡地址
 */
export const CARD_URL = {
    D3Card: `${globalConfig.readCardUrl}/readcard/d3card`,
    JtCard: `${globalConfig.readCardUrl}/readcard/jtcard`,
}

/*
车辆预制皮重状态
 */
export const CAR_WEIGHT_STATE = {
    0: '禁用',
    1: '启用'
}
/**
 * 车辆状态
 */
export const CAR_STATE = {
    1: '入场',
    2: '登记',
    3: '离场'
}
/**
 * 支付方式
 */
export const PAY_TYPE = {
    0: '现金',
    1: '手机支付',
    2: '银行卡支付'
}
export const ZHI_TYPE = {
    0: '充值',
    1: '退款',
    2: '订单消费',
    3: '订单回退'
}
export const CAR_TYPE = {
    0: '登记',
    1: '装车',
    2: '装车完成',
    3: '结算'
}

//操作日志 日志类型
export const logType = [
    {
        id: 1,
        name: "后台操作"
    },
    {
        id: 2,
        name: "前台流程 "
    },
    {
        id: 3,
        name: "终端异常"
    },
]
//进料系统订单状态
export const purchaseType = [
    {name: '已称毛', id: 2},
    {name: '已称皮', id: 3},
]

export const PURCHASE_ORDER_STATE = { //订单状态
    gross: '2', //已称毛
    tare: '3', //已称皮
}

export const PURCHASE_SETTLE_STATE = {
    ok: 2, // 结算
    no: 1, // 未结算
}

export const PURCHASE_SETTLE_STATE_TEXT = {
    1: '未结算', // 未结算
    2: '已结算', // 已结算
}
//默认头像
export const avator = 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
//最大打印条数
export const page_params = {page: 1, list_rows: 20000}

//图片地址
export const imgSrc = getImgUrl()

export const RETAIL_CUSTOMER = { // 散户
    id: -1,
    customer_name: '散户'
}
