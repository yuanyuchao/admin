<style scoped lang="less">

</style>

<template>
    <div class="stone-price">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="料类名称" data-flex="dir:left">
                    <Input v-model="searchForm.name" placeholder="料类名称" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称" style="width: 100px"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" v-if="$_has('editStonePriceAll')" class="add-bt" @click="resetAll">批量改价</Button>
                <Button type="success" v-if="$_has('addStonePrice')" class="add-bt" @click="addData">添加</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-form ref="addForm" />
        <reset-form ref="resetForm" />
    </div>
</template>

<script>
    import { getStonePriceList, delStonePrice } from '@/api/stonePrice'
    import AddForm from './components/AddPrice'
    import ResetForm from './components/ResetPrice'

    export default {
        props: {},
        components: {
            AddForm,
            ResetForm
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
                        width: 130
                    },
                    {
                        title: '料类名称',
                        key: 'stone_name',
                        width: 130
                    },
                    {
                        title: '价格',
                        key: 'price',
                        width: 130
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 130
                    },
                    
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 200
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        width: 200
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name'
                    },
                    {
                        title: '操作',
                        width: 130,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('editStonePrice') &&  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.resetPrice(params.row)
                                        }
                                    }
                                }, '编辑'),
                                _has('delStonePrice') &&  h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deletPrice(params.row.id)
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
                    name: '',
                    customer_name: '',
                },
                tableLoading: false,
                selectIds: []
            }
        },
        created () {
            this.getData()
        },
        mounted () {

        },
        computed: {
            disDelSelect() {
                return this.selectIds.length <= 0
            }
        },
        watch: {},
        methods: {
            async getData () {
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm)
                let res = await getStonePriceList(params)
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
            addData() {
                this.$refs.addForm.showModal()
            },
            resetPrice(params) {
                this.$refs.addForm.showModal(params)
            },
            resetAll(){
                this.$refs.resetForm.showModal()
            },
            async deletPrice(id){
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该料价么？',
                    onOk: async () => {
                        let res= await delStonePrice(id)
                        if(res.status) {
                            this.$Message.success('删除成功')
                            this.getData()
                        }else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getStonePriceList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'stonePrice'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            }
        },
    }
</script>
