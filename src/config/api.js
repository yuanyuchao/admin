export const DEV_BASE_URL = 'http://192.168.1.24:8090'

// 销售系统

export const LOGIN_URL = '/sys/login';
export const SYSTEM_INFO = '/sys/prelogin'; //检测系统状态及背景图
export const ACTIVE = '/sys/active'; //激活
export const EXPIRE = '/sys/expire'; //延期

export const USER_INFO = '/sys/logininfo'; //获取用户信息
export const CHANGE_PSW = '/sys/editpass'; //修改密码
export const HOME_INFO = '/sys/home/info'; //首页信息
export const LINE_CARS = '/sys/order/getlineupbystone' // 车辆排队信息
/*
账户
 */
export const ACCOUNT_LIST = '/sys/admin/list'; //管理员列表
export const ACCOUNT_ADD = '/sys/admin/add'; //添加账户
export const ACCOUNT_INFO = '/sys/admin/getinfo'; //管理员信息
export const ACCOUNT_EDIT = '/sys/admin/update'; //修改管理员
export const ACCOUNT_RESET_PASS = '/sys/admin/resetpass'; //重置管理员密码
export const ACCOUNT_ROLE_SET = '/sys/admin/setrole'; //设置管理员角色
export const ACCOUNT_DEL = '/sys/admin/del'; //删除(批量)管理员
export const ACCOUNT_STATE = '/sys/admin/active'; //启用禁用管理员
export const ALLACCOUNT_LIST = '/sys/admin/allList'; //管理员列表不分页
/*
角色
 */
export const ROLE_LIST = '/sys/role/list'; //角色列表
export const ABLEROLE_LIST = '/sys/role/ablelist'; //可分配角色列表
export const ROLE_ADD = '/sys/role/add'; //新增角色
export const ROLE_INFO = '/sys/role/getinfo'; //角色信息
export const ROLE_EDIT = '/sys/role/update'; //角色修改
export const ROLE_STATE = '/sys/role/active'; //角色启用禁用
export const ROLE_DEL = '/sys/role/del'; //角色删除

/*
料类
 */
export const STONE_LIST = '/sys/stone/list'; //料类列表
export const STONE_NAME_LIST = '/sys/stone/name/list'; //料类名称列表
export const STONE_ADD = '/sys/stone/add'; //添加料类
export const STONE_EDIT = '/sys/stone/update'; //修改料类
export const STONE_DEL = '/sys/stone/del'; //删除料类
// export const STONE_PROHIBIT = '/stone/prohibit'; //禁用启用料类

/*
料价
 */
export const STONE_PRICE_LIST = '/sys/stone_price/list'; //料价列表
export const STONE_PRICE_ADD = '/sys/stone_price/add'; //新增
export const STONE_PRICE_EDIT = '/sys/stone_price/update'; //修改
export const STONE_PRICE_DEL = '/sys/stone_price/del'; //删除
export const STONE_LISTS = '/sys/price/log'; //历史料价
export const STONE_CUSTOMER_LIST = '/sys/price_customer/list'; //料类查询客户列表
export const STONE_PRICE_EDIT_ALL = '/sys/price/batch'; //批量修改料价
export const STONE_CUS_PRICE = '/sys/stone_price/cus_price' //根据客户id料类id获取料类价格
/*
料类分组
 */
export const STONE_GROUP_LIST = '/sys/stone_group/list'; //列表
export const STONE_GROUP_LIST_NP = '/sys/stone_group/grouplist' // 不分页
export const STONE_GROUP_ADD = '/sys/stone_group/add'; //添加
export const STONE_GROUP_EDIT = '/sys/stone_group/update'; //修改
export const STONE_GROUP_DEL = '/sys/stone_group/del'; //删除
export const STONE_GROUP_BATCH = '/sys/stone/batch/group'//批量删除添加料类
/*
客户管理
 */
export const CUSTOMER_ADD = '/sys/customer/add'; //添加客户
export const CUSTOMER_LIST = '/sys/customer/list'; //客户列表
export const CUSTOMER_NAME_LIST = '/sys/customer/name/list'; //客户名称列表
export const YIGOU_LIST = '/sys/customer/user_list'; //易购客户名称列表
export const CUSTOMER_DEL = '/sys/customer/del'; //删除客户
export const CUSTOMER_UDPATE = '/sys/customer/update'; //修改客户
export const CUSTOMER_USER_NO = '/sys/customer/info'; //通过易购id获取用户信息添加账户或快速充值
/**
* 资金管理
*/
export const BALANCE_RECHARGE = '/sys/balance/recharge'; //客户充值
export const BALANCE_REFUND = '/sys/balance/refund'; //客户退款
export const BALANCE_LIST = '/sys/balance/list'; //获取资金流水
export const SUMMARY_LIST = '/sys/summary/list'; //客户账单

/**
* 信用额度调整
*/
export const CREDIT_ADD = '/sys/credit/add'; //信用额度调整

/*
客户分组管理
 */
export const CUSTOMER_GROUP_ADD = '/sys/customer_group/add'; //添加客户分组
export const CUSTOMER_GROUP_LIST = '/sys/customer_group/list'; //客户分组列表
export const CUSTOMER_ALL_GROUP_LIST = '/sys/group/list'; //客户分组列表(不分页)
export const CUSTOMER_GROUP_DEL = '/sys/customer_group/del'; //删除客户分组
export const CUSTOMER_GROUP_EDIT = '/sys/customer_group/update'; //修改客户分组
export const CUSTOMER_GROUP_INFO = '/sys/customer_group/info'; //客户分组详情
export const CUSTOMER_GROUP_BATCH = '/sys/customer/batch/group'; //客户批量添加删除
/*
卡管理
 */
export const CARD_LIST = '/sys/card/list'; //卡列表
export const CARD_ADD = '/sys/card/add'; //制卡
export const CARD_INFO = '/sys/card/info'; //查询卡信息
export const CARD_UDPATE = '/sys/card/update'; //修改卡信息
export const CARD_RLOSS = '/sys/card/reportloss'; //无密挂失
export const CARD_RLOSSFPWD = '/sys/card/reportlossofpwd'; //有密挂失
export const CARD_DEL = '/sys/card/withdraw_card'//退卡
export const VERIFY_CARD = '/sys/card/verification'//验证卡密
export const CHANGE_CARD_PASS = '/sys/card/password'//修改卡密
/*
电子标签
 */
export const ELECCARD_LIST = '/sys/truck/id/list'; //电子标签列表
export const ELECCARD_ADD = '/sys/truck/id/add'; //制卡
export const ELECCAR_LIST = '/sys/truck/truck_list'; //车辆列表

/*
日至消息
 */
export const LOG_LIST = '/sys/logs/list'; //日志列表
/*
订单
 */
export const ORDER_LIST = '/sys/order/list'; //订单列表
export const ORDER_TO_VOID = '/sys/order/to_void'; //作废订单
export const ORDER_INFO = '/sys/order/info'; //订单详情
export const ORDER_SETTLEMENT = '/sys/order/settlement'; //人工结算
export const ORDER_UP = '/sys/order/up'; //修改订单
export const ORDER_SUPPLEMENT = '/sys/order/supplement'; //补录订单
export const OBTAIN_STONE = '/sys/obtain/stone'; //获取料价
export const OBTAIN_TARE = '/sys/obtain/tare'; //获取皮重
export const APP_ORDER = '/sys/app/order'; //app订单
export const ORDER_EDIT = '/sys/order/update'; //修改订单全部信息
export const ORDER_EDIT_LOG = '/sys/orderlog/list'; //订单修改记录
/*
车辆信息
 */
export const TRUCK_LIST = '/sys/truck/list'; //列表
export const TRUCK_ADD = '/sys/truck/add'; //新增
export const TRUCK_UPDATE = '/sys/truck/edit'; //修改
export const TRUCK_DEL = '/sys/truck/del'; //删除
export const PLATE_LIST = '/sys/plate/list'//车辆统计

// 打印管理
export const PRINTTPL_GET = '/sys/printtpl/get'//获取打印模板
export const PRINTTPL_UPDATE = '/sys/printtpl/update'//修改打印模板
//销售计划
export const PLAN_LIST = '/sys/sales/plan/list'; //列表
export const PLAN_ADD = '/sys/sales/plan/add'; //新增
export const PLAN_UPDATE = '/sys/sales/plan/update'; //修改
export const PLAN_DEL = '/sys/sales/plan/delete'; //删除
//厂区配置
export const DEPLOY_LIST = '/sys/set/list'//配置列表
export const DEPLOY_UPDATE = '/sys/set/update'//配置列表

//财务
export const CUSTOMER_COUNT = '/sys/order/report' //客户对账单


//流水审核删除
export const CHECK_ADD = '/sys/check/add'; //提交审核
export const CHECK_DEL = '/sys/check/del'; //删除审核
export const UPDATE_LOG = '/sys/log/update'; //删除审核
export const CHECK_LIST = '/sys/check/list'; //审核列表
export const CHECK_AGREE = '/sys/check/agree'; //同意审核
export const CHECK_DISAGREE = '/sys/check/disagree'; //驳回审核

// 报表
export const REPORT_LIST = '/sys/report/typelist'; //报表列表
export const REPORT_SHOW = '/sys/report/show'; //报表预览
export const REPORT_DOWN = '/sys/report/download'; //报表下载

// 进料报表
export const PUR_REPORT_LIST = '/purchase/report/typelist'; //报表列表
export const PUR_REPORT_SHOW = '/purchase/report/show'; //报表预览
export const PUR_REPORT_DOWN = '/purchase/report/download'; //报表下载


// 进料系统

// 车辆
export const PURCHASE_TRUCK_LIST = '/purchase/truck/list'; //车辆列表
export const PURCHASE_TRUCK_ADD = '/purchase/truck/add'; //新增
export const PURCHASE_TRUCK_UPDATE = '/purchase/truck/update'; //修改
export const PURCHASE_TRUCK_DEL = '/purchase/truck/delete'; //删除

// 料类
export const PURCHASE_STONE_LIST = '/purchase/stone/list'; //料类列表
export const PURCHASE_STONE_ALL_LIST = '/purchase/stone/list_all'; //料类所有列表
export const PURCHASE_STONE_ADD = '/purchase/stone/add'; //新增
export const PURCHASE_STONE_UPDATE = '/purchase/stone/update'; //修改
export const PURCHASE_STONE_DEL = '/purchase/stone/delete'; //删除料类
export const PURCHASE_STONE_STATE = '/purchase/stone/state'; //启用禁用

// 供应商
export const PURCHASE_SUPPLIER_LIST = '/purchase/supplier/list'; //列表
export const PURCHASE_SUPPLIER_ALLLIST = '/purchase/supplier/list_all'; //所有列表
export const PURCHASE_SUPPLIER_ADD = '/purchase/supplier/add'; //新增
export const PURCHASE_SUPPLIER_UPDATE = '/purchase/supplier/update'; //修改
export const PURCHASE_SUPPLIER_DEL = '/purchase/supplier/delete'; //删除
export const PURCHASE_SUPPLIER_STATE = '/purchase/supplier/state'; //启用禁用

// 订单
export const PURCHASE_ORDER_LIST = '/purchase/order/list'; //订单列表
// export const PURCHASE_TRUCK_ADD = '/purchase/truck/add'; //新增
export const PURCHASE_ORDER_UPDATE = '/purchase/order/update'; //修改订单
export const PURCHASE_ORDER_INFO = '/purchase/order/detail'; //订单详情
export const RECORD_PURCHASE_ORDER='/purchase/order/supplementary_order'
export const PURCHASE_ORDER_SETTLEMENT = '/purchase/order/settlement' // 修改订单结算状态
export const PURCHASE_COUNT = '/purchase/statistic/statistic'
export const PURCHASE_ORDER_EDIT_LOG = '/purchase/orderlog/list'; //订单修改记录


// 商砼砂浆
export const BUSINESS_LIST = '/sys/concrete/gettasklistall'
export const BUSINESS_ADD = '/sys/concrete/addtask'
export const BUSINESS_EDIT = '/sys/concrete/edittask'
export const BUSINESS_STATE = '' // 修改状态
export const BUSINESS_DEL = '/sys/concrete/deltask' //删除任务
export const BUSINESS_LIST_ENABLE = '/sys/concrete/gettasklist' // 有效任务列表
export const BUSINESS_TAG_LIST = '/sys/concrete/getgrade' // 标号

export const BUSINESS_ORDER_ADD = '/sys/concrete/assigntruck'
export const BUSINESS_ORDER_LIST = '/sys/concrete/orderlist'
export const BUSINESS_ORDER_EDIT = '/sys/concrete/editorder'
export const BUSINESS_ORDER_DEL = ''
export const BUSINESS_ORDER_INFO = '/sys/concrete/getorderinfo'


// 地磅波动
export const POUND_ROUND_DATA = '/wagon/wagon/getlist'

