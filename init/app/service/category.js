'use strict';

const Service = require('egg').Service;

    class CategoryService extends Service {

        // 获取分类列表
        async getLists(params) {
            const whereData = {};
            if (params.parentId) {
                if (params.parentId === -1) {
                    params.parentId = null;
                }
                whereData.parentId = params.parentId;
            }
            return await this.app.mysql.select('category', {
                where: whereData, // WHERE 条件
                columns: [ 'id', 'sort', 'name', 'desc', 'creationTime' ], // 要查询的表字段
                orders: [[ 'sort', 'desc' ]], // 排序方式
            });
        }

    }

module.exports = CategoryService;
