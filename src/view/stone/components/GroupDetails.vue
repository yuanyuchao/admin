<style scoped lang="less">

</style>

<template>
    <div class="add-account">
        <Modal  v-model="modal" width="400" title="分组详情">
            <Row>
                <Col span="12">分组名称：</Col>
                <Col span="12">{{form.group_name}}</Col>
            </Row>
            <Divider size="small"/>
            <Row>
                <Col span="12">分组说明：</Col>
                <Col span="12">{{form.explain}}</Col>
            </Row>
            <Divider size="small"/>
            <Row>
                <Col span="12">组内料类数：</Col>
                <Col span="12">{{form.stone_number}}</Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import { addStoneGroup,editStoneGroup } from '@/api/stoneGroup'
    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                form: ''
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
                this.form = params
                this.modal = true;
            },
            hideModal() {
                this.modal = false;
            },
            cancel() {
                this.hideModal()
            }
        },
    }
</script>




