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
  // terser(),
];

// 忽略文件
const externalConfig = [(id) => /\/__expample__|main.tsx/.test(id), "**/node_modules/**"];

const esmOutput = {
  preserveModules: true,
  dir: "dist/",
  format: "es",
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
      // buildEnd() {
      //   try {
      //     const indexFilePath = path.join("dist", "index.d.ts");
      //     fs.writeFileSync(indexFilePath, 'export * from "./types";');
      //   } catch (error) {
      //     console.error("Error generating index.d.ts file:", error);
      //   }
      // },
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
