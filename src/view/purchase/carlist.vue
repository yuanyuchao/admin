<style scoped lang="less">

</style>

<template>
    <div class="customer">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="车牌号" data-flex="dir:left">
                    <Input v-model="searchForm.plate_number" placeholder="车牌号"></Input>
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
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" v-if="$_has('addPurchaseTruck')" class="add-bt" @click="addData">新增</Button>
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
    import { getCarsList,getStoneAllList,getSupplierAllList,delCars} from '@/api/purchase'
    import AddForm from './components/AddCars'

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
                        title: '车牌号',
                        key: 'plate_number',
                        width: 155,
                        tooltip: true,
                    },

                    {
                        title: '皮重',
                        key: 'tare_weight',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '供应商名称',
                        key: 'supplier_name',
                        width: 120,
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
                        title: '制卡时间',
                        key: 'add_card_time',
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
                        width: 150,
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
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 200,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('udpatePurchaseTruck') && h('Button', {
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
                                _has('delPurchaseTruck') && h('Button', {
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
                    plate_number: '',
                    supplier_id: '',
                    stone_id: '',
                },
                tableLoading: false,
                selectIds: [],
                customerList:[],
                stoneList: [],
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
                let res = await getCarsList(params)
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
                    content: '确认禁用该车辆么？',
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
                let res = await delCars(data)
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
                    content: '确认删除该车辆么？',
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
                let params = Object.assign(page_params, this.searchForm)
                let res = await getCarsList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'cars'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
