<style scoped lang="less">
    .cardInfo {
        width: 190px;
    }
</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改车辆' : '添加车辆'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="120">
                <FormItem label="车牌号" prop="plate_number">
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
                <FormItem label="皮重" prop="tare_weight">
                    <Input v-model="form.tare_weight" placeholder="皮重"></Input>
                </FormItem>
                <FormItem label="卡信息" prop="idcard_no">
                    <Input readonly class="cardInfo" v-model="form.idcard_no" placeholder="请读卡"></Input>
                    <Button type="info" @click="getdata">读卡</Button>
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">取消</Button>
                    <Button type="primary" @click="submit">提交</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import { addCars,updateCars,getStoneAllList,getSupplierAllList, } from '@/api/purchase'
    import { initData } from '@/libs/custom'
    import { CARD_URL } from '@/config/custom'
    import axios from 'axios'

    export default {
        props: [],
        components: {},
        data () {
            const validateFreight = (rule, value, callback) => {
                if (value <0) {
                    callback(new Error('运费必须大于0'))
                } else {
                    callback()
                }
            }
            const validatePrice = (rule, value, callback) => {
                if (value <0) {
                    callback(new Error('单价必须大于0'))
                } else {
                    callback()
                }
            }
            return {
                modal: false,
                formRules: {
                    plate_number: [
                        { type:'string', pattern: /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新使]{1}[a-zA-Z]{1}[0-9a-zA-Z]{5,6}[挂学警港澳使领]{0,1}$/, required: true, message: '请输入正确车牌号', trigger: 'change' }
                    ],
                    supplier_id: [
                        { required: true,type: 'number',message: '客户名称不能为空', trigger: 'blur' },
                    ],
                    stone_id: [
                        { required: true,type: 'number', message: '料类名称不能为空', trigger: 'blur' }
                    ],
                    tare_weight: [
                        { required: true,type: 'string', message: '皮重不能为空', trigger: 'blur' }
                    ],
                    idcard_no: [
                        { required: true,type: 'string', message: '卡号不能为空', trigger: 'change' }
                    ],
                },
                form: {
                    plate_number: '',
                    supplier_id: '',
                    stone_id: '',
                    tare_weight: '',
                    idcard_no: '',
                    id:'',
                },
                edit: false,
                customerList:[],
                stoneList: [],
            }
        },
        created () {

        },
        mounted () {
            this.getNameList()
        },
        computed: {},
        watch: {},
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
            showModal(params) {
                // console.log(this.form, 'dfdfdf')
                this.$refs.form.resetFields()
                if (params) {
                    initData(this.form, params)
                    this.edit = true
                }else {
                    this.edit = false
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
                // Object.assign(this.$data, this.$options.data())
            },
            getdata () {
                let that = this
                axios({
                    method: 'get',
                    url: CARD_URL.JtCard,
                })
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.Status) {
                                that.form.idcard_no = response.data.Data
                            } else {
                                that.form.idcard_no = ''
                                that.$Message.error(response.data.Data)
                            }

                        } else {
                            that.$Message.error('服务异常请检查')
                        }
                    }).catch(err => {
                    that.$Message.error('服务异常请检查')
                })
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        // console.log(this.form, 'dfdf')
                        if (!this.edit){
                            let res = await addCars(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('提交成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
                        }else {
                            let res = await updateCars(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('修改成功')
                                this.$parent.getData()
                            }else {
                                this.$Message.error(res.info)
                            }
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


