/* eslint global-require: 0 */

import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';

// avoid ESLint errors
const logger = console;

function removeReactHmre(presets) {
  const index = presets.indexOf('react-hmre');
  if (index > -1) {
    presets.splice(index, 1);
  }
}

// Tries to load a .babelrc and returns the parsed object if successful
function loadBabelConfig(babelConfigPath) {
  let config;
  if (fs.existsSync(babelConfigPath)) {
    const content = fs.readFileSync(babelConfigPath, 'utf-8');
    try {
      config = JSON5.parse(content);
      config.babelrc = false;
      logger.info('=> Loading custom .babelrc');
    } catch (e) {
      logger.error(`=> Error parsing .babelrc file: ${e.message}`);
      throw e;
    }
  }

  if (!config) return null;

  // Remove react-hmre preset.
  // It causes issues with react-storybook.
  // We don't really need it.
  // Earlier, we fix this by runnign storybook in the production mode.
  // But, that hide some useful debug messages.
  if (config.presets) {
    removeReactHmre(config.presets);
  }

  if (config.env && config.env.development && config.env.development.presets) {
    removeReactHmre(config.env.development.presets);
  }

  return config;
}

// `baseConfig` is a webpack configuration bundled with storybook.
// React Storybook will look in the `configDir` directory
// (inside working directory) if a config path is not provided.
export default function (configType, baseConfig, configDir) {
  const config = baseConfig;

  // Search for a .babelrc in the config directory, then the module root
  // directory. If found, use that to extend webpack configurations.
  let babelConfig = loadBabelConfig(path.resolve(configDir, '.babelrc'));
  let inConfigDir = true;

  if (!babelConfig) {
    babelConfig = loadBabelConfig('.babelrc');
    inConfigDir = false;
  }

  if (babelConfig) {
    // If the custom config uses babel's `extends` clause, then replace it with
    // an absolute path. `extends` will not work unless we do this.
    if (babelConfig.extends) {
      babelConfig.extends = inConfigDir ?
        path.resolve(configDir, babelConfig.extends) :
        path.resolve(babelConfig.extends);
    }
    config.module.loaders[0].query = babelConfig;
  }

  // Check whether a config.js file exists inside the storybook
  // config directory and throw an error if it's not.
  const storybookConfigPath = path.resolve(configDir, 'config.js');
  if (!fs.existsSync(storybookConfigPath)) {
    const err = new Error(`=> Create a storybook config file in "${configDir}/config.js".`);
    throw err;
  }
  config.entry.preview.push(require.resolve(storybookConfigPath));

  // Check whether addons.js file exists inside the storybook.
  // Load the default addons.js file if it's missing.
  const storybookDefaultAddonsPath = path.resolve(__dirname, 'addons.js');
  const storybookCustomAddonsPath = path.resolve(configDir, 'addons.js');
  if (fs.existsSync(storybookCustomAddonsPath)) {
    logger.info('=> Loading custom addons config.');
    config.entry.manager.unshift(storybookCustomAddonsPath);
  } else {
    config.entry.manager.unshift(storybookDefaultAddonsPath);
  }

  // Check whether user has a custom webpack config file and
  // return the (extended) base configuration if it's not available.
  let customConfigPath = path.resolve(configDir, 'webpack.config.js');
  if (!fs.existsSync(customConfigPath)) {
    logger.info('=> Using default webpack setup based on "Create React App".');
    customConfigPath = path.resolve(__dirname, './config/defaults/webpack.config.js');
  }

  const customConfig = require(customConfigPath);

  if (typeof customConfig === 'function') {
    logger.info('=> Loading custom webpack config (full-control mode).');
    return customConfig(config, configType);
  }

  logger.info('=> Loading custom webpack config.');

  customConfig.module = customConfig.module || {};

  return {
    ...customConfig,
    // We'll always load our configurations after the custom config.
    // So, we'll always load the stuff we need.
    ...config,
    // We need to use our and custom plugins.
    plugins: [
      ...config.plugins,
      ...customConfig.plugins || [],
    ],
    module: {
      ...config.module,
      // We need to use our and custom loaders.
      ...customConfig.module,
      loaders: [
        ...config.module.loaders,
        ...customConfig.module.loaders || [],
      ],
    },
  };
}
