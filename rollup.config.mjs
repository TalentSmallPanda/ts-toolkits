import * as path from "path";
import * as fs from "fs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

// 入口
const entry = "src/index.ts";
const utilsDir = "src/utils";
const utilsName = fs.readdirSync(path.resolve(utilsDir));
const componentsEntry = utilsName.map((name) => `${utilsDir}/${name}`);
// const enumsDir = "src/enums";
// const enumsName = fs.readdirSync(path.resolve(enumsDir));
// const enumsEntry = enumsName.map((name) => `${enumsDir}/${name}`);

// 环境变量
const isProd = process.env.NODE_ENV === "production";
const BABEL_ENV = process.env.BABEL_ENV;

// Babel配置
const babelOptions = {
  presets: ["@babel/preset-env"],
  extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
  exclude: "**/node_modules/**",
};

// 通用插件
const commonPlugins = [
  peerDepsExternal(),
  resolve(),
  commonjs({ sourceMap: !isProd }),
  typescript(),
  babel(babelOptions),
  json(),
];

// 忽略文件
const externalConfig = [(id) => /\/__expample__|main.tsx/.test(id), "**/node_modules/**"];

// ES Module打包输出
const esmOutput = {
  preserveModules: true,
  // assetFileNames: () => {
  //   return "[name].[ext]";
  // },
  dir: "dist/",
};

const cjsOutput = {
  preserveModules: true,
  dir: "dist/",
  format: "cjs",
};

const umdOutput = {
  format: "umd",
  file: "dist/index.js",
  name: "index",
};

export default () => {
  switch (BABEL_ENV) {
    case "esm":
      return [
        {
          input: [entry, ...componentsEntry],
          output: { ...esmOutput, dir: "dist/", format: "es" },
          external: externalConfig,
          plugins: [...commonPlugins],
        },
        {
          input: [entry, ...componentsEntry],
          output: { ...esmOutput, dir: "dist/type", format: "es" },
          external: externalConfig,
          plugins: [...commonPlugins, dts()],
        },
      ];
    case "csj":
      return [
        {
          input: [entry, ...componentsEntry],
          output: { ...cjsOutput },
          external: externalConfig,
          plugins: [...commonPlugins],
        },
        {
          input: [entry, ...componentsEntry],
          output: { ...cjsOutput, dir: "dist/type" },
          external: externalConfig,
          plugins: [...commonPlugins, dts()],
        },
      ];
    case "umd":
      return [
        {
          input: entry,
          output: umdOutput,
          external: externalConfig,
          plugins: [...commonPlugins, terser()],
        },
        {
          input: [entry, ...componentsEntry],
          output: {
            preserveModules: false, // 关闭 preserveModules
            dir: "dist/type",
            entryFileNames: (chunkInfo) => {
              const basename = path.basename(chunkInfo.name); // 提取文件名并返回
              // if (basename.includes("enum")) {
              //   return basename + ".ts";
              // }
              return basename + ".d.ts";
            },
          },
          external: externalConfig,
          plugins: [...commonPlugins, dts()],
        },
        // {
        //   input: [...enumsEntry],
        //   output: {
        //     preserveModules: false, // 关闭 preserveModules
        //     dir: "dist/enum",
        //     entryFileNames: (chunkInfo) => {
        //       const basename = path.basename(chunkInfo.name); // 提取文件名并返回
        //       return basename + ".ts";
        //     },
        //   },
        //   external: externalConfig,
        //   plugins: [...commonPlugins, dts()],
        // },
      ];
  }
};
