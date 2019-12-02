<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改供应商' : '添加供应商'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="90">
                <FormItem label="供应商名称" prop="name">
                    <Input v-model="form.name" placeholder="供应商名称"></Input>
                </FormItem>
                <FormItem  label="联系人" prop="contacts">
                <Input v-model="form.contacts" placeholder="联系人"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="mobile">
                    <Input v-model="form.mobile" placeholder="联系电话"></Input>
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
    import { addSupplier,updateSupplier } from '@/api/purchase'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    name: [
                        { required: true, message: '供应商名称不能为空', trigger: 'blur' }
                    ],
                    contacts: [
                        { required: true, message: '联系人不能为空', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号为空或者格式不正确', trigger: 'blur' }
                    ],
                },
                form: {
                    name: '',
                    contacts: '',
                    mobile:'',
                    id:'',
                },
                edit: false,
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(params) {
                // console.log(this.form, 'dfdfdf')
                this.$refs.form.resetFields()
                if (params) {
                    initData(this.form, params)
                    this.edit = true
                }else {
                    this.edit = false
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
                // Object.assign(this.$data, this.$options.data())
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        // console.log(this.form, 'dfdf')
                        if (!this.edit){
                            let res = await addSupplier(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('提交成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
                        }else {
                            let res = await updateSupplier(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('修改成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
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


