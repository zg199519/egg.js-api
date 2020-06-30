'use strict';
module.exports = () => {
    return async function loginAuth(ctx, next) {
      const authorization = ctx.request.header.authorization;
      if (!authorization) {
        ctx.body = await ctx.helper.failureResponse('未登录!', 40001);
        return false;
      }
      const token = authorization.trim().split(' ')[1];
      const info = await ctx.helper.verifyToken(token);
      if (info) {
        ctx.query.USERID = info.id;
      } else {
        ctx.body = await ctx.helper.failureResponse('无效的令牌!', 40001);
        return false;
      }
      await next();
    };
};
