// pages/detail/detail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoDetail: {},
        // 推荐视频列表
        recommentList: [],
        // 评论列表
        commentData: {}

    },

    // 根据视频id获取视频详情
    getVideoDetail(id) {
        var that = this;
        wx.request({
            url: 'https://www.fastmock.site/mock/0cc8353a68511aad722aa387610a4ce1/bili/videoDetail?id=' + id,
            data: {},
            header: { 'content-type': 'application/json' },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                that.setData({
                    videoDetail: result.data.videoInfo.video
                })
            },
            fail: () => { },
            complete: () => { }
        });
    },
    // 根据视频id获取推荐视频
    getOthersList(id) {
        var that = this;
        wx.request({
            url: 'https://www.fastmock.site/mock/0cc8353a68511aad722aa387610a4ce1/bili/othersList?id=' + id,
            data: {},
            header: { 'content-type': 'application/json' },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                that.setData({
                    recommentList: result.data.data.othersList
                })
            },
            fail: () => { },
            complete: () => { }
        });
    },
    // 根据视频id获取评论列表
    getCommentList(id) {
        var that = this;
        wx.request({
            url: 'https://www.fastmock.site/mock/0cc8353a68511aad722aa387610a4ce1/bili/commentsList?id=' + id,
            data: {},
            header: { 'content-type': 'application/json' },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
                console.log(result);
                that.setData({
                    commentData: result.data.data.commentData
                })
            },
            fail: () => { },
            complete: () => { }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取视频详情
        this.getVideoDetail(options.id);
        // 获取推荐视频
        this.getOthersList(options.id)
        // 根据视频id获取评论列表
        this.getCommentList(options.id);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})