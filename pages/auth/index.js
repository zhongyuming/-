import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'
import { login } from "../../utils/asyncWx.js"
Page({
    // 获取用户信息
    async handleGetUserInfo(e) {
        // 获取用户信息
        const { encryptedData, rawData, iv, signature } = e.detail;
        const { code } = await login();
        const loginParams = { encryptedData, rawData, iv, signature, code };
        // 发送请求 获取用户token
        const res = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
        console.log(res);
    }
})