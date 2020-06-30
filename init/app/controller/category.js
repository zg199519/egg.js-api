'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {

  // 分类数据 包括 二级标签列表数据
  async list() {
    const { ctx } = this;
    const params = ctx.request.body;
    const lists = await ctx.service.category.getLists(params);
    ctx.body = await ctx.helper.successResponse(lists);
  }

  // 获取话题列表
  async topicList() {
    const { ctx } = this;
    const lists = await ctx.service.topic.getLists();
    ctx.body = await ctx.helper.successResponse(lists);
  }


}

module.exports = CategoryController;
