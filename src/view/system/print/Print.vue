<template>
    <div id="printer-index">
        <Tabs v-model="tabValue">
            <TabPane label="打印三联票设置"  name="printer-setting" icon="ios-list"></TabPane>
            <TabPane label="POS小票设置" name="pos-printer" icon="ios-list"></TabPane>
            <TabPane label="对账单设置" name="rec-printer" icon="ios-list"></TabPane>
            <TabPane label="打印收据设置" name="receipt-printer" icon="ios-list"></TabPane>
            <TabPane label="装车单设置" name="truck-loading" icon="ios-list"></TabPane>
            <TabPane label="进料过磅单" name="feed-printer" icon="ios-list"></TabPane>
        </Tabs>
        <printer-setting :class="[this.tabValue == 'printer-setting'?'display':'undisplay']"/>
        <pos-printer :class="[this.tabValue == 'pos-printer'?'display':'undisplay']"/>
        <rec-printer :class="[this.tabValue == 'rec-printer'?'display':'undisplay']" />
        <receipt-printer :class="[this.tabValue == 'receipt-printer'?'display':'undisplay']"/>
        <truck-loading :class="[this.tabValue == 'truck-loading'?'display':'undisplay']"/>
        <FeedPrinter :class="[this.tabValue == 'feed-printer'?'display':'undisplay']"/>
    </div>
</template>

<script>
    import PrinterSetting from './PrinterSetting'
    import PosPrinter from './PosPrinter'
    import ReceiptPrinter from './ReceiptPrinter'
    import TruckLoading from './truckLoading'
    import RecPrinter from './RecPrinter'
    import FeedPrinter from './FeedPrinter'
    export default {
        components: {
            PrinterSetting,
            PosPrinter,
            ReceiptPrinter,
            TruckLoading,
            RecPrinter,
            FeedPrinter,
        },
        data(){
            return {
                tabValue:'printer-setting'
            }
        },
        // mounted(){
        //     this.$router.replace({name:this.tabValue});
        // },
        watch:{
            tabValue(value){
                this.tabValue = value
            }
        }

    }
</script>

<style>
    .display{
       display: block;
    }
    .undisplay{
        display: none;
    }
</style>
