import Router from 'vue-router'




import Vue from 'vue'

// 引入组件
import loginpage from './components/loginpage.vue'
import hellopage from './components/HelloWorld.vue'
Vue.use(Router)

const routes=[
		{
		name:'loginpage',
		path:'/', //默认为首页
		component:loginpage,
		
		},
		{
		name:'hellopage',
		path:'/hellopage/:id', //路由传参，通过地址栏方式，确保跳转到的页面刷新后数据不会丢失
		component:hellopage,
		props:true  //允许通过props接收参数
		}
		
	]
	

const router=new Router({
	routes
})

router.beforeEach((to,from,next)=>{            //路由导航
	const isLogin=localStorage.getItem('token');//储存token，第二次打开登录页直接跳转到首页
	
	if(to.path!=='/' && isLogin==null) {
		next({path:'/'});
		}
		else next();
})

export default router
