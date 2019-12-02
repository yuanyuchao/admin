<style scoped lang="less">
p{
    font-size: 18px;
}
</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="人工结算" footer-hide :closable="false">
            <!--<Form class="form" ref="form1" :model="form1" :rules="formRules" :label-width="80">-->
                <!--<FormItem  label="毛重" prop="gross_weight">-->
                    <!--<Input v-model="form1.gross_weight" placeholder="毛重"></Input>-->
                <!--</FormItem>-->
                <!--<FormItem  label="备注" prop="del_mark">-->
                    <!--<Input v-model="form1.del_mark" placeholder="备注"></Input>-->
                <!--</FormItem>-->
                <p>毛重：{{form.gross_weight}}</p>
                <p>皮重：{{form.tare_weight}}</p>
                <p>车牌号：{{form.plate_number}}</p>
                <!--<FormItem class="tb-ac-box">-->
                    <Button style="margin-left: 220px" @click="cancel">取消</Button>
                    <Button style="margin-left: 10px" type="primary" @click="ok">确定</Button>
                <!--</FormItem>-->
            <!--</Form>-->
        </Modal>
    </div>
</template>

<script>
    import { orderSettlement } from '@/api/order'
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    gross_weight: [
                        { required: true, message: '毛重不能为空', trigger: 'blur' }
                    ],
                    del_mark: [
                        { required: true, message: '备注不能为空', trigger: 'blur' }
                    ],
                },
                form: {},
                form1: {
                    del_mark: '',
                    gross_weight:'',
                },
                id: '',
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(data) {
                // this.$refs.form1.resetFields()
                this.form = data
                if (data.gross_weight) {
                    this.form1.gross_weight = data.gross_weight
                }
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            async ok() {
                if(this.form1.gross_weight>0){
                    let form = {
                        del_mark: this.form1.del_mark,
                        gross_weight: this.form1.gross_weight,
                        id: this.form.id,
                        tare_weight:this.form.tare_weight,
                        plate_number:this.form.plate_number
                    }
                    // this.$refs.form1.validate(async valid => {
                    //     if (valid) {
                            let res = await orderSettlement(form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('人工结算成功')
                                this.$parent.getData()
                            } else {
                                this.$Message.error(res.info)
                            }
                    //     }
                    // })
                }else {
                    this.$Message.error('请修改正确毛重')
                }
            },
            cancel() {
                this.hideModal()
            }
        },
    }
</script>


