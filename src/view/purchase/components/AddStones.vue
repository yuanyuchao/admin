<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改料类' : '添加料类'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="90">
                <FormItem label="料类名称" prop="name">
                    <Input v-model="form.name" placeholder="料类名称"></Input>
                </FormItem>
                <FormItem  label="料价" prop="price">
                    <Input v-model="form.price" placeholder="料类单价"></Input>
                </FormItem>
                <FormItem label="运费" prop="freight">
                    <Input v-model="form.freight" placeholder="运费"></Input>
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
    import { addStones,updateStones } from '@/api/purchase'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            const validateFreight = (rule, value, callback) => {
                    if (value <0) {
                        callback(new Error('运费必须大于0'))
                    } else {
                        callback()
                    }
                }
            const validatePrice = (rule, value, callback) => {
                if (value <0) {
                    callback(new Error('单价必须大于0'))
                } else {
                    callback()
                }
            }
            return {
                modal: false,
                formRules: {
                    name: [
                        { required: true, message: '料类名称不能为空', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, validator: validatePrice, trigger: 'blur' }
                    ],
                    freight: [
                        { required: true, validator: validateFreight, trigger: 'blur' }
                    ],
                },
                form: {
                    name: '',
                    freight: '',
                    price:'',
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
                            let res = await addStones(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('提交成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
                        }else {
                            let res = await updateStones(this.form)
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


