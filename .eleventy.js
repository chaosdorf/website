const CleanCSS = require("clean-css");
const yaml = require("js-yaml");
const Image = require("@11ty/eleventy-img");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

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
  config.addPlugin(EleventyHtmlBasePlugin);

  config.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  config.addShortcode("image", async function (src, alt, sizes, style) {
    let metadata = await Image(src, {
      widths: [300, 600],
      formats: ["avif", "jpeg"],
      outputDir: "dist/img",
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      style,
    };

    // You bet we throw an error on a missing alt (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  });

  config.addPassthroughCopy("assets");

  config.addDataExtension("yaml", (contents) => yaml.load(contents));

  config.addGlobalData("layout", "base.njk");

  return {
    dir: {
      input: "pages",
      includes: "../layouts",
      data: "../data",
      output: "dist",
    },
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX,
  };
};
