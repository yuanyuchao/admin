<style scoped lang="less">

</style>

<template>
    <div class="history-price">
        <div data-flex="main:justify">
            <Form ref="searchForm" :modal="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="时间" data-flex="dir:left">
                    <DatePicker v-model="create_time" type="daterange" placeholder="时间范围" style="width: 200px" />
                </FormItem>
                <FormItem label="日志类型" data-flex="dir:left">
                    <Select  v-model="searchForm.type" filterable>
                        <Option v-for="item in logType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="模块" data-flex="dir:left">
                    <Input v-model="searchForm.module"  placeholder="请输入模块名称" style="width: 200px" />
                </FormItem>
                <FormItem label="操作人" data-flex="dir:left">
                    <Input v-model="searchForm.operator_name"  placeholder="请输入操作人名字" style="width: 200px" />
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
    import { getLogList } from '@/api/Log'
    import {handleTime} from  '@/libs/util'
    import {logType} from '@/config/custom'

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
                        title: '日志类型',
                        key: 'type_txt',
                    },
                    {
                        title: '模块',
                        key: 'module',
                    },
                    {
                        title: '操作',
                        key: 'action_txt'
                    },
                    {
                        title: '操作人',
                        key: 'operator_name',
                    },
                    {
                        title: '操作时间',
                        key: 'create_time',
                    },
                    {
                        title: '操作说明',
                        key: 'content',
                    },
                ],
                data: [],
                logType: logType,
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },
                searchForm: {
                    create_time: '',
                    status: -1,
                    type:'',
                    module: '',
                    operator_name: '',
                },
                create_time: '',
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
            'create_time': function() {
                this.searchForm.create_time = handleTime(this.create_time)
            },
        },
        methods: {
            async getData () {
                this.tableLoading = true;
                let params = Object.assign(this.page, this.searchForm)
                let res = await getLogList(params)
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
                let res = await getLogList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'table'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
        },
    }
</script>
