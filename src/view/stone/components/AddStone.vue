<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改料类' : '添加料类'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <FormItem label="料类名称" prop="name">
                    <Input v-model="form.name" placeholder="料类名称"></Input>
                </FormItem>
                <!--<FormItem v-show="!edit" label="料类编号" prop="stone_no">-->
                    <!--<Input v-model="form.stone_no" placeholder="料类编号"></Input>-->
                <!--</FormItem>-->
                <FormItem label="料价" prop="price">
                    <Input v-model="form.price" placeholder="料价"></Input>
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
    import { addStone,editStone } from '@/api/stone'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    name: [
                        { required: true, message: '料类名不能为空', trigger: 'blur' }
                    ],
                    // stone_no: [
                    //     { required: true, message: '料类编号不能为空', trigger: 'blur' }
                    // ],
                    price: [
                        { required: true, message: '料价不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    name: '',
                    // stone_no: '',
                    price: '',
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
                Object.assign(this.$data, this.$options.data())
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        // console.log(this.form, 'dfdf')
                        if (!this.edit){
                            let res = await addStone(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('提交成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
                        }else {
                            let res = await editStone(this.form)
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


