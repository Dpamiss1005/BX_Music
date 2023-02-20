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
        //视频列表中视频的url
        videoUrlList:[]
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
        let videoUrlList=[]
        for(var i=0;i<videoList.length;i++){
            let videoUrlData=await request('/video/url',{id:videoList[i].data.vid})
            videoList[i].urlInfo=videoUrlData.urls[0].url
        }
        // console.log(videoUrlList);
        this.setData({
            videoList
        })

    },

    // 获取视频url
    // async getVideoUrl(videoUrlId){
    //     let videoUrlData=await request('/video/url',{id:videoList[i].datas.data.vid})
    //     return videoUrlData.urls.url
    // },

    // 点击切换导航的回调
    changeNav(event){
        let navId=event.currentTarget.id;//替换id向event对象传参 如果穿的是number 会自动转换成string
        this.setData({
            // navId:navId>>>0 位移0会强制转换为number类型
            navId:navId*1
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})