
<template>
    <div class="pound-round">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="时间范围" data-flex="dir:left">
                    <DatePicker v-model="create_time" type="datetimerange" placeholder="时间范围" style="width: 280px" @on-change="timeChange"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">搜索</Button>
                </FormItem>
            </Form>
        </div>
        <div class="item" v-for="(item, key) in data" :key="item.position" :id="buildChartId(key)" style="height: 300px"></div>
    </div>
</template>

<script>
    import {getPoundRoundData} from "@/api/pound";
    import echarts from 'echarts'
    import _ from 'lodash'
    import {handleTime} from "@/libs/util";
    import dayjs from 'dayjs'
    export default {
        props: [],
        components: {},
        data() {
            return {
                searchForm: {
                    create_time: '',
                },
                data: {},
                domBox: {},
                create_time: '',
            };
        },
        created() {

        },
        mounted() {
            this.resizeReset()
            this.setDefaultTime()
        },
        computed: {},
        watch: {},
        methods: {
            timeChange(val) {
                this.searchForm.create_time = handleTime(val)
            },
            setDefaultTime() {
                let time = `${dayjs().startOf('day').format('YYYY-MM-DD HH:ss:mm')} - ${dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')}`
                this.create_time = time
                this.searchForm.create_time = time
                this.search()
            },
            search() {
                this.getPoundRound()
            },
            resizeReset() {
                this.$eventHub.$on('resize', () => {
                    _.forEach(this.domBox, item => {
                        item.resize()
                    })
                })
            },
            async getData() {
                this.getPoundRound()
            },
            async getPoundRound() {
                let res = await getPoundRoundData(this.searchForm)
                if (res.status) {
                    this.data = res.data
                    this.$nextTick(() => {
                        _.forEach(this.data, (item, key) => {
                            this.renderChart(item, key)
                        })
                    })
                } else {
                    this.$Message.error(res.info)
                }
            },
            buildChartId(tag) {
                return `chart${tag}`
            },
            renderChart(data, key) {
                this.domBox[key] = echarts.init(document.getElementById(this.buildChartId(key)))
                let time = [], itemData = []
                let title = data[0].position_name
                _.forEach(data, item => {
                    time.push(item.timestamp)
                    itemData.push(item.weight)
                })
                let option = {
                    title: {
                        text: title,
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    dataZoom: [{
                        type: 'inside'
                    }],
                    xAxis: {
                        type: 'category',
                        data: time
                    },
                    yAxis: {
                        type: 'value',
                        name : '吨',
                    },
                    series: [{
                        data: itemData,
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#515a6e'
                            }
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#515a6e'
                            }, {
                                offset: 1,
                                color: '#ffe'
                            }])
                        },
                    }]
                }
                this.domBox[key].setOption(option)
            },
        },
        destroyed() {
            this.$eventHub.$off('resize')
        }
    };
</script>
