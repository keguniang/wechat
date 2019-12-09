/**
 * 1 获取用户的收货地址
 *   （1）绑定点击事件
 *   （2）调用小程序内置api获取用户的收货地址 wx.cooseAddress,但是这个方法有个缺陷，就是一旦用户点了取消，但以后就不能重新授予权限，所以需要对这一步做特殊处理
 * 
 *  （2）获取用户对小程序所授予的权限  scope
 *      1. 假设用户点击获取收货地址的提示框 确定 authSetting scope.address = true,直接调用获取用户的收货地址
 *      2. 假设用户从来没有调用过 收货地址的api ，scope  undefined  直接调用获取用户的收货地址
 *      3. 假设用户点击获取收货地址的提示框 取消 authSetting scope.address = false
 *        1. 需要诱导用户自己打开授权设置页面(wx.openSetting)当用户重新授予权限
 *        2. 获取收货地址
 *      4. 把获取到的收货地址存储到本地存储中
 * 
 * 2. 页面加载完毕  onload  onshow
 *  1 获取本地存储中的地址数据
 *  2 把数据设置给data中的一个变量
 * 
 * 3. onShow
 *  1 获取缓存中的购物车数组
 *  2 把购物车数据填充到data中
 * 
 * 4. 全选的实现
 *  1. onshow 获取购物车中的购物车数组
 *  2. 根据购物车中数据的checked属性，对cart数组做every循环，若所有的checked属性均为false，则全选的checked=true，否则为false
 * 
 * 5. 总价格和总数量
 *  1. 获取购物车数组
 *  2. 遍历
 *  3. 判断商品是否被选中
 *  4. 总价格 += 商品的单价*商品的数量
 *  5. 总数量 += 商品的数量
 *  6. 把计算后的价格和数量 设置回data中即可。
 * 
 * 6. 商品的选中
 *  1. 绑定change事件
 *  2. 获取到被修改的商品对象
 *  3. 商品对象的选中状态  取反
 *  4. 重新填充回 data 中和缓存中
 *  5. 重新计算全选，总价格和总数量
 * 
 * 7. 全选  反选
 *  1. 给全选的复选框绑定change事件
 *  2. 获取data中的allChecked和cart属性
 *  3. 将allChecked取反
 *  4. 循环遍历cart,将每个对象的checked属性跟allChecke保持一致
 *  5. 重新调用cartCompute(cart)计算全选，总价格和总数量并保存到data红和缓存中
 * 
 * 8. 商品数量的编辑
 *  1 加减按钮绑定为同一个点击事件，区分的关键就是通过自定义属性
 *   + 1  - -1
 *  2. 自定义属性中传递商品的goods_id
 *  3. 获取data中的cart数组，通过goods_id找到需要被修改的商品对象 
 *  4. 当购物车的数量=1，然后用户又点击了-，则弹窗询问用户是否要删除  wx.showModal
 *   1. 确定，直接执行删除
 *   2. 取消，什么都不做
 *  5. 直接修改商品对象的数量num
 *  6. 调用cartCompute(cart)
 * 
 * 9. 点击结算
 *   1 判断有没有收货地址
 *   2 判断用户有没有商品
 *   3 验证后，跳转到结算页面
 */

// 为了使用async，只引入即可不用使用
import regeneratorRuntime from '../../lib/runtime/runtime'
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/async.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        allPrice: 0,
        allNum: 0
    },
    async getAddress() {
        try {
            // 1 获取权限状态
            const res1 = await getSetting();
            // 获取地址的权限
            let auth = res1.authSetting["scope.address"];
            // 判断权限状态
            if (auth === false) {
                // 先诱导用户打开授权页面
                await openSetting();
            }
            // 获取收货地址
            const res2 = await chooseAddress();
            res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo;
            // 存入到缓存中
            wx.setStorageSync('address', res2);
        } catch (error) { //catch是用来捕获reject的
            console.log(error);
        }
    },
    // 复选框的切换事件
    handleItemChange(e) {
        let goods_id = e.currentTarget.dataset.id;
        let cart = wx.getStorageSync('cart');
        let index = cart.findIndex(v => v.goods_id === goods_id);
        // 该对象的选中状态取反
        cart[index].checked = !cart[index].checked;
        this.cartCompute(cart);
    },
    // 全选复选框的切换事件
    allCheck(e) {
        // 1 获取data中的值
        let { allChecked, cart } = this.data;
        // 2 修改值
        allChecked = !allChecked;
        // 3 循环修改cart数组中的商品选中的状态
        cart.forEach(v => v.checked = allChecked);
        this.cartCompute(cart);

    },
    // 计算全选，总价格和总数量，并把数据重新填回data中和缓存中
    cartCompute(cart) {
        // 计算总的价格  注意这里要初始化为整数，否则结果为NaN
        let allPrice = 0;
        let allNum = 0;
        let allChecked = true;
        // 这里要注意一点，计算之前要判断商品前边的复选框是否被选中，不选中，就不计算该商品
        cart.forEach(v => {
            if (v.checked) {
                allPrice += v.goods_price * v.num;
                allNum += v.num;
            } else {
                allChecked = false;
            }
        });
        // 但是，如果购物车为空数组，则不会执行forEach方法，所以这里还要对数组的长度做一次把关
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
                cart,
                allChecked,
                allPrice,
                allNum
            })
            // 重新填回到缓存中
        wx.setStorageSync('cart', cart);
    },
    // 商品数量加减事件
    async numChange(e) {
        // 获取对应商品的id,获取加减，加 num为1,减 num为-1
        let { id, operation } = e.currentTarget.dataset;
        let cart = this.data.cart;
        let index = cart.findIndex(v => v.goods_id === id);
        // 询问用户是否要删除该商品
        if (cart[index].num === 1 && operation === -1) {
            const res = await showModal('您是否要删除该商品？');
            // 弹窗提示
            if (res.confirm) {
                showToast('已成功删除该商品', 'none');
                // 从cart数组中删除该商品
                cart.splice(index, 1);
            }
        } else {
            // 进行数量修改
            cart[index].num += operation;
        }
        this.cartCompute(cart);
    },
    // 结算按钮事件
    accountBtn() {
        let { cart, address } = this.data;
        if (cart.length === 0) {
            showToast('您还没有选购商品', 'none');
            return;
        } else if (!address.userName) {
            showToast('您还没有添加收货地址', 'none');
            return;
        } else {
            wx.navigateTo({
                url: '/pages/pay/pay'
            });
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 获取缓存中的地址
        const address = wx.getStorageSync('address') || [];
        // 获取缓存中的购物车数据
        const cart = wx.getStorageSync('cart') || [];
        // 空数组调用every方法也返回true，所以需要对空数组进行处理
        // 这里做了一次循环，下边也做了循环，否则出于性能的考虑，整合成一个循环
        // const allChecked = cart.length ? cart.every(v => v.checked) : false;
        this.setData({
                address
            })
            // 计算全选，总价格和总数量
        this.cartCompute(cart);
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