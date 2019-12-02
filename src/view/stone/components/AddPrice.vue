<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改料类价格' : '添加料类价格'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <FormItem v-show="!edit" label="客户名称" prop="customer_id">
                    <Select  v-model="form.customer_id" filterable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem v-show="!edit" label="料类名称" prop="stone_id">
                    <Select  v-model="form.stone_id" filterable>
                        <Option v-for="item in sonteList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="料类价格" prop="price">
                    <Input v-model="form.price" placeholder="料类价格"></Input>
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
    import { addStonePrice,editStonePrice } from '@/api/stonePrice'
    import {getCustomerNameList} from '@/api/customer'
    import {getStoneNameList} from '@/api/stone'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    customer_id: [
                        { required: true,type: 'number',message: '客户名称不能为空', trigger: 'blur' },
                    ],
                    stone_id: [
                        { required: true,type: 'number', message: '料类名称不能为空', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '料类价格不能为空', trigger: 'blur' }
                    ],
                },
                customerList: '',
                sonteList: '',
                form: {
                    customer_id: '',
                    stone_id: '',
                    price:'',
                    id:''
                },
                edit: false,
                formAll:''
            }
        },
        created () {
            this.getNameList()
        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            async getNameList() {
                let res = await getCustomerNameList()
                if (res.status) {
                    this.customerList = res.data
                }
                let res1 = await getStoneNameList()
                if (res1.status) {
                    this.sonteList = res1.data
                }
            },
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
                if (this.form.price>0){
                    this.$refs.form.validate(async valid => {
                        if (valid) {
                            if(!this.edit) {
                                let res = await addStonePrice(this.form)
                                if (res.status) {
                                    this.hideModal()
                                    this.$Message.success('提交成功')
                                    this.$parent.getData()
                                }else {
                                    this.$Message.error(res.info)
                                }
                            }else{
                                if (this.formAll.price == this.form.price){
                                    this.$Message.success('未修改内容')
                                }else {
                                    let res = await editStonePrice(this.form)
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
                } else {
                    this.$Message.error('请输入正确料类价格')
                }
            },
            cancel() {
                this.hideModal()
            }
        },
    }
</script>



