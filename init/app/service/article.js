'use strict';

const Service = require('egg').Service;

    class ActicleService extends Service {


        // 文章查询列表
        async getList(params) {

            // 文章类型 1 文章 2 帖子
            if (params.type === 1) {
                const sql = await this.getArticleLists(params);
                return await this.app.mysql.query(sql);
            } else if (params.type === 2) {
                const lists = await this.getPostLists(params);
                return lists;
            }

        }

        // 获取我的文章列表
        async myArticleList(params) {

            const whereQuery = {
                isDel: 1,
            };
            if (params.bookId) {
                whereQuery.bookId = params.bookId;
            }
            if (params.userId) {
                whereQuery.userId = params.userId;
            }
            if (params.type) {
                whereQuery.type = params.type;
            }
            const results = await this.app.mysql.select('article', {
                where: whereQuery,
            });
            return results;

        }

        // 获取我的文章列表
        async articleDetail(params) {
            const whereQuery = {
                isDel: 1,
                id: params.id,
            };
            const results = await this.app.mysql.get('article', whereQuery);
            return results;
        }

        // 获取文章列表
        async getArticleLists(params) {
            let sql = '';
            const startNum = (params.pageNo - 1) * params.pageSize;
            const aField = ' A.id,A.type,A.recommended,A.title,A.desc,A.cover,A.creationTime, ';
            const catField = ' CAT.name as cname,TAG.name as tagName, ';
            const uField = ' U.name,U.company,U.portrait,U.job, ';
            sql += 'SELECT ';
            sql += aField;
            sql += catField;
            sql += uField;
            sql += ' COUNT(LI.id) AS likeCount, ';
            sql += ' COUNT(COMM.id) AS commentsCount';
            sql += ' FROM article A';
            sql += ' INNER JOIN `user` U on A.userId = U.id ';
            sql += ' LEFT JOIN `category` CAT on A.categoryId = CAT.id';
            sql += ' LEFT JOIN `articleLike` LI on A.id = LI.articleId';
            sql += ' LEFT JOIN `comments` COMM on A.id = COMM.articleId';
            sql += ' LEFT JOIN `category` TAG on A.tagId = TAG.id WHERE 1=1';
            if (params.category) {
                sql += ` AND categoryId = ${params.category}`;
            }
            if (params.tag) {
                sql += ` AND tagId = ${params.tag}`;
            }
            if (params.type) {
                sql += ` AND type = ${params.type}`;
            }
            if (params.sort === 'recommended') {
                sql += ` AND recommended = ${1}`;
            }
                sql += ' GROUP BY ';
                sql += aField;
                sql += uField;
                sql += 'CAT.name,TAG.name, LI.id ,COMM.id ';

            if (params.sort === 'newest') {
                sql += ' ORDER BY creationTime DESC';
            }
            if (params.sort === 'hot') {
                sql += ' ORDER BY likeCount DESC';
            }
            sql += ` limit ${startNum}, ${params.pageSize}`;
            return sql;
        }

        // 获取帖子列表 会员信息表  点赞表  评论表  话题表
        async getPostLists(params) {
            let sql = '';
            const startNum = (params.pageNo - 1) * params.pageSize;
            const aField = ' A.id,A.type,A.recommended,A.title,A.desc,A.cover,A.creationTime,A.details, ';
            const uField = ' U.name,U.company,U.portrait,U.job, ';
            sql += 'SELECT ';
            sql += aField;
            sql += uField;

            sql += ' TOPIC.name as topicName, ';
            sql += ' COUNT(LI.id) AS likeCount, ';
            sql += ' COUNT(COMM.id) AS commentsCount';

            sql += ' FROM article A';
            sql += ' INNER JOIN `user` U on A.userId = U.id ';
            sql += ' LEFT JOIN `articleLike` LI on A.id = LI.articleId';
            sql += ' LEFT JOIN `comments` COMM on A.id = COMM.articleId';
            sql += ' LEFT JOIN `topic` TOPIC on A.topicId = TOPIC.id WHERE 1=1';

            if (params.topicId) {
                sql += ` AND A.topicId = ${params.topicId}`;
            }
            if (params.type) {
                sql += ` AND A.type = ${params.type}`;
            }
            if (params.sort === 'recommended') {
                sql += ` AND recommended = ${1}`;
            }
                sql += ' GROUP BY ';
                sql += aField;
                sql += uField;
                sql += 'TOPIC.name,LI.id ,COMM.id ';

            if (params.sort === 'newest') {
                sql += ' ORDER BY creationTime DESC';
            }
            if (params.sort === 'hot') {
                sql += ' ORDER BY likeCount DESC';
            }
            sql += ` limit ${startNum}, ${params.pageSize}`;
            const lists = await this.app.mysql.query(sql);

            for (let index = 0; index < lists.length; index++) {
                lists[index].atlas = await this.app.mysql.query(`select * from articleAtlas where articleId = ${lists[index].id}`);
            }

            return lists;
        }

        // 新增文章
        async addArticle(params) {
            params.creationTime = new Date();
            const results = await this.app.mysql.insert('article', params);
            return results;
        }

        // 修改文章
        async modifyArticle(params) {
            const results = await this.app.mysql.update('article', params, { where: { id: params.id } });
            return results;
        }

    }

module.exports = ActicleService;
