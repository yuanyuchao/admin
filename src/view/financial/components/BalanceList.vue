<style scoped lang="less">

</style>

<template>
 <Modal v-model="modal"  width="90%"  title="客户流水" footer-hide >
    <Form ref="form"   class="search-form item-inline-flex">

                <FormItem label="客户名称" >
                    <Input v-model="form.customer_name" readonly></Input>
                </FormItem>
                 <FormItem label="当前余额" >
                    <Input v-model="form.balance" readonly></Input>
                </FormItem>
                <FormItem label="信用额度" >
                    <Input v-model="form.credit" readonly></Input>
                </FormItem>
                <FormItem label="信用额度过期时间" >
                    <Input v-model="form.exp_time" readonly></Input>
                </FormItem>
         <div class="customer" >
            <Table :columns="columns" :data="data" :loading="tableLoading"></Table>
        </div>
        <div data-flex="dir:right" class="page-box">
            <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
        </div>
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
                         title: '流水号',
                         key: 'log_no',
                         width: 200,
                         tooltip: true,
                     },
                     {
                         title: '当前金额',
                         key: 'money',
                         width: 150,
                         tooltip: true,
                     },
                     {
                         title: '交易类型',
                         key:'type',
                         width: 150,
                         tooltip: true,
                         render: (h, params) => {
                             let data = params.row
                             let status = data.type; //0:空闲  1:游戏  2:未上线
                             switch (status)
                             { case 0:
                                 return h('span',{
                                     style: {
                                         color:'green',
                                     }
                                 },'充值');
                                 break;
                                 case 1:
                                     return h('span',{
                                         style: {
                                             color:'blue',
                                         }
                                     },'退款 ') ; break;
                                 case 2:
                                     return h('span',{
                                         style: {
                                             color:'gray',
                                         }
                                     },'订单消费'); break;
                                 case 3:
                                     return h('span',{
                                         style: {
                                             color:'red',
                                         }
                                     },'订单回退'); break;
                             }

                         }
                     },
                     {
                         title: '支付流水号',
                         key: 'trade_no',
                         width: 200,
                         tooltip: true,
                     },
                     {
                         title: '创建时间',
                         key: 'create_time',
                         width: 180,
                         tooltip: true,
                     },
                     {
                         title: '变动前余额',
                         key: 'balance_before',
                         width: 200,
                         tooltip: true,
                     },
                     {
                         title: '变动后余额',
                         key: 'balance_after',
                         width: 200,
                         tooltip: true,
                     },
                     {
                         title: '操作人姓名',
                         key: 'create_operator_name',
                         width: 150,
                         // width: 150,
                         tooltip: true,
                     },
                     {
                         title: '操作备注',
                         key: 'remark',
                         width: 250,
                         tooltip: true,
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
            async getData () {
                let form= { customer_id:this.form.id}
                // let params = Object.assign(this.page,form);
                this.tableLoading = true;
                let params = Object.assign(this.page, form)
                let res = await getBalacneList(params)
                this.tableLoading = false
                if (res.status) {
                    this.data = res.data.data;
                    this.page.total = res.data.total;
                }
            },
            pageChange (index) {
                this.page.page = index
                this.getData();
            },
             showModal(params){
                this.form =  params;
                this.modal = true;
                this.getData();
            },
             hideModal() {
                 this.tableLoading = false;
                this.modal = false;
            },

        },
    }
</script>
