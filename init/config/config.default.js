/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // config.cluster = {
  //     listen: {
  //       path: '',
  //       port: 8001,
  //       hostname: '0.0.0.0',
  //     },
  // };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1592468161318_555';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 接口前缀
  config.publicUrl = {
    domainPrefix: 'http://127.0.0.1:7001', // 接口请求域名前缀
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
        // host
        host: 'localhost',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '123456',
        // 数据库名
        database: 'blog_dev',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
