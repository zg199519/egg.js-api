'use strict';

const Service = require('egg').Service;

    class StatisticalService extends Service {

        // 保存添加记录
        async saveInfo(data) {
            return await this.app.mysql.insert('statistical', data);
        }

    }

module.exports = StatisticalService;
