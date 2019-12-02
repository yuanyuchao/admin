<style scoped lang="less">

</style>

<template>
    <Modal
            footer-hide
            width="400"
            v-model="modal"
            title="请输入激活码"
            @on-ok="ok"
            @on-cancel="cancel">
        <Form :model="form" :rules="ruleValidate"  ref="form">
            <FormItem prop="native">
                <Input v-model="form.code" placeholder="激活码"></Input>
            </FormItem>
            <div class="submit-bt-box">
                <Button type="primary" @click="ok">提交</Button>
                <Button style="margin-left: 8px" @click="cancel">取消</Button>
            </div>
        </Form>
    </Modal>
</template>

<script>
    import {active} from '@/api/login'

    export default {
        props: {},
        components: {},
        data () {
            return {
                modal: false,
                form: {
                    code: ''
                },
                ruleValidate: {
                    native: { required: true, message: '激活码不能为空', trigger: 'blur' }
                }
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal() {
                this.modal = true
            },
            hideModal() {
                this.modal = false
            },
            ok () {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let res = await active(this.form)
                        if (res.status) {
                            this.$Message.success('激活成功')
                        } else{
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            cancel () {
                this.hideModal()
            }
        },
    }
</script>
