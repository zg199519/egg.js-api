'use strict';

const Service = require('egg').Service;

    class MailLogService extends Service {

        // 查询激活日志
        async emailSendCode(params) {
            const data = await this.app.mysql.get('mailLog', { theReceiver: params.email });
            return data;
        }

        // 保存记录到日志
        async saveLog(params) {
            const data = await this.app.mysql.insert('mailLog', params);
            return data;
        }

        // 查询记录
        async info(params) {
            const data = await this.app.mysql.get('mailLog', { theReceiver: params.email, code: params.code });
            return data;
        }

    }

module.exports = MailLogService;
