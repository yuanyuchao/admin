<template>
    <div id="receipt-printer">
        <div class="preview" v-html="templateData.template">
        </div>
        <div class="actions">
            <Button size="large" @click="modal = true" type="primary">编辑</Button>
        </div>
        <Modal v-model="modal" :loading="loading" width="920" title="编辑模板" @on-ok="updateTemplate" :footer-hide="true">
            <textarea class="editcode"
                      rows="40" cols="30" id="templateReceipt">
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
        name: "ReceiptPrinter",
        data() {
            return {
                modal: false,
                templateData:{
                    template:''
                },
                printerVar: [],
                loading: false
            }
        },
        async mounted() {
              let result = await getPrinttpl({scene: 3});
            if (result.status) {
                this.templateData = result.data;
            }
        },
        methods: {
            async updateTemplate() {
                this.loading = true;
                let newTemplate = document.getElementById('templateReceipt').value;
                let result = await udpatePrinttpl({id: this.templateData.id, scene: this.templateData.scene, template: newTemplate});
                this.loading = false;
                if (result.status) {
                    this.templateData.template = newTemplate;
                    this.modal = false;
                } else {
                    this.$Message.error(result.info);
                    return false;
                }
            }
        }
    }
</script>

<style scoped>
        .preview {
            height: 430px;
        }
        .actions {
            margin-top: 15px;
            padding-left: 80px;
            border-top: 1px solid #eee;
            padding-top: 20px;
            /*width: 1000px;*/
        }

    .editcode {
        width: 900px;
        border: 1px solid #eee;
        padding: 10px;
        outline: none;
        resize: none;
    }

</style>
