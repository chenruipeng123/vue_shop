<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/sgg.png" alt="">
            </div>
            <!-- 表单 -->
            <!-- :model绑定表单数据 rules绑定表单验证规则 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
                <!-- prop进行验证 -->
                <!-- 用户名 -->
                <el-form-item prop="username" class="login_input">
                    <el-input  v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password" class="login_input">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="login_btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      //表单数据绑定
      loginForm: {
          username:'admin',
          password:'123456'
      },
      //表单规则绑定
      loginFormRules:{
        // 验证用户名是否合法
          username:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 2, max: 8, message: '长度在 2 到 8个字符', trigger: 'blur' }
          ],
          //验证密码是否合法
          password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ]
      }
    }
  },
  methods:{
      //点击重置按钮 重置登录表单
      resetLoginForm(){
          this.$refs.loginFormRef.resetFields();
      },
      login(){
          this.$refs.loginFormRef.validate( async valid =>{
              if(!valid) return;
              //解构赋值 {}
              const {data:res} = await this.$http.post("login",this.loginForm);
            //  console.log(res)
              if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
              this.$message.success('登录成功');
              //将登陆成功的token保存到sessionStorage中
              window.sessionStorage.setItem("token",res.data.token);
              console.log(res)
              var rn;
              if(res.data.rid=== 0){
                  rn = '超级管理员'
              }else{
                  const {data:res1} = await this.$http.get('roles/'+res.data.rid)
                  console.log(res1)
                  rn = res1.data.roleName
              }
              window.sessionStorage.setItem("roleName",rn);
              //通过编程式导航跳转到后台主页
              this.$router.push("/home");
          })
      }
  }
}
</script>

<style lang="less" scoped>
 .login_container{
     background-color:#2b4b6b;
     width: 100%;
     height: 100%;
 }
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        margin: 0 auto;
        transform: translate(0,-50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    .login_btn{
    text-align: center;
    }
    .login_input{
        padding:0 20px;
        }
    }
}
</style>
