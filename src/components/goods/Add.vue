<!--  -->
<template>
<div class=''>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-alert title="添加商品信息" type="info" effect="light" center show-icon :closable="false"></el-alert>
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
          <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="top" label-width="100px">
             <!-- tab栏区域 -->
            <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                    <el-cascader
                    v-model="addForm.goods_cat"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"
                    clearable>
                    </el-cascader>    
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name" v-for="item in myTableData" :key="item.attr_id">
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="item in olTableData" :key="item.attr_id">
                  <el-input v-model="item.attr_vals"></el-input>
                  
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <el-upload
                  class="upload-demo"
                  :action="uploadURL"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :headers="headerObj"
                  :on-success="handleSuccess"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                <el-button type="primary" size="default" @click="add" class="addBtn">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
            <!-- card body -->
        </el-card>
        <el-dialog
          title="图片预览"
          :visible.sync="previewVisible"
          width="50%"
          @close="handleClosed">
          <img :src="previewPath" alt="预览效果图" class="previewImg">
        </el-dialog>
        
</div>
</template>

<script>

// 导入的其他文件 例如：import moduleName from 'modulePath';
import _ from 'lodash'

export default {


data() {
  return {
    activeIndex:'0',
    addForm:{
      goods_name:'',
      goods_price:0,
      goods_weight:0,
      goods_number:0,
      goods_cat:[],
      //需要上传的图片路径数组
      pics:[],
      //内容
      goods_introduce:'',
      attrs:[],
    },
    addFormRules:{
      goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
      goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
      goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
      goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
      goods_cat:[{required:true,message:'请输入商品数量',trigger:'blur'}],
    },
    cateList:[],
    cateProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
    },
    //动态参数列表数据
    myTableData:[],
    olTableData:[],
    //上传图片的路径
    uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
    //为上传图片提供token验证
    headerObj:{
      Authorization:window.sessionStorage.getItem('token')
    },
    //预览
    previewPath:'',
    previewVisible:false
  };
},

//方法集合
methods: {
    async getCateList(){
        const {data:res} = await this.$http.get('categories')
        if(res.meta.status !== 200) return this.$message.console.error('获取商品分类失败！');
        this.cateList = res.data
        // console.log(this.cateList)
    },

    handleChange(){
      // console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName,oldActiveName){
      if(oldActiveName === '0' && this.addForm.goods_cat.length === 0){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // ta页b点击触发的函数
    async tabClicked(){
      if(this,this.activeIndex === '1'){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/`,{params:{sel:'many'}})
            if(res.meta.status !== 200){
                return this.$message.error('获取参数列表失败！')
            }
            res.data.forEach(element => {
              element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.split(',')
            });
            this.myTableData = res.data
            console.log(this.myTableData)
      } else if(this,this.activeIndex === '2'){
        
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/`,{params:{sel:'only'}})
            if(res.meta.status !== 200){
                return this.$message.error('获取属性列表失败！')
            }
            this.olTableData = res.data
      }
    },
    //处理图片预览效果
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.previewVisible = true
      console.log(file)
    },
    //处理移除图片的操作
    handleRemove(file){
      //获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //从pics数组中遍历，找到这个图片的索引值
      const index = this.addForm.pics.findIndex(x => x===filePath)
      //调用splice方法 移除
      this.addForm.pics.splice(index,1)
      // console.log(this.addForm)
    },
    //监听图片上传成功后的操作
    handleSuccess(response){
      const picInfo = {pic:response.data.tmp_path}
      this.addForm.pics.push(picInfo)

    },
    handleClosed(){},
    //添加商品
    add(){
      //预验证
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return this.$message.error('请填写必要的表单项！')
        //执行成功的业务逻辑
        //执行深拷贝
        const form = _.cloneDeep(this.addForm) 
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数
        this.myTableData.forEach(item => {
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.olTableData.forEach(item => {
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        //发起请求
        const {data:res} = await this.$http.post('goods',form)
        if(res.meta.status !== 201 ) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    },
},
created(){
  this.getCateList()
},
computed:{
   cateId(){
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2]
            }
            return null
        },
}
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.el-checkbox{
  margin: 0 10px 0 0  !important;
}
.previewImg{
  width: 100%;
}
.addBtn{
  margin-top: 15px;
}
</style>