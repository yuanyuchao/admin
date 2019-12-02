<style scoped lang="less">

</style>

<template>
    <div class="customer">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="料类名称" data-flex="dir:left">
                    <!--<Input v-model="searchForm.customer_name" placeholder="客户名称"></Input>-->
                    <Select v-model="searchForm.name" filterable clearable>
                        <Option v-for="item in customerList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="success" v-if="$_has('addPurchaseStones')" class="add-bt" @click="addData">新增</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-form ref="addForm" />
    </div>
</template>
<script>
    import { getPurchaseStoneList,getStoneAllList,delStones,changeStoneState} from '@/api/purchase'
    import AddForm from './components/AddStones'

    export default {
        props: {},
        components: {
            AddForm
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
                        title: '料类名称',
                        key: 'name',
                        width: 180,
                        tooltip: true,
                    },
                    {
                        title: '状态',
                        width: 100,
                        key: 'state_text',
                        render: (h, params) => {
                            let data = params.row
                            let enable = data.state_text == '启用'
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            }, enable ? '启用' : '禁用')
                        }
                    },
                    {
                        title: '单价（/吨）',
                        key: 'price',
                        width: 175,
                        tooltip: true,
                    },
                    {
                        title: '运费（/吨）',
                        key: 'freight',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '最后操作时间',
                        key: 'update_time',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 185,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('changePurchaseStones') && params.row.state == '1' && h('Button', {
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
                                _has('changePurchaseStones') && params.row.state == '0' && h('Button', {
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
                                _has('udpatePurchaseStones') && h('Button', {
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
                                _has('delPurchaseStones') && h('Button', {
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
                    mobile: '',
                    name: '',
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
                let res = await getStoneAllList()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            async getData () {
                let data  = {}
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm, data)
                let res = await getPurchaseStoneList(params)
                this.tableLoading = false
                if (res.status) {
                    console.log(res.data)
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
                    content: '确认禁用该料类么？',
                    onOk: async () => {
                        let data = {
                            id,
                            state: 0
                        }
                        this.changeAccountState(data)
                    }
                })
            },
            enable(id) {
                let data = {
                    id,
                    state: 1
                }
                this.changeAccountState(data)
            },
            async changeAccountState(data) {
                let res = await changeStoneState(data)
                if (res.status) {
                    this.$Message.success('成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
            },
            async delCustomer(data){
                let res = await delStones(data)
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
                    content: '确认删除该供应商么？',
                    onOk: async () => {
                        let data = {
                            id,
                        }
                        // console.log(data)
                        this.delCustomer(data)
                    }
                })
            },
            async output() {
                let res = await getStoneAllList(this.searchForm)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'stones'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
