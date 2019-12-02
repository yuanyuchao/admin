import {changePsw} from "../../api/user";
<style scoped lang="less">

</style>

<template>
    <div class="card">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称"></Input>
                </FormItem>
                <FormItem label="卡号" data-flex="dir:left">
                    <Input v-model="searchForm.card_no" placeholder="卡号" style="width: 100px"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="success" v-if="$_has('addCard')" class="add-bt" @click="addData">制卡</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <add-form ref="addForm" />
        <loss-card ref="lossCard" />
        <change-pass ref="changePass"/>
    </div>
</template>

<script>
    import { getCardList,cardDel } from '@/api/card'
    import AddForm from './components/AddCard'
    import ChangePass from './components/ChangePass'
    import LossCard from './components/LossCard'
    export default {
        props: {},
        components: {
            AddForm,
            LossCard,
            ChangePass
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
                        title: '客户',
                        key: 'customer_name',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '卡号',
                        key: 'card_no',
                        width: 100,
                        tooltip: true,
                    },
                    {
                        title: '持卡人姓名',
                        key: 'driver_name',
                        width: 110,
                        tooltip: true,
                    },
                    {
                        title: '持卡人手机号',
                        key: 'driver_mobile',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '制卡人身份证',
                        key: 'id_number',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '状态',
                        width: 80,
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
                        title: '制卡时间',
                        key: 'create_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '制卡人',
                        key: 'create_operator_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '修改时间',
                        key: 'update_time',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '最后修改人',
                        key: 'update_operator_name',
                        width: 120,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 295,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('updateCard') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }, '修改卡信息'),
                                _has('updateCard') && h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.editPass(params.row.id)
                                        }
                                    }
                                }, '修改卡密码'),
                                _has('lossCard') && h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.loss(params.row.id)
                                        }
                                    }
                                }, '挂失'),
                                 h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delCard(params.row.id)
                                        }
                                    }
                                }, '退卡')
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
                    card_no: '',
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
                let res = await getCardList(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data
                    this.page.total = res.data.total
                }
            },
            async cardDel(data){
                let res = await cardDel(data)
                if (res.status){
                    this.$Message.success('退卡成功')
                    this.getData()
                } else {
                    this.$Message.error(res.info)
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
            edit(params) {
                this.$refs.addForm.showModal(params,1)
            },
            editPass(id) {
                this.$refs.changePass.showModal(id)
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getCardList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'card'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            loss(id) {
                this.$refs.lossCard.showModal(id)
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },
            delCard(id){
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认退卡么？',
                    onOk: async () => {
                        let data = {
                            id,
                        }
                        this.cardDel(data)
                    }
                })
            }
        },
    }
</script>
