<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改车辆信息' : '添加车辆'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="100">
                <FormItem label="车牌号码" prop="plate_number">
                    <Input v-model="form.plate_number" placeholder="车牌号码"></Input>
                </FormItem>
                <FormItem label="预制皮重状态" prop="is_preload">
                    <RadioGroup v-model="form.is_preload">
                        <Radio v-for="(item, index) in carWeightState" :key="index" :label="parseInt(index)">{{item}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="预制皮重" prop="tare_weight" v-if="form.is_preload!=0">
                     <Input  v-model="form.tare_weight"  />
                </FormItem>
                <FormItem label="客户名称" prop="customer_id">

                            <Select style="width: 150px" v-model="form.customer_id" filterable>
                                <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>
                            </Select>
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
    import {addTruck,updateTruck } from '@/api/car'
    import { CAR_WEIGHT_STATE } from '@/config/custom'
    import {getCustomerNameList} from '@/api/customer'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    plate_number: [
                        { type:'string', pattern: /[京津冀晋蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼川贵云渝藏陕甘青宁新使]{1}[a-zA-Z]{1}[0-9a-zA-Z]{5,6}[挂学警港澳使领]{0,1}$/, required: true, message: '请输入正确车牌号', trigger: 'change' }
                    ],
                    tare_weight: [
                        { required: true, message: '预制皮重不能为空', trigger: 'blur', }
                    ],
                    customer_id: [
                        { required: true,type:'number', message: '客户名称不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    plate_number: '',
                    tare_weight:'',
                    is_preload:0,
                    customer_id:'',
                    id:''
                },
                customerList:[],
                edit:false,
                carWeightState: CAR_WEIGHT_STATE,
            }
        },
        created () {
            this.getNameList()
        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            async getNameList() {
                let res = await getCustomerNameList()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            showModal(params = false) {
                this.$refs.form.resetFields()
                if (params) {
                    initData(this.form, params);
                    this.edit = true
                } else {
                    this.edit = false
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
             this.$refs.form.validate(async valid => {
                if (valid) {
                    if (!this.edit) {
                        let res = await addTruck(this.form)
                        if (res.status) {
                            this.hideModal()
                            this.$Message.success('提交成功')
                            this.$parent.getData()
                        }else {
                            this.$Message.error(res.info)
                        }
                    } else {

                        let res = await updateTruck(this.form)
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
            },
            checkChange(checked) {
                console.log(checked);
            }
        },
    }
</script>

