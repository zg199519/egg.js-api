'use strict';

const Controller = require('egg').Controller;

class ActivityController extends Controller {

  // 活动列表数据
  async list() {
    const { ctx } = this;
    const data = await ctx.service.activity.getList();
    ctx.body = await ctx.helper.successResponse(data);
  }


}

module.exports = ActivityController;
