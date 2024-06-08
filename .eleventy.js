const CleanCSS = require("clean-css");
const yaml = require("js-yaml");

/**
 * @template T
 * @typedef {{
 *  [P in keyof T]?:
 *   T[P] extends (infer U)[] ? RecursivePartial<U>[] :
 *   T[P] extends object | undefined ? RecursivePartial<T[P]> :
 *   T[P];
 * }} RecursivePartial<T>
 */

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => RecursivePartial<EleventyReturnValue>}
 */
module.exports = function (config) {
  config.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  config.addDataExtension("yaml", (contents) => yaml.load(contents));

  config.addGlobalData("layout", "base.njk");

  return {
    dir: {
      input: "pages",
      includes: "../layouts",
      data: "../data",
      output: "dist",
    },
  };
};
