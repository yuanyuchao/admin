<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="recharge? '充值' : '退款'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="100">
                 <FormItem  prop="customer_id">
                    <Input v-model="form.customer_id" v-show='false'></Input>
                </FormItem>
                <FormItem label="客户名称" >
                    <Input v-model="form.customer_name" readonly></Input>
                </FormItem>
                <FormItem label="支付方式" prop="pay_type">
                    <RadioGroup v-model="form.pay_type">
                        <Radio v-for="(item, index) in payType" :key="index" :label="parseInt(index)">{{item}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="recharge? '充值金额' : '退款金额'" prop="money" >
                     <Input  v-model="form.money"  placeholder="金额"  :maxlength="15"></Input>
                </FormItem>
                <FormItem label="流水号" prop="trade_no">
                     <Input  v-model="form.trade_no"  placeholder="流水号" :maxlength="25"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                      <Input v-model="form.remark"   type="textarea" :rows="4" placeholder="备注" />
                </FormItem>

                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="submit" :loading="submitLoading">提交</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
     import {balanceRecharge,balanceRefund } from '@/api/balance'
    import { PAY_TYPE } from '@/config/custom'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            var  validateuser = (rule, value, callback) => {
                    if(value==''&&this.form.pay_type>0){
                        return callback(new Error("请输入流水单号"));
                    }else{
                        callback();
                    }
                };
            return {
                modal: false,
                formRules: {
                    money: [
                         { type:'string', pattern:/^\d+(\.\d{1,3})?$/, required: true, message: '请输入正确数字', trigger: 'change' }

                    ],
                    trade_no:[
                        {validator:validateuser, trigger: 'blur' }
                    ],
                    remark: [
                        {  required: true, message: '请填写充值备注', trigger: 'change' }
                    ]

                },
                form: {
                    trade_no: '',
                    customer_id:0,
                    customer_name:'',
                    money:0,
                    pay_type:0,
                    remark:''
                },
                customerList:[],
                recharge:true,
                payType: PAY_TYPE,

                submitLoading: false,
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {

            showModal(params,type) {
                this.$refs.form.resetFields()
                initData(this.form, params);
                this.form.customer_id=params.id;
                if (type=='fund') {
                    this.recharge = false
                }else {
                    this.recharge = true
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
             this.$refs.form.validate(async valid => {
                if (valid) {
                    this.submitLoading = true
                    if (this.recharge) {
                        let res = await balanceRecharge(this.form)
                        if (res.status) {
                            this.hideModal()
                            this.$Message.success('充值成功')
                            this.$parent.getData()
                        }else {
                            this.$Message.error(res.info)
                        }
                    } else {

                        let res = await balanceRefund(this.form)
                        if (res.status) {
                            this.hideModal()
                            this.$Message.success('退款成功')
                            this.$parent.getData()
                        }else {
                            this.$Message.error(res.info)
                        }
                    }
                    this.submitLoading = false
                }

                })
            },
            cancel() {
                this.hideModal()
            },
            checkChange(checked) {
                console.log(checked);
            }
        },
    }
</script>

