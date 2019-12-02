<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal v-model="modal" width="800" :title="edit? '移除料类' : '添加料类'" footer-hide>
            <Form ref="form" :model="form" :rules="formRules" :label-width="80">
                <!--<FormItem label="客户名称" prop="customer_id">-->
                    <!--<Select  v-model="form.customer_id" filterable>-->
                        <!--<Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem label="选择料类" prop="customer_ids" :error="transFerError">
                    <Transfer :data="Transferdata"
                              :titles="transfTitle"
                              :list-style="listStyle"
                              @on-change="checkCustomers"
                              :target-keys="customer_ids">
                    </Transfer>
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
    import { batchStoneGroup } from '@/api/stoneGroup'
    import {getStoneNameList} from '@/api/stone'
    import { initData } from '@/libs/custom'

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                edit: false,
                formRules: {
                    customer_id: [
                        {required: true, type: 'number', message: '客户名称不能为空', trigger: 'blur'}
                    ],
                },
                transFerError: "",
                form: {
                    type:'',
                    id: '',
                    group_id: '',
                },
                customer_ids: [],
                customerList: '',
                Transferdata: [],
                transfTitle: ["料类列表", "已选择的料类"],
                listStyle: {
                    width: "300px",
                    height: "400px"
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
            showModal(data, type) {
                this.$refs.form.resetFields()
                this.customer_ids = []
                if(type == 'inc') {
                    this.form.type = 'inc'
                    this.form.group_id = data.id
                    this.edit = false
                }else {
                    this.form.group_id = data.id
                    this.form.type = 'del'
                    this.edit = true
                }
                this.modal = true;
                this.getNameList()
            },
            hideModal() {
                this.modal = false;
            },
            async getNameList() {
                let dataArray = [];
                this.Transferdata = [];
                let data = {group_id: 0}
                if (this.edit) {
                    data.group_id =  this.form.group_id
                }
                let res = await getStoneNameList(data)
                if (res.status) {
                    for (let i = 0; i < res.data.length; i++) {
                        let arr = {
                            key: res.data[i].id,
                            label: res.data[i].name,
                            disabled: false
                        };
                        dataArray.push(arr);
                    }
                    this.Transferdata = dataArray;
                }
            },
            submit() {
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        if (!this.edit) {
                            let id = ''
                            for (let i in this.customer_ids) {
                                id = id + this.customer_ids[i] + ','
                            }
                            this.form.id = id
                            let res = await batchStoneGroup(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('添加料类成功')
                                this.$parent.getData()
                            } else {
                                this.$Message.error(res.info)
                            }
                        } else {
                            let id = ''
                            for (let i in this.customer_ids) {
                                id = id + this.customer_ids[i] + ','
                            }
                            this.form.id = id
                            let res = await batchStoneGroup(this.form)
                            if (res.status) {
                                this.hideModal()
                                this.$Message.success('移除料类成功')
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
                this.$refs.form.resetFields()
            },
            //穿梭框数据变化时触发
            checkCustomers(newTargetKeys, direction, moveKeys) {
                alert(1)
                this.customer_ids = newTargetKeys;
            }
        },
    }
</script>


