'use strict';

const Service = require('egg').Service;

    class UserService extends Service {
        // 查询会员信息 根据邮箱查询
        async userInfo(email = '', password = '', id = '') {
            const params = { };
            if (email) {
                params.email = email;
            }
            if (password) {
                params.password = password;
            }
            if (id) {
                params.id = id;
            }
            return await this.app.mysql.get('user', params);
        }

        // 保存记录
        async saveInfo(params) {
            return await this.app.mysql.insert('user', params);
        }

        // 更新记录
        async updateInfo(whereInfo, row) {
            const options = {
                where: whereInfo,
            };
            const result = await this.app.mysql.update('user', row, options); // 更新 posts 表中的记录
            return result;
        }

        // 作者排行榜
        async authorList() {
            const sql =
            'SELECT U.*,S.likeCount,S.articleCount,S.bookCount,S.postCount,S.commentCount, (S.likeCount+S.articleCount+S.bookCount+S.postCount+S.commentCount) AS hot FROM statistical S '
            + 'INNER JOIN `user` U ON S.userId = U.id ORDER BY hot DESC;';
            return await this.app.mysql.query(sql);
        }

        // 查询会员统计信息
        async statistical(params) {
            return await this.app.mysql.get('statistical', params);
        }

    }

module.exports = UserService;
