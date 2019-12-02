<style scoped lang="less">

</style>

<template>
    <Modal v-model="modal"  width="90%"  title="近7日畅销料类排行" footer-hide >
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
    import { getBalacneList } from '@/api/balance'
    import { initData } from '@/libs/custom'
    import { ZHI_TYPE } from '@/config/custom'
    export default {
        props: {},
        components: {
        },
        data () {
            return {
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '料类',
                        key: 'stone_name'
                    },
                    {
                        title: '总销量',
                        key: 'total_weight'
                    },
                    {
                        title: '总金额',
                        key: 'total_money'
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
                // this.getData();
            },
            hideModal() {
                this.tableLoading = false;
                this.modal = false;
            },

        },
    }
</script>
