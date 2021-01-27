<!--  -->
<template>
<div class=''>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <el-row :gutter="20">
            <el-col :span="12" :offset="0">
                <el-button type="primary" size="default"  @click="isAddRoleDialogVisible=true">添加角色</el-button>
                
            </el-col>
        </el-row>
        <!-- 角色列表区域 -->
        <el-table :data="roleList" border stripe>
            <!-- 展开列 -->
            <el-table-column
               type="expand">
               <!-- //使用作用域插槽 -->
              <template slot-scope="scope">
                <!-- //渲染一级权限 -->
                <el-row :class="['vcenter','bdbottom',i1===0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id" >
                  <el-col :span="5" :offset="0">
                    <el-tag closable @close="removeRightById(scope.row,item1.id)">
                      {{item1.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- //渲染二级权限 -->
                  <el-col :span="19" :offset="0">
                    <el-row :class="['vcenter',i2===0?'':'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id" >
                      <el-col :span="5" :offset="0">
                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                          {{item2.authName}}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- //渲染三级权限 -->
                      <el-col :span="19" :offset="0">
                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                          {{item3.authName}}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                
              </template>
            </el-table-column>
            
            <!-- 索引列 -->
            <el-table-column
            type="index" label="序号">
            </el-table-column>
            <el-table-column
                prop="roleName"
                label="角色名称">
            </el-table-column>
            <el-table-column
                prop="roleDesc"
                label="角色描述">
            </el-table-column>
            <el-table-column
                label="角色操作" width="220">
                <template slot-scope="scope">
                     <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                   @click="showEditDialog(scope.row.id)"
                    ></el-button>
                    <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                   @click="removeRoleById(scope.row.id)"
                    ></el-button>
                    <el-tooltip
                    class="item"
                    effect="dark"
                    content="分配权限"
                    placement="top"
                    :enterable="false"
                    >
                        <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                             @click="showSetRightDialog(scope.row)"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            
        </el-table>
        
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isAddRoleDialogVisible"
      width="50%" @close="addRoleDialogClosed">
       <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="addRoleFormRules" label-width="0">
          <!-- prop进行验证 -->
          <!-- 角色名 -->
          <el-form-item prop="roleName" label="角色名称" label-width="80px">
              <el-input  v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
           <el-form-item prop="roleDesc" label="角色描述" label-width="80px">
              <el-input  v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
       <el-form  ref="editFormRef" :model="editForm" :rules="addRoleFormRules" label-width="0">
         <el-form-item prop="roleName" label="角色名称" label-width="80px">
              <el-input  v-model="editForm.roleName"></el-input>
          </el-form-item>
           <el-form-item prop="roleDesc" label="角色描述" label-width="80px">
              <el-input  v-model="editForm.roleDesc"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="isSetRightDialogVisible"
      width="50%"
      @closed="setRightDialogClosed">
      <el-tree ref="treeRef" :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
// 导入的其他文件 例如：import moduleName from 'modulePath';

export default {
  //import所引入的组件注册
  components: {},

  data() {
    return {
      //所有角色列表数据
      roleList: [],
      rightList:[],
      isAddRoleDialogVisible:false,
      editDialogVisible:false,
      isSetRightDialogVisible:false,
      addRoleForm:{
        //roleId:'',
        roleName:'',
        roleDesc:'',
      },
      editForm:{
        roleId:'',
        roleName:'',
        roleDesc:'',
      },
      //添加角色的校验规则
      addRoleFormRules:{
        roleName:[
          {required:true,message:'请输入角色名称',trigger:'blur'},
          {min:1,max:10,message:'长度在1~10个字符之间',trigger:'blur'}
        ],
         roleDesc:[
          {required:true,message:'请输入角色描述',trigger:'blur'},
        ]
      },
      treeProps:{
        label:'authName',
        children:'children'
      },
      defKeys:[],
      //当前即将分配权限的roleId
      roleId:''
    };
  },

  //方法集合
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取权角色列表失败！");
      this.roleList = res.data;
    },
     //监听添加角色对话框的关闭事件
    addRoleDialogClosed(){
      this.$refs.addRoleFormRef.resetFields();
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    //点击按钮 添加新角色
    //预验证
    addRole(){
      this.$refs.addRoleFormRef.validate(async valid=>{
        if(!valid) return
        //可以发起添加角色的请求
        const {data:res} = await this.$http.post('roles',this.addRoleForm)
        if(res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.isAddRoleDialogVisible = false
        this.getRoleList()
      })  
    },
     //点击按钮 修改角色
    //预验证
    editRole(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        //可以发起请求
        const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,this.editForm)
        //console.log(res)
        if(res.meta.status !== 200) return this.$message.error('修改角色失败！')
        this.$message.success('修改角色成功！')
        this.editDialogVisible = false
        this.getRoleList()
      })  
    },
    //修改角色对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get('roles/'+id)
      if(res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //删除角色
    removeRoleById(id){
      this.$confirm('永久删除该角色，是否继续？', '删除角色', {
         confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.delete('roles/'+id)
        if(res.meta.status !== 200) return this.$message.error('删除角色失败！')
        this.getRoleList()
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
    //删除权限
    removeRightById(role,rightId){
        this.$confirm('永久删除该权限，是否继续？', '删除权限', {
         confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200 ) return this.$message.error('删除权限失败！')
        this.$message({
            type: 'success',
            message: '删除成功!'
          });
        role.children = res.data
      }).catch(() => {
         this.$message({
            type: 'info',
            message: '已取消删除'
            })
      });
    },
    //分配权限
   async  showSetRightDialog(role1){
     this.roleId = role1.id
     const {data:res} = await this.$http.get('rights/tree')
     if(res.meta.status !== 200) return this.$message.error('获取权限数据失败')
     this.rightList = res.data
    //  console.log(role1)
     this.getDeafKeys(role1,this.defKeys)
     this.isSetRightDialogVisible = true
    },
    //自定义递归函数，获取该角色下所有三级权限
    getDeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getDeafKeys(item,arr))
    },
    //分配权限
    async allotRight(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.isSetRightDialogVisible = false
      this.getRoleList()
    }
  },

  //创建完成 访问当前this实例
  created() {
    this.getRoleList();
  },
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.el-tag{
  margin: 10px;
}
.bdtop{
border-top: 1px solid #eee;
}
.bdbottom{
border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>