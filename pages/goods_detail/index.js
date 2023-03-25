import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {}
    },
    // 商品对象
    GoodInfo: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { goods_id } = options;
        this.getGoodsDetail(goods_id);
    },
    // 获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
        this.GoodInfo = goodsObj;
        this.setData({
            goodsObj: {
                goods_name: goodsObj.data.message.goods_name,
                goods_price: goodsObj.data.message.goods_price,
                // iPhone 部分手机 不识别  webp图片格式
                // 最好找到后台 让他进行修改 
                // 临时自己改 1.webp => 1.jpg
                goods_introduce: goodsObj.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.data.message.pics
            }
        })
    },
    // 点击轮播图 放大预览
    handleprevewImage(e) {
        // 先构造要预览的图片数组
        const urls = this.GoodInfo.data.message.pics.map(v => v.pics_mid)
            // 接受传递过来的图片url
        const current = e.currentTarget.dataset.url
        wx.previewImage({
            current,
            urls
        });
    },
    // 点击加入购物车
    handleCartAdd() {
        // 获取缓存中的数组
        let cart = wx.getStorageSync("cart") || [];
        // 判断商品对象是否存在与于购物车数组中
        let index = cart.findIndex(v => v.goods_id === this.GoodInfo.data.message.goods_id)
        if (index === -1) {
            // 不存在 第一次添加
            this.GoodInfo.num = 1;
            this.GoodInfo.checked = true;
            cart.push(this.GoodInfo);
        } else {
            //已经存在购物车数据 执行 num++
            cart[index].num++;
        }
        // 把购物车重新添加回缓存中
        wx.setStorageSync("cart", cart);
        // 弹窗提示
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            // ture 防止用户手抖
            mask: true
        });
    }
})