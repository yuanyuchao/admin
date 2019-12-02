<style scoped lang="less">

</style>

<template>
    <div class="account">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex">
                <FormItem label="昵称" data-flex="dir:left">
                    <Input v-model="searchForm.name" placeholder="昵称" style="width: 100px"></Input>
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
                <Button type="error" class="del-bt" :disabled="disDelSelect" @click="delAll">删除选中</Button>
                <Button type="success" class="add-bt" @click="showAdd">添加</Button>
            </div>
        </div>
        <Table :columns="columns" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
    </div>
</template>

<script>
    import { getAccountList, setAccountState, delAccount } from '@/api/account'
    import { ACCOUNT_STATE } from '@/config/custom'

    export default {
        props: {},
        data () {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '账户',
                        key: 'admin_name'
                    },
                    {
                        title: '昵称',
                        key: 'name'
                    },
                    {
                        title: '岗位',
                        key: 'station'
                    },
                    {
                        title: '角色',
                        key: 'role',
                    },
                    {
                        title: '电话',
                        key: 'mobile',
                    },
                    {
                        title: '状态',
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
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        width: 150,
                    },
                    {
                        title: '创建人',
                        key: 'create_op',
                    },
                    {
                        title: '最后操作人',
                        key: 'last_op',
                    },
                    {
                        title: '操作',
                        width: 350,
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                h('Button', {
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
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.setRole(params.row.id)
                                        }
                                    }
                                }, '设置角色'),
                                params.row.status == '1' && h('Button', {
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
                                params.row.status == '0' && h('Button', {
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
                                h('Button', {
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
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(params.index)
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
            setRole(id) {
                this.$refs.setAccountRole.showModal(id)
            }
        },
    }
</script>
