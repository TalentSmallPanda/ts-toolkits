import * as path from "path";
import * as fs from "fs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";

// 入口
const entry = "src/index.ts";
const utilsDir = "src/utils";
const utilsName = fs.readdirSync(path.resolve(utilsDir));
const componentsEntry = utilsName.map((name) => `${utilsDir}/${name}`);

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
const externalConfig = [
  (id) => /\/__expample__|main.tsx/.test(id),
  "**/node_modules/**",
];

// ES Module打包输出
const esmOutput = {
  preserveModules: true,
  assetFileNames: () => {
    return "[name].[ext]";
  },
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
  }
};
