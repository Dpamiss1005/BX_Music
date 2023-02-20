// pages/index/index.js
import request from '../../utils/request';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList:[],//轮播图数据
        recommendList:[],//推荐歌单数据
        topList:[],//排行榜数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let bannerListData=await request('/banner',{type:2});
        // console.log('结果数据',result);
        this.setData({
            bannerList:bannerListData.banners
        })

        // 获取推荐歌单数据
        let recommendListData=await request('/personalized',{limit:10});
        this.setData({
            recommendList:recommendListData.result
        })

        // 获取排行榜数据
        // 查询排行榜单接口为 /toplist ，然后根据查询到的 list.id 查询详情歌单 /playlist/detail?id=xxx
        let allTopListData = await request('/toplist')
        let topList = allTopListData.list.slice(0, 4)
        let topListDetail = []
        for (let item of topList) {
            let detailList = await request(`/playlist/detail?id=${item.id}`, { limit: 10 })
            // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
            topListDetail.push({name: detailList.playlist.name, tracks: detailList.playlist.tracks.slice(0, 3)})
            // 不需要等待五次请求全部结束才更新 用户体验较好 但渲染次数会多一些
            this.setData({
            topList: topListDetail
            })
        }
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