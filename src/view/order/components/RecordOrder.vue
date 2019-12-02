<style scoped lang="less">
    .form{
        margin-top: 30px;
    }
</style>

<template>
    <div class="add-account">
        <Modal @on-ok="ok"  v-model="modal" width="400" title="补录订单" footer-hide :closable="false" :mask-closable="false">
            <Form class="form" ref="form1" :model="form1" :rules="formRules" :label-width="80">
                <FormItem label="客户名称" prop="customer_id">
                    <Select @on-change="getPrice" v-model="form1.customer_id" filterable>
                        <Option v-for="(item, index) in customerList" :value="item.id" :key="index">{{ item.customer_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="料类" prop="stone_id">
                    <Select @on-change="getPrice" v-model="form1.stone_id" filterable>
                        <Option v-for="(item, index) in sonteList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem  label="料价" prop="price">
                    <Input v-model="form1.price" placeholder="料价"></Input>
                </FormItem>
                <FormItem  label="车牌号" prop="plate_number">
                    <Input @on-change="getWeight" v-model="form1.plate_number" placeholder="车牌号"></Input>
                </FormItem>
                <FormItem  label="皮重" prop="tare_weight">
                    <Input v-model="form1.tare_weight" placeholder="皮重"></Input>
                </FormItem>
                <FormItem  label="毛重" prop="gross_weight">
                    <Input v-model="form1.gross_weight" placeholder="毛重"></Input>
                </FormItem>
                <FormItem  label="净重" prop="real_weight">
                    <Input  v-model="form1.real_weight" placeholder="净重"></Input>
                </FormItem>
                <FormItem  label="入场时间" prop="in_time">
                    <DatePicker v-model="in_time" :value="in_time" placeholder="入场时间" type="datetime" style="width: 100%"></DatePicker>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="ok" :loading="submitLoading">确定</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { orderSupplement,getObtainTare,getObtainStone } from '@/api/order'
    import {getCustomerNameListWr} from '@/api/customer'
    import {getStoneNameList} from '@/api/stone'
    import dayjs from 'dayjs'
    import {RETAIL_CUSTOMER} from "../../../config/custom";
    import {stoneCusPrice} from "@/api/stonePrice";
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    customer_id: [
                        { required: true, message: '客户名称不能为空', trigger: 'blur', type: 'number' }
                    ],
                    stone_id: [
                        { required: true, message: '料类名称不能为空', trigger: 'blur', type: 'number' }
                    ],
                    price: [
                        { required: true, message: '请选择客户和料类获取料价', trigger: 'blur' }
                    ],
                    plate_number: [
                        { required: true, message: '车牌号不能为空', trigger: 'blur' }
                    ],
                    tare_weight: [
                        { required: true, message: '请填写车牌号获取皮重', trigger: 'blur' }
                    ],
                    gross_weight: [
                        { required: true, message: '毛重不能为空', trigger: 'blur' }
                    ],
                    real_weight: [
                        { required: true, message: '请填写毛重获取净重', trigger: 'blur' }
                    ],
                    in_time: [
                        { required: true, message: '入场时间不能为空', trigger: 'blur' }
                    ],
                },
                customerList: [],
                sonteList: [],
                form1: {
                    customer_id: '',
                    stone_id: '',
                    price: '',
                    plate_number: '',
                    tare_weight: '',
                    real_weight:'',
                    gross_weight: '',
                    in_time:'',
                },
                in_time: '',
                id: '',
                submitLoading: false,
            }
        },
        created () {

        },
        mounted () {
            this.getNameList()
        },
        computed: {},
        watch: {
            'in_time':function () {
                this.form1.in_time = dayjs(this.in_time).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        methods: {
            showModal() {
                this.$refs.form1.resetFields()
                this.in_time = new Date()
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async getPrice() {
                if (this.form1.customer_id && this.form1.stone_id) {
                    let res = await stoneCusPrice(this.form1)
                    if (res.status) {
                        this.form1.price = res.data
                    }else {
                        this.$Message.error(res.info)
                    }
                }
            },
            async getNameList() {
                let res = await getCustomerNameListWr()
                if (res.status) {
                    this.customerList = res.data
                }
                let res1 = await getStoneNameList()
                if (res1.status) {
                    this.sonteList = res1.data
                }else {
                    this.$Message.error(res.info)
                }
            },
            async getWeight() {
                if (this.form1.plate_number && this.form1.plate_number.length == 7) {
                    let res = await getObtainTare(this.form1)
                    if (res.status) {
                        this.form1.tare_weight = res.data.tare_weight
                    }else {
                        this.$Message.error(res.info)
                    }
                }
            },
            async ok() {
                this.$refs.form1.validate(async valid => {
                    if (valid) {
                        this.submitLoading = true
                        let res = await orderSupplement(this.form1)
                        this.submitLoading = false
                        if (res.status) {
                            this.cancel()
                            this.$Message.success('补录订单成功')
                            this.$parent.getData()
                        } else {
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


