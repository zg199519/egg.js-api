'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  // 会员注册
  async registered() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 参数校验
    if (!params.email || !params.code || !params.password) {
      ctx.body = await ctx.helper.failureResponse('缺少参数');
      return false;
    }

    // 第一步 先检查会员表是否有此用户
    const userInfo = await ctx.service.user.userInfo(params.email);
    if (userInfo) {
      ctx.body = await ctx.helper.failureResponse('您已经注册，请直接登录！');
      return false;
    }

    // 判断邮件和验证码是否正确
    const info = await ctx.service.mailLog.info(params);
    if (!info) {
      ctx.body = await ctx.helper.failureResponse('您的邮箱或者验证码有误请检查！');
      return false;
    }

    // 拼接参数
    const crypto = require('crypto'); // 引入加密模块
    const md5 = crypto.createHash('md5'); // md5加密
    const newPwd = md5.update(params.password).digest('hex');
    const saveData = {
      idEncrypted: await ctx.helper.genID(32),
      auth: 1,
      email: params.email,
      password: newPwd,
      name: '猿问' + Math.ceil(Math.random() * 100000),
      creationTime: new Date(),
    };

    // 保存记录
    const saveCode = await ctx.service.user.saveInfo(saveData);
    if (!saveCode) {
      ctx.body = await ctx.helper.failureResponse('保存失败！');
      return false;
    }
    // 初始化统计数据
    const saveStatistical = {
      userId: saveCode.insertId,
      creationTime: new Date(),
    };

    await ctx.service.statistical.saveInfo(saveStatistical);

    ctx.body = await ctx.helper.successResponse();

  }


  // 会员邮箱激活
  async emailSendCode() {

    const { ctx } = this;
    const params = ctx.query;
    const data = await ctx.service.mailLog.emailSendCode(params);

    const msgData = {
      email: '',
      subject: '猿问博客注册',
      text: '',
    };

    if (data) {
      msgData.email = data.theReceiver;
      msgData.text = `您的注册验证码是:【${data.code}】此验证码长期有效，只允许注册一次，请牢记！`;
    } else {
      const code_num = parseInt(Math.random() * (99999 - 0 + 1) + 0, 10);
      msgData.email = params.email;
      msgData.text = `您的注册验证码是:【${code_num}】此验证码长期有效，只允许注册一次，请牢记！`;
      // 保存数据库
      await ctx.service.mailLog.saveLog({
        theReceiver: params.email,
        code: code_num,
        creationTime: new Date(),
      });

    }

    const has_send = await this.service.tool.sendMail(msgData.email, msgData.subject, msgData.text);
    if (has_send) {
      ctx.body = await ctx.helper.successResponse();
    } else {
      ctx.body = await ctx.helper.failureResponse();
    }

  }

  // 会员登录
  async login() {
    const { ctx } = this;
    const params = ctx.request.body;
    // 输入邮箱 和 密码 然后去数据库查询是否有此用户
    const crypto = require('crypto'); // 引入加密模块
    const md5 = crypto.createHash('md5'); // md5加密
    const newPwd = md5.update(params.password).digest('hex');
    const userInfo = await ctx.service.user.userInfo(params.email, newPwd);
    if (!userInfo) {
      ctx.body = await ctx.helper.failureResponse('账户名或者密码错误！');
      return false;
    }
    // 有就更新token 然后返回token
    const token = await ctx.helper.signToken({ id: userInfo.id, idEncrypted: userInfo.idEncrypted });
    const wInfo = {
      id: userInfo.id,
    };
    const row = {
      token,
    };
    const uCode = await ctx.service.user.updateInfo(wInfo, row);
    if (uCode.affectedRows !== 1) {
      ctx.body = await ctx.helper.failureResponse('更新token失败！');
      return false;
    }
    // 重新查询信息 然后返回个人信息
    userInfo.token = token;
    ctx.body = await ctx.helper.successResponse(userInfo);
    return false;

  }

  // 会员信息
  async info() {
    const { ctx } = this;
    const userInfo = await ctx.service.user.userInfo('', '', ctx.query.USERID);
    delete userInfo.password;
    ctx.body = await ctx.helper.successResponse(userInfo);
  }

  // 作者榜单
  async authorList() {
    const { ctx } = this;
    const lists = await ctx.service.user.authorList();
    ctx.body = await ctx.helper.successResponse(lists);
  }

  // 更新会员信息
  async updateInfo() {
    const { ctx } = this;
    const params = ctx.request.body;
    const data = {};
    for (const key in params) {
      if (params[key]) {
        data[key] = params[key];
      }
    }
    const wInfo = {
      id: ctx.query.USERID,
    };
    const uCode = await ctx.service.user.updateInfo(wInfo, data);
    if (uCode.affectedRows !== 1) {
      // 重新查询信息 然后返回个人信息
      ctx.body = await ctx.helper.failureResponse('更新失败！');
      return false;
    }
    ctx.body = await ctx.helper.successResponse();
    return false;
  }

  // 联合统计查询
  async statistical() {
    const { ctx } = this;
    const params = ctx.query;
    const query = {
      userId: params.USERID,
    };
    const uData = await ctx.service.user.statistical(query);
    // 我发布的帖子 ， 文章 ， 小册 我关注的人 关注我的人
    ctx.body = await ctx.helper.successResponse(uData);
  }


}

module.exports = UserController;
