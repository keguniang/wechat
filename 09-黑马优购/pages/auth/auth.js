import { login } from '../../utils/async'
// 为了使用async，只引入即可不用使用
import regeneratorRuntime from '../../lib/runtime/runtime'
import { request } from "../../request/index";

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    async handleGetuserinfo(e) {
        // 1 获取用户信息
        const { encryptedData, rawData, signature, iv } = e.detail;
        // 2 获取小程序登录成功之后的code
        const { code } = await login();
        // 请求的参数
        const params = { encryptedData, rawData, signature, iv, code };
        // 3 发送请求获取用户的token，如果不是企业应用的话，这一步就不能实现了
        const { token } = await request({ url: "/users/wxlogin", data: params, method: "post" });
        // 4 把token存入缓存中，同时跳转回上一个页面
        wx.setStorageSync('token', token);
        wx.navigateBack({
            delta: 1
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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