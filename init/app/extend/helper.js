'use strict';

const jwt = require('jsonwebtoken');
const secret = 'ZHOUGUANG';// 加密的key（密钥） 自己去QQ邮箱申请 这个是我的 不要用

module.exports = {
    // 成功响应全局方法
    async successResponse(data = {}, msg = '成功', code = 10000) {
        return {
            code,
            msg,
            data,
        };
    },

    // 失败全局的响应方法
    async failureResponse(msg = '失败', code = 50000) {
        return {
            code,
            msg,
        };
    },
    // 生成不重复的ID
    async genID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // eslint-disable-next-line prefer-const
            // eslint-disable-next-line no-bitwise
            const r = Math.random() * 16 | 0,
                // eslint-disable-next-line no-bitwise
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // 生成token
    async signToken(payload) {
        return jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 30 });// 授权时效30天});
    },

    // token 验证
    async verifyToken(token) {
        try {
            const payload = jwt.verify(token, secret);
            return payload;
        } catch (e) {
            return false;
        }
    },

};
