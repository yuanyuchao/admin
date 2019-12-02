<template>
    <div class="user-avator-dropdown">
        <Dropdown @on-click="handleClick">
            <Badge :dot="!!messageUnreadCount">
                <Avatar :src="userAvator"/>
            </Badge>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <!--<DropdownItem name="message">-->
                <!--消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>-->
                <!--</DropdownItem>-->
                <DropdownItem name="changePsw">修改密码</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <change-psw ref="changePsw"/>
    </div>
</template>

<script>
    import './user.less'
    import {mapActions} from 'vuex'
    import ChangePsw from "./components/changePsw";

    export default {
        name: 'User',
        components: {ChangePsw},
        props: {
            userAvator: {
                type: String,
                default: ''
            },
            messageUnreadCount: {
                type: Number,
                default: 0
            }
        },
        methods: {
            ...mapActions([
                'handleLogOut'
            ]),
            logout() {
                this.$emit('logout')
                this.handleLogOut().then(() => {
                    window.location.reload()
                    // this.$router.push({
                    //   name: 'login'
                    // })
                })
            },
            message() {
                this.$router.push({
                    name: 'message_page'
                })
            },
            changePsw() {
                this.$refs.changePsw.showModal()
            },
            handleClick(name) {
                switch (name) {
                    case 'logout':
                        this.logout()
                        break
                    case 'message':
                        this.message()
                        break
                    case 'changePsw':
                        this.changePsw()
                        break
                }
            }
        }
    }
</script>
