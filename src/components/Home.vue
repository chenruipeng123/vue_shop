<!--  -->
<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/sgg.png" alt="logo" width="50px" />
        <span class="header_title">拾光阁信息科技有限公司后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-btn" @click="toggle">|||</div>
        <transition name="el-zoom-in-top">
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="RGB(55,61,65)"
            text-color="#fff"
            active-text-color="#409eff" unique-opened :collapse="isCollapse"
            :collapse-transition="false" router>
          <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单的模板区 -->
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" 
                 @click="saveNavState('/'+subItem.path)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
            </transition>     
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList:[],
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-question',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-data'
      },
      isCollapse:false,
      activePath:'',
    };
  },
  //方法集合
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有菜单
    //通过async和awit把获取的promise进行简化
    async getMenuList(){
      //对获取的data进行解构赋值 并重命名为res
      const {data:res} = await this.$http.get('menus');
      if(res.meta.status !== 200) return this.$message.error(res.meta.message);
      this.menuList = res.data;
      //console.log(res)
    },
    toggle(){
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = activePath;
    }
  },
    //创建时的钩子函数
  created(){
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类

.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header_title {
    font-size: 20px;
    color: #fff;
    margin-left: 15px;
  }
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 40px;
    height: 40px;
  }
}
.el-aside {
  background-color: #373d41;
  .toggle-btn{
    line-height: 26px;
    background-color: rgb(204,204,204);
    color: #fff;
    letter-spacing: 0.3em;
    text-align: center;
    cursor: pointer;
    font-size: 10px;
  }
  .el-menu{
    border-right-width:0;
  }
}
.el-header {
  background-color: #373d41;
}
.el-main {
  background-color: #eee;
}
</style>