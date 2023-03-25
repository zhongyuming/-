// pages/cart/index.js
import { showToast } from "../../utils/asyncWx.js"
Page({
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        // 获取缓存中的收货地址信息
        const address = wx.getStorageSync("result");
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        // 获取缓存中的购物车数据
        const cart = wx.getStorageSync("cart") || [];

        this.setData({ address });
        this.setCart(cart)
    },
    // 点击收货地址
    handleChoseAddress() {
        // 获取收货地址
        wx.chooseAddress({
            success: (result) => {
                wx.setStorageSync("result", result);
            }
        });
    },
    // 商品的选中
    handleItemChange(e) {
        const goods_id = e.currentTarget.dataset.id;
        // 获取购物车数组
        let { cart } = this.data;
        // 找到被修改的商品对象
        let index = cart.findIndex(v => v.data.message.goods_id === goods_id)
            // 选中状态取反
        cart[index].checked = !cart[index].checked;

        this.setCart(cart)
    },
    // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart) {
        // 计算全选
        // every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都返回true 那么 every方法的返回值为true
        // 只要 有一个回调函数返回了false 那么不在循环执行，直接返回false
        // 空数组 调用 every，返回值就是true
        // const allChecked = cart.length ? cart.every(v => v.checked) : false;
        let allChecked = true
            // 总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
                if (v.checked) {
                    totalPrice += v.num * v.data.message.goods_price;
                    totalNum += v.num;
                } else {
                    allChecked = false
                }
            })
            // 判断数组是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allChecked
        })
        wx.setStorageSync("cart", cart)
    },
    // 商品的全选功能
    handleItemAllCheck() {
        // 获取data中的数据
        let { cart, allChecked } = this.data;
        // 修改值
        allChecked = !allChecked;
        // 循环修改cart数组 中的商品选中状态
        cart.forEach(v => v.checked = allChecked);
        // 修改后的值 填充回data中或者缓存中
        this.setCart(cart);
    },
    // 商品数量编辑功能
    handleItemNumEdit(e) {
        const { operation, id, } = e.currentTarget.dataset;
        // 获取购物车数组
        let { cart } = this.data;
        // 找到需要修改的商品索引
        const index = cart.findIndex(v => v.data.message.goods_id === id);
        // 判断是否要执行删除
        if (cart[index].num === 1 && operation === -1) {
            wx.showModal({
                title: '提示',
                content: '您是否要删除',
                success: (res) => {
                    if (res.confirm) {
                        cart.splice(index, 1);
                        this.setCart(cart);
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        } else {
            // 进行修改数量
            cart[index].num += operation;
            // 设置回缓存和data中
            this.setCart(cart);
        }
    },
    async handlePay() {
        // 判断收货地址
        const { address, totalNum } = this.data
        if (!address.userName) {
            await showToast({ title: "您还没有选择收货地址" });
            return;
        }
        // 判断用户有没有选购商品
        if (totalNum === 0) {
            await showToast({ title: "您还没有选购商品" });
            return
        }
        // 跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/index'
        });
    }
})