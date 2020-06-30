'use strict';

const Service = require('egg').Service;

    class TopicService extends Service {

        // 获取列表
        async getLists() {
            return await this.app.mysql.select('topic', {
                where: { isDel: 1 }, // WHERE 条件
                columns: [ 'id', 'cover', 'sort', 'name', 'creationTime' ], // 要查询的表字段
                orders: [[ 'sort', 'desc' ]], // 排序方式
            });
        }

    }

module.exports = TopicService;
