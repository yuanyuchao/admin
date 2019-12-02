<style lang="less">
    .edit-order {
        .ivu-picker-confirm {
            .ivu-btn-default {
                display: none;
            }
        }
    }
</style>
<style scoped lang="less">
    .form {
        margin-top: 30px;
    }
</style>

<template>
    <Modal @on-ok="ok" v-model="modal" width="400" title="修改订单" footer-hide :closable="false" class="edit-order" :mask-closable="false">
        <Form class="form" ref="form1" :model="form1" :rules="formRules" :label-width="80">
            <FormItem label="客户名称" prop="customer_id">
                <Select v-model="form1.customer_id" filterable @on-change="cusChange">
                    <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="料类" prop="stone_id">
                <Select v-model="form1.stone_id" filterable @on-change="stoneChange">
                    <Option v-for="item in stoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="车牌号" prop="plate_number">
                <Input v-model="form1.plate_number" placeholder="车牌号"></Input>
            </FormItem>
            <FormItem label="皮重" prop="tare_weight">
                <Input v-model="form1.tare_weight" placeholder="皮重"></Input>
            </FormItem>
            <FormItem label="毛重" prop="gross_weight">
                <Input v-model="form1.gross_weight" placeholder="毛重"></Input>
            </FormItem>
            <FormItem label="单价" prop="price">
                <Input v-model.number="form1.price" placeholder="单价"></Input>
            </FormItem>
            <FormItem label="结算时间" prop="settlement_time" v-if="form1.settlement_time">
                <DatePicker @on-change="settleChange" :value="form1.settlement_time" type="datetime"
                            format="yyyy-MM-dd HH:mm:ss" placeholder="结算时间" style="width: 100%"
                            :clearable="false"></DatePicker>
            </FormItem>
            <FormItem label="备注" prop="remark">
                <Input v-model.trim="form1.remark" type="textarea" :autosize="{minRows: 1,maxRows: 5}"
                       placeholder="备注"></Input>
            </FormItem>
            <FormItem class="tb-ac-box">
                <Button @click="cancel">取消</Button>
                <Button type="primary" @click="ok">确定</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
    import {orderEdit, orderUp} from '@/api/order'
    import {getStoneNameList} from '@/api/stone'
    import {getCustomerNameListWr} from "@/api/customer";
    import _ from 'lodash'
    import {stoneCusPrice} from "@/api/stonePrice";
    import {RETAIL_CUSTOMER} from "@/config/custom";

    export default {
        props: [],
        components: {},
        data() {
            return {
                modal: false,
                formRules: {
                    customer_id: [
                        {required: true, message: '客户名称不能为空', trigger: 'blur', type: 'number'}
                    ],
                    stone_id: [
                        {required: true, message: '料类名称不能为空', trigger: 'blur', type: 'number'}
                    ],
                    plate_number: [
                        {
                            type: 'string',
                            pattern: /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新使]{1}[a-zA-Z]{1}[0-9a-zA-Z]{5,6}[挂学警港澳使领]{0,1}$/,
                            required: true,
                            message: '请输入正确车牌号',
                            trigger: 'change'
                        }
                    ],
                    tare_weight: [
                        {required: true, message: '皮重不能为空', trigger: 'blur'}
                    ],
                    gross_weight: [
                        {required: true, message: '毛重不能为空', trigger: 'blur'}
                    ],
                    settlement_time: [
                        {required: true, message: '结算日期不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '备注不能为空', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '价格不能为空', trigger: 'blur', type: 'number'}
                    ]
                },
                form1: {
                    customer_id: '',
                    stone_id: '',
                    plate_number: '',
                    tare_weight: '',
                    gross_weight: '',
                    settlement_time: '',
                    remark: '',
                    price: '',
                },
                id: '',
                customerList: [],
                stoneList: [],
            }
        },
        created() {
            this.getStoneList()
            this.getCustomerList()
        },
        mounted() {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(data) {
                this.$refs.form1.resetFields()
                data.price = _.round(data.price, 2)
                this.form1 = Object.assign({}, this.form1, _.pick(data, ['stone_id', 'id', 'customer_id', 'plate_number', 'tare_weight', 'gross_weight', 'settlement_time', 'price']))
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async ok() {
                this.$refs.form1.validate(async valid => {
                    if (valid) {
                        let form = {}
                        if (this.form1.settlement_time) { //结算时间为空不传
                            form = Object.assign({}, this.form1)
                        } else {
                            form = _.omit(this.form1, ['settlement_time'])
                        }
                        let res = await orderEdit(form)
                        if (res.status) {
                            this.cancel()
                            this.$Message.success('订单修改成功')
                            this.$parent.getData()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            cancel() {
                // this.$refs.form1.resetFields()
                this.hideModal()
            },

            async getStoneList() {
                let res = await getStoneNameList()
                if (res.status) {
                    this.stoneList = res.data
                }
            },
            async getCustomerList() {
                let res = await getCustomerNameListWr()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            settleChange(val) {
                if (val) {
                    this.form1.settlement_time = val
                }
            },

            async getNewPrice() {
                let res = await stoneCusPrice(_.pick(this.form1, ['stone_id', 'customer_id']))
                if (res.status) {
                    this.form1.price = _.round(res.data, 2)
                } else {
                    this.$Message.error(res.info)
                }
            },

            stoneChange() {
                this.getNewPrice()
            },
            cusChange() {
                this.getNewPrice()
            }
        },
    }
</script>


