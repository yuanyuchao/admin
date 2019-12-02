<style lang="less">
    .account {
        .count-style {
            font-size: 40px;
        }
    }
</style>
<style scoped lang="less">
    .status{
        visibility: hidden;
    }
</style>

<template>
    <div class="account">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="客户名称" prop="customer_name">
                    <Select  v-model="searchForm.customer_id" filterable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="时间" data-flex="dir:left">
                    <DatePicker v-model="time" type="datetimerange" placeholder="时间范围(不选默认上月)" style="width: 280px" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">查看账单</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box" v-show="!status">
                <Button type="success" class="add-bt" @click="exportOrder">导出订单明细</Button>
                <!--<Button type="success" class="add-bt" @click="exportCarStone">导出车辆料类统计</Button>-->
                <!--<Button type="success" class="add-bt" @click="exportCustom">导出客户统计单</Button>-->
                <Button type="success" class="add-bt" @click="exportCount">打印对账单</Button>
            </div>
        </div>
        <Row :gutter="20" type="flex" v-show="!status">
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="flex:1;height: 120px;padding-bottom: 10px;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <count-to :end="infor.count" count-class="count-style"/>
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;">
            <i-col :class="{status: status}" :md="24" :lg="12" style="margin-bottom: 20px;">
                <Card shadow>
                    <div id="chartsBar" style="height: 340px"></div>
                </Card>
            </i-col>
            <!--<i-col :class="{status: status}"   :md="24" :lg="8" style="margin-bottom: 20px;">-->
                <!--<Card shadow>-->
                    <!--<div id="chartsLine" style="height: 340px"></div>-->
                <!--</Card>-->
            <!--</i-col>-->
            <i-col :class="{status: status}"   :md="24" :lg="12" style="margin-bottom: 20px;">
                <Card shadow>
                    <div id="charts" style="height: 340px"></div>
                </Card>
            </i-col>
        </Row>
        <Row :gutter="20" v-show="!status" >
            <i-col :xs="12" :md="8" :lg="12" style="height: 120px;padding-bottom: 10px;">
                <Card>
                    <p slot="title">车辆统计</p>
                    <Table maxHeight="500" :columns="columns8" :data="data7" :loading="tableLoading" @on-selection-change="selectChange"></Table>
                    <div data-flex="dir:right" class="page-box">
                        <Page :total="page.total" show-total :page-size="page.list_rows" :current="page.page" @on-change="pageChange"/>
                    </div>
                </Card>
            </i-col>
            <i-col :xs="12" :md="8" :lg="12" style="height: 120px;padding-bottom: 10px;">
                <Card>
                    <p slot="title">订单明细</p>
                    <Table maxHeight="500" :columns="columns9" :data="data9" :loading="tableLoading" @on-selection-change="selectChange" ref="orderTable"></Table>
                    <div data-flex="dir:right" class="page-box">
                        <Page :total="page1.total" show-total :page-size="page1.list_rows" :current="page1.page" @on-change="pageChangeOrder"/>
                    </div>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import {getCustomerNameListWr, recCount} from '@/api/customer'
    import { getOrderList } from '@/api/order'
    import { plateList } from '@/api/car'
    import {summaryList} from '@/api/balance'
    import InforCard from '_c/info-card'
    import CountTo from '_c/count-to'
    import echarts from 'echarts'
    import dayjs from 'dayjs'
    import _ from 'lodash';
    import { cusPrint, handleTime } from '@/libs/util'
    import { getPrinttpl } from '@/api/printtpl'

    export default {
        props: {},
        components: {
            InforCard,
            CountTo,
        },
        data () {
            return {
                customerList: [],
                status: true,
                time:'',
                searchForm: {
                    customer_id: '',
                    settlement_time: '',
                },
                inforCardData: [
                    { title: '总订单量', icon: "ios-aperture", count: 0, color: '#19be6b' },
                    { title: '总拉料车数', icon: "ios-albums", count: 0, color: '#ff9900' },
                    { title: '总吨数', icon: "md-clipboard", count: 0, color: '#ed3f14' },
                    { title: '总金额', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
                    { title: '料类数', icon: "ios-aperture", count: 0, color: '#19be6b' },
                ],
                pieData:[],
                barData:[],
                moneyData:[],
                lineData: [],
                page: {
                    page: 1,
                    list_rows: 10,
                    total: 0
                },
                page1: {
                    page: 1,
                    list_rows: 10,
                    total: 0
                },
                columns8: [
                    // {
                    //     title: '车牌分类',
                    //     key: 'name'
                    // },
                    {
                        title: '车牌号',
                        key: 'plate_number'
                    },
                    {
                        title: '料类名称',
                        key: 'stone_name'
                    },
                    {
                        title: '总吨数',
                        key: 'weight'
                    },
                    {
                        title: '总金额',
                        key: 'money'
                    },
                    {
                        title: '总车数',
                        key: 'train_number'
                    },
                ],
                columns9: [
                    {
                        title: '序号',
                        key: 'serial_number'
                    },
                    {
                        title: '订单编号',
                        key: 'order_no',
                        width:200
                    },
                    {
                        title: '料类名称',
                        key: 'stone_name'
                    },
                    {
                        title: '毛重',
                        key: 'gross_weight'
                    },
                    {
                        title: '皮重',
                        key: 'tare_weight'
                    },
                    {
                        title: '净重',
                        key: 'net_weight'
                    },
                    {
                        title: '价格',
                        key: 'price'
                    },
                    {
                        title: '总金额',
                        key: 'money'
                    },
                    {
                        title: '出厂时间',
                        key: 'settlement_time',
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number'
                    }
                ],
                tableLoading: false,
                data7: [],
                data9:[]
            }
        },
        created () {
            this.getNameList()
        },
        // watch: {
        //     'time': function() {
        //         this.searchForm.settlement_time = handleTime(this.time)
        //     },
        // },
        mounted () {

        },
        methods: {
            async getData () {
                let params = Object.assign(this.page1, this.searchForm,{status:4})
                let res = await getOrderList(params)
                if (res.status) {
                    this.data9 = res.data.data
                    this.page1.total = res.data.total
                }else {
                    this.$Message.error(res.info)
                }
            },
            async getCar () {
                let params = Object.assign(this.page,this.searchForm,)
                let res = await plateList(params)
                if (res.status) {
                    this.data7 = res.data.data
                    console.log(this.data7,'xxxx')
                    this.page.total = res.data.total
                }else {
                    this.$Message.error(res.info)
                }
            },
            async getNameList() {
                let res = await getCustomerNameListWr()
                if (res.status) {
                    this.customerList = res.data
                }
            },
            async search() {
                if(this.time[0] == '') {
                    this.$Message.error('请选择时间')
                    return
                }else {
                    this.searchForm.settlement_time = dayjs(this.time[0]).format('YYYY-MM-DD HH:mm:ss')+ ' - '+ dayjs(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
                }
                this.getData()
                this.getCar()
                let res = await summaryList(this.searchForm)
                if (res.status) {
                    //用户统计卡片数据
                    this.inforCardData[0].count = Number(res.data.OrderCount)
                    this.inforCardData[1].count = Number(res.data.VehicleNumber)
                    this.inforCardData[2].count = Number(res.data.Total.total_weight)
                    this.inforCardData[3].count = Number(res.data.Total.total_money)
                    this.inforCardData[4].count = Number(res.data.StoneCount)
                    //表格数据
                    // this.data7 = res.data.Summary
                    let plate = []
                    _.forEach(res.data.Summary, function(list) {
                        _.forEach(list.list, function (plateList) {
                            plate.push(plateList)
                        })
                    })
                    // this.data7 = plate
                    // this.page.total = plate.length
                    //charts图表数据
                    //pie
                    let data = []
                    _.forEach(res.data.SummaryStoneWeight, function(list) {
                        let chart = {}
                         chart.name = list.stone_name
                        chart.value = Number(list.weight)
                        data.push(chart)
                    })
                    this.pieData = data
                    //bar
                    let that = this
                    that.barData = []
                    that.moneyData = []
                    _.forEach(res.data.MaxMoney, function(list) {
                        that.barData.push( list.stone_name)
                        that.moneyData.push( Number(list.money))
                    })
                    this.getChart()
                } else {
                    this.$Message.error(res.info)
                }
            },
            getEcharts() {
                let yData = []
                _.forEach(this.pieData, function (res) {
                    if (res.name) {
                        yData.push(res.name)
                    }
                })
                let data = _.filter(this.pieData, item => {
                    return item.name
                })

                console.log(yData, 'ydata');
                console.log(data, 'data');
                let myChart = echarts.init(document.getElementById('charts'));
                myChart.setOption({
                        title : {
                            text: '料类购买分布图',
                            x:'center',
                            textStyle: {
                                color: '#526C92',
                            },
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: yData
                        },
                        series : [
                            {
                                name: '料类占比',
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data: data,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                })
            },
            getEchartsBar() {
                let xData = this.moneyData
                let yData = this.barData
                let myChart = echarts.init(document.getElementById('chartsBar'));
                myChart.setOption({
                    title: {
                        text: '订单金额排行(最多五笔)',
                        x: 'center',
                        textStyle: {
                            color: '#526C92',
                        },
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: yData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    color: [ '#3398DB'],
                    yAxis: {
                        type: 'value',
                    },
                    series: [{
                        data: xData,
                        type: 'bar',
                        barMaxWidth : '10%',
                        name: '金额(元)'
                    }]
                })
            },
            getEchartsLine() {
                let myChart = echarts.init(document.getElementById('chartsLine'));
                myChart.setOption({
                    // title: {
                    //     text: '价格走势图',
                    //     x: 'center',
                    //     textStyle: {
                    //         color: '#526C92',
                    //     },
                    // },
                    tooltip: {
                        trigger: 'axis'
                    },
                    // legend: {
                    //     data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                    // },
                    // grid: {
                    //     left: '3%',
                    //     right: '4%',
                    //     bottom: '3%',
                    //     containLabel: true
                    // },
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'邮件营销',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'联盟广告',
                            type:'line',
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'视频广告',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'直接访问',
                            type:'line',
                            stack: '总量',
                            data:[320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name:'搜索引擎',
                            type:'line',
                            stack: '总量',
                            data:[820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                })
            },
            addData() {},
            async exportOrder() {
                let maxTotal = 10000
                let params = Object.assign({}, {page: 1, list_rows: maxTotal}, this.searchForm, {status:4})
                let res = await getOrderList(params)
                if (res.data.total > maxTotal) {
                    this.$Message.error(`您导出的数据大于${maxTotal}条,请改变筛选条件后重试`)
                } else {
                    let data = res.data.data
                    data.map((item, index) => {
                        item.serial_number = index + 1
                    })
                    this.$refs.orderTable.exportCsv({
                        filename: `订单明细数据${this.searchForm.settlement_time}`,
                        columns: this.columns9,
                        data,
                        quoted: true,
                        separator: ',=',
                    });
                }
            },
            async exportCarStone() {
                // axios.post("http://127.0.0.1:3001/statistics",{
                //     title:"你好鑫山",
                //     datetime:"2019-06-11 19:59:00至20109",
                //     customer_name:"那那那",
                //     data:[
                //         {
                //             customer_name: '谢谢',
                //             grosstotal:15,
                //             taretotal:16,
                //             nettotal:17,
                //             carcount:18
                //         },
                //         {
                //             customer_name: '谢谢1',
                //             grosstotal:15,
                //             taretotal:16,
                //             nettotal:17,
                //             carcount:38
                //         },
                //         {
                //             customer_name: '谢谢2',
                //             grosstotal:15,
                //             taretotal:16,
                //             nettotal:17,
                //             carcount:20
                //         }
                //
                //     ]
                // }).then(res => {
                //     console.log(res);
                // })
            },
            async exportCustom() {

            },
            async exportCount() {
                let res = await recCount(this.searchForm)
                let data = res.data
                data.customer.customer_name = data.customer.customer_name ? data.customer.customer_name : '全部客户'

                let tplRes = await getPrinttpl({scene: 5});
                let template = tplRes.data.template

                let compiled = _.template(template);
                let body = compiled(data);
                cusPrint(body)
            },
            getChart() {
                this.status = false
                this.getEcharts()
                this.getEchartsBar()
                // this.getEchartsLine()
            },
            selectChange(selection) {
                this.selectIds = selection.map(item => {
                    return item.id
                })
            },
            pageChange (index) {
                this.page.page = index
                this.getCar()
            },
            pageChangeOrder (index) {
                this.page1.page = index
                this.getData()
            },
        },
    }
</script>
