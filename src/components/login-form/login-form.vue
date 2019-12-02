<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
            <Input size="large" v-model="form.userName" placeholder="请输入用户名">
                <span slot="prepend">
                    <Icon :size="18" type="ios-person"></Icon>
                </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input size="large" type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="18" type="md-lock"></Icon>
                </span>
            </Input>
        </FormItem>
        <!--<div data-flex="main:justify">-->
            <!--<FormItem prop="verify">-->
                <!--<Input type="text" v-model="form.verify" placeholder="请输入验证码" style="width: 140px"/>-->
            <!--</FormItem>-->
            <!--<div @click="changeCode">-->
                <!--<Verify :contentHeight="32" :identifyCode="verify"/>-->
            <!--</div>-->
        <!--</div>-->

        <FormItem>
            <Button size="large" @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
    </Form>
</template>
<script>
    import Verify from '@/components/verify/Index'
    import _ from 'lodash'
    export default {
        name: 'LoginForm',
        components: {
            Verify
        },
        props: {
            userNameRules: {
                type: Array,
                default: () => {
                    return [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ]
                }
            },
            passwordRules: {
                type: Array,
                default: () => {
                    return [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                }
            },
            // verifyRules: {
            //     type: Array,
            //     default: () => {
            //         return [
            //             { required: true, message: '验证码不能为空', trigger: 'blur' }
            //         ]
            //     }
            // }
        },
        data () {
            return {
                form: {
                    userName: '',
                    password: '',
                    verify: '',
                },
                verify: ''
            }
        },
        created() {
            this.makeCode();
        },
        computed: {
            rules () {
                return {
                    userName: this.userNameRules,
                    password: this.passwordRules,
                    verify: this.verifyRules,
                }
            }
        },
        methods: {
            handleSubmit () {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        // if (this.verify != this.form.verify) {
                        //     this.form.verify = ''
                        //     this.$Message.error('验证码不正确')
                        //     this.makeCode()
                        //     return
                        // }
                        this.$emit('on-success-valid', {
                            userName: this.form.userName,
                            password: this.form.password
                        })
                    }
                })
            },
            makeCode(len = 4) {
                let strArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",  1, 2, 3, 4, 5, 6, 7, 8, 9]
                let str = ''
                for (let i = 0; i < len; i++) {
                    str += _.sample(strArr)
                }
                this.verify = str;
            },
            changeCode() {
                this.makeCode()
            }
        }
    }
</script>
