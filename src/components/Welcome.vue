<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div slot="header">
            <span>欢迎页面</span>
        </div>
         <el-alert
            title="欢迎进入拾光阁信息科技有限公司后台管理系统！"
            type="success" show-icon  center >
        </el-alert>
    </el-card>
    
    </div>
</template>
<script>
export default {
    data(){
        return{
           username:'', 
        }
    },
    methods:{
        open1() {    
        const h = this.$createElement;
        this.$notify({
          title: this.username,
          message: h('b', { style: 'color: #F56C6C'}, '欢迎进入拾光阁信息科技有限公司后台管理系统！')
        });
      },
    },
    created(){
        
        this.username = window.sessionStorage.getItem('roleName')
        this.open1();
        // console.log(this.username)
    }
}
</script>
<style lang="">
    
</style>