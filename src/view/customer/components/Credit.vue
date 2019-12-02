<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="信用额度" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="100">
                <FormItem label="客户名称">
                    <Input v-model="form.customer_name" readonly></Input>
                </FormItem>
                <FormItem label="信用额度" prop="credit">
                    <Input number v-model="form.credit" placeholder="信用额度" :maxlength="15"></Input>
                </FormItem>
                <FormItem label="到期时间" prop="exp_time">
                    <Col>
                        <DatePicker v-model="form.exp_time" type="date" placeholder="到期时间"
                                    style="width: 168px"></DatePicker>
                    </Col>
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
    import {creditAdd} from '@/api/customer'
    import {initData} from '@/libs/custom'
    import dayjs from 'dayjs'

    export default {
        props: [],
        components: {},
        data() {

            return {
                modal: false,
                formRules: {
                    credit: [
                        {type: 'number', required: true, message: '请输入正确额度', trigger: 'blur'}
                    ]

                },
                form: {
                    customer_id: '',
                    customer_name: '',
                    credit: 0,
                    exp_time: '',
                },

                submitLoading: false,
            }
        },
        created() {

        },
        mounted() {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(params) {
                this.$refs.form.resetFields()
                initData(this.form, params);
                this.form.customer_id = params.id;
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        this.submitLoading = true
                        this.form.exp_time = dayjs(this.form.exp_time).format('YYYY-MM-DD')
                        let res = await creditAdd(this.form)
                        this.submitLoading = false
                        if (res.status) {
                            this.hideModal()
                            this.$Message.success('调整额度成功')
                            this.$parent.getData()
                        } else {
                            this.$Message.error(res.info)
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

