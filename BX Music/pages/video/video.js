// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 导航的标签数据
        videoGroupList:[],
        // 导航的标识
        navId:'',
        // 视频的列表数据
        videoList:[],
        // 视频的id标识
        videoId:'',
        // 记录video播放的时长
        videoUpdateTime:[],
        // 标识下拉刷新是否被触发
        isTriggered:false,
        // 上拉刷新分页偏移
        pageno:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取导航数据
        this.getVideoGroupListData();
        // 获取视频列表数据
    },

    // 获取导航数据
    async getVideoGroupListData(){
        let videoGroupListData=await request('/video/group/list');
        this.setData({
            videoGroupList:videoGroupListData.data.slice(0,14),
            navId:videoGroupListData.data[0].id
        })
        this.getVideoList(this.data.navId);

    },

    // 获取视频列表数据
    async getVideoList(navId){
        let videoListData=await request('/video/group',{id:navId})
        let index=0;
        let videoList=videoListData.datas.map(item=>{
            item.id=index++;
            return item
        })

        // 获取视频url
        for(var i=0;i<videoList.length;i++){
            let videoUrlData=await request('/video/url',{id:videoList[i].data.vid})
            videoList[i].urlInfo=videoUrlData.urls[0].url
        }

        // 关闭消息提示框
        wx.hideLoading();
        
        this.setData({
            videoList,
            isTriggered:false// 关闭下拉刷新
        })

    },


    // 点击切换导航的回调
    changeNav(event){
        let navId=event.currentTarget.id;//替换id向event对象传参 如果穿的是number 会自动转换成string
        this.setData({
            // navId:navId>>>0 位移0会强制转换为number类型
            navId:navId*1,
            //清空当前数据
            videoList:[],
            pageno:1
        })
        //显示正在加载
        wx.showLoading({
            title:'正在加载'
        })
        // 动态获取当前导航对应的视频数据
        this.getVideoList(this.data.navId);
    },

    // 点击播放/继续播放的回调
    handlePlay(event){
        // 问题：解决多个视频可以同时播放的问题
        //需求：
        // 1.点击播放的诗句中需要找到上一个播放的视频
        // 2.在播放新的视频之前关闭上一个正在播放的视频 
        // 关键：
        // 1.如何找到上一个视频的实例对象
        // 2.如何确认点击播放的视频和正在播放的视频不是同一个视频
        // 单例模式：
        // 1.需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
        // 2.节省内存

        let vid=event.currentTarget.id;
        //更新data中videoId的状态数据
        this.setData({
            videoId:vid
        })
        //关闭上一个播放的视频
        // this.vid!==id && this.videoContext && this.videoContext.stop();
        // this.vid=vid;

    
        // 创建video标签的实例对象
        this.videoContext=wx.createVideoContext(vid);

        // 判断当前的视频之前是否播放过，是否有播放记录，若有，跳转至指定的播放位置
        let {videoUpdateTime}=this.data;
        let videoItem=videoUpdateTime.find(item=>item.vid===vid)
        if(videoItem){
            this.videoContext.seek(videoItem.currentTime);
        }

    },

    // 监听视频播放进度的回调
    handleTimeUpdate(event){
        // console.log(event);
        let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime};
        let {videoUpdateTime}=this.data;
        /*
        *思路整理：判断记录时长的videoUpdateTime数组中是否有当前视频的播放记录
        *1.如果有，在原有的播放记录中修改播放时间为当前播放时间
        *2.如果没有，需要在数组中添加当前视频的播放对象
        * */
       let videoItem=videoUpdateTime.find(item=>item.vid===videoTimeObj.vid);
       if(videoItem){
           //之前有
           videoItem.currentTime=event.detail.currentTime;
       }else{
           //之前没有
           videoUpdateTime.push(videoTimeObj);
       }
    //    更新videoUpdateTime的状态
       this.setData({
        videoUpdateTime
       })
    },

    // 视频播放结束调用
    handleEnded(event){
        // console.log('end');
        // 移除记录播放时长数组中当前视频对象
        let {videoUpdateTime}=this.data;
        // 数组中元素下标
        let index=videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id)
        videoUpdateTime.splice(index,1)
        this.setData({
            videoUpdateTime
        })
    },

    // 自定义下拉刷新的回调 scroll-view
    async handlerRefresher(){
        // console.log('xia');
        // 再次发请求 获取最新的视频列表数据
        let pageno=this.data.pageno;
        pageno++;
        let result=await request('/video/group',{id:this.data.navId,offset:this.data.pageno});
        let videoList=this.data.videoList;
        videoList.unshift(...result.datas)
        for(var i=0;i<videoList.length;i++){
            let videoUrlData=await request('/video/url',{id:videoList[i].data.vid})
            videoList[i].urlInfo=videoUrlData.urls[0].url
        }
        this.setData({
            pageno,
            videoList,
            isTriggered:false
        })
    },

    // 自定义上拉触底的回调
    async handleToLower(){
        // console.log(123);
        // 数据分页：后端分页 前端分页
        let pageno=this.data.pageno;
        pageno++;
        let result=await request('/video/group',{id:this.data.navId,offset:this.data.pageno});
        let videoList=this.data.videoList;
        videoList.push(...result.datas)
        for(var i=0;i<videoList.length;i++){
            let videoUrlData=await request('/video/url',{id:videoList[i].data.vid})
            videoList[i].urlInfo=videoUrlData.urls[0].url
        }
        this.setData({
            pageno,
            videoList
        })
    },

    // 跳转至搜索界面
    toSearch(){
        wx.navigateTo({
          url: '/pages/search/search',
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.handlerRefresher()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage:function({from}){
            if(from === 'button'){
                return {
                     title:'来自Dpamiss转发',
                     path:'/pages/video/video',
                     imageUrl:'/static/images/video.png'
                }  
            }else{
            return {
                title:'来自menu转发',
                path:'/pages/video/video',
                imageUrl:'/static/images/video.png'
           }  
        }
        }
    
})