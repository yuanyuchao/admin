<template>
    <div style="display: flex;flex-direction: row">
        <Card style="padding: 30px;width: 800px">
            <div v-for="(item,index) in data" style='height: 50px;'>
                <Input v-if="item.type==1||item.type==4" v-model="form[item.name]" style="width: 180px;margin-right: 20px" :placeholder='item.title' :value="item.value"/>
                <RadioGroup  v-for="(items,index) in item.area_value" :key="index" v-else v-model="form[item.name]" style="width: 100px" @on-change="radioChange(item)">
                    <Radio  :label="index">
                        <span>{{items}}</span>
                    </Radio>
                </RadioGroup>
                <span style="width: 300px">{{item.title}}</span>
                <Button type="primary" v-show="item.type==1||item.type==4" class="btn" @click="btnAddress(item)">提交</Button>
            </div>
        </Card>
        <div v-show="this.form.position!=-1" style="display: flex;flex-direction: column">
            <div class="searchMap">
                <div id="r-result">请输入:<input type="text" id="suggestId" size="20" style="width:200px;" /></div>
                <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
            </div>
            <div id="map"></div>
        </div>
    </div>
</template>

<script>
    import {deploy_update,deploy_list} from '@/api/deploy'
    export default {
        name: "Factory",
        data(){
            return{
                data:[],
                form: {
                    position:-1
                },
                address:''
            }
        },
        created(){
        },
        mounted() {
            this.deploy_list()
        },
        methods:{

            baiduMap(){
                // 百度地图API功能
                if (this.form.position == -1){
                   return
                }

                var loc = this.form.position.split(',')
                var map = new BMap.Map("map");
                let point  = new BMap.Point(loc[0], loc[1])
                map.centerAndZoom(point,19);
                // //单击获取点击的经纬度
                var marker = new BMap.Marker(point);        // 创建标注
                map.addOverlay(marker);
                map.addEventListener("click",(e)=>{
                    this.form['position'] = e.point.lng + "," + e.point.lat
                    this.baiduMap()
                });
                map.enableScrollWheelZoom(true);

               function G(id) {
                    return document.getElementById(id);
                }
                var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                    {"input" : "suggestId"
                        ,"location" : map
                    });

                ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                    var str = "";
                    var _value = e.fromitem.value;
                    var value = "";
                    if (e.fromitem.index > -1) {
                        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    }
                    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                    value = "";
                    if (e.toitem.index > -1) {
                        _value = e.toitem.value;
                        value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    }
                    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                    G("searchResultPanel").innerHTML = str;
                });

                var myValue;
                ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                    var _value = e.item.value;
                    myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

                    setPlace();
                });

                function setPlace(){
                    map.clearOverlays();    //清除地图上所有覆盖物
                    function myFun(){
                        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                        map.centerAndZoom(pp, 18);
                        map.addOverlay(new BMap.Marker(pp));    //添加标注
                    }
                    var local = new BMap.LocalSearch(map, { //智能搜索
                        onSearchComplete: myFun
                    });
                    local.search(myValue);
                }
            },
            async deploy_list(){
              let res = await deploy_list()
                if (res.status){
                    this.data = res.data
                    this.data.map(item => {
                        this.$set(this.form, item.name, item.value.toString())
                    })
                    this.baiduMap()
                }
            },
            async deploy_update(data){
              let res = await deploy_update(data)
                if (res.status){
                    this.$Message.success('配置成功')
                }else {
                    this.$Message.success(res,info)
                }
            },
            radioChange (item){
                this.deploy_update({name:item.name,set_value:this.form[item.name]})
            },
            btnAddress(item){
                this.deploy_update({name:item.name,set_value:this.form[item.name]})
            }
        }
    }
</script>

<style scoped>
.btn{
    margin-left: 50px;

}
#map{
    width: 1000px;height: 600px;overflow: hidden;margin:0;font-family:"微软雅黑";
}
.searchMap{
    position: fixed;
    top: 130px;
    z-index: 999;
}
</style>
