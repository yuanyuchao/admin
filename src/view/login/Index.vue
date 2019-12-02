<style lang="less">
    @import "./index.less";
</style>

<template>
    <div class="login">
        <div class="login-con" v-show="hasSysInfo"> <!--获取到信息后显示-->
            <Card class="card" icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit" />
                    <p class="native" v-if="!sysInfo.native">
                        <Poptip trigger="hover" title="请延期" placement="bottom" class="pop">
                            <a href="javascript:;" @click="extension()">延期</a>
                        </Poptip>
                        <Poptip v-if="!sysInfo.expired" trigger="hover" title="请激活" placement="bottom" class="pop">
                            <a href="javascript:;" @click="native()">激活</a>
                        </Poptip>
                    </p>
                </div>
            </Card>
        </div>
        <Native ref="native"/>
        <Expired ref="expired"/>
    </div>
</template>

<script>
    import LoginForm from '_c/login-form'
    import { mapActions } from 'vuex'
    import { getSysInfo } from '@/api/login'
    import Native from './components/Native'
    import Expired from './components/Expired'

    export default {
        components: {
            LoginForm,
            Native,
            Expired
        },
        data () {
            return {
                loginInfo: {},
                sysInfo: {
                    native: false,
                    expired: true,
                    pic_url: '',
                },
                hasSysInfo: false,
            }
        },
        created () {
            this.getSysInfo()
        },
        computed: {
            // bg: function () {
            //     return {
            //         // backgroundImage: `url(${this.sysInfo.pic_url})`
            //         backgroundImage: '@/assets/login-bg.jpg'
            //     }
            // }
        },

        methods: {
            ...mapActions(['handleLogin', 'getUserInfo']),
            handleSubmit ({ userName, password }) {
                this.handleLogin({ userName, password }).then(res => {
                    this.getUserInfo().then(res => {
                        this.$router.push({
                            name: this.$config.homeName
                        })
                    })
                }).catch(err => {
                    this.$Message.error(err.info)
                })
            },

            native () {
                this.$refs.native.showModal()
            },
            extension() {
                this.$refs.expired.showModal()
            },
            async getSysInfo () {
                try {
                    let res = await getSysInfo()
                    if (res.status) {
                        this.sysInfo = res.data
                        this.hasSysInfo = true
                    }
                } catch {
                    this.$Message.error('请检查您的网络')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .login {
        .native {
            font-size: 16px;
            text-align: right;
            a {
                &:first-child {
                    margin-right: 20px;
                }
                color: cornflowerblue;
                text-decoration: underline;
            }
        }
        .pop {
            text-align: center;
        }
    }
</style>
