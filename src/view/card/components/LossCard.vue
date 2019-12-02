<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="卡挂失" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="120">
                <FormItem label="选择挂失方式" prop="select">
                    <Select v-model="form.select" placeholder="挂失方式">
                        <Option value="hasPass">有密挂失</Option>
                        <Option value="noPass">无密挂失</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="form.select!='noPass'" label="密码" prop="password">
                    <Input v-model="form.password" placeholder="请输入密码"></Input>
                </FormItem>
                <div v-else>
                    <FormItem label="客户名称" prop="customer_id">
                        <Select  v-model="form.customer_id" filterable>
                            <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="持卡人姓名" prop="driver_name">
                        <Input v-model="form.driver_name" placeholder="持卡人姓名"></Input>
                    </FormItem>
                    <FormItem label="持卡人手机号" prop="driver_mobile">
                        <Input v-model="form.driver_mobile" placeholder="持卡人手机号"></Input>
                    </FormItem>
                    <FormItem label="持卡人身份证号" prop="id_number">
                        <Input v-model="form.id_number" placeholder="持卡人身份证号"></Input>
                    </FormItem>
                </div>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">确定挂失</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { lossCardFpwd,lossCard } from '@/api/card'
    import {getCustomerNameListWr} from '@/api/customer'
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    select: [
                        { required: true, message: '请选择挂失方式', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    customer_id: [
                        { required: true,type:'number', message: '客户名称不能为空', trigger: 'blur' }
                    ],
                    driver_name: [
                        { required: true, message: '持卡人姓名不能为空', trigger: 'blur' }
                    ],
                    driver_mobile: [
                        { required: true,pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号为空或者格式不正确', trigger: 'blur' }
                    ],
                    id_number: [
                        { required: true,pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号码为空或者格式不正确', trigger: 'blur' }
                    ],
                },
                form: {
                    select: '',
                    password: '',
                    customer_id: '',
                    driver_name: '',
                    driver_mobile:'',
                    id_number: '',
                },
                id: ''
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
            showModal(id) {
                this.$refs.form.resetFields()
                this.id = id
                this.modal = true;
            },
            hideModal() {
                this.$refs.form.resetFields()
                this.modal = false;
            },
            async getNameList() {
                let res = await getCustomerNameListWr()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        if (this.form.select == 'hasPass') {
                            let data = {id: this.id, password: this.form.password}
                            let res = await lossCardFpwd(data)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('挂失成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
                        }else{
                            let res = await lossCard(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('挂失成功')
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



