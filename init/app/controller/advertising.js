'use strict';

const Controller = require('egg').Controller;

class AdvertisingController extends Controller {

  // 广告
  async info() {
    const { ctx } = this;
    const data = {
        img: ctx.app.config.publicUrl.domainPrefix + '/public/images/advertising/1.jpeg',
        name: '公益广告',
    };
    ctx.body = await ctx.helper.successResponse(data);
  }

}

module.exports = AdvertisingController;
