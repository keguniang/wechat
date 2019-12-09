/**
 * 1 页面显示的时候
 *   从缓存中获取购物车数据  渲染到页面中，这些数据需要过滤 过滤条件为 checked = true
 * 
 * 2 微信支付
 *   1 哪些人 哪些账号 可以实现微信支付
 *     1 企业账号
 *     2 企业账号的小程序后台 中必须给开发者添加上白名单
 *       1 一个 appid 可以同时绑定多个开发者
 *       2 这个开发者就可以共用这个appid和它的开发权限
 * 3 支付按钮
 *   1 先判断缓存中有没有token
 *   2 没有则跳转到授权页面，获取tiken
 *   3 有token,则。。
 */

// 为了使用async，只引入即可不用使用
import regeneratorRuntime from '../../lib/runtime/runtime'
import { requestPayment, showToast } from '../../utils/async.js';
import { request } from "../../request/index";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allPrice: 0,
        allNum: 0
    },

    // 支付按钮事件
    async payBtn() {
        try {
            // 1 获取缓存中的token
            const token = wx.getStorageSync('token');
            // 2 判断缓存中是否有token，没有的话到授权页面获取token
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/auth'
                });
            }
            // 3 创建订单
            // 3.1 获取请求头参数
            const token = wx.getStorageSync('token');
            const header = { Authorization: token };
            // 3.2 请求体参数
            const order_price = this.data.allPrice;
            const consignee_addr = this.data.address.all;
            const goods = [];
            const cart = this.data.cart;
            cart.forEach(v => {
                goods.push({
                    goods_id: v.goods_id,
                    goods_number: v.goods_number,
                    goods_price: v.goods_price
                })
            })
            const orderParams = { order_price, consignee_addr, goods };
            // 4 发送请求 创建订单 获取订单编号
            const { order_number } = await request({ url: '/my/orders/create', data: orderParams, method: 'POST', header: header });

            // 5 发起预支付
            const { pay } = await request({ url: '/my/orders/req_unifiedorder', data: { order_number }, method: 'POST', header: header });
            // 6 发起微信支付
            await requestPayment(pay);
            // 7 查看订单支付状态
            const { message } = await request({ url: '/my/orders/chkOrder', data: { order_number }, method: 'POST', header: header });
            // 8 弹窗提示
            await showToast('支付成功', 'success');
            // 删除已经支付的商品
            let newCart = wx.getStorageSync('cart');
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync('cart', newCart);
            // 9 支付成功了，跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/order'
            });
        } catch (error) {
            await showToast('支付失败', 'nnone')
            console.log(error);
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 获取缓存中的地址
        const address = wx.getStorageSync('address') || [];
        // 获取缓存中的购物车数据
        let cart = wx.getStorageSync('cart') || [];
        // 过滤被选中的商品
        cart = cart.filter(v => v.checked);
        // 计算全选，总价格和总数量
        let allPrice = 0;
        let allNum = 0;

        cart.forEach(v => {
            allPrice += v.goods_price * v.num;
            allNum += v.num;
        });

        this.setData({
            address,
            cart,
            allPrice,
            allNum
        })
    }
})