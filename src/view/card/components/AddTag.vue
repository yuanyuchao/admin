
    <style scoped lang="less">
        .cardInfo {
            width: 190px;
        }
    </style>

    <template>
        <div class="add-account">
            <Modal v-model="modal" width="400" :title="edit? '修改电子标签' : '制作电子标签'" footer-hide :mask-closable="false">
                <Form ref="form" :model="form" :rules="formRules" :label-width="120">
                    <FormItem label="车牌号" prop="id">
                        <Select @on-query-change="getData" v-model="form.id" clearable filterable placeholder="请输入车牌号">
                            <Option  v-for="item in customerList" :value="item.id" :key="item.id" :label="item.plate_number">
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="电子标签ID" prop="idcard_no">
                        <Input readonly class="cardInfo" v-model="form.idcard_no" placeholder="请读卡"></Input>
                        <Button type="info" @click="getdata">读卡</Button>
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
        import { addElecCard,elecCarList } from '@/api/card'
        import { CARD_URL } from '@/config/custom'
        import axios from 'axios'
        export default {
            props: [],
            components: {},
            data () {
                return {
                    modal: false,
                    formRules: {
                        id: [
                            { required: true, type: 'number', message: '客户名称不能为空', trigger: 'blur' }
                        ],
                        idcard_no: [
                            { required: true, message: '请读卡', trigger: 'blur' }
                        ],
                    },
                    form: {
                        id: '',
                        idcard_no: '',
                    },
                    edit: false,
                    customerList: '',
                }
            },
            created () {
            },
            mounted () {
            },
            computed: {},
            watch: {},
            methods: {
                showModal (params) {
                    this.$refs.form.resetFields()
                    if (params) {
                        initData(this.form, params)
                        this.edit = true
                    } else {
                        this.edit = false
                    }
                    this.modal = true
                },
                async getData(val) {
                    let truckRes = await elecCarList({plate_number: val})
                    if (truckRes.status) {
                        this.customerList = truckRes.data
                    }
                },
                hideModal () {
                    this.modal = false
                },
                getdata () {
                    let that = this
                    axios({
                        method: 'get',
                        url: CARD_URL.JtCard,
                    })
                    .then(function (response) {
                        if (response.status == 200) {
                            if (response.data.Status) {
                                that.form.idcard_no = response.data.Data
                            } else {
                                that.form.idcard_no = ''
                                that.$Message.error(response.data.Data)
                            }

                        } else {
                            that.$Message.error('服务异常请检查')
                        }
                    }).catch(err => {
                        that.$Message.error('服务异常请检查')
                    })
                },
                submit () {
                    this.$refs.form.validate(async valid => {
                        if (valid) {
                            if (!this.edit) {
                                let res = await addElecCard(this.form)
                                if (res.status) {
                                    this.hideModal()
                                    this.$Message.success('提交成功')
                                    this.$parent.getData()
                                } else {
                                    this.$Message.error(res.info)
                                }
                            }
                        }
                    })
                },
                cancel () {
                    this.hideModal()
                }
            },
        }
    </script>
