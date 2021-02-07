<template lang="">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 提示信息 -->
         <el-alert  type="warning" effect="light" show-icon :closable="false">注意：只允许为第三级分类设置相关参数！</el-alert>
        <!-- 级联选择框 -->
        <el-row class="cat_opt">
            <el-col :offset="0">
                <span>请选择商品分类：</span>
                 <el-cascader
                v-model="selectedKeys"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable>
                </el-cascader>    
            </el-col>
        </el-row>
        <!-- tab页签区域 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many" >
                <el-button type="primary" :disabled="isDisabled" size="mini" @click="addFormVisible=true">添加参数</el-button>
                <el-table :data="manyTableData" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div>
                                <el-tag  closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="handleClosed(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input v-model="scope.row.inputValue" class="input-new-tag" 
                                v-if="scope.row.inputVisible" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!-- 添加按钮 -->
                                <el-button  v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column 
                        prop="attr_name"
                        label="参数名称">
                    </el-table-column>
                    <el-table-column 
                        label="操作">
                        <template slot-scope="scope">
                            <div>
                                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" :disabled="isDisabled" size="mini" @click="addFormVisible=true">添加属性</el-button>
                 <el-table :data="onlyTableData" border stripe>
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <div>
                                <el-tag  closable v-for="(item,i) in scope.row.attr_vals" :key="i" @close="handleClosed(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input v-model="scope.row.inputValue" class="input-new-tag" 
                                v-if="scope.row.inputVisible" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                ></el-input>
                                <!-- 添加按钮 -->
                                <el-button  v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column 
                        prop="attr_name"
                        label="属性名称">
                    </el-table-column>
                    <el-table-column 
                        label="操作">
                        <template slot-scope="scope">
                            <div>
                                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

        </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
        :title="'添加'+ textTitle "
        :visible.sync="addFormVisible"
        width="50%"
        @closed="addFormClosed">
        <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="80px" :inline="false" size="normal">
            <el-form-item :label="textTitle" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="addParams">确定</el-button>
                <el-button @click="addFormVisible=false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
        :title="'修改'+ textTitle "
        :visible.sync="editFormVisible"
        width="50%"
        @closed="editFormClosed">
        <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="80px" :inline="false" size="normal">
            <el-form-item :label="textTitle" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="editParams">确定</el-button>
                <el-button @click="editFormVisible=false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            cateList:[],
            cascaderProps:{
                 expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            selectedKeys:[],
            activeName:'many',
            manyTableData:[],
            onlyTableData:[],
            addFormVisible:false,
            addForm:{
                attr_name:'',
            },
            addFormRules:{
                attr_name:[
                {required:true,message:'请输入参数名称',trigger:'blur'},
                ]
            },
            editFormVisible:false,
            editForm:{
            },
            editFormRules:{
                attr_name:[
                {required:true,message:'请输入参数名称',trigger:'blur'},
                ]
            },
        }
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
            // console.log(res.data)
            this.cateList = res.data
            // console.log(this.cateList)
        },
        //级联选择框发生改变时触发这个函数
         handleChange(){
           this.getParamsData()
        },
        //tab页被点击时 时触发这个函数
        handleTabClick(){
             this.getParamsData()
        },
        async getParamsData(){
             if(this.selectedKeys.length !== 3){
                this.selectedKeys = []
                return
            }
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/`,{params:{sel:this.activeName}})
            if(res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
            // console.log(res)
            res.data.forEach(item => {
                item.inputVisible = false
               item.inputValue = ''
               item.attr_vals =  item.attr_vals?item.attr_vals.split(','):[]
              
            })
            console.log(res.data)
            if(this.activeName === 'many'){
                this.manyTableData = res.data
                // console.log(this.manyTableData)
            }else{
                this.onlyTableData = res.data
                // console.log(this.onlyTableData)
            }
        },
        addFormClosed(){
            this.$refs.addFormRef.resetFields()
        },
         editFormClosed(){
            this.$refs.editFormRef.resetFields()
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid => {
                if(!valid) return
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !== 201) return this.$message.error('添加参数失败！')
                this.$message.success('添加参数成功！')
                this.addFormVisible = false
                this.getParamsData()
            })
        },
        async showEditDialog(attr_id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{attr_sel:this.activeName})
            if(res.meta.status !== 200 ) return this.$message.error('请求失败！')
            this.editForm = res.data
            this.editFormVisible = true 
        },
        editParams(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                const {data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                {
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                })
                // console.log(res)
                if(res.meta.status !== 200 ) return this.$message.error('修改参数失败！') 
                this.$message.success('修改参数成功！')
                this.getParamsData()
                this.editFormVisible = false
            })
        },
        //根据id删除参数 
        //删除角色
        removeParamsById(id){
        this.$confirm('永久删除该参数，是否继续？', '删除参数', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(async () => {
            const {data:res} = await this.$http.delete(`categories/${this,this.cateId}/attributes/${id}`)
            if(res.meta.status !== 200) return this.$message.error('删除参数失败！')
            this.getParamsData()
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
        //控制newtag按钮与文本输入框的显示切换
        showInput(row){
            row.inputVisible = true
            //让文本自动获得焦点
            //$nextTick方法作用：当页面上的元素被重新渲染后 才会指定回调函数中的代码
            this.$nextTick( _=>{
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        //讲attr_vals上传数据库的操作 封装
       async saveAttrVals(row){
            //发起请求 保存至数据库
            const {data:res} = await this.$http
            .put(`categories/${this,this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name:row.attr_name,
                    attr_sel:row.attr_sel,
                    attr_vals:row.attr_vals.join(',')
                }
            )
            if(res.meta.status != 200) return this.$message.error('修改参数项失败！')
            this.$message.success('修改参数项成功！')
        },
        //输入框确定
         handleInputConfirm(row){
            if(row.inputValue.trim().length === 0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            //进行下一步处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
           this.saveAttrVals(row)
        },
        //删除
        handleClosed(i,row){
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row)
        }
    },
    created(){
        this.getCateList();
    },
    computed:{
        //是否禁用按钮
        isDisabled(){
            if(this.selectedKeys.length === 3){
                return false
            }else{
                return true
            }
        },
        //获取cateid
        cateId(){
            if(this.selectedKeys.length === 3){
                return this.selectedKeys[2]
            }
            return null
        },
        //动态计算标题的文本
        textTitle(){
            if(this.activeName === 'many') {return '动态参数'}
            else {return '静态属性'}
        }
    }
}
</script>
<style lang="less" scoped>
    .cat_opt{
        margin:15px 0;
    }
    .el-tag{
        margin: 10px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>