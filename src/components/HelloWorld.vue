<template>
  <div class="wholeframe">
	
	<!-- 顶端 -->
   <div class='top'>
	<span class="lltfont">林林听</span>
	<img class='touxiang' :src='touxiang'>
	<span class='nicknameclass'>{{nickname}}</span>
	<input class="searchbox" v-model="searchcontent" @keyup.enter='search()'/>
	<button class='searchbtn' @click="search()">搜索</button>
   </div>
   
   <!-- 中间身体 -->
<div class='body'>
	<div class="list">
    <ul class='listul'>
	<li class='listli' v-for='(item,index) in songlist' v-bind:key='index' @click="play(index)" >
		<span class='songname'>{{item.name}}</span> <span class='songername'>{{item.artists[0].name}}</span>
	</li>
	
		</ul>
	</div>
	
	<!-- 正中间包括专辑封面 -->
	<div class='middle'>
	<div class="midlsongname">{{songname}}</div>
	<div class="artistsname">{{artistsname}}</div>
	<div class='nono'>
	<img class="imgh" @click="stopplay()" :class={running:isoning} :src="artimg">
	</div>
	</div>
	<!-- 左边评论区 -->
	<div class='comlist'>
		<span class="hotcomment">热门评论</span>
		<hr class="comline">
		<dl class="commentdl" v-for="(commentshow,index) in comment" :key="index">
		<dt class="commentdt">
	<img :src="commentshow.user.avatarUrl" class="commentimg" alt=" ">
		</dt>
		<dd class="commentdd1">{{commentshow.user.nickname}}</dd>
		<dd class="commentdd2">{{commentshow.content}}</dd>
		</dl>
	</div>
</div>

<!-- 低端 -->
   <div class='bottom'>
	<div class="btnbg" @click="nextsong"><div class="nextbtn"></div></div>
	<audio :src="songurl" @ended="nextsong()" ref="audioplay" controls="controls" autoplay="autoplay" class="audiobox"></audio>
   </div>
  </div>
</template>

<script>
	
	// import Vue from "vue"
	import axios from "axios"
	
export default {
  name: 'oWorld',
  props:['id'],   //通过props接收loginpage的页面切换是的路由传参
  data(){
	return{
		songlist:[],
		songerlist:[],
		idlist:[],
		searchcontent:'',
		songurl:'',
		artistsname:'',
		songname:'',
		isplaying:false,//动画是否播放，
		comment:[],
		artimg:'http://p4.music.126.net/tt8xwK-ASC2iqXNUXYKoDQ==/109951163606377163.jpg',
		touxiang:'',
		nickname:'',
		isoning:false,
	}  
  },
  
 mounted(){       //vue的生命周期函数，mounted为挂载后
	
	var that=this;
	axios.get('https://lygaries.vercel.app/user/detail?uid='+this.id)//获取用户信息端口
	.then(function(response){
		//console.log(response);
		that.touxiang=response.data.profile.avatarUrl;
		that.nickname=response.data.profile.nickname;    //获取昵称
	})
	
	
	},
  
  directives:{},
  filters:{},
	methods:{
		
		search(){     //搜索功能
			var that=this;
			axios
			.get("https://lygaries.vercel.app/search?keywords="+this.searchcontent)
			.then(function(response){
				//console.log(response);
				that.songlist=response.data.result.songs;
				for(var i=0;i<response.data.result.songs.length;i++){
					that.idlist[i]=response.data.result.songs[i].id;
			}
			//console.log(that.idlist);
			
			},function(err){
				console.log(err);
			})
		},
		play(index){        //点击播放功能
			var that=this;
			this.isoning=true;
			this.indexbig=index;
			this.songurl='https://music.163.com/song/media/outer/url?id='+this.idlist[index]+".mp3";
			
			// 获取歌曲详情
			axios.get("https://lygaries.vercel.app/song/detail?ids="+this.idlist[index])
			.then(function(response){
			//console.log(response);
			that.songname=response.data.songs[0].name;//显示在封面上面的歌曲名字
			that.artistsname=response.data.songs[0].ar[0].name;//显示在封面上面的歌手名字
			that.artimg=response.data.songs[0].al.picUrl;//专辑封面
			})
			
			//热门评论
			axios.get("https://lygaries.vercel.app/comment/music?id="+this.idlist[index])
			.then(function(response){
			//console.log(response);
			that.comment=response.data.hotComments;
			})
		},
		
		//暂停播放
		stopplay(){
			if(this.$refs.audioplay.paused){
			this.$refs.audioplay.play();
			this.isoning=true;
		}else{
			this.$refs.audioplay.pause();
			this.isoning=false;
		}
		},
		//点击下一首播放按钮
		nextsong(){              //下一首
		var that=this;
		this.isoning=true;
		this.indexbig=this.indexbig+1;
		//console.log(this.idlist[this.indexbig]);
	this.songurl="https://music.163.com/song/media/outer/url?id="+this.idlist[this.indexbig]+".mp3";
		axios.get("https://lygaries.vercel.app/song/detail?ids="+this.idlist[this.indexbig])
	.then(function(response){
		//console.log(response);
		that.songname=response.data.songs[0].name;//显示在封面上面的歌曲名字
		that.artistsname=response.data.songs[0].ar[0].name;//显示在封面上面的歌手名字
		that.artimg=response.data.songs[0].al.picUrl;//专辑封面
		})
		
		
		//热门评论
		axios.get("https://lygaries.vercel.app/comment/music?id="+this.idlist[this.indexbig])
		.then(function(response){
		//console.log(response);
		that.comment=response.data.hotComments;
		})
		},
		
		
		
		
		
	}
	
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	/* 整个框架 */
	.wholeframe{
		width: 1000px;
		height: 500px;
		
		margin: 0 auto;
	}
	/* 顶端 */
	.top{
		height: 50px;
		width: 1000px;
		background-color: aqua;
		
	}
	/* 林林听三个字 */
	.lltfont{
		font-size: 25px;
		color: white;
		float: left;
		line-height: 50px;
		margin-left: 20px;
	}
	
	.touxiang{
		width: 30px;
		height: 30px;
		border-radius: 100%;
		margin-left: 20px;
		margin-top: 10px;
		float: left;
	}
	.nicknameclass{
		margin-top: 13px;
		float: left;
		margin-left: 5px;
		font-size: 15px;
		color:black;
	}
	
	/* 搜索框 */
	.searchbox{
	
		margin-top: 12px;
		width: 205px;
		height: 25px;
		border: none;
		outline: none;
		border-radius: 25px;
		position: relative;
		left: 160px;
		
	}
	/* 搜索按钮 */
	.searchbtn{
		border: none;
		background-color: rgb(7, 219, 247);
		margin-top: 15px;
		color: white;
		border-radius: 2px;
		position: relative;
		left: 165px;
		
	}
	/* 中间身体部分 */
	.body{
		height: 407px;
		width:1000px;
		
	}
	
	/* 专辑部分包括上面的字 */
	.middle{
	height: 407px;
	width: 460px;
	float: left;
	
	}
	/* 封面上方歌曲名字显示 */
	.midlsongname{
	height: 15px;
	width: 456px;
	text-align: center;
	margin-top: 5px;
	margin-left: 0px;
	}
	/* 封面上方歌手名字显示 */
	.artistsname{
	height: 15px;
	width: 456px;
	text-align: center;
	margin-top: 8px;
	}
	/* 专辑封面图片 */
	.imgh{
	
	width: 200px;
	height: 200px;
	border-radius: 100%;
	margin-top: 50px;
	
	animation: hh 6s linear infinite paused;
	}
	.nono{
		width: 300px;
		height: 300px;
		text-align: center;
		background-color: gray;
		border-radius: 100%;
		position: relative;
		top: 20px;
		left: 16%;
	}
	/* 歌曲封面旋转 */
	.running{
	animation-play-state:running;
	}
	@keyframes hh{
	0% {
	transform: rotateZ(0deg);
	}
	100% {
	transform: rotateZ(360deg);
	}
	}

	/* 左边音乐列表 */
	.list{
		width: 270px;
		height: 407px;
		
		background-color:cornsilk ;
		float: left;
		overflow: auto;
	}
	.listul{
		height: 407px;
		padding: 0;
		margin: 0;
		list-style: none;
		
	}
	.listli{
		height: 25px;
		border-bottom: 1px solid red;
		cursor: pointer;
	}
	
	/* li标签的歌曲名字 */
	.songname{
		float: left;
		font-size: 10px;
		
	}
	.songername{
		float: right;
		font-size: 10px;
		
	}
	
	
	/* 左边音乐列表滚动条 */
	.list::-webkit-scrollbar{
	display: none;
	}
	
	/* 右边评论区 整体*/
	.comlist{
	width: 270px;
	height: 407px;
	background-color: rgba(25,250,225);
	float: right;
	overflow-y: auto;
	}
	
	
	.commentbox::-webkit-scrollbar{
	display: none;
	}
	
	
	
	/* 左边音乐列表滚动条 */
	.comlist::-webkit-scrollbar{
	display: none;
	}
	
	/* 热门评论四个字 */
	.hotcomment{
	color: red;
	font-size: 15px;
	}
	.comline{
		border: 1px solid red;
		border-bottom: none;
		border-right: none;
		border-left: none;
		position: relative;
		top: -5px;
	}
	.commentdl{
	margin-top: 0px;
	}
	.commentimg{
	width: 30px;
	height: 30px;
	border-radius: 100%;
	}
	/* 评论网友的昵称 */
	.commentdd1{
	color: red;
	font-size: 12px;
	margin-top: -30px;
	}
	.commentdd2{
	font-size: 10px;
	}
	
	/* 底部 */
	.bottom{
	height: 40px;
	width:1000px;
	background-color: aliceblue;
	position: absolute;
	z-index: 2;
	}
	
	.audiobox{
	height: 40px;
	width: 960px;
	background-color: aliceblue;
	float: right;
	}
	
	/* 下一首按钮 */
	.nextbtn{
	height: 0px;
	width: 0px;
	border-right: 3px solid rgb(232, 232, 233);
	border-left: 10px solid rgb(232, 232, 233);
	border-top: 10px solid transparent;
	border-bottom: 10px solid transparent;
	margin: 0 auto;
	margin-top: 4px;
	}
	
	/* 下一首播放的按钮 */
	.btnbg{
	width: 27px;
	height: 27px;
	background-color: rgb(7, 219, 247);
	position: absolute;
	z-index: 2;
	border-radius: 100%;
	margin-top: 7px;
	margin-left:7px;
	}
	.btnbg:hover{
	background-color:rgb(250, 250, 255);
	}
</style>
