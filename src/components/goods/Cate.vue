<template lang="">
    <div>
         <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card shadow="always" :body-style="{ padding: '20px' }">
            <el-row :gutter="20">
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">
                        添加分类
                    </el-button>
                </el-col>

                <!-- 表格 -->
                <el-table
                    :data="cateList"
                    style="width: 100%;"
                    row-key="cat_id"
                    border
                    stripe
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column width="50px">
                    </el-table-column>
                    
                    <el-table-column
                    prop="cat_name"
                    label="分类名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                    label="是否有效"
                    align="center">
                    <template slot-scope="scope">
                        <div>
                            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                            <i class="el-icon-error" v-else style="color:red"></i>
                        </div>
                    </template>
                    </el-table-column>
                     <el-table-column
                    label="排序"
                    align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-tag type="primary" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                            <el-tag type="warning" size="mini" v-else>三级</el-tag>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center">
                    <template>
                        <div>
                            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background
                >
                </el-pagination>
            </el-row>
            <!-- card body -->
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @closed="setAddCateDialogClosed">
        <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateRules" label-width="80px" :inline="false" size="normal">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>

             <el-form-item label="父级分类">
                 <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged"
                clearable>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5,
            },
            cateList:[],
            total:0,
            addCateDialogVisible:false,
            // 添加分类的表单数据对象
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0,
            },
            addCateRules:{
                cat_name:[
                {required:true,message:'请输入分类名称',trigger:'blur'},
                ]
            },
            // 父级分类列表
            parentCateList:[],
            // 选中的父级分类id数组
            selectedKeys:[],
            // 指定级联选择器的配置对象
            cascaderProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
                checkStrictly:true,
            }
        }
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200) return this.$message.console.error('获取商品分类失败！');
            this.cateList = res.data.result
            this.total = res.data.total
            // console.log(this.cateList)
        },
         //监听页码改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize  = newSize
            this.getCateList();
        },
        //监听当前页改变事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList();
        },
        setAddCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        showAddCateDialog(){
            this.addCateDialogVisible = true
            this.getParentCateList()
        },
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200) return this.$message.console.error('获取父级分类数据失败！');
            this.parentCateList = res.data
        },
        //选择项发生变化触发这个函数
        parentCateChanged(){
            // console.log(this.selectedKeys)
            if(this.selectedKeys.length>0){
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                this.addCateForm.cat_level = this.selectedKeys.length
            }else{
                 this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        addCate(){
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201) return this.$message.error('添加分类失败！')
                this.$message.success('添加分类成功！')
                this.getCateList()
                this.addCateDialogVisible = false
            })
        }
    },
    created(){
        this.getCateList();
        
    }
}
</script>
<style lang="less" scoped>
  .el-table{
      margin-top: 50px;
  }
  .el-cascader{
      width: 100%;
  }
</style>