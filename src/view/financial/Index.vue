<style scoped lang="less">

</style>

<template>
    <div class="customer">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="编号" data-flex="dir:left">
                    <Input v-model="searchForm.customer_no" placeholder="编号" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" class="add-bt" @click="addData">流水列表</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading"
               @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page"
                  @on-change="pageChange"/>
        </div>
        <add-form ref="addForm"/>
        <credit-form ref="creditForm"/>
        <balance-form ref="balanceForm"/>
        <BalanceListForm ref="balanceListForm"/>
        <AllBalanceListForm ref="allBalance"/>
    </div>
</template>
<script>
    import {getCustomerList, udpateCustomer} from '@/api/customer'
    import AddForm from '../customer/components/AddCustomer'
    import BalanceForm from '../customer/components/Balance'
    import CreditForm from '../customer/components/Credit'
    import BalanceListForm from './components/BalanceList'
    import AllBalanceListForm from './components/AllBalanceList'
    import {ROLE_STATE} from '@/config/custom'

    export default {
        props: {},
        components: {
            AddForm,
            BalanceForm,
            CreditForm,
            BalanceListForm,
            AllBalanceListForm
        },
        data() {
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
                        title: '编号',
                        key: 'customer_no',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '名称',
                        key: 'customer_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '状态',
                        width: 80,
                        tooltip: true,
                        render: (h, params) => {
                            let data = params.row
                            let enable = data.status == '1'
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            }, enable ? '启用' : '禁用')
                        }
                    },
                    {
                        title: '信用额度',
                        key: 'credit',
                        width: 100,
                        tooltip: true,

                    },
                    {
                        title: '账户余额',
                        key: 'balance',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '预存款总额',
                        key: 'pre_deposit',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '消费总额',
                        key: 'consume_total',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '退款总额',
                        key: 'refund_total',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '所属分组',
                        key: 'group_name',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 170,
                        tooltip: true,
                    },
                    {
                        title: '最后操作时间',
                        key: 'update_time',
                        width: 170,
                        tooltip: true,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 320,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('balanceRecharge') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.recharge(params.row, 're')
                                        }
                                    }
                                }, '充值'),
                                _has('balanceRefund') && h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.recharge(params.row, 'fund')
                                        }
                                    }
                                }, '退款'),
                                _has('changedBalance') && params.row.status == '1' && h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.dis(params.row.id)
                                        }
                                    }
                                }, '禁用'),
                                _has('changedBalance') && params.row.status == '0' && h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.enable(params.row.id)
                                        }
                                    }
                                }, '启用'),
                                _has('summaryList') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.getBalanceList(params.row)
                                        }
                                    }
                                }, '查看流水'),
                                _has('balanceDownUp') && h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.credit(params.row)
                                        }
                                    }
                                }, '调整额度')
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
                    customer_no: '',
                    customer_name: '',
                },
                tableLoading: false,
                selectIds: []
            }
        },
        mounted() {
            this.getData()
        },
        computed: {
            disDelSelect() {
                return this.selectIds.length <= 0
            }
        },
        methods: {
            async getData() {
                let data = {}
                if (this.$route.query.id) {
                    data.group_id = this.$route.query.id
                }
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm, data)
                let res = await getCustomerList(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data
                    this.page.total = res.data.total
                }
            },
            pageChange(index) {
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
            addData() {
                this.$refs.allBalance.showModal()
            },
            dis(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认禁用该角色么？',
                    onOk: async () => {
                        let data = {
                            id,
                            status: ROLE_STATE.dis
                        }
                        this.changeAccountState(data)
                    }
                })
            },
            enable(id) {
                let data = {
                    id,
                    status: ROLE_STATE.enable
                }
                this.changeAccountState(data)
            },
            async changeAccountState(data) {
                let res = await udpateCustomer(data)
                if (res.status) {
                    this.$Message.success('成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
            },
            edit(index) {
                let data = this.data[index]
                this.$refs.addForm.showModal(data)
            },
            recharge(params, type) {
                this.$refs.balanceForm.showModal(params, type)
            },
            credit(params) {
                this.$refs.creditForm.showModal(params)
            },
            getBalanceList(params) {
                this.$refs.balanceListForm.showModal(params)
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getCustomerList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'financial'
                    })
                } else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
