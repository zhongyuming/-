// pages/cart/index.js
import { showToast } from "../../utils/asyncWx.js"
Page({
    data: {
        address: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        // 获取缓存中的收货地址信息
        const address = wx.getStorageSync("result");
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        // 获取缓存中的购物车数据
        let cart = wx.getStorageSync("cart") || [];
        // 过滤后的购物车数组
        cart = cart.filter(v => v.checked)
        this.setData({ address });

        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
                totalPrice += v.num * v.data.message.goods_price;
                totalNum += v.num;
                allChecked = false
            })
            // 判断数组是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address
        })
        wx.setStorageSync("cart", cart)
    },
    // 点击支付
    handleOrderPay() {
        // 判断缓存中有没有token
        const token = wx.getStorageSync("token")
            // 判断
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return;
        }
        console.log("cunai");
    }
})