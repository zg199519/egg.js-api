'use strict';

const Service = require('egg').Service;

    class BookService extends Service {

        // 获取书籍列表
        async getList(params) {
            const startNum = (params.pageNo - 1) * params.pageSize;
            const whereQuery = {
                through: 1,
            };
            if (params.recommended) {
                whereQuery.recommended = params.recommended;
            }
            if (params.userId) {
                whereQuery.userId = params.userId;
            }

            if (params.category) {
                whereQuery.categoryId = params.category;
            }

            const results = await this.app.mysql.select('book', {
                where: whereQuery, // WHERE 条件
                limit: params.pageSize, // 返回数据量
                offset: startNum, // 数据偏移量
            });

            for (let index = 0; index < results.length; index++) {
                results[index].user = await this.app.mysql.query(`select * from user where id = ${results[index].userId}`);
            }


            return results;
        }

         // 新增小册
        async addBook(params) {
            params.creationTime = new Date();
            params.through = 1;
            const results = await this.app.mysql.insert('book', params);
            return results;
        }

         // 修改
         async modifyBook(params) {
            const results = await this.app.mysql.update('book', params, { where: { id: params.id } });
            return results;
        }

    }

module.exports = BookService;
