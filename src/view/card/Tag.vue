<style scoped lang="less">

</style>

<template>
    <div class="card">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="电子标签ID" data-flex="dir:left">
                    <Input v-model="searchForm.idcard_no" placeholder="电子标签ID" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>

            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="success" class="add-bt" @click="addCard">制卡</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <AddTag ref="addCard"/>
    </div>
</template>

<script>
    import { getElecCardList } from '@/api/card'
    import AddTag from './components/AddTag'

    export default {
        props: {},
        components: {
            AddTag
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
                        key: 'customer_name'
                    },
                    {
                        title: '电子标签ID',
                        key: 'idcard_no'
                    },
                    {
                        title: '关联车辆',
                        key: 'plate_number'
                    },
                    {
                        title: '车辆状态',
                        width: 150,
                        render: (h, params) => {
                            let data = params.row
                            let status = data.status; //0:空闲  1:游戏  2:未上线
                            switch (status)
                            { case 1:
                                return h('span',{
                                    style: {
                                        color:'green',
                                    }
                                },'入场');
                                break;
                                case 2:
                                    return h('span',{
                                        style: {
                                            color:'blue',
                                        }
                                    },'登记') ; break;
                                case 3:
                                    return h('span',{
                                        style: {
                                            color:'gray',
                                        }
                                    },'离场'); break;
                                default:return h('span',{
                                    style: {
                                        color:'red',
                                    }
                                },'未识别'); break;
                            }
                        }
                    },
                    {
                        title: '制卡时间',
                        key: 'add_card_time',
                    },
                    {
                        title: '制卡人',
                        key: 'add_card_name',
                    }
                ],
                data: [],
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },
                searchForm: {
                    customer_name: '',
                    idcard_no: '',
                    // station: ''
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
                let res = await getElecCardList(params)
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
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getElecCardList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'tag'
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

            addCard() {
                this.$refs.addCard.showModal()
            }
        },
    }
</script>
