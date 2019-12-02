<style scoped lang="less">
    .form{
        margin-top: 30px;
    }
</style>

<template>
    <div class="add-account">
        <Modal @on-ok="ok"  v-model="modal" width="400" title="作废订单" footer-hide :closable="false">
            <Row>
                <Col span="8">订单编号:</Col>
                <Col span="12">{{form.order_no}}</Col>
            </Row>
            <Row>
                <Col span="8">客户名称:</Col>
                <Col span="12">{{form.customer_name}}</Col>
            </Row>
            <Row>
                <Col span="8">料类:</Col>
                <Col span="12">{{form.stone_name}}</Col>
            </Row>
            <Row>
                <Col span="8">总金额:</Col>
                <Col span="12">{{form.money}}</Col>
            </Row>
            <Form class="form" ref="form1" :model="form1" :rules="formRules" :label-width="80">
                <FormItem  label="作废原因" prop="del_mark">
                    <Input v-model="form1.del_mark" placeholder="作废原因"></Input>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="ok">确定</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { toVoidOrder } from '@/api/order'
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    del_mark: [
                        { required: true, message: '作废原因不能为空', trigger: 'blur' }
                    ],
                },
                form: {},
                form1: {
                    del_mark: '',
                },
                id: '',
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
                this.$refs.form1.resetFields()
                this.form = data
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async ok() {
                let form = {
                    del_mark: this.form1.del_mark,
                    id: this.form.id
                }
                this.$refs.form1.validate(async valid => {
                    if (valid) {
                        let res = await toVoidOrder(form)
                        if (res.status) {
                            this.hideModal()
                            this.$Message.success('订单作废成功')
                            this.$parent.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            cancel() {
                this.hideModal()
            }
        },
    }
</script>


