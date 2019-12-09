// pages/category/category.js

import { request } from '../../request/index'
// 为了使用async，只引入即可不用使用
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的商品数据
        rightContent: [],
        // 当前选中的索引
        currentIndex: 0,
        // 竖向滚动条的位置
        scroolTop: 0
    },
    // 接口的返回数据
    Cates: [],
    // 得到分页页面的数据
    async getCates() {
        // request({ url: '/categories' })
        //     .then((res) => {
        //         this.Cates = res.data.message;

        //         // 把接口的数据存入到本地存储中
        //         wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        //         // 构造左侧的大菜单数据
        //         let leftMenuList = this.Cates.map(item => item.cat_name);

        //         // 构造右侧的商品数据
        //         let rightContent = this.Cates[0].children;
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })
        // 使用es7的async来发送请求
        const res = await request({ url: '/categories' });
        this.Cates = res;
        // 把接口的数据存入到本地存储中
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(item => item.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    // 分类的点击事件
    handleItemTap(e) {
        /**
         * 1. 获取被点击标题身上的索引
         * 2. 给data 中的currentIndex赋值
         * 3. 根据不同的索引来渲染对应的 内容
         */
        const index = e.currentTarget.dataset.index

        // 构造右侧的商品数据
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            // 每次点击左侧分类的时候都把scroolTop赋值为0
            scroolTop: 0
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /**
         * 0. web中的本地存储与小程序本地存储的区别
         *  （1）写代码的方式不一样
         *    web: localStorage.setItem("key","value")  localStorage.getItem("key")
         *    小程序中：wx.setStorageSync('key', 'value');  wx.getStorageInfoSync('key');
         *    (2) 存的时候有没有做类型转换
         *    web:不管存入的是什么类型的数据，都会调用toString()方法，把数据转化为字符串再存进去
         *    小程序：不存在转换类型的操作，存什么类型的数据进去，获取的就是什么类型的数据
         * 1. 先判断一下本地存储中有没有旧的数据
         * 格式为：{time:Data.now(),data:...}
         * 2. 没有旧数据，直接发送新的请求
         * 3. 有旧的数据且旧的数据也没有过期就使用本地存储中的旧数据
         */

        //  1.获取本地存储中的数据  'cates', { time: Date.now(), data: this.Cates }
        const Cates = wx.getStorageSync('cates');
        // 2. 判断有没有改数据
        if (!Cates) {
            // 不存在就发送请求
            this.getCates();
        } else { //有旧数据
            // 判断旧数据有没有过期  超过了5min就过期了，重新发送请求获取数据
            if (Date.now() - Cates.time >= 1000 * 300) {
                this.getCates();
            } else {
                this.Cates = Cates.data;
                // 构造左侧的大菜单数据
                let leftMenuList = this.Cates.map(item => item.cat_name);

                // 构造右侧的商品数据
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }

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