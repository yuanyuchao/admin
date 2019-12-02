<style scoped lang="less">

</style>

<template>
    <div class="reset-pass">
        <Modal v-model="modal" width="400" title="重置密码" footer-hide>
            <Form ref="form" :model="form" :rules="formRules" :label-width="60">
                <FormItem label="新密码" prop="password">
                    <Input v-model="form.password" placeholder="密码" autocomplete="off" type="password"></Input>
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
    import { resetAccountPass } from '@/api/account'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    password: '',
                    id: '',
                },
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(id) {
                this.$refs.form.resetFields()
                this.modal = true;
                this.form.id = id
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        let res = await resetAccountPass(this.form)
                        if (res.status) {
                            this.$Message.success('修改成功')
                            this.$parent.getData()
                            this.hideModal()
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
