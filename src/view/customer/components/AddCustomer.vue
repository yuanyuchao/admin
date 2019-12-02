<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改客户' : '添加客户'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="90">
                <FormItem label="客户名称" prop="customer_name">
                    <Input v-model="form.customer_name" placeholder="客户名称"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contacts">
                    <Input v-model="form.contacts" placeholder="联系人"></Input>
                </FormItem>
                <FormItem label="联系电话" prop="mobile">
                    <Input v-model="form.mobile" placeholder="联系电话"></Input>
                </FormItem>
                <FormItem label="备注" prop="remarks">
                    <Input v-model="form.remarks" placeholder="备注"></Input>
                </FormItem>
                <FormItem label="客户分组" prop="group_id">
                    <Select v-model="form.group_id"  filterable>
                        <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.group_name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem v-if="!edit" label="客户余额">
                    <Input v-model="form.balance" placeholder="客户余额"></Input>
                </FormItem>
                <FormItem v-if="!edit" label="信用额度" prop="credit">
                    <Input v-model="form.credit" placeholder="信用额度"></Input>
                </FormItem>
                <FormItem v-if="!edit" label="过期时间" prop="exp_time">
                    <DatePicker :options="options3" v-model="form.exp_time" type="date" placeholder="信用额度过期时间" style="width: 200px" />
                </FormItem>
                <FormItem label="关联易购账户" prop="user_id">
                    <Input v-model="form.user_no" placeholder='易购编号'></Input>
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
    import { addCustomer,udpateCustomer,getYigouList,getCustomerAllGroupList } from '@/api/customer'
    import { initData,options } from '@/libs/custom'
    import dayjs from 'dayjs'

    export default {
        props: [],
        components: {},
        data () {
            return {
                options3: options,
                modal: false,
                formRules: {
                    customer_name: [
                        { required: true, message: '客户名称不能为空', trigger: 'blur' }
                    ],
                    type: [
                        { required: true,type: 'number', message: '客户类型不能为空', trigger: 'blur' }
                    ],
                    mobile: [
                        {
                            required: true,
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                            message: '手机号为空或者格式不正确',
                            trigger: 'blur'
                        }
                    ],
                    contacts: [
                        { required: true, message: '联系人不能为空', trigger: 'blur' }
                    ],
                    // credit: [
                    //     { required: true, message: '信用额度不能为空', trigger: 'blur' }
                    // ],
                    // exp_time: [
                    //     { required: true, type: 'date', message: '信用额度过期时间不能为空', trigger: 'blur' }
                    // ],
                },
                form: {
                    // customer_no: '',
                    customer_name: '',
                    group_id: '',
                    type: '',
                    balance: '',
                    credit: '',
                    exp_time: '',
                    id:'',
                    user_id: '',
                    mobile:'',
                    contacts:'',
                    remarks:'',
                    user_no: '',
                },
                groupList:'',
                nameList: '',
                edit: false,
                list: [
                    {name: '大客户',id:1},
                    {name: '散户',id:2},
                ],
            }
        },
        created () {
            this.getGroupList()
        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(params, fast = false) { //fast快速添加
                this.$refs.form.resetFields()
                if (fast) {
                    this.form.user_no = params
                } else {
                    if (params) {
                        initData(this.form, params)
                        this.edit = true
                    }else {
                        this.edit = false
                    }
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async getGroupList() {
                let res = await getCustomerAllGroupList()
                if (res.status) {
                    // console.log(res, 'fasdfs')
                    this.groupList = res.data
                } else {
                    this.$Message.error(res.info)
                }
            },
            async getYigouNameList(data) {
                let res = await getYigouList(data)
                // console.log(res)
                if (res.status) {
                    this.form.user_id = res.data.id
                    // console.log(this.form,'id')
                    this.$refs.form.validate(async valid => {
                        if (valid) {
                            if (!this.edit) {
                                if (this.form.exp_time!=''){
                                    this.form.exp_time = dayjs(this.form.exp_time).format('YYYY-MM-DD')
                                    console.log(this.form)
                                }
                                if (!(/^1[34578]\d{9}$/.test(this.form.mobile))){
                                    this.$Message.error('手机号码格式不符')
                                } else {
                                    let res = await addCustomer(this.form)
                                    if (res.status) {
                                        this.hideModal()
                                        this.$Message.success('提交成功')
                                        this.$parent.getData()
                                    }else {
                                        this.$Message.error(res.info)
                                    }
                                }
                            }else {
                                let res = await udpateCustomer(this.form)
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
                }else {
                    this.$Message.error(res.info)
                }
            },
            submit() {
                if (this.form.user_no!=''){
                    // console.log('111')
                    this.getYigouNameList({user_no:this.form.user_no})
                }else {
                    // console.log('222')
                    this.form.user_id = ''
                    this.$refs.form.validate(async valid => {
                        if (valid) {
                            if (!this.edit) {
                                if (this.form.exp_time!=''){
                                    this.form.exp_time = dayjs(this.form.exp_time).format('YYYY-MM-DD')
                                    console.log(this.form)
                                }
                                if (!(/^1[34578]\d{9}$/.test(this.form.mobile))){
                                    this.$Message.error('手机号码格式不符')
                                } else {
                                    let res = await addCustomer(this.form)
                                    if (res.status) {
                                        this.hideModal()
                                        this.$Message.success('提交成功')
                                        this.$parent.getData()
                                    }else {
                                        this.$Message.error(res.info)
                                    }
                                }
                            }else {
                                let res = await udpateCustomer(this.form)
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
                }

            },
            cancel() {
                this.hideModal()
            }
        },
    }
</script>


