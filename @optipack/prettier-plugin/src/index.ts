import {Config, defaultConfig, format} from '@optipack/core';
import {cosmiconfigSync} from 'cosmiconfig';
import {Plugin} from 'prettier';

const {parsers} =
  require('prettier/parser-babel') || require('prettier/parser-babylon');

export function getConfig(pwd?: string): Config {
  const explorer = cosmiconfigSync('optipack');
  const config = explorer.search(pwd)?.config;
  return config ? {...defaultConfig, ...config} : defaultConfig;
}

export const plugin: Plugin = {
  parsers: {
    json: {
      ...parsers.json,
      preprocess(text, options) {
        if (/(^|\\|\/)package.json$/.test(options.filepath))
          return format(text, getConfig(process.cwd()));
        return text;
      },
    },
  },
};
