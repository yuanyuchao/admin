<style scoped lang="less">
.scan-code {
    .desc {
        color: #999;
        text-align: center;
    }
}
</style>

<template>
    <div class="scan-code">
        <h2 class="desc">请扫码</h2>
        <AddCustomer ref="addCus" />
        <BalanceForm ref="balanceForm" />
    </div>
</template>

<script>
    import ScanCode from '@/hard/code'
    import AddCustomer from '@/view/customer/components/AddCustomer'
    import BalanceForm from '@/view/customer/components/Balance'
    import { getInfoUserNo } from '@/api/customer'
    import _ from 'lodash'
    export default {
        props: [],
        components: {
            AddCustomer,
            BalanceForm,
        },
        data () {
            return {
                code: '',
                codeObj: '', //code实例
            }
        },
        created () {
            this.init()
        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            init() {
                this.codeObj = new ScanCode()
                this.codeObj.on('data', this.scanCode)
            },
            async getCodeData() {
                let res = await getInfoUserNo(this.code)
                if (res.status) {
                    if (!_.isEmpty(res.data)) {  //有数据充值
                        if (!_has('balanceRecharge')) {
                            this.$Message.error('您没有充值权限,请联系管理员')
                            return
                        }
                        this.$refs.balanceForm.showModal(res.data, 're')
                    } else { //无数据添加客户
                        if (!_has('addCustomer')) {
                            this.$Message.error('您没有添加客户权限,请联系管理员')
                            return
                        }
                        this.$refs.addCus.showModal(this.code, true)
                    }
                } else {
                    this.$Message.error(res.info)
                }
            },
            scanCode(data) {
                console.log(data, 'scanCode');
                this.code = data
                this.getCodeData()
            }
        },
        beforeDestroy() {
            this.codeObj.off('data', this.scanCode)
        }
    }
</script>
