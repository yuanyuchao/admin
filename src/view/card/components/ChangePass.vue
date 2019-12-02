<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="修改卡密码" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="120">
                <FormItem label="选择修改方式" prop="select">
                    <Select v-model="form.select" placeholder="修改方式">
                        <Option value="hasPass">有密修改</Option>
                        <Option value="noPass">无密修改</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="form.select!='noPass'" label="旧密码" prop="password">
                    <Input type="password" placeholder="请输入旧密码" v-model="form.password"></Input>
                </FormItem>
                <div v-else>
                    <FormItem label="持卡人姓名" prop="driver_name">
                        <Input v-model="form.driver_name" placeholder="持卡人姓名"></Input>
                    </FormItem>
                    <FormItem label="持卡人手机号" prop="driver_mobile">
                        <Input v-model="form.driver_mobile" placeholder="持卡人手机号"></Input>
                    </FormItem>
                </div>
                <FormItem  label="新密码" prop="new_password">
                    <Input type="password" placeholder="请输入新密码" v-model="form.new_password"></Input>
                </FormItem>
                <FormItem  label="确认密码" prop="passwdCheck">
                    <Input type="password" placeholder="请再次输入新密码" v-model="form.passwdCheck"></Input>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">确定修改</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { verfyCard,changeCardPass } from '@/api/card'
    // import {getCustomerNameList} from '@/api/customer'
    export default {
        props: [],
        components: {},
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.form.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.form.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.form.new_password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const validateAge = async (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入旧密码'));
                }
                let res =await verfyCard({id:this.id, password:value})
                if (!res.status){
                    return callback(new Error('旧密码不正确'));
                }
                // 模拟异步验证效果
            };
            return {
                modal: false,
                formRules: {
                    select: [
                        { required: true, message: '请选择修改方式', trigger: 'blur' }
                    ],
                    new_password: [
                        { required: true,validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true,validator: validatePassCheck, trigger: 'blur' }
                    ],
                    password: [
                        {required: true, validator: validateAge, trigger: 'blur' }
                    ],
                    driver_name: [
                        { required: true, message: '持卡人姓名不能为空', trigger: 'blur' }
                    ],
                    driver_mobile: [
                        { required: true,pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号为空或者格式不正确', trigger: 'blur' }
                    ],
                },
                form: {
                    select: 'hasPass',
                    password: '',
                    new_password:'',
                    passwdCheck : '',
                    driver_name: '',
                    driver_mobile:'',
                },
                id: ''
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
                this.id = id
                this.modal = true;
            },
            hideModal() {
                this.$refs.form.resetFields()
                this.modal = false;
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        let data
                        if (this.form.select == 'hasPass') {
                            data = {type: 0, id: this.id, password: this.form.password, new_password: this.form.new_password}
                        }else {
                            data = {type :1, id: this.id, driver_mobile: this.form.driver_mobile, driver_name: this.form.driver_name, new_password: this.form.new_password}
                        }
                            let res = await changeCardPass(data)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('密码修改成功')
                                this.$parent.getData()
                            }else {
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



