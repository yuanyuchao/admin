<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="修改销售计划" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <FormItem label="预售量" prop="store">
                    <Input v-model="form.store" placeholder="描述"></Input>
                </FormItem>
                <FormItem  label="开始时间" prop="start_date">
                    <DatePicker @on-change="changeTime1" v-model="form.start_date" type="date" placeholder="开始时间" style="width: 200px" />
                </FormItem>
                <FormItem  label="结束时间" prop="end_date">
                    <DatePicker @on-change="changeTime" v-model="form.end_date" type="date" placeholder="结束时间" style="width: 200px" />
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
    import { addSalePlan,editSalePlan } from '@/api/salePlan'
    import {getStoneNameList} from '@/api/stone'
    import {handleTime} from  '@/libs/util'
    import { initData } from '@/libs/custom'
    import dayjs from 'dayjs'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    store: [
                        { required: true, message: '库存量不能为空', trigger: 'blur' }
                    ],
                    start_date: [
                        { required: true,type:'string', message: '开始时间不能为空', trigger: 'blur' }
                    ],
                    end_date: [
                        { required: true,type:'string', message: '结束时间不能为空', trigger: 'blur' }
                    ]
                },
                sonteList: '',
                form: {
                    id:'',
                    store: '',
                    start_date:'',
                    end_date: '',
                },
            }
        },
        created () {
        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            async showModal(params) {
                this.$refs.form.resetFields()
                initData(this.form, params)
                this.form.store = String(this.form.store)
                this.modal = true;
            },
            async getNameList() {
                let res1 = await getStoneNameList()
                if (res1.status) {
                    this.sonteList = res1.data
                }
            },
            changeTime() {
                this.form.end_date = dayjs(this.form.end_date).format('YYYY-MM-DD')
            },
            changeTime1() {
                this.form.start_date = dayjs(this.form.start_date).format('YYYY-MM-DD')
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
                this.changeTime()
                this.changeTime1()
                if (this.form.store>0){
                    this.$refs.form.validate(async valid => {
                        if (valid) {
                            let form = {id: this.id, }
                            let res = await editSalePlan(this.form)
                            if (res.status) {
                                this.$Message.success('修改成功');
                                this.hideModal();
                                this.$parent.getData();
                            } else {
                                this.$Message.error(res.info);
                            }
                        }
                    })
                }else {
                    this.$Message.error('请输入正确预售量');
                }
            },
            cancel() {
                this.hideModal()
            },
        },
    }
</script>

