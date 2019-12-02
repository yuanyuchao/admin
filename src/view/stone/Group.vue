<style scoped lang="less">

</style>

<template>
    <div class="group">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="分组名称" data-flex="dir:left">
                    <Input v-model="searchForm.group_name" placeholder="分组名称" style="width: 100px"></Input>
                </FormItem>
                <!--<FormItem label="客户名称" data-flex="dir:left">-->
                    <!--<Input v-model="searchForm.station" placeholder="客户名称" style="width: 100px"></Input>-->
                <!--</FormItem>-->
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" v-if="$_has('addStoneGroup')" class="add-bt" @click="addData">添加</Button>
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
    import { getStoneGroupist, delStoneGroup } from '@/api/stoneGroup'
    import AddForm from './components/AddGroup'
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
                        width: 120
                    },
                    {
                        title: '说明',
                        key: 'explain',
                        width: 120
                    },
                    {
                        title: '组内料类数',
                        key: 'stone_number',
                        width: 100
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 120
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 150,
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        width: 150,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name',
                        width: 180
                    },
                    {
                        title: '操作',
                        width: 330,
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
                                _has('editStoneGroup') &&  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.resetStone(params.row)
                                        }
                                    }
                                }, '编辑'),
                                _has('batchStoneGroup') &&  h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.add(params.row, 'inc')
                                        }
                                    }
                                }, '添加料类'),
                                _has('delbatchStoneGroup') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.add(params.row, 'del')
                                        }
                                    }
                                }, '移除料类'),
                                _has('delStoneGroup') &&  h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deletGroup(params.row.id)
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
                let res = await getStoneGroupist(params)
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
            show(params) {
                this.$refs.groupDetails.showModal(params)
            },
            addData() {
                this.$refs.addForm.showModal()
            },
            resetStone(params) {
                this.$refs.addForm.showModal(params)
            },
            add(data, type) {
                this.$refs.addCustomer.showModal(data, type)
            },
            async deletGroup(id){
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该分组么？',
                    onOk: async () => {
                        let res= await delStoneGroup(id)
                        if(res.status) {
                            this.$Message.success('删除成功')
                            this.getData()
                        }else {
                            this.$Message.error(res.info)
                        }
                    }
                })

            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getStoneGroupist(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'stoneGroup'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
