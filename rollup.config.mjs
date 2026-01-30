import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import * as fs from "fs";
import * as path from "path";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

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
  terser(),
];

// 忽略文件
const externalConfig = [(id) => /\/__expample__|main.tsx/.test(id), "**/node_modules/**"];

const esmOutput = {
  preserveModules: true,
  dir: "dist/es",
  format: "es",
  preserveModulesRoot: "src",
  entryFileNames: (chunkInfo) => {
    if (chunkInfo.name.includes("rollupPluginBabelHelpers")) {
      return "_internal/babel.js";
    }
    if (chunkInfo.name.includes("_virtual")) {
      return chunkInfo.name.replace("_virtual/", "_internal/") + ".js";
    }

    return "[name].js";
  },
};

const cjsOutput = {
  preserveModules: true,
  dir: "dist/lib",
  format: "cjs",
  preserveModulesRoot: "src",
  entryFileNames: (chunkInfo) => {
    if (chunkInfo.name.includes("rollupPluginBabelHelpers")) {
      return "_internal/babel.js";
    }
    if (chunkInfo.name.includes("_virtual")) {
      return chunkInfo.name.replace("_virtual/", "_internal/") + ".js";
    }
    return "[name].js";
  },
};

const umdOutput = {
  format: "umd",
  file: "dist/index.js",
  name: "index",
};

const dtsPlugin = {
  input: [entry, ...componentsEntry],
  output: {
    preserveModules: false,
    dir: "dist/types",
    entryFileNames: (chunkInfo) => {
      const basename = path.basename(chunkInfo.name);
      return basename + ".d.ts";
    },
  },
  plugins: [
    dts(),
    {
      name: "generate-index-dts",
      // buildStart() {}, // 1.打包流程刚开始时触发，用于初始化任务。
      // resolveId() {}, // 2.在模块路径解析时触发，用于自定义模块路径解析。
      // load() {}, // 3.加载模块内容时触发，用于返回模块的代码。
      // transform() {}, // 4.加载模块后，修改模块代码时触发。
      // buildEnd() {}, // 5.打包流程结束时触发（文件未写入磁盘）。
      // generateBundle() {}, // 6.在生成打包文件内容（bundle 对象）时触发，用于修改输出内容。
      // 7.文件写入磁盘后触发，用于操作生成的文件。
      writeBundle() {
        const typesIndexFilePath = path.join("dist", "types", "index.d.ts");
        const typesDir = path.join("dist", "types");
        const indexFilePath = path.join("dist", "index.d.ts");
        // try {
        //   const files = fs.readdirSync(typesDir);
        //   const dtsFiles = files.filter((file) => file.endsWith(".d.ts") && file !== "index.d.ts");
        //   const importStatements = dtsFiles
        //     .map((file) => `export * from "./types/${file.replace(".d.ts", "")}";`)
        //     .join("\n");
        //   fs.writeFileSync(indexFilePath, importStatements);
        //   fs.unlinkSync(typesIndexFilePath);
        // } catch (error) {
        //   console.error("操作失败：", error);
        // }
        // try {
        //   const indexFilePath = path.join("dist", "index.d.ts");
        //   fs.writeFileSync(indexFilePath, 'export * from "./types";');
        // } catch (error) {
        //   console.error("Error generating index.d.ts file:", error);
        // }
        try {
          // 读取 types/index.d.ts 的内容
          const typesIndexContent = fs.readFileSync(typesIndexFilePath, "utf8");
          // 替换路径
          const newContent = typesIndexContent.replace(/\.\//g, "./types/");
          // 将替换后的内容写入 dist/index.d.ts
          fs.writeFileSync(indexFilePath, newContent);
          // 删除 types/index.d.ts
          fs.unlinkSync(typesIndexFilePath);
          console.log("操作完成：已将处理后的内容写入 dist/index.d.ts 并删除 types/index.d.ts");
        } catch (error) {
          console.error("操作失败：", error);
        }
      },
      // closeBundle() {},// 8.打包完全结束后触发，用于清理或关闭资源。
    },
  ],
};

export default () => {
  switch (BABEL_ENV) {
    case "esm":
      return [
        {
          input: [entry, ...componentsEntry],
          output: esmOutput,
          external: externalConfig,
          plugins: commonPlugins,
        },
        dtsPlugin,
      ];
    case "cjs":
      return [
        {
          input: [entry, ...componentsEntry],
          output: cjsOutput,
          external: externalConfig,
          plugins: commonPlugins,
        },
        dtsPlugin,
      ];
    case "umd":
      return [
        {
          input: entry,
          output: umdOutput,
          external: externalConfig,
          plugins: commonPlugins,
        },
        dtsPlugin,
      ];
  }
};
