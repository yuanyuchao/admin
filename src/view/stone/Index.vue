<style scoped lang="less">

</style>

<template>
    <div class="stone">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="料类名称" data-flex="dir:left">
                    <Input v-model="searchForm.name" placeholder="料类名称" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="料类编号" data-flex="dir:left">
                    <Input v-model="searchForm.stone_no" placeholder="料类编号"></Input>
                </FormItem>
                <FormItem label="状态" data-flex="dir:left">
                    <!--<Input v-model="searchForm.state" placeholder="0:禁用，1:启用" style="width: 100px"></Input>-->
                    <Select v-model="searchForm.state" style="width: 100px" clearable>
                        <Option v-for="(item,index) in customerCar" :value="parseInt(index)" :key="index">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="success" v-if="$_has('addStone')" class="add-bt" @click="addData">添加</Button>
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
    import {getStoneList, editStone, delStone} from '@/api/stone'
    import AddForm from './components/AddStone'
    import { ROLE_STATE } from '@/config/custom'
    import { CAR_WEIGHT_STATE } from '@/config/custom'

    export default {
        props: {},
        components: {
            AddForm,
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
                        width: 100,
                    },
                    {
                        title: '料类编号',
                        key: 'stone_no',
                        width: 150,
                    },
                    {
                        title: '料类价格(/吨)',
                        key: 'price',
                        width: 110,
                    },
                    {
                        title: '分组',
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
                        title: '状态',
                        width: 80,
                        render: (h, params) => {
                            let data = params.row
                            let enable = data.state == true
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
                        width: 160,
                    },
                    {
                        title: '更新时间',
                        key: 'update_time',
                        width: 160,
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 100,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name',
                        width: 100,
                    },
                    {
                        title: '操作',
                        width: 175,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('editStoneuse') &&  params.row.state == true && h('Button', {
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
                                _has('editStoneuse') &&  params.row.state == false && h('Button', {
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
                                _has('editStone') &&  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.resetStone(params.row)
                                        }
                                    }
                                }, '修改'),
                                _has('delStone') &&  h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delStone(params.row.id)
                                        }
                                    }
                                }, '删除'),
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
                    stone_no: '',
                    state: '',
                },
                tableLoading: false,
                selectIds: [],
                customerCar:CAR_WEIGHT_STATE,
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
                let res = await getStoneList(params)
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
            resetStone(params) {
                this.$refs.addForm.showModal(params)
            },
            dis(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认禁用该料类么？',
                    onOk: async () => {
                        let data = {
                            id,
                            state: ROLE_STATE.dis
                        }
                        this.changeAccountState(data)
                    }
                })
            },
            enable(id) {
                let data = {
                    id,
                    state: ROLE_STATE.enable
                }
                this.changeAccountState(data)
            },
            async changeAccountState(data) {
                let res = await editStone(data)
                if (res.status) {
                    this.$Message.success('成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
                }
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getStoneList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'stone'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },

            async delStone(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该料类么？',
                    onOk: async () => {
                        let res = await delStone(id)
                        if (res.status) {
                            this.$Message.success('删除成功')
                            this.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            }
        },
    }
</script>
