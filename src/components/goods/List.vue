<!--  -->
<template>
<div class=''>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="goAddpage">添加商品</el-button></el-col
        >
      </el-row>
       <el-table :data="goodlist" border style="width: 100%">
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" >
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"  width="180">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间"  width="180">
          <template slot-scope="scope">
            <div>
              {{scope.row.add_time | dateFormat}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
         background
      >
      </el-pagination>
    </el-card>
</div>
</template>

<script>

// 导入的其他文件 例如：import moduleName from 'modulePath';

export default {


data() {
  return {
      queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10,
      },
      goodlist:[],
      total:0
  };
},

//方法集合
methods: {
    async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        if(res.meta.status !== 200 ) return this.$message.error('获取商品列表失败！')
        this.goodlist = res.data.goods
        this.total = res.data.total
        // console.log(this.goodlist)
    },
    //监听页码改变事件
    handleSizeChange(newSize) {
        this.queryInfo.pagesize  = newSize;
        this.getGoodsList();
    },
    //监听当前页改变事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();

    },
    //删除商品
    removeUserById(id){
      this.$confirm('永久删除该商品，是否继续？', '删除商品', {
         confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.delete('goods/'+id)
        if(res.meta.status !== 200) return this.$message.error('删除商品失败！')
        this.$message.success('删除商品成功！')
        this.getGoodsList()
        this.$message({
            type: 'success',
            message: '删除成功!'
          });
      }).catch(() => {
         this.$message({
            type: 'info',
            message: '已取消删除'
            })
      });
    },
    //通过编程式导航跳转页面
    goAddpage(){
      this.$router.push('/goods/add')
    }
},
created(){
    this.getGoodsList()
}
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

</style>