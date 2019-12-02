<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal  v-model="modal" width="400" title="修改金额"  footer-hide>
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <FormItem label="金额" prop="money">
                    <Input v-model="form.money" placeholder="金额"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="form.remark" placeholder="备注"></Input>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">提交</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import { update_log} from '@/api/balance'
    import _ from 'lodash'
    export default {
        props: {},
        components: {
        },
        data () {
            return {
                formRules: {
                    money: [
                        { required: true, message: '金额不能为空', trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '备注不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    id: '',
                    money: '',
                    remark: '',
                },
                modal: false
            }
        },
        mounted () {
            // this.getData ()
        },
        methods: {
            showModal(params){
                this.$refs.form.resetFields()
                this.form.id = params.id
                this.form.money = params.money
                this.modal = true;
                // this.getData();
            },
            hideModal() {
                // this.tableLoading = false;
                this.modal = false;
            },
            async submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        let res = await update_log(this.form)
                        if (res.status) {
                            this.hideModal();
                            this.$Message.success('修改成功')
                            this.$parent.$parent.initLog()
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
