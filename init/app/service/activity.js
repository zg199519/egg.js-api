'use strict';

const Service = require('egg').Service;

    class ActivityService extends Service {

        // 获取书籍列表
        async getList() {
            const results = await this.app.mysql.select('activity');

            return results;
        }

    }

module.exports = ActivityService;
