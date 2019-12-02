<style scoped lang="less">
    .form{
        margin-top: 30px;
    }
</style>

<template>
    <div class="add-account">
        <Modal @on-ok="ok"  v-model="modal" width="400" title="修改订单" footer-hide :closable="false" :mask-closable="false">
            <Form class="form" ref="form1" :model="form1" :rules="formRules" :label-width="90">
                <!--<FormItem  label="车牌号" prop="plate_number">-->
                    <!--<Input v-model="form1.plate_number" placeholder="车牌号"></Input>-->
                <!--</FormItem>-->
                <FormItem label="供应商名称" prop="supplier_id" >
                    <Select v-model="form1.supplier_id" filterable clearable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="料类名称" prop="stone_id">
                    <Select v-model="form1.stone_id" filterable clearable>
                        <Option v-for="item in stoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <!--<FormItem label="订单状态" prop="status">-->
                    <!--<Select v-model="form1.status" filterable clearable>-->
                        <!--<Option v-for="item in stateList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem  label="车牌号" prop="plate_number">
                    <Input v-model="form1.plate_number" placeholder="车牌号"></Input>
                </FormItem>
                <FormItem  label="皮重" prop="tare_weight">
                    <Input v-model="form1.tare_weight" placeholder="皮重"></Input>
                </FormItem>
                <FormItem  label="毛重" prop="gross_weight">
                    <Input v-model="form1.gross_weight" placeholder="毛重"></Input>
                </FormItem>
                <FormItem  label="单价" prop="price">
                    <Input v-model.number="form1.price" placeholder="单价"></Input>
                </FormItem>
                <FormItem  label="总金额" prop="money">
                    <Input v-model.number="form1.money" placeholder="总金额"></Input>
                </FormItem>
                <FormItem  label="运费" prop="freight">
                    <Input v-model.number="form1.freight" placeholder="运费"></Input>
                </FormItem>
                <FormItem  label="总运费" prop="total_freight">
                    <Input v-model.number="form1.total_freight" placeholder="总运费"></Input>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="ok">确定</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { udpateOrder,getStoneAllList,getSupplierAllList, } from '@/api/purchase'
    import { initData } from '@/libs/custom'
    import {purchaseType} from '@/config/custom'
    export default {
        props: [],
        components: {},
        data () {
            const validateFunc = ( rule, value, callback) => {
                if(value) {
                    if (value <0) {
                        callback(new Error(`${rule.name}必须大于0`))
                    } else {
                        callback()
                    }
                }else {
                    callback(new Error(`${rule.name}不能为空`))
                }
            }
            return {
                modal: false,
                formRules: {
                    tare_weight: [
                        { required: true,name: '皮重', validator: validateFunc, trigger: 'blur' }
                    ],
                    gross_weight: [
                        { required: true,name: '毛重', validator: validateFunc, trigger: 'blur' }
                    ],
                    supplier_id: [
                        { required: true,type: 'number',message: '客户名称不能为空', trigger: 'blur' },
                    ],
                    stone_id: [
                        { required: true,type: 'number', message: '料类名称不能为空', trigger: 'blur' }
                    ],
                    status: [
                        { required: true,type: 'number', message: '订单状态不能为空', trigger: 'blur' }
                    ],
                    plate_number: [
                        {required: true, message: '车牌号不能为空', trigger: 'blur'}
                    ],
                    price: [
                        { required: true,name: '单价', validator: validateFunc, trigger: 'blur' }
                    ],
                    freight: [
                        { required: true,name: '运费', validator: validateFunc, trigger: 'blur' }
                    ],
                    money: [
                        { required: true,name: '总金额', validator: validateFunc, trigger: 'blur' }
                    ],
                    total_freight: [
                        { required: true,name: '总运费', validator: validateFunc, trigger: 'blur' }
                    ],
                },
                form1: {
                    supplier_id: '',
                    price:'',
                    money:'',
                    freight:'',
                    total_freight:'',
                    stone_id: '',
                    tare_weight: '',
                    gross_weight: '',
                    status: '',
                    id: '',
                    plate_number: '',
                },
                customerList:[],
                stoneList: [],
                stateList: purchaseType
            }
        },
        created () {

        },
        mounted () {
            this.getNameList()
        },
        methods: {
            async getNameList() {
                let res = await getStoneAllList()
                if (res.status) {
                    this.stoneList = res.data
                }
                let res1 = await getSupplierAllList()
                if (res1.status) {
                    this.customerList = res1.data
                }
            },
            showModal(data) {
                this.$refs.form1.resetFields()
                initData(this.form1, data)
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async ok() {
                this.$refs.form1.validate(async valid => {
                    if (valid) {
                        let res = await udpateOrder(this.form1)
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
            }
        },
    }
</script>


