<style scoped lang="less">

</style>

<template>
    <div class="customer">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="起止时间" data-flex="dir:left">
                    <DatePicker
                            type="datetimerange"
                            :value="searchForm.time"
                            @on-change="setTareTime"
                            split-panels
                            placeholder="请选择起止时间"
                            style="width: 280px"
                    ></DatePicker>
                </FormItem>
                <FormItem label="车牌号" data-flex="dir:left">
                    <Input v-model="searchForm.plate_number" placeholder="车牌号"></Input>
                </FormItem>
                <FormItem label="卡号" data-flex="dir:left">
                    <Input v-model="searchForm.id_card_number" placeholder="卡号"></Input>
                </FormItem>
                <FormItem label="供应商名称" data-flex="dir:left">
                    <Select v-model="searchForm.supplier_id" filterable clearable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="料类名称" data-flex="dir:left">
                    <Select v-model="searchForm.stone_id" filterable clearable>
                        <Option v-for="item in stoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="状态" data-flex="dir:left">
                    <Select v-model="searchForm.status" filterable clearable>
                        <Option v-for="item in stateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="结算状态" data-flex="dir:left">
                    <Select v-model="searchForm.settlement_status" filterable clearable>
                        <Option v-for="(item, key) in settlementState" :value="key" :key="key">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" @click="record">补录订单</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <!--<Button type="success" v-if="$_has('addCustomer')" class="add-bt" @click="addData">新增</Button>-->
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <order-details ref="orderDetails" />
        <modify-order ref="modifyOrder" />
        <record-order ref="recordOrder" />
        <edit-log ref="editLog"/>
    </div>
</template>
<script>
    import {purchaseOrderList, getStoneAllList, getSupplierAllList, setOrderSettlement} from '@/api/purchase'
    import OrderDetails from './components/OrderDetail'
    import ModifyOrder from './components/UpdateOrder'
    import { getPrinttpl } from '@/api/printtpl'
    import { cusPrint} from  '@/libs/util'
    import RecordOrder from "./components/recordOrder"
    import {PURCHASE_SETTLE_STATE, PURCHASE_SETTLE_STATE_TEXT, purchaseType} from "@/config/custom";
    import _ from 'lodash'
    import EditLog from './components/EditLog'


    export default {
        props: {},
        components: {
            OrderDetails,
            ModifyOrder,
            RecordOrder,
            EditLog,
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
                        width: 180,
                        tooltip: true,
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '供应商名称',
                        key: 'supplier_name',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '料类名称',
                        key: 'stone_name',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '卡号',
                        key: 'idcard_no',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '单价（/吨）',
                        key: 'price',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '运费（/吨）',
                        key: 'freight',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '皮重',
                        key: 'tare_weight',
                        width: 80,
                        tooltip: true,
                    },
                    {
                        title: '毛重',
                        key: 'gross_weight',
                        width: 80,
                        tooltip: true,
                    },
                    {
                        title: '净重',
                        key: 'net_out_weight',
                        width: 80,
                    },
                    {
                        title: '扣除',
                        key: 'soil',
                        width: 80,
                    },
                    {
                        title: '实收净重',
                        key: 'net_weight',
                        width: 100,
                    },
                    {
                        title: '总运费',
                        key: 'total_freight',
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
                        key: 'status_text',
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            let status = data.status_text;
                            switch (status)
                            { case '已登记':
                                return h('span',{
                                    style: {
                                        color:'green',
                                    }
                                },'已登记');
                                break;
                                case '已称皮':
                                    return h('span',{
                                        style: {
                                            color:'blue',
                                        }
                                    },'已称皮') ; break;
                                default:return h('span',{
                                    style: {
                                        color:'#40E0D0',
                                    }
                                },'已称毛'); break;
                            }
                        }
                    },
                    {
                        title: '验料状态',
                        width: 100,
                        key: 'verify_text',
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            let enable = data.verify_text == '已核验'
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            }, enable ? '已核验' : '未核验')
                        }
                    },
                    {
                        title: '结算状态',
                        width: 100,
                        key: 'settlement_text',
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            let enable = data.settlement_status == PURCHASE_SETTLE_STATE.ok
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            }, PURCHASE_SETTLE_STATE_TEXT[data.settlement_status])
                        }
                    },
                    {
                        title: '入场时间',
                        key: 'gross_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '出厂时间',
                        key: 'tare_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '验料时间',
                        key: 'verify_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '验料人',
                        key: 'verify_name',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '结算时间',
                        key: 'settlement_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '结算人',
                        key: 'settlement_name',
                        width: 100,
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
                                _has('purchaseOrderSettle') && params.row.settlement_status == PURCHASE_SETTLE_STATE.no && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.settle(params.row.order_no)
                                        }
                                    }
                                }, '结算'),
                                _has('updatePurchaseOrder') && h('Button', {
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
                                _has('detailPurchaseOrder') && h('Button', {
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
                                _has('printPurchaseOrder') && h('Button', {
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
                    plate_number: '',
                    supplier_id: '',
                    stone_id: '',
                    id_card_number: '',
                    status: '',
                    settlement_status: '',
                    time: '',
                },
                tableLoading: false,
                selectIds: [],
                printTemplate:'',
                customerList:[],
                stoneList: [],
                stateList: purchaseType,
                settlementState: PURCHASE_SETTLE_STATE_TEXT,
            }
        },
        mounted () {
            this.getData()
            this.getNameList()
        },
        computed: {
            disDelSelect() {
                return this.selectIds.length <= 0
            }
        },
        methods: {
            async getNameList() {
                let res = await getStoneAllList()
                if (res.status) {
                    this.stoneList = res.data
                }
                let res1 = await getSupplierAllList()
                if (res1.status) {
                    this.customerList = res1.data
                }
            },
            async getData () {
                let data  = {}
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm, data)
                let res = await purchaseOrderList(params)
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
            show(data) {
                this.$refs.orderDetails.showModal(data)
            },
            modify(data) {
                this.$refs.modifyOrder.showModal(data)
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await purchaseOrderList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'purchaseOrders'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            async print(data) {
                if (this.printTemplate == '') {
                    await this.getPrintTpl()
                }
                let compiled = _.template(this.printTemplate);
                let body = compiled(data);
                cusPrint(body)
            },
            async getPrintTpl() {
                let res = await getPrinttpl({scene: 1});
                this.printTemplate = res.data.template
            },
            record(){
                this.$refs.recordOrder.showModal();
            },

            settle(order_no) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认结算么？',
                    onOk: async () => {
                        let res = await setOrderSettlement(order_no)
                        if (res.status) {
                            this.$Message.success('结算成功')
                            this.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            setTareTime(value) {
                if (value[0]) {
                    this.searchForm.time = value[0] + " - " + value[1];
                } else {
                    this.searchForm.time = "";
                }
            },
        },
    }
</script>
