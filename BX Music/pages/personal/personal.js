// pages/personal/personal.js
let startY=0;//手指起始坐标
let moveY=0;//手指移动坐标
let moveDistance=0;//手指移动距离
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:'translateY(0)',
        coverTransition:'',
        // 用户信息
        userInfo:{},
        // 用户的播放记录
        recentPlayList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 读取用户的基本信息
        let userInfo=wx.getStorageSync('userInfo');
        if(userInfo){
            // 更新userinfo的状态
            this.setData({
                userInfo:JSON.parse(userInfo)
            })

            // 获取用户播放记录
            this.getUserRecentPlayList(this.data.userInfo.account.id)
        }

    },
    // 获取用户播放记录的功能函数
    async getUserRecentPlayList(userId){
        let recentPlayListData=await request('/user/record',{uid:userId,type:1})
        let index=0;
        let recentPlayList=recentPlayListData.weekData.splice(0,10).map(item=>{
            item.id=index++
            return item
        })
        this.setData({
            recentPlayList
        })
    },

    handleTouchStart(event){
        this.setData({
            coverTransition:''
        })
        // 获取手指的起始坐标
        startY=event.touches[0].clientY;
    },
    handleTouchMove(event){
        moveY=event.touches[0].clientY;
        moveDistance=moveY-startY;
        // 动态更新coverTransform的状态值
        if(moveDistance<=0){
            return
        }
        if(moveDistance>=80){
            moveDistance=80;
        }
        this.setData({
            coverTransform:`translateY(${moveDistance}rpx)`
        })

    },
    handleTouchEnd(){
        this.setData({
            coverTransform:'translateY(0rpx)',
            coverTransition:'transform 1s linear'
        })
    },

    // 跳转至登录login界面的回调
    toLogin(){
        wx.navigateTo({
          url: '/pages/login/login',
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