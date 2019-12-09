import { request } from "../../request/index";
// 为了使用async，只引入即可不用使用
import regeneratorRuntime from '../../lib/runtime/runtime'

/**
 * 1 发送请求获取数据
 * 2 点击轮播图 预览大图
 *  1. 给轮播图绑定点击事件
 *  2. 调用小程序的api previewImage
 * 3 点击加入购物车
 *  1. 先绑定点击事件
 *  2. 获取缓存中的购物车数据 数组格式
 *  3. 先判断当前的商品是否已经存在于购物车
 *  4. 已经存在  修改商品数据即可  购物车中商品数量++，重新把购物车数组填充到缓存中
 *  5. 不存在购物车数组中的数据，直接给购物车数组添加一个新元素，新元素带上一个属性num，重新把购物车数组填充到缓存中
 *  6. 弹出提示
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsDetailObj: {}
    },

    // 得到商品详情
    async getGoodsDetail(id) {
        const res = await request({ url: '/goods/detail', data: { goods_id: id } });
        this.goodsInfo = res;
        this.setData({
            goodsDetailObj: {
                goods_id: res.goods_id,
                pics: res.pics,
                goods_price: res.goods_price,
                goods_name: res.goods_name,
                // iphone 部分手机不识别webp图片格式，最好找到后台，让她进行修改
                // 临时自己改，确保后台存在 1.webp->1.jpg
                goods_introduce: res.goods_introduce.replace('/\.webp/g', '.jpg')
            }
        })
    },
    // 点击轮播图，放大预览图片
    previewImage(e) {
        // 1. 构造要预览的图片的数组
        const urls = this.data.goodsDetailObj.pics.map((v) => v.pics_mid);
        // 2. 接受要预览的第一张图片路径
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls
        });
    },
    shopCart() {
        // 1. 有缓存就获取，没有缓存就新建数组 第一次获取的时候是空数组
        let cartArr = wx.getStorageSync('cart') || [];
        // 2. 判断商品对象是否存在于购物车数组中
        let index = cartArr.findIndex(v => v.goods_id === this.data.goodsDetailObj.goods_id);
        // 3 第一次添加
        if (index === -1) {
            this.data.goodsDetailObj.num = 1;
            this.data.goodsDetailObj.checked = true;
            cartArr.push(this.data.goodsDetailObj);
        } else {
            // 4 已经存在购物车中，执行数量加1即可
            cartArr[index].num++;
        }
        // 5. 把购物车数据重新加回缓存中
        wx.setStorageSync('cart', cartArr);
        // 6. 弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            // 添加蒙版，该蒙版是透明的不是灰色的，这时点击别的地方是点击不了的，防止用户疯狂点击
            mask: true
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getGoodsDetail(options.goods_id);
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