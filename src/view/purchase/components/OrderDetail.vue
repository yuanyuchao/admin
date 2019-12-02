<style scoped lang="less">
    .line {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .order-detail {
        .img-item {
            width: 28px;
            height: 28px;
            margin-right: 10px;
        }
    }
</style>

<template>
    <Modal v-model="modal" width="400" title="订单详情">
        <div class="add-account order-detail">
            <Row>
                <Col span="12">订单编号:</Col>
                <Col span="12">{{form.order_no}}</Col>
            </Row>
            <Divider size="small"/>
            <Row>
                <Col span="12">供应商名称:</Col>
                <Col span="12">{{form.supplier_name}}</Col>
            </Row>
            <Divider size="small"/>
            <Row>
                <Col span="12">料类:</Col>
                <Col span="12">{{form.stone_name}}</Col>
            </Row>
            <template v-if="hasImg">
                <Divider size="small"/>
                <Row>
                    <Col span="12">图片:</Col>
                    <Col span="12">
                        <a :href="imgsrc(item.pic_url)" target="_blank" v-for="(item, index) in imgs" :key="index">
                            <img :src="imgsrc(item.pic_url)" class="img-item"/>
                        </a>
                    </Col>
                </Row>
            </template>
            <Divider size="small"/>
            <Row>
                <Col span="12">总金额:</Col>
                <Col span="12">{{form.money}}</Col>
            </Row>
        </div>
    </Modal>

</template>

<script>
    // import { getCustomerList } from '@/api/customer'
    // import { getOrderInfo } from '@/api/order'
    import {imgSrc} from "@/config/custom"
    const path=require("path")

    export default {
        props: [],
        components: {},
        data () {
            return {
                modal: false,
                form: {},
                id: '',
                imgs: []
            }
        },
        created () {

        },
        mounted () {

        },
        computed: {
            hasImg () {
                return this.imgs.length > 0
            }
        },
        watch: {},
        methods: {
            showModal (data) {
                this.form = data
                this.getInfo(data.id)
                this.modal = true
            },
            imgsrc(src){
                return imgSrc + path.basename(src);
            },
            hideModal () {
                this.modal = false
            },
            cancel () {
                this.hideModal()
            },
            goCustomer () {
                let id = this.form.id
                this.$router.push({ path: '/customer/Index', query: { id: id } })
            },
            async getInfo (id) { //获取图片
                // let res = await getOrderInfo(id)
                // if (res.status) {
                //     this.imgs = res.data
                // }
                this.imgs = []
            }
        },
    }
</script>





