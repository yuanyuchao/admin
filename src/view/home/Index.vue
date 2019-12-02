<template>
    <div class="home-index">
        <Row :gutter="20" type="flex">
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData1" :key="`infor1-${i}`"
                   style="height: 120px;padding-bottom: 10px;flex: 1">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <p style="font-size: 20px">{{infor.date}}</p>
                    <p style="font-size: 30px">{{infor.time}}</p>
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`"
                   style="height: 120px;padding-bottom: 10px;flex: 1">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :left="25">
                    <count-to :end="infor.count" style="font-size: 14px" count-class="count-style"/>
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData2" :key="`infor2-${i}`"
                   style="height: 120px;padding-bottom: 10px;flex: 1">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36" :left="25">
                    <p style="font-weight: bold;font-size: 36px;margin-top: 10px">{{ infor.count }}</p>
                    <p style="margin-top: 10px">{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;" class="car-line">
            <Card shadow style="height: 360px;">
                <p class="title">排队情况(共{{totalCars}}辆)</p>
                <i-col span="6" v-for="(item, key) in lineCars" :key="key">
                    <Card class="item-box">
                        <div>
                            <Icon type="ios-leaf"></Icon>
                            {{item.name}}
                        </div>
                        <div class="desc">
                            等待车辆<span class="num"> {{item.num}}</span>
                        </div>
                    </Card>
                </i-col>
            </Card>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;">
            <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                <Card shadow style="height: 360px;">
                    <p class="title">近7日畅销料类排行</p>
                    <Table height="280px" highlight-row :columns="columns1" :data="data1"></Table>
                    <p class="more" @click="gotoMore">查看更多</p>
                </Card>
            </i-col>
            <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                <Card shadow style="height: 360px;">
                    <p class="title">近7日客户消费排行</p>
                    <Table height="280px" highlight-row :columns="columns2" :data="data2"></Table>
                    <p class="more" @click="gotoCus">查看更多</p>
                </Card>
            </i-col>
            <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
                <Card shadow style="height: 360px;">
                    <div id="charts" style="height: 340px;width: 100%;"></div>
                </Card>
            </i-col>
        </Row>
        <Stone ref="stone"/>
        <Car ref="car"/>
        <Customer ref="customer"/>
    </div>
</template>

<script>
    import {getHomeInfo, getLineCars} from '@/api/home'
    import {CAR_TYPE} from '@/config/custom'
    import dayjs from 'dayjs'
    import InforCard from '_c/info-card'
    import CountTo from '_c/count-to'
    import Example from './Example.vue'
    import _ from 'lodash';
    import echarts from 'echarts'
    import Stone from './components/stone'
    import Customer from './components/customer'
    import Car from './components/car'

    export default {
        name: 'home',
        components: {
            InforCard,
            CountTo,
            Example,
            Stone,
            Customer,
            Car,
        },
        data() {
            return {
                inforCardData1: [
                    {title: '当前时间', icon: 'ios-clock-outline', date: 0, time: 0, color: '#2d8cf0'},
                ],
                inforCardData2: [
                    {title: '今日预存款量（万元）', icon: 'logo-yen', count: 0, color: '#ed3f14'},
                ],
                inforCardData: [
                    // { title: '系统累计运行时长', icon: "ios-aperture", count: 0, color: '#19be6b' },
                    {title: '今日订单量（个）', icon: "ios-albums", count: 0, color: '#ff9900'},
                    {title: '今日销售量（吨）', icon: "md-clipboard", count: 0, color: '#ed3f14'},
                    {title: '今日销售额（元）', icon: 'md-chatbubbles', count: 0, color: '#E46CBB'},
                    {title: '今日新增客户（个）', icon: 'ios-albums', count: 0, color: '#ed3f14'},
                    {title: '今日预约量（吨）', icon: 'ios-nuclear', count: 0, color: '#ed3f14'},

                ],
                barData: {},
                cartype: CAR_TYPE,
                columns3: [
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '订单号',
                        key: 'order_no',
                        width: 250,
                        tooltip: true,
                    },
                    {
                        title: '预装重量',
                        key: 'preload',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '皮重',
                        key: 'tare_weight',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '料类',
                        key: 'stone_name',
                        width: 150,
                        tooltip: true,
                    },
                    {
                        title: '累计时间',
                        key: 'tableTimeAll',
                        width: 200,
                        tooltip: true,
                    },
                    {
                        title: '入场时间',
                        key: 'in_time',
                        width: 250,
                        tooltip: true,
                    },
                    {
                        title: '当前状态',
                        width: 200,
                        tooltip: true,
                        render: (h, params) => {
                            let status = params.row.status
                            return h('span', this.cartype[status])
                        }
                    },
                ],
                data3: [],
                columns1: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '料类',
                        key: 'stone_name'
                    },
                    {
                        title: '总销量',
                        key: 'total_weight'
                    },
                    {
                        title: '总金额',
                        key: 'total_money'
                    },
                ],
                data1: [],
                columns2: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '客户名称',
                        key: 'customer_name'
                    },
                    {
                        title: '已购',
                        key: 'total_weight'
                    },
                    {
                        title: '总金额',
                        key: 'total_money'
                    },
                ],
                data2: [],
                xData: [],
                yData: '',
                zData: '',
                lineCars: [],
            }
        },
        mounted() {
            this.getTime()
            this.getInfo()
            this.getLineCars()
        },
        computed: {
            totalCars() {
                let arr = this.lineCars.map(item => {
                    return item.num
                })
                return _.sum(arr)
            }
        },
        methods: {
            async getInfo() {
                let res = await getHomeInfo()
                if (res.status) {
                    this.inforCardData[0].count = res.data.OrderCount
                    this.inforCardData[1].count = res.data.TotalWeight
                    this.inforCardData[2].count = res.data.total_money
                    this.inforCardData[3].count = res.data.CustomerCount
                    this.inforCardData[4].count = res.data.app_order_count
                    this.inforCardData2[0].count = (res.data.today_money / 10000).toFixed(2)
                    let that = this
                    let timeData = []
                    _.forEach(_.keys(res.data.YesterdayWeight), function (val) {
                        val = val.slice(5, 10)
                        timeData.push(val)
                    })
                    this.xData = timeData
                    let x = []
                    let z = []
                    _.forEach(res.data.YesterdayWeight, function (value) {
                        let y = []
                        _.forEach(value, function (time) {
                            y.push(Number(time.total_weight))
                            if (z.indexOf(time.stone_name) == -1) {
                                z.push(time.stone_name)
                            }
                        })
                        x.push(y)
                    })
                    this.zData = z
                    this.yData = x
                    this.getEcharts()
                    let totalStone = res.data.TotalStoneWeight
                    for (let i in totalStone) {
                        totalStone[i].total_weight = totalStone[i].total_weight + '吨'
                    }
                    this.data1 = totalStone
                    let totalCustomer = res.data.TotalCustomer
                    for (let i in totalCustomer) {
                        totalCustomer[i].total_weight = totalCustomer[i].total_weight + '吨'
                    }
                    this.data2 = totalCustomer
                    let lineData = this.tableTime(res.data.LineUpInfo)
                    for (let i in lineData) {
                        if (!_.isEmpty(lineData[i].in_time)) {
                            if (dayjs(dayjs().format('YYYY-MM-DD-HH:mm')).diff(dayjs(lineData[i].in_time), 'day') < 1) {
                                lineData[i].tableTimeAll = dayjs(dayjs().format('YYYY-MM-DD-HH:mm')).diff(dayjs(lineData[i].in_time), 'hour') + '小时'
                            } else if (dayjs(dayjs().format('YYYY-MM-DD-HH:mm')).diff(dayjs(lineData[i].in_time), 'hour') < 1) {
                                lineData[i].tableTimeAll = dayjs(dayjs().format('YYYY-MM-DD-HH:mm')).diff(dayjs(lineData[i].in_time), 'minute') + '分钟'
                            } else {
                                lineData[i].tableTimeAll = dayjs(dayjs().format('YYYY-MM-DD-HH:mm')).diff(dayjs(lineData[i].in_time), 'day') + '天'
                            }
                        }
                    }
                    // this.data3 = lineData
                }
            },
            tableTime(data = []) {
                _.map(data, (item, index) => {
                    item.tableTimeAll = '';
                })
                return data
            },
            async getLineCars() {
                let res = await getLineCars()
                if (res.status) {
                    this.lineCars = res.data
                } else {
                    this.$Message.error(res.info)
                }
            },
            getTime() {
                this.inforCardData1[0].date = dayjs().format('YYYY-MM-DD')
                this.inforCardData1[0].time = dayjs().format('HH:mm')
                setTimeout(() => this.getTime(), 1000)
            },
            gotoMore() {
                this.$refs.stone.showModal(this.data1)
            },
            gotoCar() {
                this.$refs.car.showModal(this.data3)
            },
            gotoCus() {
                this.$refs.customer.showModal(this.data2)
            },
            getEcharts() {
                let series = []
                for (let i = 0; i < this.zData.length; i++) {
                    let obj = {}
                    obj.name = this.zData[i]
                    obj.type = 'line'
                    obj.stack = '总量'
                    obj.data = []
                    for (let j in this.yData) {
                        obj.data.push(this.yData[j][i])
                    }
                    series.push(obj)
                }
                let myChart = echarts.init(document.getElementById('charts'));
                myChart.setOption({
                    title: {
                        text: '销量走势',
                        x: 'center',
                        textStyle: {
                            color: '#526C92',
                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        axisLabel: {
                            rotate: 30,
                            interval: 0
                        },
                        type: 'category',
                        boundaryGap: false,
                        data: this.xData,
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                });
            }
        }

    }
</script>

<style lang="less">
    .count-style {
        font-size: 32px;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        color: #526C92;
        text-align: center;
        margin-bottom: 10px;
    }

    .more {
        text-align: center;
        margin-top: 10px;
    }

    .home-index {
        .car-line {
            .item-box {
                .ivu-card-body {
                    display: flex;
                    justify-content: space-between;
                }
            }
            .ivu-card {
                margin: 0px 10px 20px 10px;
            }
            .num {
                color: red;
            }
        }
    }

</style>
