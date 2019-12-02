<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改分组' : '添加分组'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <FormItem label="分组名称" prop="group_name">
                    <Input v-model="form.group_name" placeholder="分组名称"></Input>
                </FormItem>
                <FormItem label="分组说明" prop="explain">
                    <Input v-model="form.explain" placeholder="分组说明"></Input>
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
    import { addCustomerGroup,udpateCustomerGroup } from '@/api/customerGroup'
    import { initData } from '@/libs/custom'
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    group_name: [
                        { required: true, message: '分组名称不能为空', trigger: 'blur' }
                    ],
                    explain: [
                        { required: true, message: '说明不能为空', trigger: 'blur' }
                    ]
                },
                form: {
                    group_name: '',
                    explain: '',
                    id: '',
                    type:'',
                },
                edit: false,
                formAll:''
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
                this.$refs.form.resetFields()
                if (params) {
                    initData(this.form, params)
                    this.formAll = params
                    this.edit = true
                }else {
                    this.edit = false
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        if (!this.edit) {
                            let res = await addCustomerGroup(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('提交成功')
                                this.$parent.getData()
                            } else {
                                this.$Message.error(res.info)
                            }
                        } else {
                            if (this.formAll.explain==this.form.explain && this.formAll.group_name==this.form.group_name){
                                this.$Message.success('未修改数据')
                            }else {
                                let res = await udpateCustomerGroup(this.form)
                                if (res.status) {
                                    this.hideModal()
                                    this.$Message.success('修改成功')
                                    this.$parent.getData()
                                }else {
                                    this.$Message.error(res.info)
                                }
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



