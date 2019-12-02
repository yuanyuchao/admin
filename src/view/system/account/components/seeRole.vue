<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="400" title="查看权限" footer-hide>
            <Form ref="form" :model="form" :rules="formRules" :label-width="60">
                <FormItem label="角色名" prop="name">
                    <Input v-model="form.name" placeholder="角色名"></Input>
                </FormItem>
                <FormItem label="描述" prop="description">
                    <Input v-model="form.description" placeholder="描述"></Input>
                </FormItem>
                <FormItem label="权限">
                    <Tree :data="access" ref="tree" show-checkbox style="margin-top: -8px" />
                </FormItem>
                <FormItem class="tb-ac-box">
                    <Button @click="cancel">关闭</Button>
                    <!--<Button type="primary" @click="submit">提交</Button>-->
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import {addRole, editRole} from '@/api/role'
    import ACCESS from '@/config/access'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                formRules: {
                    name: [
                        { required: true, message: '角色名不能为空', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '描述不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    name: '',
                    description: '',
                    status:'',
                    id:'',
                    menu: '',
                    action: '111'
                },
                access: ACCESS.menu,
                edit:false,
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
                if (params) {
                    initData(this.form, params)
                    if (params.menu) {
                        this.access = JSON.parse(params.menu)
                    }
                    this.modal = true;
                }
            },

            hideModal() {
                this.modal = false;
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        if (!this.edit) {
                            this.form.menu = JSON.stringify(this.access)
                            let res = await addRole(this.form)
                            if (res.status) {
                                this.$Message.success('添加成功');
                                this.hideModal();
                                this.$parent.getData();
                            } else {
                                this.$Message.error(res.info);
                            }
                        }else {
                            this.form.menu = JSON.stringify(this.access)
                            let res = await editRole(this.form)
                            if (res.status) {
                                this.$Message.success('修改成功');
                                this.hideModal();
                                this.$parent.getData();
                            } else {
                                this.$Message.error(res.info);
                            }
                        }
                    }
                })
            },
            cancel() {
                this.hideModal()
            },
        },
    }
</script>

