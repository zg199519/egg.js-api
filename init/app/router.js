'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/home/list', controller.home.list);// 获取内容列表
  router.post('/api/home/bookList', controller.home.bookList);// 获取小册列表
  router.post('/api/home/myBookList', app.middleware.loginAuth(), controller.home.myBookList);// 获取我的小册列表
  router.post('/api/home/myArticleList', app.middleware.loginAuth(), controller.home.myArticleList);// 获取我的文章列表
  router.get('/api/home/articleDetail', controller.home.articleDetail);// 获取文章详情
  router.post('/api/home/addBook', app.middleware.loginAuth(), controller.home.addBook);// 新增小册
  router.post('/api/home/addArticle', app.middleware.loginAuth(), controller.home.addArticle);// 新增文章
  router.post('/api/home/modifyBook', app.middleware.loginAuth(), controller.home.modifyBook);// 修改小册
  router.post('/api/home/modifyArticle', app.middleware.loginAuth(), controller.home.modifyArticle);// 修改文章


  router.get('/api/user/email_send_code', controller.user.emailSendCode);// 会员邮箱激活
  router.post('/api/user/registered', controller.user.registered);// 会员注册接口
  router.post('/api/user/login', controller.user.login);// 会员登录接口
  router.get('/api/user/author_list', controller.user.authorList);// 作者榜单

  router.get('/api/user/info', app.middleware.loginAuth(), controller.user.info);// 查询会员信息
  router.post('/api/user/update_info', app.middleware.loginAuth(), controller.user.updateInfo);// 更新会员信息
  router.get('/api/user/statistical', app.middleware.loginAuth(), controller.user.statistical);// 会员统计信息查询

  router.post('/api/category/list', controller.category.list);// 获取分类列表
  router.get('/api/topic/list', controller.category.topicList);// 获取话题列表

  router.get('/api/advertising/info', controller.advertising.info);// 获取广告

  router.get('/api/activity/list', controller.activity.list);// 获取活动列表

  router.post('/api/file/single_file_upload', controller.base.singleFileUpload);// 单个文件上传


};
