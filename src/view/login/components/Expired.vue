<style scoped lang="less">

</style>

<template>
    <Modal
            footer-hide
            width="400"
            v-model="modal"
            title="请输入延期码"
            @on-ok="ok"
            @on-cancel="cancel">
        <Form :model="form" :rules="ruleValidate"  ref="form">
            <FormItem prop="code">
                <Input v-model="form.code" placeholder="延期码"></Input>
            </FormItem>
            <div class="submit-bt-box">
                <Button type="primary" @click="ok">提交</Button>
                <Button style="margin-left: 8px" @click="cancel">取消</Button>
            </div>
        </Form>
    </Modal>
</template>

<script>
    import {expire} from '@/api/login'
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
                    code: { required: true, message: '延期码不能为空', trigger: 'blur' }
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
                        let res = await expire(this.form)
                        if (res.status) {
                            this.$Message.success('延期成功')
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
