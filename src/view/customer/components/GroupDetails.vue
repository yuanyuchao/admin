<style scoped lang="less">
    .line{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .left{
        /*font-size: 16px;*/
        /*height: 30px;*/
        /*line-height: 30px;*/
        /*color: #fff;*/
        /*background-color: rgba(0,153,229,.7);*/
    }
    .right{
        /*font-size: 16px;*/
        /*height: 30px;*/
        /*line-height: 30px;*/
        /*color: #fff;*/
        /*background-color: rgba(0,153,229,.8);*/
    }
    .lineBorder{
        border-bottom: 1px solid #fff;
    }
</style>

<template>
    <div class="add-account">
        <Modal class="modal"  v-model="modal" width="600" title="分组详情">
            <Row>
                <Col class="left" span="12">分组名称：</Col>
                <Col class="right" span="12">{{form.group_name}}</Col>
            </Row>
            <Divider size="small"/>
            <Row >
                <Col class="right" span="12">分组说明：</Col>
                <Col class="left" span="12">{{form.explain}}</Col>
            </Row>
            <Divider size="small"/>
            <Row>
                <Col class="left" span="12">组内客户数：</Col>
                <Col class="right"   span="12">{{form.customer_number}}</Col>
            </Row>
            <Divider size="small"/>
            <Table style="margin-top: 20px" :columns="columns" ref="table" :data="customerList"></Table>
        </Modal>
    </div>
</template>

<script>
    import { getCustomerNameList } from '@/api/customer'
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                group_id: '',
                customerList:[],
                form: {},
                columns: [
                    {
                        title: '组内客户列表',
                        key: 'customer_name'
                    },],
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(data) {
                this.form = data
                this.group_id = data.id
                this.getNameList()
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            cancel() {
                this.hideModal()
            },
            async getNameList() {
                let res = await getCustomerNameList({group_id:this.group_id})
                if (res.status) {
                    this.customerList = res.data
                }
            },
        },
    }
</script>





