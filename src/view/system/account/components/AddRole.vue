<style scoped lang="less">
</style>

<template>
    <div class="add-account">
        <Modal
            v-model="modal"
            width="400"
            :title="edit ? '修改角色' : '添加角色'"
            footer-hide
            :mask-closable="false"
        >
            <Form ref="form" :model="form" :rules="formRules" :label-width="60">
                <FormItem label="角色名" prop="name">
                    <Input v-model="form.name" placeholder="角色名"></Input>
                </FormItem>
                <FormItem label="描述" prop="description">
                    <Input
                        v-model="form.description"
                        placeholder="描述"
                    ></Input>
                </FormItem>
                <FormItem label="权限">
                    <Tree
                        :data="access"
                        ref="tree"
                        show-checkbox
                        check-strictly
                    />
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
import * as role from "@/api/role";
import ACCESS from "@/config/access";
import { initData } from "@/libs/custom";

export default {
    props: [],
    components: {},
    data() {
        return {
            modal: false,
            formRules: {
                name: [
                    {
                        required: true,
                        message: "角色名不能为空",
                        trigger: "blur"
                    }
                ],
                description: [
                    { required: true, message: "描述不能为空", trigger: "blur" }
                ]
            },
            form: {
                name: "",
                description: "",
                status: "",
                id: "",
                menu: "",
                action: "111"
            },
            access:JSON.parse(JSON.stringify(ACCESS.menu)),
            edit: false
        };
    },
    created() {
    },
    mounted() {},
    computed: {},
    watch: {},
    methods: {

        async showModal(params = "") {
            this.$refs.form.resetFields();
            if (params) {
                initData(this.form, params);
                this.form.menu = JSON.stringify(this.access);
                this.edit = true;
            } else {
                this.edit = false;
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
                        this.form.menu = JSON.stringify(this.access);
                        let res = await role.addRole(this.form);
                        if (res.status) {
                            this.$Message.success("添加成功");
                            this.hideModal();
                            this.$parent.getData();
                        } else {
                            this.$Message.error(res.info);
                        }
                    } else {
                        this.form.menu = JSON.stringify(this.access);
                        let res = await role.editRole(this.form);
                        if (res.status) {
                            this.$Message.success("修改成功");
                            this.hideModal();
                            this.$parent.getData();
                        } else {
                            this.$Message.error(res.info);
                        }
                    }
                }
            });
        },
        cancel() {
            this.hideModal();
        }
    }
};
</script>

