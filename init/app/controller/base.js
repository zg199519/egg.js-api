'use strict';
const Controller = require('egg').Controller;
// 文件存储
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

class BaseController extends Controller {

    // 单个文件上传
    async singleFileUpload() {
        const ctx = this.ctx;
        const stream = await ctx.getFileStream();
        const urlPath = (new Date()).getTime() + Math.random().toString(36).substr(2);// 前缀
        const fileName = urlPath + '_' + stream.filename;
        const pathUrl = `/public/upload/article/${fileName}`;
        const target = path.join(this.config.baseDir, `app${pathUrl}`);
        const result = await new Promise((resolve, reject) => {
            const remoteFileStream = fs.createWriteStream(target);
            stream.pipe(remoteFileStream);
            let errFlag;
            remoteFileStream.on('error', err => {
                errFlag = true;
                sendToWormhole(stream);
                remoteFileStream.destroy();
                reject(err);
            });
            remoteFileStream.on('finish', async () => {
                if (errFlag) return;
                resolve({ fileName, url: ctx.app.config.publicUrl.domainPrefix + pathUrl });
            });
          });
        ctx.body = await ctx.helper.successResponse(result);
      }

    }
module.exports = BaseController;
