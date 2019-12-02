<style scoped lang="less">

</style>

<template>
    <div class="role">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="料类">
                    <Select v-model="searchForm.stone_id" filterable clearable>
                        <Option v-for="item in sonteList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" class="add-bt" @click="add">发布</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-role ref="addRole"/>
        <edit-role ref="editPlan"/>
    </div>
</template>

<script>
    import { getPlanList,delSalePlan } from '@/api/salePlan'
    import AddRole from './components/AddSalePlan'
    import EditRole from './components/EditSalePlan'
    import {getStoneNameList} from '@/api/stone'

    export default {
        props: [],
        components: {
            AddRole,
            EditRole
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
                        key: 'stone_name',
                        width: 150
                    },
                    {
                        title: '预售量(吨)',
                        key: 'store',
                    },
                    {
                        title: '销售开始时间',
                        key: 'start_date',
                    },
                    {
                        title: '销售结束时间',
                        key: 'end_date',
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                    },
                    {
                        title: '创建人',
                        key: 'create_op_name',
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        width: 150,
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [ h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row)
                                        }
                                    }
                                }, '编辑'),
                                 h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ])
                        }
                    }
                ],
                data: [],
                sonteList: '',
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },
                searchForm: {
                    stone_id: '',
                },
                tableLoading: false,
                selectIds: []
            }
        },
        created () {
            this.getData()
            this.getNameList()
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
                this.tableLoading = true
                let params = Object.assign(this.page, this.searchForm)
                let res = await getPlanList(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data
                    this.page.total = res.data.total
                }
            },
            async getNameList() {
                let res1 = await getStoneNameList()
                if (res1.status) {
                    this.sonteList = res1.data
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
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getPlanList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'role'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            del(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该计划么？',
                    onOk: () => {
                        this.delRole(id)
                    }
                })
            },
            async delRole(ids) {
                let res = await delSalePlan({id: ids})
                if (res.status) {
                    this.$Message.success('删除成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
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
                let res = await setRoleState(data)
                if (res.status) {
                    this.$Message.success('成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
            },
            show(params){
                this.$refs.editPlan.showModal(params)
            },
            add() {
                this.$refs.addRole.showModal()
            },
        },
    }
</script>
