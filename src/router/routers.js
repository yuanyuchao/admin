import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true,
        },
        component: () => import('@/view/login/Index.vue')
    },
    {
        path: '/message',
        name: 'message',
        component: Main,
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        children: [
            {
                path: 'message_page',
                name: 'message_page',
                meta: {
                    icon: 'md-notifications',
                    title: '消息中心'
                },
                component: () => import('@/view/single-page/message/index.vue')
            }
        ]
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/view/home/Index.vue')
            }
        ]
    },
    {
        path: '/customer',
        name: 'customer',
        component: Main,
        meta: {
            icon: 'md-contact',
            title: '客户管理',
        },
        children: [
            {
                path: 'index',
                name: 'customer-index',
                meta: {
                    icon: 'md-contact',
                    title: '客户列表',
                    // access: ['super_admin'],
                },
                component: () => import('@/view/customer/Index.vue')
            },
            {
                path: 'group',
                name: 'customer-group',
                meta: {
                    icon: 'md-contacts',
                    title: '客户分组'
                },
                component: () => import('@/view/customer/Group.vue')
            },
            {
                path: 'car',
                name: 'car-group',
                meta: {
                    icon: 'md-subway',
                    title: '客户车辆'
                },
                component: () => import('@/view/customer/Car.vue')
            },
        ]
    },
    {
        path: '/card',
        name: 'card',
        component: Main,
        meta: {
            icon: 'ios-card',
            title: '卡片管理'
        },
        children: [
            {
                path: 'index',
                name: 'card-index',
                meta: {
                    icon: 'ios-card',
                    title: '销售卡'
                },
                component: () => import('@/view/card/Index.vue')
            },
            {
                path: 'tag',
                name: 'card-tag',
                meta: {
                    icon: 'md-disc',
                    title: '车辆标签'
                },
                component: () => import('@/view/card/Tag.vue')
            },
        ]
    },
    {
        path: '/stone',
        name: 'stone',
        component: Main,
        meta: {
            icon: 'md-cog',
            title: '料类管理'
        },
        children: [
            {
                path: 'index',
                name: 'stone-index',
                meta: {
                    icon: 'ios-cog',
                    title: '料类管理'
                },
                component: () => import('@/view/stone/Index.vue')
            },
            {
                path: 'price',
                name: 'stone-price',
                meta: {
                    icon: 'md-pulse',
                    title: '料类价格'
                },
                component: () => import('@/view/stone/Price.vue')
            },
            {
                path: 'group',
                name: 'stone-group',
                meta: {
                    icon: 'ios-copy-outline',
                    title: '料类分组'
                },
                component: () => import('@/view/stone/Group.vue')
            },
            {
                path: 'history-price',
                name: 'stone-history-price',
                meta: {
                    icon: 'ios-pulse-outline',
                    title: '历史价格'
                },
                component: () => import('@/view/stone/HistoryPrice.vue')
            },
        ]
    },
    {
        path: '/order',
        name: 'order',
        component: Main,
        meta: {
            icon: 'md-pricetags',
            title: '订单管理'
        },
        children: [
            {
                path: 'bookingorder',
                name: 'order-bookingorder',
                meta: {
                    icon: 'ios-pricetags',
                    title: '预约订单'
                },
                component: () => import('@/view/order/BookingOrder.vue')
            },
            {
                path: 'index',
                name: 'order-index',
                meta: {
                    icon: 'md-pricetags',
                    title: '进行中的订单'
                },
                component: () => import('@/view/order/Index.vue')
            },
            {
                path: 'history',
                name: 'order-history',
                meta: {
                    icon: 'ios-pricetag',
                    title: '历史订单'
                },
                component: () => import('@/view/order/History.vue')
            },
            {
                path: 'invalid',
                name: 'order-invalid',
                meta: {
                    icon: 'ios-pricetags-outline',
                    title: '无效订单'
                },
                component: () => import('@/view/order/Invalid.vue')
            },
            // {
            //     path: 'orderPhoto',
            //     name: 'order-orderPhoto',
            //     meta: {
            //         icon: 'md-pricetag',
            //         title: '订单图片查看'
            //     },
            //     component: () => import('@/view/order/OrderPhoto.vue')
            // },
        ]
    },
    {
        path: '/sale',
        name: 'sale',
        component: Main,
        meta: {
            icon: 'md-construct',
            title: '销售计划'
        },
        children: [
            {
                path: 'sale/index',
                name: 'sale-plan',
                meta: {
                    icon: 'md-print',
                    title: '销售计划'
                },
                component: () => import('@/view/sale/Index.vue')
            },
        ]
    },
    {
        path: '/financial',
        name: 'financial',
        component: Main,
        meta: {
            icon: 'logo-yen',
            title: '财务统计'
        },
        children: [
            {
                path: 'index',
                name: 'financial-index',
                meta: {
                    icon: 'logo-usd',
                    title: '客户资金'
                },
                component: () => import('@/view/financial/Index.vue')
            },
            // {
            //     path: 'reconciliation',
            //     name: 'financial-group',
            //     meta: {
            //         icon: 'md-repeat',
            //         title: '客户对账'
            //     },
            //     component: () => import('@/view/financial/Reconciliation.vue')
            // },
            {
                path: 'count-report',
                name: 'count-report',
                meta: {
                    icon: 'md-book',
                    title: '统计报表',
                },
                component: () => import('@/view/financial/CountReport.vue')
            },
            // {
            //     path: 'order-report',
            //     name: 'order-report',
            //     meta: {
            //         icon: 'ios-list',
            //         title: '订单报表',
            //     },
            //     component: () => import('@/view/financial/CountReport.vue')
            // },
            // {
            //     path: 'form',
            //     name: 'financial-form',
            //     meta: {
            //         icon: 'md-trending-down',
            //         title: '统计报表'
            //     },
            //     component: () => import('@/view/financial/Form.vue')
            // },
        ]
    },
    {
        path: '/purchase',
        name: 'purchase',
        component: Main,
        meta: {
            icon: 'md-contact',
            title: '进料系统',
        },
        children: [
            {
                path: 'supplier',
                name: 'purchase-supplier',
                meta: {
                    icon: 'md-contact',
                    title: '供应商列表',
                    // access: ['super_admin'],
                },
                component: () => import('@/view/purchase/supplier.vue')
            },
            {
                path: 'stones',
                name: 'purchase-stones',
                meta: {
                    icon: 'md-contacts',
                    title: '料类列表'
                },
                component: () => import('@/view/purchase/stones.vue')
            },
            {
                path: 'carlist',
                name: 'purchase-carlist',
                meta: {
                    icon: 'md-subway',
                    title: '车辆列表'
                },
                component: () => import('@/view/purchase/carlist.vue')
            },
            {
                path: 'orders',
                name: 'purchase-orders',
                meta: {
                    icon: 'md-subway',
                    title: '订单列表'
                },
                component: () => import('@/view/purchase/orders.vue')
            },
            {
                path: 'count',
                name: 'purchase-count',
                meta: {
                    icon: 'md-subway',
                    title: '统计信息'
                },
                component: () => import('@/view/purchase/count.vue')
            },
        ]
    },
    {
        path: '/system',
        name: 'system',
        component: Main,
        meta: {
            icon: 'md-construct',
            title: '系统设置'
        },
        children: [
            // {
            //     path: 'customer',
            //     name: 'system-customer',
            //     meta: {
            //         icon: 'md-contact',
            //         title: '客户设置'
            //     },
            //     component: () => import('@/view/system/Customer.vue')
            // },
                {
                    path: 'accont/index',
                    name: 'account-index',
                    meta: {
                        icon: 'ios-contacts',
                        title: '账户管理'
                    },
                    component: () => import('@/view/system/account/Index.vue')
                },
                {
                    path: 'accont/role',
                    name: 'account-role',
                    meta: {
                        icon: 'ios-people',
                        title: '角色管理'
                    },
                    component: () => import('@/view/system/account/Role.vue')
                },
            {
                path: 'print/print',
                name: 'system-print',
                meta: {
                    icon: 'md-print',
                    title: '打印管理'
                },
                component: () => import('@/view/system/print/Print.vue')
            },
            {
                path: 'log',
                name: 'system-log',
                meta: {
                    icon: 'md-paper',
                    title: '操作日志'
                },
                component: () => import('@/view/system/Log.vue')
            },
            {
                path: 'error',
                name: 'system-error',
                meta: {
                    icon: 'md-shuffle',
                    title: '错误报告'
                },
                component: () => import('@/view/system/Error.vue')
            },
            {
                path: 'factory',
                name: 'system-factory',
                meta: {
                    icon: 'md-contact',
                    title: '厂区设置'
                },
                component: () => import('@/view/system/Factory.vue')
            },
            {
                path: 'pound-round',
                name: 'system-pound-round',
                meta: {
                    icon: 'md-list',
                    title: '地磅波动'
                },
                component: () => import('@/view/system/PoundRound.vue')
            },
        ]
    },
    {
        path: '/other',
        name: 'other',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: 'scan',
                name: 'o-scan',
                component: () => import('@/view/other/ScanCode.vue'),
                meta: {
                    hideInMenu: true,
                    title: '快速入口',
                    notCache: true
                }
            }
        ]
    }

]
