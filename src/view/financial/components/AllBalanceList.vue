<style scoped lang="less">

</style>

<template>
    <Modal v-model="modal"  width="90%"  title="客户流水" footer-hide >
        <Form ref="form" :model="searchForm" class="search-form item-inline-flex">
            <FormItem label="客户名称">
                <Select v-model="searchForm.customer_id" :disabled="edit" filterable clearable>
                    <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="开始时间" data-flex="dir:left">
                <DatePicker v-model="start_time" type="datetime" placeholder="开始时间" style="width: 220px" />
            </FormItem>
            <FormItem label="结束时间" data-flex="dir:left">
                <DatePicker v-model="end_time" :options="options" type="datetime" placeholder="结束时间" style="width: 220px" />
            </FormItem>
            <FormItem label="操作类型" data-flex="dir:left">
                <Select v-model="type" filterable clearable>
                    <Option v-for="(item,index) in zhi_type" :value="parseInt(index)" :key="parseInt(index)">{{ item }}</Option>
                </Select>
            </FormItem>
            <FormItem label="操作人" data-flex="dir:left">
                <Select v-model="searchForm.operator" filterable clearable>
                    <Option v-for="item in accountList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="search">搜索</Button>
            </FormItem>
            <Button style="position: absolute;right: 20px" type="success" @click="output">导出表格</Button>
            <div class="customer" >
                <Table ref="table" :columns="columns" :data="data" :loading="tableLoading"></Table>
            </div>
            <div  style="display: flex; justify-content: space-between; align-items: center">
                <div class="page-box">
                    <FormItem  label="合计：">
                        <!--<Input readonly :value="item.money" :key="index" type="text" />-->
                    </FormItem>
                    <FormItem v-for="(item, index) in count" :key="index" :label="item.type">
                        <Input readonly :value="item.money" :key="index" type="text" />
                    </FormItem>
                </div>
                <div data-flex="dir: right">
                    <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
                </div>
            </div>
        </Form>
        <edit-balance ref="editBalance" />
    </Modal>

</template>
<script>
    import { getBalacneList } from '@/api/balance'
    import {checkAdd} from '@/api/verify'
    import {getAllAccountList} from '@/api/account'
    import { ZHI_TYPE } from '@/config/custom'
    import {cusPrint} from  '@/libs/util'
    import EditBalance from './EditBalance'
    import { getPrinttpl } from '@/api/printtpl'
    import {getCustomerNameList} from '@/api/customer'
    import { compareTime} from  '@/libs/util'
    import dayjs from 'dayjs'
    export default {
        props: {},
        components: {
            EditBalance
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
                        title: '客户名称',
                        key: 'customer_name',
                        width: 280,
                        tooltip: true,
                    },
                    {
                        title: '交易类型',
                        key:'type',
                        width: 150,
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            let status = data.type; //0:空闲  1:游戏  2:未上线
                            switch (status)
                            { case 0:
                                return h('span',{
                                    style: {
                                        color:'green',
                                    }
                                },'充值');
                                break;
                                case 1:
                                    return h('span',{
                                        style: {
                                            color:'blue',
                                        }
                                    },'退款 ') ; break;
                                case 2:
                                    return h('span',{
                                        style: {
                                            color:'gray',
                                        }
                                    },'订单消费'); break;
                                case 3:
                                    return h('span',{
                                        style: {
                                            color:'red',
                                        }
                                    },'订单回退'); break;
                            }

                        }
                    },
                    {
                        title: '充值金额',
                        width: 120,
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            return h('span', data.type==0?data.money:'');
                        },
                    },
                    {
                        title: '退款金额',
                        width: 120,
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            return h('span', data.type==1?data.money:'');
                        },
                    },
                    {
                        title: '订单消费金额',
                        width: 120,
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            return h('span', data.type==2?data.money:'');
                        },
                    },
                    {
                        title: '订单回退金额',
                        width: 120,
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            return h('span', data.type==3?data.money:'');
                        },
                    },
                    {
                        title: '上期余额',
                        key: 'balance_before',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '本期余额',
                        key: 'balance_after',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '交易时间',
                        key: 'create_time',
                        width: 180,
                        tooltip: true,
                    },
                    {
                        title: '操作人姓名',
                        key: 'create_operator_name',
                        width: 150,
                        // width: 150,
                        tooltip: true,
                    },
                    {
                        title: '流水号',
                        key: 'log_no',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '支付流水号',
                        key: 'trade_no',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '操作备注',
                        key: 'remark',
                        width: 250,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 230,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                (params.row.type == 0 ||params.row.type == 1) && h('Button', {
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
                                (params.row.type == 0 ||params.row.type == 1) && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.editMoney(params.row)
                                        }
                                    }
                                }, '修改'),
                                (params.row.type == 0 ||params.row.type == 1) && params.row.check_status != 0 && h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除'),
                                params.row.check_status == 0 && h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small',
                                        disabled: true,
                                    },
                                }, '删除审核中'),
                            ])
                        }
                    }
                ],
                data: [],
                zhi_type: {},
                zhi_type_el: ZHI_TYPE,
                page: {
                    page: 1,
                    list_rows: 10,
                    total: 0
                },
                searchForm: {
                    customer_id: '',
                    create_time: '',
                    operator: '',
                },
                type:'',
                eltype:'',
                time: '',
                count: '',
                customerList:'',
                accountList: '',
                printTemplate: '',
                tableLoading:false,
                modal: false,
                start_time:'',
                end_time:'',
                options: {},
                form:'',
                edit: false,
            }
        },
        mounted () {
            // this.getData ()
            this.getNameList()
            this.getAccountList()
        },
        computed: {
        },
        watch: {
            'start_time': function (value) {
                this.start_time = dayjs(this.start_time).format('YYYY-MM-DD HH:mm:ss')
                let time = this.start_time.split(' ')
                this.options = {
                    disabledDate (date) {
                        return date && date.valueOf() < new Date(time[0]) - 86400000
                    }
                }
            },
            'end_time': function (value) {
                this.end_time = dayjs(this.end_time).format('YYYY-MM-DD HH:mm:ss')
                let date = this.end_time.split(' ')
                if (date[1] == '00:00:00') {
                    this.end_time = date[0] + ' ' + '23:59:59'
                }
            },
        },
        methods: {
            initLog() {
                if (_has('balanceRechargeLog')) this.zhi_type['0'] = '充值', this.eltype += 0 + ','
                if (_has('balanceRefundLog')) this.zhi_type['1'] = '退款', this.eltype += 1 + ','
                if (_has('orderLog')) this.zhi_type['2'] = '订单消费', this.eltype += 2 + ','
                if (_has('orderBackLog')) this.zhi_type['3'] = '订单回退', this.eltype += 3 + ','
                this.getData()
            },
            async getData () {
                let type = this.type
                if (String(type).length == 1) {
                    type = this.zhi_type[this.type]
                    for (let i in this.zhi_type_el) {
                        if (this.zhi_type_el[i] == type) type = i
                    }
                }else {
                    type = this.eltype
                }
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm, {type: type})
                let res = await getBalacneList(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data;
                    this.count = res.data.total_count
                    for (let i in this.count) {
                        this.count[i].type = this.zhi_type_el[this.count[i].type]
                    }
                    this.page.total = res.data.total;
                }
            },
            async getNameList() {
                let res = await getCustomerNameList()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            async getAccountList() {
                let res = await getAllAccountList()
                if (res.status) {
                    this.accountList = res.data
                }
            },
            pageChange (index) {
                this.page.page = index
                this.getData();
            },
            showModal(params){
                if (params) {
                    this.searchForm.customer_id = params.id
                    this.edit = true
                }else {
                    this.edit =false
                }
                console.log(this.searchForm.customer_id,params, '444')
                this.modal = true;
                this.initLog()
                // this.getData();
            },
            hideModal() {
                this.tableLoading = false;
                this.modal = false;
            },
            async print(data) {
                if (this.printTemplate == '') {
                    await this.getPrintTpl()
                }
                if (data.type == 0) {
                    data.type = '收款'
                } else{
                    data.type = '退款'
                }
                if (data.pay_type == 0) {
                    data.pay_type = '现金'
                } else if (data.pay_type == 1) {
                    data.pay_type = '银行支付'
                } else {
                    data.pay_type = '其它'
                }
                let compiled = _.template(this.printTemplate);
                let body = compiled(data);
                cusPrint(body)
            },
            async getPrintTpl() {
                let res = await getPrinttpl({scene: 5});
                this.printTemplate = res.data.template
            },
            search() {
                this.page.page = 1
                this.selectIds = []
                this.searchForm.create_time = compareTime(this.start_time, this.end_time)
                if (this.searchForm.create_time === false)  return
                this.getData()
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getBalacneList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'financial'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            editMoney(params) {
                this.$refs.editBalance.showModal(params)
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '请确认是否删除',
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.remark,
                                autofocus: true,
                                placeholder: '请输入删除原因'
                            },
                            on: {
                                input: (val) => {
                                    this.remark = val;
                                }
                            }
                        })
                    },
                    onOk: async () => {
                        let data = {
                            balance_log_id: id,
                            remark: this.remark
                        }
                        let res = await checkAdd(data)
                        if (res.status) {
                            this.$Message.success('申请提交成功')
                            this.getData()
                            this.$parent.getData()
                        }else{
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
        },
    }
</script>
