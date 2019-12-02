<style lang="less">
    .account {
        .count-style {
            font-size: 40px;
        }
    }

    #reportShow {
        width: 100%;
        height: 650px;
    }
</style>
<style scoped lang="less">
    .status {
        visibility: hidden;
    }
</style>

<template>
    <div class="account">
        <div data-flex="main:justify">
            <Form ref="searchForm" :model="searchForm" class="search-form item-inline-flex" @keydown.enter.native="search">
                <FormItem label="客户名称">
                    <Select v-model="searchForm.customer_id" filterable clearable>
                        <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.customer_name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="料类">
                    <Select v-model="searchForm.stone_id" filterable clearable>
                        <Option v-for="item in stoneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="报表名称">
                    <Select v-model="searchForm.report_type" filterable clearable placeholder="报表类型(必选)">
                        <Option v-for="(item, index) in reportList" :value="item.value" :key="index">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="时间" data-flex="dir:left">
                    <DatePicker v-model="time" type="datetimerange" placeholder="时间范围(必选)" style="width: 280px"
                                @on-change="timeChange"/>
                </FormItem>
                <FormItem label="结算人员">
                    <Select v-model="searchForm.sett_operator" filterable clearable placeholder="结算人员">
                        <Option v-for="(item, index) in adminList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="料类分组">
                    <Select v-model="searchForm.group_id" filterable clearable placeholder="料类分组">
                        <Option v-for="(item, index) in stoneGroupList" :value="item.id" :key="item.id">{{ item.group_name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">查看账单</Button>
                </FormItem>
            </Form>
            <div class="tb-ac-box">
                <Button type="success" class="add-bt" @click="exportCount">下载报表</Button>
                <Button type="primary" class="add-bt" @click="printCount">打印报表</Button>
            </div>
        </div>
        <iframe id="reportShow" v-show="status" name="reportShow">

        </iframe>
    </div>
</template>

<script>
    import {getCustomerNameListWr} from '@/api/customer'
    import {getStoneNameList} from '@/api/stone'
    import dayjs from 'dayjs'
    import _ from 'lodash';
    import {cusPrint, handleTime} from '@/libs/util'
    import {getReportList, getReportShow, getReportDown} from '@/api/report'
    import {getAccountList, getAllAccountList} from "@/api/account";
    import {RETAIL_CUSTOMER} from "@/config/custom";
    import {getStoneGroupListNp} from "@/api/stoneGroup";

    export default {
        props: {},
        components: {},
        data() {
            return {
                customerList: [],
                reportList: '',
                stoneList: '',
                status: false,
                time: '',
                searchForm: {
                    customer_id: '',
                    stone_id: "",
                    settlement_time: '',
                    report_type: '',
                    sett_operator: '',
                    group_id: '',
                },
                adminList: [],
                stoneGroupList: [],
            }
        },
        created() {
            this.getNameList()
            this.getStoneList()
            this.getAdminList()
            this.getStoneGroupList()
        },
        mounted() {

        },
        methods: {
            async getStoneGroupList() {
                let res = await getStoneGroupListNp()
                if (res.status) {
                    this.stoneGroupList = res.data
                }
            },
            async getAdminList() {
                let res = await getAllAccountList()
                if (res.status) {
                    this.adminList = res.data
                }
            },
            timeChange(time) {
                if (time[0]) {
                    this.searchForm.settlement_time = _.join(time, ' - ')
                } else {
                    this.searchForm.settlement_time = ''
                }
            },
            async getNameList() {
                let res = await getCustomerNameListWr()
                if (res.status) {
                    this.customerList = res.data
                }
                let res1 = await getReportList()
                if (res1.status) {
                    this.reportList = res1.data
                }
            },
            async getStoneList() {
                let res = await getStoneNameList()
                if (res.status) {
                    this.stoneList = res.data
                }
            },
            async search() {
                let res = await getReportShow(this.searchForm)
                if (res.status === 0) {
                    this.$Message.error(res.info)
                    return
                }
                this.status = true
                let iframe = document.getElementById('reportShow')
                iframe.srcdoc = res
            },
            async exportCount() {
                let formData = _.assign({}, this.searchForm)
                let res = await getReportDown(formData)
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
            printCount() {
                window.frames["reportShow"].print()
            },
        },
    }
</script>
