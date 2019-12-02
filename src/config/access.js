export default {
    // 菜单权限
    menu: [
        {
            title: '客户管理',
            selected:true,
            path: '/customer',
            name: 'customer',
            meta: {
                icon: 'md-contact',
                title: '客户管理',
                expand: true,
                selected: true,
            },
            children: [
                {
                    title: '客户列表',
                    path: 'index',
                    name: 'customer-index',
                    meta: {
                        icon: 'md-contact',
                        title: '客户列表',
                        expand: true,
                        // access: ['super_admin'],
                    },
                    children: [
                        {
                            title: '新增客户',
                            checked: false,
                            value: 'addCustomer'
                        },
                        {
                            title: '修改信息',
                            checked: false,
                            value: 'udpateCustomer'
                        },
                        {
                            title: '启用禁用',
                            checked: false,
                            value: 'changeAccountState'
                        },
                        {
                            title: '删除客户',
                            checked: false,
                            value: 'delCustomer'
                        },
                    ]
                },
                {
                    title: '客户分组',
                    path: 'group',
                    name: 'customer-group',
                    meta: {
                        icon: 'md-contacts',
                        title: '客户分组'
                    },
                    children: [
                        {
                            title: '新增用户',
                            value: 'addCustomerGroup'
                        },
                        {
                            title: '修改信息',
                            value: 'udpateCustomerGroup'
                        },
                        {
                            title: '添加客户',
                            value: 'udpateCustomerGroupinc'
                        },
                        {
                            title: '移除客户',
                            value: 'udpateCustomerGroupdel'
                        },
                        {
                            title: '删除分组',
                            value: 'delCustomerGroup'
                        },
                    ]
                },
                {
                    title: '客户车辆',
                    path: 'car',
                    name: 'car-group',
                    meta: {
                        icon: 'md-subway',
                        title: '客户车辆'
                    },
                    children: [
                        {
                            title: '新增车辆',
                            value: 'addTruck',
                        },
                        {
                            title: '修改信息',
                            value: 'updateTruck',
                        },
                        {
                            title: '删除车辆',
                            value: 'delTruck',
                        },
                    ]
                },
            ]
        },
        {
            title: '卡片管理',
            path: '/card',
            name: 'card',
            meta: {
                icon: 'ios-card',
                title: '卡片管理'
            },
            children: [
                {
                    title: '销售卡',
                    path: 'index',
                    name: 'card-index',
                    meta: {
                        icon: 'ios-card',
                        title: '销售卡'
                    },
                    children: [
                        {
                            title: '制卡',
                            value: 'addCard'
                        },
                        {
                            title: '修改信息',
                            value: 'updateCard'
                        },
                        {
                            title: '挂失',
                            value: 'lossCard'
                        },
                        {
                            title: '退卡',
                            value: 'cardDel'
                        },
                    ]
                },
                {
                    title: '车辆标签',
                    meta: {
                        icon: 'md-disc',
                        title: '车辆标签'
                    },
                    path: 'tag',
                    name: 'card-tag',
                },
            ]
        },
        {
            title: '料类管理',
            path: '/stone',
            name: 'stone',
            meta: {
                icon: 'md-cog',
                title: '料类管理'
            },
            children: [
                {
                    title: '料类管理',
                    path: 'index',
                    name: 'stone-index',
                    meta: {
                        icon: 'ios-cog',
                        title: '料类管理'
                    },
                    children: [
                        {
                            title: '添加料类',
                            value: 'addStone'
                        },
                        {
                            title: '启用禁用',
                            value: 'editStoneuse'
                        },
                        {
                            title: '修改信息',
                            value: 'editStone'
                        },
                        {
                            title: '删除',
                            value: 'delStone'
                        },
                    ]
                },
                {
                    title: '料类价格',
                    path: 'price',
                    meta: {
                        icon: 'md-pulse',
                        title: '料类价格'
                    },
                    name: 'stone-price',
                    children: [
                        {
                            title: '添加料价',
                            value: 'addStonePrice'
                        },
                        {
                            title: '批量改价',
                            value: 'editStonePriceAll'
                        },
                        {
                            title: '修改信息',
                            value: 'editStonePrice'
                        },
                        {
                            title: '删除',
                            value: 'delStonePrice'
                        },
                    ]
                },
                {
                    title: '料类分组',
                    path: 'group',
                    meta: {
                        icon: 'ios-copy-outline',
                        title: '料类分组'
                    },
                    name: 'stone-group',
                    children: [
                        {
                            title: '添加分组',
                            value: 'addStoneGroup'
                        },
                        {
                            title: '修改信息',
                            value: 'editStoneGroup'
                        },
                        {
                            title: '添加料类',
                            value: 'batchStoneGroup'
                        },
                        {
                            title: '移除料类',
                            value: 'delbatchStoneGroup'
                        },
                        {
                            title: '删除角色',
                            value: 'delStoneGroup'
                        },
                    ]
                },
                {
                    title: '历史价格',
                    path: 'history-price',
                    meta: {
                        icon: 'ios-pulse-outline',
                        title: '历史价格'
                    },
                    name: 'stone-history-price',
                },
            ]
        },
        {
            title: '订单管理',
            path: '/order',
            name: 'order',
            meta: {
                icon: 'md-pricetags',
                title: '订单管理'
            },
            children: [
                {
                    title: '预约订单',
                    path: 'bookingorder',
                    name: 'order-bookingorder',
                    meta: {
                        icon: 'ios-pricetags',
                        title: '预约订单'
                    },
                    children: [
                        {
                            title: '作废订单',
                            value: 'toVoidOrder',
                        },
                        {
                            title: '人工结算',
                            value: 'orderSettlement',
                        },
                    ]
                },
                {
                    title: '进行中的订单',
                    path: 'index',
                    name: 'order-index',
                    meta: {
                        icon: 'md-pricetags',
                        title: '进行中的订单'
                    },
                    children: [
                        {
                            title: '作废订单',
                            value: 'toVoidOrder',
                        },
                        {
                            title: '人工结算',
                            value: 'orderSettlement',
                        },
                        {
                            title: '修改订单',
                            value: 'ingOrderUp',
                        },
                    ]
                },
                {
                    title: '历史订单',
                    path: 'history',
                    meta: {
                        icon: 'ios-pricetag',
                        title: '历史订单'
                    },
                    name: 'order-history',
                    children: [
                        {
                            title: '补录订单',
                            value: 'orderSupplement',
                        },
                        {
                            title: '修改订单',
                            value: 'orderUp',
                        },
                        {
                            title: '作废订单',
                            value: 'orderCancel',
                        },
                        {
                            title: '导出表格',
                            value: 'orderExport',
                        },
                    ]
                },
                {
                    title: '无效订单',
                    path: 'invalid',
                    name: 'order-invalid',
                    meta: {
                        icon: 'ios-pricetags-outline',
                        title: '无效订单'
                    },
                },
            ]
        },
        {
            title: '销售计划',
            path: '/sale',
            name: 'sale',
            meta: {
                icon: 'sale-plan',
                title: '销售计划'
            },
            children: [
                {
                    path: 'sale/index',
                    name: 'sale-plan',
                    title: '销售计划',
                    meta: {
                        icon: 'md-print',
                        title: '销售计划'
                    },
                },
            ]
        },
        {
            title: '财务统计',
            path: '/financial',
            name: 'financial',
            meta: {
                icon: 'logo-yen',
                title: '财务统计'
            },
            children: [
                {
                    title: '客户资金',
                    path: 'index',
                    name: 'financial-index',
                    meta: {
                        icon: 'logo-usd',
                        title: '客户资金'
                    },
                    children: [
                        {
                            title: '充值',
                            value: 'balanceRecharge'
                        },
                        {
                            title: '退款',
                            value: 'balanceRefund'
                        },
                        {
                            title: '查看流水',
                            value: 'summaryList'
                        },
                        {
                            title: '调整额度',
                            value: 'balanceDownUp'
                        },
                        {
                            title: '禁用启用',
                            value: 'changedBalance'
                        },
                    ]
                },
                // {
                //     title: '客户对账',
                //     path: 'reconciliation',
                //     name: 'financial-group',
                //     meta: {
                //         icon: 'md-repeat',
                //         title: '客户对账'
                //     },
                // },
                {
                    title: '统计报表',
                    path: 'count-report',
                    name: 'count-report',
                    meta: {
                        icon: 'md-book',
                        title: '统计报表'
                    },
                },
            ]
        },
        {
            title: '进料系统',
            path: '/purchase',
            name: 'purchase',
            meta: {
                icon: 'md-contact',
                title: '进料系统',
            },
            children: [
                {
                    title: '供应商列表',
                    path: 'supplier',
                    name: 'purchase-supplier',
                    meta: {
                        icon: 'md-contact',
                        title: '供应商列表',
                        // access: ['super_admin'],
                    },
                    children: [
                        {
                            title: '新增供应商',
                            value: 'addSupplier'
                        },
                        {
                            title: '修改信息',
                            value: 'udpateSupplier'
                        },
                        {
                            title: '启用禁用',
                            value: 'changeSupplier'
                        },
                        {
                            title: '删除供应商',
                            value: 'delSupplier'
                        },
                    ]
                },
                {
                    title: '料类列表',
                    path: 'stones',
                    name: 'purchase-stones',
                    meta: {
                        icon: 'md-contacts',
                        title: '料类列表'
                    },
                    children: [
                        {
                            title: '新增料类',
                            value: 'addPurchaseStones'
                        },
                        {
                            title: '启用禁用',
                            value: 'changePurchaseStones'
                        },
                        {
                            title: '修改料类',
                            value: 'udpatePurchaseStones'
                        },
                        {
                            title: '删除料类',
                            value: 'delPurchaseStones'
                        },
                    ]
                },
                {
                    title: '车辆列表',
                    path: 'carlist',
                    name: 'purchase-carlist',
                    meta: {
                        icon: 'md-subway',
                        title: '车辆列表'
                    },
                    children: [
                        {
                            title: '新增车辆',
                            value: 'addPurchaseTruck',
                        },
                        {
                            title: '修改信息',
                            value: 'updatePurchaseTruck',
                        },
                        {
                            title: '删除车辆',
                            value: 'delPurchaseTruck',
                        },
                    ]
                },
                {
                    title: '订单列表',
                    path: 'orders',
                    name: 'purchase-orders',
                    meta: {
                        icon: 'md-subway',
                        title: '订单列表'
                    },
                    children: [
                        {
                            title: '结算订单',
                            value: 'purchaseOrderSettle',
                        },
                        {
                            title: '修改订单',
                            value: 'updatePurchaseOrder',
                        },
                        {
                            title: '订单详情',
                            value: 'detailPurchaseOrder',
                        },
                        {
                            title: '打印订单',
                            value: 'printPurchaseOrder',
                        },
                    ]
                },
                {
                    title: '统计信息',
                    path: 'count',
                    name: 'purchase-count',
                    meta: {
                        icon: 'md-subway',
                        title: '统计信息'
                    }
                }
            ]},
        {
            title: '系统设置',
            path: '/system',
            name: 'system',
            meta: {
                icon: 'md-construct',
                title: '系统设置'
            },
            children: [
                {
                    title: '账户管理',
                    path: 'account/index',
                    name: 'account-index',
                    meta: {
                        icon: 'ios-contacts',
                        title: '账户管理'
                    },
                    children: [
                        {
                            title: '添加账户',
                            value: 'addAccount'
                        },
                        {
                            title: '重置密码',
                            value: 'resetAccountPass'
                        },
                        {
                            title: '设置角色',
                            value: 'setAccountRole'
                        },
                        {
                            title: '启用禁用',
                            value: 'setAccountState'
                        },
                        {
                            title: '修改信息',
                            value: 'editAccount'
                        },
                        {
                            title: '删除账户',
                            value: 'delAccount'
                        },
                    ]
                },
                {
                    title: '角色管理',
                    path: 'account/role',
                    meta: {
                        icon: 'ios-people',
                        title: '角色管理'
                    },
                    name: 'account-role',
                    children: [
                        {
                            title: '添加角色',
                            value: 'addRole'
                        },
                        {
                            title: '启用禁用',
                            value: 'setRoleState'
                        },
                        {
                            title: '查看权限',
                            value: 'seeRole'
                        },
                        {
                            title: '修改角色',
                            value: 'editRole'
                        },
                        {
                            title: '删除账户',
                            value: 'delRole'
                        },
                    ]
                },
                {
                    title: '操作日志',
                    path: 'log',
                    name: 'system-log',
                    meta: {
                        icon: 'md-paper',
                        title: '操作日志'
                    },

                },
                {
                    title: '错误报告',
                    path: 'error',
                    meta: {
                        icon: 'md-shuffle',
                        title: '错误报告'
                    },
                    name: 'system-error',
                },
                {
                    title: '打印管理',
                    meta: {
                        icon: 'md-print',
                        title: '打印管理'
                    },
                    path: 'print/print',
                    name: 'system-print',
                },
                {
                    title: '厂区设置',
                    meta: {
                        icon: 'md-print',
                        title: '厂区设置'
                    },
                    path: 'Factory',
                    name: 'system-print',
                },
                {
                    title: '地磅波动',
                    meta: {
                        icon: 'md-list',
                        title: '地磅波动'
                    },
                    path: 'pound-round',
                    name: 'system-pound-round',
                },
            ]
        },
    ],
    // 制卡权限
    card: {
        all: {value: 1, title: '所有'},      // 所有
        retail: {value: 2, title: '散户'},   // 散户
        deposit: {value: 3, title: '预存款'}  // 预存款
    }
}
