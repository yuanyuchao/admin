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
                    <!--<Input v-model="searchForm.customer_name" placeholder="客户名称"></Input>-->
                    <Select v-model="searchForm.customer_name" filterable clearable>
                        <Option v-for="item in customerList" :value="item.customer_name" :key="item.id">{{ item.customer_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary"  @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="success" v-if="$_has('addCustomer')" class="add-bt" @click="addData">新增</Button>
            </div>
        </div>

        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>

        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-form ref="addForm" />
        <add-card ref="addCard" />
        <credit-form ref="creditForm" />
        <balance-form ref="balanceForm" />
    </div>
</template>
<script>
    import { getCustomerList,udpateCustomer,delCustomer,getCustomerNameList} from '@/api/customer'
    import AddCard from '../card/components/AddCard'
    import AddForm from './components/AddCustomer'
    import BalanceForm from './components/Balance'
    import CreditForm from './components/Credit'
    import { ROLE_STATE } from '@/config/custom'

    export default {
        props: {},
        components: {
            AddForm,
            AddCard,
            BalanceForm,
            CreditForm,
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
                        title: '编号',
                        key: 'customer_no',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '名称',
                        key: 'customer_name',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '状态',
                        width: 60,
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
                        title: '联系人',
                        key: 'contacts',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '电话',
                        key: 'mobile',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        width: 100,
                        tooltip: true,
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
                        title: '所属分组',
                        width: 100,
                        render: (h, params) => {
                            let group_name = params.row.group_name
                            let enable = group_name
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            },group_name ? group_name : '未分组')
                        }
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 80,
                        tooltip: true,
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '最后操作时间',
                        key: 'update_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name',
                        width: 100,
                        tooltip: true,
                    },

                    {
                        title: '操作',
                        width: 220,
                        fixed:'right',
                        slot: "action",
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('changeAccountState') && params.row.status == '1' && h('Button', {
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
                                _has('changeAccountState') && params.row.status == '0' && h('Button', {
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
                                _has('udpateCustomer') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }, '修改'),
                                _has('delCustomer') && h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addCard(params.row)
                                        }
                                    }
                                }, '制卡'),
                                _has('delCustomer') && h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
                                        }
                                    }
                                }, '删除')
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
                selectIds: [],
                customerList:[],
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
                let res = await getCustomerNameList()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            async getData () {
                let data  = {}
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
            addData() {
                this.$refs.addForm.showModal()
            },
            dis(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认禁用该客户么？',
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
            async delCustomer(data){
                let res = await delCustomer(data)
                if (res.status){
                    this.$Message.success('删除成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
            },
            edit(data) {
                this.$refs.addForm.showModal(data)
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该角色么？',
                    onOk: async () => {
                        let data = {
                            id,
                        }
                        this.delCustomer(data)
                    }
                })
            },
            recharge(params){
                this.$refs.balanceForm.showModal(params.row,1)
            },
            credit(params){
                this.$refs.creditForm.showModal(params.row)
            },
            refund(params){
                this.$refs.balanceForm.showModal(params.row)
            },
            addCard(data) {
                this.$refs.addCard.showModal(data)
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getCustomerList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'customer'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
