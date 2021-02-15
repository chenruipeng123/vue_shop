<!-- 报表 -->
<template>
<div class=''>
<el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <div id="main" style="width:800px;height:400px"></div>
    </el-card>
</div>
</template>

<script>

// 导入的其他文件 例如：import moduleName from 'modulePath';
import * as echarts from 'echarts';
import _ from 'lodash'
export default {


    data() {
        return {
         //需要合并的数据
        options : {
            title: {
                text: '用户来源'
            },
            tooltip: {},
            legend: {
                data:['数量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '数量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }

        };
    },
    created(){
        
    },
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200 )  return this.$message.error('获取折现图失败！')
        const result = _.merge(res.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },
    //方法集合
    methods: {

    },
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>