<style scoped lang="less">

</style>

<template>
    <div class="account">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="姓名" data-flex="dir:left">
                    <Input v-model="searchForm.name" placeholder="姓名" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="电话" data-flex="dir:left">
                    <Input v-model="searchForm.mobile" placeholder="电话"></Input>
                </FormItem>
                <FormItem label="职位" data-flex="dir:left">
                    <Input v-model="searchForm.station" placeholder="职位" style="width: 100px"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary"  @click="output">导出表格</Button>
                <Button type="success" v-if="$_has('addAccount')" class="add-bt" @click="showAdd">添加账户</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-form ref="addForm" />
        <reset-pass ref="resetPass" />
        <set-account-role ref="setAccountRole"/>
    </div>
</template>

<script>
    import { getAccountList, setAccountState, delAccount } from '@/api/account'
    import AddForm from './components/AddAccount'
    import ResetPass from './components/ResetPass'
    import SetAccountRole from './components/SetAccountRole'
    import { ACCOUNT_STATE } from '@/config/custom'

    export default {
        props: {},
        components: {
            AddForm,
            ResetPass,
            SetAccountRole
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
                        title: '姓名',
                        key: 'name',
                        width: 125,
                        tooltip: true,
                    },
                    {
                        title: '登录名',
                        key: 'admin_name',
                        width: 130,
                        tooltip: true,
                    },
                    {
                        title: '岗位',
                        key: 'station',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '角色',
                        key: 'role',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '联系电话',
                        key: 'mobile',
                        width: 120,
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
                        title: '创建时间',
                        key: 'create_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '创建人',
                        key: 'create_op',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_op',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 320,
                        fixed:'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('resetAccountPass') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.resetPass(params.row.id)
                                        }
                                    }
                                }, '重置密码'),
                                _has('setAccountRole') && h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.setRole(params.row)
                                        }
                                    }
                                }, '设置角色'),
                                _has('setAccountState') && params.row.status == '1' && h('Button', {
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
                                _has('setAccountState') && params.row.status == '0' && h('Button', {
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
                                _has('editAccount') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }, '编辑'),
                                _has('delAccount') && h('Button', {
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
                    mobile: '',
                    station: ''
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
            async getData() {
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm)
                let res = await getAccountList(params)
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
            showAdd() {
                this.$refs.addForm.showModal();
            },

            edit(params) {
                this.$refs.addForm.showModal(params)
            },
            enable(id) {
                let data = {
                    id,
                    status: ACCOUNT_STATE.enable
                }
                this.changeAccountState(data)
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getAccountList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'account'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            dis(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认禁用该账户么？',
                    onOk: async () => {
                        let data = {
                            id,
                            status: ACCOUNT_STATE.dis
                        }
                        this.changeAccountState(data)
                    }
                })
            },
            async changeAccountState(data) {
                let res = await setAccountState(data)
                if (res.status) {
                    this.$Message.success('成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
            },
            resetPass(id) {
                this.$refs.resetPass.showModal(id)
            },
            del(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该账户么？',
                    onOk: async () => {
                        let res = await delAccount(id)
                        if (res.status) {
                            this.$Message.success('删除成功')
                            this.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            delAll() {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除选中账户么？',
                    onOk: async () => {
                        let res = await delAccount(this.selectIds)
                        if (res.status) {
                            this.$Message.success('删除成功')
                            this.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })

            },
            setRole(data) {
                this.$refs.setAccountRole.showModal(data)
            }
        },
    }
</script>
