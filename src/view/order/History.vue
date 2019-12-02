<style scoped lang="less">

</style>

<template>
    <div class="history">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="订单号" data-flex="dir:left">
                    <Input v-model="searchForm.order_no" placeholder="订单号" />
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称" />
                </FormItem>
                <FormItem label="料类名称" data-flex="dir:left">
                    <Input v-model="searchForm.stone_name" placeholder="料类名称" style="width: 70px" />
                </FormItem>
                <FormItem label="料类分组">
                    <Select v-model="searchForm.group_id" filterable clearable>
                        <Option v-for="item in stoneGroupList" :value="item.id" :key="item.id">{{ item.group_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="车牌号" data-flex="dir:left">
                    <Input v-model="searchForm.plate_number" placeholder="车牌号" style="width: 70px" />
                </FormItem>
                <FormItem label="入场时间" data-flex="dir:left">
                    <DatePicker v-model="in_time" type="datetimerange" placeholder="入场时间" style="width: 280px" />
                </FormItem>
                <!--<FormItem label="状态" data-flex="dir:left">-->
                    <!--<Input v-model="searchForm.status" placeholder="状态" style="width: 100px" />-->
                <!--</FormItem>-->
                <FormItem label="装车时间" data-flex="dir:left">
                    <DatePicker v-model="load_time" type="datetimerange" placeholder="装车时间" style="width: 280px" />
                </FormItem>
                <FormItem label="结算时间" data-flex="dir:left">
                    <DatePicker v-model="settlement_time" type="datetimerange" placeholder="结算时间" style="width: 280px" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box" style="width: 380px">
                <Button type="primary" v-if="$_has('orderExport')"  @click="output" :loading="outputLoading">导出表格</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="success" v-if="$_has('orderSupplement')" class="add-bt" @click="record">补录订单</Button>
            </div>
        </div>
        <Table height="500" :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <order-details ref="orderDetails" />
        <modify-order ref="modifyOrder" />
        <record-order ref="recordOrder" />
        <edit-log ref="editLog"/>
        <do-order ref="doOrder" />
    </div>
</template>

<script>
    import { getOrderList } from '@/api/order'
    import OrderDetails from './components/OrderDetails'
    import ModifyOrder from './components/ModifyOrder'
    import RecordOrder from './components/RecordOrder'
    import {handleTime, cusPrint, maxExportMessage} from '@/libs/util'
    import { getPrinttpl } from '@/api/printtpl'
    import DoOrder from './components/DoOrder'
    import EditLog from './components/EditLog'
    import _ from 'lodash'
    import {getStoneGroupListNp} from "@/api/stoneGroup";



    export default {
        props: {},
        components: {
            OrderDetails,
            ModifyOrder,
            RecordOrder,
            EditLog,
            DoOrder,
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
                        width: 180
                    },
                    {
                        title: '客户名称',
                        key: 'customer_name',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.customer_name || '散户')
                        }
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '料类',
                        key: 'stone_name',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '皮重',
                        key: 'tare_weight',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '预装重量',
                        key: 'preload',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '毛重',
                        key: 'gross_weight',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '净重',
                        key: 'net_weight',
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
                        title: '总金额',
                        key: 'money',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '订单状态',
                        width: 100,
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
                        title: '登记终端',
                        key: 'in_terminal',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '入场时间',
                        key: 'in_time',
                        width: 150,
                        tooltip: true,

                    },
                    {
                        title: '装车终端',
                        key: 'load_terminal',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '装车时间',
                        key: 'load_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '结算终端',
                        key: 'out_terminal',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '结算时间',
                        key: 'settlement_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 300,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('orderCancel') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row)
                                        }
                                    }
                                }, '作废'),
                                _has('orderUp') && h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.modify(params.row)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$refs.editLog.showModal(params.row.id)
                                        }
                                    }
                                }, '修改记录'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row)
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.print(params.row)
                                        }
                                    }
                                }, '打印'),
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
                    status: 4,
                    order_no: '',
                    customer_name: '',
                    driver_name: '',
                    stone_name: '',
                    plate_number: '',
                    in_time: '',
                    load_time: '',
                    settlement_time:'',
                    customer_id:'',
                    group_id: '',
                },
                in_time: '',
                load_time: '',
                settlement_time:'',
                tableLoading: false,
                selectIds: [],
                printTemplate: '',

                outputLoading: false,
                stoneGroupList: [],
            }
        },
        created () {
            this.getData()
            this.getStoneGroupList()
        },
        mounted () {

        },
        watch: {
            'in_time': function() {
                this.searchForm.in_time = handleTime(this.in_time)
            },
            'load_time': function() {
                this.searchForm.load_time = handleTime( this.load_time)
            },
            'settlement_time': function() {
                this.searchForm.settlement_time = handleTime( this.settlement_time)
            }
        },
        computed: {
            disDelSelect() {
                return this.selectIds.length <= 0
            }
        },
        methods: {
            async getData () {
                this.tableLoading = true;
                // this.searchForm.in_time = handleTime(this.searchForm.in_time)
                // this.searchForm.void_time = handleTime(this.searchForm.void_time)
                if(this.searchForm.customer_name=='散户'){
                    this.searchForm.customer_id=-1
                    this.searchForm.customer_name=''
                }
                let params = Object.assign(this.page, this.searchForm)
                let res = await getOrderList(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data
                    this.page.total = res.data.total
                    this.searchForm.customer_id=''
                }
            },
            pageChange (index) {
                this.page.page = index
                this.getData()
            },
            search() {
                this.page.page = 1
                this.selectIds = []
                this.getData()
            },
            show(data) {
                this.$refs.orderDetails.showModal(data)
            },
            modify(data) {
                this.$refs.modifyOrder.showModal(data)
            },
            record() {
                this.$refs.recordOrder.showModal()
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
                let res = await getOrderList(params)
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
            async print(data) {
                await this.getPrintTpl(data.id) // 后端会增加打印次数
                let compiled = _.template(this.printTemplate);
                if (data.src_flag === 1) {
                    data.isFlag = '补录订单'
                }else {
                    data.isFlag = ''
                }
                let body = compiled(data);
                cusPrint(body)
            },
            async getPrintTpl(order_id) {
                let res = await getPrinttpl({scene: 1, order_id});
                this.printTemplate = res.data.template
            },
            remove(data) {
                this.$refs.doOrder.showModal(data)
            },
        },
    }
</script>
