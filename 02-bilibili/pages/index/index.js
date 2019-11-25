Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 首页导航数据
        navList: [],
        currentIndex: 0,
        // 轮播图数据
        swiperList: [],
        // 视频列表数据
        videoList: [],
    },
    // 首页导航点击事件
    activeNav(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.index
        })
    },
    /**
     * 获取首页导航数据
     */
    getNavList() {
        // console.log(this);//微信环境
        var that = this;
        // wx.request(object)发起 HTTPS 网络请求
        wx.request({
            url: 'https://www.fastmock.site/mock/0cc8353a68511aad722aa387610a4ce1/bili/navList',
            success(res) {
                if (res.data.code === 0) {
                    // console.log(this);//undefined
                    that.setData({
                        navList: res.data.data.navList
                    })
                }
            },
            fail() {
                console.log('fail')
            }
        })
    },
    /**
     * 获取首页轮播图数据
     */
    getSwiperList() {
        var that = this;
        wx.request({
            url: 'https://www.fastmock.site/mock/0cc8353a68511aad722aa387610a4ce1/bili/swiperList',
            success(res) {
                if (res.data.code === 0) {
                    that.setData({
                        swiperList: res.data.data.swiperList
                    })
                }
            },
            fail() {
                console.log('fail')
            }
        })
    },
    /**
     * 获取视频列表数据
     */
    getVedioList() {
        var that = this;
        wx.request({
            url: 'https://www.fastmock.site/mock/0cc8353a68511aad722aa387610a4ce1/bili/videosList',
            success(res) {
                if (res.data.code === 0) {
                    that.setData({
                        videoList: res.data.data.videosList
                    })
                }
            },
            fail() {
                console.log('fail')
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 1. 获取首页导航数据
        this.getNavList();
        // 2. 获取首页轮播图数据
        this.getSwiperList();
        // 3. 获取视频列表数据
        this.getVedioList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})