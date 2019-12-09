/**
 * 1. 用户上滑页面 滚动条触底 开始加载下一页数据
 *  （1）找到滚动条触底事件
 *  （2）判断还有没有下一页数据
 *  （3）没有下一页数据，弹出提示
 *  （4）有下一页数据，加载下一页数据
 *      当前页码++
 *      重新发送请求
 *      数组拼接而不是替换
 * 2. 下拉刷新页面
 *  （1）触发下拉刷新页面,需要在页面的json文件中开启两个配置
 *  （2）重置数据数组
 *  （3）重置页码设置为1
 *   (4) 重新发送请求
 *  （5） 数据请求回来了，需要手动关闭刷新窗口
 */

import { request } from "../../request/index";
// 为了使用async，只引入即可不用使用
import regeneratorRuntime from '../../lib/runtime/runtime'
// pages/goods_list/goods_list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            '综合', '销量', '价格'
        ],
        currentIndex: 0,
        goodsList: []
    },
    queryParams: {
        query: '',
        cid: 0,
        pagenum: 1,
        pagesize: 10
    },
    // 总页数
    totalPage: 0,
    // 自定义事件，用来接收子组件传递过来的数据，获取当前的索引
    getCurrentIndex(e) {
        this.setData({
            currentIndex: e.detail
        })
    },
    // 请求商品列表数据,把参数也一并传递过去
    async getGoodsList() {
        const res = await request({ url: '/goods/search', data: this.queryParams });
        console.log(res);
        // 计算总页数
        this.totalPage = Math.ceil(res.total / this.queryParams.pagesize);
        console.log(this.totalPage)
        this.setData({
                // 拼接了数组
                goodsList: [...this.data.goodsList, ...res.goods]
            })
            // 关闭下拉刷新的窗口，如果没有调用下拉刷新窗口不会报错
        wx.stopPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.queryParams.cid = options.cid;
        this.getGoodsList();
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        // 1. 重置数组
        this.setData({
            goodsList: []
        });
        // 2. 将页码置为1
        this.queryParams.pagenum = 1;
        // 3. 重新发送请求
        this.getGoodsList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        console.log('触底了');
        // 判断是否还有下一页数据
        if (this.queryParams.pagenum >= this.totalPage) {
            // 没有下一页了
            wx.showToast({
                title: '没有下一页数据了'
            });
        } else {
            // 还有下一页
            this.queryParams.pagenum++; //页数加1
            this.getGoodsList(); //重新请求下一页数据
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})