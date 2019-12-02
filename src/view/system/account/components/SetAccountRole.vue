<style scoped lang="less">

</style>

<template>
    <div class="set-account-role">
        <Modal v-model="modal" width="320" title="设置角色" footer-hide>
            <Form ref="form" :model="form" :rules="formRules" :label-width="60">
                <FormItem label="角色" prop="role_id">
                    <Select v-model="form.role_id" filterable>
                        <Option v-for="item in list" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
    import { setAccountRole } from '@/api/account'
    import { getAbleRoleList } from '@/api/role'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                list: [],
                formRules: {
                    role_id: [
                        { required: true,type: 'number', message: '角色不能为空', trigger: 'blur' }
                    ],
                },
                form: {
                    id: '',
                    role_id: '',
                },
            }
        },
        created () {
            this.getRoleList();
        },
        mounted () {

        },
        computed: {},
        watch: {},
        methods: {
            showModal(data) {
                this.$refs.form.resetFields()
                this.modal = true;
                this.form.role_id = data.role_id
                this.form.id = data.id
            },
            hideModal() {
                this.modal = false;
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        let res = await setAccountRole(this.form)
                        if (res.status) {
                            this.$Message.success('成功')
                            this.$parent.getData()
                            this.hideModal()
                        } else {
                            this.$Message.error(res.info)
                        }
                    }
                })
            },
            cancel() {
                this.hideModal()
            },
            async getRoleList() {
                let res = await getAbleRoleList()
                if (res.status) {
                    this.list = res.data;
                }
            }
        },
    }
</script>
