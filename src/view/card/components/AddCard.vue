<style scoped lang="less">
    .cardInfo {
        width: 190px;
    }
</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改卡信息' : '制卡'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="120">
                <FormItem label="客户名称" prop="customer_id">
                    <Select v-model="form.customer_id" :disabled="unic" filterable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}
                        </Option>
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
                <FormItem v-if="!edit" label="卡信息" prop="card_no">
                    <Input readonly class="cardInfo" v-model="form.card_no" placeholder="请读卡"></Input>
                    <Button type="info" @click="getdata">读卡</Button>
                </FormItem>
                <FormItem v-if="!edit" label="设置密码" prop="password">
                    <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem v-if="!edit" label="再次输入密码" prop="passwdCheck">
                    <Input type="password" v-model="form.passwdCheck" placeholder="请再次输入密码"></Input>
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
    import { addCard, updateCard } from '@/api/card'
    import {getCustomerNameList, getCustomerNameListWr} from '@/api/customer'
    import { initData } from '@/libs/custom'
    import { CARD_URL } from '@/config/custom'
    import axios from 'axios'

    export default {
        props: [],
        components: {},
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.form.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.form.validateField('passwdCheck')
                    }
                    callback()
                }
            }
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                modal: false,
                formRules: {
                    customer_id: [
                        { required: true, type: 'number', message: '客户名称不能为空', trigger: 'blur' }
                    ],
                    driver_name: [
                        { required: true, message: '持卡人姓名不能为空', trigger: 'blur' }
                    ],
                    driver_mobile: [
                        {
                            required: true,
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                            message: '手机号为空或者格式不正确',
                            trigger: 'blur'
                        }
                    ],
                    id_number: [
                        {
                            required: true,
                            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '身份证号码格式不正确',
                            trigger: 'blur'
                        }
                    ],
                    card_no: [
                        { required: true, message: '请读卡', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ],
                },
                form: {
                    customer_id: '',
                    driver_name: '',
                    driver_mobile: '',
                    id_number: '',
                    card_no: '',
                    password: '',
                    passwdCheck: '',
                    id: ''
                },
                edit: false,
                unic: false,
                customerList: '',
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
            showModal (params, type=0) {
                this.$refs.form.resetFields()
                this.edit = false
                if (type) {
                    initData(this.form, params)
                    this.edit = true
                }
                if (!type && params) {
                    this.unic = true
                    this.form.customer_id = params.id
                }
                this.modal = true
            },
            getdata () {
                let that = this
                axios({
                    method: 'get',
                    url: CARD_URL.D3Card,
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.Status) {
                                that.form.card_no = response.data.Data
                            } else {
                                that.form.card_no = ''
                                that.$Message.error(response.data.Data)
                            }

                        } else {
                            that.$Message.error('服务异常请检查')
                        }
                    }).catch(err => {
                    that.$Message.error('服务异常请检查')
                })
            },
            hideModal () {
                this.modal = false
            },
            async getNameList() {
                let res = await getCustomerNameList()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            submit () {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        if (!this.edit) {
                            let res = await addCard(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('提交成功')
                                this.$parent.getData()
                            } else {
                                this.$Message.error(res.info)
                            }
                        } else {
                            let data = this.form
                            let form = {
                                id: data.id,
                                customer_id: data.customer_id,
                                driver_name: data.driver_name,
                                driver_mobile: data.driver_mobile,
                                id_number: data.id_number
                            }
                            let res = await updateCard(form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('修改成功')
                                this.$parent.getData()
                            } else {
                                this.$Message.error(res.info)
                            }
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



