/* eslint global-require: 0 */

import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import defaultConfig from './config/babel.js';
// avoid ESLint errors
const logger = console;

function removeReactHmre(presets) {
  const index = presets.indexOf('react-hmre');
  if (index > -1) {
    presets.splice(index, 1);
  }
}

// Tries to load a .babelrc and returns the parsed object if successful
function loadFromPath(babelConfigPath) {
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

export default function (configDir) {
  let babelConfig = loadFromPath(path.resolve(configDir, '.babelrc'));
  let inConfigDir = true;

  if (!babelConfig) {
    babelConfig = loadFromPath('.babelrc');
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
  }

  const finalConfig = babelConfig || defaultConfig;
  finalConfig.plugins = finalConfig.plugins || [];
  finalConfig.plugins.push([
    require.resolve('babel-plugin-react-docgen'),
    { DOC_GEN_COLLECTION_NAME: 'STORYBOOK_REACT_CLASSES' },
  ]);

  return finalConfig;
}
