<style lang="less">
    .count {
        .search {
            padding: 0 10px
        }
        .ivu-input {
            height: 35px;
            font-size: 12px;
        }

        .ivu-tabs-nav .ivu-tabs-tab {
            padding: 10px 50px;
            font-size: 18px;
        }

        .ivu-form .ivu-form-item-label {
            font-size: 12px;
            color: #444;
        }

        .ivu-form-item {
            margin-bottom: 10px;
        }

        .ivu-row {
            margin-top: 10px;
        }
        .card {
            .ivu-row {
                margin-top: 0;
            }
            overflow: hidden;
            .card-left {
                height: 120px;
                text-align: center;
                .card-icon {
                    line-height: 120px;
                    color: #fff;
                    font-size: 55px;
                }
            }
            .card-right {
                text-align: center;
                .card-right-top {
                    text-align: center;
                    line-height: 80px;
                    height: 80px;
                    font-size: 32px;
                }
                .card-right-bottom {
                    height: 40px;
                    border-top: solid 1px #eee;
                    line-height: 40px;
                }
            }
        }
        #reportShow {
            width: 100%;
            height: 650px;
        }
    }
</style>
<template>
    <div class="count">

        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="起止时间" data-flex="dir:left">
                    <DatePicker
                            type="datetimerange"
                            split-panels
                            placeholder="请选择起止时间"
                            @on-change="timeChange"
                            style="width: 280px"
                    ></DatePicker>
                </FormItem>
                <FormItem label="客户" data-flex="dir:left">
                    <Select v-model="searchForm.supplier_id" placeholder="请选择客户" filterable clearable>
                        <Option v-for="(item, index) in customerList" :key="index" :value="item.id">{{item.name}}
                        </Option>
                    </Select>
                </FormItem>
                <!--<FormItem label="车牌号" data-flex="dir:left">-->
                    <!--<Input v-model="searchForm.plate_number" placeholder="车牌号" style="width: 100px"></Input>-->
                <!--</FormItem>-->
                <FormItem label="报表名称">
                    <Select v-model="searchForm.report_type" filterable clearable placeholder="报表类型(必选)">
                        <Option v-for="(item, index) in reportList" :value="item.value" :key="index">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search" @click="search" :loading="searchLoading">查询</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box">
                <Button type="success" class="add-bt" @click="exportCount">下载报表</Button>
                <Button type="primary" class="add-bt" @click="printCount">打印报表</Button>
            </div>
        </div>
        <!--<Row :gutter="10">-->
            <!--<i-col span="6" v-for="(item,index) in inforCardData" :key="index">-->
                <!--<Card shadow class="card" :padding="0">-->
                    <!--<Row>-->
                        <!--<i-col span="10" class="card-left" :style="{background:item.color}">-->
                            <!--<Icon :type="item.icon" class="card-icon"/>-->
                        <!--</i-col>-->
                        <!--<i-col span="14" class="card-right">-->
                            <!--<div class="card-right-top">-->
                                <!--&lt;!&ndash;<countTo :startVal="0" :endVal="item.count" :duration="3000"></countTo>&ndash;&gt;-->
                                <!--<span>{{item.count}}</span>-->
                            <!--</div>-->
                            <!--<div class="card-right-bottom">{{item.title}}</div>-->
                        <!--</i-col>-->
                    <!--</Row>-->
                <!--</Card>-->
            <!--</i-col>-->
        <!--</Row>-->

        <iframe id="reportShow" v-show="status" name="reportShow">

        </iframe>
    </div>
</template>

<script>
    import {countData} from "@/api/purchase";
    import countTo from "vue-count-to";
    import dayjs from "dayjs";
    import { getSupplierAllList } from "@/api/purchase";
    import {PURCHASE_ORDER_STATE} from "@/config/custom";
    import _ from 'lodash'
    import {getPurReportDown, getPurReportList, getPurReportShow} from "@/api/report";

    export default {
        name: "count",
        components: {countTo},
        data() {
            return {
                // inforCardData: [
                //     {
                //         title: "车次",
                //         icon: "ios-create",
                //         count: 0,
                //         color: "#ed3f14"
                //     },
                //     {
                //         title: "总吨数",
                //         icon: "ios-stats-outline",
                //         count: 0,
                //         color: "#E46CBB"
                //     },
                //     {
                //         title: "扣除吨数",
                //         icon: "ios-warning-outline",
                //         count: 0,
                //         color: "#ff9900"
                //     },
                // ],
                searchForm: {
                    settlement_time: "",
                    // plate_number: '',
                    supplier_id: '',
                    // status: PURCHASE_ORDER_STATE.tare, // 已称皮状态
                    report_type: '',
                },

                customerList: [],
                searchLoading: false,
                reportList: [],
                status: false,
            };
        },
        mounted() {
            // this.setDefaultTime()
            this.getData()
            // this.search();
        },
        methods: {
            getData() {
                this.getCustomerList()
                this.getReportList()
            },
            // setDefaultTime() {
            //     if (this.searchForm.time === "") {
            //         let currentMoment = dayjs();
            //         let startTime =
            //             currentMoment.format("YYYY-MM-DD") + " 00:00:00";
            //         let endTime = currentMoment.format("YYYY-MM-DD HH:mm:ss");
            //         this.searchForm.time = startTime + " - " + endTime;
            //     }
            // },
            timeChange(val) {
                if (val[0]) {
                    this.searchForm.settlement_time = _.join(val, ' - ')
                } else {
                    this.searchForm.settlement_time = ''
                }
            },
            async getCustomerList() {
                let res = await getSupplierAllList()
                if (res.status) {
                    this.customerList = res.data
                } else {
                    this.$Message.error(res.info)
                }
            },
            //获取统计数据
            // async getCountData() {
            //     let res = await countData(this.searchForm)
            //     if (res.status) {
            //         this.inforCardData[0].count = parseFloat(res.data.times) || 0;
            //         this.inforCardData[1].count = parseFloat(res.data.total_weight) || 0;
            //         this.inforCardData[2].count = parseFloat(res.data.total_soil) || 0
            //     }
            // },

            //查询信息
            // async search() {
            //     this.searchLoading = true
            //     await this.getCountData();
            //     this.searchLoading = false
            // },
            async getReportList() {
                let res1 = await getPurReportList()
                if (res1.status) {
                    this.reportList = res1.data
                }
            },
            async search() {
                let res = await getPurReportShow(this.searchForm)
                if (res.status === 0) {
                    this.$Message.error(res.info)
                    return
                }
                this.status = true
                let iframe = document.getElementById('reportShow')
                iframe.srcdoc = res
            },
            printCount() {
                window.frames["reportShow"].print()
            },
            async exportCount() {
                let formData = _.assign({}, this.searchForm)
                let res = await getPurReportDown(formData)
                if (res.status === 0) {
                    this.$Message.error(res.info)
                    return
                }
                let content = res
                let blob = new Blob([content])
                let name
                for (let i in this.reportList) {
                    if (this.reportList[i].value == this.searchForm.report_type) {
                        name = this.reportList[i].name
                    }
                }
                // let fileName = (this.searchForm.settlement_time ? `${this.searchForm.settlement_time}` : `数据导出${dayjs().format('YYYY-MM-DD-HH-mm-ss')}`) + '.xls'
                if ('download' in document.createElement('a')) { //支持a标签download的浏览器
                    let link = document.createElement('a')//创建a标签
                    link.download = name + '.xls'//a标签添加属性
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()//执行下载
                    URL.revokeObjectURL(link.href) //释放url
                    document.body.removeChild(link)//释放标签
                } else {
                    this.$Message.error('您的浏览器不支持该下载')
                }
            },
        }
    };
</script>
