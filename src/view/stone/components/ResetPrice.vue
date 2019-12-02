<style scoped lang="less">
    .inputWidth {
        width: 300px;
    }
</style>
<template>
    <Modal v-model="modal" width="800" title="批量修改料类价格" :footer-hide="true">
        <Form ref="form" :model="form" :label-width="100" :rules="ruleValidate">
            <FormItem style="width: 300px" label="选择料类" prop="stone_id">
                <Select v-model="form.stone_id" style="width:200px" placeholder="请选择料类" @on-change="getCustomers">
                    <Option v-for="item in stones" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="选择客户" prop="customer_ids" :error="transFerError">
                <Transfer :data="Transferdata"
                          :titles="transfTitle"
                          :list-style="listStyle"
                          @on-change="checkCustomers"
                          :target-keys="form.customer_ids">
                </Transfer>
            </FormItem>
            <FormItem label="价格" prop="price">
                <Input v-model.number="form.price" class="inputWidth"  placeholder="请输价格" />
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button type="default" @click="hideModal" style="margin-left: 10px">取消</Button>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
    import { stoneCustomerLists,editStonePriceAll } from '@/api/stonePrice'
    import {getStoneNameList} from '@/api/stone'
    // import { getStones, getStonePrice, stonePriceEditList } from "@/service/stone";
    import { SIGBREAK } from "constants";

    export default {
        watch: {
            modal(value) {
                if (!value) {
                    this.$refs.form.resetFields();
                }
            }
        },
        data() {
            return {
                stones: [],
                customers: [],
                form: {
                    stone_id: "",
                    price: "",
                    customer_ids: []
                },
                transFerError: "",
                transfTitle: ["客户", "已选择客户"],
                Transferdata: [],
                listStyle: {
                    width: "300px",
                    height: "400px"
                },
                modal: false,
                ruleValidate: {
                    stone_id: { required: true,type: "number", message: "请选择料类", trigger: "change" },
                    price: {
                        required: true,
                        type: "number",
                        message: "价格不能为空且必须是数字",
                        trigger: "change"
                    },
                }
            };
        },
        mounted() {
            getStoneNameList().then(result => {
                this.stones = result.data;
            });
        },
        methods: {
            handleSubmit() {
                if (this.form.customer_ids.length <= 0) {
                    this.transFerError = "请选择客户";
                    return false;
                } else {
                    this.transFerError = "";
                }
                this.$refs.form.validate(async valid => {
                    if (valid) {
                        let result = await editStonePriceAll(this.form);
                        if (result.status) {
                            this.$Message.success("批量修改料类价格成功");
                            this.hideModal();
                            this.$parent.getData();
                        } else {
                            this.$Message.error(result.info);
                        }
                    }
                });
            },
            async showModal() {
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            //根据料类动态获取公司
            getCustomers(value) {
                let dataArray = [];
                this.Transferdata = [];
                this.form.cids = [];
                if (!value) {
                    return false;
                }
                stoneCustomerLists({ stone_id: value }).then(res => {
                    if (res.status) {
                        for (let i = 0; i < res.data.length; i++) {
                            let arr = {
                                key: res.data[i].customer_id,
                                label: res.data[i].customer_name,
                                disabled: false
                            };
                            dataArray.push(arr);
                        }
                        this.Transferdata = dataArray;
                    }
                });
            },
            //穿梭框数据变化时触发
            checkCustomers(newTargetKeys, direction, moveKeys) {
                console.log(newTargetKeys);
                this.form.customer_ids = newTargetKeys;
                console.log(this.form.customer_ids, 'ddd')
            }
        }
    };
</script>


