import {addCustomer} from "../../api/customer";
<style scoped lang="less">

</style>

<template>
    <div class="customer">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="分组名称" data-flex="dir:left">
                    <Input v-model="searchForm.group_name" placeholder="分组名称"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" class="add-bt" v-if="$_has('addCustomerGroup')" @click="addData">添加</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-form ref="addForm" />
        <group-details ref="groupDetails" />
        <add-customer ref="addCustomer" />
    </div>
</template>

<script>
    import { getCustomerGroupList,delCustomerGroup } from '@/api/customerGroup'
    import AddForm from './components/AddCustomerGroup'
    import GroupDetails from './components/GroupDetails'
    import AddCustomer from './components/GroupAddCustomer'

    export default {
        props: {},
        components: {
            AddForm,
            GroupDetails,
            AddCustomer
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
                        title: '分组名称',
                        key: 'group_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '说明',
                        key: 'explain',
                        width: 300,
                        tooltip: true,
                    },
                    {
                        title: '组内客户数',
                        key: 'customer_number',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 180,
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
                        width: 180,
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
                        width: 310,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
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
                                _has('udpateCustomerGroup') &&  h('Button', {
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
                                _has('udpateCustomerGroupinc') &&  h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.add(params.row, 'inc')
                                        }
                                    }
                                }, '添加客户'),
                                _has('udpateCustomerGroupdel') &&  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.add(params.row, 'del')
                                        }
                                    }
                                }, '移除客户'),
                                _has('delCustomerGroup') && h('Button', {
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
                    group_name: '',
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
                let res = await getCustomerGroupList(params)
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
            addData() {
                this.$refs.addForm.showModal()
            },
            edit(data) {
                this.$refs.addForm.showModal(data)
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该分组么？',
                    onOk: async () => {
                        let res = await delCustomerGroup({id: id})
                        if(res.status) {
                            this.$Message.success('删除成功')
                            this.getData()
                        }else{
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            show(data) {
                this.$refs.groupDetails.showModal(data)
            },
            search() {
                this.page.page = 1
                this.selectIds = []
                this.getData()
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getCustomerGroupList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'group'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            add(data, type) {
                this.$refs.addCustomer.showModal(data, type)
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            }
        },
    }
</script>
