<style scoped >
    .actions {
        margin-top: 15px;
        padding-left: 80px;
        border-top: 1px solid #eee;
        padding-top: 20px;
        width: 1000px;
    }
    .editcode{
        width: 900px;
        border: 1px solid #eee;
        padding: 10px;
        outline: none;
        resize: none;
    }
</style>
<template>
    <div id="printer-setting">
        <div class="preview" v-html="templateData.template">
        </div>
        <div class="actions" >
            <Button size="large" @click="modal = true" type="primary">编辑</Button>
        </div>
        <Modal v-model="modal" :loading="loading" width="920" title="编辑模板" @on-ok="updateTemplate" :footer-hide="true">
            <textarea class="editcode"
                      rows="40" cols="30" id="feed-printer" >
                {{templateData.template}}
            </textarea>
            <div style="margin-top: 20px;">
                <Button type="primary" :loading="loading" @click="updateTemplate">提交</Button>
                <Button type="default" @click="modal = false" style="margin-left: 10px">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { getPrinttpl,udpatePrinttpl } from '@/api/printtpl'

    export default {
        mounted(){
            this.$parent.tabValue = this.$route.name;
        },
        data() {
            return {
                modal:false,
                priterVars:{
                    order_sn:'订单编号',
                    out_time:'出厂时间',
                    truck:'车牌号',
                    stone:'石料名称',
                    out_weight:'毛重',
                    in_weight:'皮重',
                    net_weight:'净重',
                    money:'单价',
                    price:'总价',
                    company:'客户名称',
                    driver_mobile:'司机名称',
                },
                templateData:{
                    template: ''
                },
                printerVar:[],
                loading:false
            }
        },
        async mounted(){
            let result = await getPrinttpl({scene: 8});
            if(result.status) {
                this.templateData = result.data
            }
        },
        methods:{
            async updateTemplate(){
                this.loading = true;
                let newTemplate = document.getElementById('feed-printer').value;
                let result = await udpatePrinttpl({id: this.templateData.id, scene: this.templateData.scene, template: newTemplate});
                this.loading = false;
                if(result.status){
                    this.templateData.template = newTemplate;
                    this.modal = false;
                }else{
                    this.$Message.error(result.info);;
                    return false;
                }
            }
        }
    }
</script>
