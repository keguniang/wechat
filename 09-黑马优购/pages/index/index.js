// 0. 引入用来发送请求的方法
import { request } from '../../request/index'
//index.js
//获取应用实例
const app = getApp()

//Page Object
Page({
    data: {
        // 轮播图数据
        swiperList: [],
        // 首页导航数据
        navList: [],
        // 商品列表数据
        floorList: []
    },
    // 获取轮播图数据
    getSwiperList() {
        // var that = this;
        // wx.request({
        //     url: '/home/swiperdata',
        //     success: (result) => {
        //         if (result.data.meta.status === 200) {
        //             console.log(result)
        //             this.setData({
        //                 swiperList: result.data.message
        //             })
        //         }
        //     }
        // });
        request({ url: '/home/swiperdata' })
            .then(res => {
                this.setData({
                    swiperList: res
                })
            })
    },
    // 获取首页导航数据
    getNavList() {
        request({ url: '/home/catitems' })
            .then(res => {
                this.setData({
                    navList: res
                })
            })
    },
    // 获取商品列表数据
    getFloorList() {
        request({ url: '/home/floordata' })
            .then(res => {
                this.setData({
                    floorList: res
                })
            })
    },
    //options(Object)
    onLoad: function(options) {
        // 获取轮播图数据
        this.getSwiperList();
        // 获取首页导航数据
        this.getNavList();
        // 获取商品列表数据
        this.getFloorList();
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    },
    onPageScroll: function() {

    },
    //item(index,pagePath,text)
    onTabItemTap: function(item) {

    }
});