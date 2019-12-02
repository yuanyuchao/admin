<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" :title="edit? '修改账户' : '添加账户'" footer-hide :mask-closable="false">
            <Form ref="form" :model="form" :rules="formRules" :label-width="60">
                <FormItem label="姓名" prop="name">
                    <Input v-model="form.name" placeholder="姓名" autocomplete="off"></Input>
                </FormItem>
                <FormItem label="登录名" prop="admin_name" v-if="!edit">
                    <Input v-model="form.admin_name" placeholder="登录名" autocomplete="off"></Input>
                </FormItem>
                <FormItem label="密码" prop="password" v-if="!edit">
                    <Input v-model="form.password" placeholder="密码" type="password" autocomplete="off"></Input>
                </FormItem>
                <!--<FormItem label="密码" v-if="!edit">-->
                    <!--<Input v-model="form.password" placeholder="密码" type="password" autocomplete="off"></Input>-->
                <!--</FormItem>-->
                <FormItem label="岗位" prop="station">
                    <Input v-model="form.station" placeholder="岗位"></Input>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                    <Input v-model="form.mobile" placeholder="手机号"></Input>
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
    import { addAccount, editAccount } from '@/api/account'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    admin_name: [
                        { required: true, message: '登录名不能为空', trigger: 'blur' }
                    ],
                    station: [
                        { required: true, message: '岗位不能为空', trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true,pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号为空或者格式不正确', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    name: '',
                    admin_name: '',
                    password: '',
                    station: '',
                    mobile: '',
                    id: '',
                },
                edit: false,

            }
        },
        created () {

        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(params) {
                this.$refs.form.resetFields()
                if (params) {
                    initData(this.form, params)
                    _.unset(this.formRules, 'password')
                    this.edit = true
                } else {
                    _.assign(this.formRules, {
                        password: [
                            { required: true, message: '密码不能为空', trigger: 'blur' }
                        ],
                    })
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
                            let res = await addAccount(this.form);
                            if (res.status) {
                                this.$Message.success('添加成功');
                                this.hideModal();
                                this.$parent.getData();
                            } else {
                                this.$Message.error(res.info);
                            }
                        } else {
                            let data = _.clone(this.form)
                            if (data.password == '') _.unset(data,'password')
                            let res = await editAccount(data)
                            if (res.status) {
                                this.$Message.success('修改成功');
                                this.hideModal();
                                this.$parent.getData()
                            } else {
                                this.$Message.error('修改失败');
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
