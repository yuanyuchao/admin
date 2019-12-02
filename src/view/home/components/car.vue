<style scoped lang="less">

</style>

<template>
    <Modal v-model="modal"  width="90%"  title="厂内车辆" footer-hide >
        <Form ref="form"   class="search-form item-inline-flex">
            <div class="customer" >
                <Table :columns="columns" maxHeight="600" :data="data" :loading="tableLoading"></Table>
            </div>
            <!--<div data-flex="dir:right" class="page-box">-->
                <!--<Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>-->
            <!--</div>-->
        </Form>
    </Modal>

</template>
<script>
    import {CAR_TYPE} from '@/config/custom'
    export default {
        props: {},
        components: {
        },
        data () {
            return {
                cartype: CAR_TYPE,
                columns:[
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        // width: 80,
                        // tooltip: true,
                    },
                    {
                        title: '订单号',
                        key: 'order_no',
                        // width: 100,
                        // tooltip: true,
                    },
                    {
                        title: '预装重量',
                        key: 'preload'
                    },
                    {
                        title: '皮重',
                        key: 'tare_weight'
                    },
                    {
                        title: '料类',
                        key: 'stone_name'
                    },
                    {
                        title: '累计时间',
                        key: 'tableTimeAll',
                        // width: 100,
                        // tooltip: true,
                    },
                    {
                        title: '入场时间',
                        key: 'in_time',
                        // width: 100,
                        // tooltip: true,
                    },
                    {
                        title: '当前状态',
                        render: (h, params) => {
                            let status = params.row.status
                            return h('span',this.cartype[status])
                        }
                    },
                ],
                data: [],
                page: {
                    page: 1,
                    list_rows: 15,
                    total: 0
                },


                tableLoading:false,
                modal: false,
                form:''
            }
        },
        mounted () {
        },
        computed: {
        },
        methods: {
            pageChange (index) {
                this.page.page = index
                this.getData();
            },
            showModal(params){
                this.data =  params;
                this.modal = true;
            },
            hideModal() {
                this.tableLoading = false;
                this.modal = false;
            },

        },
    }
</script>
