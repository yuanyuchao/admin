<style scoped lang="less">

</style>

<template>
    <Modal v-model="modal" width="1000" title="修改记录(记录为修改前内容)" footer-hide>
        <Table :columns="columns" ref="table" :data="list" :loading="tableLoading" height="600"></Table>
    </Modal>
</template>

<script>
    import {orderEditLog} from "@/api/purchase";

    export default {
        props: [],
        components: {},
        data() {
            return {
                modal: false,
                list: [],
                columns: [
                    {
                        title: '修改人',
                        key: 'create_admin_name',
                        width: 100,
                    },
                    {
                        title: '供应商',
                        key: 'supplier_name',
                    },
                    {
                        title: '料类',
                        key: 'stone_name',
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        width: 100,
                    },
                    {
                        title: '皮重',
                        key: 'tare_weight',
                    },
                    {
                        title: '毛重',
                        key: 'gross_weight',
                    },
                    {
                        title: '单价',
                        key: 'price',
                    },
                    {
                        title: '总金额',
                        key: 'money',
                    },
                    {
                        title: '运费',
                        key: 'freight',
                    },
                    {
                        title: '总运费',
                        key: 'total_freight',
                    },
                    {
                        title: '修改时间',
                        key: 'update_order_time',
                        width: 150,
                    }
                ],

                tableLoading: false,
            };
        },
        created() {

        },
        mounted() {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(id) {
                this.list = []
                this.modal = true
                this.getList(id)
            },
            hideModal() {
                this.modal = false
            },
            async getList(id) {
                let res = await orderEditLog(id)
                if (res.status) {
                    this.list = res.data
                }
            }
        },
    };
</script>
