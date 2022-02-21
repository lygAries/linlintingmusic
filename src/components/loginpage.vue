<template>
	
	<div class="loginframe">
		<div><span class='noticefont'>通过网易云音乐账号密码登录</span></div>
		<div><input class='phonebox' placeholder="请输入手机号" v-model="phonenumber" /></div>
		<div><input class='passbox' type="password"  placeholder="请输入密码" v-model="passwords" @keyup.enter="login()"></div>
		<!-- <button @click="send()">fsong</button> -->
		<button @click="login()" :disabled="!canSubmit">登录</button>
	</div>
</template>

<script>
	
	import axios from "axios"  // 引入axios，不要加双括号，因为这是vue2项目
	
	export default{
		name:'itema',
		props:[],
		data(){
			return{
			phonenumber:'',
			passwords:"",
			jj:'',
			hh:'',
			dizhi:'',
			id:''
		}
		},
		computed:{
			canSubmit(){
				
				return Boolean(this.phonenumber&&this.passwords)
			}
		},
		methods:{
			
			login(){
				var that=this;
				//请求网易云手机号登录接口,https://lygaries.vercel.app这是我个人的端口号
			axios.get("https://lygaries.vercel.app/login/cellphone?phone="+this.phonenumber+"&password="+this.passwords)
				.then(function(response){
					//console.log(response);
					if(response.data.code==200){ //如果登录成功，返回200代表登录成功
						
					that.id=response.data.account.id;
						
				localStorage.setItem('token',response.data.token);//本地储存token
						
						that.$router.push({
							name:'hellopage',
							params:{
								id:that.id,   //路由传参，通过params方式；传到url防止页面刷新时数据丢失
							}
						})
				}
				else if(response.data.code==400){
					alert("手机号码不符合规范！");
				}
				
				else if(response.data.code==250){
					alert('当前登录失败，请稍后再试！');
				}else{
					alert("账号或密码错误！");
				}
				},function(err){
					alert(err);
				})
			},
		
		
	}
	}
</script>

<style>
	.loginframe{
		width: 300px;
		height: 200px;
		background-color: aqua;
		margin: 0 auto;
		text-align: center;
		margin-top: 100px;
	}
	.noticefont{
		color: red;
		font-size: 15px;
		margin-top: 30px;
		
	}
	.phonebox{
		height: 25px;
		width: 200px;
		margin-top: 30px;
	}
	
	.passbox{
		height: 25px;
		width: 200px;
		margin-top: 20px;
	}
	.loginbtn{
		margin-top: 20px;
		background-color: gold;
		color: white;
		border: none;
	}
</style>
