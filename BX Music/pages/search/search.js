// pages/search/search.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // placehoulder的默认内容
        placeholderContent: '',
        // 热搜榜数据
        hotList: [],
        // 用户输入的表单项数据
        searchContent: '',
        // 关键字模糊匹配的数据
        searchList: [],
        // 搜索历史记录
        historyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取初始化数据
        this.getInitData()

        // 获取历史记录
        this.getSearchHistory();
    },

    // 获取初始化数据
    async getInitData() {
        let placeholderData = await request('/search/default');
        let hotListData = await request('/search/hot/detail')
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: hotListData.data
        })
    },

    // 获取本地历史记录
    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory')
        if (historyList) {
            this.setData({
                historyList
            })
        }
    },

    // 表单项内容发生改变的回调
    handleInputChange(event) {
        // 更新状态数据
        this.setData({
            searchContent: event.detail.value.trim()
        })
        // if (this.isSend) {
        //     return
        // }
        // this.isSend = true
        // this.getSearchList()
        // 函数节流
        clearTimeout(this.isSend)
        this.isSend = setTimeout(() => {
            this.getSearchList()
        }, 300)

    },

    // 获取搜索数据的功能函数
    async getSearchList() {
        if (!this.data.searchContent) {
            this.setData({
                searchList: []
            })
            return
        }

        let {
            searchContent,
            historyList
        } = this.data;
        // 发请求获取关键字模糊匹配数据
        let searchListData = await request('/cloudsearch', {
            keywords: searchContent,
            limit: 10
        })
        this.setData({
            searchList: searchListData.result.songs
        })

        // 将搜索关键字添加到搜索历史记录中
        if (historyList.indexOf(searchContent) !== -1) {
            // 说明内容已经存在
            historyList.splice(historyList.indexOf(searchContent), 1)
        }
        historyList.unshift(searchContent)

        this.setData({
            historyList
        })

        wx.setStorageSync('searchHistory', historyList)

    },

    // 清空搜索内容
    clearSearchContent() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },

    // 删除搜索历史记录
    deleteSearchHistory() {
        wx.showModal({
            content: '确认清空记录吗？',
            success: (res) => {
                if (res.confirm) {
                    // 清空data中historyList
                    this.setData({
                        historyList: []
                    })
                    // 移除本地的历史记录缓存
                    wx.removeStorageSync('searchHistory')
                }
            }
        })
    },

    //点击热搜榜进行搜索
    searchHotSong(event) {
        this.setData({
            searchContent: event.currentTarget.dataset.hotwords
        })

        //发请求获取搜索匹配到的数据
        this.getSearchList();
    },
    //点击历史记录进行搜索
    searchHistory(event) {
        this.setData({
            searchContent: event.currentTarget.dataset.historyword
        })

        this.getSearchList();
    },

    //跳转到歌曲详情页面
    toSongDetail(event) {
        // console.log(event.currentTarget);
        wx.navigateTo({
            url: '/pages/songDetail/songDetail?ids=' + event.currentTarget.id
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