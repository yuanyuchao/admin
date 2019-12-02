<style scoped lang="less">

</style>

<template>
    <div class="role">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="角色名称" data-flex="dir:left">
                    <Input v-model="searchForm.name" placeholder="角色名称" style="width: 100px"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" class="add-bt" @click="add">新增</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-role ref="addRole"/>
        <see-role ref="seeRole" />
    </div>
</template>

<script>
    import { getRoleList, delRole, setRoleState } from '@/api/role'
    import { ROLE_STATE } from '@/config/custom'
    import AddRole from './components/AddRole'
    import SeeRole from './components/seeRole'
    export default {
        props: [],
        components: {
            AddRole,
            SeeRole
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
                        title: '角色名称',
                        key: 'name',
                        width: 100,
                        tooltip: true
                    },
                    {
                        title: '描述',
                        key: 'description',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 180,
                        tooltip: true
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        width: 180,
                        tooltip: true
                    },
                    {
                        title: '创建人',
                        key: 'create_op',
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '最后操作人',
                        key: 'last_op',
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '操作',
                        width: 280,
                        fixed:'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('setRoleState') && params.row.status == '1' && h('Button', {
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
                                _has('setRoleState') && params.row.status == '0' && h('Button', {
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
                                _has('seeRole') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeRole(params.row)
                                        }
                                    }
                                }, '查看权限'),
                                _has('editRole') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row)
                                        }
                                    }
                                }, '编辑权限'),
                                _has('delRole') && h('Button', {
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
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },
                searchForm: {
                    name: '',
                },
                tableLoading: false,
                selectIds: []
            }
        },
        mounted () {
            this.getData()
        },
        computed: {
            disDelSelect() {
                return this.selectIds.length <= 0
            },
            // accessData() {
            //     var arr = JSON.parse(this.$store.state.user.access)
            //     return arr
            // }
        },
        watch: {},
        methods: {
            async getData () {
                this.tableLoading = true
                let params = Object.assign(this.page, this.searchForm)
                let res = await getRoleList(params)
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
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getRoleList(params)
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
            delAll() {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除选中角色么？',
                    onOk: () => {
                        this.delRole(this.selectIds)
                    }
                })
            },
            del(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该角色么？',
                    onOk: () => {
                        this.delRole(id)
                    }
                })
            },
            async delRole(ids) {
                let res = await delRole(ids)
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
                 this.$refs.addRole.showModal(params)
            },
            add() {
                this.$refs.addRole.showModal()
            },
            seeRole(params) {
                this.$refs.seeRole.showModal(params)
            }
        },
    }
</script>
