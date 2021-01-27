<!--  -->
<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="isDialogVisible = true">添加用户</el-button></el-col
        >
      </el-row>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" >
        </el-table-column>
        <el-table-column prop="email" label="邮箱" >
        </el-table-column>
        <el-table-column prop="mobile" label="电话" >
        </el-table-column>
        <el-table-column prop="role_name" label="角色" >
        </el-table-column>
        <el-table-column label="状态" >
          <!-- 定义了作用域插槽 ,通过scope.row拿到了这一行的数据-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
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
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
         background
      >
      </el-pagination>
    </el-card>
     <el-dialog
      title="添加用户"
      :visible.sync="isDialogVisible"
      width="50%" @close="addUserDialogClosed">
       <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules" label-width="0">
          <!-- prop进行验证 -->
          <!-- 用户名 -->
          <el-form-item prop="username" label="用户名" label-width="70px">
              <el-input  v-model="addUserForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" label="密码" label-width="70px">
              <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" label-width="70px">
              <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机" label-width="70px">
              <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
       <el-form  ref="editFormRef" :model="editForm" :rules="addUserFormRules" label-width="0">
          <!-- 用户名 -->
          <el-form-item prop="username" label="用户名" label-width="70px">
              <el-input  v-model="editForm.username" disabled ></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" label-width="70px">
              <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机" label-width="70px">
              <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%" @close="setRoleDialogClosed">
         <div>
            <p>当前用户：{{userInfo.username}}</p>
            <p>当前角色：{{userInfo.role_name}}</p>
            <p>分配新角色：
                <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                  >
                </el-option>
              </el-select>
            </p>
         </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入的其他文件 例如：import moduleName from 'modulePath';

export default {
  data() {

    //验证邮箱
    var checkEmail = (rule,value,callback)=>{
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if(regEmail.test(value)) return callback();
      return callback(new Error('请输入合法的邮箱'));
    }
    //验证手机号
   var checkMobile = (rule,value,callback)=>{
       const regMobile = /^[1]([3-9])[0-9]{9}$/;
      if(regMobile.test(value)) return callback();
      return callback(new Error('请输入合法的手机号'));
    }
    return {
      //接口的参数信息
      queryInfo: {
        //查询关键词
        query: "",
        //当前页码
        pagenum: 1,
        //几条数据
        pagesize: 2,
      },
      //用户列表
      userList: [],
      total: 0,
      //角色列表
      roleList:[],
      userInfo:{},
      //对话框显示隐藏
      isDialogVisible:false,
      editDialogVisible:false,
      setRoleDialogVisible:false,
      //添加用户的数据
      addUserForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      editForm:{
        id:'',
        username:'',
        email:'',
        mobile:'',
      },
      //添加用户的校验规则
      addUserFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'长度在3~10个字符之间',trigger:'blur'}
        ],
         password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:15,message:'长度在6~15 个字符之间',trigger:'blur'}
        ],
         email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ],
         mobile:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ],
      },
      //已选中的角色id值
      selectedRoleId:''
    };
  },

  //方法集合
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //监听页码改变事件
    handleSizeChange(newSize) {
        this.queryInfo.pagesize  = newSize;
        this.getUserList();
    },
    //监听当前页改变事件
    handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getUserList();
    },
    //监听switch开关改变事件
    async userStateChanged(userInfo){
        const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
        if(res.meta.status !== 200){
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error("更新用户状态失败！");
        }
        return this.$message.success("更新用户状态成功！")
    },
    //监听添加用户对话框的关闭事件
    addUserDialogClosed(){
      this.$refs.addUserFormRef.resetFields();
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    setRoleDialogClosed(){
      this.userInfo = {},
      this.selectedRoleId = ''
    },
    //点击按钮 添加新用户
    //预验证
    addUser(){
      this.$refs.addUserFormRef.validate(async valid=>{
        if(!valid) return
        //可以发起添加用户的请求
        const {data:res} = await this.$http.post('users',this.addUserForm)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.isDialogVisible = false
        this.getUserList()
      })  
    },
     //点击按钮 修改用户
    //预验证
    editUser(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        //可以发起请求
        const {data:res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        //console.log(res)
        if(res.meta.status !== 200) return this.$message.error('修改用户失败！')
        this.$message.success('修改用户成功！')
        this.editDialogVisible = false
        this.getUserList()
      })  
    },
    //修改用户对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      //console.log(res.data)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //删除用户
    removeUserById(id){
      this.$confirm('永久删除该用户，是否继续？', '删除用户', {
         confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status !== 200) return this.$message.error('删除用户失败！')
        this.$message.success('删除用户成功！')
        this.getUserList()
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
    //分配角色对话框
    async showSetRoleDialog(userInfo){
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.roleList = res.data
      console.log(this.roleList)
    },
    //分配角色
    async allotRole(){
      if(!this.setRoleDialogVisible) return this.$message.error('请选择要分配的角色！')
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    }
  },
  
  //创建完成 访问当前this实例
  created() {
    this.getUserList();
  },
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>