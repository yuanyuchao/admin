<style scoped lang="less">

</style>

<template>
    <div class="order">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="订单号" data-flex="dir:left">
                    <Input v-model="searchForm.order_no" placeholder="订单号" />
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称" />
                </FormItem>
                <FormItem label="料类名称" data-flex="dir:left">
                    <Input v-model="searchForm.stone_name" placeholder="料类名称" style="width: 80px" />
                </FormItem>
                <FormItem label="料类分组">
                    <Select v-model="searchForm.group_id" filterable clearable>
                        <Option v-for="item in stoneGroupList" :value="item.id" :key="item.id">{{ item.group_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="车牌号" data-flex="dir:left">
                    <Input v-model="searchForm.plate_number" placeholder="车牌号" style="width: 80px" />
                </FormItem>
                <FormItem label="预定时间" data-flex="dir:left">
                    <DatePicker v-model="book_time" type="datetimerange" placeholder="预定时间" style="width: 280px" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box">
                <Button type="primary" @click="output" :loading="outputLoading">导出表格</Button>
            </div>

        </div>
        <Table height="500" :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <order-details ref="orderDetails" />
        <do-order ref="doOrder" />
        <human-settlement ref="huamanSettlement" />
    </div>
</template>

<script>
    import { getAppOrder } from '@/api/order'
    import OrderDetails from './components/OrderDetails'
    import DoOrder from './components/DoOrder'
    import {handleTime, maxExportMessage} from '@/libs/util'
    import HumanSettlement from './components/HumanSettlement'
    import {getStoneGroupListNp} from "@/api/stoneGroup";
    export default {
        props: {},
        components: {
            OrderDetails,
            DoOrder,
            HumanSettlement
        },
        data () {
            return {
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center',
                        indexMethod: (row) => {
                            return (row._index + 1) + 15 * (this.page.page - 1)
                        }
                    },
                    {
                        title: '订单号',
                        key: 'order_no',
                        tooltip: true,
                        width: 200
                    },
                    {
                        title: '客户名称',
                        key: 'customer_name',
                        width: 185,
                        tooltip: true,
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '料类',
                        key: 'stone_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '预装重量',
                        key: 'num',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '单价',
                        key: 'price',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '已付金额',
                        key: 'pay_money',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '预约金额',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.price * params.row.num)
                        }
                    },
                    {
                        title: '订单状态',
                        width: 150,
                        render: (h, params) => {
                            let data = params.row
                            let status = data.status;
                            switch (status)
                            { case 1:
                                return h('span',{
                                    style: {
                                        color:'green',
                                    }
                                },'登记');
                                break;
                                case 2:
                                    return h('span',{
                                        style: {
                                            color:'blue',
                                        }
                                    },'装车') ; break;
                                case 3:
                                    return h('span',{
                                        style: {
                                            color:'gray',
                                        }
                                    },'装车完成'); break;
                                case 4:
                                    return h('span',{
                                        style: {
                                            color:'#40E0D0',
                                        }
                                    },'已结算'); break;
                                default:return h('span',{
                                    style: {
                                        color:'red',
                                    }
                                },'已作废'); break;
                            }
                        }
                    },
                    {
                        title: '预定时间',
                        key: 'book_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 100,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                // _has('toVoidOrder') && h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.remove(params.row)
                                //         }
                                //     }
                                // }, '作废'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row)
                                        }
                                    }
                                }, '详情'),
                                // _has('orderSettlement') && h('Button', {
                                //     props: {
                                //         type: 'warning',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.settle(params.row)
                                //         }
                                //     }
                                // }, '人工结算'),
                            ])
                        }
                    }
                ],
                data: [],
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },
                searchForm: {
                    status: '',
                    order_no: '',
                    customer_name: '',
                    driver_name: '',
                    stone_name: '',
                    plate_number: '',
                    in_time: '',
                    load_time: '',
                    book_time:'',
                    group_id: '',
                },
                in_time: '',
                load_time: '',
                book_time:'',
                tableLoading: false,
                selectIds: [],

                outputLoading: false,
                stoneGroupList: [],
            }
        },
        created () {
            this.getData()
            this.getStoneGroupList()
            // setInterval(() => {
            //     console.log('一次')
            // },3000)
        },
        mounted () {
        },
        computed: {
            disDelSelect() {
                return this.selectIds.length <= 0
            }
        },
        watch: {
            'book_time': function() {
                this.searchForm.book_time = handleTime(this.book_time)
            },
            'load_time': function() {
                this.searchForm.load_time = handleTime( this.load_time)
            },
        },
        methods: {
            async getData () {
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm)
                let res = await getAppOrder(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data
                    this.page.total = res.data.total
                }
            },
            pageChange (index) {
                this.page.page = index
                this.getData()
            },
            show(data) {
                this.$refs.orderDetails.showModal(data)
            },
            remove(data) {
                this.$refs.doOrder.showModal(data)
            },
            settle(data) {
                this.$refs.huamanSettlement.showModal(data)
            },
            search() {
                this.page.page = 1
                this.selectIds = []
                this.getData()
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },
            async getStoneGroupList() {
                let res = await getStoneGroupListNp()
                if (res.status) {
                    this.stoneGroupList = res.data
                }
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                this.outputLoading = true
                let res = await getAppOrder(params)
                this.outputLoading = false
                if (res.status) {
                    maxExportMessage(res.data.total)
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'order'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
