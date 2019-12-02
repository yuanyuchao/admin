<style scoped lang="less">

</style>

<template>
    <div class="history-price">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="料类名称" data-flex="dir:left">
                    <Input v-model="searchForm.stone_name" placeholder="料类名称" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left">
                    <Input v-model="searchForm.customer_name" placeholder="客户名称" style="width: 100px"></Input>
                </FormItem>
                <FormItem label="时间" data-flex="dir:left">
                    <DatePicker v-model="time_interval" type="datetimerange" placeholder="时间范围" style="width: 280px" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box">
                <Button type="primary" @click="output">导出表格</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
    </div>
</template>

<script>
    import { stoneLists } from '@/api/stonePrice'
    import {handleTime} from  '@/libs/util'

    export default {
        props: {},
        components: {},
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
                    },
                    {
                        title: '客户名称',
                        key: 'customer_name',
                    },
                    {
                        title: '价格',
                        key: 'price'
                    },
                    {
                        title: '开始时间',
                        key: 'create_time',
                    },
                    {
                        title: '结束时间',
                        key: 'end_time',
                    },
                ],
                data: [],
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },
                searchForm: {
                    stone_name: '',
                    customer_name: '',
                    time_interval: ''
                },
                time_interval: '',
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
        watch: {
            'time_interval': function() {
                this.searchForm.time_interval = handleTime(this.time_interval)
            },
        },
        methods: {
            async getData () {
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm)
                let res = await stoneLists(params)
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
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await stoneLists(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'historyPrice'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
