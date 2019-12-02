<style scoped lang="less">

</style>

<template>
    <div class="customer">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="车牌号" data-flex="dir:left">
                    <Input v-model="searchForm.plate_number" placeholder="车牌号" style="width: 150px"></Input>
                </FormItem>
                <FormItem label="客户名称" data-flex="dir:left" >
                      <Col span="12" style="padding-right:10px" >
                            <Select v-model="searchForm.customer_id" filterable style="width:150px" clearable>
                                <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>
                            </Select>
                        </Col>
                </FormItem>
                <FormItem label="状态" data-flex="dir:left">
                    <Select v-model="searchForm.status" style="width: 100px" clearable>
                        <Option v-for="(item,index) in carStatus" :key="index" :value="parseInt(index)">{{item}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box">
                <!--<Button type="error" class="del-bt" :disabled="disDelSelect">删除选中</Button>-->
                <Button type="primary" @click="output">导出表格</Button>
                <Button type="success" v-if="$_has('addTruck')" class="add-bt" @click="showAdd">添加</Button>
            </div>
        </div>
        <Table :columns="columns" ref="table" :data="data" :loading="tableLoading" @on-selection-change="selectChange"></Table>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
        <addForm ref="addForm"/>
    </div>
</template>

<script>
    import { delTruck } from '@/api/car'
    import { getTruckList } from '@/api/car'
    import addForm from './AddCar'
    import { CAR_STATE } from '@/config/custom'
    import {getCustomerNameList} from '@/api/customer'
    export default {
        props: {},
        components: {
            addForm
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
                        title: '客户名称',
                        key: 'customer_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '状态',
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
                        title: '上次皮重',
                        width: 150,
                        tooltip: true,
                        render: (h, params) => {
                            let tare_weight = params.row.tare_weight
                            let enable = tare_weight
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            },tare_weight ? tare_weight : '无')
                        }
                    },
                    {
                        title: '是否开启预置皮重',
                        width: 200,
                        tooltip: true,
                         render: (h, params) => {
                            let data = params.row
                            let enable = data.is_preload == '1'
                            return h('span', {
                                class: {
                                    enable,
                                    disable: !enable
                                }
                            }, enable ? '启用' : '禁用')
                        }
                    },
                    {
                        title: '创建人',
                        key: 'create_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        width: 180,
                        tooltip: true,
                    },
                    {
                        title: '最后操作时间',
                        key: 'update_time',
                        width: 180,
                        tooltip: true,
                    },
                    {
                        title: '最后操作人',
                        key: 'last_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '操作',
                        width: 130,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', {
                                class: [
                                    'act-bt-box'
                                ]
                            }, [
                                _has('updateTruck') &&  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row)
                                        }
                                    }
                                }, '修改'),
                                _has('delTruck') && h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row.id)
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
                carStatus:CAR_STATE,
                searchForm: {
                    customer_id: '',
                    plate_number: '',
                    status: ''
                },
                tableLoading: false,
                selectIds: [],
                customerList:[]
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
                let truckRes = await getTruckList(params)
                this.tableLoading = false
                if (truckRes.status) {
                    this.data = truckRes.data.data
                    this.page.total = truckRes.data.total
                }
                this.getNameList()
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
            async getNameList() {
                let res = await getCustomerNameList()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },
            async output() {
                let params = Object.assign(page_params, this.searchForm)
                let res = await getTruckList(params)
                if (res.status) {
                    let data = res.data.data
                    this.$refs.table.exportCsv({
                        columns: this.columns,
                        data: data,
                        filename: 'car'
                    })
                }else {
                    this.$Message.error(res.info)
                }
            },
            remove(id) {
                this.$Modal.confirm({
                    title: '请确认',
                    content: '确认删除该车辆么？',
                    onOk: async () => {
                        let res = await delTruck({id: id});
                        if (res.status) {
                            this.$Message.success('删除成功');
                            this.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            edit(params) {

                this.$refs.addForm.showModal(params);
            },
            showAdd() {
                this.$refs.addForm.showModal();
            },
        },
    }
</script>
