<!--  -->
<template>
<div class=''>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
        <el-table :data="rightList" border stripe>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="authName" label="权限名称"></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==='0' ">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
        
    </el-card>
</div>
</template>

<script>

// 导入的其他文件 例如：import moduleName from 'modulePath';

export default {

data() {
  return {
      rightList:[]
  };
},
//方法集合
methods: {
    async getRightList(){
        const {data:res} = await this.$http.get('rights/list')
        if(res.meta.status !==200 ) return this.$message.error('获取权限列表失败！')
        this.rightList = res.data
    }
},
//创建完成 访问当前this实例
created() {
    this.getRightList();
},
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>