const path = require('path');

module.exports = () => {
  const localeSubpaths = {};

  const sassOptions = {
    includePaths: [path.join(__dirname, 'assets/scss')],
  };

  const devIndicators = {
    autoPrerender: false,
  };

  const publicRuntimeConfig = {
    localeSubpaths,
  };

  const pageExtensions = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];

  const webpack = cfg => {
    const originalEntry = cfg.entry;
    // eslint-disable-next-line no-param-reassign
    cfg.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js');
      }
      return entries;
    };

    cfg.module.rules.push({
      test: /\.(jpe?g|png|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name]_[hash].[ext]',
        publicPath: `/_next/static/files`,
        outputPath: 'static/files',
      },
    });
    return cfg;
  };

  const env = {
    APP_ENV: (() => process.env.APP_ENV)(),
    APP_MODE: (() => process.env.APP_MODE)(),
    ROOT_URL: (() => process.env.ROOT_URL)(),
    API_URL: (() => process.env.API_URL)(),
    COOKIE_USER_NAME: (() => process.env.COOKIE_USER_NAME)(),
    APP_ID: (() => process.env.APP_ID)(),
    APP_SECRET: (() => process.env.APP_SECRET)(),
    SENTRY_DSN: (() => process.env.SENTRY_DSN)(),
  };

  return {
    publicRuntimeConfig,
    sassOptions,
    devIndicators,
    webpack,
    env,
    pageExtensions,
    swcMinify: true,
    images: {
      disableStaticImages: true,
    },
  };
};
