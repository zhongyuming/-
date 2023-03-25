//Page Object
// 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({
    data: {
        // 轮播图数组
        swiperList: [],
        // 导航数组
        catesList: [],
        // 楼层数据
        floorList: [],
    },
    //options(Object)
    // 页面开始加载，就会触发
    onLoad: function(options) {
        // // 发送异步请求获取轮播图数据 优化的手段可以通过es6的 promise来解决这个问题
        // wx.request({
        //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
        //     //成功后的回调函数
        //     success: (result) => {
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     },
        //     // 失败调用的回调函数
        //     fail: () => {
        //         console.log("失败");
        //     },
        //     // 不论成功或者失败都会调用的回调函数
        //     // complete: () => {}
        // });
        this.getSwiperList();
        this.getCatesList();
        this.getFloorList();
    },

    // 获取轮播图数据
    getSwiperList() {
        request({ url: "/home/swiperdata" })
            .then(result => {
                this.setData({
                    swiperList: result.data.message
                })
            })
    },
    // 获取导航数据
    getCatesList() {
        request({ url: "/home/catitems" })
            .then(result => {
                this.setData({
                    catesList: result.data.message
                })
            })
    },
    // 获取楼层数据
    getFloorList() {
        request({ url: "/home/floordata" })
            .then(result => {
                this.setData({
                    floorList: result.data.message
                })
            })
    },
})