<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="发布销售计划" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <FormItem label="料类" prop="stone_id">
                    <Select v-model="form.stone_id" filterable clearable>
                        <Option v-for="item in sonteList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="预售量" prop="store">
                    <Input v-model="form.store" placeholder="描述"></Input>
                </FormItem>
                <FormItem  label="预售时间" prop="plan_date">
                    <DatePicker @on-change="changeTime" v-model="form.plan_date" type="daterange" placeholder="预售时间" style="width: 200px" />
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

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    stone_id: [
                        { required: true,type: 'number', message: '料类不能为空', trigger: 'blur' }
                    ],
                    store: [
                        { required: true, message: '库存量不能为空', trigger: 'blur' }
                    ],
                    plan_date: [
                        { required: true, message: '销售时间不能为空', trigger: 'blur' }
                    ]
                },
                sonteList: '',
                form: {
                    stone_id: '',
                    store: '',
                    plan_date: '',
                },
                id:'',
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
            async showModal() {
                this.$refs.form.resetFields()
                this.modal = true;
            },
            async getNameList() {
                let res1 = await getStoneNameList()
                if (res1.status) {
                    this.sonteList = res1.data
                }
            },
            changeTime() {
                this.form.plan_date = handleTime(this.form.plan_date)
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
                if (this.form.store>0){
                    this.$refs.form.validate(async valid => {
                        if (valid) {
                            let res = await addSalePlan(this.form)
                            if (res.status) {
                                this.$Message.success('发布销售计划成功');
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

