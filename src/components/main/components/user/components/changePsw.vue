<style scoped lang="less">

</style>

<template>
    <div class="reset-pass">
        <Modal v-model="modal" width="400" title="修改密码" footer-hide>
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                <FormItem label="旧密码" prop="password">
                    <Input type="password" placeholder="请输入旧密码" v-model="formCustom.password"></Input>
                </FormItem>
                <FormItem label="新密码" prop="new_password">
                    <Input type="password" placeholder="请输入新密码" v-model="formCustom.new_password"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwdCheck">
                    <Input type="password" placeholder="请再次输入新密码" v-model="formCustom.passwdCheck"></Input>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="changePsw">提交</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { resetAccountPass } from '@/api/account'
    import {validataPsw, changePsw} from '@/api/user'
    import { mapActions } from 'vuex'

    export default {
        props: [],
        components: {},
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.formCustom.new_password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const validateAge = async (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入旧密码'));
                }
                let res =await validataPsw({admin_name:this.adminName, password:value})
                if (!res.status){
                    return callback(new Error('旧密码不正确'));
                }
                // 模拟异步验证效果
            };

            return {
                adminName: this.$store.state.user.adminName,
                modal: false,
                formCustom: {
                    password: '',
                    new_password: '',
                    passwdCheck: '',
                },
                ruleCustom: {
                    new_password: [
                        { required: true,validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true,validator: validatePassCheck, trigger: 'blur' }
                    ],
                    password: [
                        {required: true, validator: validateAge, trigger: 'blur' }
                    ]
                }
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions([
                'handleLogOut'
            ]),
            logout () {
                this.handleLogOut().then(() => {
                    window.location.reload()
                    // this.$router.push({
                    //   name: 'login'
                    // })
                })
            },
            showModal() {
                this.$refs.formCustom.resetFields()
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async changePsw() {
                let res = await changePsw(this.formCustom)
                if (res.status) {
                    this.hideModal()
                    this.$Message.success('修改密码成功,请重新登录')
                    this.logout()
                }else {
                    this.$Message.error(res.info)
                }
            },
            // submit() {
            //     this.$refs.form.validate(async valid => {
            //         if (valid) {
            //           this.changePsw()
            //         }
            //     })
            // },
            cancel() {
                this.hideModal()
            }
        },
    }
</script>
