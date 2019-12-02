<style scoped lang="less">
    .form{
        margin-top: 30px;
    }
</style>

<template>
    <div class="add-account">
        <Modal @on-ok="ok"  v-model="modal" width="400" title="修改订单" footer-hide :closable="false" :mask-closable="false">
            <Form class="form" ref="form" :model="form" :rules="formRules" :label-width="90">
                <FormItem  label="车牌号" prop="plate_number">
                    <Input v-model="form.plate_number" placeholder="车牌号"></Input>
                </FormItem>
                <FormItem label="供应商名称" prop="supplier_id" >
                    <Select v-model="form.supplier_id" filterable clearable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="料类名称" prop="stone_id">
                    <Select v-model="form.stone_id" filterable clearable>
                        <Option v-for="item in stoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem  label="皮重" prop="tare_weight">
                    <Input v-model="form.tare_weight" placeholder="皮重"></Input>
                </FormItem>
                <FormItem  label="毛重" prop="gross_weight">
                    <Input v-model="form.gross_weight" placeholder="毛重"></Input>
                </FormItem>
                <FormItem  label="扣除" prop="soil">
                    <Input v-model.number="form.soil" placeholder="单价"></Input>
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
    import { recordOrder,getStoneAllList,getSupplierAllList, } from '@/api/purchase'
    import { initData } from '@/libs/custom'
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
                    plate_number: [
                           { required: true, message: '车牌号不能为空', trigger: 'blur' }
                    ],
                    soil: [
                        { name: '取土重量', validator: validateFunc, trigger: 'blur' }
                    ]
                },
                form: {
                    tare_weight:"",
                    gross_weight:"",
                    soil:0,
                    supplier_id:"",
                    stone_id:"",
                    plate_number:""
                },
                customerList:[],
                stoneList: [],
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
            showModal() {
                this.$refs.form.resetFields()
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async ok() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        let res = await recordOrder(this.form)
                        if (res.status) {
                            this.cancel()
                            this.$Message.success('订单补录成功')
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


